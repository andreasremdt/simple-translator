"use strict";

class Translator {
  constructor(options = {}) {
    this._options = Object.assign({}, this.defaultConfig, options);
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

  _fetch(path) {
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

  async _getResource(lang) {
    if (this._cache.has(lang)) {
      return JSON.parse(this._cache.get(lang));
    }

    var translation = await this._fetch(
      `${this._options.filesLocation}/${lang}.json`
    );

    if (!this._cache.has(lang)) {
      this._cache.set(lang, JSON.stringify(translation));
    }

    return translation;
  }

  async load(lang) {
    if (!this._options.languages.includes(lang)) {
      return;
    }

    this._translate(await this._getResource(lang));

    document.documentElement.lang = lang;

    if (this._options.persist) {
      localStorage.setItem("language", lang);
    }
  }

  async getTranslationByKey(lang, key) {
    if (!key) throw new Error("Expected a key to translate, got nothing.");
    if (typeof key != "string")
      throw new Error(
        `Expected a string for the key parameter, got ${typeof key} instead.`
      );

    var translation = await this._getResource(lang);

    return key.split(".").reduce((obj, i) => obj[i], translation);
  }

  _translate(translation) {
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
