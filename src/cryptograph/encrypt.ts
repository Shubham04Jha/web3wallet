export const encryptData = async (plainText: string,password: string)=>{
    const enc = new TextEncoder();
    const cryptoKey = await deriveKey(password);
    const str = localStorage.getItem("iv");
    if(!str){
        throw new Error("IV not found in localStorage");
    }
    const iv = new TextEncoder().encode(str);
    return await crypto.subtle.encrypt({name: "AES-GCM",iv},cryptoKey,enc.encode(plainText));
}
  
const deriveKey= async (password: string)=>{
    const enc = new TextEncoder();
    const salt = localStorage.getItem("salt");
    if(!salt){
        throw new Error("Salt not found in localStorage");
    }
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        {name: "PBKDF2"},
        false,
        ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: enc.encode(salt),
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
}

export const getIV = ()=>{
    const iv = crypto.getRandomValues(new Uint8Array(12));
    localStorage.setItem("iv",new TextDecoder().decode(iv));
}
