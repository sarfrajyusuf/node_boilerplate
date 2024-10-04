import crypto from "node:crypto";
import { env } from "@/config/envConfig";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const key = crypto.randomBytes(32);

/**
 * Encrypts data using bcrypt.
 * @param data - The data to encrypt.
 * @returns The hashed data.
 */
async function encrypt(data: string): Promise<string> {
  try {
    return await bcrypt.hash(data, 10);
  } catch (error: any) {
    throw new Error(`Error while encrypting data: ${error.message}`);
  }
}

/**
 * Compares a plain text data with a hashed data to check if they match.
 * @param data - The plain text data.
 * @param hashedData - The hashed data to compare against.
 * @returns A boolean indicating whether the data matches the hash.
 */
async function compare(data: string, hashedData: string): Promise<boolean> {
  try {
    return await bcrypt.compare(data, hashedData);
  } catch (error: any) {
    throw new Error(`Error while comparing data: ${error.message}`);
  }
}

/**
 * Encrypts a text using AES-256-CBC encryption with a provided key and a randomly generated IV.
 * The encrypted text is returned as a JSON object containing the IV and the encrypted data.
 * @param text - The text to be encrypted.
 * @returns An object containing the IV and the encrypted data.
 */
function encryptEngine(text: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  return { iv: iv.toString("base64"), encrypted };
}

/**
 * Decrypts a text using AES-256-CBC encryption with a provided key and IV.
 * The decrypted text is returned as a string.
 * @param encryptedText - The encrypted text to be decrypted.
 * @param iv - The initialization vector (IV) used during encryption.
 * @returns The decrypted text.
 */
function decryptEngine(encryptedText: string, iv: string) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, Buffer.from(iv, "base64"));
  let decrypted = decipher.update(encryptedText, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

/**
 * Verifies a JSON Web Token (JWT) using the provided secret key.
 * @param token - The JWT token to be verified.
 * @returns The decoded payload of the JWT token if verification is successful, otherwise returns null.
 */
function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    return decoded;
  } catch (err) {
    console.error("JWT verification failed:");
    return null;
  }
}

function generateJwt(payload: any) {
  const encryptJwt = encryptEngine(payload.toString());
  const data = `${encryptJwt.iv}:${encryptJwt.encrypted}`;
  return jwt.sign({ data }, env.JWT_SECRET, { expiresIn: "1h" });
}

function decodeJwt(data: string) {
  try {
    const splitString = data.split(":");
    if (splitString.length !== 2) {
      throw new Error("Invalid data format");
    }
    const iv = splitString[0];
    const encrypted = splitString[1];
    return decryptEngine(encrypted, iv); // Ensure
  } catch (error) {
    return null;
  }
}

export const cryptoEngine = { encrypt, compare, Jwt: { generateJwt, decodeJwt, verifyJwt } };
