## Objective
1) A web wallet that generate or import seed phrase and is able to derive key pairs. 
2) The content must be kept encrypted using window.crypto.subtle api.
3) password based key generation, or basically log in.
4) once logged in the encrypted content stored in localstorage must be decrypted using the password based key and in memory I think it should be imported 

log in process can use the IV from the previous time and then decrypt and then bring some contents in the working memory, perhaps a global object and a new IV is to be created. all the seed phrase, key pairs must then be encrypted and kept in the local storage along with the new IV.

the key must also reside in the working memory for ease of encryption and decryption.

now password cannot be viewed, key's export field will be set to false and no visible aspect of it will be available same for all the private and public keys. they shall just reside in memory through a global object.

pbkdf2 is heavy so maybe use of webworker will be required. but webcrypto's pbkdf2 is asynchronous so perhaps different threads could be used.

roughly speaking I cannot hide the secrets from the in memory running process. 
so generally speaking any password based key observation is useless.
unless... how about having 2 keys? 1 optional password to unlock the application 
and the second password (the private password) for decrypting the important stuff where the key will never be stored globally just the function level (and also perhaps learn to clear that memory too after use... but not necessary cuz without the reference no one is able to access the key anyways as that's what crypto api guarantees) still the threat that as soon as it is observable some code can indeed save and log it somewhere else on the internet. but atleast it will not happen automatically as the input password will be required.... but hey wont that also mean that the malicious script will also be able to read the input that comes from the password field of the dom? again iff the inputs can be read.
so yea can't do that either if that's the case and thus having 2 separate password will also just be ceremonial. so why not just one password. key in global memory to avoid re password fetching as one time verification is enough for local auth.
and then instead of storing in plain text the secret messages I keep the encrypted ones only. and decrypt in on demand whenever the output is required.
and for visual output again the same decryption process to see it.
at max a warning dialogue can pop up for confirmation.
and what If I assume that no malicious process will be running on the same site.
then can any person that will get the laptop use the console to call the methods that shall decrypt it? well they can also just do the same operation that the real user may do. and even if I add password layer to access the global key it will be ceremonial if he can call the same function using console without providing the password and if the global key is not stored than it will cost ux.
but can the person use console to call internal function in which case password for each encryption and decryption on demand will be necessary or else if global key is provided only till the global key is nullified so that the reference is removed when the user logs out purposely (clicks that they wont be using the browser anymore ) or perhaps directly decide to close the tab... is the best that is possible 


### So a better way would be:
1) keep the cipher text in local storage. (IV, salt, etc)
2) create the crypto key for the first time. store in module.
3) decrypt whatever keys is required on demand using the module level crypto-key.
4) at-max add few confirmations before letting the user see the keys.
5) refresh will require re entering master password.



# rules
1) whenever you have bytes as the current state and want to store it then use base64 encodings.
2) if you have normal strings then TextEncoder works.


# Wallet utilities must include: 
1) Generate seed phrase. and then pass it to encrypt