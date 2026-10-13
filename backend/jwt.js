import crypto from 'crypto';

const JWT_SECRET = "super_secret_key_task_manager";

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
    const header = { alg: 'HS256', typ: 'JWT'};
    const encodeHeader = toBase64Url(JSON.stringify(header));
    const encodePayload = toBase64Url(JSON.stringify(payload));
    const signature = crypto.createHmac('sha256', JWT_SECRET)
                            .update(`${encodeHeader}`, `${encodePayload}`)
                            .digest('base64url');
    return `${encodeHeader}.${encodePayload}.${signature}`;
}

export function verifyToken(token){
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length != 3) return null;
    const [encodedHeader, encodedPayload, signature] = parts;
    const validateSignature = crypto.createHmac('sha256', JWT_SECRET)
                            .update(`${encodedHeader}`, `${encodedPayload}`)
                            .digest('base64url');
    if (signature != validateSignature) return null;
    return JSON.parse(fromBase64Url(encodedPayload));    
}