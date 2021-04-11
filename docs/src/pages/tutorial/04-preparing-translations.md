---
title: 4. Preparing the Translations
description: Learn how to use Simple Translator in every possible use-case.
slug: /tutorial/04/
---

In the last section, we prepared the HTML by adding the `data-i18n` and `data-i18n-attr` attributes. Now it's time to look into the translations files.

If you remember, we defined a key for a certain translation:

```html
<h1 data-i18n="title">Recipes of the Day</h1>
```

The key (`title`) is what _Simple Translator_ will use to find a matching string, which will eventuelly replace the text content. There are two options to define translations:

- A plain JavaScript object with key/value pairs
- An external JSON file that you `require` or `fetch` from the server

## Option 1: JavaScript Objects

The fastest way is to create a new object that contains all key/value pairs needed by the app. In our example recipe site, the object would look like that:

```js
var english = {
  meta: {
    description: 'Find the best recipes from all around the world.',
    title: 'Delicious Recipes',
  },
  title: 'Recipes of the Day',
  subtitle:
    'This curated list contains some fresh recipe recommendations from our chefs, ready for your kitchen.',
  recipes: {
    '1': {
      title: 'Rasperry Milkshake with Ginger',
      image: 'Image of rasperry milkshake with ginger',
      meta: '5 min - Easy - Shakes',
    },
    '2': {
      title: 'Fluffy Banana Pancakes',
      image: 'Image of fluffy banana pancakes',
      meta: '15 min - Easy - Breakfast',
    },
  },
  button: 'Read more',
};
```

You can create one object per language to store your translations. If you are using a bundler and EcmaScript imports (or Node.js), you can create separate files and import them where needed:

```js
// this file is named en.js
var english = { ... };

export default english;
```

```js
import english from './lang/en.js';
import german from './lang/de.js';
// add more languages if needed
```

If your app is bigger, you can even split the translation files into separate, smaller ones. Using `Object.assign` or the [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax), you can merge them when needed. Just keep in mind that keys must be unique.

```js
var englishHomePage = { ... };
var englishAboutPage = { ... };
var english = { ...englishHomePage, ... englishAboutPage };

// alternatively:
var english = Object.assign({}, englishHomePage, englishAboutPage);
```

### Pros

- Quick and easy way to get started, especially for smaller projects.
- No fetching means no additional requests to the server and a better performance.
- Translations can be manipulated dynamically with JavaScript.
- Can be organized via imports.

### Cons

- Translations get bundled into the final JavaScript output and might blow up the bundle size.
- Depending on the folder structure, lots of translations might clutter the source code.

## Option 2: External JSON

An alternative to having the translations directly as part of your JavaScript is to fetch them on demand, for example when a user switches the languages. In this case, they are stored as JSON files with the same structure as you saw above:

```json
{
  "meta": {
    "description": "Find the best recipes from all around the world.",
    "title": "Delicious Recipes"
  },
  "title": "Recipes of the Day",
  "subtitle": "This curated list contains some fresh recipe recommendations from our chefs, ready for your kitchen.",
  "recipes": {
    "1": {
      "title": "Rasperry Milkshake with Ginger",
      "image": "Image of rasperry milkshake with ginger",
      "meta": "5 min - Easy - Shakes"
    },
    "2": {
      "title": "Fluffy Banana Pancakes",
      "image": "Image of fluffy banana pancakes",
      "meta": "15 min - Easy - Breakfast"
    }
  },
  "button": "Read more"
}
```

Again, if your app uses a bundler or if you are working with Node.js, you could directly import these files using EcmaScript modules or CommonJS. However, we already looked at this above.

The goal here is to _fetch_ the files by either using JavaScript's Fetch API, axios, or _Simple Translator_ itself. _Simple Translator_ offers a handy method that takes care of fetching the files for you, we'll cover this soon.

### Pros

- Translations are fetched on demand, lowering the initial bandwidth usage. Users only download the language(s) they need.
- Translations are separated from your source code and won't get bundled, resulting in a better separation of content and code.
- Can alternatively be imported via EcmaScript modules or CommonJS.

### Cons

- Translations can't be manipulated dynamically via JavaScript.
- Depending on the internet speed, it might take a while to fetch and update the page.
- Slightly bigger overhead when getting started with _Simple Translator_.

## Conclusion

With the above 2 options explained, you can go ahead and make the best decision for your project.

If you are just getting started or if you need to dynamically manipulate translations and don't care about the translations ending up in your bundled output, it's recommended to use JavaScript objects directly in your source code.

If you want to fetch the translations on demand, don't care about being able to manipulate your translations or don't want translations as part of your bundled output, use external JSON files and fetch them when needed.

Now that we have our translations ready, let's jump to the interesting part: initializing and configuring the _Simple Translator_.
