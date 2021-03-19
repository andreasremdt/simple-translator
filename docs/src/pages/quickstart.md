---
title: Quickstart
description: Get up and running with Simple Translator in no more than 10 minutes.
slug: /quickstart/
---

This quickstart guide will show you the basic usage of _Simple Translator_. If you want to learn more details, head over to the [tutorial](/tutorial/).

## 1. Installation

Simple Translator can be installed from npm:

```bash
# npm
npm install @andreasremdt/simple-translator

#yarn
yarn add @andreasremdt/simple-translator
```

If you don't want to install a dependency and prefer to directly load _Simple Translator_ into the browser, you can use unpkg:

```html
<script
  src="https://unpkg.com/@andreasremdt/simple-translator@latest/dist/umd/translator.min.js"
  defer
></script>
```

## 2. Import & Initialization

Import the `Translator` class into your JavaScript file. Depending on your setup, you can either use ESM or CommonJS.

```js
// ESM
import Translator from "@andreasremdt/simple-translator";

// CommonJS
var Translator = require("@andreasremdt/simple-translator");
```

If you loaded the library via unpkg, you can skip this step, as the `Translator` class will be available globally.

Initialize the `Translator` class and provide some (optional) options to configure its behavior. You don't need to pass any configuration, the default options will be used instead.

```js
var translator = new Translator({
  ...options,
});
```

## 3. Preparing the HTML

Add `data-i18n` attributes to all HTML elements that you want to translate.

```html
<p data-i18n="header.title"></p>
```

This will replace the `textContent` of the paragraph with your translation, coming from the translation resource. You can set `data-i18n` to all HTML elements that can have `textContent`.

## 4. Translating the HTML

Finally, you can use the API to add languages and translate the HTML page.

```js
var germanTranslation = {
  header: {
    title: "Eine Überschrift",
  },
};

translator.add("de", germanTranslation).translatePageTo("de");
```

You can register as many languages as you want. Keep in mind that the JSON structure in each corresponding language file should be consistent, otherwise, things might break.
