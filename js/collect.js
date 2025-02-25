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
}