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
    const xml = parser.parseFromString(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><orph></orph>`, "text/xml");
    const orph = xml.querySelector("orph");

    // short section
    const short = xml.createElement("short");
    short.innerHTML = `
        <opera>${opera}</opera>
        <composer>${composer}</composer>
        <place>${place}</place>
        <year>${year}</year>
        <fimtID>${fimtID}</fimtID>
        <orphID>${orphID}</orphID>`;
    orph.appendChild(short);

    const performance = xml.createElement("performance");
    const castList = xml.createElement("castList");
    const stagingRelated = xml.createElement("stagingRelated");
    const storyRelated = xml.createElement("storyRelated");
    const musicRelated = xml.createElement("musicRelated");
    const historic = xml.createElement("historic");

    // performance section
    performance.innerHTML = `
        <opera>
            <operaTitle></operaTitle>
            <operaGND></operaGND>
        </opera>
        <composer>
            <composerName></composerName>
            <composerGND></composerGND>
        </composer>
        <libretto>
            <librettoName></librettoName>
            <librettoGND></librettoGND>
        </libretto>
        <firstPerformance>
            <firstPerformanceDate></firstPerformanceDate>
            <firstPerformanceGND></firstPerformanceGND>
        </firstPerformance>
        <production>
            <productionName></productionName>
            <productionGND></productionGND>
        </production>
        <stage>
            <stageName></stageName>
            <stageGND></stageGND>
        </stage>
        <place>
            <placeName></placeName>
            <placeGND></placeGND>
        </place>
        <premiere> 
            <premiereDate></premiereDate>
            <premiereGND></premiereGND>
        </premiere>
        <director>
            <directorName></directorName>
            <directorGND></directorGND>
        </director>
        <conductor>
            <conductorName></conductorName>
            <conductorGND></conductorGND>
        </conductor>
        <dramatist>
            <dramatistName></dramatistName>
            <dramatistGND></dramatistGND>
        </dramatist>
        <orchestra>
            <orchestraName></orchestraName>
            <orchestraGND></orchestraGND>    
        </orchestra>`;
    orph.appendChild(performance);

    // castList section
    orph.appendChild(castList);

    // stagingRelated texts section
    orph.appendChild(stagingRelated);

    // storyRelated texts section
    orph.appendChild(storyRelated);

    // musicRelated texts section
    orph.appendChild(musicRelated);

    // historic section
    orph.appendChild(historic);

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
    let addNewText
    
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