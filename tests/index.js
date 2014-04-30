var Cryptr = require('../');

function test(testName, cryptr, testValue){
    testValue = testValue || 'bacon';

    var encrypted = cryptr.encrypt(testValue),
        decrypted = cryptr.decrypt(encrypted);

    console.log(testValue + '');

        if(decrypted === testValue + ''){
            console.log(testName + ' completed successfully.');
        } else {
            console.error(testName + ' failed.');
        }
}

test('Defaults', new Cryptr());
test('With Secret', new Cryptr('myTotalySecretKey'));
test('With aes128', new Cryptr('myTotalySecretKey', 'aes128'));
test('With number', new Cryptr(), 123456);
test('With bool', new Cryptr(), true);
test('With object', new Cryptr(), { foo: 'bar'});
