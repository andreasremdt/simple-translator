# Changelog

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.4] - 2021-12-20

### Fixed

- Don't depend on the `localStorage` API to exist in the environment. Ensures compatibility with Android WebView. [#154](https://github.com/andreasremdt/simple-translator/pull/154) - [@UshakovVasilii](https://github.com/UshakovVasilii)

## [2.0.3] - 2020-09-04

### Fixed

- The `currentLanguage` getter now returns the correct language. If language detection is enabled, it will return the detected language by default or otherwise the default language.

## [2.0.2] - 2020-08-04

### Changed

- Added compatibility for older browsers (including Safari 9) by using `Array.from` to convert a NodeList into an array.

## [2.0.1] - 2020-07-30

### Changed

- Added more [CodeSandbox examples](<(https://github.com/andreasremdt/simple-translator#examples)>) to the documentation's example section.

## [2.0.0] - 2020-07-29

### Breaking changes

- This release is a complete rewrite of the codebase.
- The methods `load()` and `getTranslationByKey()` have been removed in favor of a new API. Use `fetch()`, `translateForKey()`, and `translatePageTo()` instead.
- The config option `languages` has been removed.
- For more documentation on the new API, see the [Usage section](https://github.com/andreasremdt/simple-translator#usage) or the [API Reference](https://github.com/andreasremdt/simple-translator#api-reference).

### Added

- Added a config option `registerGlobally` that, if specified, registers a global helper with the same name as the given value. This allows you to translate single strings using shortcuts like `__('header.title')`.
- Added a config option `persistKey` that specifies the name of the localStorage key.
- Added a config option `debug` that, if set to `true`, prints useful error messages.
- Added `fetch()` for easier JSON fetching.
- Added `add()` to register new languages to the translator.
- Added `remove()` to remove languages from the translator.
- Added `translateForKey()` and `translatePageTo()` to translate single keys or the entire website.
- Added `get currentLanguage` to get the currently used language.
- Transpiled and minified UMD, ESM and CJS builds are available via [unpkg](https://unpkg.com/@andreasremdt/simple-translator@latest/dist/umd/translator.min.js) and [npm](https://www.npmjs.com/package/@andreasremdt/simple-translator).
- Added a build system for easier packaging and testing.
- Added [CONTRIBUTING.md](https://github.com/andreasremdt/simple-translator/CONTRIBUTING.md)
- Added [CODE_OF_CONDUCT.md](https://github.com/andreasremdt/simple-translator/CODE_OF_CONDUCT.md)

### Changed

- The [documentation](https://github.com/andreasremdt/simple-translator/#readme) has been updated and improved.

### Removed

- The option `languages` has been removed.
- The method `load()` has been removed.
- The method `getTranslationByKey()` has been removed.

### Dependencies

- Install `@babel/core@7.10.5`,
- Install `@babel/plugin-proposal-optional-chaining@7.10.4`,
- Install `@babel/plugin-transform-modules-commonjs@7.10.4`,
- Install `@babel/preset-env@7.10.4`,
- Install `@rollup/plugin-babel@5.1.0`,
- Install `eslint-config-google@0.14.0`,
- Install `eslint-config-prettier@6.11.0`,
- Install `husky@4.2.5`,
- Install `jest@26.1.0`,
- Install `npm-run-all@4.1.5`,
- Install `prettier@2.0.5`,
- Install `rollup@2.22.2`,
- Install `rollup-plugin-terser@6.1.0`

## [1.2.0] - 2020-07-21

### Added

- `data-i18n-attr` can now translate multiple attributes by providing a space-separated list. Thanks [@gwprice115](https://github.com/gwprice115).

## [1.1.1] - 2020-04-05

### Changed

- `getTranslationByKey` uses the fallback language when provided.
- Update the documentation.

## [1.1.0] - 2020-04-04

### Added

- Provide a [fallback language](https://github.com/andreasremdt/simple-translator/issues/1) using the `options.defaultLanguage` property.
- Translate all [HTML attributes](https://github.com/andreasremdt/simple-translator/issues/4) like `title` or `placeholder`, not only text.
- Add the method `getTranslationByKey` to translate a single key programmatically.

### Changed

- Use cache to translate faster and save network data.
- Print a warning message when a key was not found in the translation files. Thanks [@andi34](https://github.com/andi34).

### Dependencies

- Bump eslint to 6.8.0

## [1.0.0] - 2019-10-16

- Initial release
