function save (short,gitName,gitPath,gitSHA) {

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
            '<orph></orph>', 'text/xml');    
        const orph = orphXML.querySelector("orph");   
        const short = orph.createElement("short");
        const performance = orph.createElement("performance");
        const castList = orph.createElement("castList");
        const stagingRelated = orph.createElement("stagingRelated");
        const storyRelated = orph.createElement("storyRelated");
        const musicRelated = orph.createElement("musicRelated");
        const historic = orph.createElement("historic");

        // short
        short.innerHTML = `
            <opera>${shortIN.sOpera}</opera>
            <composer>${shortIN.sComposer}</composer>
            <place>${shortIN.sPlace}</place>
            <year>${shortIN.sYear}</year>
            <orphID>${shortIN.sOrphID}</orphID>
            <fimtID>${shortIN.sFimtID}</fimtID>`;
        orph.appendChild(short);

        // performance
        performance.innerHTML = `
            <opera>
                <operaTitle>${opera}</operaTitle>
                <operaGND>${operaGND}</operaGND>
            </opera>
            <composer>
                <composerName>${composer}</composerName>
                <composerGND>${composerGND}</composerGND>
            </composer>
            <libretto>
                <librettoName>${libretto}</librettoName>
                <librettoGND>${librettoGND}</librettoGND>
            </libretto>
            <firstPerformance>${firstPerformance}</firstPerformance>
            <production>
                <productionName>${production}</productionName>
                <productionGND>${productionGND}</productionGND>
            </production>
            <stage>
                <stageName>${stage}</stageName>
                <stageGND>${stageGND}</stageGND>
            </stage>
            <place>
                <placeName>${place}</placeName>
                <placeGND>${placeGND}</placeGND>
            </place>
            <premiere>${premiere}</premiere>
            <director>
                <directorName>${director}</directorName>
                <directorGND>${directorGND}</directorGND>
            </director>
            <conductor>
                <conductorName>${conductor}</conductorName>
                <conductorGND>${conductorGND}</conductorGND>
            </conductor>
            <dramatist>
                <dramatistName>${dramatist}</dramatistName>
                <dramatistGND>${dramatistGND}</dramatistGND>
            </dramatist>
            <orchestra>
                <orchestraName>${orchestra}</orchestraName>
                <orchestraGND>${orchestraGND}</orchestraGND>    
            </orchestra>`;
        orph.appendChild(performance);

        // cast list
        roles.forEach((role, index) => {
            if (!(roles[index].value === "" && artists[index].value === "" && artistGNDs[index].value === "")) {
                const cast = orph.createElement("cast");
                cast.innerHTML = `
                    <role>${roles[index].value}</role>
                    <artist>${artists[index].value}</artist>
                    <artistGND>${artistGNDs[index].value}</artistGND>`;
                castList.appendChild(cast);
            }
        });
        orph.appendChild(castList);

        let paraCntr;
        let textElement;

        // staging-related texts
        const stagingTexts = document.querySelectorAll("#stagingRelated .form-container");
        paraCntr = 0;
        stagingTexts.forEach(text => {
            if (!(text.querySelector("input[name='Author']").value === "" && text.querySelector("input[name='GND']").value ==="" && text.querySelector("input[name='Title']").value ==="")) {
                textElement = orph.createElement("text");
                textElement.innerHTML = `
                    <author>${text.querySelector("input[name='Author']").value}</author>
                    <authorGND>${text.querySelector("input[name='GND']").value}</authorGND>
                    <title>${text.querySelector("input[name='Title']").value}</title>`;
                const paragraphs = text.querySelectorAll("textarea");
                paragraphs.forEach((para, index) => {
                    if (!(para.value === "")) {
                        const paragraph = orph.createElement("paragraph");
                        paragraph.innerHTML = para.value;
                        textElement.appendChild(paragraph);
                        paraCntr += 1;
                    }
                if (paraCntr === 0) {
                    const paraEl = orph.createElement("paragraph")
                    paraEl.value = "";
                    textElement.appendChild(paraEl);
                }
                stagingRelated.appendChild(textElement);
                })
            }
        })
        orph.appendChild(stagingRelated);

        // story-related texts
        const storyTexts = document.querySelectorAll("#storyRelated .form-container");
        paraCntr = 0;
        storyTexts.forEach(text => {
            if (!(text.querySelector("input[name='Author']").value === "" && text.querySelector("input[name='GND']").value ==="" && text.querySelector("input[name='Title']").value ==="")) {
                textElement = orph.createElement("text");
                textElement.innerHTML = `
                    <author>${text.querySelector("input[name='Author']").value}</author>
                    <authorGND>${text.querySelector("input[name='GND']").value}</authorGND>
                    <title>${text.querySelector("input[name='Title']").value}</title>`;
                const paragraphs = text.querySelectorAll("textarea");
                paragraphs.forEach((para, index) => {
                    if (!(para.value === "")) {
                        const paragraph = orph.createElement("paragraph");
                        paragraph.innerHTML = para.value;
                        textElement.appendChild(paragraph);
                        paraCntr += 1;
                    }
                if (paraCntr === 0) {
                    const paraEl = orph.createElement("paragraph")
                    paraEl.value = "";
                    textElement.appendChild(paraEl);
                }
                storyRelated.appendChild(textElement);
                })
            }
        })
        orph.appendChild(storyRelated);

        // music-related texts
        const musicTexts = document.querySelectorAll("#musicRelated .form-container");
        paraCntr = 0;
        musicTexts.forEach(text => {
            if (!(text.querySelector("input[name='Author']").value === "" && text.querySelector("input[name='GND']").value ==="" && text.querySelector("input[name='Title']").value ==="")) {
                textElement = orph.createElement("text");
                textElement.innerHTML = `
                    <author>${text.querySelector("input[name='Author']").value}</author>
                    <authorGND>${text.querySelector("input[name='GND']").value}</authorGND>
                    <title>${text.querySelector("input[name='Title']").value}</title>`;
                const paragraphs = text.querySelectorAll("textarea");
                paragraphs.forEach((para, index) => {
                    if (!(para.value === "")) {
                        const paragraph = orph.createElement("paragraph");
                        paragraph.innerHTML = para.value;
                        textElement.appendChild(paragraph);
                        paraCntr += 1;
                    }
                if (paraCntr === 0) {
                    const paraEl = orph.createElement("paragraph")
                    paraEl.value = "";
                    textElement.appendChild(paraEl);
                }
                musicRelated.appendChild(textElement);
                })
            }
        })
        orph.appendChild(musicRelated);

        // historic texts
        const historicTexts = document.querySelectorAll("#historic .form-container");
        paraCntr = 0;
        historicTexts.forEach(text => {
            if (!(text.querySelector("input[name='Author']").value === "" && text.querySelector("input[name='GND']").value ==="" && text.querySelector("input[name='Title']").value ==="")) {
                textElement = orph.createElement("text");
                textElement.innerHTML = `
                    <author>${text.querySelector("input[name='Author']").value}</author>
                    <authorGND>${text.querySelector("input[name='GND']").value}</authorGND>
                    <title>${text.querySelector("input[name='Title']").value}</title>`;
                const paragraphs = text.querySelectorAll("textarea");
                paragraphs.forEach((para, index) => {
                    if (!(para.value === "")) {
                        const paragraph = orph.createElement("paragraph");
                        paragraph.innerHTML = para.value;
                        textElement.appendChild(paragraph);
                        paraCntr += 1;
                    }
                if (paraCntr === 0) {
                    const paraEl = orph.createElement("paragraph")
                    paraEl.value = "";
                    textElement.appendChild(paraEl);
                }
                historic.appendChild(textElement);
                })
            }
        })
        orph.appendChild(historic);
        return orph;
    }

    // preliminary solution for file name creation
    const sOpera = "Holländer";
    const sComposer = "Wagner";
    const sPlace = "Düsseldorf";
    const sYear = "2000";

    console.log (gitName, gitPath, gitSHA);
    alert (`${sYear}-${sOpera}-${sComposer}-${sPlace}.xml`)
    
    // save orph to download folder
    const xmlString = new XMLSerializer().serializeToString(createOrph(short));
    const blob = new Blob([xmlString], {type: "text/xml"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sYear}-${sOpera}-${sComposer}-${sPlace}.xml`;
    a.click();
    
}