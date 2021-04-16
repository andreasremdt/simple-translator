import Translator from '../src/translator.js';
import { buildHTML, removeHTML } from './test-utils.js';

describe('constructor()', () => {
  let translator;
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(window.console, 'error').mockImplementation();
  });

  afterEach(() => {
    translator = null;
    jest.clearAllMocks();
  });

  it('has sensible default options', () => {
    expect(Translator.defaultConfig).toMatchSnapshot();
  });

  it('overrides the default config with user options', () => {
    translator = new Translator({
      selector: '__',
      persist: true,
    });

    expect(translator.config).toMatchObject({
      selector: '__',
      persist: true,
      detectLanguage: true,
      filesLocation: '/i18n',
    });
  });

  it('creates a global helper', () => {
    translator = new Translator();

    expect(window.__).toBeDefined();

    translator = new Translator({ registerGlobally: 't' });

    expect(window.t).toBeDefined();

    delete window.__;
    delete window.t;
  });

  it('should not create a global helper when turned off', () => {
    translator = new Translator({ registerGlobally: false });

    expect(window.__).toBeUndefined();
  });

  it('detects the correct language automatically', () => {
    const languageGetter = jest.spyOn(window.navigator, 'languages', 'get');

    expect(new Translator().config.defaultLanguage).toBe('en');

    languageGetter.mockReturnValue(['de-DE', 'de']);

    expect(new Translator().config.defaultLanguage).toBe('de');

    languageGetter.mockReset();
  });

  it('should not detect the default language when turned off', () => {
    translator = new Translator({ detectLanguage: false });

    expect(translator.config.defaultLanguage).toBe('en');
  });

  it('validates the user options', () => {
    translator = new Translator([]);
    translator = new Translator(false);
    translator = new Translator('test');

    expect(translator.config).toMatchObject(Translator.defaultConfig);
    expect(consoleSpy).toHaveBeenCalledTimes(3);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('INVALID_OPTIONS')
    );
  });

  it('reads the last used language from localStorage', () => {
    localStorage.setItem('preferred_language', 'de');

    translator = new Translator();

    expect(translator.config.defaultLanguage).toBe('de');

    localStorage.removeItem('preferred_language');
    localStorage.setItem('custom_language', 'nl');

    translator = new Translator({
      persistKey: 'custom_language',
    });

    expect(translator.config.defaultLanguage).toBe('nl');

    localStorage.removeItem('custom_language');
  });

  it('should not print console errors when debugging is turned off', () => {
    translator = new Translator();

    translator.add({});

    expect(consoleSpy).toHaveBeenCalledTimes(0);
  });
});

describe('add()', () => {
  let translator;
  let consoleSpy;

  beforeEach(() => {
    translator = new Translator({ debug: true });
    consoleSpy = jest.spyOn(window.console, 'error').mockImplementation();
  });

  afterEach(() => {
    translator = null;
    jest.clearAllMocks();
  });

  it('adds a single language', () => {
    expect(translator.languages.size).toBe(0);

    translator.add('de', { title: 'German title' });

    expect(translator.languages.size).toBe(1);
    expect(translator.languages.get('de')).toMatchObject({
      title: 'German title',
    });
  });

  it('adds multiple languages using chaining', () => {
    expect(translator.languages.size).toBe(0);

    translator
      .add('de', { title: 'German title' })
      .add('en', { title: 'English title' });

    expect(translator.languages.size).toBe(2);
    expect(translator.languages.get('de')).toMatchObject({
      title: 'German title',
    });
  });

  it('requires a valid language key', () => {
    translator.add();

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('INVALID_PARAM_LANGUAGE')
    );
    consoleSpy.mockClear();

    translator.add(true).add({}).add([]).add(1);

    expect(consoleSpy).toHaveBeenCalledTimes(4);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('INVALID_PARAM_LANGUAGE')
    );
    consoleSpy.mockClear();

    translator.add('');

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('EMPTY_PARAM_LANGUAGE')
    );
    expect(translator.languages.size).toBe(0);
  });

  it('requires a valid json translation', () => {
    translator
      .add('de')
      .add('de', true)
      .add('de', 1)
      .add('de', 'text')
      .add('de', []);

    expect(consoleSpy).toHaveBeenCalledTimes(5);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('INVALID_PARAM_JSON')
    );
    consoleSpy.mockClear();

    translator.add('de', {});

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('EMPTY_PARAM_JSON')
    );
    expect(translator.languages.size).toBe(0);
  });
});

