require('dotenv').config();

const encrypter = require('./encrypter.js');

test('encrypt and decrypt check', () => {
    let text = 'qwer';
    let encryptedText = encrypter.encrypt(text);
    let decryptedText = encrypter.decrypt(encryptedText);
    expect(decryptedText).toBe(text);
});