export const loadStoredWalletDetails = async()=>{
    const stringifiedData = localStorage.getItem('wallet');
    if(!stringifiedData){
        throw new Error("stored wallet details not found, Please Reenter the seed words to import the wallet");
    }
    const {seedWords, wallets, seedIv, testCipher, testIv, salt} = await JSON.parse(stringifiedData);
    localStorage.setItem('salt',salt);
    localStorage.setItem('testIv',testIv);
    localStorage.setItem('testCipher',testCipher);
    return {seedWords, wallets, seedIv};
}