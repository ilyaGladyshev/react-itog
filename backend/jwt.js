import crypto from 'crypto';

const TOKEN_EXPRESS_IN = 7 * 24 * 60 * 60;

function toBase64Url(str){
    return Buffer.from(str)
            .toString('base64')
            .replace(/=/g,'')
            .replace(/\+/g,'-')   
            .replace(/\//g,'_')         
}

function fromBase64Url(base64Url){
    let base64 = base64Url
                .replace(/-/g, '+')
                .replace(/_/g,'/');
    while (base64.length % 4) base64 += '=';
    return Buffer.from(base64, 'base64').toString('utf-8');
}

export function generateToken(payload){
    const JWT_SECRET = process.env.JWT_SECRET;
    const header = { alg: 'HS256', typ: 'JWT'};
    const body = {
        ...payload,
        iat: Math.floor(Date.now()/1000),
        exp: Math.floor(Date.now()/1000) + TOKEN_EXPRESS_IN,
    };
    const encodeHeader = toBase64Url(JSON.stringify(header));
    const encodePayload = toBase64Url(JSON.stringify(body));
    const signature = crypto.createHmac('sha256', JWT_SECRET)
                            .update(`${encodeHeader}.${encodePayload}`)
                            .digest('base64url');
    return `${encodeHeader}.${encodePayload}.${signature}`;
}

export function verifyToken(token){
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length != 3) return null;
    const [encodedHeader, encodedPayload, signature] = parts;
    const validateSignature = crypto.createHmac('sha256', JWT_SECRET)
                            .update(`${encodedHeader}.${encodedPayload}`)
                            .digest('base64url');
    if (signature != validateSignature) return null;
    try {
        const payload = JSON.parse(fromBase64Url(encodedPayload));
        if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
        return payload;                
    } catch (error) {
        return null;        
    }
}