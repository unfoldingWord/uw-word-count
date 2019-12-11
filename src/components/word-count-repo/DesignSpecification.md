# Design Specification for the Repo Word Count Component

## Requirements

Original requirements were given [here](https://github.com/unfoldingWord/uw-word-count/issues/2). In brief:

- This component should accept a DCS repository and generate a word count for that project. 
- Examples that should work:
  - https://git.door43.org/unfoldingWord/en_tn/
  - https://git.door43.org/unfoldingWord/en_ta/
- Input can be a URL.

*This was refined to be:*

- Allow the input URL to be any URL, not just to the repo. Thus these would be allowed:

```
https://git.door43.org/unfoldingWord/en_ta/
https://git.door43.org/unfoldingWord/en_ta/translate
https://git.door43.org/unfoldingWord/en_ta/translate/figs-metaphor
https://git.door43.org/unfoldingWord/en_ta/translate/figs-metaphor/01.md
```

These would be rules:

- If the URL is to the repo, then the resource type would be used to qualify what is counted. For example for en_ta, only the folder translate would be counted. The other folders would be ignored.
- If the URL is to a folder within a repo, then the folder would be recursively processed and each "qualifying" file type counted.
- A "qualifying" file type is one that has the expected extension for the type of resource.
  - UTA, UTW: type is ".md"
  - ULT, UST, and Original Language type is ".usfm"
  - UTN is ".tsv" and only column 8 (? confirm)
  - OBS looks like ".md"; possibly the other OBS resources are too?

Finally, the URLs will be constrained to point to DCS repos owned by `unfoldingWord`.


## Specification

*Input*: a URL

There are three cases to handle:

1. the URL points to an entire repo
2. the URL points to a folder within a repo
3. the URL points to a file within a repo

### Validation of URL

**Part 1** Validate DCS and `unfoldingWord` ownership

The first step is to validate the URL. Given the owner constraint, we can simply test that the URL begins with:
`https://git.door43.org/unfoldingWord/`


**Part 2** Validate the repo

The second step is to validate the repo exists. This may be done using
the `branches` Gitea API. For example, if the repo is `en_tq`, here is
the transcript:

```
$ curl -X GET "https://git.door43.org/api/v1/repos/unfoldingword/en_tq/branches" -H "accept: application/json"
[
  {
    "name": "master",
    "commit": {
      "id": "2f88d4faca2dd39fe87a4c98dd1a5fdf82cea5b3",
      "message": "Updated Jonah questions to ULT (#24)\n",
      "url": "https://git.door43.org/unfoldingWord/en_tq/commit/2f88d4faca2dd39fe87a4c98dd1a5fdf82cea5b3",

... elided ...

  }
]
```

Whereas an invalid repo yields:

```
{"documentation_url":"https://git.door43.org/api/swagger","errors":null,"message":"Not Found"}
```

The valid return includes the commit hash of the master branch, which will be used in the following.

**Part 3** Validate the path

The last step is to validate the path, if one is provided. This is done by using the Giteas `trees` API. 

Below is a transcript. Note the use of the commit hash as part of the GET.

```sh
$ curl -X GET "https://git.door43.org/api/v1/repos/unfoldingword/en_tq/git/trees/2f88d4faca2dd39fe87a4c98dd1a5fdf82cea5b3?recursive=true&per-page=100000" -H "accept: application/json"
```
With output:
```json
{
    "sha": "2f88d4faca2dd39fe87a4c98dd1a5fdf82cea5b3",
    "url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tq/git/trees/2f88d4faca2dd39fe87a4c98dd1a5fdf82cea5b3",
    "tree": [

... elided

        {
            "path": "1ch",
            "mode": "040000",
            "type": "tree",
            "size": 0,
            "sha": "d2064853752551520b2e311e2a16bdd6f0377af3",
            "url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tq/git/trees/d2064853752551520b2e311e2a16bdd6f0377af3"
        },
        {
            "path": "1ch/01",
            "mode": "040000",
            "type": "tree",
            "size": 0,
            "sha": "2dc88d9f269dad15c6d6f7ade4995ad9132bcabd",
            "url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tq/git/trees/2dc88d9f269dad15c6d6f7ade4995ad9132bcabd"
        },
        {
            "path": "1ch/01/10.md",
            "mode": "100644",
            "type": "blob",
            "size": 95,
            "sha": "5f5c3c7cd4febb27e9be7b10b9033f067511af35",
            "url": "https://git.door43.org/api/v1/repos/unfoldingWord/en_tq/git/blobs/5f5c3c7cd4febb27e9be7b10b9033f067511af35"
        },

... elided ...
```

The path provided must be a path in the `trees` result. If not found, then a suitable error message is shown.

### Case 1: URL points to repo

In this case, the `trees` result will have all the files needed to fetch and do the word counts.

Some resource types in the repos have special root folders that have the content that should be counted. In particular:

- `uta`: the content folder is `/translate`

If only the repo is provided and the content is in a folder, then only that folder will be fetched and counted.

Furthermore, each resource type has a document authoring format. For example, Markdown `.md` is used for UTQ. Thus only Markdown files will be fetched and counted.

All files must be fetched and the text aggregated for subsequent counting.
The fetching and counting process is explained in more detail below.

### Case 2: URL points to a folder in a repo

In this case, all files below the folder provided will be fetched and counted. In the `trees` example above, if the user provided a path of `1ch/01`, then the following files would be fetched:

- `10.md` 
- `19.md` (not shown)
- `43.md` (not shown)

The `trees` output includes the URL to fetch as well. For `10.md` the URL is
`https://git.door43.org/api/v1/repos/unfoldingWord/en_tq/git/blobs/5f5c3c7cd4febb27e9be7b10b9033f067511af35`

This returns the file in a JSON object:

```json
{
    "content":"IyBXaG8gd2FzIHRoZSBmaXJzdCBjb25xdWVyb3Igb24gdGhlIGVhcnRoPwoKTmltcm9kLCB0aGUgc29uIG9mIEN1c2gsIHdhcyB0aGUgZmlyc3QgY29ucXVlcm9yLiA=",
    "encoding":"base64","url":"https://git.door43.org/api/v1/repos/unfoldingWord/en_tq/git/blobs/5f5c3c7cd4febb27e9be7b10b9033f067511af35",
    "sha":"5f5c3c7cd4febb27e9be7b10b9033f067511af35",
    "size":95
}
```

The `content` property contains the file in a base64-encoded form. Decoded the file is a small Markdown document:

```
# Who was the first conqueror on the earth?

Nimrod, the son of Cush, was the first conqueror. 
```

All files must be fetched and the text aggregated for subsequent counting.

### Case 3: URL points to a file

The case for an individual file is a subset of the above.

## Caching Strategy

The "cache" will be either `localStorage` or `sessionStorage`. The cache will be consulted before a file is fetched to see if it is already present. If so, the file will be returned from cache instead of fetching.

The process to maintain the cache is as follows. The word "store" is used to describe storage in either `localStorage` or `sessionStorage`. 

- Store the `trees` output with a key being the name of the repo.
- If repo commit hash is not current (from the `branches` API) or the `trees` data for the repo doesn't exist, then fetch the tree.
- Store all files using the SHA as the key.
- If the SHA is present in storage return stored copy; otherwise fetch the data, then store.


