'use strict';

let myColl;
let myURL;
const re = /^\d{2}/;
let apiKey;
let hdrs;
myURL = new URL (document.URL);
myColl = myURL.searchParams.get('coll');

function buildList() {
  apiKey = localStorage.getItem('apiKey');
  hdrs = {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': apiKey
  }
  // create list of recipes
  let url_str;
  url_str = `https://api.github.com/repos/nluttenberger/${myColl}/contents`;
  fetch(url_str,{headers: hdrs})
    .then(resp => {
      return resp.json();
      })
    .then(data => {
      let ix = data.indexOf(data.filter(function(item) {
        return item.path === "recipes_xml"
      })[0])
      let sha = data[ix].sha;
      url_str = `https://api.github.com/repos/nluttenberger/${myColl}/git/trees/${sha}?recursive=true`;
      fetch(url_str,{headers: hdrs})
        .then (resp =>  {
          console.log('Sammlungsindex eingelesen: ', resp.status, resp.statusText);
          return resp.json()
        })
        .then(data => {
          let tree = data.tree;
          tree.sort (function (a, b) {
            return a.path.localeCompare(b.path, 'de-DE-1996')
          });
          listHTML (tree);
        })
        .catch ((error) => {
          console.log('Error while reading directory listings:', error);
        })
      })
    .catch ((error) => {
      console.log('Error while reading collection sha:', error);
    })
}

function listHTML (tree) {
  let fullList = [];
  let entry = {};
  let pathEl = [];
  let chap = '';
  let recp = '';
  let recpPlain = '';
  let listStr = '';
  let hash;
  //console.log (tree);
  listStr = '<ul class="index-letter" style="margin-top: 5em; margin-bottom: 3em;">'
  tree.forEach((entry, idx) => {
    pathEl = entry.path.split ('/');
    chap = pathEl[0];
    recp = pathEl[1];
    hash = md5(`${chap}${recp}`);
    if (entry.type === 'tree') {
      if (idx != 0) listStr += '</ul>';
      listStr += `<li>${chap}</li>  <ul class ="rcp-list-entry">`
    }
    if (entry.type === 'blob' && !recp.match(re)) {
      recpPlain = recp.substr(0,recp.indexOf('.xml'));
      listStr += `<li><label><input type="checkbox" name="form" id="${hash}"><a class="formIndexEntry" href="filled.html?coll=${myColl}&chap=${chap}&recp=${recp}" target="_blank">${recpPlain}</a></label></li>`;
      //console.log (`chap: ${chap}, recp: ${recp}`);
    }
  })
  listStr += '</ul></ul>';
  //console.log (listStr);
  $('#main').append (listStr);
  // checkbox handling
  let countChecked = 0;
  let total = 0;
  let checkboxValues = JSON.parse(localStorage.getItem('checkboxValues')) || {};
  let checkboxes = $("input:checkbox");
  checkboxes.on("change", function(){
    checkboxes.each(function(){
      checkboxValues[this.id] = this.checked;
    });
    localStorage.setItem("checkboxValues", JSON.stringify(checkboxValues));
  });
  $.each(checkboxValues, function(key, value) {
    $('#' + key).prop('checked', value);
  })
  countChecked = $(".index-letter input[type='checkbox']:checked").length;
  total = $(".index-letter input[type='checkbox']").length;
  alert (`bearbeitet: ${countChecked} von ${total}`);
}

function registerRecipe () {
  window.open(`blank.html?coll=${myColl}`);
}

function registerChapter () {
  window.open(`newChap.html?coll=${myColl}`)
}
