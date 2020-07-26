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
- [Usage](#usage)
  - [Translating HTML Content](#translating-html-content)
  - [ Translating HTML Attributes](#translating-html-attributes)
  - [Translating Programmatically](#translating-programmatically)
- [Configuration](#configuration)
- [Browser Support](#browser-support)
- [Issues](#issues)

## The Problem

You want to make your website available in multiple languages. You perhaps already looked for solutions out there and discovered various [services](https://www.i18next.com/) and [libraries](https://github.com/wikimedia/jquery.i18n), and dozens of other smaller packages that offer more or less what you are looking for.

Some of them might be too grand for your purpose. You don't want to install a 100 KB dependency just for a simple translation. Or, perhaps you've found smaller libraries but are missing essential features.

## The Solution

`Simple Translator` is a very lightweight (~8 KB minified) solution for translating content with pure JavaScript. It works natively in the browser and Node.js.

- Translate single strings
- Translate entire HTML pages
- Easily fetch JSON resource files (containing your translations)
- Make use of global helper functions
- Detect the user's preferred language automatically

## Installation

### In the Browser

A UMD build is available via [unpkg](https://unpkg.com). Just paste the following link into your HTML, and you're good to go:

```html
<script
  src="https://unpkg.com/browse/@andreasremdt/simple-translator@2.0.0/dist/umd/translator.min.js"
  defer
></script>
```

### Using Node.js or Bundlers

This package is distributed via [npm](https://npmjs.com). It's best to install it as one of your project's dependencies:

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

## Usage

`Simple Translator` can be used to translate entire websites or programmatically via the API in the browser or Node.js.

### Translating HTML Content

In your HTML, add the `data-i18n` attribute to all DOM nodes that you want to translate. The attribute holds the key to your translation in dot syntax as if you were accessing a JavaScript object. The key resembles the structure of your translation files.

```html
<header>
  <h1 data-i18n="header.title">Headline</h1>
</header>

<p data-i18n="intro">Some introduction content</p>
```

Import and initialize the translator into your project's source code. The constructor accepts an optional object as [configuration](#configuration).

```js
import Translator from '@andreasremdt/simple-translator';

var translator = new Translator();
```

Next, you need to register the translation sources. Each language has its own source and must be made available to the translator. You can either fetch them from the server or directly pass them as a JavaScript object:

```js
// By using `fetch`, you load the translation sources asynchronously
// from a directory in your project's folder. The resources must
// be in JSON. After they are fetched, you can use the API to
// translate the page.
translator.fetch(['en', 'de']).then(() => {
  // -> Translations are ready...
  translator.translatePageTo('en');
});

// By using `add`, you pass the translation sources directly
// as JavaScript objects and then use the API either through
// chaining or by using the `translator` instance again.
translator.add('de', jsonObject).translatePageTo('de');
```

Each translation source consists of a key (the language itself, formatted in the [ISO-639-1 language code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)) and an object, holding key-value pairs with the translated content.

Using the example above, the translation sources for each language must have the following structure:

```js
{
  "header": {
    "title": "Translated title"
  },
  "intro": "The translated intro"
}
```

When fetching the JSON files using `fetch()`, the translator looks for a folder called `i18n` in the root of your web server. You can configure the path in the [configuration](#configuration).

When a language has been registered and is ready, you can call `translatePageTo()` and provide an optional parameter for the target language, such as "en".

```js
translator.translatePageTo(); // Uses the default language
translator.translatePageTo('de'); // Uses German
```

### Translating HTML Attributes

You can translate the text content of a DOM element (it's `innerHTML`) or any other attribute, such as `title` or `placeholder`. For that, pass `data-i18n-attr` and a space-separated list of attributes to the target DOM node:

```html
<input
  data-i18n="input.title_label input.placeholder_label"
  data-i18n-attr="title placeholder"
  title="..."
  placeholder="..."
/>
```

> Be careful to have the same amount of keys and attributes in `data-i18n` and `data-i18n-attr`. If you want to translate both `placeholder` and `title`, you need to pass two translation keys for it to work.

By default, if `data-i18n-attr` is not defined, the innerHTML will be translated.

### Translating Programmatically

Instead of translating the entire page or some DOM nodes, you can translate a single, given key via `translateForKey()`. The first argument should be a key from your translation sources, such as "header.title", and the second argument should be the target language like "en" or "de". Note that the language must have been registered before calling this method.

```js
translator.add('de', jsonObject);

console.log(translator.translateForKey('header.title', 'de'));
// -> prints the translation
```

By default, `Simple Translator` registers a global helper on the `window` object to help you achieve the same without having to write the method name.

```js
__.('header.title', 'de');
```

> You can change the name of this helper in the [configuration](#configuration).

## Configuration

When initializing the `Translator` class, you can pass an object for configuration. By default, the following values apply:

```js
var translator = new Translator({
  defaultLanguage: 'en',
  detectLanguage: true,
  selector: '[data-i18n]',
  debug: false,
  registerGlobally: '__',
  persist: false,
  persistKey: 'preferred_language',
  filesLocation: '/i18n',
});
```

| Key              | Type             | Default                | Description                                                                                                                                                                                                 |
| ---------------- | ---------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| defaultLanguage  | `String`         | `'en'`                 | The default language, in case nothing else has been specified.                                                                                                                                              |
| detectLanguage   | `Boolean`        | `true`                 | If set to `true`, it tries to determine the user's desired language based on the browser settings.                                                                                                          |
| selector         | `String`         | `'[data-i18n]'`        | Elements that match this selector will be translated. It can be any valid [element selector](https://developer.mozilla.org/en-US/docs/Web/API/Document_object_model/Locating_DOM_elements_using_selectors). |
| debug            | `Boolean`        | `false`                | When set to `true`, helpful logs will be printed to the console. Valuable for debugging and problem-solving.                                                                                                |
| registerGlobally | `String|Boolean` | `'__'`                 | When set to a `String`, it will create a global helper with the same name. When set to `false`, it won't register anything.                                                                                 |
| persist          | `Boolean`        | `false`                | When set to `true`, the last language that was used is saved to localStorage.                                                                                                                               |
| persistKey       | `String`         | `'preferred_language'` | Only valid when `persist` is set to `true`. This is the name of the key with which the last used language is stored in localStorage.                                                                        |
| filesLocation    | `String`         | `'/i18n'`              | The absolute path (from your project's root) to your localization files.                                                                                                                                    |

## Browser Support

`Simple Translator` already comes minified and transpiled and should work in most browsers. The following browsers are tested:

- Edge <= 16
- Firefox <= 60
- Chrome <= 61
- Safari <= 10
- Opera <= 48

## Issues

Did you find any issues, bugs, or improvements you'd like to see implemented? Feel free to [open an issue on GitHub](https://github.com/andreasremdt/simple-translator/issues). Any feedback is appreciated.
