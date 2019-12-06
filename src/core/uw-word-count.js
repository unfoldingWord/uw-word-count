//import usfmjs from 'usfm-js';
import * as util from './utilities';

/*
function process_tags(v3,words,level) {
    for (var j=0; j < v3.length; j++) {
        let children_map = util.obj_to_map(v3[j]);
        if ( children_map.get("type") === "word" ) {
            let thisword = children_map.get("text");
            words.push(thisword.toLowerCase());
            continue;
        }
        let children = children_map.get("children");
        if ( children !== undefined ) {
            // Ok, we have a lower level list of children properties
            // we recurse to pick them up
            process_tags(children,words,level+1);
        }
    }
}

// get words from USFM format
function getUsfmWords(usfm) {
    // first convert to JSON
    const json = usfmjs.toJSON(usfm);
    const chapters = json.chapters;
    let book_map = util.obj_to_map(chapters);
    let words = [];

    for (var [k,v] of book_map.entries()) {
        // the value is a verses object 
        // where key is verse number
        // and value is an array of verse objects
        var verses_map = util.obj_to_map(v);
        for (var v1 of verses_map.values()) {
            // the value is a set of tags for each object in a verse
            var verse_map = util.obj_to_map(v1);
            for (var v2 of verse_map.values()) {
                for (var i=0; i < v2.length; i++) {
                    var verse_obj_map = util.obj_to_map(v2[i]);
                    // unaligned text method
                    if ( verse_obj_map.has("text") ) {
                        words.push(
                            verse_obj_map.get("text").toLowerCase()
                        );
                    }
                    // aligned text method
                    if ( verse_obj_map.get("type") === "word" ) {
                        let thisword = verse_obj_map.get("text");
                        let lowerCaseVal = thisword.toLowerCase();
                        words.push(lowerCaseVal);
                    }
                    for ( var [k3,v3] of verse_obj_map.entries()) {
                        if ( k3 === "children" ) {
                            process_tags(v3,words,1);
                        }
                    }
                }
            }
        }
    }
    // return the array of all words found
    // in the order they were found
    return getWords(words.join('\n'));
}
*/

// Find words in Markdown text
function getMdWords(str) {
    let s = str;
    // replace ellipses with a blank
    s = s.replace(/…/g, ' ')
    // tN occurrence notes (tsv format) have markdown and 
    // use <br> to indicate line breaks.
    s = s.replace(/<br>/g, '\n'); // change <br> to new line character
    // remove all "rc://" URIs (note *? which is non-greedy)
    s = s.replace(/\[\[rc:\/\/.*?\]\]/g, ' ');
    // replace all markdown links with a space
    s = s.replace(/\[.*?\]\(.*?\)/g,' ');
    // remove all XML comments
    s = s.replace(/<!--.*?-->/g, ' ');
    // remove all html tags
    s = s.replace(/<.*?>(.*?)<\/.*?>/g,'$1');
    // handle numbers with colons between them
    s = s.replace(/(\d+):(\d+)/g, '$1_COLON_$2'); 
    // handle numbers with dashes between them
    s = s.replace(/(\d+)-(\d+)/g, '$1_DASH_$2'); 
    // handle decimal numbers 
    // WARNING: the below only works for decimal points (periods)
    s = s.replace(/(\d+)\.(\d+)/g, '$1_DECIMAL_$2');
    // replace commonly used characters adjacent to words with blanks
    // for now: slash and equals
    s = s.replace(/=|\//g,' ');
    // discount the numerals used on an ordered list
    s = s.replace(/^\d+\. |\n\d+\. /g, ' ');
    // remove all non-word and non-space characters
    s = s.replace(/[^\w\s]|_/g, ''); 
    // change all multiple sequences of space to single space
    s = s.replace(/\s+/g, ' '); 
    return s.toLowerCase().match(/\S+/g) || [];
}

// Find words in plain text (no markup)
function getWords(str) {
    let s = str;
    // replace ellipses with a blank
    s = s.replace(/…/g, ' ')
    // handle numbers with colons between them
    s = s.replace(/(\d+):(\d+)/g, '$1_COLON_$2'); 
    // handle numbers with dashes between them
    s = s.replace(/(\d+)-(\d+)/g, '$1_DASH_$2'); 
    // handle decimal numbers 
    // WARNING: the below only works for decimal points (periods)
    s = s.replace(/(\d+)\.(\d+)/g, '$1_DECIMAL_$2');
    // replace commonly used characters adjacent to words with blanks
    // for now: slash and equals
    s = s.replace(/=|\//g,' ');
    // remove all non-word and non-space characters
    s = s.replace(/[^\w\s]|_/g, ''); 
    // change all multiple sequences of space to single space
    s = s.replace(/\s+/g, ' '); 
    return s.toLowerCase().match(/\S+/g) || [];
}

// Entry point for counting words
export function wordCount(str,format) {
    // return a object with: 
    // Total word count and distinct word count
    // List of all the words in textual source order
    // A word frequency map
    // A count of all Markdown Level 1 headings
    // A list of valid formats
    // An `isValidType` equal false if invalid type is passed
    // If an invalid type, then a list of valid types is returned.


    // default type is Markdown
    const validFormats = ['markdown', 'string', 'usfm']
    let sformat = format;
    if ( sformat === undefined || sformat === '' ) {
        sformat = "markdown"
    }

    let counts = {};
    counts["isValidFormat"] = true;
    counts["validFormats"]  = validFormats.join(',');

    let allWords = [];
    let isTypeValid = false;
    for (let i=0; i < validFormats.length; i++) {
        if ( sformat === validFormats[i] ) {
            isTypeValid = true;
            break;
        }
    }
    if ( !isTypeValid ) {
        counts["isValidFormat"] = false;
        return counts;
    }

    if ( sformat === 'markdown' ) {
        allWords = getMdWords(str);
    } else if (sformat === 'string' ) {
        allWords = getWords(str);
    } else if (sformat === 'usfm' ) {
        //allWords = getUsfmWords(str);
    }

    counts["total"] = allWords.length;
    counts["distinct"] = [...new Set(allWords)].length;
    let l1count = str.trim().replace(/<br>/g, '\n').match(/^# |\n# /g) || [];
    counts["l1count"] = l1count.length;
    counts["allWords"] = allWords;
    let wordFrequency_map = new Map();
    for ( let i=0; i < allWords.length; i++ ) {
        let w = wordFrequency_map.get(allWords[i]);
        if ( w === undefined ) { w = 0; }
        w += 1;
        wordFrequency_map.set(allWords[i],w);
    }
    let wordFrequency = util.map_to_obj(wordFrequency_map);
    counts["wordFrequency"] = wordFrequency;
    return counts;
}

