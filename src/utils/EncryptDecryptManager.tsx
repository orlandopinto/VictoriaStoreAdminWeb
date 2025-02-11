import { AES, enc } from 'crypto-js';
import { encryptSecretKey } from '../config/constants.d';

var key = enc.Hex.parse(encryptSecretKey);
var iv = enc.Hex.parse(encryptSecretKey);

export const encrypt = (value: string) => {
     var ciphertext = AES.encrypt(value, key, { iv: iv }).toString();
     return ciphertext;
}

export const decrypt = (ciphertext: string) => {
     var decryptStr = AES.decrypt(ciphertext, key, { iv: iv }).toString(enc.Utf8);
     return decryptStr;
}