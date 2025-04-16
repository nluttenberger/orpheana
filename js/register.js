function register() {

    // check if API key is available
    const apiKey = localStorage.getItem('apiKey');
    if (apiKey === null) {
        alert("Bitte autorisieren!");
    }
    const hdrs = {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': apiKey
    }

    // check if all text input is provided
    const op = document.querySelector("input[name='s-opera']").value;
    const comp = document.querySelector("input[name='s-composer']").value;
    const pl = document.querySelector("input[name='s-place']").value;
    const yr = document.querySelector("input[name='s-year']").value;
    const fimtID = document.querySelector("input[name='s-fimtID']").value;
    if (op === "" || comp === "" || pl === "" || yr === "") {
        alert("Bitte alle Angaben machen");
        return;
    }

    // compute MD5 hash value for year-opera-composer-place string
    const hash = op + comp + pl + yr;
    const hashValue = CryptoJS.MD5(hash).toString();

    // set orph-ID
    const orphID = `orph-${hashValue}`;

    // init XML parser and collect input into XML elements
    const parser = new DOMParser();

    const orphXML = parser.parseFromString(
        '<?xml version="1.0" encoding="UTF-8"?> \n' +
        '<orph:orph xmlns:orph="http://orpheana.de/ns/orph" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \n' +
        'xsi:schemaLocation="http://orpheana.de/ns/orph file:///C:/Users/nlutt/Documents/Orpheana/03%20tools/orphSchema.xsd"> \n' + 
        '</orph:orph>', 'text/xml'); 

    const orph = orphXML.querySelector("orph");

    // short section
    const short = orphXML.createElement("orph:short");
    const sOpera = orphXML.createElement("orph:sOpera");
    sOpera.innerHTML = `${sOpera}`;
    short.appendChild(sOpera);
    const sComposer = orphXML.createElement("orph:sComposer");
    sComposer.innerHTML = `${sComposer}`;
    short.appendChild(sComposer);
    const sPlace = orphXML.createElement("orph:sPlace"); 
    sPlace.innerHTML = `${sPlace}`;
    short.appendChild(sPlace);  
    const sYear = orphXML.createElement("orph:sYear");
    sYear.innerHTML = `${sYear}`; 
    short.appendChild(sYear);
    const sOrphID = orphXML.createElement("orph:orphID");
    sOrphID.innerHTML = `${orphID}`;
    short.appendChild(sOrphID);
    const sFimtID = orphXML.createElement("orph:fimtID");
    sFimtID.innerHTML = `${fimtID}`;
    short.appendChild(sFimtID);
    orph.appendChild(short);

    // performance section
    const performance = orphXML.createElement("orph:performance");

    const opera = orphXML.createElement("orph:opera");
    const operaTitle = orphXML.createElement("orph:operaTitle");
    const operaGND = orphXML.createElement("orph:operaGND");
    opera.appendChild(operaTitle);
    opera.appendChild(operaGND); 
    performance.appendChild(opera);

    const composer = orphXML.createElement("orph:composer");
    const composerName = orphXML.createElement("orph:composerName");
    const composerGND = orphXML.createElement("orph:composerGND");
    composer.appendChild(composerName);
    composer.appendChild(composerGND); 
    performance.appendChild(composer);

    const libretto = orphXML.createElement("orph:libretto");
    const librettoName = orphXML.createElement("orph:librettoName");
    const librettoGND = orphXML.createElement("orph:librettoGND");
    libretto.appendChild(librettoName);
    libretto.appendChild(librettoGND);
    performance.appendChild(libretto);

    const firstPerformance = orphXML.createElement("orph:firstPerformance");
    performance.appendChild(firstPerformance);

    const production = orphXML.createElement("orph:production");
    const productionName = orphXML.createElement("orph:productionName");
    const productionGND = orphXML.createElement("orph:productionGND"); 
    production.appendChild(productionName);
    production.appendChild(productionGND);
    performance.appendChild(production);

    const stage = orphXML.createElement("orph:stage");
    const stageName = orphXML.createElement("orph:stageName");
    const stageGND = orphXML.createElement("orph:stageGND");
    stage.appendChild(stageName);
    stage.appendChild(stageGND);
    performance.appendChild(stage);

    const place = orphXML.createElement("orph:place");
    const placeName = orphXML.createElement("orph:placeName");
    const placeGND = orphXML.createElement("orph:placeGND");
    place.appendChild(placeName);
    place.appendChild(placeGND);
    performance.appendChild(place);

    const premiere = orphXML.createElement("orph:premiere");
    performance.appendChild(premiere);

    const director = orphXML.createElement("orph:director");
    const directorName = orphXML.createElement("orph:directorName");   
    const directorGND = orphXML.createElement("orph:directorGND");
    director.appendChild(directorName);
    director.appendChild(directorGND);
    performance.appendChild(director);

    const conductor = orphXML.createElement("orph:conductor");
    const conductorName = orphXML.createElement("orph:conductorName");
    const conductorGND = orphXML.createElement("orph:conductorGND");
    conductor.appendChild(conductorName);
    conductor.appendChild(conductorGND);
    performance.appendChild(conductor);

    const dramatist = orphXML.createElement("orph:dramatist");
    const dramatistName = orphXML.createElement("orph:dramatistName");
    const dramatistGND = orphXML.createElement("orph:dramatistGND");
    dramatist.appendChild(dramatistName);
    dramatist.appendChild(dramatistGND);
    performance.appendChild(dramatist);

    const orchestra = orphXML.createElement("orph:orchestra");
    const orchestraName = orphXML.createElement("orph:orchestraName");
    const orchestraGND = orphXML.createElement("orph:orchestraGND");
    orchestra.appendChild(orchestraName);
    orchestra.appendChild(orchestraGND);
    performance.appendChild(orchestra);

    const choir = orphXML.createElement("orph:choir");
    const choirName = orphXML.createElement("orph:choirName");
    const choirGND = orphXML.createElement("orph:choirGND");
    choir.appendChild(choirName);
    choir.appendChild(choirGND);
    performance.appendChild(choir);

    orph.appendChild(performance);
    
    // castList section
    const castList = orphXML.createElement("orph:castList");
    orph.appendChild(castList);

    // articles section
    const articles = orphXML.createElement("orph:articles");
    orph.appendChild(articles);

    // images section
    const images = orphXML.createElement("orph:images");
    orph.appendChild(images);

    // misc section
    const misc = orphXML.createElement("orph:misc");
    orph.appendChild(misc);

    // serialize flat orph for GitHub repository
    const xmlString = new XMLSerializer().serializeToString(orphXML);           
    // Encode the XML string in UTF-8
    const encoder = new TextEncoder();
    const utf8Array = encoder.encode(xmlString);

    // Convert the UTF-8 encoded array to a base64 string
    const b64orph = btoa(String.fromCharCode.apply(null, utf8Array));

    // create file name for flat orph
    const fn = `${yr}-${op}-${comp}-${pl}.xml`;
    const update = {
        'message': 'just created',
        'content': b64orph
    }
    const urlStr = `https://api.github.com/repos/nluttenberger/orpheana/contents/orphs/${comp}/${op}/${fn}`;

    // upload and commit 
    fetch (urlStr,{
        method: 'PUT',
        body: JSON.stringify(update),
        headers: hdrs
    })
        .then (resp => {
        if (resp.status === 201) {
            alert ('orph angelegt!')
        }
        return resp.json()
        })
        .then (data => {
        })
        .catch((error) => {
        console.error('Error while creating orph: ', error);
        })
}   

