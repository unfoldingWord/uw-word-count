
### Example

This is a component that counts the words for an entire repo or some subset.

#### Case 1 - an entire repo

If the repo has a special content folder, then the request will be directed automatically to the content folder. For example, UTA has a content folder named `translate`. Thus the repo URL below will count the files only within that folder. Which makes this example and the next one identical.

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

Harder case: https://git.door43.org/unfoldingword/en_ugl/content/G00010

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
