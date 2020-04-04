# Changelog

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2020-04-04

### Added

- Provide a [fallback language](https://github.com/andreasremdt/simple-translator/issues/1) using the `options.defaultLanguage` property.
- Translate all [HTML attributes](https://github.com/andreasremdt/simple-translator/issues/4) like `title` or `placeholder`, not only text.
- Add the method `getTranslationByKey` to translate a single key programmatically.

### Changed

- Use cache to faster translate and save network data.
- Print a warn message when a key was not found in the translation files. Thanks [@andi34](https://github.com/andi34).

### Dependencies

- Bump eslint to 6.8.0

## [1.0.0] - 2019-10-16

- Initial release
