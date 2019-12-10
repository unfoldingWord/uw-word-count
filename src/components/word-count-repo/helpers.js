import * as gitApi from '../../../core/gitApi';
import * as wc from '../../../core/wordCounts';
import {chaptersInBook} from '../../../core/chaptersAndVerses';

export async function fetchBookPackageTq({
bookId,
chapters,
languageId,
}) 
{
    let sumtotals = {"distinct":0, "total":0, "l1count":0};
    let grandtext = "";
    const chaparray = chapters.split(",");
    // Create the path to the repo
    // begin with chapter 1 to get the plumbing working
    const repo = languageId + "_tq";
    const numchapters = chaptersInBook(bookId);
    const slash = "/";
    const mdext = ".md";
    //console.log("Number of chapters in book:",numchapters.length);
    for (var i = 0; i < numchapters.length; i++) {
        let ch = ""+(i+1);
        if ( chapters === "" ) {
            chapters = "0";
        }
        if ( chapters !== "0" ) {
            if ( ! chaparray.includes(ch) ) {
                continue;
            }
        }
        if ( i+1 < 10 ) {
            ch = "0"+ch;
        } 
        let numverses = numchapters[i];
        //console.log("Verses in chapter:",numverses);
        for (var j = 0; j <= numverses; j++) {
            let vrs = ""+(j+1);
            if ( j+1 < 10 ) {
                vrs = "0"+vrs;
            }
            let repo_path = slash + bookId + slash + ch + slash + vrs + mdext;
            //console.log("Path:",repo_path);
            let _tq = [];
            try {
                _tq = await gitApi.getFile(
                    {username: 'unfoldingword', 
                    repository: repo, 
                    path: repo_path, 
                    branch: 'master',
                });    
            } catch(error) {
                _tq = null;
            }
            if ( _tq == null) {
                continue;
            }
            let vcounts = wc.wordCount(_tq);
            grandtext = grandtext + " " + vcounts.allWords.join(" ");
            sumtotals.l1count  = sumtotals.l1count + vcounts.l1count;           
            sumtotals.total    = sumtotals.total + vcounts.total;
        }
    }
    let vcounts = wc.wordCount(grandtext);
    sumtotals.distinct = vcounts.distinct;
    localStorage.setItem('utq-'+bookId,JSON.stringify(vcounts.wordFrequency))
    return sumtotals;
}
