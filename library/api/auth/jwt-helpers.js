const defaultAlgorithm = { name: "HMAC", hash: "SHA-256" };

const defaultHeader = {
    "alg": "HS256",
    "typ": "JWT"
};

function base64url(source) {
    let encodedSource;
    // Encode in classical base64
    encodedSource = btoa(source);

    // Remove padding equal characters
    encodedSource = encodedSource.replace(/=+$/, '');

    // Replace characters according to base64url specifications
    encodedSource = encodedSource.replace(/\+/g, '-');
    encodedSource = encodedSource.replace(/\//g, '_');

    return encodedSource;
}

function getDataString(data) {
    return JSON.stringify(data);
}

function getEncodedData(dataString) {
    return base64url(dataString);
}

function buildJwt(encodedHeader, encodedData) {
    return `${encodedHeader}.${encodedData}`;
}

function buildSignature(token, secret) {
    const signature = HmacSHA256(token, secret);
    return base64url(signature);
}

async function HmacSHA256(payload, secret) {
 
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        enc.encode(secret),
        defaultAlgorithm,
        false,
        ["sign", "verify"]
    );

    const signature = await crypto.subtle.sign(
        defaultAlgorithm.name,
        key,
        enc.encode(payload)
    );

    // convert buffer to byte array
    const hashArray = Array.from(new Uint8Array(signature));

    // convert bytes to hex string
    const digest = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    return digest;
}
export async function getSignedJwt({
    secret,
    payload,
    headerData = defaultHeader
}) {

    const headerString = getDataString(headerData);
    const encodedHeader = getEncodedData(headerString);
    const payloadString = getDataString(payload);
    const encodedPayload = getEncodedData(payloadString);
    const token = buildJwt(encodedHeader, encodedPayload);
    const signature = buildSignature(token, secret);
    return `${token}.${signature}`;


}
