//// Variablen ////

var currentScrollPosition = 0;

var currentScrollSection;

var finishedScrolling = true;

var scrollIntervall;

// In Funktion set_scroll_status verwendet.
// Um aus dem "eingerasteten" Zustand der Visualisierung zu entkommen.
var enableSnappingOnVisualization = false;
// Infobox //
var showInfoBox = true;

var paused_because_info = false;

var notificationCounter = 0; // Zum erstellen der ID's
var notificationArray = new Array; // Alle gespeicherten Notifiaction_ID's
var timers = new Array; // Notification Timers, uenableSnappingOnVisualizationm sie wieder zu loeschen

// Startup //
// Alles was am Anfang ausgefuerht werden muss, NACHDEM alles geladen hat.
window.onload = function() {
    go_to_section("landing");
    currentScrollSection = 0;
}
// ENDE Startup //


function say_something() {
    // Aufruf bei Klicken auf die menuleiste
    // show_infobox(document.getElementById('A_domain'), "right");
    // show_infobox(document.getElementById('A_domain'), "left");
}

//// Notifications ////
function notify_send(notificationContent, src) {
    // notify_send("Text", "Icon")
    var notifyContaioner = document.getElementById("notifications");
    // Erstellen der notification //
    var div = document.createElement("div");
    div.classList.add("notification");
    // Fuege Bild und Text hinzu //
    div.innerHTML = "<img src='./data/icon/" + src + ".png' height='24' width='24'><div>" + notificationContent + "</div>";
    notificationArray.push(div); // Fuege Notification zu einer Liste hinzu, damit man sie ieder loeschen kann.
    notifyContaioner.appendChild(div);
    timers.push( setTimeout(function() {
        // Loesche Notification nach 5 Sekunden
        notificationArray.shift().style.display = "none";
    }, 5000) );
    return true;
}

//// Alles ums Scrollen ////

// Kopfzeile verstecken / anzeigen //
function show_headline() {
    document.getElementById("headline").style.top = "0px";
    document.getElementById("headline").style.boxShadow = "0 8px 6px -6px #999";
}

function hide_headline() {
    document.getElementById("headline").style.top = "-52px";
    document.getElementById("headline").style.boxShadow = "none";
}

// Scroll Positionen //
function get_scroll_position() {
    // Absoluter Scrollbetrag
    return (window.scrollY || window.scrollTop || document.getElementsByTagName("html")[0].scrollTop);
}

function get_section_position(section) {
    // Gibt die absolute Position einer Section zurueck.
    // Dies entspricht dann immer der oberen Kante einer Sektion.
    var pos = document.getElementsByClassName(section)[0].getBoundingClientRect();
    return pos.top + 0 + (window.pageYOffset || document.documentElement.scrollTop);
}

function section_height() {
    var hgt = document.getElementById("first-section").clientHeight;
    return hgt;
}

function highlight_button_in_nav(id) {
    // id ist in diesem Fall das n-te Element!
    var headlineButtons = document.getElementsByClassName('headline-button');
    // Verhindere, dass andere Bottons markiert.
    for (var i = 0; i < headlineButtons.length; i++) {
        headlineButtons[i].style.borderBottomColor = "transparent";
    }
    headlineButtons[id].style.borderBottomColor = "white";
}

function check_if_section_is_in_view(section, marginTop, marginBottom) {
    // Ueberprueft, ob eine Section angezeigt ( also auf dem Bildschirm sichtbar ) ist.
    // Da es allerdings sehr schwierig ist, so genau zu scrollen, gibt es eine
    // Art Margin, welche bestimmt, ab wann wirklich die naechste Seite angezeigt wird.
    // |-----------------------------------|
    // |            marginTop              | <- Unter Umstaenden nicht auf dem Bildschirm
    // |===================================|
    // |                                   |
    // |                                   |
    // |                                   |
    // |            Section                | <- Section ist in view
    // |                                   |
    // |                                   |
    // |                                   |
    // |===================================|
    // |          marginBottom             | <- Unter Umstaenden nicht auf dem Bildschirm
    // |-----------------------------------|

    var scroll_position = get_scroll_position();
    return (scroll_position > get_section_position(section) + marginTop && scroll_position < get_section_position(section) + marginBottom);

}

