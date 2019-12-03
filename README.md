[![Custom badge](https://img.shields.io/endpoint?color=%2374b9ff&url=https%3A%2F%2Fraw.githubusercontent.com%2unfoldingWord-box3%2Fhello-world-react-component-library%2Fmaster%2Fcoverage%2Fshields.json)]()
![Lego Blocks](https://forum.door43.org/uploads/default/original/1X/0a2172623a094033c0f609fe36bb08eacdd4fb1b.jpeg)

# Example React Component Library

Read more about why we are focusing on creating component libraries and our approach:
https://forum.door43.org/t/component-libraries/396

### The Stack

- Javascript + React (functional components & hooks).
- MaterialUI for UI/UX baseline design components.
- Styleguidist for Playground Documentation.
- Yarn for dependencies, publishing, and deploying.
- Github + NPM + Github Pages for Hosting.

There are many alternatives to each layer referenced here. However, many of the alternatives add a great deal of complexity to the initial setup and long term maintenance which prevents it from being practical.

# How to deploy your own?

Once you have this codebase forked and cloned to your local machine, you can start modifying the codebase.
You will need to ensure `node.js` and `yarn` are already installed.

### Installation and Running the Styleguide Locally

1. Install the npm dependencies with `yarn`.
1. Run the Styleguide with `yarn start`.
1. Ensure that the Styleguide is running by visiting `localhost:6060` on your web browser.
1. Modify the code and documentation in your code editor and check out the Styleguide.
    - Update the styleguide.config.js to match your new component names.

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

# Other Resources

Here's a great writeup that walks you through a slightly different stack:
https://itnext.io/how-to-write-your-own-reusable-react-component-library-a57dc7c9a210
