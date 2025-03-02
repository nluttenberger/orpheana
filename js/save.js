function save () {

    // preliminary solution for file name creation
    const sOpera = "Holländer";
    const sComposer = "Wagner";
    const sPlace = "Düsseldorf";
    const sYear = "2000";

    alert (`${sYear}-${sOpera}-${sComposer}-${sPlace}.xml`)

    // save orph to download folder
    const xmlString = new XMLSerializer().serializeToString(xml);
    const blob = new Blob([xmlString], { type: "text/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    alert (`${sYear}-${sOpera}-${sComposer}-${sPlace}.xml`)
    a.download = `${sYear}-${sOpera}-${sComposer}-${sPlace}.xml`;
    a.click();

    // save orph data to GitHub repo
    const repo = "https://api.github.com/repos/nluttenberger/orpheana/contents/";
}