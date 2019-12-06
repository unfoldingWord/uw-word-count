[![Custom badge](https://img.shields.io/endpoint?color=%2374b9ff&url=https%3A%2F%2Fraw.githubusercontent.com%2unfoldingWord-box3%2Fhello-world-react-component-library%2Fmaster%2Fcoverage%2Fshields.json)]()

# Word Count React Component Library

GH Pages: https://unfoldingword.github.io/uw-word-count/

## The Stack

- Javascript + React (functional components & hooks).
- MaterialUI for UI/UX baseline design components.
- Styleguidist for Playground Documentation.
- Yarn for dependencies, publishing, and deploying.
- Github + NPM + Github Pages for Hosting.
- Cypress for testing

## Functionality and Limitations

See component `README` for details.

# How to install

Once you have this codebase forked and cloned to your local machine, you can start modifying the codebase. You will need to ensure `node.js` and `yarn` are already installed.

### Installation and Running the Styleguide Locally

1. Install the npm dependencies with `yarn`.
1. Run the Styleguide with `yarn start`.
1. Ensure that the Styleguide is running by visiting `localhost:6060` on your web browser. (for Chromebooks see note below)
1. Modify the code and documentation in your code editor and check out the Styleguide.
    - Update the styleguide.config.js to match your new component names.
1. See debug `console.log()` output in browser console -- in chrome, CTRL-SHIFT-J to open.

### Setting up NPM Publishing

1. Rename your library:
    - the folder
    - repo on Github
1. Update the `package.json`:
    - change the `name` and `description` of your app
    - change the URLs of your `homepage` and `repository`
1. Create an account on `npmjs.org` if you don't have one already.

### Publishing to NPM

The scripts in the `package.json` file do all of the heavy lifting.

1. Commit and push all changes to your github repo.
1. Run `yarn publish`:
    - login to NPM using your credentials if asked.
    - enter the new version number using symver.
    - wait for the code to be transpiled and published to NPM.
    - wait for the styleguide to be built and deployed to GHPages.
1. Visit your published library on NPM.
1. Visit your deployed Styleguide on GHPages.

### Deploying Styleguide to GHPages

You can optionally deploy the styleguide to GHPages without publishing to NPM.

1. Run `yarn deploy`
1. There is a `predeploy` hook that builds the Styleguide.
1. That's it!

## Chromebook Linux Beta Notes

Must use `hostname -I` to get the host address. **Neither `localhost` nor `127.0.0.1` will work.**

```
$ hostname -I
100.115.92.202 
$
```