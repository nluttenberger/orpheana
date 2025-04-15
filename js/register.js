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
    const opera = document.querySelector("input[name='s-opera']").value;
    const composer = document.querySelector("input[name='s-composer']").value;
    const place = document.querySelector("input[name='s-place']").value;
    const year = document.querySelector("input[name='s-year']").value;
    const fimtID = document.querySelector("input[name='s-fimtID']").value;
    if (opera === "" || composer === "" || place === "" || year === "") {
        alert("Bitte alle Angaben machen");
        return;
    }

    // compute MD5 hash value for year-opera-composer-place string
    const hash = opera + composer + place + year;
    const hashValue = CryptoJS.MD5(hash).toString();

    // set orph-ID
    const orphID = `orph-${hashValue}`;

    // init XML parser and collect input into XML elements
    const parser = new DOMParser();
    const xml = parser.parseFromString(
        '<?xml version="1.0" encoding="UTF-8"?> \n' +
        '<orph:orph xmlns:orph="http://orpheana.de/ns/orph" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://orpheana.de/ns/orph ../../../../03%20tools/orphSchema.xsd"></orph:orph>', 'text/xml'); 
    const orph = xml.querySelector("orph");
    console.log(orph);

    // short section
    const short = xml.createElement("orph:short");
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

    const performance = xml.createElement("orph:performance");
    const castList = xml.createElement("orph:castList");
    const articles = xml.createElement("orph:articles");
    const images = xml.createElement("orph:images");
    const misc = xml.createElement("orph:misc");

    // performance section
    performance.innerHTML = `
        <orph:opera>
            <orph:operaTitle></orph:operaTitle>
            <orph:operaGND></orph:operaGND>
        </orph:opera>
        <orph:composer>
            <orph:composerName></orph:composerName>
            <orph:composerGND></orph:composerGND>
        </orph:composer>
        <orph:libretto>
            <orph:librettoName></orph:librettoName>
            <orph:librettoGND></orph:librettoGND>
        </orph:libretto>
        <orph:firstPerformance>
            <orph:firstPerformanceDate></orph:firstPerformanceDate>
            <orph:firstPerformanceGND></orph:firstPerformanceGND>
        </orph:firstPerformance>
        <orph:production>
            <orph:productionName></orph:productionName>
            <orph:productionGND></orph:productionGND>
        </orph:production>
        <orph:stage>
            <orph:stageName></orph:stageName>
            <orph:stageGND></orph:stageGND>
        </orph:stage>
        <orph:place>
            <orph:placeName></orph:placeName>
            <orph:placeGND></orph:placeGND>
        </orph:place>
        <orph:premiere> 
            <orph:premiereDate></orph:premiereDate>
            <orph:premiereGND></orph:premiereGND>
        </orph:premiere>
        <orph:director>
            <orph:directorName></orph:directorName>
            <orph:directorGND></orph:directorGND>
        </orph:director>
        <orph:conductor>
            <orph:conductorName></orph:conductorName>
            <orph:conductorGND></orph:conductorGND>
        </orph:conductor>
        <orph:dramatist>
            <orph:dramatistName></orph:dramatistName>
            <orph:dramatistGND></orph:dramatistGND>
        </orph:dramatist>
        <orph:orchestra>
            <orph:orchestraName></orph:orchestraName>
            <orph:orchestraGND></orph:orchestraGND>    
        </orph:orchestra>`;
    orph.appendChild(performance);

    // castList section
    orph.appendChild(castList);

    // articles section
    orph.appendChild(articles);

    // images section
    orph.appendChild(images);

    // misc section
    orph.appendChild(misc);

    // serialize flat orph for GitHub repository
    const xmlString = new XMLSerializer().serializeToString(xml);           
    // Encode the XML string in UTF-8
    const encoder = new TextEncoder();
    const utf8Array = encoder.encode(xmlString);

    // Convert the UTF-8 encoded array to a base64 string
    const b64orph = btoa(String.fromCharCode.apply(null, utf8Array));

    // create file name for flat orph
    const fn = `${year}-${opera}-${composer}-${place}.xml`;
    const update = {
        'message': 'just created',
        'content': b64orph
    }
    const urlStr = `https://api.github.com/repos/nluttenberger/orpheana/contents/orphs/${composer}/${opera}/${fn}`;

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