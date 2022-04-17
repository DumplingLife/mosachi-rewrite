const crypto = require('crypto');
const algorithm = 'aes256';
const key = process.env.PASSWORD_ENCRYPTION_SECRET;

if(!key) {
    console.error('encrypter.js: key not found, probably forgot to set it in .env, or forgot to call require(\'dotenv\')');
}

function encrypt(text) {
    let iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    let encryptedText = [
        encrypted + cipher.final("hex"),
        Buffer.from(iv).toString("hex"),
    ].join("|")
    return encryptedText;
}

function decrypt(encryptedText) {
    let [encrypted, iv] = encryptedText.split("|");
    let decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, "hex"));
    let text = decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
    return text;
}

module.exports = {
    encrypt: encrypt,
    decrypt: decrypt,
};