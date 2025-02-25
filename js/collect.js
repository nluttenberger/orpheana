function collect () {

    // Decode base64 string to UTF-8
    function b64_to_utf8(str) {
        const binaryString = window.atob(str);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(bytes);
    }
      
    // Encode XML string to UTF-8
    function utf8_to_b64(str) {
        const encoder = new TextEncoder();
        const utf8Array = encoder.encode(str);
        return btoa(String.fromCharCode.apply(null, utf8Array));
    }

    // Create form for orph data
    function makeForm(XMLdata) {
        alert ("Hat geklappt");
        console.log (XMLdata);
    }
    
    // Get form data from repository
    alert ("Start");
    let myPath;
    let myOrph;
    let orphXML;
    let myURL;
    let gitName; 
    let gitPath;
    let gitSHA;
    let hdrs;

    apiKey = localStorage.getItem('apiKey');
    hdrs = {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': apiKey
    }
    myURL = new URL(document.URL);
    myPath = myURL.searchParams.get('path');
    myOrph = myURL.searchParams.get('orph');
    console.log (`Pfad: ${myPath}, Orph: ${myOrph}`);
    
    let url_str = `https://api.github.com/repos/nluttenberger/orpheana/contents/orphs/${myPath}/.gitkeep`;
    fetch (url_str,{headers: hdrs})
    .then (resp => resp.json())
    .then (data => {
        console.log("Path ok");
        url_str = `https://api.github.com/repos/nluttenberger/orpheana/contents/orphs/${myPath}/${myOrph}`;
        fetch (url_str,{headers: hdrs})
        .then (resp => resp.json())
        .then (data => {
            orphXML = b64_to_utf8(data.content);
            gitName = data.name;
            gitPath = data.path;
            gitSHA = data.sha;
            makeForm(orphXML);
        })
        .catch ((error) => {
            console.log('Error while reading orph data:', error);
        })
    })
    .catch ((error) => {
        console.log(`Error while accessing ${myPath}`, error);
    })


}