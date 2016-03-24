var crypto = require('crypto');

function Cryptr(secret, algorithm){
	if(!secret || typeof secret !== 'string'){
		secret = 'defaultSecret';
		throw new Error('Cryptr: secret must be a non-0-length string');
	}

	algorithm = algorithm || 'aes-256-ctr';

	if(typeof algorithm !== 'string'){
		throw new Error('Cryptr: algorithm must be a string, see https://nodejs.org/api/crypto.html for details');
	}

	this.encrypt = function encrypt(value){
		if(value == null){
			throw new Error('value must not be null or undefined');
		}

		value = String(value);

		var cipher = crypto.createCipher(algorithm, secret);
		return cipher.update(value, 'utf8', 'hex') + cipher.final('hex');
	};

	this.decrypt = function decrypt(value){
		if(value == null){
			throw new Error('value must not be null or undefined');
		}

		value = String(value);

		var decipher = crypto.createDecipher(algorithm, secret);
		return decipher.update(value, 'hex', 'utf8') + decipher.final('utf8');
	};
}

module.exports = Cryptr;
