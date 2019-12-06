# Journal

## 2019-12-06

Began working on `yarn publish` problem:

```
$ yarn publish
yarn publish v1.19.2
[1/4] Bumping version...
info Current version: 0.0.1
question New version:
[2/4] Logging in...
info npm username: mandolyte
info npm email: cecil.new@gmail.com
question npm password:
success Logged in.
[3/4] Publishing...
$ rm -fr ./dist & babel ./src --out-dir ./dist -s inline
/bin/sh: 1: babel: not found
error Command failed with exit code 127.
info Visit https://yarnpkg.com/en/docs/cli/publish for documentation about this command.
$
```

1. I began by backing out all changes before implementing USFM support.
    1. Had a lot of compile errors, which I fixed by commenting out this line in babel.config.js
    ```
    				useBuiltIns: 'usage',
    ```
    That seemed to work, but then I was unable to publish (see error above)
1. Then I made sure that `yarn start` worked ok.
1. Then pushed changes
1. Retry publish -- had same error. Thus not related to my USFM support.
1. Compared working `package.json` files. Found one line missing that looked relevant:
```
    "@babel/cli": "^7.4.3",
```
1. So I put my USFM support back in. Added above line it with the one needed for usfm-js. Then re-ran `yarn` to fetch dependencies.
1. Ran `yarn start` to be sure everything was working again. Failed to compile. Below are just the first few errors. It generates many more.
```
 FAIL  Failed to compile

./src/core/utilities.js
Module not found: Can't resolve 'core-js/modules/es.array.for-each' in 'C:\Users
\mando\Projects\unfoldingWord\uw-word-count\src\core'
./src/components/word-count-basic/WordCountBasic.js
Module not found: Can't resolve 'core-js/modules/es.array.from' in 'C:\Users\man
do\Projects\unfoldingWord\uw-word-count\src\components\word-count-basic'
./src/core/uw-word-count.js
Module not found: Can't resolve 'core-js/modules/es.array.from' in 'C:\Users\man
do\Projects\unfoldingWord\uw-word-count\src\core'
```