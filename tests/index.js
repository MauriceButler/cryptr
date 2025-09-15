const test = require('tape');
const Cryptr = require('../');
const CryptrAsync = require('../').CryptrAsync;

const testSecret = 'myTotalySecretKey';
const testData = 'bacon';

test('works...', (t) => {
    t.plan(1);

    const cryptr = new Cryptr(testSecret);
    const encryptedString = cryptr.encrypt(testData);
    const decryptedString = cryptr.decrypt(encryptedString);

    t.equal(decryptedString, testData, 'decrypted aes256 correctly');
});

test('works with custom encoding', (t) => {
    const encodings = ['hex', 'base64', 'latin1'];

    t.plan(encodings.length);

    encodings.forEach((encoding) => {
        const cryptr = new Cryptr(testSecret, { encoding });
        const encryptedString = cryptr.encrypt(testData);
        const decryptedString = cryptr.decrypt(encryptedString);

        t.equal(decryptedString, testData, `decrypted correctly with ${encoding} encoding`);
    });
});

test('custom encoding affects output length', (t) => {
    t.plan(1);

    const cryptr = new Cryptr(testSecret, { encoding: 'base64' });
    const cryptr2 = new Cryptr(testSecret);
    const encryptedString = cryptr.encrypt(testData);
    const encryptedString2 = cryptr2.encrypt(testData);

    t.ok(encryptedString.length < encryptedString2.length, 'custom encoding was shorter');
});

test('works with custom pbkdf2Iterations', (t) => {
    t.plan(1);

    const cryptr = new Cryptr(testSecret, { pbkdf2Iterations: 10000 });
    const encryptedString = cryptr.encrypt(testData);
    const decryptedString = cryptr.decrypt(encryptedString);

    t.equal(decryptedString, testData, 'decrypted aes256 correctly with custom iterations');
});

test('custom pbkdf2Iterations affects speed', (t) => {
    t.plan(1);

    const cryptr = new Cryptr(testSecret, { pbkdf2Iterations: 1000 });
    const cryptr2 = new Cryptr(testSecret);
    const customStart = performance.now();
    for (let index = 0; index < 10; index++) {
        const encryptedString = cryptr.encrypt(testData + index);
        cryptr.decrypt(encryptedString);
    }
    const customEnd = performance.now();

    const defaultStart = performance.now();
    for (let index = 0; index < 10; index++) {
        const encryptedString = cryptr2.encrypt(testData + index);
        cryptr2.decrypt(encryptedString);
    }
    const defaultEnd = performance.now();

    const customTime = customEnd - customStart;
    const defaultTime = defaultEnd - defaultStart;

    t.ok(customTime < defaultTime, 'custom iterations were faster');
});

test('works with custom saltLength', (t) => {
    t.plan(1);

    const cryptr = new Cryptr(testSecret, { saltLength: 10 });
    const encryptedString = cryptr.encrypt(testData);
    const decryptedString = cryptr.decrypt(encryptedString);

    t.equal(decryptedString, testData, 'decrypted aes256 correctly with custom salt length');
});

test('custom saltLength affects output length', (t) => {
    t.plan(1);

    const customSaltLength = 30;
    const cryptr = new Cryptr(testSecret, { saltLength: customSaltLength });
    const cryptr2 = new Cryptr(testSecret);
    const encryptedString = cryptr.encrypt(testData);
    const encryptedString2 = cryptr2.encrypt(testData);

    t.equal(
        encryptedString2.length - encryptedString.length,
        (64 - customSaltLength) * 2,
        'output length is affected by salt length',
    );
});

test('works with utf8 specific characters', (t) => {
    t.plan(1);

    const testString = 'ßáÇÖÑ 🥓';
    const cryptr = new Cryptr(testSecret);
    const encryptedString = cryptr.encrypt(testString);
    const decryptedString = cryptr.decrypt(encryptedString);

    t.equal(decryptedString, testString, 'decrypted aes256 correctly with UTF8 chars');
});

