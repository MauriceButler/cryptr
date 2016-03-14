var test = require('grape'),
    mockery = require('mockery'),
    pathToObjectUnderTest = '../';

mockery.registerAllowables([pathToObjectUnderTest]);

function resetMocks(){
    mockery.registerMock('crypto', {
        createCipher: function(){
            return {
                update: function(){},
                final: function(){}
            };
        },
        createDecipher: function(){
            return {
                update: function(){},
                final: function(){}
            };
        }
    });
}

function getCleanTestObject(){
    delete require.cache[require.resolve(pathToObjectUnderTest)];
    mockery.enable({ useCleanCache: true, warnOnReplace: false });
    var objectUnderTest = require(pathToObjectUnderTest);
    mockery.disable();
    resetMocks();
    return objectUnderTest;
}

resetMocks();

test('simple default case', function(t){
    t.plan(2);

    var Cryptr = require('../'),
        cryptr = new Cryptr('foo'),
        testValue = 'bacon',
        encrypted = cryptr.encrypt(testValue),
        decrypted = cryptr.decrypt(encrypted);

    t.equal(encrypted, '2fa603799f', 'correctly encrypted using AES-256-CTR');
    t.equal(decrypted, testValue, 'got correct decrypted value back');
});

test('defaults algorithm and secret', function(t){
    t.plan(4);

    mockery.registerMock('crypto', {
        createCipher: function(algorithm, secret){
            t.equal(algorithm, 'AES-256-CTR', 'correctly defaults algorithm');
            t.equal(secret, 'foo', 'correctly passes secret');
            return {
                update: function(){},
                final: function(){}
            };
        },
        createDecipher: function(algorithm, secret){
            t.equal(algorithm, 'AES-256-CTR', 'correctly defaults algorithm');
            t.equal(secret, 'foo', 'correctly passes secret');
            return {
                update: function(){},
                final: function(){}
            };
        }
    });

    var Cryptr = getCleanTestObject(),
        cryptr = new Cryptr('foo'),
        testValue = 'bacon',
        encrypted = cryptr.encrypt(testValue),
        decrypted = cryptr.decrypt(encrypted);
});

test('uses provided algorithm and secret', function(t){
    t.plan(4);

    var testAlgorithm = 'foo',
        testSecret = 'bar';

    mockery.registerMock('crypto', {
        createCipher: function(algorithm, secret){
            t.equal(algorithm, testAlgorithm, 'correct algorithm');
            t.equal(secret, testSecret, 'correct secret');
            return {
                update: function(){},
                final: function(){}
            };
        },
        createDecipher: function(algorithm, secret){
            t.equal(algorithm, testAlgorithm, 'correct algorithm');
            t.equal(secret, testSecret, 'correct secret');
            return {
                update: function(){},
                final: function(){}
            };
        }
    });

    var Cryptr = getCleanTestObject(),
        cryptr = new Cryptr(testSecret, testAlgorithm),
        testValue = 'bacon',
        encrypted = cryptr.encrypt(testValue),
        decrypted = cryptr.decrypt(encrypted);
});
