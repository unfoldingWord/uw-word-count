## Component Description

This component takes a string as input, pre-processes the string, and 
finally counts all the words. Review the source code for all the 
pre-processing that is performed for each format. 

This component also supports an optional format property. The default
is `markdown`. As of this writing, supported formats are:

- `markdown`
- `string`
- `usfm`

Support is planned for `utn` 
(a Tab Separated Value (TSV) format used for translation notes).

Here are selected pre-processing examples for Markdown:
- All links, image refs, embedded HTML are removed.
- In order to treat Scripture references (3:16), time (4:00), 
and floating point numbers as one "word", the colon and periods are changed
to text: "colon", "dash", and "decimal".
- The numbers for ordered lists are removed.
- All remaining non-word and non-space characters are removed.
- Consecutive runs of spaces are reduced to a single space.
- All letters are lower-cased.

After this processing, the following reqular expression is used to 
match all consecutive runs of non-space characters and placed into an array.
These are the words captured by this algorithm.

```md
    return s.toLowerCase().match(/\S+/g) || [];
```

The length of the array is the total number of words found.
Note that the order of words is the same as in the input string.

This function returns an object with the following attributes:

- `total`: the total number of words (or length of the array)
- `distinct`: the number of unique words
- `allWords`: the array/list of words found
- `wordFrequency`: an object listing the words and occurences of each word
- `l1count`: the number of Markdown Level 1 headings
- `validFormats`: list of supported formats
- `isValidFormat`: a Boolean indicating whether the passed format is supported

## Examples

### Simple Example

The first example is a simple text string.

```js
<WordCountBasic format='string'>
To be or not to be.
</WordCountBasic>
```

### Markdown Example

Note that in order to preserve line endings, the text must be wrapped in a JavaScript raw string (backticks) which must be wrapped in curly braces
to make it an expression.

```js
<WordCountBasic format='markdown'>
{`
# Heading 1

## Heading 2

this is a scripture reference: John 3:16-18.

this is a measurement 3.16 meters

this is time of day 3:18

## Heading 2

An Image reference:
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")

A URL:
[www.google.com](www.google.com)

# Heading 1

## Heading 2

- test
- test
* test
* test

1. test
2. test
3. test
4. test


*this is a test*

_this is a test_

**this is a test**

__this is a test__
`}
</WordCountBasic>
```

### USFM Example

The first two verses of the Book Jude are used for this example.