function set_scroll_status() {
    // Hier wird entschieden, welcher Button unterstrichen wird ( also,
    // in welcher Sektion wir uns befinden ) und die Leiste ausgeblendet,
    // wenn dies notwendig ist.
    var scroll_position = get_scroll_position(); // Wie weit wir bereits gescrollt haben
    // Hier werden jetzt die einzelnen Seiten abgefragt.
    // Bitte Funktionsdefinition von check_if_section_is_in_view() beachten!
    if (scroll_position == 0) {
        console.log("landing");
        currentScrollPosition = 0;
        document.getElementById("headline").style.boxShadow = "none";
        highlight_button_in_nav(0);
        // hide_headline();
    } else if (check_if_section_is_in_view("overview-section", -100, 100)) {
        console.log("overview");
        currentScrollPosition = 1;
        highlight_button_in_nav(1);
        show_headline();
    } else if (check_if_section_is_in_view("algotithmus-section", -100, section_height() - 200)) {
        console.log("Algorithmus");
        currentScrollPosition = 2;
        highlight_button_in_nav(2);
        show_headline();
        // Freisetzen der Steuerungselemente //
        document.getElementById('controls').style.position = "absolute";
        enableSnappingOnVisualization = false;
    } else if (check_if_section_is_in_view("visualization-section", -150, 100)) {
        console.log("visualization");
        currentScrollPosition = 3;
        highlight_button_in_nav(3);
        hide_headline();
        // Festsetzten der Steuerungselementen //
        document.getElementById('controls').style.position = "fixed";
        // Snappen auf Visualisierung, wenn diese in Sciht kommt //
        if(!enableSnappingOnVisualization) {
            // Passe an Visualisierung an, wenn diese in der view ist
            go_to_section('visualization');
            // Um wieder aus der Visualisierung raus zu kommen,
            // muessen wir eine Flag setzten / die "Snapp"-Funktion deaktivieren.
            enableSnappingOnVisualization = true;
        }
    } else if (check_if_section_is_in_view("hintergrund-section", -section_height() + 50, 100)) {
        console.log("Hintergrund");
        currentScrollPosition = 4;
        highlight_button_in_nav(4);
        show_headline();
        // Freisetzen der Steuerungselemente //
        document.getElementById('controls').style.position = "absolute";
        // Aktiviere das Snapping auf Visualisierung
        enableSnappingOnVisualization = false;
    }
}

window.onscroll = function(e) {
    // Wird immer aufgerufen, wenn auf der Seite gescrollt wird //
    // Anzeige der Headline und der aktuellen Position auf der Seite //
    set_scroll_status();
}

function get_scroll_section(code) {
    // Gibt den Namen zur n-ten Sektion zurueck //
    switch (code) {
        case 0:
            return "landing";
            break;
        case 1:
            return "overview";
        case 2:
            return "algotithmus";
        case 3:
            return "visualization";
        case 4:
            return "hintergrund";
            break;
        default:

    }
}

function go_to_section(dest) {
    finishedScrolling == false;
    // Gehe zur uebergebenen Section //
    switch (dest) {
        case "landing":
            document.getElementsByClassName("section")[0].scrollIntoView({
                behavior: 'smooth' // Scrolle mit Animation ( neues Feature in JS )
            });
            highlight_button_in_nav(0); // Erstellt den weißen unteren Rand, bei den Buttons
            break;

        case "overview":
            document.getElementsByClassName("section")[1].scrollIntoView({
                behavior: 'smooth'
            });
            document.getElementById("headline").style.top = 0 + "px";
            break;

        case "algorithmus":
            document.getElementsByClassName("section")[2].scrollIntoView({
                behavior: 'smooth'
            });
            break;

        case "visualization":
            document.getElementsByClassName("section")[3].scrollIntoView({
                behavior: 'smooth'
            });
            break;
        case "hintergrund":
            document.getElementsByClassName("section")[4].scrollIntoView({
                behavior: 'smooth'
            });
            break;
        default:
    }
    window.setTimeout(function() {
        finishedScrolling = true;
    }, 1000);
}