describe('remove()', () => {
  let translator;
  let consoleSpy;

  beforeEach(() => {
    translator = new Translator({ debug: true });
    translator
      .add('de', { title: 'German title' })
      .add('en', { title: 'English title' });
    consoleSpy = jest.spyOn(window.console, 'error').mockImplementation();
  });

  afterEach(() => {
    translator = null;
    jest.clearAllMocks();
  });

  it('removes an existing language', () => {
    translator.remove('de');

    expect(translator.languages.size).toBe(1);
    expect(translator.languages.get('de')).toBeUndefined();
    expect(translator.languages.get('en')).toBeDefined();
  });

  it('removes multiple existing languages', () => {
    translator.remove('de').remove('en');

    expect(translator.languages.size).toBe(0);
  });

  it("doesn't remove anything when the given language doesn't exist", () => {
    translator.remove('nl');

    expect(translator.languages.size).toBe(2);
    expect(translator.languages.get('de')).toBeDefined();
    expect(translator.languages.get('en')).toBeDefined();
  });

  it('requires a valid language key', () => {
    translator.remove(true).remove({}).remove([]).remove(1);

    expect(consoleSpy).toHaveBeenCalledTimes(4);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('INVALID_PARAM_LANGUAGE')
    );
    consoleSpy.mockClear();

    translator.remove('');

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('EMPTY_PARAM_LANGUAGE')
    );
    expect(translator.languages.size).toBe(2);
  });
});

describe('translateForKey()', () => {
  let translator;
  let consoleSpy;

  beforeEach(() => {
    translator = new Translator({ debug: true });
    translator
      .add('de', { title: 'German title' })
      .add('en', { title: 'English title' });
    consoleSpy = jest.spyOn(window.console, 'error').mockImplementation();
  });

  afterEach(() => {
    translator = null;
    jest.clearAllMocks();
  });

  it('returns a string with the translated text', () => {
    const text = translator.translateForKey('title', 'de');

    expect(text).toBe('German title');
  });

  it('uses the default language (en) if no second parameter is provided', () => {
    const text = translator.translateForKey('title');

    expect(text).toBe('English title');
  });

  it('works with the global helper', () => {
    const text = window.__('title', 'de');

    expect(text).toBe('German title');
  });

  it('displays an error when no translation has been found', () => {
    const text = translator.translateForKey('not.existing');

    expect(text).toBeNull();
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('TRANSLATION_NOT_FOUND')
    );
  });

  it('requires a valid language key', () => {
    const texts = [
      translator.translateForKey({}),
      translator.translateForKey(false),
      translator.translateForKey(1),
      translator.translateForKey(''),
    ];

    expect(texts).toMatchObject([null, null, null, null]);
    expect(consoleSpy).toHaveBeenCalledTimes(4);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('INVALID_PARAM_KEY')
    );
  });

  it("displays an error when the target language doesn't exist", () => {
    const text = translator.translateForKey('title', 'nl');

    expect(text).toBeNull();
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('NO_LANGUAGE_REGISTERED')
    );
  });
});

