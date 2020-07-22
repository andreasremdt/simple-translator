/**
 * simple-translator
 * A small JavaScript library to translate webpages into different languages.
 * https://github.com/andreasremdt/simple-translator
 *
 * Author: Andreas Remdt <me@andreasremdt.com> (https://andreasremdt.com)
 * License: MIT (https://mit-license.org/)
 */
class Translator {
  /**
   * Initialize the Translator by providing options.
   *
   * @param {Object} options
   */
  constructor(options = {}) {
    this.languages = new Map();
    this.config = Object.assign(Translator.defaultConfig, options);

    if (this.config.registerGlobally) {
      window[this.config.registerGlobally] = this.translateForKey.bind(this);
    }

    if (this.config.detectLanguage) {
      this.detectLanguage();
    }
  }

  /**
   * Detect the users preferred language. If the language is stored in
   * localStorage due to a previous interaction, use it.
   * If no localStorage entry has been found, use the default browser language.
   */
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

  /**
   * Get a translated value from a JSON by providing a key. Additionally,
   * the target language can be specified as second parameter.
   *
   * @param {String} key The key to translate.
   * @param {String} toLanguage The (optional) target language.
   * @return {String}
   */
  getValueFromJSON(key, toLanguage = this.config.defaultLanguage) {
    const json = this.languages.get(toLanguage);

    return key.split('.').reduce((obj, i) => obj[i], json);
  }

  /**
   * Print a message to the browser's console. Only print the message
   * if the user set the config parameter `debug` to `true`.
   *
   * @param {String} message The message to print to the console.
   */
  debug(message) {
    if (this.config.debug) {
      console.error(message);
    }
  }

  /**
   * Replace a given DOM nodes' property value (by default innerHTML) with
   * a translated value.
   *
   * @param {HTMLElement} element The DOM node to translate.
   * @param {String} toLanguage The target language.
   */
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

  /**
   * Translate all DOM nodes that match the given selector into the
   * specified target language.
   *
   * @param {String} toLanguage The target language.
   */
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

  /**
   * Translate a given key into the specified language if it exists
   * in the translation file.
   *
   * @param {String} key The key from the language file to translate.
   * @param {String} toLanguage The target language.
   * @return {String} The translated string.
   */
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

  /**
   * Add a translation resource to the global cache.
   *
   * @param {*} language The target language.
   * @param {*} json The language resource file in JSON.
   * @return {this}
   */
  add(language, json) {
    this.languages.set(language, json);

    return this;
  }

  /**
   * Remove a translation resource from the global cache.
   *
   * @param {String} language The target language.
   * @return {this}
   */
  remove(language) {
    this.languages.delete(language);

    return this;
  }

  /**
   * Return the default config object whose keys can be overriden
   * by the user's config passed to the constructor.
   *
   * @return {Object}
   */
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
