/**
 * @jest-environment node
 */

import Translator from '../src/translator.js';

describe('constructor()', () => {
  let translator;

  it('creates a global helper', () => {
    translator = new Translator();

    expect(global.__).toBeDefined();

    translator = new Translator({ registerGlobally: 't' });

    expect(global.t).toBeDefined();

    delete global.__;
    delete global.t;
  });

  it('should not create a global helper when turned off', () => {
    translator = new Translator({ registerGlobally: false });

    expect(global.__).toBeUndefined();
  });

  it('should not try to detect the language on node', () => {
    const spy = jest.spyOn(Translator.prototype, '_detectLanguage');
    translator = new Translator();

    expect(spy).not.toHaveBeenCalled();
    expect(translator.config.defaultLanguage).toBe('en');
  });
});

describe('translatePageTo()', () => {
  let translator;
  let consoleSpy;

  beforeEach(() => {
    translator = new Translator({ debug: true });
    translator.add('de', { title: 'Deutscher Titel' });
    consoleSpy = jest.spyOn(global.console, 'error').mockImplementation();
  });

  afterEach(() => {
    translator = null;
    jest.clearAllMocks();
  });

  it('should not do anything on node', () => {
    translator.translatePageTo('de');

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('INVALID_ENVIRONMENT')
    );
    consoleSpy.mockClear();
  });
});

describe('fetch()', () => {
  let translator;
  let consoleSpy;
  const RESOURCE_FILES = {
    de: { title: 'Deutscher Titel', paragraph: 'Hallo Welt' },
    en: { title: 'English title', paragraph: 'Hello World' },
  };

  jest.mock('fs', () => ({
    readFileSync: jest.fn((url) => {
      if (url.includes('de.json')) {
        return JSON.stringify({
          title: 'Deutscher Titel',
          paragraph: 'Hallo Welt',
        });
      } else if (url.includes('en.json')) {
        return JSON.stringify({
          title: 'English title',
          paragraph: 'Hello World',
        });
      }
    }),
  }));

  beforeEach(() => {
    translator = new Translator({ debug: true });
    consoleSpy = jest.spyOn(global.console, 'error').mockImplementation();
  });

  it('fetches a single resource using cjs', (done) => {
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
        expect.stringContaining('MODULE_NOT_FOUND')
      );
      done();
    });
  });
});