describe('translatePageTo()', () => {
  let translator;
  let consoleSpy;

  beforeEach(() => {
    translator = new Translator({ debug: true });
    translator
      .add('de', { title: 'Deutscher Titel', paragraph: 'Hallo Welt' })
      .add('en', { title: 'English title', paragraph: 'Hello World' });
    consoleSpy = jest.spyOn(window.console, 'error').mockImplementation();
  });

  afterEach(() => {
    translator = null;
    jest.clearAllMocks();
  });

  it("translates an element's innerHTML to the given language", () => {
    // Tests the following:
    //
    // <h1 data-i18n="title"></h1>
    // <p data-i18n="paragraph"></p>
    const { h1, p } = buildHTML({
      title: { keys: 'title' },
      paragraph: { keys: 'paragraph' },
    });

    expect(h1.textContent).toBe('Default heading text');
    expect(p.textContent).toBe('Default content text');

    translator.translatePageTo('de');

    expect(h1.textContent).toBe('Deutscher Titel');
    expect(p.textContent).toBe('Hallo Welt');

    translator.translatePageTo('en');

    expect(h1.textContent).toBe('English title');
    expect(p.textContent).toBe('Hello World');

    removeHTML(h1, p);
  });

  it("translates an element's innerHTML to the default language", () => {
    // Tests the following:
    //
    // <h1 data-i18n="title"></h1>
    // <p data-i18n="paragraph"></p>
    const { h1, p } = buildHTML({
      title: {
        keys: 'title',
      },
      paragraph: {
        keys: 'paragraph',
      },
    });

    translator.translatePageTo();

    expect(h1.textContent).toBe('English title');
    expect(p.textContent).toBe('Hello World');

    removeHTML(h1, p);
  });

  it('persists the last used language in localStorage', () => {
    // Tests the following:
    //
    // <h1 data-i18n="title"></h1>
    const { h1, p } = buildHTML({
      title: {
        keys: 'title',
      },
      paragraph: {
        keys: 'paragraph',
      },
    });

    translator.config.persist = true;
    translator.translatePageTo('de');

    expect(localStorage.getItem('preferred_language')).toBe('de');

    localStorage.removeItem('preferred_language');
    translator.config.persistKey = 'custom_language';
    translator.translatePageTo('de');

    expect(localStorage.getItem('preferred_language')).toBeNull();
    expect(localStorage.getItem('custom_language')).toBe('de');

    localStorage.removeItem('custom_language');

    removeHTML(h1, p);
  });

  it('uses a custom selector when provided', () => {
    // Tests the following:
    //
    // <h1 data-i18n="title"></h1>
    // <p data-i18n="paragraph"></p>
    const { h1, p } = buildHTML({
      title: {
        keys: 'title',
      },
      paragraph: {
        keys: 'paragraph',
      },
    });

    translator.config.selector = document.querySelectorAll('h1');
    translator.translatePageTo('de');

    expect(h1.textContent).toBe('Deutscher Titel');
    expect(p.textContent).toBe('Default content text');

    translator.config.selector = document.querySelector('p');
    translator.translatePageTo('de');

    expect(p.textContent).toBe('Hallo Welt');

    removeHTML(h1, p);
  });

  it("doesn't do anything when no elements match the selector", () => {
    // Tests the following:
    //
    // <h1 data-i18n="title"></h1>
    // <p data-i18n="paragraph"></p>
    const { h1, p } = buildHTML({
      title: {
        keys: 'title',
      },
      paragraph: {
        keys: 'paragraph',
      },
    });

    translator.config.selector = document.querySelectorAll('span');
    translator.translatePageTo('de');

    expect(h1.textContent).toBe('Default heading text');
    expect(p.textContent).toBe('Default content text');

    removeHTML(h1, p);
  });

  it("translates an element's custom attribute", () => {
    // Tests the following:
    //
    // <h1 data-i18n="title" data-i18n-attr="title"></h1>
    // <p data-i18n="paragraph" data-i18n-attr="data-msg"></p>
    const { h1, p } = buildHTML({
      title: {
        attrs: 'title',
        keys: 'title',
      },
      paragraph: {
        attrs: 'data-msg',
        keys: 'paragraph',
      },
    });

    translator.translatePageTo('de');

    expect(h1.getAttribute('title')).toBe('Deutscher Titel');
    expect(p.getAttribute('data-msg')).toBe('Hallo Welt');

    removeHTML(h1, p);
  });

  it('translates multiple custom attributes', () => {
    // Tests the following:
    //
    // <h1 data-i18n="title paragraph" data-i18n-attr="title data-msg"></h1>
    const { h1, p } = buildHTML({
      title: {
        attrs: 'title data-msg',
        keys: 'title paragraph',
      },
      paragraph: {
        keys: 'paragraph',
      },
    });

    translator.translatePageTo('de');

    expect(h1.getAttribute('title')).toBe('Deutscher Titel');
    expect(h1.getAttribute('data-msg')).toBe('Hallo Welt');

    removeHTML(h1, p);
  });

  it('requires the same amount of keys and attributes to translate', () => {
    // Tests the following:
    //
    // <h1 data-i18n="title" data-i18n-attr="title data-msg"></h1>
    const { h1, p } = buildHTML({
      title: {
        attrs: 'title data-msg',
        keys: 'title',
      },
      paragraph: {
        keys: 'paragraph',
      },
    });

    translator.translatePageTo('de');

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('MISMATCHING_ATTRIBUTES')
    );
    consoleSpy.mockClear();

    expect(h1.getAttribute('title')).toBe('Deutscher Titel');
    expect(h1.getAttribute('data-msg')).toBeNull();

    removeHTML(h1, p);
  });

  it('displays an error when no translation has been found', () => {
    // Tests the following:
    //
    // <h1 data-i18n="title"></h1>
    // <p data-i18n="not.existing"></p>
    const { h1, p } = buildHTML({
      title: {
        keys: 'title',
      },
      paragraph: {
        keys: 'not.existing',
      },
    });

    translator.translatePageTo('de');

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('TRANSLATION_NOT_FOUND')
    );
    consoleSpy.mockClear();

    expect(h1.textContent).toBe('Deutscher Titel');
    expect(p.textContent).toBe('Default content text');

    removeHTML(h1, p);
  });

  it('requires a valid language key', () => {
    translator.translatePageTo(false);
    translator.translatePageTo({});
    translator.translatePageTo([]);

    expect(consoleSpy).toHaveBeenCalledTimes(3);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('INVALID_PARAM_LANGUAGE')
    );
    consoleSpy.mockClear();

    translator.translatePageTo('');

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('EMPTY_PARAM_LANGUAGE')
    );
    consoleSpy.mockClear();

    translator.translatePageTo('nl');

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('NO_LANGUAGE_REGISTERED')
    );
  });

  it('changes the `lang` attribute', () => {
    translator.translatePageTo('de');

    expect(document.documentElement.lang).toBe('de');

    translator.translatePageTo();

    expect(document.documentElement.lang).toBe('en');
  });
});

