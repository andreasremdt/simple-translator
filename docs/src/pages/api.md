---
title: API Reference
description: This reference provides you with an overview of all methods and configuration options.
slug: /api/
---

This API reference will provide you with an overview of what methods and options
are available with Simple Translator. If you'd rather have a
step-by-step guide on how to integrate this library into your app, [have a look here](/tutorial/).

## new Translator(Object?: options)

Creates a new instance of the translator. You can define multiple instances, although this should not be a use-case. Only accepts one
parameter, a JavaScript `Object`, with [some custom options](#options).

```js
import Translator from '@andreasremdt/simple-translator';

var translator = new Translator();

// or with options:
var translator = new Translator({
...
});
```

### Options

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

| Key                | Type                  | Default            | Description                                                                                                            |
| ------------------ | --------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `defaultLanguage`  | `String`              | en'                | The default language, in case nothing else has been specified.                                                         |
| `detectLanguage`   | `Boolean`             | `true`             | If set to `true`, it tries to determine the user's desired language based on the browser                               |
| `selector`         | `String`              | [data-i18n]        | Elements that match this selector will be translated.                                                                  |
| `debug`            | `Boolean`             | `false`            | When set to `true`, helpful logs will be printed to the console. Valuable for debugging and problem-solving.           |
| `registerGlobally` | `String` or `Boolean` | '\_\_'             | When set to a `String`, it will create a global helper with the same name. When set to `false`, it won't register      |
| `persist`          | `Boolean`             | `false`            | When set to `true`, the last language that was used is saved to localStorage.                                          |
| `persistKey`       | `String`              | preferred_language | Only valid when `persist` is set to `true`. This is the name of the key with which the last used language is stored in |
| `filesLocation`    | `String`              | /i18n              | The absolute path (from your project's root) to your localization files.                                               |

## translateForKey(String: key, String?: language)

Translates a single translation string into the desired language. If no second language parameter is provided, then:

- It utilizes the last used language (accessible via the getter `currentLanguage`, but only after calling `translatePageTo()` at least once.
- If no previously used language was set and the `detectLanguage` option is enabled, it uses the browser's preferred language.
- If `detectLanguage` is disabled, it will fall back to the `defaultLanguage` option, which by default is `en`.

```js
var translator = new Translator({
  defaultLanguage: 'de',
});

// -> translates to English (en)
translator.translateForKey('header.title', 'en');

// -> translates to German (de)
translator.translateForKey('header.title');
```

## translatePageTo(String?: language)

_Note that this method is only available in the browser and will throw an error in Node.js._

Translates all DOM elements that match the selector (`'[data-i18n]'`by default) into the specified language. If no language is passed into the method, the`defaultLanguage`will be used. After this method has been called, the`Simple Translator`instance will remember the language and make it accessible via the getter`currentLanguage`.

```js
var translator = new Translator({
  defaultLanguage: 'de',
});

// -> translates the page to English (en)
translator.translatePageTo('en');

// -> translates the page to German (de)
translator.translatePageTo();
```

## add(String: language, Object: translation)

Registers a new language to the translator. It must receive the language as the first and an object, containing the translation, as the second parameter. The method `add()`returns the instance of `Translator`, meaning that it can be chained.

```js
translator
  .add('de', {...})
  .add('es', {...})
  .translatePageTo(...);
```

## remove(String: language)

Removes a registered language from the translator. It accepts only the language code as a parameter. The method `remove()`returns the instance of `Translator`, meaning that it can be chained.

```js
translator.remove('de');
```

## fetch(String|Array: languageFiles, Boolean?: save)

Fetches either one or multiple JSON files from your project by utilizing the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). By default, fetched languages are also registered to the translator instance, making them available for use. If you just want to get the JSON content, pass `false` as an optional, second parameter.

You don't have to pass the entire file path or file extension (although you could). The`filesLocation` option will determine the folder. It's sufficient just to pass the language code.

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
var json = await translator.fetch('de', false);
console.log(json);
```

## get currentLanguage

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
