import * as gitApi from '../../core/getApi';
import * as wc from '../../core/uw-word-count';
  
  
export async function fetchWordCountRepo({ url }) 
{
    let result;
    const repoTree = gitApi.fetchTree(owner,repo);

    result = repoTree;
    return result;
}
