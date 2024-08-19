declare class Cryptr {
  constructor(
    secret: string,
    options?: {
      pbkdf2Iterations?: number;
      saltLength?: number;
      encoding?: "hex" | "base64" | "latin1";
      fixedIv?: string;
      fixedSalt?: string; // default to 64 characters
    }
  );

  encrypt(value: string): string;

  decrypt(value: string): string;
}

export = Cryptr;
