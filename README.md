#cryptr

cryptr is a simple encrypt and decrypt module for node.js

It is for doing simple encryption of values that need to be decrypted at a later time.

The Cryptr constructor takes 2 option arguments.

	Cryptr([secret, algorithm])

If a secret is not provided the default secret is used but a warning message is logged to the console.

	Cryptr: Warning - Using default secret...

If an algorithm is not provided it defaults to *aes256*.

**DO NOT USE THIS MODULE FOR ENCRYPTING PASSWORDS!**

Passwords should be a one way hash. Use [bcrypt](https://npmjs.org/package/bcrypt) for that.

##Install

	npm install cryptr

##Usage

**Simple**

    var Cryptr = require("./cryptr"),
    	cryptr = new Cryptr('myTotalySecretKey');


    var encryptedString = cryptr.encrypt('bacon');   // 876c9f1ce7d2465fb919e66e11daaafc

    cryptr.decrypt(encryptedString);   // bacon

