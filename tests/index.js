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
        cryptr = new Cryptr(),
        testValue = 'bacon',
        encrypted = cryptr.encrypt(testValue),
        decrypted = cryptr.decrypt(encrypted);

    t.equal(encrypted, 'f12b9f2b00088f6bb57df61296a1a03b', 'correctly encrypted using aes256');
    t.equal(decrypted, testValue, 'got correct decrypted value back');
});

test('defaults algorithm and secret', function(t){
    t.plan(4);

    mockery.registerMock('crypto', {
        createCipher: function(algorithm, secret){
            t.equal(algorithm, 'aes256', 'correctly defaults algorithm');
            t.equal(secret, 'defaultSecret', 'correctly defaults secret');
            return {
                update: function(){},
                final: function(){}
            };
        },
        createDecipher: function(algorithm, secret){
            t.equal(algorithm, 'aes256', 'correctly defaults algorithm');
            t.equal(secret, 'defaultSecret', 'correctly defaults secret');
            return {
                update: function(){},
                final: function(){}
            };
        }
    });

    var Cryptr = getCleanTestObject(),
        cryptr = new Cryptr(),
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
