const test = require('tape');
const Cryptr = require('../');

const testSecret = 'myTotalySecretKey';
const testData = 'bacon';

test('works...', t => {
    t.plan(1);

    const cryptr = new Cryptr(testSecret);
    const encryptedString = cryptr.encrypt(testData);
    const decryptedString = cryptr.decrypt(encryptedString);

    t.equal(decryptedString, testData, 'decrypted aes256 correctly');
});

test('works with utf8 specific characters', t => {
    t.plan(1);

    const testString = 'ßáÇÖÑ 🥓';
    const cryptr = new Cryptr(testSecret);
    const encryptedString = cryptr.encrypt(testString);
    const decryptedString = cryptr.decrypt(encryptedString);

    t.equal(decryptedString, testString, 'decrypted aes256 correctly with UTF8 chars');
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

test('decrypt goes bang if value has been tampered with', t => {
    t.plan(1);

    const cryptr = new Cryptr(testSecret);

    const encryptedString = cryptr.encrypt(testData);

    const encryptedBuffer = Buffer.from(encryptedString, 'hex');
    const b1 = Buffer.from(testData);
    const b2 = Buffer.from('hello');

    for (let i = 0; i < b1.length; i++) {
        encryptedBuffer[i + 16] ^= b1[i] ^ b2[i];
    }

    const modifiedValue = encryptedBuffer.toString('hex');

    t.throws(
        () => cryptr.decrypt(modifiedValue),
        /Unsupported state or unable to authenticate data/,
        'throws on tampered data',
    );
});
