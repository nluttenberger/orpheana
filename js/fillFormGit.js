'use strict';

let myColl;
let myChap;
let myRecp;
let rcpXML;
let prefix;
let importDir;
let importPath;
let gitName, gitPath, gitSHA;
let refs;
let igtCat;
let normIgt;
let importType = '';
let cookbook = '';
let chapter = '';
let rcpName = '';
let rcpID = '';
let rcpOneWordName;
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

function getForm () {
  apiKey = localStorage.getItem('apiKey');
  hdrs = {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': apiKey
  }
  let myURL = new URL (document.URL);
  myColl = myURL.searchParams.get('coll');
  myChap = myURL.searchParams.get('chap');
  myRecp = myURL.searchParams.get('recp');
  console.log (`Sammlung: ${myColl}, Kapitel: ${myChap}, Rezept: ${myRecp}`);

  let url_str = `https://api.github.com/repos/nluttenberger/${myColl}/contents/recipes_xml/${myChap}/${myChap}.xml`;
  fetch (url_str,{headers: hdrs})
  .then (resp => resp.json())
  .then (data => {
    rcpXML = b64_to_utf8(data.content);
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(rcpXML, "text/xml");
    prefix = xmlDoc.getElementsByTagName("fr:recipe")[0].getAttribute("prefix");
    rcpID = `${prefix}_${myRecp.split(".xml")[0].replace(/-/g, '').replace(/ /g,'_').replace(/\./g,'').replace(/,/g,'').replace(/\)/g,'').replace(/\(/g,'').replace(/\)/g,'')}`
    url_str = `https://api.github.com/repos/nluttenberger/${myColl}/contents/recipes_xml/${myChap}/${myRecp}`;
    fetch (url_str,{headers: hdrs})
      .then (resp => resp.json())
      .then (data => {
        rcpXML = b64_to_utf8(data.content);
        gitName = data.name;
        gitPath = data.path;
        gitSHA = data.sha;
        makeForm(rcpXML);
      })
      .catch ((error) => {
        console.log('Error while reading recipe xml data:', error);
      })
  })
  .catch ((error) => {
    console.log('Error while reading chapter xml data:', error);
  })
}

