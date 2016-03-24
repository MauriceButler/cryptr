var test = require('tape'),
    Cryptr = require('../'),
    testSecret = 'myTotalySecretKey',
    testData = 'bacon';

test('defaults to aes-256-ctr', function(t){
    t.plan(2);

    var cryptr = new Cryptr(testSecret),
        encryptedString = cryptr.encrypt(testData),
        decryptedString = cryptr.decrypt(encryptedString);

    t.equal(encryptedString, 'd7233809c0', 'encrypted with aes-256-ctr');
    t.equal(decryptedString, testData, 'decrypted aes-256-ctr correctly');
});

test('uses provided algorithm', function(t){
    t.plan(2);

    var cryptr = new Cryptr(testSecret, 'aes256'),
        encryptedString = cryptr.encrypt(testData),
        decryptedString = cryptr.decrypt(encryptedString);

    t.equal(encryptedString, 'e74d7c0de21e72aaffc8f2eef2bdb7c1', 'encrypted with aes256');
    t.equal(decryptedString, testData, 'decrypted aes256 correctly');
});

test('goes bang if bad secret', function(t){
    var badSecrets = [
            null,
            undefined,
            0,
            123451345134,
            '',
            new Buffer('buffer'),
            {}
        ];

    t.plan(badSecrets.length);

    for (var i = 0; i < badSecrets.length; i++) {
        t.throws(
            function(){
                new Cryptr(badSecrets[i]);
            },
            /Cryptr: secret must be a non-0-length string/,
            'throws on bad secret ' + badSecrets[i]
        );
    }
});

test('goes bang if bad algorithm', function(t){
    var badAlgorithms = [
            123451345134,
            {},
            new Buffer('buffer')
        ];

    t.plan(badAlgorithms.length);

    for (var i = 0; i < badAlgorithms.length; i++) {
        t.throws(
            function(){
                new Cryptr(testSecret, badAlgorithms[i]);
            },
            /Cryptr: algorithm must be a string, see https:\/\/nodejs.org\/api\/crypto\.html for details/,
            'throws on bad algorithm ' + badAlgorithms[i]
        );
    }
});

test('encrypt goes bang if value is null or undefined', function(t){
    var cryptr = new Cryptr(testSecret),
        badValues = [
            null,
            undefined
        ];

    t.plan(badValues.length);

    for (var i = 0; i < badValues.length; i++) {
        t.throws(
            function(){
                cryptr.encrypt(badValues[i]);
            },
            /value must not be null or undefined/,
            'throws on value ' + badValues[i]
        );
    }
});

test('decrypt goes bang if value is null or undefined', function(t){
    var cryptr = new Cryptr(testSecret),
        badValues = [
            null,
            undefined
        ];

    t.plan(badValues.length);

    for (var i = 0; i < badValues.length; i++) {
        t.throws(
            function(){
                cryptr.decrypt(badValues[i]);
            },
            /value must not be null or undefined/,
            'throws on value ' + badValues[i]
        );
    }
});