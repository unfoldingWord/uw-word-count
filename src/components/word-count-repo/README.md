
### Example

This is a component that counts the words for an entire repo or some subset.

#### Case 1 - an entire repo

```js
<WordCountRepo url='https://git.door43.org/cecil.new/word-count-test-repo' />
```

#### Case 2 - to a folder within a repo

To a folder in a repo.

```js
<WordCountRepo url='https://git.door43.org/cecil.new/word-count-test-repo/folder2' />
```

#### Case 3 - to a file within a repo

To a file in a repo.

Performance notes for: https://git.door43.org/unfoldingword/en_ugl/content
- treeRecursion() at  1578143924122 -- 15.6m
- getBlobs()      at  1578144861461 --  4.4s (cached); 11m30s (no cached)
- getWordCounts() at  1578144865890 -- 49.7s
- Done            at  1578144915682 


```js
<WordCountRepo url='https://git.door43.org/cecil.new/word-count-test-repo/README.md' />
```

#### Case 4 - to an invalid repo

To a non-existent repo.

```js
<WordCountRepo url='https://git.door43.org/thisisnotvalid' />
```

#### Case 5 - to an invalid file or folder within a repo

To a non-existent file or folder.

```js
<WordCountRepo url='https://git.door43.org/cecil.new/CurrentState/notafile' />
```
