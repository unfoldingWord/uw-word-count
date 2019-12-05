
// function to convert map to object
const map_to_obj = ( mp => {
    const ob = {};
    mp.forEach((v,k) => {ob[k]=v});
    return ob;
});
    

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

// Find words in text
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
    const validFormats = ['markdown', 'string']
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
    let wordFrequency = map_to_obj(wordFrequency_map);
    counts["wordFrequency"] = wordFrequency;
    return counts;
}

