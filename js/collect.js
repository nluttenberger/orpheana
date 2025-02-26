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
        const operas = [ 
            ["1984", "Lorin Maazel", "2005", "J. D. McClatchy, Thomas Meehan"],
            ["Abu Hassan", "Carl Maria von Weber", "1811", "Franz Carl Hiemer"],
            ["Acis et Galatée", "Jean-Baptiste Lully", "1686", "Jean-Galbert de Campistron"],
            ["Acis und Galatea", "Georg Friedrich Händel", "1718", "John Gay, Alexander Pope, John Hughes"],
            ["Adelina", "Pietro Generali", "1810", "Gaetano Rossi"],
            ["Adrast", "Franz Schubert", "2010", "Johann Mayrhofer"],
            ["Adriana Lecouvreur", "Francesco Cilea", "1902", "Arturo Colautti"],
            ["Agrippina", "Georg Friedrich Händel", "1709", "Vincenzo Grimani"],
            ["Aida", "Giuseppe Verdi", "1871", "Antonio Ghislanzoni"],
            ["Akhmatowa", "Bruno Mantovani", "2011", "Christophe Ghristi"],
            ["Albert Herring", "Benjamin Britten", "1947", "Eric Crozier"],
            ["Alceste ou Le triomphe d\u2019Alcide", "Jean-Baptiste Lully", "1674", "Philippe Quinault"],
            ["Alcina", "Georg Friedrich Händel", "1735", ""],
            ["Aleko", "Sergei Rachmaninow", "1893", "Wladimir Nemirowitsch-Dantschenko"],
            ["Alessandro Stradella", "Friedrich von Flotow", "1844", "Friedrich Wilhelm Riese"],
            ["Alfonso und Estrella", "Franz Schubert", "1854", "Franz von Schober"],
            ["Ali Pascha von Janina", "Albert Lortzing", "1828", "Albert Lortzing"],
            ["Alkestis", "Christoph Willibald Gluck", "1767", "Ranieri de\u2019 Calzabigi"],
            ["Almira, Königin von Castilien", "Georg Friedrich Händel", "1705", "Friedrich Christian Feustking"],
            ["Alzira", "Giuseppe Verdi", "1845", "Salvatore Cammarano"],
            ["Amadis", "Jean-Baptiste Lully", "1684", "Philippe Quinault"],
            ["Amahl und die nächtlichen Besucher", "Gian Carlo Menotti", "1951", "Gian Carlo Menotti"],
            ["Amelia geht zum Ball", "Gian Carlo Menotti", "1937", "Gian Carlo Menotti"],
            ["Amica", "Pietro Mascagni", "1905", "Paul de Choudens"],
            ["André Chenier", "Umberto Giordano", "1896", "Luigi Illica"],
            ["Anna Boleyn", "Gaetano Donizetti", "1830", "Felice Romani"],
            ["Antichrist (Allegorische Oper)", "Rued Langgaard", "", ""],
            ["Antigonae", "Carl Orff", "1949", "Friedrich Hölderlin"],
            ["AquAria_PALAOA", "Susanne Stelzenbach", "2011", "Monika Rinck"],
            ["Arabella", "Richard Strauss", "1933", "Hugo von Hofmannsthal"],
            ["Ärger in Tahiti", "Leonard Bernstein", "1952", "Leonard Bernstein"],
            ["Ariadne auf Naxos", "Richard Strauss", "1916", "Hugo von Hofmannsthal"],
            ["Arianna", "Claudio Monteverdi", "1608", "Ottavio Rinuccini"],
            ["Armida", "Christoph Willibald Gluck", "1777", "Philippe Quinault"],
            ["Armida", "Gioachino Rossini", "1817", "Giovanni Schmidt"],
            ["Armida", "Antonio Salieri", "1771", "Marco Coltellini"],
            ["Armide", "Jean-Baptiste Lully", "1686", "Philippe Quinault"],
            ["Aroldo", "Giuseppe Verdi", "1857", "Francesco Maria Piave"],
            ["Artaxerxes", "Johann Adolph Hasse", "1730", "Pietro Metastasio"],
            ["Artemisia", "Francesco Cavalli", "1657", "Nicolò Minato"],
            ["Artemisia", "Johann Adolph Hasse", "1754", "Giovanni Ambrogio Migliavacca"],
            ["Ascanio in Alba", "Wolfgang Amadeus Mozart", "1771", ""],
            ["Aschenbrödel", "Gioachino Rossini", "1817", "Jacopo Ferretti"],
            ["Astutuli", "Carl Orff", "1953", "Carl Orff"],
            ["Attila", "Giuseppe Verdi", "1846", "Temistocle Solera, Francesco Maria Piave"],
            ["Atys", "Jean-Baptiste Lully", "1676", "Philippe Quinault"],
            ["Aufstieg und Fall der Stadt Mahagonny", "Kurt Weill", "1930", "Bertolt Brecht"],
            ["Aus einem Totenhaus", "Leoš Janáček", "1930", "Leoš Janáček"],
            ["Axur, König von Hormus", "Antonio Salieri", "1788", "Lorenzo da Ponte"],
            ["Baal", "Friedrich Cerha", "1981", "nach Bertolt Brecht"],
            ["Bastien und Bastienne", "Wolfgang Amadeus Mozart", "1768", "Friedrich Wilhelm Weiskern, Johann H.F. Müller, Johann Andreas Schachtner"],
            ["Béatrice und Bénédict", "Hector Berlioz", "1862", "Hector Berlioz"],
            ["Bellérophon", "Jean-Baptiste Lully", "1679", "Thomas Corneille"],
            ["Benvenuto Cellini", "Hector Berlioz", "1838", "Léon de Wailly, Henri-Auguste Barbier"],
            ["Bernarda Albas Haus", "Aribert Reimann", "2000", ""],
            ["Billy Budd", "Benjamin Britten", "1951", "Edward Morgan Forster, Eric Crozier"],
            ["Bluthochzeit", "Wolfgang Fortner", "1957", "Enrique Beck"],
            ["Boccaccio", "Franz von Suppè", "1879", "Friedrich Zell und Richard Genée"],
            ["Boris Godunow", "Modest Mussorgski", "1874", "Modest Mussorgski"],
            ["Bremer Freiheit", "Adriana Hölszky", "1988", "Thomas Körner"],
            ["Brundibár", "Hans Krása", "1941", "Adolf Hoffmeister"],
            ["Bunbury", "Paul Burkhard", "1965", "Hans Weigel"],
            ["Cadmus et Hermione", "Jean-Baptiste Lully", "1673", "Philippe Quinault"],
            ["Candide", "Reiner Bredemeyer", "1986", "Gerhard Müller"],
            ["Capriccio", "Richard Strauss", "1942", "Clemens Krauss"],
            ["Cardillac", "Paul Hindemith", "1926", "Ferdinand Lion"],
            ["Carmen", "Georges Bizet", "1875", "Henri Meilhac, Ludovic Halévy"],
            ["Cäsar auf Pharmacusa", "Antonio Salieri", "1800", "Carlo Prospero De Franceschi"],
            ["Cavalleria rusticana", "Pietro Mascagni", "1890", "Verga von Giovanni Targioni-Tozzetti, Guido Mencasi"],
            ["Charlotte Corday", "Lorenzo Ferrero", "1989", "Giuseppe Di Leva"],
            ["Chowanschtschina", "Modest Mussorgski", "1886", "Modest Mussorgski"],
            ["Clari", "Fromental Halévy", "1828", "Pietro Giannone"],
            ["Così fan tutte", "Wolfgang Amadeus Mozart", "1790", "Lorenzo da Ponte"],
            ["Dalibor", "Bedřich Smetana", "1868", "Josef Wenzig, Ervín Špindler"],
            ["Dantons Tod", "Gottfried von Einem", "1947", "Boris Blacher, Gottfried von Einem"],
            ["Daphne", "Richard Strauss", "1938", "Joseph Gregor"],
            ["Dardanus", "Jean-Philippe Rameau", "1739", "Griechische Dardanos-Sage"],
            ["Das Christ-Elflein", "Hans Pfitzner", "1917", "Hans Pfitzner"],
            ["Das Geheimnis", "Bedřich Smetana", "1878", "Eliška Krásnohorská"],
            ["Das Gesicht im Spiegel", "Jörg Widmann", "", "Roland Schimmelpfennig"],
            ["Das Gespensterschloss", "Stanisław Moniuszko", "1863", "Jan Chęciński"],
            ["Das Glöckchen", "Gaetano Donizetti", "1836", "Gaetano Donizetti"],
            ["Das höllisch Gold", "Julius Bittner", "1916", "Julius Bittner"],
            ["Das Kind und die Zauberdinge", "Maurice Ravel", "1925", "Sidonie-Gabrielle Colette"],
            ["Das Krokodil", "Jury Everhartz", "2004", ""],
            ["Das kurze Leben", "Manuel de Falla", "1913", "Carlos Fernández-Shaw"],
            ["Das Labyrinth oder Der Kampf mit den Elementen", "Peter von Winter", "1798", "Emanuel Schikaneder"],
            ["Das Leben des Andrea", "Reiner Bredemeyer", "1972", ""],
            ["Das Liebesverbot", "Richard Wagner", "1836", "Richard Wagner"],
            ["Das Mädchen aus dem Goldenen Westen", "Giacomo Puccini", "1910", "Guelfo Civinnini, Carlo Zanganrini"],
            ["Das Mädchen mit den Schwefelhölzern", "Helmut Lachenmann", "1997", "Leonardo da Vinci, Gudrun Ensslin, Ernst Toller, Friedrich Nietzsche"],
            ["Das Medium", "Gian Carlo Menotti", "1946", "Gian Carlo Menotti"],
            ["Das Nachtlager in Granada", "Conradin Kreutzer", "1834", "Karl Johann Braun von Braunthal"],
            ["Das Rheingold", "Richard Wagner", "1869", "Richard Wagner"],
            ["Das schlaue Füchslein", "Leoš Janáček", "1924", "Leoš Janáček"],
            ["Das Schloss", "Aribert Reimann", "1992", ""],
            ["Das Spiel vom König Aphelius", "Heinrich Kaminskiq", "1950", ""],
            ["Das Telefon oder Die Liebe zu dritt", "Gian Carlo Menotti", "1947", "Gian Carlo Menotti"],
            ["Das unterbrochene Opferfest", "Peter von Winter", "1796", "Franz Xaver Huber"],
            ["Das Wundertheater", "Hans Werner Henze", "1949", "Adolf Graf von Schack"],
            ["Der Apotheker", "Joseph Haydn", "1768", "Carlo Goldoni"],
            ["Der arme Heinrich", "Hans Pfitzner", "1895", "James Grun"],
            ["Der arme Matrose", "Darius Milhaud", "1927", "Jean Cocteau"],
            ["Der automatische Teufel", "Jury Everhartz", "2000", "Dora Lux"],
            ["Der Bajazzo", "Ruggero Leoncavallo", "1892", "Ruggero Leoncavallo"],
            ["Der Barbier von Bagdad", "Peter Cornelius", "1858", "Peter Cornelius"],
            ["Der Barbier von Sevilla", "Giovanni Paisiello", "1782", "Giuseppe Petrosellini"],
            ["Der Barbier von Sevilla", "Gioachino Rossini", "1816", "Cesare Sterbini"],
            ["Der Baron von Rocca Antica", "Antonio Salieri", "1772", "Giuseppe Petrosellini"],
            ["Der Besuch der alten Dame", "Gottfried von Einem", "1971", "Friedrich Dürrenmatt"],
            ["Der betrogene Ehemann", "Wolfgang Amadeus Mozart", "", ""],
            ["Der Corregidor", "Hugo Wolf", "1896", "Rosa Mayreder"],
            ["Der Dorfwahrsager", "Jean-Jacques Rousseau", "1752", "Jean-Jacques Rousseau"],
            ["Der ferne Klang", "Franz Schreker", "1912", "Franz Schreker"],
            ["Der fliegende Holländer", "Richard Wagner", "1843", "Richard Wagner"],
            ["Der Freischütz", "Carl Maria von Weber", "1821", "Johann Friedrich Kind"],
            ["Der Gefangene", "Luigi Dallapiccola", "1949", "Luigi Dallapiccola"],
            ["Der geizige Ritter", "Sergei Rachmaninow", "1906", "Alexander Puschkin"],
            ["Der gewaltige Hahnrei", "Berthold Goldschmidt", "1932", "Berthold Goldschmidt"],
            ["Der Goggolori", "Wilfried Hiller", "1985", "Michael Ende"],
            ["Der goldene Hahn", "Nikolai Rimski-Korsakow", "1909", "Wladimir Belski"],
            ["Der Igel als Bräutigam", "Cesar Bresgen", "1951", "Ludwig Andersen"],
            ["Der Improvisator", "Eugen d\u2019Albert", "1902", "Gustav Kastropp"],
            ["Der Jakobiner", "Antonín Dvořák", "1889", "Marie Cevinková-Riegrová"],
            ["Der Jasager", "Kurt Weill", "1930", "Bertolt Brecht"],
            ["Der junge Lord", "Hans Werner Henze", "1965", "Ingeborg Bachmann"],
            ["Der Kalif von Bagdad", "François-Adrien Boieldieu", "1800", "Claude Godard d\u2019Aucourt de Saint-Just"],
            ["Der kleine Marat", "Pietro Mascagni", "1921", "Giovacchino Forzano, Giovanni Targioni-Tozzetti"],
            ["Der kleine Prinz", "Rachel Portman", "2003", "Nicholas Wright"],
            ["Der Kleine Prinz", "Nikolaus Schapfl", "2003", "Nikolaus Schapfl"],
            ["Der Kommissar", "Jury Everhartz", "2002", "Kristine Tornquist"],
            ["Der König als Hirte", "Wolfgang Amadeus Mozart", "1775", ""],
            ["Der König Kandaules", "Alexander von Zemlinsky", "1996", "Alexander Zemlinsky"],
            ["Der Konsul", "Gian Carlo Menotti", "1950", "Gian Carlo Menotti"],
            ["Der Korsar", "Giuseppe Verdi", "1848", "Francesco Maria Piave"],
            ["Der Kreidekreis", "Alexander von Zemlinsky", "1933", "Alexander Zemlinsky"],
            ["Der Kuss", "Bedřich Smetana", "1876", "Eliška Krásnohorská"],
            ["Der letzte Wilde", "Gian Carlo Menotti", "1963", "Gian Carlo Menotti"],
            ["Der Liebestrank", "Gaetano Donizetti", "1832", "Felice Romani"],
            ["Der Liebhaber als Arzt", "Ermanno Wolf-Ferrari", "1913", "Enrico Golisciano"],
            ["Der Magnet der Herzen", "Antonio Salieri", "1774", ""],
            ["Der Mantel", "Giacomo Puccini", "1918", "Giuseppe Adami"],
            ["Der Mond", "Carl Orff", "1939", "Carl Orff"],
            ["Der Nachtflug", "Luigi Dallapiccola", "1940", "Luigi Dallapiccola"],
            ["Der Neinsager", "Reiner Bredemeyer", "1994", ""],
            ["Der Postillon von Lonjumeau", "Adolphe Adam", "1836", "Léon-Lévy Brunswick, Adolphe de Leuven"],
            ["Der Prinz von Homburg", "Hans Werner Henze", "1960", "Ingeborg Bachmann"],
            ["Der Prophet", "Giacomo Meyerbeer", "1849", "Eugène Scribe, Émile Deschamps"],
            ["Der Protagonist", "Kurt Weill", "1926", "Georg Kaiser"],
            ["Der Prozess", "Gottfried von Einem", "1953", "Boris Blacher, Heinz von Cramer"],
            ["Der Rattenfänger von Hameln", "Alfred Huth", "", "Ella Huth"],
            ["Der Rauchfangkehrer oder Die unentbehrlichen Verräter ihrer Herrschaften aus Eigennutz", "Antonio Salieri", "1781", "Leopold Auenbrugger"],
            ["Der Reiche für einen Tag", "Antonio Salieri", "1784", "Lorenzo da Ponte"],
            ["Der Restaurantkritiker isst kein Fleisch", "Jörg Riedlbauer", "2000", "Wolfgang Altendorf"],
            ["Der Revisor", "Werner Egk", "1957", "Werner Egk"],
            ["Der Ring des Nibelungen", "Richard Wagner", "1876", "Richard Wagner"],
            ["Der Rosenkavalier", "Richard Strauss", "1911", "Hugo von Hofmannsthal"],
            ["Der Rubin", "Eugen d\u2019Albert", "1893", "Eugen d\u2019Albert"],
            ["Der Schatzgräber", "Franz Schreker", "1920", "Franz Schreker"],
            ["Der Schauspieldirektor", "Wolfgang Amadeus Mozart", "1786", "Johann Gottlieb Stephanie d.J."],
            ["Der Stier von Olivera", "Eugen d\u2019Albert", "1918", "Richard Batka"],
            ["Der Sturm", "Frank Martin", "1956", ""],
            ["Der Tartuffe", "Hans-Joachim Marx", "1998", "Horst Reichel"],
            ["Der Tartuffe", "Hans-Joachim Marx", "2001", "Stephan Steinmetz"],
            ["Der Tempelritter", "Otto Nicolai", "", "Girolamo Maria Marini"],
            ["Der Traum des Scipio", "Wolfgang Amadeus Mozart", "", ""],
            ["Der Traumgörge", "Alexander von Zemlinsky", "1980", "Leo Feld"],
            ["Der Troubadour", "Giuseppe Verdi", "1853", "Salvatore Cammarano"],
            ["Der Türke in Italien", "Gioachino Rossini", "1814", "Felice Romani"],
            ["Der Vampyr", "Heinrich Marschner", "1828", "Wilhelm August Wohlbrück"],
            ["Der vierjährige Posten", "Franz Schubert", "1896", "Theodor Körner"],
            ["Der Waffenschmied", "Albert Lortzing", "1846", "Albert Lortzing"],
            ["Der Widerspenstigen Zähmung", "Hermann Goetz", "1874", "Joseph Viktor Widmann"],
            ["Der Wildschütz", "Albert Lortzing", "1842", "Albert Lortzing"],
            ["Der Wüstling oder Der Werdegang eines Wüstlings", "Igor Strawinsky", "1951", "W. H. Auden und Chester Kallman"],
            ["Der Zar lässt sich photographieren", "Kurt Weill", "1928", "Georg Kaiser"],
            ["Der Zwerg", "Alexander von Zemlinsky", "1922", "Georg C. Klaren"],
            ["Des Simplicius Simplicissimus Jugend", "Karl Amadeus Hartmann", "1948", "Hermann Scherchen, Karl Amadeus Hartmann"],
            ["Des Teufels Lustschloß", "Franz Schubert", "1978", "August von Kotzebue"],
            ["Die Abreise", "Eugen d\u2019Albert", "1898", "Ferdinand von Sporck"],
            ["Die Afrikanerin", "Giacomo Meyerbeer", "1865", "Eugène Scribe"],
            ["Die ägyptische Helena", "Richard Strauss", "1928", "Hugo von Hofmannsthal"],
            ["Die alte Jungfer und der Dieb", "Gian Carlo Menotti", "1939", "Gian Carlo Menotti"],
            ["Die Ameisen", "Peter Ronnefeld", "1961", "Richard Bletschacher"],
            ["Die Ameisen (2. Fassung)", "Peter Ronnefeld", "1965", "Richard Bletschacher"],
            ["Die andere Seite", "Bruno Mantovani", "2006", "François Regnault"],
            ["Die Baskische Venus", "Hermann Hans Wetzler", "1928", "Lini Wetzler"],
            ["Die Bassariden", "Hans Werner Henze", "1966", "Wystan Hugh Auden, Chester Kallman"],
            ["Die beiden Foscari", "Giuseppe Verdi", "1844", "Francesco Maria Piave"],
            ["Die beiden Schützen", "Albert Lortzing", "1837", "Albert Lortzing"],
            ["Die Bernauerin", "Carl Orff", "1947", "Carl Orff"],
            ["Die Brandenburger in Böhmen", "Bedřich Smetana", "1866", "Karel Sabina"],
            ["Die Bürgschaft", "Kurt Weill", "1932", "Caspar Neher"],
            ["Die chinesische Nachtigall", "Esther Hilsberg", "2009", "Holger Pototzki"],
            ["Die Dame vom See", "Gioachino Rossini", "1819", "Andrea Leone Tottola"],
            ["Die diebische Elster", "Gioachino Rossini", "1817", "Giovanni Gherardini"],
            ["Die Drehung der Schraube oder Die sündigen Engel", "Benjamin Britten", "1954", "Myfanwy Piper"],
            ["Die drei Pintos", "Carl Maria von Weber, Gustav Mahler", "1888", "Carl Maria von Weber, Theodor Hell"],
            ["Die Dreigroschenoper", "Kurt Weill", "1928", "Bertolt Brecht"],
            ["Die Entführung aus dem Serail", "Wolfgang Amadeus Mozart", "1782", "Johann Gottlieb Stephanie d. J."],
            ["Die ersten Menschen", "Rudi Stephan", "1920", "Otto Borngräber"],
            ["Die Feen", "Richard Wagner", "1888", "Richard Wagner"],
            ["Die Flut", "Boris Blacher", "1947", "Heinz von Cramer"],
            ["Die Frau ohne Schatten", "Richard Strauss", "1919", "Hugo von Hofmannsthal"],
            ["Die Galoschenoper", "Reiner Bredemeyer", "1978", "Heinz Kahlau"],
            ["Die Gans von Kairo", "Wolfgang Amadeus Mozart", "", ""],
            ["Die Gärtnerin aus Liebe", "Wolfgang Amadeus Mozart", "1775", "Giuseppe Petrosellini"],
            ["Die Geierwally", "Alfredo Catalani", "1892", "Luigi Illica"],
            ["Die Harmonie der Welt", "Paul Hindemith", "1957", "Paul Hindemith"],
            ["Die Heimkehr aus der Fremde", "Felix Mendelssohn Bartholdy", "1829", "Karl Klingemann"],
            ["Die heimliche Ehe", "Domenico Cimarosa", "1792", "Giovanni Bertati"],
            ["Die Hochzeit des Figaro oder Figaros Hochzeit", "Wolfgang Amadeus Mozart", "1786", "Lorenzo da Ponte"],
            ["Die Hochzeit des Jobs", "Joseph Haas", "1940", "Ludwig Strecker der Jüngere"],
            ["Die Höhle des Trofonio", "Antonio Salieri", "1785", "Giovanni Battista Casti"],
            ["Die Hugenotten", "Giacomo Meyerbeer", "1836", "Eugène Scribe, Émile Deschamps"],
            ["Die Italienerin in Algier", "Gioachino Rossini", "1813", "Angelo Anelli"],
            ["Die Jüdin", "Fromental Halévy", "1835", "Eugène Scribe"],
            ["Die Jungfrau im Turm", "Jean Sibelius", "1896", "Rafael Hertzberg"],
            ["Die Jungfrau von Orléans", "Pjotr Iljitsch Tschaikowski", "1881", "Pjotr Iljitsch Tschaikowski"],
            ["Die Kluge", "Carl Orff", "1943", "Carl Orff"],
            ["Die Krönung der Poppea", "Claudio Monteverdi", "1642", "Giovanni Francesco Busenello"],
            ["Die Liebe der Danae", "Richard Strauss", "1952", "Joseph Gregor"],
            ["Die Lombarden auf dem ersten Kreuzzug", "Giuseppe Verdi", "1843", "Temistocle Solera"],
            ["Die lustigen Weiber von Windsor", "Otto Nicolai", "1849", "Salomon Hermann Mosenthal"],
            ["Die Macht des Schicksals", "Giuseppe Verdi", "1862", "Francesco Maria Piave"],
            ["Die Magd als Herrin", "Giovanni Battista Pergolesi", "1733", "Gennaro Antonio Federico"],
            ["Die Meistersinger von Nürnberg", "Richard Wagner", "1868", "Richard Wagner"],
            ["Die Nachtausgabe", "Peter Ronnefeld", "1956", ""],
            ["Die Nachtschwalbe", "Boris Blacher", "1948", "Friedrich Wolf"],
            ["Die Nachtwandlerin", "Vincenzo Bellini", "1831", "Felice Romani"],
            ["Die Nase", "Dmitri Schostakowitsch", "1930", "Dmitri Schostakowitsch"],
            ["Die Neger", "Antonio Salieri", "1804", "Georg Friedrich Treitschke"],
            ["Die Opernprobe", "Albert Lortzing", "1853", "Albert Lortzing"],
            ["Die Perlenfischer", "Georges Bizet", "1863", "Eugène Cormon, Michel Florentin Carré"],
            ["Die Puritaner", "Vincenzo Bellini", "1835", "Carlo Pepoli"],
            ["Die Räuber", "Giuseppe Verdi", "1847", "Andrea Maffei"],
            ["Die Regimentstochter", "Gaetano Donizetti", "1840", "Jules-Henri Vernoy de Saint-Georges, Jean-François Bayard"],
            ["Die Reise nach Reims", "Gioachino Rossini", "1825", "Giuseppe Luigi Balocchi"],
            ["Die Rheinnixen", "Jacques Offenbach", "1864", "Charles Nuitter"],
            ["Die Rose vom Liebesgarten", "Hans Pfitzner", "1901", "James Grun"],
            ["Die Sache Makropulos", "Leoš Janáček", "1926", "Leoš Janáček"],
            ["Die Schatzkammer des Ynka", "Albert Lortzing", "", "Robert Blum"],
            ["Die Schlacht von Legnano", "Giuseppe Verdi", "1849", "Salvatore Cammarano"],
            ["Die schlaue Susanne", "Franz Xaver Lehner", "1952", "Hans Schlegel"],
            ["Die Schneekönigin", "Esther Hilsberg", "2003", "Kerstin Weiss"],
            ["Die Schneider von Schönau", "Jan Brandts-Buys", "1916", "Bruno Warden und Ignaz Michael Welleminsky"],
            ["Die Schwalbe", "Giacomo Puccini", "1917", "Giuseppe Adami"],
            ["Die schwarze Orchidee", "Eugen d\u2019Albert", "1928", "Karl Michael von Levetzow"],
            ["Die schwarze Spinne", "Heinrich Sutermeister", "1949", "Albert Roesler"],
            ["Die schweigsame Frau", "Richard Strauss", "1935", "Stefan Zweig"],
            ["Die Schweizer Familie", "Joseph Weigl", "1809", "Ignaz Franz Castelli"],
            ["Die seidene Leiter", "Gioachino Rossini", "1812", "Giuseppe Maria Foppa"],
            ["Die sizilianische Vesper", "Giuseppe Verdi", "1855", "Eugène Scribe, Charles Duveyrier"],
            ["Die Soldaten", "Bernd Alois Zimmermann", "1965", "Bernd Alois Zimmermann"],
            ["Die spanische Stunde", "Maurice Ravel", "1911", "Franc-Nohain"],
            ["Die Stumme von Portici", "Daniel-François-Esprit Auber", "1828", "Eugène Scribe, Germain Delavigne"],
            ["Die Teufel von Loudun", "Krzysztof Penderecki", "1969", "Krzysztof Penderecki"],
            ["Die Teufelskäthe", "Antonín Dvořák", "1899", "Adolf Wenig"],
            ["Die Teufelswand", "Bedřich Smetana", "1882", "Eliška Krásnohorská"],
            ["Die tote Stadt", "Erich Wolfgang Korngold", "1920", "Paul Schott (= Julius Korngold)"],
            ["Die toten Augen", "Eugen d\u2019Albert", "1916", "Hanns Heinz Ewers, Marc Henry"],
            ["Die Trojaner", "Hector Berlioz", "1890", "Hector Berlioz"],
            ["Die unbewohnte Insel", "Joseph Haydn", "1779", "Pietro Metastasio"],
            ["Die unschuldige Liebe", "Antonio Salieri", "1770", "Giovanni Gastone Boccherini"],
            ["Die verkaufte Braut", "Bedřich Smetana", "1866", "Karel Sabina"],
            ["Die Verschworenen", "Franz Schubert", "1861", "Ignaz Franz Castelli"],
            ["Die verstellte Einfalt", "Wolfgang Amadeus Mozart", "1769", ""],
            ["Die vier Grobiane", "Ermanno Wolf-Ferrari", "1906", "Giuseppe Pizzolato"],
            ["Die Walküre", "Richard Wagner", "1870", "Richard Wagner"],
            ["Die Wände", "Adriana Hölszky", "1995", "Thomas Körner"],
            ["Die weiße Dame", "François-Adrien Boieldieu", "1825", "Eugène Scribe"],
            ["Die Welt auf dem Monde", "Joseph Haydn", "1777", "Carlo Goldoni"],
            ["Die wiedererkannte Europa", "Antonio Salieri", "1778", "Mattia Verazi"],
            ["Die Willis", "Giacomo Puccini", "1884", "Ferdinando Fontana"],
            ["Die Zauberflöte", "Wolfgang Amadeus Mozart", "1791", "Emanuel Schikaneder"],
            ["Die Zaubergeige", "Werner Egk", "1935", "Ludwig Andersen, Werner Egk"],
            ["Die Zauberharfe", "Franz Schubert", "1820", "Georg Ernst von Hofmann"],
            ["Die Zauberin", "Pjotr Iljitsch Tschaikowski", "1887", "Ippolit Spazhinsky"],
            ["Die Zauberinsel", "Heinrich Sutermeister", "1942", "Heinrich Sutermeister"],
            ["Die Zwillinge", "Alfred Huth", "", ""],
            ["Die Zwillingsbrüder", "Franz Schubert", "1820", "Georg Ernst von Hofmann"],
            ["Djamileh", "Georges Bizet", "1872", "Louis Gallet"],
            ["Doctor Atomic", "John Adams", "2005", "Peter Sellars"],
            ["Doktor Faust", "Ferruccio Busoni", "1925", "Ferruccio Busoni"],
            ["Doktor Johannes Faust", "Hermann Reutter", "1936", "Ludwig Andersen"],
            ["Doktor und Apotheker", "Carl Ditters von Dittersdorf", "1786", "Johann Gottlieb Stephanie d. J."],
            ["Don Carlos", "Giuseppe Verdi", "1867", "Josephe Méry, Camille du Locle"],
            ["Don Juan", "Wolfgang Amadeus Mozart", "1787", "Lorenzo da Ponte"],
            ["Don Pasquale", "Gaetano Donizetti", "1843", "Angelo Anelli"],
            ["Don Rodrigo", "Alberto Ginastera", "1964", "Alejandro Casona"],
            ["Donna Diana", "Emil Nikolaus von Reznicek", "1894", "Emil Nikolaus von Reznicek"],
            ["Down in the Valley", "Kurt Weill", "1948", "Arnold Sundgaard"],
            ["Echnaton", "Philip Glass", "1984", "Philip Glass, Shalom Goldmann und andere"],
            ["Echo und Narziß", "Christoph Willibald Gluck", "1779", "Jean-Baptiste-Louis-Théodore de Tschudi[1]"],
            ["Edgar", "Giacomo Puccini", "1889", "Ferdinando Fontana"],
            ["Ein Leben für den Zaren", "Michail Glinka", "1836", ""],
            ["Ein Maskenball", "Giuseppe Verdi", "1859", "Antonio Somma"],
            ["Ein Sommernachtstraum", "Benjamin Britten", "1960", "Benjamin Britten, Peter Pears"],
            ["Ein Traumspiel", "Aribert Reimann", "1965", ""],
            ["Eine florentinische Tragödie", "Alexander von Zemlinsky", "1917", "Max Meyerfeld"],
            ["Elektra", "Richard Strauss", "1909", "Hugo von Hofmannsthal"],
            ["Enoch Arden", "Ottmar Gerster", "1936", "Karl Michael Freiherr von Levetzow"],
            ["Ernani", "Giuseppe Verdi", "1844", "Francesco Maria Piave"],
            ["Ero der Schelm", "Jakov Gotovac", "1935", "Milan Begović"],
            ["Erwartung", "Arnold Schönberg", "1924", "Marie Pappenheim"],
            ["Es war einmal\u2026", "Alexander von Zemlinsky", "1900", "Maximilian Singer"],
            ["Eugen Onegin", "Pjotr Iljitsch Tschaikowski", "1879", "Konstantin Stepanowitsch Schilowski"],
            ["Eugenia", "Wilhelm Rinkens", "1943", ""],
            ["Euridice", "Jacopo Peri", "1600", "Ottavio Rinuccini"],
            ["Euryanthe", "Carl Maria von Weber", "1823", "Helmina von Chézy"],
            ["Eurydike", "Giulio Caccini", "1602", "Ottavio Rinuccini"],
            ["Falstaff", "Giuseppe Verdi", "1893", "Arrigo Boito"],
            ["Falstaff oder Die drei Streiche", "Antonio Salieri", "1799", "Carlo Prospero De Franceschi"],
            ["Fanferlieschen Schönefüßchen", "Kurt Schwertsik", "1983", "Karin und Thomas Körner"],
            ["Fausts Verdammnis", "Hector Berlioz", "1846", "Gérard de Nerval, Almire Gandonnière, Hector Berlioz"],
            ["Feist", "Jury Everhartz", "2001", "Günter Rupp"],
            ["Feuersnot", "Richard Strauss", "1901", "Ernst von Wolzogen"],
            ["Fidelio", "Ludwig van Beethoven", "1805", "Joseph von Sonnleithner, Georg Friedrich Treitschke"],
            ["Fierrabras", "Franz Schubert", "1897", "Joseph Kupelwieser"],
            ["Flauto solo", "Eugen d\u2019Albert", "1905", "Hans von Wolzogen"],
            ["Fortabelsen", "Rued Langgaard", "", ""],
            ["Fra Diavolo oder Das Gasthaus zu Terracina", "Daniel-François-Esprit Auber", "1830", "Eugène Scribe"],
            ["Freund Fritz", "Pietro Mascagni", "1891", "Nicola Daspuro"],
            ["Fürst Igor", "Alexander Borodin", "1890", "Alexander Borodin"],
            ["Genoveva", "Robert Schumann", "1850", "Robert Schumann"],
            ["Germania", "Alberto Franchetti", "1902", "Luigi Illica"],
            ["Gernot", "Eugen d\u2019Albert", "1897", ""],
            ["Gianni Schicchi", "Giacomo Puccini", "1918", "Giovacchino Forzano"],
            ["Giovanna d\u2019Arco", "Giuseppe Verdi", "1845", "Temistocle Solera"],
            ["Götterdämmerung", "Richard Wagner", "1876", "Richard Wagner"],
            ["Goya", "Gian Carlo Menotti", "1986", "Gian Carlo Menotti"],
            ["Griechische Passion", "Bohuslav Martinů", "1961", "Bohuslav Martinů"],
            ["Hagith", "Karol Szymanowski", "1922", "Felix Dörrmann"],
            ["Halka", "Stanisław Moniuszko", "1848", "Włodzimierz Wolski"],
            ["Hamlet", "Franco Faccio", "1865", "Arrigo Boito"],
            ["Hannibal in Capua", "Antonio Salieri", "1801", "Antonio Simone Sografi"],
            ["Hans Heiling", "Heinrich Marschner", "1833", "Eduard Devrient"],
            ["Hans Sachs", "Albert Lortzing", "1840", "Albert Lortzing, Philipp Reger, Philipp Jakob Düringer"],
            ["Hänsel und Gretel", "Engelbert Humperdinck", "1893", "Adelheid Wette"],
            ["Heinrich der Löwe", "Agostino Steffani", "1689", "Ortensio Mauro"],
            ["Helvellyn", "George Alexander Macfarren", "1864", "John Oxenford"],
            ["Hermione", "Max Bruch", "1872", ""],
            ["Herzog Blaubarts Burg", "Béla Bartók", "1918", "Béla Balázs"],
            ["Hexenjagd", "Robert Ward", "1961", "Bernard Stambler"],
            ["Hierlanda", "Jury Everhartz", "1998", "Johannes Udalricus von Federspill"],
            ["Hilfe, Hilfe, die Globolinks", "Gian Carlo Menotti", "1968", "Gian Carlo Menotti"],
            ["Hin und zurück", "Paul Hindemith", "1927", "Marcellus Schiffer"],
            ["Hippolyte et Aricie", "Jean-Philippe Rameau", "1735", ""],
            ["Hoffmanns Erzählungen", "Jacques Offenbach", "1881", "Jules Barbier"],
            ["I Was Looking at the Ceiling and Then I Saw the Sky", "John Adams", "1995", "June Jordan"],
            ["Idomeneus", "Wolfgang Amadeus Mozart", "1781", "Giambattista Varesco"],
            ["Il ritorno d\u2019Ulisse in patria", "Claudio Monteverdi", "1640", "Giacomo Badoaro"],
            ["Intermezzo", "Richard Strauss", "1924", "Richard Strauss"],
            ["Intolleranza 1960", "Luigi Nono", "1961", "Maria Ripellini und Luigi Nono"],
            ["Iphigenie auf Tauris", "Christoph Willibald Gluck", "1781", ""],
            ["Iphigenie in Aulis", "Christoph Willibald Gluck", "1774", "François Gand-Leblanc du Roullet"],
            ["Iris", "Pietro Mascagni", "1898", "Luigi Illica"],
            ["Isabeau", "Pietro Mascagni", "1911", "Luigi Illica"],
            ["Isis", "Jean-Baptiste Lully", "1677", "Philippe Quinault"],
            ["Izeÿl", "Eugen d\u2019Albert", "1909", "Rudolf Lothar"],
            ["Jenufa", "Leoš Janáček", "1904", "Leoš Janáček"],
            ["Jerusalem", "Giuseppe Verdi", "1847", "Temistocle Solera, Alphonse Royer, Gustave Vaëz"],
            ["Johanna auf dem Scheiterhaufen", "Arthur Honegger", "1938", "Paul Claudel"],
            ["Jonny spielt auf", "Ernst Krenek", "1927", "Ernst Krenek"],
            ["Julius Caesar", "Georg Friedrich Händel", "1724", "Nicola Haym"],
            ["Jürg Jenatsch", "Heinrich Kaminski", "1929", ""],
            ["Kain", "Eugen d\u2019Albert", "1900", "Heinrich Bulthaupt"],
            ["Karin Lenz", "Günter Kochan", "1971", "Erik Neutsch"],
            ["Karl VI.", "Fromental Halévy", "1843", "Casimir und Germain Delavigne"],
            ["Katja Kabanova", "Leoš Janáček", "1921", "Leoš Janáček"],
            ["Kleider machen Leute", "Alexander von Zemlinsky", "ung)", "Leo Feld"],
            ["König für einen Tag", "Giuseppe Verdi", "1840", "Felice Romani"],
            ["König Hirsch", "Hans Werner Henze", "1956", "Heinz von Cramer"],
            ["König Midas", "Wilhelm Kempff", "1931", "Wilhelm Kempff"],
            ["König Roger", "Karol Szymanowski", "1926", "Jarosław Iwaszkiewicz und Karol Szymanowski"],
            ["Königskinder", "Engelbert Humperdinck", "1897", "Ernst Rosmer (= Elsa Bernstein)"],
            ["Kublai, großer Khan der Tartaren", "Antonio Salieri", "1998", "Giovanni Battista Casti"],
            ["L\u2019amour de loin", "Kaija Saariaho", "2000", "Amin Maalouf"],
            ["La Bohème", "Ruggero Leoncavallo", "1897", "Ruggero Leoncavallo"],
            ["La Bohème", "Giacomo Puccini", "1896", "Giuseppe Giacosa, Luigi Illica"],
            ["La Clemenza di Tito", "Wolfgang Amadeus Mozart", "1791", "Pietro Metastasio"],
            ["La Gioconda", "Amilcare Ponchielli", "1876", "Tobia Gorrio (= Arrigo Boito)"],
            ["La Traviata", "Giuseppe Verdi", "1853", "Francesco Maria Piave"],
            ["Lady Macbeth von Mzensk", "Dmitri Schostakowitsch", "1934", "Alexander Germanowitsch Preis"],
            ["Lakmé", "Léo Delibes", "1883", "Edmond Gondinet, Philippe Gille"],
            ["Le pays", "Joseph Guy Ropartz", "1913", ""],
            ["Le rossignol", "Igor Strawinsky", "1914", "Stepan Mitussow"],
            ["Lear", "Aribert Reimann", "1978", "Claus H. Henneberg"],
            ["Leonore 40/45", "Rolf Liebermann", "1952", "Heinrich Strobel"],
            ["Les fêtes de l\u2019Amour et de Bacchus", "Jean-Baptiste Lully", "1672", "Quinault, Benserade, Perigny, Molière"],
            ["Libussa", "Bedřich Smetana", "1881", "Josef Wenzig, Ervín Špindler"],
            ["Licht, Opernzyklus", "Karlheinz Stockhausen", "", "Karlheinz Stockhausen"],
            ["Liebesketten", "Eugen d\u2019Albert", "1912", "Rudolf Lothar"],
            ["Linda di Chamounix", "Gaetano Donizetti", "1842", "Gaetano Rossi"],
            ["Lohengrin", "Richard Wagner", "1850", "Richard Wagner"],
            ["Lucia di Lammermoor", "Gaetano Donizetti", "1835", "Salvatore Cammarano"],
            ["Lucio Silla", "Wolfgang Amadeus Mozart", "1772", "Giovanni de Gamerra"],
            ["Lucrezia Borgia", "Gaetano Donizetti", "1833", "Felice Romani"],
            ["Luisa Miller", "Giuseppe Verdi", "1849", "Salvatore Cammarano"],
            ["Lulu", "Alban Berg", "1937", "Alban Berg"],
            ["Macbeth", "Giuseppe Verdi", "1847", "Andrea Maffei, Francesco Maria Piave"],
            ["Madame Butterfly", "Giacomo Puccini", "1904", "Giuseppe Giacosa, Luigi Illica"],
            ["Mahomet II.", "Gioachino Rossini", "1817", "Cesare della Valle"],
            ["Manon", "Jules Massenet", "1884", "Henri Meilhac"],
            ["Manon Lescaut", "Giacomo Puccini", "1893", "Marco Praga, Luigi Illica"],
            ["Margarethe", "Charles Gounod", "1859", "Jules Barbier und Michel Carré"],
            ["Maria Stuart", "Gaetano Donizetti", "1835", "Felice Romani"],
            ["Martha", "Friedrich von Flotow", "1847", "Friedrich Wilhelm Riese"],
            ["Mathis der Maler", "Paul Hindemith", "1938", "Paul Hindemith"],
            ["Mavra", "Igor Strawinsky", "1922", "Boris Koschno"],
            ["Mazeppa", "Pjotr Iljitsch Tschaikowski", "1884", "Viktor Burenin und Pjotr Iljitsch Tschaikowski"],
            ["Medea", "Friedhelm Döhl", "", "Friedhelm Döhl"],
            ["Médée", "Marc-Antoine Charpentier", "1693", "Thomas Corneille"],
            ["Mefistofele", "Arrigo Boito", "1868", "Arrigo Boito"],
            ["Meister Pedros Puppenspiel", "Manuel de Falla", "1923", "Manuel de Falla"],
            ["Melusina", "Conradin Kreutzer", "1833", "Franz Grillparzer"],
            ["Melusine", "Aribert Reimann", "1971", ""],
            ["Mignon", "Ambroise Thomas", "1866", "Michel Carré und Jules Barbier"],
            ["Mithridates, König von Ponto", "Wolfgang Amadeus Mozart", "1770", "Vittorio Amedeo Cigna-Santi"],
            ["Mona Lisa", "Max von Schillings", "1915", "Beatrice Dovsky"],
            ["Montezuma", "Carl Heinrich Graun", "1755", "Friedrich II. (Preußen)"],
            ["Moses und Aron", "Arnold Schönberg", "1954", ""],
            ["Motezuma", "Antonio Vivaldi", "1733", "Girolamo Alvise Giusti"],
            ["Nabucco", "Giuseppe Verdi", "1842", "Temistocle Solera"],
            ["Neues vom Tage", "Paul Hindemith", "1929", "Marcellus Schiffer"],
            ["Nina", "Giovanni Paisiello", "1789", "Giuseppe Carpani und Giambattista Lorenzi"],
            ["Nixon in China", "John Adams", "1987", "Alice Goodman"],
            ["Noach", "Fromental Halévy", "1885", "Jules-Henri Vernoy de Saint-Georges"],
            ["Norma", "Vincenzo Bellini", "1831", "Felice Romani"],
            ["Notre Dame", "Franz Schmidt", "1914", "Franz Schmidt und Leopold Wilk"],
            ["Oberon", "Carl Maria von Weber", "1826", "James Robinson Planché"],
            ["Oberto", "Giuseppe Verdi", "1839", "Antonio Piazza, Temistocle Solera"],
            ["Orlando furioso", "Antonio Vivaldi", "1727", "Grazio Braccioli"],
            ["Oronte", "Jean-Louis Lully", "", ""],
            ["Orpheus", "Claudio Monteverdi", "1607", "Alessandro Striggio"],
            ["Orpheus Kristall", "Manfred Stahnke", "2002", ""],
            ["Orpheus und Eurydike", "Christoph Willibald Gluck", "1762", "Ranieri de\u2019 Calzabigi"],
            ["Othello", "Gioachino Rossini", "1816", "Francesco Berio di Salsa"],
            ["Othello", "Giuseppe Verdi", "1887", "Arrigo Boito"],
            ["Owen Wingrave", "Benjamin Britten", "1971", "Myfanwy Piper"],
            ["Palestrina", "Hans Pfitzner", "1917", "Hans Pfitzner"],
            ["Paris und Helena", "Christoph Willibald Gluck", "1770", "Ranieri de\u2019 Calzabigi"],
            ["Parisina", "Pietro Mascagni", "1913", "Gabriele D\u2019Annunzio"],
            ["Parsifal", "Richard Wagner", "1882", "Richard Wagner"],
            ["Pastorale", "Gérard Pesson", "2006", "Gérard Pesson"],
            ["Pelleas und Melisande", "Claude Debussy", "1902", "Claude Debussy"],
            ["Penthesilea", "Othmar Schoeck", "1927", "Othmar Schoeck nach Heinrich von Kleist"],
            ["Persée", "Jean-Baptiste Lully", "1682", "Philippe Quinault"],
            ["Peter Grimes", "Benjamin Britten", "1945", "Montagu Slater"],
            ["Peter Schmoll und seine Nachbarn", "Carl Maria von Weber", "1803", "Joseph Türk"],
            ["Phaëton", "Jean-Baptiste Lully", "1683", "Philippe Quinault"],
            ["Pique Dame", "Pjotr Iljitsch Tschaikowski", "1890", "Modest Tschaikowski"],
            ["Porgy and Bess", "George Gershwin", "1935", "DuBose Heyward, Ira Gershwin"],
            ["Preußisches Märchen", "Boris Blacher", "1952", "Heinz von Cramer"],
            ["Prometeo", "Luigi Nono", "1984", "Massimo Cacciari"],
            ["Proserpine", "Jean-Baptiste Lully", "1680", "Philippe Quinault"],
            ["Psyché", "Jean-Baptiste Lully", "1678", "Thomas Corneille"],
            ["Ragnheiður", "Gunnar Þórðarson", "2013", "Friðrik Erlingsson"],
            ["Regina", "Albert Lortzing", "1899", "Albert Lortzing"],
            ["Revolutionshochzeit", "Eugen d\u2019Albert", "1919", "Ferdinand Lion"],
            ["Rienzi", "Richard Wagner", "1842", "Richard Wagner"],
            ["Rigoletto", "Giuseppe Verdi", "1851", "Francesco Maria Piave"],
            ["Rinaldo", "Georg Friedrich Händel", "1711", "Giacomo Rossi"],
            ["Risorgimento!", "Lorenzo Ferrero", "2011", "Dario Oliveri"],
            ["Robert der Teufel", "Giacomo Meyerbeer", "1831", "Eugène Scribe"],
            ["Roberto Devereux", "Gaetano Donizetti", "1837", "Salvadore Cammarano"],
            ["Robin Hood", "Albert Dietrich", "1876", "Reinhard Mosen"],
            ["Robin Hood", "George Alexander Macfarren", "1860", "John Oxenford"],
            ["Roland", "Jean-Baptiste Lully", "1685", "Philippe Quinault"],
            ["Rolands Knappen", "Albert Lortzing", "1849", "Albert Lortzing"],
            ["Romeo und Julia", "Heinrich Sutermeister", "1940", "Heinrich Sutermeister"],
            ["Rusalka", "Antonín Dvořák", "1901", "Jaroslav Kvapil"],
            ["Ruslan und Ludmilla", "Michail Glinka", "1842", ""],
            ["Salome", "Antoine Mariotte", "1908", "Antoine Mariotte"],
            ["Salome", "Richard Strauss", "1905", "Richard Strauss"],
            ["Salvatore Giuliano", "Lorenzo Ferrero", "1986", "Giuseppe Di Leva"],
            ["Samson und Dalila", "Camille Saint-Saëns", "1877", "Ferdinand Lemaire"],
            ["Sarema", "Alexander von Zemlinsky", "1897", "Alexander von Zemlinsky, Adolf von Zemlinszky, Arnold Schönberg"],
            ["Schattenlos", "Margarete Huber", "2018", "Steffen Thiemann"],
            ["Schneider Wibbel", "Mark Lothar", "1938", "Hans Müller-Schlösser"],
            ["Schwanda, der Dudelsackpfeifer", "Jaromír Weinberger", "1927", "Milo Kares"],
            ["Schwarzer Peter", "Norbert Schultze", "1936", "Walter Lieck"],
            ["Schwester Angelica", "Giacomo Puccini", "1918", "Giovacchino Forzano"],
            ["Siberia", "Umberto Giordano", "1903", "Luigi Illica"],
            ["Siegfried", "Richard Wagner", "1876", "Richard Wagner"],
            ["Simon Boccanegra", "Giuseppe Verdi", "1857", "Francesco Maria Piave"],
            ["Stiffelio", "Giuseppe Verdi", "1850", "Francesco Maria Piave"],
            ["Street Scene", "Kurt Weill", "1947", "Elmer Rice, Langston Hughes"],
            ["Susannens Geheimnis", "Ermanno Wolf-Ferrari", "1909", "Enrico Golisciani"],
            ["Tankred", "Gioachino Rossini", "1813", "Gaetano Rossi"],
            ["Tannhäuser und der Sängerkrieg auf Wartburg", "Richard Wagner", "1845", "Richard Wagner"],
            ["Tarare", "Antonio Salieri", "1787", "Beaumarchais"],
            ["Teseo", "Georg Friedrich Händel", "1713", "Nicola Francesco Haym"],
            ["Thaïs", "Jules Massenet", "1894", "Louis Gallet"],
            ["The Death of Klinghoffer", "John Adams", "1991", "Alice Goodman"],
            ["The Tale of Lady Thị Kính", "P. Q. Phan", "2014", "P. Q. Phan"],
            ["Thésée", "Jean-Baptiste Lully", "1675", "Philippe Quinault"],
            ["Tiefland", "Eugen d\u2019Albert", "1903", "Rudolf Lothar"],
            ["Titus Feuerfuchs", "Heinrich Sutermeister", "1958", "Heinrich Sutermeister"],
            ["Tobias Wunderlich", "Joseph Haas", "1937", "Ludwig Strecker der Jüngere"],
            ["Tod in Venedig", "Benjamin Britten", "1973", "Myfanwy Piper"],
            ["Tosca", "Giacomo Puccini", "1900", "Giuseppe Giacosa, Luigi Illica"],
            ["Tranquilla Trampeltreu", "Wilfried Hiller", "1981", "Michael Ende"],
            ["Tristan und Isolde", "Richard Wagner", "1865", "Richard Wagner"],
            ["Troades", "Aribert Reimann", "1986", "Gerd Albrecht, Aribert Reimann"],
            ["Turandot", "Giacomo Puccini", "1926", "Giuseppe Adami, Renato Simoni"],
            ["Undine", "E.T.A. Hoffmann", "1816", "Friedrich de la Motte Fouqué"],
            ["Undine", "Albert Lortzing", "1845", "Albert Lortzing"],
            ["Unter der großen Sonne von Liebe beladen", "Luigi Nono", "1975", "Luigi Nono, Jurij Ljubimow"],
            ["Venus and Adonis", "Hans Werner Henze", "1997", "Hans-Ulrich Treichel"],
            ["Vildstjernelys", "Rued Langgaard", "", ""],
            ["Viva la Mamma!", "Gaetano Donizetti", "1831", "Gaetano Donizetti"],
            ["Wenn ich König wär\u2019", "Adolphe Adam", "1852", "Adolphe d\u2019Ennery, Jules-Henri Brésil"],
            ["Werther", "Jules Massenet", "1892", "Édouard Blau, Paul Milliet, Georges Hartmann"],
            ["Wilhelm Tell", "Gioachino Rossini", "1829", "Victor Joseph Etienne"],
            ["William Ratcliff", "Pietro Mascagni", "1895", "Andrea Maffei"],
            ["Wittkopp. Kinderoper", "Hans-Joachim Marx", "1983", "Margret Rettich"],
            ["Wozzeck", "Alban Berg", "1925", "Alban Berg"],
            ["Wozzeck", "Manfred Gurlitt", "1926", "Manfred Gurlitt"],
            ["Xerxes", "Georg Friedrich Händel", "1738", ""],
            ["Zaide", "Wolfgang Amadeus Mozart", "1861", "Johann Andreas Schachtner"],
            ["Zar und Zimmermann", "Albert Lortzing", "1837", "Albert Lortzing"],
            ["Zoroastre", "Jean-Philippe Rameau", "", "Louis de Cahusac"],
            ["Zwei Witwen", "Bedřich Smetana", "1874", "Emanuel Züngel"]
        ];
        datalist = document.createElement("datalist");
        datalist.setAttribute("id", "operas");
        operas.forEach(opera => {
            const option = document.createElement("option");
            option.setAttribute("value", opera[0]);
            datalist.appendChild(option);
        });
        document.getElementsByTagName("body")[0].appendChild(datalist);
        
        // show logo block 
        const logotainer = document.createElement("div");
        logotainer.classList.add("logo-container");
        logotainer.innerHTML = `
            <div></div>
            <div class="logo">
                <div>
                    <img class="logoImage" src="fruschtique%20Logo%20grau%20transparent.png" alt="Logo" title="fruschtique-Logo">
                </div>
            </div> `;
        const body = document.getElementsByTagName("body")[0]
        body.appendChild(logotainer);

        console.log (XMLdata);
        const formData = new DOMParser().parseFromString(XMLdata, "text/xml");  
        const opera = formData.querySelector("short opera").textContent;
        console.log (opera);
        const composer = formData.querySelector("short composer").textContent;   
        console.log (composer);
        const place = formData.querySelector("short place").textContent;   
        console.log (place);
        const year = formData.querySelector("short year").textContent;   
        console.log (year);
        const orphID = formData.querySelector("short orphID").textContent; 
        console.log (orphID);

        // create outer fieldset
        let orph;
        let section;
        let fieldset;
        let container;
        let addNewText;

        // short section
        fieldset = document.createElement("fieldset");
        fieldset.setAttribute("id", orphID);
        fieldset.innerHTML = `<legend>${year} ${opera} ${composer} ${place}</legend>
                <div class="form-container"></div>`;
        container = fieldset.querySelector(".form-container");

        // performance section
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
        const opInput = fieldset.querySelector("input[name='opera']");
        opInput.setAttribute("list", "operas");
        orph.appendChild(fieldset);

        // cast list section
        section = 
            { id: "cast-list", legend: "Besetzung", fields: [
                { role: "", artist: "", gnd: "" }                       
            ] };
        fieldset = document.createElement("fieldset");
        fieldset.setAttribute("id", section.id);
        fieldset.innerHTML = `<legend>${section.legend}</legend><div class="cast-list-container"></div>`;
        container = fieldset.querySelector(".cast-list-container");
        section.fields.forEach(field => {
            container.innerHTML += `
                <label>Rolle</label>
                <input type="text" name="role" value="${field.role}"></input>
                <label>Künstler</label>
                <input type="text" name="artist" value="${field.artist}"></input>
                <label class="GND-label">GND-ID</label>
                <input type="text" name="artistGND" value="${field.gnd}"></input>`     
        });
        addNewCastLine = document.createElement("input");
        Object.assign(addNewCastLine, {type: "button", name: "add_castline", value: "+"});
        container.appendChild(addNewCastLine);
        addNewCastLine.addEventListener("click", addCastLine);
        orph.appendChild(fieldset);

        // staging-related texts section
        section = 
            { id: "staging-related", legend: "Texte zur Aufführung", fields: [
                { author: "", gnd: "", title: "", paragraphs: [""] }                       
            ] };
        fieldset = document.createElement("fieldset");
        fieldset.setAttribute("id", section.id);
        fieldset.innerHTML = `<legend>${section.legend}</legend><div class="form-container"></div>`;
        container = fieldset.querySelector(".form-container");
        section.fields.forEach(field => {
            container.innerHTML += `
                <label>Autor</label>
                <input type="text" name="Author" value="${field.author}"></input>
                <label class="GND-label">GND-ID</label>
                <input type="text" name="GND" value="${field.gnd}"></input>
                <label>Titel</label>
                <input type="text" name="Title" value="${field.title}"></input>
                <p class="right-text"></p>`;
            field.paragraphs.forEach(paragraph => {
                container.innerHTML += `
                    <label>Absatz</label>
                    <textarea class="full-text"></textarea>`
            });
        });
        addNewPara = document.createElement("input");
        Object.assign(addNewPara, {type: "button", name: "add_para", value: "+"});
        container.appendChild(addNewPara);
        addNewPara.addEventListener("click", addParagraph);

        addNewText = document.createElement("input");
        Object.assign(addNewText, {type: "button", name: "add_text", value: "weiterer Text"});
        addNewText.addEventListener("click", addText);
        fieldset.appendChild(addNewText);
        orph.appendChild(fieldset);

        // story-related texts section
        section = 
            { id: "story-related", legend: "Texte zur Handlung", fields: [
                { author: "", gnd: "", title: "", paragraphs: [""] }                       
            ] };
        fieldset = document.createElement("fieldset");
        fieldset.setAttribute("id", section.id);
        fieldset.innerHTML = `<legend>${section.legend}</legend><div class="form-container"></div>`;
        container = fieldset.querySelector(".form-container");
        section.fields.forEach(field => {
            container.innerHTML += `
                <label>Autor</label>
                <input type="text" name="Author" value="${field.author}"></input>
                <label class="GND-label">GND-ID</label>
                <input type="text" name="GND" value="${field.gnd}"></input>
                <label>Titel</label>
                <input type="text" name="Title" value="${field.title}"></input>
                <p class="right-text"></p>`;
            field.paragraphs.forEach(paragraph => {
                container.innerHTML += `
                    <label>Absatz</label>
                    <textarea class="full-text"></textarea>`
            });
        });
        addNewPara = document.createElement("input");
        Object.assign(addNewPara, {type: "button", value: "+"});
        container.appendChild(addNewPara);
        addNewPara.addEventListener("click", addParagraph);

        addNewText = document.createElement("input");
        Object.assign(addNewText, {type: "button", value: "weiterer Text"});
        fieldset.appendChild(addNewText);
        addNewText.addEventListener("click", addText);
        orph.appendChild(fieldset);

        // music-related texts section
        section = 
            { id: "music-related", legend: "Texte zur Musik", fields: [
                { author: "", gnd: "", title: "", paragraphs: [""] }                       
            ] };
        fieldset = document.createElement("fieldset");
        fieldset.setAttribute("id", section.id);
        fieldset.innerHTML = `<legend>${section.legend}</legend><div class="form-container"></div>`;
        container = fieldset.querySelector(".form-container");
        section.fields.forEach(field => {
            container.innerHTML += `
                <label>Autor</label>
                <input type="text" name="Author" value="${field.author}"></input>
                <label class="GND-label">GND-ID</label>
                <input type="text" name="GND" value="${field.gnd}"></input>
                <label>Titel</label>
                <input type="text" name="Title" value="${field.title}"></input>
                <p class="right-text"></p>`;
            field.paragraphs.forEach(paragraph => {
                container.innerHTML += `
                    <label>Absatz</label>
                    <textarea class="full-text"></textarea>`
            });
        });
        addNewPara = document.createElement("input");
        Object.assign(addNewPara, {type: "button", value: "+"});
        container.appendChild(addNewPara);
        addNewPara.addEventListener("click", addParagraph);

        addNewText = document.createElement("input");
        Object.assign(addNewText, {type: "button", value: "weiterer Text"});
        addNewText.addEventListener("click", addText);
        fieldset.appendChild(addNewText);
        orph.appendChild(fieldset);

        // historic texts section 
        section = 
            { id: "historic", legend: "Historische Texte", fields: [
                { author: "", gnd: "", title: "", paragraphs: [""] }                       
            ] };
        fieldset = document.createElement("fieldset");
        fieldset.setAttribute("id", section.id);
        fieldset.innerHTML = `<legend>${section.legend}</legend><div class="form-container"></div>`;
        container = fieldset.querySelector(".form-container");
        section.fields.forEach(field => {
            container.innerHTML += `
                <label>Autor</label>
                <input type="text" name="Author" value="${field.author}"></input>
                <label class="GND-label">GND-ID</label>
                <input type="text" name="GND" value="${field.gnd}"></input>
                <label>Titel</label>
                <input type="text" name="Title" value="${field.title}"></input>
                <p class="right-text"></p>`;
            field.paragraphs.forEach(paragraph => {
                container.innerHTML += `
                    <label>Absatz</label>
                    <textarea class="full-text"></textarea>`
            });    
        });
        addNewPara = document.createElement("input");
        Object.assign(addNewPara, {type: "button", value: "+"});
        container.appendChild(addNewPara);
        addNewPara.addEventListener("click", addParagraph);
        
        addNewText = document.createElement("input");
        Object.assign(addNewText, {type: "button", value: "weiterer Text"});
        fieldset.appendChild(addNewText);
        addNewText.addEventListener("click", addText);
        orph.appendChild(fieldset);

        // add save button
        button = document.createElement("div")
        button.innerHTML += `<input type="button" id="saveButton" value="Speichern" ></input>`
        orph.appendChild(button);

        body.appendChild(orph);

        // add event listener to opera input field
        document.querySelector("input[name='opera']").addEventListener("change", function() {
            const op = document.querySelector("input[name='opera']").value;
            const idx = operas.findIndex (opera => opera[0] === op);
            const composer = operas[idx][1];
            const firstPerf = operas[idx][2];
            const libretto = operas[idx][3];
            document.querySelector("input[name='composer']").value = composer;
            document.querySelector("input[name='firstPerformance']").value = firstPerf;
            document.querySelector("input[name='libretto']").value = libretto;
        });

        // add event handler to save button
        document.getElementById("saveButton").addEventListener("click", saveFile); 
    }

    function addCastLine() {
        const labelRole = document.createElement("label");
        const role = document.createElement("input");
        Object.assign(role, {type: "text", name: "role"});
        const labelArtist = document.createElement("label");
        const artist = document.createElement("input");
        Object.assign(artist, {type: "text", name: "artist"});
        const labelGND = document.createElement("label");
        const gnd = document.createElement("input");
        Object.assign(gnd, {type: "text", name: "artistGND"});
        const button = document.createElement("input");
        button.setAttribute("type", "button");
        button.setAttribute("name", "add_castline");
        button.setAttribute("value", "+");
        button.addEventListener("click", addCastLine);
        const clicked = event.target;
        clicked.insertAdjacentElement("afterend", labelRole);
        labelRole.insertAdjacentElement("afterend", role);
        role.insertAdjacentElement("afterend", labelArtist);
        labelArtist.insertAdjacentElement("afterend", artist);
        artist.insertAdjacentElement("afterend", labelGND);
        labelGND.insertAdjacentElement("afterend", gnd);
        gnd.insertAdjacentElement("afterend", button);
    }

    function addParagraph() {
        const label = document.createElement("label");
        const paragraph = document.createElement("textarea");
        paragraph.classList.add("full-text");
        const button = document.createElement("input");
        button.setAttribute("type", "button");
        button.setAttribute("value", "+");
        button.addEventListener("click", addParagraph);
        const clicked = event.target;
        clicked.insertAdjacentElement("afterend", label);
        label.insertAdjacentElement("afterend", paragraph);
        paragraph.insertAdjacentElement("afterend", button);
    }

    function addText() {
        const cont = document .createElement("div");
        cont.innerHTML += `
                <label>Autor</label>
                <input type="text" name="Author" value=""></input>
                <label class="GND-label">GND-ID</label>
                <input type="text" name="GND" value=""></input>
                <label>Titel</label>
                <input type="text" name="Title" value=""></input>
                <p class="right-text"></p>
                <label>Absatz</label>
                <textarea class="full-text"></textarea>`;
        cont.classList.add("form-container");
        const buttonPara = document.createElement("input");
        buttonPara.setAttribute("type", "button");
        buttonPara.setAttribute("value", "+");
        cont.appendChild(buttonPara);
        buttonPara.addEventListener("click", addParagraph);
        const button = document.createElement("input");
        button.setAttribute("type", "button");
        button.setAttribute("value", "weiterer Text");
        button.addEventListener("click", addText);
        const clicked = event.target;
        clicked.insertAdjacentElement("afterend", cont);
        cont.insertAdjacentElement("afterend", button);
    }

    function saveFile() {
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
        const xml = parser.parseFromString("<orph></orph>", "text/xml");
        const orph = xml.querySelector("orph");
        const performance = xml.createElement("performance");
        const castList = xml.createElement("castList");
        const stagingRelated = xml.createElement("stagingRelated");
        const storyRelated = xml.createElement("storyRelated");
        const musicRelated = xml.createElement("musicRelated");
        const historic = xml.createElement("historic");

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
            const cast = xml.createElement("cast");
            cast.innerHTML = `
                <role>${roles[index].value}</role>
                <artist>${artists[index].value}</artist>
                <artistGND>${artistGNDs[index].value}</artistGND>`;
            castList.appendChild(cast);
        });
        orph.appendChild(castList);

        // staging-related texts
        const stagingTexts = document.querySelectorAll("#staging-related .form-container");
        stagingTexts.forEach(text => {
            const textElement = xml.createElement("text");
            textElement.innerHTML = `
                <author>${text.querySelector("input[name='Author']").value}</author>
                <authorGND>${text.querySelector("input[name='GND']").value}</authorGND>
                <title>${text.querySelector("input[name='Title']").value}</title>`;
            const paragraphs = text.querySelectorAll("textarea");
            paragraphs.forEach((para, index) => {
                const paragraph = xml.createElement("paragraph");
                paragraph.innerHTML = para.value;
                textElement.appendChild(paragraph);
            });
            stagingRelated.appendChild(textElement);
        });
        orph.appendChild(stagingRelated);

        // story-related texts
        const storyTexts = document.querySelectorAll("#story-related .form-container");
        storyTexts.forEach(text => {
            const textElement = xml.createElement("text");
            textElement.innerHTML = `
                <author>${text.querySelector("input[name='Author']").value}</author>
                <authorGND>${text.querySelector("input[name='GND']").value}</authorGND>
                <title>${text.querySelector("input[name='Title']").value}</title>`;
            const paragraphs = text.querySelectorAll("textarea");
            paragraphs.forEach((para, index) => {
                const paragraph = xml.createElement("paragraph");
                paragraph.innerHTML = para.value;
                textElement.appendChild(paragraph);
            });
            storyRelated.appendChild(textElement);
        });
        orph.appendChild(storyRelated);

        // music-related texts
        const musicTexts = document.querySelectorAll("#music-related .form-container");
        musicTexts.forEach(text => {
            const textElement = xml.createElement("text");
            textElement.innerHTML = `
                <author>${text.querySelector("input[name='Author']").value}</author>
                <authorGND>${text.querySelector("input[name='GND']").value}</authorGND>
                <title>${text.querySelector("input[name='Title']").value}</title>`;
            const paragraphs = text.querySelectorAll("textarea");
            paragraphs.forEach((para, index) => {
                const paragraph = xml.createElement("paragraph");
                paragraph.innerHTML = para.value;
                textElement.appendChild(paragraph);
            });
            musicRelated.appendChild(textElement);
        });
        orph.appendChild(musicRelated);

        // historic texts
        const historicTexts = document.querySelectorAll("#historic .form-container");
        historicTexts.forEach(text => {
            const textElement = xml.createElement("text");
            textElement.innerHTML = `
                <author>${text.querySelector("input[name='Author']").value}</author>
                <authorGND>${text.querySelector("input[name='GND']").value}</authorGND>
                <title>${text.querySelector("input[name='Title']").value}</title>`;
            const paragraphs = text.querySelectorAll("textarea");
            paragraphs.forEach((para, index) => {
                const paragraph = xml.createElement("paragraph");
                paragraph.innerHTML = para.value;
                textElement.appendChild(paragraph);
            });
            historic.appendChild(textElement);
        });
        orph.appendChild(historic);

        // preliminary solution for file name creation
        const sOpera = "Holländer";
        const sComposer = "Wagner";
        const sPlace = "Düsseldorf";
        const sYear = "2000";

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
    
    // Get form data from repository
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