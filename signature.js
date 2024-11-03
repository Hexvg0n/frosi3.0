const crypto = require('crypto');

function verifySignature(body, signature, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(body)); 
    const calculatedSignature = hmac.digest('hex');
    return calculatedSignature === signature;
}

function generateSignature(body, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(body)); 
    return hmac.digest('hex');
}

module.exports = { verifySignature, generateSignature };