const categories = [
  {catName: 'für Gäste', catColor: '#587291'},
  {catName: 'für jeden Tag', catColor: '#587291'},
  {catName: 'für\'s Büffet', catColor: '#587291'},
  {catName: 'für\'s Frühstück', catColor: '#587291'},
  {catName: 'zum Sekt', catColor: '#fe621d'},
  {catName: 'klein, aber fein', catColor: '#fe621d'},
  {catName: 'Quiches', catColor: '#419d78'},
  {catName: 'orientalisch u asiatisch', catColor: '#565554'},
  {catName: 'italienisch', catColor: '#565554'},
  {catName: 'deutsch', catColor: '#565554'},
  {catName: 'meine Lieblinge', catColor: '#a71d31'}
]
let chapters = [];
let recipesChapterwise = new Map;
let myColl, myChap, myRecp;
let gitName, gitPath, gitSHA;
let url_str;
const apiKey = localStorage.getItem('apiKey');
const hdrs = {
  'Accept': 'application/vnd.github.v3+json',
  'Authorization': apiKey
}

function b64_to_utf8(str) {
  return decodeURIComponent(escape(window.atob(str)));
}
function utf8_to_b64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

function getChapters () {
  let myURL = new URL (document.URL);
  myColl = myURL.searchParams.get('coll');
  // create list of chapters
  url_str = `https://api.github.com/repos/nluttenberger/${myColl}/contents`;
  console.log (url_str)

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
          // extract chapters
          chapters = tree.filter (item => {
            return (item.type === 'tree')
          }).map (item => item.path);
          for (chapter of chapters) {
            // extract recipes
            let zz = tree.filter (item => {
              return (item.path.substring (0,chapter.length) === chapter && item.path.substring (chapter.length+1,2*chapter.length+1) != chapter && item.type === 'blob')
            }).map (item => item.path.substring(0,item.path.indexOf('.xml')));
            // map recipes to chapters
            recipesChapterwise.set(chapter,zz);
          }
          buildCatForm();
        })
        .catch ((error) => {
          console.log('Error while reading directory listings:', error);
        })
    })
    .catch ((error) => {
      console.log('Error while reading collection sha:', error);
    })
}

function buildCatForm () {
  for (const [chapter,recipes] of recipesChapterwise) {
    // console.log (chapter);
    // console.log (recipes);
    let tabtab = document.getElementById('tabtab');
    let h4El = document.createElement('h4');
    h4El.innerHTML = `<h4>${chapter}</h4>`;
    tabtab.appendChild(h4El);
    for (recipe of recipes) {
      let row = document.querySelector('#formRow');
      let td = row.content.querySelectorAll("td");
      td[0].firstChild.innerHTML = `<a href="https://${myColl}.fruschtique.de/recipes/${recipe}.html" target="_blank">${recipe.substring(chapter.length+1)}</a>`;
      for (let i=1;i<td.length;i++) {
        td[i].firstChild.value = recipe;
        td[i].firstChild.name = categories[i-1].catName;
      }
      let tab = document.getElementById("tabtab");
      let clone = document.importNode(row.content, true);
      tab.appendChild(clone);
    }
  }
  // set checkmarks to assigned checkboxes
  let url_str = `https://api.github.com/repos/nluttenberger/${myColl}/contents/recipe2cat.xml`;
  fetch(url_str, {headers: hdrs})
    .then(resp => resp.json())
    .then(data => {
      r2cXML = b64_to_utf8(data.content);
      gitName = data.name;
      gitPath = data.path;
      gitSHA = data.sha;
      let pars = new DOMParser();
      let r2c = pars.parseFromString(r2cXML, 'application/xml');
      let assigns = Array.from(r2c.getElementsByTagName('cat:assignment'))
      for (assign of assigns) {
        let cat = Array.from (assign.getElementsByTagName('cat:cat')).map (item => item.textContent)
        let rs = Array.from (assign.getElementsByTagName('cat:recipe')).map (item => item.textContent)
        console.log (cat[0], rs)
        for (r of rs) {
          document.querySelectorAll(`input[name="${cat[0]}"][value="${r}"]`)[0].checked = true;
        }
      }
      // install counters for number of checks per cat
      recount();
    })
    .catch((error) => {
      console.log('Error while reading recipe2cat:', error);
    })
}

function recount () {
  let countingCells = Array.from (document.getElementsByClassName('counter'));
  for (let i = 0; i < categories.length; i++) {
    let counter = (Array.from(document.querySelectorAll(`input[name="${categories[i].catName}"]:checked`))).length;
    countingCells[i].textContent = counter;
  }
}

function saveCatAssignments() {
  let text = '<?xml version="1.0" encoding="UTF-8"?> \n' +
    '<!DOCTYPE stylesheet SYSTEM "file:///C:/Users/nlutt/Documents/Websites/tools/entities.dtd">\n' +
    '<cat:assignments \n' +
    '    xmlns:cat="http://fruschtique.de/ns/recipe-cat" \n' +
    '    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \n' +
    '    xsi:schemaLocation= "http://fruschtique.de/ns/recipe-cat ../tools/cat-assign.xsd"> \n' +
    '</cat:assignments>';
  let parser = new DOMParser();
  let xmlDoc = parser.parseFromString(text, "application/xml");
  for (category of categories) {
    let assignment = document.createElementNS("http://fruschtique.de/ns/recipe-cat", 'cat:assignment');
    let cat = document.createElementNS("http://fruschtique.de/ns/recipe-cat", 'cat:cat');
    let color = document.createElementNS("http://fruschtique.de/ns/recipe-cat", 'cat:color');
    cat.textContent = category.catName;
    assignment.appendChild(cat);
    const checked = Array.from(document.querySelectorAll(`input[name="${category.catName}"]:checked`)).map(item => item.value);
    for (check of checked) {
      let rcp = document.createElementNS("http://fruschtique.de/ns/recipe-cat", 'cat:recipe');
      rcp.textContent = check;
      assignment.appendChild(rcp);
    }
    color.textContent = category.catColor;
    assignment.appendChild(color);
    xmlDoc.documentElement.appendChild(assignment);
  }
  let xmlText = new XMLSerializer().serializeToString(xmlDoc);
  console.log (xmlText);
  commit (xmlText);
}

function commit (xmlText) {
  let b64CatForm = utf8_to_b64(xmlText);
  let update = {
    'message': 'update',
    'content': b64CatForm,
    'sha': gitSHA
  }
  url_Str = `https://api.github.com/repos/nluttenberger/${myColl}/contents/${gitPath}`;
  fetch (url_Str,{
    method: 'PUT',
    body: JSON.stringify(update),
    headers: hdrs
  })
    .then (resp => {
      console.log('Update: ', resp.status, resp.statusText);
      if (resp.status === 200) {
        alert ('Kategorienzuordnung abgespeichert!')
        location.reload(true);
      }
      return resp.json()
    })
    .then (data => {
      //console.log (data.commit);
    })
    .catch((error) => {
      console.error('Error while saving form: ', error);
    })
}