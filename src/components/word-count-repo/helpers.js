import * as gitApi from '../../core/getApi';
import * as util from '../../core/utilities';
import Path from 'path';
import { wordCount } from '../../core';

const baseURL = 'https://git.door43.org/';

function getWordCounts(treeMap,errcount) {
    let allWords = [];
    let allL1Counts = 0;
    for ( const [k,v] of treeMap.entries() ) {
        let sha = v.sha;
        //let uri = v.url;
        let blob = localStorage.getItem(sha);
        blob = JSON.parse(blob);
        let content;
        try {
            content = atob(blob.content);
        } catch(error) {
            console.error("atob() Error on:",k," is:",error);
            errcount = errcount + 1;
            return errcount;
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
        localStorage.setItem(sha,JSON.stringify(blob));
    }
    let results = wordCount(allWords.join('\n'),"string");
    results.l1count = allL1Counts;
    console.log("Grand Total",results.total)
    return results;
}

async function getBlobs(treeMap,errcount) {
    let data = [];
    for ( const [k,v] of treeMap.entries() ) {
        let sha = v.sha;
        let uri = v.url;
        // test for already fetched
        let x = localStorage.getItem(sha);
        if ( x !== null ) {
            console.log("Already fetched:",sha,uri);
            continue;
        }
        console.log("fetching sha,url",sha,uri)
        try {
            data = await gitApi.getURL({uri});    
        } catch(error) {
            console.error("getBlob() Error on:",k," is:",error);
            errcount = errcount + 1;
            data = null;
            return errcount;
        }
        console.log("get blob:",data);
        localStorage.setItem(sha,JSON.stringify(data));
    }
    return errcount;
}

async function treeRecursion(owner,repo,sha,filterpath,traversalpath,treeMap,errcount) {
    const uri = Path.join('api/v1/repos', owner, repo, 'git/trees', sha);
    let result;
    try {
        result = await fetch(baseURL+uri);
    } catch(error) {
        console.error("treeRecursion() Error",error);
        errcount = errcount + 1;
        return errcount;
    }
    let _tree = await result.json();
    let tree  = _tree.tree;
    for ( let i=0; i < tree.length; i++ ) {
        let tpath = tree[i].path;
        traversalpath.push(tpath)
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
    return errcount;
}

export async function fetchWordCountRepo({ url }) 
{
    if ( ! url.startsWith(baseURL) ) {
        return "URL must begin with "+baseURL;
    }
    let errcount = 0;
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
    console.log("owner=",owner, ownerEnd); 
    console.log("repo =",repo, repoEnd);
    console.log("pathfilter =",pathfilter);

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
    errcount += await treeRecursion(owner,repo,sha,pathfilter,traversalpath,treeMap,errcount);
    console.log("treeMap",treeMap)
    // Step 2. Fetch all the identified files
    errcount += await getBlobs(treeMap, errcount);
    // Step 3. Do word counts on each identified file and grand totals
    let grandTotals = getWordCounts(treeMap, errcount);
    console.log("Number of errors",errcount);
    let results = {};
    results.grandTotals = grandTotals;
    results.treeMap     = util.map_to_obj(treeMap);
    return results;
}
