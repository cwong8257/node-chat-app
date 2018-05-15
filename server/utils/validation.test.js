const { isRealString } = require('./validation');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    const result = isRealString();

    expect(result).toBe(false);
  });

  it('should reject strings with only spaces', () => {
    const result = isRealString('    ');

    expect(result).toBe(false);
  });

  it('should allow string with non-space characters', () => {
    const result = isRealString('  hello  ');

    expect(result).toBe(true);
  });
});
