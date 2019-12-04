## Word Count Sandbox

This non-component function can also have a playground to test it out.

```js
import * as wc from './uw-word-count.js';

const text  = "Peace on Earth, good will to men";
const result = wc.wordCount(text);
<>
Total: {result.total}<br/>
Distinct: {result.distinct}
</>
```