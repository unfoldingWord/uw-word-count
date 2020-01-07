## Component Description

This component takes a string as input, pre-processes the string, and 
finally counts all the words. Review the source code for all the 
pre-processing that is performed for each format. 

This component also supports an optional format property. The default
is `markdown`. As of this writing, supported formats are:

- `markdown`
- `string`
- `usfm`
- `utn` (a tab separated value format)

Here are selected pre-processing examples for Markdown:
- All links, image refs, embedded HTML are removed. *This includes bare URLs; see Markdown example below*
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

The input to the component may be provide in two ways:

- As the value for the attribute `text`
- As the `children` text value between the open and close of the component tag

If both are provided, only the attribute value is taken for counting.

## Examples

### Simple Example

The first example is a simple text string. This example uses the text in the children elements of the component (i.e., between the open and close tags).

```js
<WordCountBasic format='string'>
To be or not to be.
</WordCountBasic>
```

This example uses the attribute `text` to provide the text to word count.

```js
let mytext = `that is the question`;
<WordCountBasic format='string' text={mytext} />
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

https://github.com/

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

### UTN Example

The first two verses of the Titus Translation Notes are used for this example. Note that the Tab Separated Value text must be wrapped in backticks and then wrapped in curly braces.

```js
<WordCountBasic format='utn'>
{`
Book	Chapter	Verse	ID	SupportReference	OrigQuote	Occurrence	GLQuote	OccurrenceNote
TIT	front	intro	m2jl			0		# Introduction to Titus<br><br>## Part 1: General Introduction<br><br>### Outline of the Book of Titus<br><br>1. Paul instructs Titus to appoint godly leaders (1:1-16)<br>1. Paul instructs Titus to train people to live godly lives (2:1-3:11)<br>1. Paul ends by sharing some of his plans and sending greetings to various believers (3:12-15)<br><br>### Who wrote the Book of Titus?<br><br>Paul wrote the Book of Titus. Paul was from the city of Tarsus. He had been known as Saul in his early life. Before becoming a Christian, Paul was a Pharisee. He persecuted Christians. After he became a Christian, he traveled several times throughout the Roman Empire telling people about Jesus.<br><br>### What is the Book of Titus about?<br><br>Paul wrote this letter to Titus, his fellow worker, who was leading the churches on the island of Crete. Paul instructed him about selecting church leaders. Paul also described how the believers should behave towards each other. He also encouraged them all to live in a way that pleases God.<br><br>### How should the title of this book be translated?<br><br>Translators may choose to call this book by its traditional title, ***Titus.*** Or they may choose a clearer title, such as ***Paul’s Letter to Titus*** or ***A Letter to Titus.*** (See: [[rc://en/ta/man/translate/translate-names]])<br><br>## Part 2: Important Religious and Cultural Concepts<br><br>### In what roles can people serve within the church?<br><br>There are some teachings in the Book of Titus about whether a woman or divorced man can serve in positions of leadership within the church. Scholars disagree about the meaning of these teachings. Further study on these issues may be necessary before translating this book.<br><br>## Part 3: Important Translation Issues<br><br>### Singular and plural **you**<br><br>In this book, the word **I** refers to Paul. Also, the word **you** is almost always singular and refers to Titus. The exception to this is 3:15. (See: [[rc://en/ta/man/translate/figs-exclusive]] and [[rc://en/ta/man/translate/figs-you]])<br><br>### What is the meaning of **God our Savior?**<br><br>This is a common phrase in this letter. Paul meant to make the readers think about how God forgave them in Christ for sinning against him, and by forgiving them he saved them from being punished when he judges all people. A similar phrase in this letter is **our great God and Savior Jesus Christ.**
TIT	1	intro	c7me			0		# Titus 01 General Notes<br><br>## Structure and formatting<br><br>Paul formally introduces this letter in verses 1-4. Writers often began letters in this way in the ancient Near East.<br><br>In verses 6-9, Paul lists several qualities that a man must have if he is to be an elder in the church. (See: rc://en/ta/man/translate/figs-abstractnouns) Paul gives a similar list in 1 Timothy 3.<br><br>## Special concepts in this chapter<br><br>### Elders<br><br>The church has used different titles for church leaders. Some titles include overseer, elder, pastor, and bishop.<br><br>## Other possible translation difficulties in this chapter<br><br>### Should, may, must<br><br>The ULT uses different words that indicate requirements or obligations. These verbs have different levels of force associated with them. The subtle differences may be difficult to translate. The UST translates these verbs in a more general way.
TIT	1	1	rtc9		κατὰ πίστιν	1	for the faith	***to strengthen the faith***
TIT	1	1	xyz8	figs-abstractnouns	ἐπίγνωσιν ἀληθείας	1	knowledge of the truth	**knowledge** and **truth** are abstract nouns. See the UST for other ways to express these. Paul wants people to know the true message about God and Christ so that they can belong to God. (See: [[rc://en/ta/man/translate/figs-abstractnouns]])
TIT	1	1	fyf8		τῆς κατ’ εὐσέβειαν	1	that agrees with godliness	***that is suitable for honoring God***
TIT	1	2	xyz9		ἐπ’ ἐλπίδι ζωῆς αἰωνίου	1	with the certain hope of everlasting life	***that gives us the certain hope of everlasting life*** or ***based on our certain hope for everlasting life***
TIT	1	2	r2gj		πρὸ χρόνων αἰωνίων	1	before all the ages of time	***before time began***



`}
</WordCountBasic>
```
