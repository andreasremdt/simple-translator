# simple-translator

This script provides a quick and easy way to translate content on your website with only a few lines of JavaScript code.

For a full example, [please look here](https://codesandbox.io/s/i18n-example-ipfeu?fontsize=14).

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
```

**en.json:**
```json
{
  "header": {
    "title": "English title"
  }
}
```

**de.json:**
```json
{
  "header": {
    "title": "Deutscher Titel"
  }
}
```

For an advanced example, [please look here](https://codesandbox.io/s/i18n-example-ipfeu?fontsize=14).

## Options

When initializing `Translator`, you can pass an object with options:

```js
var translator = new Translator({
  persist: true,
  languages: ["de", "en", "es"],
  defaultLanguage: "en",
  detectLanguage: true,
  filesLocation: "/i18n"
});
```

| Option  | Type | Default | Description |
|---|---|---|---|
| persist | `Boolean` | `true` | Whether or not the last selected language should be stored in the browser's localStorage. |
| languages | `Array` | `["en"]` | The available languages. For each language, a JSON file must be located in the localization folder. |
| defaultLanguage | `String` | `"en"` | The default language to load. |
| detectLanguage | `Boolean` | `true` | Whether or not the script should try to determine the user's desired language. This will override `defaultLanguage`. |
| filesLocation | `String` | `"/i18n"` | The absolute path (from your project's root) to your localization files. |

## Browser support

* Edge <= 16
* Firefox <= 60
* Chrome <= 61
* Safari <= 10
* Opera <= 48

## Issues

Did you find any issues, bugs or improvements you'd like to see implemented? Feel free to [open an issue on GitHub](https://github.com/andreasremdt/simple-translator/issues). Any feedback is appreciated.