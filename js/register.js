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
    const short = xml.createElement("short");
    short.innerHTML = `
        <opera>${opera}</opera>
        <composer>${composer}</composer>
        <place>${place}</place>
        <year>${year}</year>
        <fimtID>${fimtID}</fimtID>
        <orphID>${orphID}</orphID>`;
    orph.appendChild(short);

    // show performance block
    section = 
    { id: "performance", legend: "Aufführung", fields: [
        { label: "Oper", value: "", name: "opera", gnd: "" },
        { label: "Komponist", value: "", name: "composer", gnd: "" },
        { label: "Librettist", value: "", name: "libretto", gnd: "" },
        { label: "Uraufführung (Jahr)", value: "", name: "firstPerformance", gnd: "" },
        { label: "Produktion", value: "", name: "production", gnd: "" },
        { label: "Bühne", value: "", name: "stage", gnd: "" },
        { label: "Ort", value: "", name: "place", gnd: "" },
        { label: "Premiere (Jahr)", value: "", name: "premiere", p: "", gnd: "" },
        { label: "Inszenierung", value: "", name: "director", gnd: ""},
        { label: "Musikal. Leitung", value: "", name: "conductor", gnd: ""},
        { label: "Dramaturgie", value: "", name: "dramatist", gnd: ""},
        { label: "Orchester", value: "", name: "orchestra", gnd: ""}
    ] };
fieldset = document.createElement("fieldset");
fieldset.setAttribute("id", section.id);
fieldset.innerHTML = `<legend>${section.legend}</legend><div class="form-container"></div>`;
container = fieldset.querySelector(".form-container");
section.fields.forEach(field => {
    container.innerHTML += `
        <label>${field.label}</label>
        <input type="text" name="${field.name}" value="${field.value}"></input>
        <label class="GND-label">GND-ID</label>
        <input type="text" name="${field.name}GND" value="${field.gnd}"></input>`;
});
//const opInput = fieldset.querySelector("input[name='opera']");
//opInput.setAttribute("list", "operas");
    orph.appendChild(fieldset);


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
    // upload and commit --------------------------------------------------
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