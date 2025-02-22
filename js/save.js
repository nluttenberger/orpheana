function save() {

    function utf8_to_b64(str) {
        return window.btoa(encodeURIComponent(str));
    }

    // check if API key is available
    const apiKey = localStorage.getItem('apiKey');
    if (apiKey === null) {
        alert("Bitte zuerst einloggen");
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
    const xml = parser.parseFromString(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><booklet></booklet>`, "text/xml");
    const booklet = xml.querySelector("booklet");
    const short = xml.createElement("short");
    short.innerHTML = `
        <opera>${opera}</opera>
        <composer>${composer}</composer>
        <place>${place}</place>
        <year>${year}</year>
        <orphID>${orphID}</orphID>`;
    booklet.appendChild(short);

    // save booklet to GitHub repository
    const xmlString = new XMLSerializer().serializeToString(xml);               
    b64orph = utf8_to_b64(xmlString);

    //const blob = new Blob([xmlString], { type: "text/xml" });
    //const url = URL.createObjectURL(blob);
    //const a = document.createElement("a");
    //a.href = url;
    //a.download = `${year}-${opera}-${composer}-${place}.xml`;
    //a.click();

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