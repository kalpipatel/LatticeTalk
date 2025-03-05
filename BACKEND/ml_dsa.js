import { shake256 } from '@noble/hashes/sha3';

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
function generateKeyPair() {
    const seed = new Uint8Array(32);// creates a 32 byte seed in the form of an array
    crypto.getRandomValues(seed);// generates random values for the seed
    const privateKey = shake256(seed, { dkLen: 64 });// creates a 64 byte private key
    const publicKey = shake256(privateKey, { dkLen: 32 });// creates a 32 byte public key
    return { privateKey, publicKey };
}

// Signs a message using SHAKE-256
function signMessage(privateKey, message) {
    const msgEncoded = new TextEncoder().encode(message);//encodes the message to bytes
    return shake256(new Uint8Array([...privateKey, ...msgEncoded]), { dkLen: 32 });
}

// Verifies a signed message using SHAKE-256
function verifySignature(privateKey, message, signature) {
    const msgEncoded = new TextEncoder().encode(message);
    const computedSignature = shake256(new Uint8Array([...privateKey, ...msgEncoded]), { dkLen: 32 });

    //need to match inorder to verify
    console.log("Expected Signature:", computedSignature);
    console.log("Actual Signature:", signature);

    return computedSignature.every((byte, i) => byte === signature[i]);
}

// Example test case
function testSigning() {
    const { privateKey, publicKey } = generateKeyPair();
    const message = "test message";
    const signature = signMessage(privateKey, message);
    const isValid = verifySignature(privateKey, message, signature);

    console.log("Generated Public Key:", publicKey);
    console.log("Generated Private Key:", privateKey);
    console.log("Generated Signature:", signature);
    console.log("Signature is valid:", isValid);
};

testSigning();

export {generateKeyPair, signMessage, verifySignature};