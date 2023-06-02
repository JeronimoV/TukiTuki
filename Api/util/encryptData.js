const cryptojs = require("crypto-js");

const encrypt = (string) => {
  return cryptojs.AES.encrypt(string, "paj@erovich").toString();
};

const revealEncrypt = (string) => {
  const bytes = cryptojs.AES.decrypt(string, "paj@erovich");
  return bytes.toString(cryptojs.enc.Utf8);
};

module.exports = {
  encrypt,
  revealEncrypt,
};
