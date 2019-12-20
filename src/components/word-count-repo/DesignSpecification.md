# Design Specification for the Repo Word Count Component

## Specification using Gitea+Zip



## Specification using Gitea trees API

**Note: the Gitea trees API has a bug and does not work**

*Input*: a URL

There are three cases to handle:

1. the URL points to an entire repo
2. the URL points to a folder within a repo
3. the URL points to a file within a repo

### Validation of URL

**Part 1** Validate DCS and `unfoldingWord` ownership

The first step is to validate the URL. Given the owner constraint, we can simply test that the URL begins with:
`https://git.door43.org/`.
The URL scheme (`https://`) is not required.

**Part 2** Validate the repo and path

First parse the URL to obtain the owner and repo names.

Form the URL to make a `trees` API call (see `curl` below) for the master branch.

An invalid repo yields:

```
{"documentation_url":"https://git.door43.org/api/swagger","errors":null,"message":"Not Found"}
```

A valid repo returns as shown below.

```sh
$ curl -X GET "https://git.door43.org/api/v1/repos/unfoldingword/en_tq/git/trees/master?recursive=true&per-page=100000" -H "accept: application/json"
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

The input path provided must be a path in the `trees` result. If not found, then a suitable error message is shown.

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

The `content` property contains the file in a base64-encoded form. Decoded, the file is a small Markdown document:

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
- Store all blobs/files using the SHA as the key.
- If the SHA is present in storage return stored copy; otherwise fetch the data, then store.

## Detailed Logic

This section showd at a high level
the logic used to identify, fetch, count, and display results.

Here is a concise statement:

1. Extract the owner/repo from input URL 
2. Use trees API on the repo (call this the repo tree)
3. Validate the input URL against the repo tree
4. While validating collect all matching URLs that need to be fetched/counted
5. Fetch all the URLs and ...
6. Store all the content somewhere so it can be aggregated later for the totals
7. Once all content is retrieved, iterate over it, saving somewhere for display both the totals across all matching content and per-file totals 
8. Finally, using computed results, display in UI

### Identify

- Input: from the UI a URL to a `git.door43.org` repository.
- Output: an array of document blob URLs for qualifying blobs
  - Note 1: the array must actually be an object containg the blob URL and the path, which is needed for display of results in the UI

Processing: of URL to find all qualifying documents.

1. Isolate the owner and repo elements from the URL.
1. Use the `branches` Gitea API to obtain repo information about the master branch.
1. If not a valid owner or repo, return error message.
1. Extract the master branch commit id: `[0].commit.id`
1. If storage does not have an item named by the commit id, then:
    1. Use the Gitea `trees` API to fetch the repo content metadata
    1. Store the result using the id as the item key
1. If URL points to entire repo, return all blob URLs for type `blobs` in an array
1. If URL points to a path, return all matches on path. The returned array is, as above, all the blob URLs for type blobs
1. If no matches found return an empty array

### Fetch and Count

- Input: array of path and blob URLs to fetch and count
- Output:
  - if error encountered, return error message
  - array of path and SHAs

Processing: storage of all documents with counts added.

1. Iterate thru the array fetching all file blobs
2. Decode each blob to extract the content to count
3. Do a word count on the content
4. Add the word count properties to the content blob and re-store


### Display

- Input: array of objects containing path and SHA
- Output: display of totals and per-file counts

Processing: display of counts

1. Iterate thru all files (using SHA as item key in storage), aggregating all text
2. Do a word count on aggregated text
3. Show the word count totals
4. Show per-file word count details


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

Finally, the URLs will be constrained to point to any DCS repo; in other
words the URL must begin with `git.door43.org`
