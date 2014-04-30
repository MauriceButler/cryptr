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

    var Cryptr = getCleanTestObject,
        cryptr = new Cryptr(),
        testValue = 'bacon',
        encrypted = cryptr.encrypt(testValue),
        decrypted = cryptr.decrypt(encrypted);
});




// function test(testName, cryptr, testValue){
//     testValue = testValue || 'bacon';

//     var encrypted = cryptr.encrypt(testValue),
//         decrypted = cryptr.decrypt(encrypted);

//     console.log(testValue + '');

//         if(decrypted === testValue + ''){
//             console.log(testName + ' completed successfully.');
//         } else {
//             console.error(testName + ' failed.');
//         }
// }

// test('Defaults', new Cryptr());
// test('With Secret', new Cryptr('myTotalySecretKey'));
// test('With aes128', new Cryptr('myTotalySecretKey', 'aes128'));
// test('With number', new Cryptr(), 123456);
// test('With bool', new Cryptr(), true);
// test('With object', new Cryptr(), { foo: 'bar'});
