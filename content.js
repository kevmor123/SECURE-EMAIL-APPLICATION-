
InboxSDK.load('1.0', 'Encrypt').then(function(sdk){


  myStorage = localStorage;

  var PassPhrase = "Passphrase"; 
  var Bits = 1024; 
  var RSAkey = cryptico.generateRSAKey(PassPhrase, Bits);
  var PublicKeyString = cryptico.publicKeyString(RSAkey);  

  localStorage.clear();


  //adding to the local storage
  localStorage.setItem('Group', 'Session');
  localStorage.setItem('josephFitz@tcd.ie', 'Email 1');
  localStorage.setItem('morrisk3@tcd.ie', 'Email 2');
  localStorage.setItem('teefyl@tcd.ie', 'Email 3');

  sdk.Compose.registerComposeViewHandler(function(composeView){
    composeView.addButton({
      title: "Encrypt",
      iconUrl: 'http://simpleicon.com/wp-content/uploads/lock-10.png',
      onClick: function(event) {
        //encrypt
        var PlainText = composeView.getTextContent();
        var EncryptionResult = cryptico.encrypt(PlainText, PublicKeyString);
        event.composeView.setBodyText(EncryptionResult.cipher);
      },
    });
  });

   sdk.Conversations.registerThreadViewHandler(function(threadView){
     var emailThread = threadView.getMessageViews();
    var email= emailThread[0].getSender();
    var address = email.emailAddress;
    var el = document.createElement("div");

    if(localStorage.getItem(address)){ 
      //gets html element of body
      var htmlElement = emailThread[0].getBodyElement();
      var stringConCat = htmlElement.innerHTML; 
      //just getting body
      var index = stringConCat.indexOf("ltr")+5;
      stringConCat = stringConCat.slice(index);
      index = stringConCat.indexOf("</div>");
      stringConCat = stringConCat.substring(0, index);
      stringConCat = stringConCat.replace(/\<wbr>/g, '');
      //cipher decrypt
      var CipherText = stringConCat;
      var DecryptionResult = cryptico.decrypt(CipherText, RSAkey);
      el.innerHTML = DecryptionResult.plaintext;

    }else{
      el.innerHTML = "You are not in this session to see the decrypted message soz";
    }
    threadView.addSidebarContentPanel({
      title: 'Decrypted Message',
      el: el
    });
  });
});

