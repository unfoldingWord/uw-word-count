//import * as gitApi from '../../core/getApi';
import * as util from '../../core/utilities';
import Path from 'path';

const baseURL = 'https://git.door43.org/';
let errcount = 0;

async function treeRecursion(owner,repo,sha,filterpath,traversalpath,treeMap) {
    const uri = Path.join('api/v1/repos', owner, repo, 'git/trees', sha);
    let result;
    try {
        result = await fetch(baseURL+uri);
    } catch(error) {
        console.error("An Error",error);
        errcount = errcount + 1;
        return;
    }
    let _tree = await result.json();
    let tree  = _tree.tree;
    for ( let i=0; i < tree.length; i++ ) {
        let tpath = tree[i].path;
        traversalpath.push(tpath)
        console.log("filter",filterpath,"traversal",traversalpath)
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
            console.log("max=",max,"tsize",tsize);
            let recurseFlag = true;
            for ( let i=0; i < max; i++ ) {
                console.log("compare:",filterpath[i],traversalpath[i])
                if ( filterpath[i] === traversalpath[i] ) continue;
                recurseFlag = false;
                break;
            }
            // if we have a mismatch, then prune by not recursing
            console.log("recurse flag=",recurseFlag)
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
}

export async function fetchWordCountRepo({ url }) 
{
    if ( ! url.startsWith(baseURL) ) {
        return "URL must begin with "+baseURL;
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
    console.log("owner=",owner, ownerEnd); 
    console.log("repo =",repo, repoEnd);
    console.log("pathfilter =",pathfilter);

    let treeMap = new Map();
    await treeRecursion(owner,repo,sha,pathfilter,traversalpath,treeMap);
    return util.map_to_obj(treeMap);
}


/* Code graveyard

    let owner = 'unfoldingword';
    let repo  = 'en_ugl';
    const repoTree = await gitApi.recursiveTree({
        username: owner,
        repository: repo,
        path: '/',
        sha: 'master'
    });


*/