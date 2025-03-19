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
            '<orph:orph xmlns:pdo="http://orpheana.de/ns/plainDataOrph"></orph:orph>', 'text/xml');    
        const orph = orphXML.querySelector("orph");   
        const short = orphXML.createElement("orph:short");
        const performance = orphXML.createElement("orph:performance");
        const castList = orphXML.createElement("orph:castList");
        const articles = orphXML.createElement("orph:articles");

        // short
        const sOpera = orphXML.createElement("orph:sOpera");
        sOpera.innerHTML = shortIN.sOpera;
        short.appendChild(sOpera);
        const sComposer = orphXML.createElement("orph:sComposer");
        sComposer.innerHTML = shortIN.sComposer;
        short.appendChild(sComposer);
        const sPlace = orphXML.createElement("orph:sPlace"); 
        sPlace.innerHTML = shortIN.sPlace;
        short.appendChild(sPlace);  
        const sYear = orphXML.createElement("orph:sYear");
        sYear.innerHTML = shortIN.sYear; 
        short.appendChild(sYear);
        const sOrphID = orphXML.createElement("orph:orphID");
        sOrphID.innerHTML = shortIN.sOrphID;
        short.appendChild(sOrphID);
        const sFimtID = orphXML.createElement("orph:fimtID");
        sFimtID.innerHTML = shortIN.sFimtID;
        short.appendChild(sFimtID);
        orph.appendChild(short);

        // performance
        const operaEl = orphXML.createElement("orph:opera");
        const composerEl = orphXML.createElement("orph:composer");
        const librettoEl = orphXML.createElement("orph:libretto");
        const firstPerformanceEl = orphXML.createElement("orph:firstPerformance");
        const productionEl = orphXML.createElement("orph:production");
        const stageEl = orphXML.createElement("orph:stage");
        const placeEl = orphXML.createElement("orph:place");
        const premiereEl = orphXML.createElement("orph:premiere");
        const directorEl = orphXML.createElement("orph:director");
        const conductorEl = orphXML.createElement("orph:conductor");
        const dramatistEl = orphXML.createElement("orph:dramatist");
        const orchestraEl = orphXML.createElement("orph:orchestra");

        const operaTitle = orphXML.createElement("orph:operaTitle");
        operaTitle.innerHTML = opera; 
        operaEl.appendChild(operaTitle);
        const operaGNDel = orphXML.createElement("orph:operaGND");
        operaGNDel.innerHTML = operaGND;
        operaEl.appendChild(operaGNDel);
        performance.appendChild(operaEl);

        const composerName = orphXML.createElement("orph:composerName");
        composerName.innerHTML = composer; 
        composerEl.appendChild(composerName);
        const composerGNDel = orphXML.createElement("orph:composerGND");
        composerGNDel.innerHTML = composerGND;
        composerEl.appendChild(composerGNDel);
        performance.appendChild(composerEl);

        const librettoName = orphXML.createElement("orph:librettoName");
        librettoName.innerHTML = libretto;
        librettoEl.appendChild(librettoName);
        const librettoGNDel = orphXML.createElement("orph:librettoGND");
        librettoGNDel.innerHTML = librettoGND;
        librettoEl.appendChild(librettoGNDel); 
        performance.appendChild(librettoEl);

        firstPerformanceEl.innerHTML = firstPerformance;
        performance.appendChild(firstPerformanceEl);

        const productionName = orphXML.createElement("orph:productionName");
        productionName.innerHTML = production;
        productionEl.appendChild(productionName);
        const productionGNDel = orphXML.createElement("orph:productionGND");
        productionGNDel.innerHTML = productionGND;
        productionEl.appendChild(productionGNDel);
        performance.appendChild(productionEl);

        const stageName = orphXML.createElement("orph:stageName");
        stageName.innerHTML = stage;
        stageEl.appendChild(stageName);
        const stageGNDel = orphXML.createElement("orph:stageGND");
        stageGNDel.innerHTML = stageGND;
        stageEl.appendChild(stageGNDel);
        performance.appendChild(stageEl);

        const placeName = orphXML.createElement("orph:placeName");
        placeName.innerHTML = place;
        placeEl.appendChild(placeName);
        const placeGNDel = orphXML.createElement("orph:placeGND");
        placeGNDel.innerHTML = placeGND;
        placeEl.appendChild(placeGNDel); 
        performance.appendChild(placeEl);

        premiereEl.innerHTML = premiere;
        performance.appendChild(premiereEl);

        const directorName = orphXML.createElement("orph:directorName");
        directorName.innerHTML = director;
        directorEl.appendChild(directorName);
        const directorGNDel = orphXML.createElement("orph:directorGND"); 
        directorGNDel.innerHTML = directorGND;
        directorEl.appendChild(directorGNDel);
        performance.appendChild(directorEl);

        const conductorName = orphXML.createElement("orph:conductorName");
        conductorName.innerHTML = conductor;
        conductorEl.appendChild(conductorName);
        const conductorGNDel = orphXML.createElement("orph:conductorGND");
        conductorGNDel.innerHTML = conductorGND;
        conductorEl.appendChild(conductorGNDel);
        performance.appendChild(conductorEl);

        const dramatistName = orphXML.createElement("orph:dramatistName");
        dramatistName.innerHTML = dramatist;
        dramatistEl.appendChild(dramatistName);
        const dramatistGNDel = orphXML.createElement("orph:dramatistGND");
        dramatistGNDel.innerHTML = dramatistGND;
        dramatistEl.appendChild(dramatistGNDel);
        performance.appendChild(dramatistEl);

        const orchestraName = orphXML.createElement("orph:orchestraName");
        orchestraName.innerHTML = orchestra;
        orchestraEl.appendChild(orchestraName);
        const orchestraGNDel = orphXML.createElement("orph:orchestraGND");
        orchestraGNDel.innerHTML = orchestraGND;
        orchestraEl.appendChild(orchestraGNDel);
        performance.appendChild(orchestraEl);

        orph.appendChild(performance);

        // cast list
        roles.forEach((role, index) => {
            if (!(roles[index].value === "" && artists[index].value === "" && artistGNDs[index].value === "")) {
                const cast = orphXML.createElement("orph:cast");
                const roleEl = orphXML.createElement("orph:role");
                roleEl.innerHTML = roles[index].value;
                cast.appendChild(roleEl);
                const artistEl = orphXML.createElement("orph:artist");  
                artistEl.innerHTML = artists[index].value;
                cast.appendChild(artistEl);
                const artistGNDel = orphXML.createElement("orph:artistGND");
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
                article = orphXML.createElement("orph:article");
                const author = orphXML.createElement("orph:author");
                author.innerHTML = container.querySelector("input[name='Author']").value;
                article.appendChild(author);
                const authorGND = orphXML.createElement("orph:authorGND");
                authorGND.innerHTML = container.querySelector("input[name='GND']").value;
                article.appendChild(authorGND);
                const title = orphXML.createElement("orph:title");
                title.innerHTML = container.querySelector("input[name='Title']").value;
                article.appendChild(title);
                const subject = orphXML.createElement("orph:subject");
                subject.innerHTML = container.querySelector("select[name='subject']").value;
                article.appendChild(subject);
                const occasion = orphXML.createElement("orph:occasion");
                occasion.innerHTML = container.querySelector("select[name='occasion']").value;
                article.appendChild(occasion);
                const text = orphXML.createElement("orph:text");
                const paragraphs = container.querySelectorAll("textarea");
                paragraphs.forEach((para, index) => {
                    if (!(para.value === "")) {
                        const paragraph = orphXML.createElement("orph:paragraph");
                        paragraph.innerHTML = para.value;
                        text.appendChild(paragraph);
                        paraCntr += 1;
                    }
                })
                if (paraCntr === 0) {
                    const paraEl = orphXML.createElement("orph:paragraph")
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
    console.log (xmlString);
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
        console.error('Error while saving orph: ', error);
    })
}