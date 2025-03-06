import kyber from 'crystals-kyber';
import aes256 from 'aes256';
import * as dsa from './ml_dsa.js';

//not changing names
//import { generateKeyPair, signMessage, verifySignature} from './ml_dsa.js';

//generate keys for encryption and signing
function generateKeys() {
    const [kyberPub, kyberPriv] = kyber.KeyGen768();
    const { privateKey: signPriv, publicKey: signPub } = dsa.generateKeyPair();

    return { kyberPub, kyberPriv, signPub, signPriv };
}

function encryptMessage(kyberPub, message) {
    const [ciphertextKem, sharedSecret1] = kyber.Encrypt768(kyberPub);
    //console.log("Generated Shared Secret (encap):", sharedSecret1);

    // convert the shared secret's buffer to a hex string 
    let ss1 = Buffer.from(sharedSecret1, 'utf8');
    let encSharedSecret = ss1.toString('hex');
    //console.log("Converted Shared Secret (encap):", encSharedSecret);

    // create the AES cipher instance with the shared secret from kyber
    var cipher = aes256.createCipher(encSharedSecret);

    // encrypt the message
    var encryptedMessage = cipher.encrypt(message);

    //console.log("Encrypted Message (encrypted input):", encryptedMessage);

    return { ciphertextKem, encryptedMessage, encSharedSecret };
}

function signMessage(signPriv, encryptedMessage) {
    const signature = dsa.signMessage(signPriv, encryptedMessage);
    //console.log("Signature:", signature);

    return signature;
}


// Verify a signed message
function verifySignature(signPriv, encryptedMessage, signature) {
    const isValid = dsa.verifySignature(signPriv, encryptedMessage, signature);
    //console.log("Signature valid:", isValid);

    return isValid;
}


function decryptMessage(kyberPriv, ciphertextKem, encryptedMessage) {
    let sharedSecret2 = kyber.Decrypt768(ciphertextKem, kyberPriv); 
    //console.log("Generated Shared Secret (decap):", sharedSecret2); // buffer

    // convert the shared secret's buffer to a hex string 
    let ss2 = Buffer.from(sharedSecret2, 'utf8');
    let decSharedSecret = ss2.toString('hex');
    //console.log("Converted Shared Secret (decap):", ss2);
    //console.log("Converted Shared Secret (decap):", decSharedSecret);

    // decrypt the message
    //console.log("> Decrypting Message... <");
    var cipher2 = aes256.createCipher(decSharedSecret); // to create an AES cipher, key is a string
    var decryptedMessage = cipher2.decrypt(encryptedMessage);  // (key, encrypted message string|buffer)
    //console.log("Decrypted Message (plain text):", decryptedMessage);

    return { decryptedMessage, decSharedSecret };
}


function main() {
    const { kyberPub, kyberPriv, signPriv, signPub } = generateKeys();

    console.log("Public Key for Kyber:", kyberPub);
    console.log("Private Key for Kyber:", kyberPriv);
    console.log("Public Key for DSA:", signPriv);
    console.log("Private Key for DSA:", signPub);

    const textMsg = "This is a secure message.";

    // Encrypt Message
    const { ciphertextKem, encryptedMessage, encSharedSecret } = encryptMessage(kyberPub, textMsg);
    console.log("Encrypted Message:", encryptedMessage);

    // Sign Encrypted Message
    const signature = signMessage(signPriv, encryptedMessage);
    console.log("Signature:", signature);

    // Verify Signature using the Public Key
    const isValid = verifySignature(signPriv, encryptedMessage, signature);
    console.log("Signature Verified:", isValid);

    // Decrypt Message
    const { decryptedMessage, decSharedSecret } = decryptMessage(kyberPriv, ciphertextKem, encryptedMessage);
    console.log("Decrypted Message:", decryptedMessage);

    // Ensure shared secret consistency
    console.log("Shared secrets match:", encSharedSecret === decSharedSecret);
    console.log("Messages match:", textMsg === decryptedMessage);
}

main();

export { generateKeys, encryptMessage, signMessage, verifySignature, decryptMessage };