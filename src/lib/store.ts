export const loadStoredWalletDetails = async()=>{
    const stringifiedData = localStorage.getItem('wallet');
    if(!stringifiedData){
        throw new Error("stored wallet details not found, Please Reenter the seed words to import the wallet");
    }
    const {seedWords,testCipher, iv, wallets} = await JSON.parse(stringifiedData);
    localStorage.setItem('IV',iv);
    localStorage.setItem('testCipher',testCipher);
    return {seedWords, wallets};
}