cryptr
======

Install
-------
npm install cryptr


Usage
-----

	var Cryptr = require("./cryptr"),
		cryptr = new Cryptr('TotesSecretSauce');
		
	
	var encryptedString = cryptr.encrypt('bacon');
	var decryptedString = cryptr.decrypt(encryptedString);