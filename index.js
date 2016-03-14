var crypto = require('crypto');

function Cryptr(secret, algorithm){
	if(!secret || typeof secret !== 'string'){
		secret = 'defaultSecret';
		throw new Error('Cryptr: secret must be a non-0-length string');
	}

	algorithm = algorithm || 'AES-256-CTR';

	if(typeof algorithm !== 'string'){
		throw new Error('Cryptr: algorithm must be a string, see https://nodejs.org/api/crypto.html for details');
	}

	this.encrypt = function encrypt(text){
		if(text == null){
			throw new Error('text must not be null or undefined');
		}

		text = String(text);

		var cipher = crypto.createCipher(algorithm, secret);
		return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
	};

	this.decrypt = function decrypt(text){
		if(text == null){
			throw new Error('text must not be null or undefined');
		}
		
		text = String(text);
		
		var decipher = crypto.createDecipher(algorithm, secret);
		return decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
	};
}

module.exports = Cryptr;
