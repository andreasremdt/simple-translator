# Simple Translator

> Simple, client-side translation with pure JavaScript.

![Node.js CI](https://github.com/andreasremdt/simple-translator/workflows/Node.js%20CI/badge.svg)
![NPM](https://img.shields.io/npm/l/@andreasremdt/simple-translator)
![npm (scoped)](https://img.shields.io/npm/v/@andreasremdt/simple-translator)

## Table of Contents

- [The problem](#the-problem)
- [The solution](#the-solution)
- [Installation](#installation)
  - [In the browser](#in-the-browser)
  - [Using Node.js or bundlers](#using-nodejs-or-bundlers)
- [Examples](#examples)
  - [Translate HTML in the browser](#translate-html-in-the-browser)
  - [Translate single strings](#translate-single-strings)
  - [Fetch JSON from the server](#fetch-json-from-the-server)
- [Usage](#usage)
  - [Translating HTML content](#translating-html-content)
  - [ Translating HTML attributes](#translating-html-attributes)
  - [Translating programmatically](#translating-programmatically)
- [Configuration](#configuration)
- [API reference](#api-reference)
  - [new Translator(options)](#new-translatorobject-options)
  - _instance_
    - [translateForKey(key, language)](#user-content-translateforkeystring-key-string-language)
    - [translatePageTo(language)](#user-content-translatepagetostring-language)
    - [add(language, translation)](#user-content-addstring-language-object-translation)
    - [remove(language)](#user-content-removestring-language)
    - [fetch(languageFiles, save)](#user-content-fetchstringarray-languagefiles-boolean-save)
    - [get currentLanguage](#user-content-get-currentlanguage)
- [Browser support](#browser-support)
- [Issues](#issues)

## The problem

You want to make your website available in multiple languages. You perhaps already looked for solutions out there and discovered various [services](https://www.i18next.com/) and [libraries](https://github.com/wikimedia/jquery.i18n), and dozens of other smaller packages that offer more or less what you are looking for.

Some of them might be too grand for your purpose. You don't want to install a 100 KB dependency just for a simple translation. Or, perhaps you've found smaller libraries but are missing essential features.

## The solution

`Simple Translator` is a very lightweight (~9 KB minified) solution for translating content with pure JavaScript. It works natively in the browser and Node.js.

- Translate single strings
- Translate entire HTML pages
- Easily fetch JSON resource files (containing your translations)
- Make use of global helper functions
- Detect the user's preferred language automatically

## Installation

### In the browser

A UMD build is available via [unpkg](https://unpkg.com). Just paste the following link into your HTML, and you're good to go:

```html
<script
  src="https://unpkg.com/@andreasremdt/simple-translator@latest/dist/umd/translator.min.js"
  defer
></script>
```

### Using Node.js or bundlers

This package is distributed via [npm](https://npmjs.com). It's best to install it as one of your project's dependencies:

```
npm i @andreasremdt/simple-translator
```

Or using [yarn](https://yarnpkg.com/):

```
yarn add @andreasremdt/simple-translator
```

## Examples

Want to see the bigger picture? Check out the live demos at CodeSandbox and see how you can integrate the library with popular frameworks or in pure JavaScript:

- [Vanilla JavaScript](https://codesandbox.io/s/simple-translator-vanilllajs-e33ye)
- [React](https://codesandbox.io/s/simple-translator-react-1mtki?file=/src/Content.js:0-27)
- [Vue.js](https://codesandbox.io/s/simple-translator-vuejs-iep2j?file=/src/main.js)
- _Lit-Element (Web Components) currently in progress_

### Translate HTML in the browser

```html
<header>
  <h1 data-i18n="header.title">Translate me</h1>
  <p data-i18n="header.subtitle">This subtitle is getting translated as well</p>
</header>

<!-- Load the translator either from a CDN or locally -->
<script
  src="https://unpkg.com/@andreasremdt/simple-translator@latest/dist/umd/translator.min.js"
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

### Translate single strings

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

### Fetch JSON from the server

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

### Translating HTML content

> Note that this feature is only available in a browser environment and will throw an error in Node.js.

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

### Translating HTML attributes

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

### Translating programmatically

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
| registerGlobally | `String,Boolean` | `'__'`                 | When set to a `String`, it will create a global helper with the same name. When set to `false`, it won't register anything.                                                                                 |
| persist          | `Boolean`        | `false`                | When set to `true`, the last language that was used is saved to localStorage.                                                                                                                               |
| persistKey       | `String`         | `'preferred_language'` | Only valid when `persist` is set to `true`. This is the name of the key with which the last used language is stored in localStorage.                                                                        |
| filesLocation    | `String`         | `'/i18n'`              | The absolute path (from your project's root) to your localization files.                                                                                                                                    |

## API reference

### `new Translator(Object?: options)`

Creates a new instance of the translator. You can define multiple instances, although this should not be a use-case.

Only accepts one parameter, a JavaScript `Object`, with a [custom config](#configuration).

```js
import Translator from '@andreasremdt/simple-translator';

var translator = new Translator();
// or...
var translator = new Translator({
  ...
});
```

### `translateForKey(String: key, String?: language)`

Translates a single translation string into the desired language. If no second language parameter is provided, then:

- It utilizes the last used language (accessible via the getter `currentLanguage`, but only after calling `translatePageTo()` at least once.
- If no previously used language was set and the `detectLanguage` option is enabled, it uses the browser's preferred language.
- If `detectLanguage` is disabled, it will fall back to the `defaultLanguage` option, which by default is `en`.

```js
var translator = new Translator({
  defaultLanguage: 'de',
});

translator.translateForKey('header.title', 'en');
// -> translates to English (en)
translator.translateForKey('header.title');
// -> translates to German (de)
```

### `translatePageTo(String?: language)`

> Note that this method is only available in the browser and will throw an error in Node.js.

Translates all DOM elements that match the selector (`'[data-i18n]'` by default) into the specified language. If no language is passed into the method, the `defaultLanguage` will be used.

After this method has been called, the `Simple Translator` instance will remember the language and make it accessible via the getter `currentLanguage`.

```js
var translator = new Translator({
  defaultLanguage: 'de',
});

translator.translatePageTo('en');
// -> translates the page to English (en)
translator.translatePageTo();
// -> translates the page to German (de)
```

### `add(String: language, Object: translation)`

Registers a new language to the translator. It must receive the language as the first and an object, containing the translation, as the second parameter.

The method `add()` returns the instance of `Simple Translator`, meaning that it can be chained.

```js
translator
  .add('de', {...})
  .add('es', {...})
  .translatePageTo(...);
```

### `remove(String: language)`

Removes a registered language from the translator. It accepts only the language code as a parameter.

The method `remove()` returns the instance of `Simple Translator`, meaning that it can be chained.

```js
translator.remove('de');
```

### `fetch(String|Array: languageFiles, Boolean?: save)`

Fetches either one or multiple JSON files from your project by utilizing the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). By default, fetched languages are also registered to the translator instance, making them available for use. If you just want to get the JSON content, pass `false` as an optional, second parameter.

You don't have to pass the entire file path or file extension (although you could). The `filesLocation` option will determine folder. It's sufficient just to pass the language code.

```js
var translator = new Translator({
  filesLocation: '/i18n'
});

// Fetches /i18n/de.json
translator.fetch('de').then((json) => {
  console.log(json);
});

// Fetches "/i18n/de.json" and "/i18n/en.json"
translator.fetch(['de', 'en']).then(...);

// async/await
// The second parameter is set to `false`, so the fetched language
// will not be registered.
await translator.fetch('de', false);
```

### `get currentLanguage`

By default, this returns the `defaultLanguage`. After calling `translatePageTo()`, this getter will return the last used language.

```js
var translator = new Translator({
  defaultLanguage: 'de',
});

console.log(translator.currentLanguage);
// -> "de"

// Calling this methods sets the current language.
translator.translatePageTo('en');

console.log(translator.currentLanguage);
// -> "en"
```

## Browser support

`Simple Translator` already comes minified and transpiled and should work in most browsers. The following browsers are tested:

- Edge <= 16
- Firefox <= 60
- Chrome <= 61
- Safari <= 10
- Opera <= 48

## Issues

Did you find any issues, bugs, or improvements you'd like to see implemented? Feel free to [open an issue on GitHub](https://github.com/andreasremdt/simple-translator/issues). Any feedback is appreciated.
