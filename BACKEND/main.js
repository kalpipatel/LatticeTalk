const kyber = require('crystals-kyber');
const dsa = require('./ml_dsa');
var aes256 = require('aes256');

function main() {
    //-----------------CLIENT (generate keys)----------------- 
    // generate key pairs for encryption and signing and send public keys to server
    const [kyberPub, kyberPriv] = kyber.KeyGen768();
    const { privateKey: signPriv, publicKey: signPub } = dsa.generateKeyPair();
    console.log("Generated Public Key for Kyber:", kyberPub);
    console.log("Generated Private Key for Kyber:", kyberPriv);
    console.log("Generated Public Key for DSA:", signPriv);
    console.log("Generated Private Key for DSA:", signPub);

    //-----------------SERVER (encapsulate ss, encrypt and sign)-----------------
    // sender encapsulates the symmetric key within a ciphertext using recipient's public key 
    // encapsulate key through kyber to get shared key
    const [ ciphertextKem, sharedSecret1 ] = kyber.Encrypt768(kyberPub);
    console.log("Generated Shared Secret (encap):", sharedSecret1);

    // put in custom message
    // edit to receive user's input
    const textMsg = "This is a secure message.";

    // convert the shared secret's buffer to a hex string 
    let ss1 = Buffer.from(sharedSecret1, 'utf8');
    let encSharedSecret = ss1.toString('hex'); 
    console.log("Converted Shared Secret (encap):", encSharedSecret);

    // create the AES cipher instance with the shared secret from kyber
    var cipher = aes256.createCipher(encSharedSecret);

    // encrypt the message
    console.log("> Encrypting Message... <")
    var encryptedMessage = cipher.encrypt(textMsg);

    console.log("Encrypted Message (encrypted input):", encryptedMessage);

    // create a Dilithium signature to sign the encrypted message
    const signature = dsa.signMessage(signPriv, encryptedMessage); 
    console.log("Signature:", signature);

    /*
    // example usage: package ciphertextKem and encryptedMessage for transmission
    let dataToSend = {
        ciphertextKem: ciphertextKem.toString('hex'),
        encryptedMessage: encryptedMessage.toString('hex')
    };
    */

    //-----------------CLIENT (verify and decapsulate ss, decrypt)-----------------
    // recipient receives ciphertext, decapsulates and retrieves sym key (kyber private key)
    /*
    // let kyberPriv = get recipient's kyber private key 
    // The data received from the sender
    let receivedData = {
        ciphertextKem: Buffer.from('ciphertextKemReceived', 'hex'),
        encryptedMessage: Buffer.from('encryptedMessageReceived', 'hex')
    };
    */
    
    // verify the signature
    const isValid = dsa.verifySignature(signPriv, encryptedMessage, signature);
    console.log("Signature valid:", isValid);

    // decapsulate the shared secret using private key
    let sharedSecret2 = kyber.Decrypt768(ciphertextKem, kyberPriv);
    console.log("Generated Shared Secret (decap):", sharedSecret2); // buffer

    // convert the shared secret's buffer to a hex string 
    let ss2 = Buffer.from(sharedSecret2, 'utf8');
    let decSharedSecret = ss2.toString('hex'); 
    console.log("Converted Shared Secret (decap):", ss2); 
    console.log("Converted Shared Secret (decap):", decSharedSecret); 

    // decrypt the message
    console.log("> Decrypting Message... <");
    var cipher2 = aes256.createCipher(decSharedSecret); // to create an AES cipher, key is a string
    var decryptedMessage = cipher2.decrypt(encryptedMessage);  // (key, encrypted message string|buffer)
    console.log("Decrypted Message (plain text):", decryptedMessage);

    console.log("Shared secrets match:", encSharedSecret == decSharedSecret);
    console.log("Messages match:", textMsg == decryptedMessage);

}

main();