```js
<WordCountBasic format='usfm'>
\id JUD EN_ULT en_English_ltr Thu Jun 13 2019 11:54:01 GMT-0400 (EDT) tc
\usfm 3.0
\ide UTF-8
\h Jude
\toc1 The Letter of Jude
\toc2 Jude
\toc3 Jud
\mt Jude
\s5
\c 1
\p 
\v 1 \zaln-s | x-strong="G24550" x-lemma="Ἰούδας" x-morph="Gr,N,,,,,NMS," x-occurrence="1" x-occurrences="1" x-content="Ἰούδας"\*\w Jude|x-occurrence="1" x-occurrences="1"\w*\zaln-e\*,
\zaln-s | x-strong="G14010" x-lemma="δοῦλος" x-morph="Gr,N,,,,,NMS," x-occurrence="1" x-occurrences="1" x-content="δοῦλος"\*\w a|x-occurrence="1" x-occurrences="1"\w*
\w servant|x-occurrence="1" x-occurrences="1"\w*\zaln-e\*
\zaln-s | x-strong="G24240" x-lemma="Ἰησοῦς" x-morph="Gr,N,,,,,GMS," x-occurrence="1" x-occurrences="2" x-content="Ἰησοῦ"\*\w of|x-occurrence="1" x-occurrences="2"\w*
\w Jesus|x-occurrence="1" x-occurrences="2"\w*\zaln-e\*
\zaln-s | x-strong="G55470" x-lemma="χριστός" x-morph="Gr,N,,,,,GMS," x-occurrence="1" x-occurrences="1" x-content="Χριστοῦ"\*\w Christ|x-occurrence="1" x-occurrences="2"\w*\zaln-e\*,
\zaln-s | x-strong="G11610" x-lemma="δέ" x-morph="Gr,CC,,,,,,,," x-occurrence="1" x-occurrences="1" x-content="δὲ"\*\w and|x-occurrence="1" x-occurrences="2"\w*\zaln-e\*
\zaln-s | x-strong="G00800" x-lemma="ἀδελφός" x-morph="Gr,N,,,,,NMS," x-occurrence="1" x-occurrences="1" x-content="ἀδελφὸς"\*\w brother|x-occurrence="1" x-occurrences="1"\w*\zaln-e\*
\zaln-s | x-strong="G23850" x-lemma="Ἰάκωβος" x-morph="Gr,N,,,,,GMS," x-occurrence="1" x-occurrences="1" x-content="Ἰακώβου"\*\w of|x-occurrence="2" x-occurrences="2"\w*
\w James|x-occurrence="1" x-occurrences="1"\w*\zaln-e\*,
\zaln-s | x-strong="G35880" x-lemma="ὁ" x-morph="Gr,RD,,,,DMP," x-occurrence="1" x-occurrences="1" x-content="τοῖς"\*\w to|x-occurrence="1" x-occurrences="1"\w*
\w those|x-occurrence="1" x-occurrences="1"\w*\zaln-e\*
\zaln-s | x-strong="G28220" x-lemma="κλητός" x-morph="Gr,NS,,,,DMP," x-occurrence="1" x-occurrences="1" x-content="κλητοῖς"\*\w who|x-occurrence="1" x-occurrences="1"\w*
\w are|x-occurrence="1" x-occurrences="1"\w*
\w called|x-occurrence="1" x-occurrences="1"\w*\zaln-e\*,
\zaln-s | x-strong="G00250" x-lemma="ἀγαπάω" x-morph="Gr,V,PEP,DMP," x-occurrence="1" x-occurrences="1" x-content="ἠγαπημένοις"\*\w beloved|x-occurrence="1" x-occurrences="1"\w*\zaln-e\*
\zaln-s | x-strong="G17220" x-lemma="ἐν" x-morph="Gr,P,,,,,D,,," x-occurrence="1" x-occurrences="1" x-content="ἐν"\*\w in|x-occurrence="1" x-occurrences="1"\w*\zaln-e\*
\zaln-s | x-strong="G23160" x-lemma="θεός" x-morph="Gr,N,,,,,DMS," x-occurrence="1" x-occurrences="1" x-content="Θεῷ"\*\w God|x-occurrence="1" x-occurrences="1"\w*\zaln-e\*
\zaln-s | x-strong="G39620" x-lemma="πατήρ" x-morph="Gr,N,,,,,DMS," x-occurrence="1" x-occurrences="1" x-content="Πατρὶ"\*\w the|x-occurrence="1" x-occurrences="1"\w*
\w Father|x-occurrence="1" x-occurrences="1"\w*\zaln-e\*,
\zaln-s | x-strong="G25320" x-lemma="καί" x-morph="Gr,CC,,,,,,,," x-occurrence="1" x-occurrences="1" x-content="καὶ"\*\w and|x-occurrence="2" x-occurrences="2"\w*\zaln-e\*
\zaln-s | x-strong="G50830" x-lemma="τηρέω" x-morph="Gr,V,PEP,DMP," x-occurrence="1" x-occurrences="1" x-content="τετηρημένοις"\*\w kept|x-occurrence="1" x-occurrences="1"\w*\zaln-e\*
\zaln-s | x-strong="G24240" x-lemma="Ἰησοῦς" x-morph="Gr,N,,,,,DMS," x-occurrence="2" x-occurrences="2" x-content="Ἰησοῦ"\*\w for|x-occurrence="1" x-occurrences="1"\w*
\w Jesus|x-occurrence="2" x-occurrences="2"\w*\zaln-e\*
\zaln-s | x-strong="G55470" x-lemma="χριστός" x-morph="Gr,N,,,,,DMS," x-occurrence="1" x-occurrences="1" x-content="Χριστῷ"\*\w Christ|x-occurrence="2" x-occurrences="2"\w*\zaln-e\*: 
\v 2 \zaln-s | x-strong="G41290" x-lemma="πληθύνω" x-morph="Gr,V,OAP3,,S," x-occurrence="1" x-occurrences="1" x-content="πληθυνθείη"\*\w May|x-occurrence="1" x-occurrences="1"\w*\zaln-e\*
\zaln-s | x-strong="G16560" x-lemma="ἔλεος" x-morph="Gr,N,,,,,NNS," x-occurrence="1" x-occurrences="1" x-content="ἔλεος"\*\w mercy|x-occurrence="1" x-occurrences="1"\w*\zaln-e\*
\zaln-s | x-strong="G25320" x-lemma="καί" x-morph="Gr,CC,,,,,,,," x-occurrence="1" x-occurrences="2" x-content="καὶ"\*\w and|x-occurrence="1" x-occurrences="2"\w*\zaln-e\*
\zaln-s | x-strong="G15150" x-lemma="εἰρήνη" x-morph="Gr,N,,,,,NFS," x-occurrence="1" x-occurrences="1" x-content="εἰρήνη"\*\w peace|x-occurrence="1" x-occurrences="1"\w*\zaln-e\*
\zaln-s | x-strong="G25320" x-lemma="καί" x-morph="Gr,CC,,,,,,,," x-occurrence="2" x-occurrences="2" x-content="καὶ"\*\w and|x-occurrence="2" x-occurrences="2"\w*\zaln-e\*
\zaln-s | x-strong="G00260" x-lemma="ἀγάπη" x-morph="Gr,N,,,,,NFS," x-occurrence="1" x-occurrences="1" x-content="ἀγάπη"\*\w love|x-occurrence="1" x-occurrences="1"\w*\zaln-e\*
\zaln-s | x-strong="G41290" x-lemma="πληθύνω" x-morph="Gr,V,OAP3,,S," x-occurrence="1" x-occurrences="1" x-content="πληθυνθείη"\*\w be|x-occurrence="1" x-occurrences="1"\w*
\w multiplied|x-occurrence="1" x-occurrences="1"\w*\zaln-e\*
\zaln-s | x-strong="G47710" x-lemma="σύ" x-morph="Gr,RP,,,2D,P," x-occurrence="1" x-occurrences="1" x-content="ὑμῖν"\*\w to|x-occurrence="1" x-occurrences="1"\w*
\w you|x-occurrence="1" x-occurrences="1"\w*\zaln-e\*.
</WordCountBasic>
```
