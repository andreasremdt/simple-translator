# Simple Translator

> Simple, client-side translation with pure JavaScript.

## Table of Contents

- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Installation](#installation)
  - [In the Browser](#in-the-browser)
  - [Using Node.js or Bundlers](#using-nodejs-or-bundlers)
- [Examples](#examples)
  - [Translate HTML in the Browser](#translate-html-in-the-browser)
  - [Translate Single Strings](#translate-single-strings)
  - [Fetch JSON from the Server](#fetch-json-from-the-server)
- [Docs](#docs)
- [Browser Support](#browser-support)
- [Issues](#issues)

## The Problem

You want to make your website available in multiple languages. You perhaps already looked for solutions out there and discovered various [services](https://www.i18next.com/) and [libraries](https://github.com/wikimedia/jquery.i18n), and dozens of other smaller packages that offer more or less what you are looking for.

Some of them might be too grand for your purpose. You don't want to install a 100 KB dependency just for a simple translation. Or, perhaps you've found smaller libraries but are missing important features.

## The Solution

`Simple Translator` is a very lightweight (~8 KB minified) solution for translating content with pure JavaScript. It works natively in the browser and in Node.js.

- Translate single strings
- Translate entire HTML pages
- Easily fetch JSON resource files (containing your translations)
- Make use of global helper functions
- Detect the user's preferred language automatically

## Installation

### In the Browser

An UMD build is provided via [unpkg](https://unpkg.com). Just paste the following link into your HTML and you're good to go:

```html
<script
  src="https://unpkg.com/browse/@andreasremdt/simple-translator@2.0.0/dist/umd/translator.min.js"
  defer
></script>
```

### Using Node.js or Bundlers

This package is distributed via [npm](https://npmjs.com) and should be installed as one of your project's dependencies:

```
npm i @andreasremdt/simple-translator
```

Or using [yarn](https://yarnpkg.com/):

```
yarn add @andreasremdt/simple-translator
```

## Examples

### Translate HTML in the Browser

```html
<header>
  <h1 data-i18n="header.title">Translate me</h1>
  <p data-i18n="header.subtitle">This subtitle is getting translated as well</p>
</header>

<!-- Load the translator either from a CDN or locally -->
<script
  src="https://unpkg.com/browse/@andreasremdt/simple-translator@2.0.0/dist/umd/translator.min.js"
  defer
></script>
<script defer>
  // Provide your translations as JSON / JS objects
  var germanTranslation = {
    header: {
      title: 'Eine Überschrift',
      subtitle: 'Dieser Untertitel ist nur für Demozwecke',
    },
  };

  // Create a new instance of the translator
  // You can optionally pass options
  var translator = new Translator();

  // Add the language to the translator and translate the page
  translator.add('de', germanTranslation).translatePageTo('de');
</script>
```

### Translate Single Strings

```js
// Depending on your environment, you can use CommonJS
var Translator = require('@andreasremdt/simple-translator');

// or EcmaScript modules
import Translator from '@andreasremdt/simple-translator';

// Provide your translations as JSON / JS objects
var germanTranslation = {
  header: {
    title: 'Eine Überschrift',
    subtitle: 'Dieser Untertitel ist nur für Demozwecke',
  },
};

// You can optionally pass options
var translator = new Translator();

// Add the language to the translator
translator.add('de', germanTranslation);

// Provide single keys and the target language
translator.translateForKey('header.title', 'de');
translator.translateForKey('header.subtitle', 'de');
```

### Fetch JSON from the Server

`i18n/de.json`:

```json
"header": {
  "title": "Eine Überschrift",
  "subtitle": "Dieser Untertitel ist nur für Demozwecke",
}
```

`i18n/en.json`:

```json
"header": {
  "title": "Some Nice Title",
  "subtitle": "This Subtitle is Going to Look Good",
}
```

`index.js`:

```js
import Translator from '@andreasremdt/simple-translator';

// The option `filesLocation` is "/i18n" by default, but you can
// override it
var translator = new Translator({
  filesLocation: '/i18n',
});

// This will fetch "/i18n/de.json" and "/i18n/en.json"
translator.fetch(['de', 'en']).then(() => {
  // You now have both languages available to you
  translator.translatePageTo('de');
});
```

## Docs

For more thorough documentation follow [this link](https://some-url.com).

## Browser Support

`Simple Translator` already comes minified and transpiled and should work in most browsers. The following browsers are tested:

- Edge <= 16
- Firefox <= 60
- Chrome <= 61
- Safari <= 10
- Opera <= 48

## Issues

Did you find any issues, bugs or improvements you'd like to see implemented? Feel free to [open an issue on GitHub](https://github.com/andreasremdt/simple-translator/issues). Any feedback is appreciated.
