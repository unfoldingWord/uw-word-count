//import * as gitApi from '../../core/getApi';
//import * as wc from '../../core/uw-word-count';
import Path from 'path';

const baseURL = 'https://git.door43.org/';
let errcount = 0;

async function treeRecursion(owner,repo,sha,filter,path,treeMap) {
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
        if ( filter !== '' ) {
            if ( path === '' ) {
                if ( ! tpath.startsWith(filter) ) continue;                
            } else {
                if ( ! path.startsWith(filter) ) continue;
            }
        }
        if (tree[i].type === 'tree') {
            let nextpath = tpath;
            if ( path !== '' ) {
                nextpath = path+'/'+tpath;
            }
            await treeRecursion(owner,repo,
                tree[i].sha,
                filter,
                nextpath,
                treeMap
            );
            continue;
        }
        let mkey = path+'/'+tpath;
        if ( path === '' ) {
            mkey = tpath
        }
        console.log("Key is:", mkey);
        treeMap.set(mkey,tree[i])
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
    let path            = ownerRepoPath.substring(repoEnd+1);
    if (repoEnd === -1 ) {
        repo = ownerRepoPath.substring(ownerEnd+1);
        path = ''
    }
    const sha           = 'master';
    console.log("owner=",owner, ownerEnd); 
    console.log("repo =",repo, repoEnd);
    console.log("path =",path);

    let treeMap = new Map();
    await treeRecursion(owner,repo,sha,path,'',treeMap);

    return treeMap.size;
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