test('goes bang if bad secret', (t) => {
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

test('encrypt goes bang if value is null or undefined', (t) => {
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

test('decrypt goes bang if value is null or undefined', (t) => {
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

test('decrypt goes bang if value has been tampered with', (t) => {
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

test('async works...', async (t) => {
    t.plan(1);

    const cryptr = new CryptrAsync(testSecret);
    const encryptedString = await cryptr.encrypt(testData);
    const decryptedString = await cryptr.decrypt(encryptedString);

    t.equal(decryptedString, testData, 'decrypted aes256 correctly');
});

test('async works with custom encoding', async (t) => {
    const encodings = ['hex', 'base64', 'latin1'];

    t.plan(encodings.length);

    for (const encoding of encodings) {
        const cryptr = new CryptrAsync(testSecret, { encoding });
        const encryptedString = await cryptr.encrypt(testData);
        const decryptedString = await cryptr.decrypt(encryptedString);

        t.equal(decryptedString, testData, `decrypted correctly with ${encoding} encoding`);
    }
});

test('async custom encoding affects output length', async (t) => {
    t.plan(1);

    const cryptr = new CryptrAsync(testSecret, { encoding: 'base64' });
    const cryptr2 = new CryptrAsync(testSecret);
    const encryptedString = await cryptr.encrypt(testData);
    const encryptedString2 = await cryptr2.encrypt(testData);

    t.ok(encryptedString.length < encryptedString2.length, 'custom encoding was shorter');
});

test('async works with custom pbkdf2Iterations', async (t) => {
    t.plan(1);

    const cryptr = new CryptrAsync(testSecret, { pbkdf2Iterations: 10000 });
    const encryptedString = await cryptr.encrypt(testData);
    const decryptedString = await cryptr.decrypt(encryptedString);

    t.equal(decryptedString, testData, 'decrypted aes256 correctly with custom iterations');
});

test('async custom pbkdf2Iterations affects speed', async (t) => {
    t.plan(1);

    const cryptr = new CryptrAsync(testSecret, { pbkdf2Iterations: 1000 });
    const cryptr2 = new CryptrAsync(testSecret);
    const customStart = performance.now();
    for (let index = 0; index < 10; index++) {
        const encryptedString = await cryptr.encrypt(testData + index);
        await cryptr.decrypt(encryptedString);
    }
    const customEnd = performance.now();

    const defaultStart = performance.now();
    for (let index = 0; index < 10; index++) {
        const encryptedString = await cryptr2.encrypt(testData + index);
        await cryptr2.decrypt(encryptedString);
    }
    const defaultEnd = performance.now();

    const customTime = customEnd - customStart;
    const defaultTime = defaultEnd - defaultStart;

    t.ok(customTime < defaultTime, 'custom iterations were faster');
});

test('async works with custom saltLength', async (t) => {
    t.plan(1);

    const cryptr = new CryptrAsync(testSecret, { saltLength: 10 });
    const encryptedString = await cryptr.encrypt(testData);
    const decryptedString = await cryptr.decrypt(encryptedString);

    t.equal(decryptedString, testData, 'decrypted aes256 correctly with custom salt length');
});

test('async custom saltLength affects output length', async (t) => {
    t.plan(1);

    const customSaltLength = 30;
    const cryptr = new CryptrAsync(testSecret, { saltLength: customSaltLength });
    const cryptr2 = new CryptrAsync(testSecret);
    const encryptedString = await cryptr.encrypt(testData);
    const encryptedString2 = await cryptr2.encrypt(testData);

    t.equal(
        encryptedString2.length - encryptedString.length,
        (64 - customSaltLength) * 2,
        'output length is affected by salt length',
    );
});

test('async works with utf8 specific characters', async (t) => {
    t.plan(1);

    const testString = 'ßáÇÖÑ 🥓';
    const cryptr = new CryptrAsync(testSecret);
    const encryptedString = await cryptr.encrypt(testString);
    const decryptedString = await cryptr.decrypt(encryptedString);

    t.equal(decryptedString, testString, 'decrypted aes256 correctly with UTF8 chars');
});

test('async goes bang if bad secret', async (t) => {
    const badSecrets = [null, undefined, 0, 123451345134, '', Buffer.from('buffer'), {}];

    t.plan(badSecrets.length);

    for (let i = 0; i < badSecrets.length; i++) {
        t.throws(
            () => new CryptrAsync(badSecrets[i]),
            /Cryptr: secret must be a non-0-length string/,
            `throws on bad secret ${badSecrets[i]}`,
        );
    }
});

test('async encrypt goes bang if value is null or undefined', async (t) => {
    const cryptr = new CryptrAsync(testSecret);
    const badValues = [null, undefined];

    t.plan(badValues.length);

    for (let i = 0; i < badValues.length; i++) {
        let value;
        try {
            value = await cryptr.encrypt(badValues[i]);
        } catch (e) {
            value = e;
        }
        t.assert(
            value instanceof Error &&
                value.message === 'value must not be null or undefined',
            `throws on value ${badValues[i]}`,
        );
    }
});

test('async decrypt goes bang if value is null or undefined', async (t) => {
    const cryptr = new CryptrAsync(testSecret);
    const badValues = [null, undefined];

    t.plan(badValues.length);

    for (let i = 0; i < badValues.length; i++) {
        let value;
        try {
            value = await cryptr.decrypt(badValues[i]);
        } catch (e) {
            value = e;
        }
        t.assert(
            value instanceof Error &&
                value.message === 'value must not be null or undefined',
            `throws on value ${badValues[i]}`,
        );
    }
});

test('async decrypt goes bang if value has been tampered with', async (t) => {
    t.plan(1);

    const cryptr = new CryptrAsync(testSecret);

    const encryptedString = await cryptr.encrypt(testData);

    const encryptedBuffer = Buffer.from(encryptedString, 'hex');
    const b1 = Buffer.from(testData);
    const b2 = Buffer.from('hello');

    for (let i = 0; i < b1.length; i++) {
        encryptedBuffer[i + 16] ^= b1[i] ^ b2[i];
    }

    const modifiedValue = encryptedBuffer.toString('hex');

    let value;
    try {
        value = await cryptr.decrypt(modifiedValue);
    } catch (e) {
        value = e;
    }
    t.assert(
        value instanceof Error &&
            value.message === 'Unsupported state or unable to authenticate data',
        'throws on tampered data',
    );
});
