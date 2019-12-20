
### Example

This is a component that counts the words for an entire repo or some subset.

#### Case 1 - an entire repo

If the repo has a special content folder, then the request will be directed automatically to the content folder. For example, UTA has a content folder named `translate`. Thus the repo URL below will count the files only within that folder. Which makes this example and the next one identical.

```js
<WordCountRepo url='https://git.door43.org/unfoldingWord/en_ta/' />
```

#### Case 2 - to a folder within a repo

To a folder in a repo, in this case, `/translate`.

```txt
<WordCountRepo url='https://git.door43.org/unfoldingWord/en_ta/translate' />
```

#### Case 3 - to a file within a repo

To a file in a repo, in this case, `/translate/figs-metaphor/01.md`.

```txt
<WordCountRepo url='https://git.door43.org/unfoldingWord/en_ta/translate/figs-metaphor/01.md' />
```

