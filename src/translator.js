class Translator {
  constructor(options) {
    this._languages = new Map();
    this._config = Object.assign(Translator.defaultConfig, options);

    if (this._config.registerGlobally) {
      window[this._config.registerGlobally] = this.translateForKey.bind(this);
    }

    if (this._config.detectLanguage) {
      this._detectLanguage();
    }
  }

  _detectLanguage() {
    var inMemory = localStorage.getItem(this._config.persistKey);

    if (inMemory) {
      this._config.defaultLanguage = inMemory;
    } else {
      var lang = navigator.languages
        ? navigator.languages[0]
        : navigator.language;
  
      this._config.defaultLanguage = lang.substr(0, 2);
    }
  }

  _getValueFromJSON(key, toLanguage) {
    var json = this._languages.get(toLanguage ? toLanguage : this._config.defaultLanguage);

    return key.split(".").reduce((obj, i) => obj[i], json);
  }

  _debug(message) {
    if (this._config.debug) {
      console.error(message);
    }
  }

  replace(element, toLanguage) {
    var key = element.getAttribute("data-i18n");
    var property = element.getAttribute("data-i18n-attr") || "innerHTML";
    var text = this._getValueFromJSON(key, toLanguage);

    if (text) {
      element[property] = text;
    } else {
      this._debug(`No translation found for key "${key}" in language "${toLanguage}".`);
    }
  }

  translatePageTo(toLanguage = this._config.defaultLanguage) {
    if (!this._languages.has(toLanguage)) {
      this._debug(`No translation for lang key "${toLanguage}" has been specified.`);
      return;
    }

    document
      .querySelectorAll(this._config.selector)
      .forEach((element) => this.replace(element, toLanguage));

    if (this._config.persist) {
      localStorage.setItem(this._config.persistKey, toLanguage);
    }
  }

  translateForKey(key, toLanguage = this._config.defaultLanguage) {
    if (!this._languages.has(toLanguage)) {
      this._debug(`No translation for lang key "${toLanguage}" has been specified.`);
      return;
    }

    var text = this._getValueFromJSON(key, toLanguage);

    if (!text) {
      this._debug(`No translation found for key "${key}" in language "${toLanguage}".`);
      return;
    }

    return text;
  }

  add(language, json) {
    this._languages.set(language, json);

    return this;
  }

  static get defaultConfig() {
    return {
      defaultLanguage: 'en',
      selector: '[data-i18n]',
      debug: false,
      registerGlobally: '__',
      detectLanguage: true,
      persist: false,
      persistKey: 'preferred_language'
    };
  }
}

export default Translator;