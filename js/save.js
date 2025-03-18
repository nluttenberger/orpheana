function save (short,gitName,gitPath,gitSHA,hdrs) {

    // Encode XML string to UTF-8
    function utf8_to_b64(str) {
        const encoder = new TextEncoder();
        const utf8Array = encoder.encode(str);
        return btoa(String.fromCharCode.apply(null, utf8Array));
    }

    // create XML-encoded plain-data orph from form input
    function createOrph (shortIN) {
        // collect text input from performance section
        const opera = document.querySelector("input[name='opera']").value;
        const operaGND = document.querySelector("input[name='operaGND']").value;
        const composer = document.querySelector("input[name='composer']").value;
        const composerGND = document.querySelector("input[name='composerGND']").value;
        const libretto = document.querySelector("input[name='libretto']").value;
        const librettoGND = document.querySelector("input[name='librettoGND']").value;
        const firstPerformance = document.querySelector("input[name='firstPerformance']").value;
        const production = document.querySelector("input[name='production']").value;
        const productionGND = document.querySelector("input[name='productionGND']").value;
        const stage = document.querySelector("input[name='stage']").value;
        const stageGND = document.querySelector("input[name='stageGND']").value;
        const place = document.querySelector("input[name='place']").value;
        const placeGND = document.querySelector("input[name='placeGND']").value;
        const premiere = document.querySelector("input[name='premiere']").value;
        const director = document.querySelector("input[name='director']").value;
        const directorGND = document.querySelector("input[name='directorGND']").value;
        const conductor = document.querySelector("input[name='conductor']").value;
        const conductorGND = document.querySelector("input[name='conductorGND']").value;
        const dramatist = document.querySelector("input[name='dramatist']").value;
        const dramatistGND = document.querySelector("input[name='dramatistGND']").value;
        const orchestra = document.querySelector("input[name='orchestra']").value;
        const orchestraGND = document.querySelector("input[name='orchestraGND']").value;

        // collect text input from cast list section
        const roles = document.querySelectorAll("input[name='role']");
        const artists = document.querySelectorAll("input[name='artist']");
        const artistGNDs = document.querySelectorAll("input[name='artistGND']");

        // init XML parser and create top-level XML elements
        const parser = new DOMParser();
        let orphXML = parser.parseFromString(
            '<?xml version="1.0" encoding="UTF-8"?> \n' +
            '<pdo:orph xmlns:pdo="http://orpheana.de/ns/plainDataOrph"></pdo:orph>', 'text/xml');    
        const orph = orphXML.querySelector("orph");   
        const short = orphXML.createElement("pdo:short");
        const performance = orphXML.createElement("pdo:performance");
        const castList = orphXML.createElement("pdo:castList");
        const articles = orphXML.createElement("pdo:articles");

        // short
        const sOpera = orphXML.createElement("pdo:sOpera");
        sOpera.innerHTML = shortIN.sOpera;
        short.appendChild(sOpera);
        const sComposer = orphXML.createElement("pdo:sComposer");
        sComposer.innerHTML = shortIN.sComposer;
        short.appendChild(sComposer);
        const sPlace = orphXML.createElement("pdo:sPlace"); 
        sPlace.innerHTML = shortIN.sPlace;
        short.appendChild(sPlace);  
        const sYear = orphXML.createElement("pdo:sYear");
        sYear.innerHTML = shortIN.sYear; 
        short.appendChild(sYear);
        const sOrphID = orphXML.createElement("pdo:orphID");
        sOrphID.innerHTML = shortIN.sOrphID;
        short.appendChild(sOrphID);
        const sFimtID = orphXML.createElement("pdo:fimtID");
        sFimtID.innerHTML = shortIN.sFimtID;
        short.appendChild(sFimtID);
        orph.appendChild(short);

        // performance
        const operaEl = orphXML.createElement("pdo:opera");
        const composerEl = orphXML.createElement("pdo:composer");
        const librettoEl = orphXML.createElement("pdo:libretto");
        const productionEl = orphXML.createElement("pdo:production");
        const stageEl = orphXML.createElement("pdo:stage");
        const placeEl = orphXML.createElement("pdo:place");
        const directorEl = orphXML.createElement("pdo:director");
        const conductorEl = orphXML.createElement("pdo:conductor");
        const dramatistEl = orphXML.createElement("pdo:dramatist");
        const orchestraEl = orphXML.createElement("pdo:orchestra");

        const operaTitle = orphXML.createElement("pdo:operaTitle");
        operaTitle.innerHTML = opera; 
        operaEl.appendChild(operaTitle);
        const operaGNDel = orphXML.createElement("pdo:operaGND");
        operaGNDel.innerHTML = operaGND;
        operaEl.appendChild(operaGNDel);
        performance.appendChild(operaEl);

        const composerName = orphXML.createElement("pdo:composerName");
        composerName.innerHTML = composer; 
        composerEl.appendChild(composerName);
        const composerGNDel = orphXML.createElement("pdo:composerGND");
        composerGNDel.innerHTML = composerGND;
        composerEl.appendChild(composerGNDel);
        performance.appendChild(composerEl);

        const librettoName = orphXML.createElement("pdo:librettoName");
        librettoName.innerHTML = libretto;
        librettoEl.appendChild(librettoName);
        const librettoGNDel = orphXML.createElement("pdo:librettoGND");
        librettoGNDel.innerHTML = librettoGND;
        librettoEl.appendChild(librettoGNDel); 
        performance.appendChild(librettoEl);

        const productionName = orphXML.createElement("pdo:productionName");
        productionName.innerHTML = production;
        productionEl.appendChild(productionName);
        const productionGNDel = orphXML.createElement("pdo:productionGND");
        productionGNDel.innerHTML = productionGND;
        productionEl.appendChild(productionGNDel);
        performance.appendChild(productionEl);

        const stageName = orphXML.createElement("pdo:stageName");
        stageName.innerHTML = stage;
        stageEl.appendChild(stageName);
        const stageGNDel = orphXML.createElement("pdo:stageGND");
        stageGNDel.innerHTML = stageGND;
        stageEl.appendChild(stageGNDel);
        performance.appendChild(stageEl);

        const placeName = orphXML.createElement("pdo:placeName");
        placeName.innerHTML = place;
        placeEl.appendChild(placeName);
        const placeGNDel = orphXML.createElement("pdo:placeGND");
        placeGNDel.innerHTML = placeGND;
        placeEl.appendChild(placeGNDel);   

        const directorName = orphXML.createElement("pdo:directorName");
        directorName.innerHTML = director;
        directorEl.appendChild(directorName);
        const directorGNDel = orphXML.createElement("pdo:directorGND"); 
        directorGNDel.innerHTML = directorGND;
        directorEl.appendChild(directorGNDel);
        performance.appendChild(directorEl);

        const conductorName = orphXML.createElement("pdo:conductorName");
        conductorName.innerHTML = conductor;
        conductorEl.appendChild(conductorName);
        const conductorGNDel = orphXML.createElement("pdo:conductorGND");
        conductorGNDel.innerHTML = conductorGND;
        conductorEl.appendChild(conductorGNDel);
        performance.appendChild(conductorEl);

        const dramatistName = orphXML.createElement("pdo:dramatistName");
        dramatistName.innerHTML = dramatist;
        dramatistEl.appendChild(dramatistName);
        const dramatistGNDel = orphXML.createElement("pdo:dramatistGND");
        dramatistGNDel.innerHTML = dramatistGND;
        dramatistEl.appendChild(dramatistGNDel);
        performance.appendChild(dramatistEl);

        const orchestraName = orphXML.createElement("pdo:orchestraName");
        orchestraName.innerHTML = orchestra;
        orchestraEl.appendChild(orchestraName);
        const orchestraGNDel = orphXML.createElement("pdo:orchestraGND");
        orchestraGNDel.innerHTML = orchestraGND;
        orchestraEl.appendChild(orchestraGNDel);
        performance.appendChild(orchestraEl);

        orph.appendChild(performance);

        // cast list
        roles.forEach((role, index) => {
            if (!(roles[index].value === "" && artists[index].value === "" && artistGNDs[index].value === "")) {
                const cast = orphXML.createElement("pdo:cast");
                const roleEl = orphXML.createElement("pdo:role");
                roleEl.innerHTML = roles[index].value;
                cast.appendChild(roleEl);
                const artistEl = orphXML.createElement("pdo:artist");  
                artistEl.innerHTML = artists[index].value;
                cast.appendChild(artistEl);
                const artistGNDel = orphXML.createElement("pdo:artistGND");
                artistGNDel.innerHTML = artistGNDs[index].value;
                cast.appendChild(artistGNDel);
                castList.appendChild(cast);
            }
        });
        orph.appendChild(castList);

        let paraCntr;
        let article;

        // articles
        const arts = document.getElementById("articles");
        const containers = arts.querySelectorAll("div.form-container");
        paraCntr = 0;
        containers.forEach(container => {
            if (!(container.querySelector("input[name='Author']").value === "" && container.querySelector("input[name='GND']").value ==="" && container.querySelector("input[name='Title']").value ==="")) {
                article = orphXML.createElement("pdo:article");
                const author = orphXML.createElement("pdo:author");
                author.innerHTML = container.querySelector("input[name='Author']").value;
                article.appendChild(author);
                const authorGND = orphXML.createElement("pdo:authorGND");
                authorGND.innerHTML = container.querySelector("input[name='GND']").value;
                article.appendChild(authorGND);
                const title = orphXML.createElement("pdo:title");
                title.innerHTML = container.querySelector("input[name='Title']").value;
                article.appendChild(title);
                const subject = orphXML.createElement("pdo:subject");
                subject.innerHTML = container.querySelector("select[name='subject']").value;
                article.appendChild(subject);
                const occasion = orphXML.createElement("pdo:occasion");
                occasion.innerHTML = container.querySelector("select[name='occasion']").value;
                article.appendChild(occasion);
                const text = orphXML.createElement("pdo:text");
                const paragraphs = container.querySelectorAll("textarea");
                paragraphs.forEach((para, index) => {
                    if (!(para.value === "")) {
                        const paragraph = orphXML.createElement("pdo:paragraph");
                        paragraph.innerHTML = para.value;
                        text.appendChild(paragraph);
                        paraCntr += 1;
                    }
                })
                if (paraCntr === 0) {
                    const paraEl = orphXML.createElement("pdo:paragraph")
                    paraEl.value = "";
                    text.appendChild(paraEl);
                }
            article.appendChild(text);  
            }
            articles.appendChild(article);         
        })
        orph.appendChild(articles);
        return orph;
    }
    
    // build update object and url 
    const xmlString = new XMLSerializer().serializeToString(createOrph(short));
    const update = {
        'message': 'update',
        'content': utf8_to_b64(xmlString),
        'sha': gitSHA
    }
    const urlStrUp = `https://api.github.com/repos/nluttenberger/orpheana/contents/${gitPath}`;

    // upload and commit --------------------------------------------------
    fetch (urlStrUp,{
        method: 'PUT',
        body: JSON.stringify(update),
        headers: hdrs
    })
    .then (resp => {
        if (resp.status === 200) {
            alert ('orph abgespeichert!')
            window.location.reload();
        }
    })
    .catch((error) => {
        console.error('Error while saving recipe: ', error);
    })
}