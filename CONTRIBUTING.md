# Contributing

Thanks for being willing to contribute!

Is this **your first time** contributing to a different project? You might be interested in learning more about the workflow in [this free course](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github).

## Project setup

1. Fork and clone the repo
2. Run `npm install` to install dependencies
3. Run `npm run validate` to validate the installation
4. Create a branch for your PR with `git checkout -b pr/your-branch-name`

If you want to transpile and build the project, run `npm run build` (minified, production build) or `npm run dev` to compile and watch for file changes during development.

> Tip: Keep your `master` branch pointing at the original repository and make
> pull requests from branches on your fork. To do this, run:
>
> ```
> git remote add upstream https://github.com/andreasremdt/simple-translator.git
> git fetch upstream
> git branch --set-upstream-to=upstream/master master
> ```
>
> This will add the original repository as a "remote" called "upstream," Then
> fetch the git information from that remote, then set your local `master`
> branch to use the upstream master branch whenever you run `git pull`. Then you
> can make all of your pull request branches based on this `master` branch.
> Whenever you want to update your version of `master`, do a regular `git pull`.

## Committing and pushing changes

Please make sure to run the tests before you commit your changes. You can run `npm run validate` which will format, test, and lint the code. You won't be able to commit without all of these 3 passing.

This project follows the [Karma Convention](https://karma-runner.github.io/4.0/dev/git-commit-msg.html).

### Short form (only subject line)

```
<type>(<scope>): <subject>
```

### Long form (with body)

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
```

#### `<type>`

Allowed `<type>` values:

- **feat** (new feature)
- **fix** (bug fix)
- **docs** (changes to documentation)
- **style** (formatting, missing semi colons, etc; no code change)
- **refactor** (refactoring production code)
- **test** (adding missing tests, refactoring tests; no production code change)
- **chore** (updating rollup etc; no production code change)

#### `<scope>`

One word, maxim two connected by dash, describing the area the changes affect. Example values:

- build
- translator
- utils
- etc.

#### `<subject>`

- Use imperative, present tense: _change_ not _changed_ nor _changes_ or
  _changing_
- Do not capitalize first letter
- Do not append dot (.) at the end

## Help Needed

Please checkout the [the open issues](https://github.com/andreasremdt/simple-translator/issues).

Also, please watch the repo and respond to questions/bug reports/feature
requests. Thanks!