describe('fetch()', () => {
  let translator;
  let consoleSpy;
  const RESOURCE_FILES = {
    de: { title: 'Deutscher Titel', paragraph: 'Hallo Welt' },
    en: { title: 'English title', paragraph: 'Hello World' },
  };

  beforeEach(() => {
    translator = new Translator({ debug: true });
    consoleSpy = jest.spyOn(window.console, 'error').mockImplementation();

    global.fetch = jest.fn().mockImplementation((url) => {
      url = url.replace(/\/i18n\//, '').replace(/\.json/, '');

      return Promise.resolve({
        ok: url == 'nl' ? false : true,
        json: () => Promise.resolve(RESOURCE_FILES[url]),
      });
    });
  });

  afterEach(() => {
    translator = null;
    jest.clearAllMocks();
    delete global.fetch;
  });

  it('fetches a single resource', (done) => {
    translator.fetch('de').then((value) => {
      expect(value).toMatchObject(RESOURCE_FILES['de']);
      expect(translator.languages.size).toBe(1);
      expect(translator.languages.get('de')).toMatchObject(
        RESOURCE_FILES['de']
      );
      done();
    });
  });

  it('fetches a multiple resources', (done) => {
    translator.fetch(['de', 'en']).then((value) => {
      expect(value).toMatchObject([RESOURCE_FILES['de'], RESOURCE_FILES['en']]);
      expect(translator.languages.size).toBe(2);
      done();
    });
  });

  it("displays an error when the resource doesn't exist", (done) => {
    translator.fetch('nl').then((value) => {
      expect(value).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('FETCH_ERROR')
      );
      done();
    });
  });

  it('fetches available resources and displays an error for non-existing resources', (done) => {
    translator.fetch(['de', 'nl']).then((value) => {
      expect(value).toMatchObject(RESOURCE_FILES['de']);
      expect(translator.languages.size).toBe(1);
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('FETCH_ERROR')
      );
      done();
    });
  });

  it("only fetches and doesn't save the resources", (done) => {
    translator.fetch('de', false).then((value) => {
      expect(value).toMatchObject(RESOURCE_FILES['de']);
      expect(translator.languages.size).toBe(0);
      done();
    });
  });

  it('accepts sources with and without file extension', (done) => {
    translator.fetch(['/de.json', 'en']).then((value) => {
      expect(value.length).toBe(2);
      done();
    });
  });

  it('requires a valid sources parameter', () => {
    translator.fetch(true);
    translator.fetch({});
    translator.fetch(1);
    translator.fetch();

    expect(consoleSpy).toHaveBeenCalledTimes(4);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('INVALID_PARAMETER_SOURCES')
    );
  });
});