function makeForm (data) {
  let parser = new DOMParser();
  let xmlDoc = parser.parseFromString(data, "text/xml");
  cookbook = xmlDoc.getElementsByTagName("fr:book")[0].childNodes[0].nodeValue;
  chapter = xmlDoc.getElementsByTagName("fr:chapter")[0].childNodes[0].nodeValue;
  rcpName = xmlDoc.getElementsByTagName("fr:recipeName")[0].childNodes[0].nodeValue;
  rcpOneWordName = xmlDoc.getElementsByTagName("fr:recipe")[0].getAttribute("rcpOneWordName");
  document.title = (`Eingabe: ${rcpName}`)
  let x = xmlDoc.getElementsByTagName("fr:recipeKeywords")[0].childNodes[0];
  const rcpKeywords = (x === undefined) ? "" : `${x.nodeValue}`;
  let formStr = `<fieldset id="recipe"><div style="margin-top: 18px; margin-bottom: 36px"><label>Rezept<input type="text" class="longTextInput" name="recipeName" value="${rcpName}"></label>`;
  formStr += '<label>Kapitel<input type="text" class="shortTextInput" id="chapter" value="';
  formStr += `${chapter}`;
  formStr += '"></label><label>Sammlung<input type="text" class="shortTextInput" id="book" value="';
  formStr += `${cookbook}`;
  formStr += '"></label><br>'
  formStr += '<label>Ein-Wort-Rezeptname<input type="text" class="shortTextInput" id="rcpOneWordName" value="';
  formStr += `${rcpOneWordName}`;
  formStr += '"></input></label>';
  formStr += '<label>ID<input type="text" class="shortTextInput" id="rcpID" value="';
  formStr += `${rcpID}`;
  formStr += '"></label><input type="button" value="ID generieren" id="IDbtn" onclick="rcpIDgen()"></input></div>';
  formStr += '<fieldset><legend>Zutaten für Zutaten-Index</legend><label><input type="text" class="longTextInput" name="recipeKeywords" value="'
  formStr += `${rcpKeywords}`;
  formStr += '">durch Komma getrennt</label></fieldset><fieldset id="intro"> <legend>Einleitung</legend>';

  x = xmlDoc.getElementsByTagName("fr:introText");
  for (let i = 0; i < x.length; i++) {
    let y = x[i].childNodes[0];
    let introText = (y === undefined) ? "" : `${y.nodeValue}`;
    formStr += `<textarea name="introText" class="generalTextFieldSmall">${introText}</textarea><input type="button" value="+"><br>`;
  }
  if (x.length === 0) {
    formStr += `<textarea name="introText" class="generalTextFieldSmall"></textarea><input type="button" value="+"><br>`;
  }

  formStr += '</fieldset>' +
      '<input type="button" id="genRefsButton" value="Referenzen generieren">' +
      '<input type="button" id="reloadRefsButton" value="Referenzliste neu laden">' +
      '<input type="button" id="impButton" value="Grundrezept importieren"><label>' +
      '<input type="text" class="longTextInput" id="impText" list="impRcpList" value=""></label><br>' +
      '<fieldset id="ingredients"><legend>Zutaten</legend>';

  // ingredients section
  x = xmlDoc.getElementsByTagName("fr:igdtList");
  let xAtt;
  if (x.length===0) {
    formStr += '<div><fieldset name="ingredientList"';
    formStr += '><legend>Zutatenliste</legend><label>Listenname<input type="text"' +
        ' class="longTextInput" name="ingdtListName" value=""></label><br><br>';
    formStr += '<label>Menge<input type="text" class="shortTextInput" name="ingdtQuantity" value=""></label>';
    formStr += '<label>Zutat<textarea name="ingdtName" class="ingredientNameField">';
    formStr += '</textarea></label>\n' +
        '<label>Referenz<input type="text" class="shortTextInput" name="ingdtRef" list="igdt-refs" value="';
    formStr += '"></label><input type="button" data-purpose="addIgt" value="+"/><br>'
    formStr += '<br>' +
        '<input type="button" data-purpose="exportList" value="diese Liste exportieren"></fieldset>' +
        '<br>' +
        '<input type="button" data-purpose="addIgtList" value="weitere Liste anlegen">' +
        '<input type="button" data-purpose="importIgtList" value="Liste importieren">' +
        '<input type="text" class="longTextInput" name="impListInput" list="subLists" value="">' +
        '<br></div>';
    formStr += '</fieldset>';
  } else {
    for (let i = 0; i < x.length; i++) {          // looping over lists
      xAtt = x[i].getAttribute('noshow');
      formStr += '<div><fieldset name="ingredientList"';
      if (xAtt === 'noshow') {
        formStr += ` class="noshow"`;
      }
      formStr += '><legend>Zutatenliste</legend><label>Listenname<input type="text"' +
          ' class="longTextInput" name="ingdtListName" value="';
      let y = xmlDoc.getElementsByTagName("fr:igdtListName")[i];
      let igdtListName = '';
      if (y != undefined) {
        y = y.childNodes[0];
        igdtListName = (y === undefined) ? "" : `${y.nodeValue}`;
      }
      formStr += `${igdtListName}"></label><br><br>`;
      let z = x[i].childNodes;
      for (let j = 0; j < z.length; j++) {       // looping over lines
        if (z[j].nodeName === 'fr:igdtListLine') {
          let w = z[j].childNodes;
          for (let k = 0; k < w.length; k++) {   // loop over ingredient fields
            switch (w[k].nodeName) {
              case 'fr:igdtQuantity':
                let xx = w[k].childNodes[0];
                const xxx = (xx === undefined) ? "" : `${xx.nodeValue}`;
                formStr += `<label>Menge<input type="text" class="shortTextInput" name="ingdtQuantity" value="${xxx}"></label>`;
                break;
              case 'fr:igdtName':
                formStr += '<label>Zutat<textarea name="ingdtName" class="ingredientNameField">';
                let yy = w[k].childNodes[0];
                let yyy = (yy === undefined) ? "" : `${yy.nodeValue}`;
                formStr += `${yyy}`
                formStr += '</textarea></label>\n' +
                    '<label>Referenz<input type="text" class="shortTextInput" name="ingdtRef" list="igdt-refs" value="';
                let z = w[k].getAttribute('ref');
                formStr += `${(z === null) ? "" : z}`;
                formStr += '"></label><input type="button" data-purpose="addIgt" value="+"/><br>'
            }
          }
        }                                 // ingredient fields loop
      }                                   // lines loop
      formStr += '<br>' +
          '<input type="button" data-purpose="exportList" value="diese Liste exportieren"></fieldset>' +
          '<br>' +
          '<input type="button" data-purpose="addIgtList" value="weitere Liste anlegen">' +
          '<input type="button" data-purpose="importIgtList" value="Liste importieren">' +
          '<input type="text" class="longTextInput" name="impListInput" list="subLists" value="">' +
          '<br></div>';

    }                                     // lists loop
    formStr += '</fieldset>';
  }
                                        // instructions section
  formStr += '<fieldset id="instructions"><legend>Zubereitung</legend>';
  let insts = xmlDoc.getElementsByTagName("fr:recipeInstructions")[0];
  let inst = insts.childNodes;
  if (inst.length===0) {
    formStr += '<fieldset name="step"><legend>Zubereitungsschritt</legend>';
    formStr += '<input type="text" name="instrStepName" value=""><br><br>';
    formStr += '<textarea name="instrStepText" class="generalTextField"></textarea>';
    formStr += '<input type="button" value="+"><br>';
    formStr += '</fieldset><input name="instrStep" type="button" value="weiterer Schritt"><br>';
  } else {
    for (let l = 0; l < inst.length; l++) {   // looping over instructions aka instruction steps
      if (inst[l].nodeName === 'fr:instruction') {
        let step = inst[l].childNodes;
        formStr += '<fieldset name="step"><legend>Zubereitungsschritt</legend>';
        for (let m = 0; m < step.length; m++) {
          switch (step[m].nodeName) {
            case 'fr:instrStepName':
              let yy = step[m].childNodes[0];
              let yyy = (yy === undefined) ? "" : `${yy.nodeValue}`;
              formStr += `<input type="text" name="instrStepName" value="${yyy}"><br><br>`;
              break;
            case 'fr:instrStepText':
              formStr += '<textarea name="instrStepText" class="generalTextField">';
              let zz = step[m].childNodes[0];
              let zzz = (zz === undefined) ? "" : `${zz.nodeValue}`;
              formStr += `${zzz}`;
              formStr += '</textarea><input type="button" value="+"><br>';
              break;
            default :
          }
        }
        formStr += '</fieldset><input name="instrStep" type="button" value="weiterer Schritt"><br>';
      }    // instructions steps loop
    }
    formStr += '</fieldset>';
  }
  formStr += '</fieldset>';
  // bottom part
  // recipe side dish
  formStr += '<fieldset name="recipeSideDish">\n<legend>Dazu</legend><textarea name="dazuText"' +
      ' class="generalTextFieldSmall">';
  let recipeSideDish = '';
  x = xmlDoc.getElementsByTagName("fr:recipeSideDish")[0];
  if (x != undefined) {
    x = x.childNodes[0];
    recipeSideDish = (x === undefined) ? "" : `${x.nodeValue}`;
  }
  formStr += `${recipeSideDish}`;
  // recipe origin
  formStr += '</textarea></fieldset><fieldset name="recipeOrigin"><legend>Quelle</legend><textarea' +
      ' name="originText" class="generalTextFieldSmall">';
  let recipeOrigin = ''
  x = xmlDoc.getElementsByTagName("fr:recipeOrigin")[0];
  if (x != undefined) {
    x = x.childNodes[0];
    recipeOrigin = (x === undefined) ? "" : `${x.nodeValue}`;
  }
  formStr += `${recipeOrigin}`;
  // recipe see also
  formStr += '</textarea></fieldset><fieldset name="recipeSeeAlso"><legend>Siehe' +
      ' auch</legend><label><textarea name="auchText" class="generalTextFieldSmall">';
  let recipeSeeAlso = '';
  x = xmlDoc.getElementsByTagName("fr:recipeSeeAlso")[0];
  if (x != undefined) {
    x = x.childNodes[0];
    recipeSeeAlso = (x === undefined) ? "" : `${x.nodeValue}`;
  }
  formStr += `${recipeSeeAlso}`;
  // recipe license
  formStr += '</textarea>durch Komma' +
      ' getrennt</label></fieldset> <fieldset name="recipeLicense"><legend>Lizenz</legend><textarea name="lizenzText"' +
      ' class="generalTextFieldSmall">';
  let recipeLicense = '';
  x = xmlDoc.getElementsByTagName("fr:recipeLicense")[0];
  if (x != undefined) {
    x = x.childNodes[0];
    recipeLicense = (x === undefined) ? "" : `${x.nodeValue}`;
  }
  formStr += `${recipeLicense}`;
  formStr += '</textarea></fieldset><fieldset><legend>Rezept abspeichern</legend>';
  formStr += '<br><input type="submit" value="speichern" id="save"></fieldset></fieldset>';
  formStr += '<datalist id="igdt-refs"></datalist>';
  formStr += '<datalist id="impRcpList"></datalist>';
  formStr += '<datalist id="subLists"></datalist>';
  // finally
  $('body').append(formStr);
  // click handlers
  $('[name="introText"] + [type="button"]').click(add_introText);
  $('#ingredients').on('click', '[data-purpose="addIgt"]', add_ingredient);
  $('#ingredients').on('click', '[data-purpose="addIgtList"]', add_ingdtList);
  $('#ingredients').on('click', '[data-purpose="importIgtList"]', importList);
  $('#ingredients').on('click', '[data-purpose="exportList"]', exportList);
  $('[name="step"] [type="button"]').click(add_instrStepText);
  $('[name="step"] + [type="button"]').click(add_instrStep);
  $('#reloadRefsButton').click(reloadRefs);
  $('#genRefsButton').click(genRefs);
  $('#impButton').click(importRecipe);
  $('#save').click(saveRecipe);
  // get datalists
  fetchIgtRefs();
  fetchSublistsIdx();
  fetchImportList();
}

