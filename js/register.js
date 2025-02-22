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

    // introduce here full flat orph structure

    // serialize flat orph for GitHub repository
    const xmlString = new XMLSerializer().serializeToString(xml);       
    console.log(xmlString);        
    b64orph = window.btoa(xmlString);

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