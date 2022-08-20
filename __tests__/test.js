const cryptr = require('../');

const testsecret = 'key1';
const testdata = 'bacon';

test('works...', () => {
    const c = new cryptr(testsecret);
    const encryptedstring =c.encrypt(testdata);
    const decryptedstring =c.decrypt(encryptedstring);

    expect(decryptedstring).toBe(testdata);
});

