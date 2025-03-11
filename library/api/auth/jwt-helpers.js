const defaultHeader = { name: "HMAC", hash: "SHA-256" };

export async function getSignedJwt({
    secret,
    payload,
    headerData = defaultHeader
}) {
    const enc = new TextEncoder();
    const algorithm = headerData;

    const key = await crypto.subtle.importKey(
        "raw",
        enc.encode(secret),
        algorithm,
        false,
        ["sign", "verify"]
    );

    const signature = await crypto.subtle.sign(
        algorithm.name,
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
