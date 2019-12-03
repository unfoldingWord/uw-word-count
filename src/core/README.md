## greetName({name})

This non-component function can also have a playground to test it out.

Styleguidist has determined rendering a props table for non-components is out of scope for them.
I'm too lazy to render my own let alone expect it to be maintained.
https://github.com/styleguidist/react-styleguidist/issues/1218

```js
import * from './uw-word-count.js';

const text  = "Peace on Earth, good will to men";
const total = wordCount({name}).total;

<>{total}</>
```