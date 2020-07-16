class Translator {
  constructor(options) {
    this.languages = new Map();
    this.config = Object.assign(Translator.defaultConfig, options);

    if (this.config.registerGlobally) {
      window[this.config.registerGlobally] = this.translateForKey.bind(this);
    }

    if (this.config.detectLanguage) {
      this.detectLanguage();
    }
  }

  detectLanguage() {
    const inMemory = localStorage.getItem(this.config.persistKey);

    if (inMemory) {
      this.config.defaultLanguage = inMemory;
    } else {
      const lang = navigator.languages
        ? navigator.languages[0]
        : navigator.language;

      this.config.defaultLanguage = lang.substr(0, 2);
    }
  }

  getValueFromJSON(key, toLanguage) {
    const json = this.languages.get(toLanguage || this.config.defaultLanguage);

    return key.split('.').reduce((obj, i) => obj[i], json);
  }

  debug(message) {
    if (this.config.debug) {
      console.error(message);
    }
  }

  replace(element, toLanguage) {
    const key = element.getAttribute('data-i18n');
    const property = element.getAttribute('data-i18n-attr') || 'innerHTML';
    const text = this.getValueFromJSON(key, toLanguage);

    if (text) {
      element[property] = text;
    } else {
      this.debug(
        `No translation found for key "${key}" in language "${toLanguage}".`
      );
    }
  }

  translatePageTo(toLanguage = this.config.defaultLanguage) {
    if (!this.languages.has(toLanguage)) {
      this.debug(
        `No translation for lang key "${toLanguage}" has been specified.`
      );
      return;
    }

    document
      .querySelectorAll(this.config.selector)
      .forEach((element) => this.replace(element, toLanguage));

    if (this.config.persist) {
      localStorage.setItem(this.config.persistKey, toLanguage);
    }
  }

  translateForKey(key, toLanguage = this.config.defaultLanguage) {
    if (!this.languages.has(toLanguage)) {
      this.debug(
        `No translation for lang key "${toLanguage}" has been specified.`
      );
      return;
    }

    const text = this.getValueFromJSON(key, toLanguage);

    if (!text) {
      this.debug(
        `No translation found for key "${key}" in language "${toLanguage}".`
      );
      return;
    }

    return text;
  }

  add(language, json) {
    this.languages.set(language, json);

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
      persistKey: 'preferred_language',
    };
  }
}

export default Translator;
