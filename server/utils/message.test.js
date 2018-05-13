const { generateMessage } = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    const from = 'Chris';
    const text = 'Hello';
    const message = generateMessage(from, text);

    expect(message).toMatchObject({
      from: message.from,
      text: message.text,
    });
    expect(typeof message.createdAt).toBe('number');
  });
});
