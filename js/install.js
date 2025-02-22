'use strict';

function install () {
  let pwd = document.getElementById('pwd').value;
  if (pwd.length<12 || pwd.length>12) {
    alert('Der Freischaltcode hat 12 Zeichen.')
    document.getElementById('pwd').value = '';
    return;
  }
  let hash32arr = new Uint32Array(10);
  let hash = sha384(pwd);
  hash32arr[0] = 0;
  for (let j=1;j<hash32arr.length;j++) {
    hash32arr[j] = parseInt(hash.substr(j*8,8),16);
  }
  console.log (hash32arr);
  let mask = new Uint32Array (10);
  mask[0] = 1734897759;
  mask[1] = 2548162100;
  mask[2] = 3871740160;
  mask[3] = 3999567323;
  mask[4] = 745342297;
  mask[5] = 1974352772;
  mask[6] = 447597967;
  mask[7] = 1583237357;
  mask[8] = 1119648562;
  mask[9] = 744962278;
  let key = new Uint32Array (10);
  let apiKey = '';
  let x = '';
  let hex = '';
  for (let k=0;k<key.length;k++) {
    key[k] = hash32arr[k] ^ mask[k];
    hex = key[k].toString(16);
    console.log (hex);
    for (let n = 0; n < 8; n=n+2) {
      apiKey += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
  }
  //console.log (apiKey);
  window.localStorage.setItem('apiKey', `token ${apiKey}`);
  alert ('Bingo!');
}

let pwd = document.getElementById("pwd");
pwd.addEventListener("keyup", function(e) {
  if (e.code === 'Enter') {
    e.preventDefault();
    document.getElementById("pwdBtn").click();
  }
});