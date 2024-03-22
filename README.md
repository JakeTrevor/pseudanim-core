# Pseudanim

This reposity contains the research prototype for Pseudanim --- a tool for animating arbitrary algorithms.

## Building Pseudanim

If you want to run pseudanim, you first need to clone this repo and then follow the build steps below:

1. Install nodeJS

   This project uses nodejs, so that must be installed. The project was developed with node 18.19.0; however any version of 18 should work. You can check if you have node installed (and which version) with the command
   `node --version`.
   If you don't already have node installed, we reccomend you install it with [NVM](https://github.com/nvm-sh/nvm); however you can also download it directly from [the nodejs download page](https://nodejs.org/en/download).

2. Install package dependencies

   To do this you can use whichever Javascript package manager you like --- all of them should work, including npm. However, for development, we used [pnpm](https://pnpm.io/), so we reccommend you do the same. Instructions for installing it can be found [here](https://pnpm.io/installation). Install packages with `pnpm i` or `npm i`

3. Generate Langium derivatives

   all being well, your package manager should automatically run the `postinstall` script in the package.json; if this does not happen, or if you are unsure, you can do it manually. To do this use the command `pnpm postinstall` or `pnpm lang:generate`

4. Build & Bundle Project

   We are now ready to build the actual project; to do this, run `pnpm build`.
   If this is successful it should generate a file at `./dist/index.js`
   You may also need to generate the correct CSS files; to do this, run `pnpm css:build`.

5. Run Pseudanim

   Now we are ready to run the actual application; To do this, run `node ./dist/index.js`. If everything has gone right, you should get some help text and a list of commands.

## Running Pseudanim

To actually run pseudanim, and test the animation against some real code, you should use the dev command, and provide a source file. For example, to start the server for the insertion sort example, you should run the following command:

`node .\dist\index.js dev .\samples\insertion-sort.pa`
