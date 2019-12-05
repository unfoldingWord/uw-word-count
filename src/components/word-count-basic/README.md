## Component Description

This component takes a string as input, pre-processes the string, and 
finally counts all the words. Review the source code for all the 
pre-processing that is performed for each format. 

This component also supports an optional format property. The default
is `markdown`. As of this writing, supported formats are:

- `markdown`
- `string`

Support is planned for `usfm` and `utn` 
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
