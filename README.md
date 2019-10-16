# simple-translator

This script provides a quick and easy way to translate content on your website with only a few lines of JavaScript code.

## Installation

Clone this repository or download the `translator.js` file separately and put it into your project folder where all your JavaScript is located.

`translator.js` provides a default export which you can import:

```js
import Translator from "./translator.js"
```

## Usage

1. In your HTML add the `data-i18n` attribute to the tags that you want to translate (you can customize the attribute, [see here](https://sad.de)):
```html
<header>
  <h1 data-i18n="header.title">Translate me</h1>
</header>
```

2. Import the translator script into your project's source code:
```js
import Translator from "./translator.js"
```

3. Initialize the `Translator` class:
```js
var translator = new Translator(options);
```

4. Call the `load` method whenever you need it:

```js
translator.load(lang);
```

5. In your project's root folder, add a folder `i18n` and put your language files with the `.json` extension inside (you can customize the folder's name, [see here](https://sad.de):

```
/your-project-folder
|–– i18n/
|––|–– en.json
|––|–– de.json
|––|–– es.json

## Options

## Browser support

## Issues