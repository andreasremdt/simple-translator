"use strict";

class Translator {
  constructor() {
    this._lang = this.getLanguage();
    this._elements = document.querySelectorAll("[data-i18n]");
  }

  getLanguage() {
    var stored = localStorage.getItem("language");

    if (stored) {
      return stored;
    }
    
    var lang = navigator.languages ? navigator.languages[0] : navigator.language;

    return lang.substr(0, 2);
  }

  load(lang = null) {
    if (lang) {
      this._lang = lang;
    }

    fetch(`/i18n/${this._lang}.js`)
      .then((response) => response.json())
      .then((translation) => {
        this.translate(translation);
        this.toggleLangTag();
      })
      .catch(() => {
        console.error(`Could not load "${this._lang}.js". Please make sure that the path is correct.`);
      });
  }

  toggleLangTag() {
    if (document.documentElement.lang !== this._lang) {
      document.documentElement.lang = this._lang;
    }
  }
  
  translate(translation) {
    function replace(element) {
      var text = element.dataset.i18n.split('.').reduce((obj, i) => obj[i], translation);
  
      if (text) {
        element.innerHTML = text;
      }
    }
  
    this._elements.forEach(replace);
  }
}

export default Translator;