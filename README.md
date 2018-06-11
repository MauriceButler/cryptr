# cryptr

cryptr is a simple `aes-256-ctr` encrypt and decrypt module for node.js

It is for doing simple encryption of values UTF-8 strings that need to be decrypted at a later time.

If you require anything more than that you probably want to use something more advanced or [crypto](https://nodejs.org/api/crypto.html) directly.

The Cryptr constructor takes 1 required argument.

`Cryptr(secret)`

The `iv` is randomly generated and prepended to the result

**DO NOT USE THIS MODULE FOR ENCRYPTING PASSWORDS!**

Passwords should be a one way hash. Use [bcrypt](https://npmjs.org/package/bcrypt) for that.

## Install

`npm install cryptr`

## Usage

```javascript
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

const encryptedString = cryptr.encrypt('bacon');
const decryptedString = cryptr.decrypt(encryptedString);

console.log(encryptedString); // 5590fd6409be2494de0226f5d7
console.log(decryptedString); // bacon
```
