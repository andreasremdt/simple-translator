import { logger } from '../src/utils.js';

describe('logger()', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(window.console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not log when disabled', () => {
    logger(false)('SOME_ERROR');

    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('should log a comprehensive error message', () => {
    logger(true)('INVALID_PARAM_LANGUAGE');

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error code: INVALID_PARAM_LANGUAGE')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'https://github.com/andreasremdt/simple-translator#usage'
      )
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('This error happened in the method')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("If you don't want to see these error messages")
    );
  });

  it('should have a default fallback', () => {
    logger(true)('SOME_ERROR');

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Unhandled Error')
    );
  });
});
