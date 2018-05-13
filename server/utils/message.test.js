const { generateMessage, generateLocationMessage } = require('./message');

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

describe('generateLocationMessage', () => {
  it('should generate correct location message', () => {
    const from = 'Chris';
    const longitude = 19;
    const latitude = 93;
    const location = generateLocationMessage(from, longitude, latitude);

    expect(location).toMatchObject({
      from,
      url: 'https://www.google.com/maps?q=19,93',
    });
    expect(typeof location.createdAt).toBe('number');
  });
});
