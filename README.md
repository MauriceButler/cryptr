# cryptr

cryptr is a simple `aes-256-gcm` encrypt and decrypt module for node.js

It is for doing simple encryption of values UTF-8 strings that need to be decrypted at a later time.

If you require anything more than that you probably want to use something more advanced or [crypto](https://nodejs.org/api/crypto.html) directly.

The Cryptr constructor takes 1 required argument, and an optional options object.

`Cryptr(secret[, options])`

-   secret: `<string>`
-   options: `<Object>`
    -   pbkdf2Iterations: `<number>` Defaults to 100000
    -   saltLength: `<number>` Defaults to 64

The `salt` and `iv` are randomly generated and prepended to the result.

**DO NOT USE THIS MODULE FOR ENCRYPTING PASSWORDS!**

Passwords should be a one way hash. Use [bcrypt](https://npmjs.org/package/bcrypt) for that.

## Install

`npm install cryptr`

## Usage

```javascript
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey');

const encryptedString = cryptr.encrypt('bacon');
const decryptedString = cryptr.decrypt(encryptedString);

console.log(encryptedString); // 2a3260f5ac4754b8ee3021ad413ddbc11f04138d01fe0c5889a0dd7b4a97e342a4f43bb43f3c83033626a76f7ace2479705ec7579e4c151f2e2196455be09b29bfc9055f82cdc92a1fe735825af1f75cfb9c94ad765c06a8abe9668fca5c42d45a7ec233f0
console.log(decryptedString); // bacon
```

#### With Options

```javascript
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey', { pbkdf2Iterations: 10000, saltLength: 10 });

const encryptedString = cryptr.encrypt('bacon');
const decryptedString = cryptr.decrypt(encryptedString);

console.log(encryptedString); // 33b2c319908e72e899db0cad10dd1e24a999cd4922d64c6fbe261020f97ed4fdfe07124268df34bae00ee09f9d91a7
console.log(decryptedString); // bacon
```
