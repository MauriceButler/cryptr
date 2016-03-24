#cryptr

cryptr is a simple encrypt and decrypt module for node.js

It is for doing simple encryption of values UTF-8 strings that need to be decrypted at a later time.

If you require anything more than that you probably want to use something more advanced or [crypto](https://nodejs.org/api/crypto.html) directly.

The Cryptr constructor takes 1 required and 1 optional argument.

	Cryptr(secret[, algorithm])

If an algorithm is not provided it defaults to `aes-256-ctr`.


**DO NOT USE THIS MODULE FOR ENCRYPTING PASSWORDS!**

Passwords should be a one way hash. Use [bcrypt](https://npmjs.org/package/bcrypt) for that.


## Install

	npm install cryptr

## Usage

``` javascript
var Cryptr = require('cryptr'),
    cryptr = new Cryptr('myTotalySecretKey');


var encryptedString = cryptr.encrypt('bacon'),
    decryptedString = cryptr.decrypt(encryptedString);

console.log(encryptedString);  // d7233809c0
console.log(decryptedString);  // bacon
```

