//import * as gitApi from '../../core/getApi';
//import * as wc from '../../core/uw-word-count';
import Path from 'path';

const baseURL = 'https://git.door43.org/';

async function treeRecursion(owner,repo,sha,treeMap) {
    const uri = Path.join('api/v1/repos', owner, repo, 'git/trees', sha);
    let result;
    try {
        result = await fetch(baseURL+uri);
    } catch(error) {
        console.error("An Error",error);
        return;
    }
    let _tree = await result.json();
    let tree  = _tree.tree;
    for ( let i=0; i < tree.length; i++ ) {
        if (tree[i].type === 'tree') {
            treeRecursion(owner,repo,tree[i].sha,treeMap);
            continue;
        }
        treeMap.set(tree[i].path,tree[i])
    }
}

export async function fetchWordCountRepo({ url }) 
{
    console.log("enter fetchWordCountRepo")
    let owner = 'unfoldingword';
    //let repo  = 'el-x-koine_ugnt';
    let repo  = 'en_ugl';
    let sha   = 'master';

    let treeMap = new Map();
    await treeRecursion(owner,repo,sha,treeMap);


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