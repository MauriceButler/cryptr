const test = require('tape');
const Cryptr = require('../');

const testSecret = 'myTotalySecretKey';
const testData = 'bacon';

test('works...', t => {
    t.plan(1);

    const cryptr = new Cryptr(testSecret);
    const encryptedString = cryptr.encrypt(testData);
    const decryptedString = cryptr.decrypt(encryptedString);

    t.equal(decryptedString, testData, 'decrypted sha256 correctly');
});

test('works with old iv size values', t => {
    t.plan(1);

    const cryptr = new Cryptr(testSecret);

    const decryptedString = cryptr.decrypt('5590fd6409be2494de0226f5d7');

    t.equal(decryptedString, 'bacon', 'decrypted old iv value');
});

test('goes bang if bad secret', t => {
    const badSecrets = [null, undefined, 0, 123451345134, '', Buffer.from('buffer'), {}];

    t.plan(badSecrets.length);

    for (let i = 0; i < badSecrets.length; i++) {
        t.throws(
            () => new Cryptr(badSecrets[i]),
            /Cryptr: secret must be a non-0-length string/,
            `throws on bad secret ${badSecrets[i]}`,
        );
    }
});

test('encrypt goes bang if value is null or undefined', t => {
    const cryptr = new Cryptr(testSecret);
    const badValues = [null, undefined];

    t.plan(badValues.length);

    for (let i = 0; i < badValues.length; i++) {
        t.throws(
            () => cryptr.encrypt(badValues[i]),
            /value must not be null or undefined/,
            `throws on value ${badValues[i]}`,
        );
    }
});

test('decrypt goes bang if value is null or undefined', t => {
    const cryptr = new Cryptr(testSecret);
    const badValues = [null, undefined];

    t.plan(badValues.length);

    for (let i = 0; i < badValues.length; i++) {
        t.throws(
            () => cryptr.decrypt(badValues[i]),
            /value must not be null or undefined/,
            `throws on value ${badValues[i]}`,
        );
    }
});