function go_to_section_code(dest) {
    // Scrolle direkt zur n-ten Sektion //
    document.getElementsByClassName("section")[dest].scrollIntoView({
        behavior: 'smooth'
    });
    currentScrollPosition++;
}



// Anzeigen //
function show_queue_infobox() {
    var pos = document.getElementById('init-graph').getBoundingClientRect();
    document.getElementById('queue-info').style.top = pos.top + 0 + (window.pageYOffset || document.documentElement.scrollTop) + "px";
    document.getElementById('queue-info').style.left = pos.left + 10 + "px";
    document.getElementById('queue-info').style.display = "inline";
    document.getElementById('queue-info').
    addEventListener("click", function() {
        close_queue_infobox(document.getElementById('queue-info'));
    });
}

function show_infobox(appendTo, dir, text) {
    if (next_line_intervall) {
        toggle_animation();
        paused_because_info = true;
    }
    if(dir == "left") {
        var div = document.createElement("div");
        div.classList.add("small-infobox-left");
        div.classList.add("info-box");
        div.style.background = "var(--primary-color)";
        div.style.color = "white";
        div.innerHTML = text + " <button class='outlined-button'>Verstanden</button";

        var pos = appendTo.getBoundingClientRect();
        div.style.top = pos.top - 10 + (window.pageYOffset || document.documentElement.scrollTop) + "px";
        div.style.left = (pos.left - 380) + "px";
        div.style.display = "inline";
        div.
        addEventListener("click", function() {
            if (paused_because_info) {
                toggle_animation();
            }
            close_queue_infobox(div);
        });
        document.body.appendChild(div);
    } else {
        var div = document.createElement("div");
        div.classList.add("small-infobox");
        div.classList.add("info-box");
        div.style.background = "var(--primary-color)";
        div.style.color = "white";
        div.innerHTML = text + " <button class='outlined-button'>Verstanden</button";

        var pos = appendTo.getBoundingClientRect();
        console.log("Pos.left: " + pos.left);
        div.style.top = pos.top + 0 + (window.pageYOffset || document.documentElement.scrollTop) + "px";
        div.style.left = pos.right + "px";
        div.style.display = "inline";
        div.
        addEventListener("click", function() {
            close_queue_infobox(div);
        });
        document.body.appendChild(div);
    }
}

function close_queue_infobox(elem) {
    elem.style.display = "none";
    showInfoBox = false;
}
// ENDE Anzeigen //
function reset_ac3() {

    elemsToReset = ["graph", "init-graph", "table_rows"];
    for (var i = 0; i < elemsToReset.length; i++) {
        document.getElementById(elemsToReset[i]).innerHTML = "";
    }
    graphHistory = new Array; // Die Entwicklung des Graphen während der Algorithmusausführung
    queueHistory = new Array; // Die Entwicklung der Queue parallel zu graphHistory
    focusHistory = new Array; // Datenstruktur enthält welche Elemente im Graphen fokusiert werden => null === keinen Sinn, einen String falls etwas besonders notwendig sein sollte, ansonsten src,dest,edge
    focusHistoryTemp = null;
    queue = null;
    currentPosition = 0;
    last_focused_edge = null;
}

function run_other_example(exampleNumber) {
    var examples = {1:g1,2:g2,3:g3,4:g4}
    reset_ac3();
    ac3(examples[exampleNumber]);

    var canvas = create_canvas("#graph"); // Erstellt canvas / svg im Div 'content'
    var all_connections = create_connections(canvas);

    var all_nodes = create_nodes(canvas);

    // Erstelle den Initialen Graphen //
    var init_canvas = create_canvas("#init-graph");
    var all_connections_init = create_connections(init_canvas);
    var all_nodes_init = create_nodes(init_canvas);

}
