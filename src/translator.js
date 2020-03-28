"use strict";

class Translator {
  constructor(options = {}) {
    this._options = Object.assign({}, this.defaultConfig, options);
    this._lang = this._detectLanguage();
    this._elements = document.querySelectorAll("[data-i18n]");
    this._cache = new Map();
  }

  _detectLanguage() {
    if (!this._options.detectLanguage) {
      return this._options.defaultLanguage;
    }

    var stored = localStorage.getItem("language");

    if (this._options.persist && stored) {
      return stored;
    }

    var lang = navigator.languages
      ? navigator.languages[0]
      : navigator.language;

    return lang.substr(0, 2);
  }

  _fetch() {
    var path = `${this._options.filesLocation}/${this._lang}.json`;

    return new Promise(function(resolve) {
      fetch(path)
        .then(response => response.json())
        .then(resolve)
        .catch(() => {
          console.error(
            `Could not load ${path}. Please make sure that the file exists.`
          );
        });
    });
  }

  async _getResource() {
    if (this._cache.has(this._lang)) {
      return JSON.parse(this._cache.get(this._lang));
    }

    var translation = await this._fetch();

    if (!this._cache.has(this._lang)) {
      this._cache.set(this._lang, JSON.stringify(translation));
    }

    return translation;
  }

  async load(lang = null) {
    if (lang) {
      if (!this._options.languages.includes(lang)) {
        return;
      }

      this._lang = lang;
    }

    this.translate(await this._getResource());

    document.documentElement.lang = lang;

    if (this._options.persist) {
      localStorage.setItem("language", this._lang);
    }
  }

  translate(translation) {
    function replace(element) {
      var text = element.dataset.i18n
        .split(".")
        .reduce((obj, i) => obj[i], translation);

      if (text) {
        element.innerHTML = text;
      } else {
        element.innerHTML = element.dataset.i18n;
        console.warn(
          `Could not find text for attribute "${element.dataset.i18n}".`
        );
      }
    }

    this._elements.forEach(replace);
  }

  get defaultConfig() {
    return {
      persist: false,
      languages: ["en"],
      defaultLanguage: "en",
      detectLanguage: true,
      filesLocation: "/i18n"
    };
  }
}

// export default Translator;
var t = new Translator({
  languages: ["en", "de"]
});
