import { shake256 } from '@noble/hashes/sha3';
import { ml_dsa44, ml_dsa65, ml_dsa87 } from '@noble/post-quantum/ml-dsa';
import { utf8ToBytes, randomBytes } from '@noble/post-quantum/utils';

//encodes message to bytes
class TextEncoder {
    encode(str) {
        const encoder = new Uint8Array(str.length);
        for (let i = 0; i < str.length; i++) {
            encoder[i] = str.charCodeAt(i);
        }
        return encoder;
    }
}

// generates a key pair using SHAKE-256 one with 64 byts and the other with 32 bytes
export function generateKeyPair() {
    // const seed = new Uint8Array(32);// creates a 32 byte seed in the form of an array
    // crypto.getRandomValues(seed);// generates random values for the seed
    // const privateKey = shake256(seed, { dkLen: 64 });// creates a 64 byte private key
    // const publicKey = shake256(privateKey, { dkLen: 32 });// creates a 32 byte public key
    const seed = randomBytes(32);
    const keys = ml_dsa44.keygen(seed);
    const privateKey = keys.secretKey;
    const publicKey = keys.publicKey;
    
    return { privateKey, publicKey };
}

// Signs a message using SHAKE-256
export function signMessage(privateKey, message) {
    // const msgEncoded = new TextEncoder().encode(message);//encodes the message to bytes
    // return shake256(new Uint8Array([...privateKey, ...msgEncoded]), { dkLen: 32 });
    const msg = utf8ToBytes(message);
    const sig = ml_dsa44.sign(privateKey, msg);

    return { sig };
}

// Verifies a signed message using SHAKE-256
export function verifySignature(publicKey, message, signature) {
    // const msgEncoded = new TextEncoder().encode(message);
    // console.log("msgEncoded:", msgEncoded);
    // const computedSignature = shake256(new Uint8Array([...publicKey, ...msgEncoded]), { dkLen: 32 });

    // //need to match inorder to verify
    // console.log("Expected Signature:", computedSignature);
    // console.log("Actual Signature:", signature);

    // return computedSignature.every((byte, i) => byte === signature[i]);
    const msg = utf8ToBytes(message);
    const isValid = ml_dsa44.verify(publicKey, msg, signature);
    return { isValid };
}

// Example test case
export function testSigning() {
    // const { privateKey, publicKey } = generateKeyPair();
    // //console.log(keys.secretKey);
    // //console.log(keys.publicKey);
    // const message = "test message";
    // const signature = signMessage(privateKey, message);
    // const isValid = verifySignature(publicKey, message, signature);

    const seed = randomBytes(32); // seed is optional
    const keys = ml_dsa44.keygen(seed);
    const msg = utf8ToBytes('hello noble');
    const sig = ml_dsa44.sign(keys.secretKey, msg);
    const isValid = ml_dsa44.verify(keys.publicKey, msg, sig);

    console.log("Generated Public Key:", keys.publicKey);
    console.log("Generated Private Key:", keys.secretKey);
    console.log("Generated Signature:", sig);
    console.log("Signature is valid:", isValid);
};

testSigning();

//export {generateKeyPair, signMessage, verifySignature};