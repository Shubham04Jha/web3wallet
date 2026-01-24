export const bytesToBase64 = (bytes: Uint8Array)=>{
    const binaryString = Array.from(bytes,(byte)=>{
        return String.fromCharCode(byte)
    }).join('');
    return btoa(binaryString);
}

export const base64ToBytes = (base64String: string)=>{
    const binaryString = atob(base64String);
    const arr = Array.from(binaryString,ch=>ch.charCodeAt(0));
    return new Uint8Array(arr);
}