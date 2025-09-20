declare class Cryptr {
    constructor(
        secret: string,
        options?: { pbkdf2Iterations?: number; saltLength?: number; encoding?: 'hex' | 'base64' | 'latin1' },
    );

    encrypt(value: string): string;

    decrypt(value: string): string;
}

declare class CryptrAsync {
    constructor(
        secret: string,
        options?: { pbkdf2Iterations?: number; saltLength?: number; encoding?: 'hex' | 'base64' | 'latin1' },
    );

    async encrypt(value: string): Promise<string>;

    async decrypt(value: string): Promise<string>;
}

declare namespace Cryptr {
    export { CryptrAsync };
}

export = Cryptr;