describe('setDefaultLanguage()', () => {
  let translator;
  let consoleSpy;

  beforeEach(() => {
    translator = new Translator({ debug: true });
    translator
      .add('de', { title: 'Deutscher Titel', paragraph: 'Hallo Welt' })
      .add('en', { title: 'English title', paragraph: 'Hello World' });
    consoleSpy = jest.spyOn(window.console, 'error').mockImplementation();
  });

  afterEach(() => {
    translator = null;
    jest.clearAllMocks();
  });

  it('sets a new default language', () => {
    translator.setDefaultLanguage('de');

    expect(translator.translateForKey('title')).toBe('Deutscher Titel');
    expect(translator.config.defaultLanguage).toBe('de');

    translator.setDefaultLanguage('en');

    expect(translator.translateForKey('title')).toBe('English title');
    expect(translator.config.defaultLanguage).toBe('en');
  });

  it("displays an error when the given language isn't registered", () => {
    translator.setDefaultLanguage('es');

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('NO_LANGUAGE_REGISTERED')
    );
  });

  it('displays an error when the given language is invalid', () => {
    translator.setDefaultLanguage();
    translator.setDefaultLanguage('');
    translator.setDefaultLanguage(false);
    translator.setDefaultLanguage({});
    translator.setDefaultLanguage([]);

    expect(consoleSpy).toHaveBeenCalledTimes(5);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('INVALID_PARAM_LANGUAGE')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('EMPTY_PARAM_LANGUAGE')
    );
  });
});

describe('get currentLanguage()', () => {
  let languageGetter;

  beforeEach(() => {
    languageGetter = jest.spyOn(window.navigator, 'languages', 'get');
    languageGetter.mockReturnValue(['de-DE', 'de']);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns the correct language code with auto-detection', () => {
    const translator = new Translator();
    translator
      .add('de', { title: 'Deutscher Titel', paragraph: 'Hallo Welt' })
      .add('en', { title: 'English title', paragraph: 'Hello World' });

    expect(translator.currentLanguage).toBe('de');
    translator.translatePageTo('en');
    expect(translator.currentLanguage).toBe('en');
  });

  it('returns the correct language code without auto-detection', () => {
    const translator = new Translator({
      detectLanguage: false,
      defaultLanguage: 'de',
    });
    translator
      .add('de', { title: 'Deutscher Titel', paragraph: 'Hallo Welt' })
      .add('en', { title: 'English title', paragraph: 'Hello World' });

    expect(translator.currentLanguage).toBe('de');
    translator.translatePageTo('en');
    expect(translator.currentLanguage).toBe('en');
  });
});
