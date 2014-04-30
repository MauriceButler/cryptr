var crypto = require('crypto');

function Cryptr(secret, algorithm){
	if(!secret){
		secret = 'defaultSecret';
		console.warn('Cryptr: Using default secret...');
	}

	algorithm = algorithm || 'aes256';

	this.encrypt = function encrypt(text){
		if(typeof text !== 'string' && text.toString){
			text = text.toString();
		}

		var cipher = crypto.createCipher(algorithm, secret);
		return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
	};

	this.decrypt = function decrypt(text){
		if(typeof text !== 'string' && text.toString){
			text = text.toString();
		}
		var decipher = crypto.createDecipher(algorithm, secret);
		return decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
	};
}

module.exports = Cryptr;
