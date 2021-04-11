---
title: 5. Translating HTML
description: Learn how to use Simple Translator in every possible use-case.
slug: /tutorial/05/
---

In the previous sections of this tutorial, we looked into how to prepare the HTML and translation sources, containing our text data in different languages. Now, it's time to finally use _Simple Translator_'s API to do something useful.

## Initialization

In order to use the library, you have to import it first (you can skip this step if you are using the **unpkg** link):

```js
import Translator from '@andreasremdt/simple-translator';

// alternatively, for Node.js:
var translator = require('@andreasremdt/simple-translator');
```

The package `@andreasremdt/simple-translator` only contains one default export, which is the translator's class. Next, you have to create a new instance of this class:

```js
var translator = new Translator();
```

By default, you don't have to provide any options, but you could. Whenever you want to customize the translator's behavior, you can provide an object with some properties, like so:

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

You can find an overview of all available options, their default values, and what they do in the [API reference](/api/).

With that out of the way, you have the `translator` instance ready to do something for you. Let's have a detailed look.

## Registering Languages

Before you can translate your HTML into a certain language, you first have to register it with the translator. Otherwise, it wouldn't know where to pick the translation data from. You can register as many languages as you want.

There are two ways of doing so: directly providing the JSON or fetching it from the server.

### Without Fetching

If you chose to provide your translations in your JavaScript code as an object, you can use the `.add` method to register a new language:

```js
translator.add('de', json);
```

The first argument of `.add` is the [language code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) (like _en_, _de_, or _es_), the second argument is the actual JSON which contains all translations.

You can also register many languages at once using method chaining:

```js
translator.add('de', germanJSON).add('en', englishJSON).add('es', spanishJSON);
```

You can use the translation files from the previous section and put them in here.

### With Fetching

If you prefer to fetch your translations from the server using asynchronous code, _Simple Translator_ provides a handy `.fetch` method for that:

```js
translator.fetch('en').then(() => {
  ...
});
```

`.fetch` returns a Promise, because under the hood, JavaScript's Fetch API is used. This means that the process of fetching your translations could take a little bit, and they won't be available immediately. If you want to use your translations afterward, you can either add a `.then` handler or use `async/await`:

```js
// Using `.then`
translator.fetch('en').then((englishJSON) => {
  console.log(englishJSON);
});

// Using `async/await`
var englishJSON = await translator.fetch('en');
```

But what happens if you want to fetch more than one language from the server? Well, `.fetch` got you covered by allowing you to pass an array of languages as the first argument:

```js
translator.fetch(['en', 'de', 'es']).then((languages) => {
  // languages[0] -> 'en'
  // languages[1] -> 'de'
  // languages[2] -> 'es'
});
```

The `.fetch` method automatically registers each language after it has been loaded, using `.add` internally. You don't have to do anything else. If you want to disable this behavior and instead register the languages manually, you can provide `false` as the second argument:

```js
translator.fetch('en', false).then((englishJSON) => {
  translator.add('en', englishJSON);
});
```

## Translate The Page

Now it's time to call `.translatePageTo`, which is the method that will make _Simple Translator_ translate all your HTML elements that have been marked with an `data-i18n` attribute.

```js
translator.translatePageTo('de');
```

If you provided a default language the option `defaultLanguage` or if you set `detectLanguage` to `true`, you can omit the argument and just call the method like so:

```js
translator.translatePageTo();
```

This will either choose the detected or default language.

Once you call that method, you'll notice that the text on the page has changed. If the `data-i18n` attributes where set correctly and the JSON contained all keys, you should see that the elements have been translated properly. This action can be triggered after the user interacted with a button for example:

```html
<button data-lang="en">Translate to English</button>
<button data-lang="de">Translate to German</button>
<button data-lang="es">Translate to Spanish</button>
```

```js
for (let button of document.querySelectorAll('button')) {
  button.addEventListener('click', (evt) => {
    translator.translatePageTo(evt.target.dataset.lang);
  });
}
```

## Conclusion

Let's recap what we learned in this section. After importing the translator class, you can initialize it with some (optional) config and use `.add` to register languages synchronously or `.fetch` to register them asynchronously:

**Synchronously**

```js
import Translator from '@andreasremdt/simple-translator';

var germanJSON = {
  header: {
    title: 'Eine Überschrift',
    subtitle: 'Dieser Untertitel ist nur für Demozwecke',
  },
};

var translator = new Translator();

translator.add('de', germanJSON).translatePageTo('de');
```

**Asynchronously**

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

In the last section of this tutorial, we'll have a look at programmatically translating strings using the `.translateForKey` method. This might come in handy when you don't have HTML to translate, but some strings inside your JavaScript code that need translation.