function createForm() {
    // show logo block 
    const boxtainer = document.createElement("div");
    boxtainer.classList.add("logo-container");
    boxtainer.innerHTML = `
        <div class="logo">
            <div>
                <img class="logoImage" src="fruschtique%20Logo%20grau%20transparent.png" alt="Logo" title="fruschtique-Logo">
            </div>
        </div> `;
    const body = document.getElementsByTagName("body")[0]
    body.appendChild(boxtainer);

    // create short block fieldset
    const booklet = document.createElement("fieldset");
    booklet.setAttribute("id", "booklet");
    let section;
    let fieldset;
    let container;
    
    // show short block
    section = 
        { id: "short", legend: "Registrierungsdaten", fields: [
            { label: "Oper", value: "", name: "s-opera", p: "Opera title; preferably one word" },
            { label: "Komponist", value: "", name: "s-composer", p: "Composer name; preferably one word" },
            { label: "Ort", value: "", name: "s-place", p: "Place of performance" },
            { label: "Jahr", value: "", name: "s-year", p: "Publication of booklet" },
            { label: "fimtID", value: "", name: "s-fimtID", p: "ID given by fimt" }
        ] };
    fieldset = document.createElement("fieldset");
    fieldset.setAttribute("id", section.id);
    fieldset.innerHTML = `<legend>${section.legend}</legend><div class="form-container"></div>`;
    container = fieldset.querySelector(".form-container");
    section.fields.forEach(field => {
        container.innerHTML += `
            <label>${field.label}</label>
            <input type="text" name="${field.name}" value="${field.value}"></input>
            <p class="right-text">${field.p}</p>`;
    });
    booklet.appendChild(fieldset);
    body.appendChild(booklet);

    // add register button
    button = document.createElement("div")
    button.innerHTML += `<input type="button" id="registerButton" value="orph registrieren" ></input>`
    booklet.appendChild(button);

    // add event handler to register button
    document.getElementById("registerButton").addEventListener("click", register); 
}