function fetchImportList () {
  // fetch descriptor first
  let url_str = `https://api.github.com/repos/nluttenberger/${myColl}/contents/descriptor.json`;
  fetch (url_str,{headers: hdrs})
    .then (resp => {
      console.log('Pfad zum Import-Verzeichnis aus Deskriptor gelesen: ', resp.status, resp.statusText);
      return resp.json();
    })
    .then (data => {
      importPath = b64_to_utf8 (data.content);
      importPath = JSON.parse(importPath);
      importPath = JSON.stringify(importPath.importFrom);
      importPath = importPath.replace(/"/g,"");
      url_str = `https://api.github.com/repos/nluttenberger/${myColl}/contents/${importPath}?recursive=true`;
      fetch (url_str,{headers: hdrs})
        .then (resp => {
          console.log('Import-Verzeichnis eingelesen: ', resp.status, resp.statusText);
          return resp.json();
        })
        .then (data => {
          data.forEach ((entry, idx) => {
            if (entry.type === 'file' && !entry.name.match(re)) {
              let recpPlain = entry.name.substr(0,entry.name.indexOf('.xml'));
              $('#impRcpList').append (`<option value="${recpPlain}"></option>`)
            }
          })
        })
        .catch ((error) => {
          console.error('Error while reading import dir:', error);
        })
    })
    .catch (error => {
      console.error('Error while reading collection descriptor:', error);
    })
}

function genRefs () {
  let url_str = 'https://api.github.com/repos/nluttenberger/Ingredients/contents/igt-catalog.json';
  fetch (url_str,{headers: hdrs})
    .then (resp => {
      console.log ('Normierte Zutatenbezeichnungen eingelesen: ',resp.status, resp.statusText);
      return resp.json()
    })
    .then (data => {
      igtCat = b64_to_utf8 (data.content);
      igtCat = JSON.parse (igtCat);
      igtCat = igtCat.ingredients;
      findNormNames();
    })
    .catch ((error) => {
      console.error ('Error while importing igdt catalog:', error);
    })
}

function findNormNames () {
  let i;
  // outer loop: form ingredient name fields
  for (i = 0; i < $("[name=ingdtName]").length; i++) {
    let ref = $("[name=ingdtRef]")[i];
    let given = $("[name=ingdtName]")[i].value;
    given = given.toLowerCase().replace(/\(/g, '').replace(/\)/g, '');
    let matches = [];
    //inner loop: normName and synonymes
    igtCat.forEach(igt => {
      let x = String(igt.normName);
      let m = given.match(x);
      if (m !== null) {
        let match = new Object();
        match.name = igt.id;
        match.pos = m.index;
        match.len = x.length;
        matches.push (match);
      }
      let synos = igt.synonyms;
      synos.forEach (syno => {
        let xs = String(syno);
        let ms = given.match(xs);
        if (ms !== null) {
          let match = new Object();
          match.name = igt.id;
          match.pos = ms.index;
          match.len = xs.length;
          matches.push (match);
        }
      })
      if (matches.length>0) {
        matches.sort(function(a, b) {
          return b["len"] - a["len"] || a["pos"] - b["pos"];
        });
        let mObj = new Object();
        mObj = matches[0];
        ref.value = mObj.name;
      }
    })
  }
}

function fetchSublistsIdx () {
  let url_str = `https://api.github.com/repos/nluttenberger/${myColl}/contents/sublists_xml`;
  fetch(url_str, {headers: hdrs})
    .then(resp => resp.json())
    .then(data => {
      data.forEach((entry, idx) => {
        $('#subLists').append(`<option value="${entry.name.substr(0, entry.name.indexOf('.xml'))}"></option>`)
        // $('#subLists').append(`<option value="${entry.path.substr(0, entry.path.indexOf('.xml'))}"></option>`)
      })
    })
    .catch ((error) => {
      console.error('Error while importing sublists:', error);
    })
}

function fetchIgtRefs () {
  let url_str = 'https://api.github.com/repos/nluttenberger/Ingredients/contents/datalist-for-autocomplete.html';
  fetch (url_str,{headers: hdrs})
    .then (resp => {
      console.log('HTML Referenzliste eingelesen: ', resp.status, resp.statusText);
      return resp.json()
    })
    .then (data => {
      let igtCat = b64_to_utf8(data.content);
      $('#igdt-refs').append(igtCat);
    })
    .catch((error) => {
      console.error ('Error while importing igdt refs:', error);
    });
}

function reloadRefs () {
  $('#igdt-refs').empty();
  fetchIgtRefs();
}

function importRecipe () {
  let impRcp = $('#impText').val();
  if (impRcp != '' && importPath != '') {
    let url_str = `https://api.github.com/repos/nluttenberger/${myColl}/contents/${importPath}/${impRcp}.xml`
    fetch(url_str,{headers: hdrs})
      .then (resp => {
        console.log ('Rezept importiert: ',resp.status, resp.statusText);
        return resp.json();
      })
      .then (function (data) {
        rcpXML = b64_to_utf8(data.content);
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(rcpXML, "text/xml");
        const recipeName = xmlDoc.getElementsByTagName("fr:recipeName")[0].childNodes[0].nodeValue;
        // ingredients
        importType = 'recipe';
        showIgtList(xmlDoc,impRcp);
        $('#ingredients').append (ingr);
        // instructions
        let x = xmlDoc.getElementsByTagName("fr:instrStepText");
        let instr = `<fieldset name="step"><legend>Zubereitungsschritt</legend><input type="text" name="instrStepName"  value="${recipeName}"><br><br>`;
        for (let i = 0; i<x.length; i++) {
          instr += `<textarea name="instrStepText" class="generalTextField">${x[i].childNodes[0].nodeValue}</textarea><input type="button" value="+"><br>`;
        }
        instr += '</fieldset><input name="instrStep" type="button" value="weiterer Schritt"><br></fieldset>'
        $('#instructions').append (instr);
        $('[name="step"] [type="button"]').click(add_instrStepText);
        $('[name="step"] + [type="button"]').click(add_instrStep);
      })
      .catch ((error) => {
        console.error('Error while importing recipe:', error);
      });
  } else {
    alert ("Kein Rezept oder kein Import-Verzeichnis angegeben!");
  }
}

function importList () {
  let impListName = $(this).parent().find("[name='impListInput']").val();
  let inputDiv = $(this).parent();
  if (impListName != '') {
    let url_str = `https://api.github.com/repos/nluttenberger/${myColl}/contents/sublists_xml/${impListName}.xml`;
    fetch(url_str,{headers: hdrs})
      .then (function (resp) {
        console.log ('Subliste importiert: ',resp.status, resp.statusText);
        return resp.json();
      })
      .then (function (data) {
        rcpXML = b64_to_utf8(data.content);
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(rcpXML, "text/xml");
        // ingredients
        importType = 'list';
        showIgtList(xmlDoc,impListName);
        $(ingr).insertAfter(inputDiv);
      })
      .catch ((error) => {
        console.error('Error while importing recipe:', error);
      });
  } else {
    alert ("Kein Listenname angegeben!");
  }
}

function showIgtList (xmlDoc,impListName) {
  let x = xmlDoc.getElementsByTagName("fr:igdtListLine");
  let y = xmlDoc.getElementsByTagName("fr:igdtQuantity");
  let z = xmlDoc.getElementsByTagName("fr:igdtName");
  ingr = '<div><fieldset name="ingredientList" class="noshow"';
  switch (importType) {
    case 'recipe' : {
      ingr += `data-from-recipe="${impListName}"`;
      ingr += `data-from-rcpID ="${xmlDoc.getElementsByTagName("fr:recipe")[0].getAttribute('rcpID')}"`;
      ingr += `data-from-book="${xmlDoc.getElementsByTagName("fr:book")[0].textContent}"`;
      ingr += `data-from-chapter="${xmlDoc.getElementsByTagName("fr:chapter")[0].textContent}"`;
      importType = '';
      break;
    }
    case 'list' : {
      ingr += `data-from-recipe="${xmlDoc.getElementsByTagName("fr:igdtList")[0].getAttribute('fromRecipe')}"`;
      ingr += `data-from-rcpID="${xmlDoc.getElementsByTagName("fr:igdtList")[0].getAttribute('fromRcpID')}"`;
      ingr += `data-from-book="${xmlDoc.getElementsByTagName("fr:igdtList")[0].getAttribute('fromBook')}"`;
      ingr += `data-from-chapter="${xmlDoc.getElementsByTagName("fr:igdtList")[0].getAttribute('fromChapter')}"`;
      importType = '';
      break;
    }
    default : {
      console.log ('Import nicht erkannt.')
    }
  }
  ingr += '><legend>Zutatenliste</legend><label>Listenname<input class="longTextInput" name="ingdtListName" ';
  ingr += `value="${impListName}"</label><br><br>`;
  if (x.length > 0) {
    for (let i = 0; i<x.length; i++) {
      let iQ = (y[i].childNodes[0] === undefined) ? "" : `${y[i].childNodes[0].nodeValue}`;
      let iN = (z[i].childNodes[0] === undefined) ? "" : `${z[i].childNodes[0].nodeValue}`;
      ingr += `<label>Menge<input type="text" class="shortTextInput" name="ingdtQuantity" value="${iQ}"></label><label>Zutat<textarea name="ingdtName" class="ingredientNameField">${iN}</textarea></label> <label>Referenz<input type="text" class="shortTextInput" name="ingdtRef" list="igdt-refs" value="${z[i].getAttribute('ref')}"></label><input type="button" data-purpose="addIgt" value="+"><br>`;
    }
  }
  ingr += '</fieldset>' +
      ' <input type="button" data-purpose="addIgtList" value="weitere Liste anlegen">' +
      ' <input type="button" data-purpose="importIgtList" value="Liste importieren">'  +
      ' <input type="text" class="longTextInput" name="impListInput" list="subLists" value="">' +
      '</div><br>'
}

function add_introText() {
  let button = $('<input type="button" value="+"/>').click(add_introText);
  $(this).after('<br/><textarea class="generalTextFieldSmall" name="introText" ></textarea>', button);
}

function add_ingredient() {
  $(this).after('<br>' +
    '<label>Menge<input type="text" class="shortTextInput" name="ingdtQuantity" value=""></label>'+
    '<label>Zutat<textarea name="ingdtName" class="ingredientNameField"></textarea></label> '+
    '<label>Referenz<input type="text" class="shortTextInput" name="ingdtRef" list="igdt-refs" value=""></label>'+
    '<input type="button" data-purpose="addIgt" value="+"/>')
}

function add_ingdtList() {
  $(this).parent().after(
    '<div>' +
    '<br>' +
    '<fieldset name="ingredientList"> <legend>Zutatenliste</legend>' +
    '<label>Listenname<input type="text" class="longTextInput" name="ingdtListName" value=""></label>' +
    '<br><br>' +
    '<label>Menge<input type="text" class="shortTextInput" name="ingdtQuantity" value=""></label>' +
    '<label>Zutat<textarea name="ingdtName" class="ingredientNameField"></textarea></label> ' +
    '<label>Referenz<input type="text" class="shortTextInput" name="ingdtRef" list="igdt-refs" value=""></label>' +
    '<input type="button" data-purpose="addIgt" value="+"/>' +
    '<br><br>' +
    '<input type="button" data-purpose="exportList" value="diese Liste exportieren">' +
    '</fieldset><br>' +
    '<input type="button" data-purpose="addIgtList" value="weitere Liste anlegen">' +
    '<input type="button" data-purpose="importIgtList" value="Liste importieren">' +
    '<input type="text" class="longTextInput" name="impListInput" list="subLists" value="">' +
    '</div>'
  );
}

function exportList() {
  let parser = new DOMParser();
  let list = `<fr:igdtList xmlns:fr='http://fruschtique.de/ns/recipe' noshow='noshow' fromRecipe='${rcpName}' fromRcpID='${rcpID}' fromBook='${cookbook}' fromChapter='${chapter}'></fr:igdtList>`;
  let xmlDoc = parser.parseFromString(list, "text/xml");
  // ingredient list name
  let listName = $($($(this).siblings('label')[0]).children('input')[0]).val();
  let listNameEl = xmlDoc.createElement("fr:igdtListName");
  let txtNode = xmlDoc.createTextNode(listName);
  listNameEl.append(txtNode);
  xmlDoc.documentElement.append(listNameEl);
  // ingredients
  let ingdtQty = $($(this).siblings()).children("[name='ingdtQuantity']");
  let len = ingdtQty.length;
  let ingdtNames = $($(this).siblings()).children('.ingredientNameField');
  let ingdtRef = $($(this).siblings()).children("[name='ingdtRef']");
  for (let i=0;i<len;i++){
    if ($(ingdtNames[i]).val().length > 0) {
      let igdtListLine = xmlDoc.createElement ("fr:igdtListLine");
      let igdtQuantity = xmlDoc.createElement ("fr:igdtQuantity");
      let txt = xmlDoc.createTextNode($(ingdtQty[i]).val());
      igdtQuantity.append(txt);
      igdtListLine.append(igdtQuantity);
      let igdtName = xmlDoc.createElement ("fr:igdtName");
      txt = xmlDoc.createTextNode($(ingdtNames[i]).val());
      igdtName.append(txt);
      igdtListLine.append(igdtName);
      txt = $(ingdtRef[i]).val();
      igdtName.setAttribute('ref',txt);
      igdtListLine.append(igdtName);
      xmlDoc.documentElement.append(igdtListLine);
    }
  }
  // export
  let xmlText = new XMLSerializer().serializeToString(xmlDoc);
  let b64Recipe = utf8_to_b64(xmlText);
  //build update object and url -----------------------------------------
  let update = {
    'message': 'update',
    'content': b64Recipe,
  }
  let p = `sublists_xml/${listName}.xml`;
  let urlStr = `https://api.github.com/repos/nluttenberger/${myColl}/contents/${p}`;
  // upload and commit --------------------------------------------------
  fetch (urlStr,{
    method: 'PUT',
    body: JSON.stringify(update),
    headers: hdrs
  })
      .then (resp => {
        console.log('Liste exportiert: ', resp.status, resp.statusText);
        if (resp.status === 200) {
          location.reload(true);
        }
        return resp.json()
      })
      .then (data => {
      })
      .catch((error) => {
        console.error('Error while exporting sublist: ', error);
      })
}

function add_instrStepText() {
  let button = $('<input type="button" value="+"/>').click(add_instrStepText);
  $(this).after('<br/><textarea name="instrStepText" class="generalTextField"></textarea> ', button);
}

function add_instrStep() {
  let button = $('<input type="button" value="weiterer Schritt"/>').click(add_instrStep);
  $(this).after('<br/><fieldset name="step"><legend>Zubereitungsschritt</legend><input type="text" name="instrStepName" ' +
      'placeholder="Bezeichnung"/><br/><br/><textarea name="instrStepText" class="generalTextField">' +
      '</textarea>' +
      '<input type="button" name="instrStepAdd" value="+" /></fieldset> ', button);
  $("input[name='instrStepAdd']").click(add_instrStepText);
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

// --- save recipe --------------------------------------------------------------
function saveRecipe() {

  rcpOneWordName = document.getElementById("rcpOneWordName").value
  if (rcpOneWordName.length === 0) {
    alert ("Bitte einen Ein-Wort-Namen für das Rezept eingeben!");
    return;
  }
  let text = '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<!DOCTYPE stylesheet SYSTEM "file:///C:/Users/nlutt/Documents/Websites/tools/entities.dtd">\n' +
      '<fr:recipe \n' +
      '    xmlns:fr="http://fruschtique.de/ns/recipe" \n' +
      '    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \n' +
      '    xsi:schemaLocation= \n' +
      '    "http://fruschtique.de/ns/recipe ../../../tools/recipe.xsd" \n' +
      '    rcpID = "' + rcpID + '" \n' +
      '    rcpOneWordName = "' + rcpOneWordName + '" >\n' +
      '</fr:recipe>';
  //console.log (text)
  let parser = new DOMParser();
  let xmlDoc = parser.parseFromString(text, "text/xml");
  const chapter = document.getElementById("chapter").value;
  let rcpChapter = xmlDoc.createElement("fr:chapter");
  let rcpChapterText = xmlDoc.createTextNode(chapter);
  rcpChapter.appendChild(rcpChapterText);
  const book = document.getElementById("book").value;
  let rcpBook = xmlDoc.createElement("fr:book");
  let rcpBookText = xmlDoc.createTextNode(book);
  rcpBook.appendChild(rcpBookText);
  let rcpMeta = xmlDoc.createElement("fr:meta");
  rcpMeta.appendChild(rcpBook);
  rcpMeta.appendChild(rcpChapter);
  xmlDoc.documentElement.appendChild(rcpMeta);

  const recipeName = document.getElementsByName("recipeName")[0].value;
  let rcpName = xmlDoc.createElement("fr:recipeName");
  let rcpNameText = xmlDoc.createTextNode(recipeName);
  rcpName.appendChild(rcpNameText);
  xmlDoc.documentElement.appendChild(rcpName);

  let rcpInput = document.getElementsByName("recipeKeywords")[0].value;
  let rcpKeywords = xmlDoc.createElement("fr:recipeKeywords");
  let rcpKeywordsText = xmlDoc.createTextNode(rcpInput);
  rcpKeywords.appendChild(rcpKeywordsText);
  xmlDoc.documentElement.appendChild(rcpKeywords);

  let rcpIntro = xmlDoc.createElement("fr:recipeIntro");
  xmlDoc.documentElement.appendChild(rcpIntro);
  let introText = document.getElementsByName("introText");
  for (let i = 0; i < introText.length; i++) {
    let rcpintrotxtText = xmlDoc.createTextNode(introText[i].value);
    if (rcpintrotxtText.textContent.length > 0) {
      let rcpintrotxt = xmlDoc.createElement("fr:introText");
      rcpintrotxt.appendChild(rcpintrotxtText);
      xmlDoc.getElementsByTagName("fr:recipeIntro")[0].appendChild(rcpintrotxt);
    }
  }

  //--- ingredients ---------------------------------------------------
  let rcpIngredients = xmlDoc.createElement("fr:recipeIngredients");
  xmlDoc.documentElement.appendChild(rcpIngredients);
  let ingredientLists = document.getElementsByName("ingredientList");

  let rcpigdtlistnames = document.getElementsByName("ingdtListName");
  let i, list_empty;
  for (i = 0; i < ingredientLists.length; i++) {
    let curIgdtList = ingredientLists[i];
    let curIgdtListName = rcpigdtlistnames[i];
    let curIgdtNameList = $(curIgdtList).find('[name="ingdtName"]');
    let curIgdtQtyList = $(curIgdtList).find('[name="ingdtQuantity"]');
    let curIgdtRefList = $(curIgdtList).find('[name="ingdtRef"]');

    list_empty = true;
    for (let j = 0; j < curIgdtNameList.length; j++) {
      let txtName = xmlDoc.createTextNode(curIgdtNameList[j].value);
      if (txtName.textContent.length > 0) {
        list_empty = false;
      }
    }

    if (list_empty === false) {
      let txt = document.createTextNode(curIgdtListName.value);
      let rcpIgdtList = xmlDoc.createElement("fr:igdtList");
      if (curIgdtList.className === 'noshow') {
        rcpIgdtList.setAttribute('noshow', 'noshow');
        rcpIgdtList.setAttribute('fromRecipe', curIgdtList.getAttribute('data-from-recipe'));
        rcpIgdtList.setAttribute('fromRcpID', curIgdtList.getAttribute('data-from-rcpID'));
        rcpIgdtList.setAttribute('fromBook', curIgdtList.getAttribute('data-from-book'));
        rcpIgdtList.setAttribute('fromChapter', curIgdtList.getAttribute('data-from-chapter'));
      }

      let rcpIgdtListName = xmlDoc.createElement("fr:igdtListName");
      rcpIgdtListName.appendChild(txt);
      rcpIgdtList.appendChild(rcpIgdtListName);
      rcpIngredients.appendChild(rcpIgdtList);

      for (let j = 0; j < curIgdtNameList.length; j++) {
        let txtName = xmlDoc.createTextNode(curIgdtNameList[j].value);
        if (txtName.textContent.length > 0) {
          list_empty = false;
          let rcpigdtname = xmlDoc.createElement("fr:igdtName");
          let rcpigdtqty = xmlDoc.createElement("fr:igdtQuantity");
          let txtQty = xmlDoc.createTextNode(curIgdtQtyList[j].value);
          let rcpigdtlistline = xmlDoc.createElement("fr:igdtListLine");
          rcpigdtqty.appendChild(txtQty);
          rcpigdtlistline.appendChild(rcpigdtqty);
          rcpigdtname.appendChild(txtName);
          rcpigdtname.setAttribute("ref", curIgdtRefList[j].value);
          rcpigdtlistline.appendChild(rcpigdtname);
          rcpIgdtList.appendChild(rcpigdtlistline);
        }
      }
    }
  }

  //--- instructions ---------------------------------------------------
  let j, instr_empty, txt;
  var rcpInstructions = xmlDoc.createElement("fr:recipeInstructions");
  xmlDoc.documentElement.appendChild(rcpInstructions);
  var stepList = document.getElementsByName("step");
  var stepNameList = document.getElementsByName("instrStepName");
  for (i = 0; i < stepList.length; i++) {
    instr_empty = true;
    let curStep = stepList[i];
    let StepTexts = $(curStep).find('[name="instrStepText"]');

    for (j = 0; j < StepTexts.length; j++) {
      txt = xmlDoc.createTextNode(StepTexts[j].value);
      if (txt.textContent.length > 0) {
        instr_empty = false;
      }
    }

    if (instr_empty === false) {
      let step = xmlDoc.createElement("fr:instruction");
      let stepName = xmlDoc.createElement("fr:instrStepName");
      txt = xmlDoc.createTextNode(stepNameList[i].value);
      stepName.appendChild(txt);
      step.appendChild(stepName);

      for (j = 0; j < StepTexts.length; j++) {
        let instrStepText = xmlDoc.createElement("fr:instrStepText");
        txt = xmlDoc.createTextNode(StepTexts[j].value);
        if (txt.textContent.length > 1) {
          instrStepText.appendChild(txt);
          step.appendChild(instrStepText);
        }
      }
      rcpInstructions.appendChild(step);
    }
  }

  //--- sideDish ----------------------------------------------------------------
  rcpInput = document.getElementsByName("dazuText")[0].value;
  let rcpSideDish = xmlDoc.createElement("fr:recipeSideDish");
  txt = xmlDoc.createTextNode(rcpInput);
  rcpSideDish.appendChild(txt);
  xmlDoc.documentElement.appendChild(rcpSideDish);

  //--- origin ----------------------------------------------------------------
  rcpInput = document.getElementsByName("originText")[0].value;
  let rcpOrigin = xmlDoc.createElement("fr:recipeOrigin");
  txt = xmlDoc.createTextNode(rcpInput);
  rcpOrigin.appendChild(txt);
  xmlDoc.documentElement.appendChild(rcpOrigin);

  //--- seeAlso ----------------------------------------------------------------
  rcpInput = document.getElementsByName("auchText")[0].value;
  let rcpAuch = xmlDoc.createElement("fr:recipeSeeAlso");
  let rcpAuchText = xmlDoc.createTextNode(rcpInput);
  rcpAuch.appendChild(rcpAuchText);
  xmlDoc.documentElement.appendChild(rcpAuch);

  //--- license ----------------------------------------------------------------
  rcpInput = document.getElementsByName("lizenzText")[0].value;
  let rcpLicense = xmlDoc.createElement("fr:recipeLicense");
  let rcpLicenseText = xmlDoc.createTextNode(rcpInput);
  rcpLicense.appendChild(rcpLicenseText);
  xmlDoc.documentElement.appendChild(rcpLicense);

  //--- serialize form input to XML --------------------------------------------------
  let xmlText = new XMLSerializer().serializeToString(xmlDoc);
  // convert updated recipe to base64 -----------------------------------
  let b64Recipe = utf8_to_b64(xmlText);
  //build update object and url -----------------------------------------
  let update = {
    'message': 'update',
    'content': b64Recipe,
    'sha': gitSHA
  }
  let urlStrUp = `https://api.github.com/repos/nluttenberger/${myColl}/contents/${gitPath}`;
  let urlStrReload = `https://api.github.com/repos/nluttenberger/${myColl}/contents/recipes_xml/${myChap}/${myRecp}`;
  // upload and commit --------------------------------------------------
  fetch (urlStrUp,{
    method: 'PUT',
    body: JSON.stringify(update),
    headers: hdrs
    })
    .then (resp => {
      console.log('Update: ', resp.status, resp.statusText);
      if (resp.status === 200) {
        alert ('Rezept abgespeichert!')
      }
      //location.reload(true)
      
      })
    
    .catch((error) => {
      console.error('Error while saving recipe: ', error);
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