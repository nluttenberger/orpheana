'use strict';

let myURL, myColl, myChap, myRecp;
let xmlDoc;
let rcpXML;
let importDir;
let importPath;
let gitName, gitPath, gitSHA;
let importType = '';
let rcpName = '';
let rcpID = '';
let ingr = '';
const re = /^\d{2}/;
let apiKey;
let hdrs;

function b64_to_utf8(str) {
  return decodeURIComponent(escape(window.atob(str)));
}

function utf8_to_b64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

function create_UUID(){
  let dt = new Date().getTime();
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = (dt + Math.random()*16)%16 | 0;
    dt = Math.floor(dt/16);
    return (c==='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}

function rcpIDgen () {
  let IDfield = document.getElementById('rcpID');
  IDfield.value = 'fr-' + create_UUID();
}

function passColl () {
  apiKey = localStorage.getItem('apiKey');
  hdrs = {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': apiKey
  }
  myURL = new URL (document.URL);
  myColl = myURL.searchParams.get('coll');
  document.getElementById('book').setAttribute('value',myColl);
}

function createRecipe () {
  let rcpID = document.getElementById("rcpID").value;
  if (rcpID.length === 0) {
    alert("Bitte eine Rezept-ID eingeben oder generieren!");
    return;
  }
  let text = '<?xml version="1.0" encoding="UTF-8"?> \n' +
      '<!DOCTYPE stylesheet SYSTEM "file:///C:/Users/nlutt/Documents/Websites/tools/entities.dtd">\n' +
      '<fr:recipe \n' +
      '    xmlns:fr="http://fruschtique.de/ns/recipe" \n' +
      '    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \n' +
      '    xsi:schemaLocation= \n' +
      '    "http://fruschtique.de/ns/recipe file:///c:/Users/nlutt/Documents/Websites/tools/recipe.xsd" \n' +
      '    rcpID = "' + rcpID + '" >\n' +
      '</fr:recipe>';
  let parser = new DOMParser();
  xmlDoc = parser.parseFromString(text, "text/xml");

  myChap = document.getElementById("chapter").value;
  let rcpChapter = xmlDoc.createElement("fr:chapter");
  let rcpChapterText = xmlDoc.createTextNode(myChap);
  rcpChapter.appendChild(rcpChapterText);

  let rcpBook = xmlDoc.createElement("fr:book");
  myColl = document.getElementById("book").value;
  let rcpBookText = xmlDoc.createTextNode(myColl);
  rcpBook.appendChild(rcpBookText);
  let rcpMeta = xmlDoc.createElement("fr:meta");
  rcpMeta.appendChild(rcpBook);
  rcpMeta.appendChild(rcpChapter);
  xmlDoc.documentElement.appendChild(rcpMeta);

  let rcpName = xmlDoc.createElement("fr:recipeName");
  myRecp = document.getElementsByName("recipeName")[0].value;
  let rcpNameText = xmlDoc.createTextNode(myRecp);
  rcpName.appendChild(rcpNameText);
  xmlDoc.documentElement.appendChild(rcpName);

  let rcpKeywords = xmlDoc.createElement("fr:recipeKeywords");
  xmlDoc.documentElement.appendChild(rcpKeywords);

  let rcpIntro = xmlDoc.createElement("fr:recipeIntro");
  xmlDoc.documentElement.appendChild(rcpIntro);

  //--- ingredients ---------------------------------------------------
  let rcpIngredients = xmlDoc.createElement("fr:recipeIngredients");
  xmlDoc.documentElement.appendChild(rcpIngredients);
  let rcpIgdtList = xmlDoc.createElement("fr:igdtList");
  let rcpIgdtListName = xmlDoc.createElement("fr:igdtListName");
  rcpIgdtList.appendChild(rcpIgdtListName);
  rcpIngredients.appendChild(rcpIgdtList);

  let rcpigdtname = xmlDoc.createElement("fr:igdtName");
  let rcpigdtqty = xmlDoc.createElement("fr:igdtQuantity");
  let rcpigdtlistline = xmlDoc.createElement("fr:igdtListLine");
  rcpigdtlistline.appendChild(rcpigdtqty);
  rcpigdtname.setAttribute("ref", "");
  rcpigdtlistline.appendChild(rcpigdtname);
  rcpIgdtList.appendChild(rcpigdtlistline);

  //--- instructions ---------------------------------------------------
  let rcpInstructions = xmlDoc.createElement("fr:recipeInstructions");
  xmlDoc.documentElement.appendChild(rcpInstructions);
  let step = xmlDoc.createElement("fr:instruction");
  let stepName = xmlDoc.createElement("fr:instrStepName");
  step.appendChild(stepName);
  let instrStepText = xmlDoc.createElement("fr:instrStepText");
  step.appendChild(instrStepText);
  rcpInstructions.appendChild(step);

  //--- sideDish ----------------------------------------------------------------
  let rcpSideDish = xmlDoc.createElement("fr:recipeSideDish");
  xmlDoc.documentElement.appendChild(rcpSideDish);

  //--- origin ----------------------------------------------------------------
  let rcpOrigin = xmlDoc.createElement("fr:recipeOrigin");
  xmlDoc.documentElement.appendChild(rcpOrigin);

  //--- seeAlso ----------------------------------------------------------------
  let rcpAuch = xmlDoc.createElement("fr:recipeSeeAlso");
  xmlDoc.documentElement.appendChild(rcpAuch);

  //--- license ----------------------------------------------------------------
  let rcpLicense = xmlDoc.createElement("fr:recipeLicense");
  xmlDoc.documentElement.appendChild(rcpLicense);
}

// --- save recipe --------------------------------------------------------------
function saveRecipe() {
  //--- create empty form --------------------------------------------------
  createRecipe();
  //--- serialize form input to XML --------------------------------------------------
  let xmlText = new XMLSerializer().serializeToString(xmlDoc);
  // convert updated recipe to base64 -----------------------------------
  let b64Recipe = utf8_to_b64(xmlText);
  //build update object and url -----------------------------------------
  let update = {
    'message': 'just created',
    'content': b64Recipe
  }
  let urlStr = `https://api.github.com/repos/nluttenberger/${myColl}/contents/recipes_xml/${myChap}/${myRecp}.xml`;
  // upload and commit --------------------------------------------------
  fetch (urlStr,{
    method: 'PUT',
    body: JSON.stringify(update),
    headers: hdrs
    })
    .then (resp => {
      if (resp.status === 201) {
        alert ('Rezept angelegt!')
        let htmlStr = `<a id="toFullForm" href="filled.html?coll=${myColl}&chap=${myChap}&recp=${myRecp}.xml"></a>`
        $('body').append(htmlStr);
        document.getElementById('toFullForm').click();
      }
      return resp.json()
    })
    .then (data => {
      console.log (data.commit);
    })
    .catch((error) => {
      console.error('Error while saving recipe: ', error);
    })
}

// --- create new chapter --------------------------------------------------------------
function createChapter () {
  passColl();
  myChap = document.getElementById("chapter").value;
  myRecp = myChap;
  //--- create empty recipe to store in chapter ----------------------------------------
  let text = '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<!DOCTYPE stylesheet SYSTEM "file:///C:/Users/nlutt/Documents/Websites/tools/entities.dtd">\n' +
      '<fr:recipe \n' +
      '    xmlns:fr="http://fruschtique.de/ns/recipe" \n' +
      '    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \n' +
      '    xsi:schemaLocation= \n' +
      '    "http://fruschtique.de/ns/recipe ../../../tools/recipe.xsd" \n' +
      '    rcpID = "" >\n' +
      '   <fr:meta>\n' +
      '      <fr:book>' + myColl + '</fr:book>\n' +
      '      <fr:chapter>' + myChap + '</fr:chapter>\n' +
      '   </fr:meta>\n' +
      '   <fr:recipeName>' + myChap + '</fr:recipeName>\n' +
      '   <fr:recipeKeywords/>\n' +
      '   <fr:recipeIntro>\n' +
      '      <fr:introText/>\n' +
      '   </fr:recipeIntro>\n' +
      '   <fr:recipeIngredients>\n' +
      '      <fr:igdtList>\n' +
      '         <fr:igdtListName/>\n' +
      '         <fr:igdtListLine>\n' +
      '            <fr:igdtQuantity/>\n' +
      '            <fr:igdtName/>\n' +
      '         </fr:igdtListLine>\n' +
      '      </fr:igdtList>\n' +
      '   </fr:recipeIngredients>\n' +
      '   <fr:recipeInstructions>\n' +
      '      <fr:instruction>\n' +
      '         <fr:instrStepName/>\n' +
      '         <fr:instrStepText/>\n' +
      '      </fr:instruction>\n' +
      '   </fr:recipeInstructions>\n' +
      '   <fr:recipeSideDish/>\n' +
      '   <fr:recipeOrigin/>\n' +
      '   <fr:recipeSeeAlso/>\n' +
      '   <fr:recipeLicense/>\n' +
      '</fr:recipe>';
  let parser = new DOMParser();
  xmlDoc = parser.parseFromString(text, "text/xml");
  let xmlText = new XMLSerializer().serializeToString(xmlDoc);
  // convert updated recipe to base64 -----------------------------------
  let b64Recipe = utf8_to_b64(xmlText);
  //build update object and url -----------------------------------------
  let update = {
    'message': 'just created',
    'content': b64Recipe
  }
  let urlStr = `https://api.github.com/repos/nluttenberger/${myColl}/contents/recipes_xml/${myChap}/${myRecp}.xml`;
  // upload and commit --------------------------------------------------
  fetch (urlStr,{
    method: 'PUT',
    body: JSON.stringify(update),
    headers: hdrs
  })
    .then (resp => {
      if (resp.status === 201) {
        alert ('Kapitel angelegt!')
      }
      return resp.json()
    })
    .then (data => {
    })
    .catch((error) => {
      console.error('Error while creating chapter: ', error);
    })
}

$(document).keydown(function(e) {
  if ((e.key === 's' || e.key === 'S' ) && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    saveRecipe();
    return false;
  }
  return true;
});
