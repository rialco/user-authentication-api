const crypto = require('crypto');
const fs = require('fs');

const accessKeyPair = async () => {
  const keyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
  });

  // Create public key file
  fs.writeFileSync(`${__dirname}/access_rsa_pub.pem`, keyPair.publicKey);

  // Create private key file
  fs.writeFileSync(`${__dirname}/access_rsa_priv.pem`, keyPair.privateKey);
  console.log('Access key generated');
};

const refreshKeyPair = () => {
  const keyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
  });

  // Create public key file
  fs.writeFileSync(`${__dirname}/refresh_rsa_pub.pem`, keyPair.publicKey);

  // Create private key file
  fs.writeFileSync(`${__dirname}/refresh_rsa_priv.pem`, keyPair.privateKey);
  console.log('Refresh key generated');
};

accessKeyPair();
refreshKeyPair();
