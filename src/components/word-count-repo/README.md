
### Example

This is a component that counts the words for an entire repo or some subset.

To an entire repo, in this case, `en_ta`. If the repo has a special content folder, then the request will be directed automatically to the content folder. For example, UTA has a content folder named `translate`. Thus the repo URL below will count the files only within that folder. Which makes this example and the next one identical.
```js
<WorkCountRepo url='https://git.door43.org/unfoldingWord/en_ta/' />
```


To a folder in a repo, in this case, `/translate`.
```js
<WorkCountRepo url='https://git.door43.org/unfoldingWord/en_ta/translate' />
```


To a file in a repo, in this case, `/translate/figs-metaphor/01.md`.
```js
<WorkCountRepo url='https://git.door43.org/unfoldingWord/en_ta/translate/figs-metaphor/01.md' />
```

