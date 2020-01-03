import * as gitApi from '../../core/getApi';
import * as util from '../../core/utilities';
import Path from 'path';
import { wordCount } from '../../core';
import localforage from 'localforage';

const baseURL = 'https://git.door43.org/';

const wcstore = localforage.createInstance({
    driver: [localforage.INDEXEDDB],
    name: 'wc-store',
});
  

async function getWordCounts(treeMap) {
    let allWords = [];
    let allL1Counts = 0;
    for ( const [k,v] of treeMap.entries() ) {
        let sha = v.sha;
        //let uri = v.url;
        let blob;
        try {
            blob = await wcstore.getItem(sha);
        } catch (error) {
            const err = "wcstore.getItem() Error:"+error;
            throw new Error(err);
        }
        blob = JSON.parse(blob);
        let content;
        try {
            content = atob(blob.content);
        } catch(error) {
            const err = "atob() Error on:"+k+" is:"+error;
            throw new Error(err);
        }
        let ext = k.split('.').pop();
        let format = "string";
        if ( ext === "md" ) {
            format = "markdown";
        } else if ( ext === "tsv" ) {
            format = "utn";
        } else if ( ext === "usfm" ) {
            format = "usfm";
        }
        let results = wordCount(content,format);
        for (let i=0; i < results.allWords.length; i++) {
            allWords.push(results.allWords[i])
        }
        allL1Counts += results.l1count;
        // now update the blob with word count results
        blob.path          = k;
        blob.total         = results.total;
        blob.distinct      = results.distinct;
        blob.l1count       = results.l1count;
        blob.allWords      = results.allWords;
        blob.wordFrequency = results.wordFrequency;
        try {
            await wcstore.setItem(sha,JSON.stringify(blob));
        } catch (error) {
            const err = "wcstore.setItem() Error:"+error;
            throw new Error(err);
        }
        //console.log(k," Totals:",results.total)
    }
    let results = wordCount(allWords.join('\n'),"string");
    results.l1count = allL1Counts;
    console.log("Grand Total",results.total)
    return results;
}

async function getBlobs(treeMap) {
    let data = [];
    const params = 'per_page=9999'
    for ( const [k,v] of treeMap.entries() ) {
        let sha = v.sha;
        let uri = v.url;
        uri += '?per_page=99999'
        // test for already fetched
        let x;
        try {
            x = await wcstore.getItem(sha);
        } catch (error) {
            const err = "wcstore.getItem() Error:" + error;
            throw new Error(err);
        }
        if ( x !== null ) {
            // already have it - no need to fetch
            continue;
        }
        try {
            data = await gitApi.getURL({uri});    
        } catch(error) {
            const err = "getBlob() Error on:"+k+" is:"+error;
            throw new Error(err);
        }
        try {
            await wcstore.setItem(sha,JSON.stringify(data));
        } catch (error) {
            const err = "wcstore.setItem() Error:"+error;
            throw new Error(err);
        }
    }
}

async function treeRecursion(owner,repo,sha,filterpath,traversalpath,treeMap) {
    const uri = Path.join('api/v1/repos', owner, repo, 'git/trees', sha);
    let result;
    try {
        result = await fetch(baseURL+uri);
    } catch(error) {
        const err = "treeRecursion() Error:"+error;
        console.error(err);
        throw new Error(err);
    }
    let _tree = await result.json();
    let tree  = _tree.tree;
    for ( let i=0; i < tree.length; i++ ) {
        let tpath = tree[i].path;
        traversalpath.push(tpath)
        //console.log("Traversal:",traversalpath.join('/'))
        if ( filterpath !== [] ) {
            // Here we see if the need to prune the tree
            // by only traversing where the user input directs us

            // first get the min of input filter array size
            // and the traversal array size
            let max = filterpath.length;
            if ( max === undefined ) max = 0;
            let tsize = traversalpath.length;
            if ( tsize === undefined ) tsize = 0;
            if ( tsize < max ) {
                max = tsize
            }
            let recurseFlag = true;
            for ( let i=0; i < max; i++ ) {
                if ( filterpath[i] === traversalpath[i] ) continue;
                recurseFlag = false;
                break;
            }
            // if we have a mismatch, then prune by not recursing
            if ( ! recurseFlag ) {
                traversalpath.pop();
                continue;
            };
        }
        if (tree[i].type === 'tree') {
            await treeRecursion(owner,repo,
                tree[i].sha,
                filterpath,
                traversalpath,
                treeMap
            );
            traversalpath.pop();
            continue;
        }
        let mkey = traversalpath.join('/');
        treeMap.set(mkey,tree[i])
        traversalpath.pop();
    }
    if ( treeMap.size === 0 ) {
        const err = "No matching files with provided URL";
        throw new Error(err);
    }
    return;
}

export async function fetchWordCountRepo({ url }) 
{
    if ( ! url.startsWith(baseURL) ) {
        throw new Error("URL must begin with "+baseURL);
    }
    let lengthOfBaseURL = baseURL.length;
    let ownerRepoPath   = url.substring(lengthOfBaseURL);
    let ownerEnd        = ownerRepoPath.indexOf('/');
    let owner           = ownerRepoPath.substring(0,ownerEnd);
    let repoEnd         = ownerRepoPath.indexOf('/',ownerEnd+1);
    let repo            = ownerRepoPath.substring(ownerEnd+1, repoEnd);
    let pathfilter      = ownerRepoPath.substring(repoEnd+1).split('/');
    if (repoEnd === -1 ) {
        repo = ownerRepoPath.substring(ownerEnd+1);
        pathfilter = []
    }
    const sha           = 'master';
    let traversalpath   = [];

    // Step 1. Identify all files that need to be counted
    let treeMap = new Map();
    /*
    The key will be the full path to the file.
    The value will be an object like this:
    {
      "path": "README.md",
      "mode": "100644",
      "type": "blob",
      "size": 498,
      "sha": "a8d3267bda97f7933e8ca2fe416d06f53ed05d77",
      "url": "https://git.door43.org/api/v1/repos/cecil.new/tD-DataRestructure/git/blobs/a8d3267bda97f7933e8ca2fe416d06f53ed05d77"
    }    

    These values are iterated over and all the blobs are fetched, stored and
    the words counted. The word counts are added to the blob and the blob
    stored with the word count values.
    */
    console.log("treeRecursion() at ",Date.now())
    await treeRecursion(owner,repo,sha,pathfilter,traversalpath,treeMap);
    // Step 2. Fetch all the identified files
    console.log("getBlobs() at ",Date.now())
    await getBlobs(treeMap);
    // Step 3. Do word counts on each identified file and grand totals
    console.log("getWordCounts() at ",Date.now())
    let grandTotals = await getWordCounts(treeMap);
    let results = {};
    results.grandTotals = grandTotals;
    results.treeMap     = util.map_to_obj(treeMap);
    console.log("Done at ",Date.now())
    return results;
}
