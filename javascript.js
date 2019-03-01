// Deine eigenen Javascript Funktionen //

var test = '{"nodes": [{"name" : "A", "domain" : [0,1,2],"cx" : 200,"cy" : 150}, {"name" : "B", "domain" : [0,1,2],"cx" : 100,"cy" : 350}, {"name" : "C", "domain" : [0,1,2],"cx" : 300,"cy" : 350}],"edges":[{"src" : "A", "dest":"B", "constraint":">"}, {"src" : "B", "dest":"C", "constraint":">"}]}';

var primary_color = "#536dfe";
var main_font_color = "rgba(30, 30, 30, 1)";

var currentPosition = 0;
var currentLine = 0;
var prevLine = 0;
var domains = {};

var showEndOfAnimationNotification = true;

var last_selected_node = "A";

var focused_edge = null;
var last_focused_edge = null;

var node_radius = 40;
var node_radius_focused = 60;

// Tutorial //

var greenExplain = 0;
var redExplain = 0;

// Ende Tutorial //

//// ---------------- INIT D3 ----------------


// Funktionen fuer D3
function create_canvas(id) { // Erstellen einer SVG ( Canvas )
    var canvas = d3.select(id) // waehle div content aus
        .append("svg") // erstelle svg in dem div
        .attr("width", "100%") // mit breite und hoehe 500
        .attr("height", "470px")
        .call(d3.zoom().on("zoom", function() {
            canvas.attr("transform", d3.event.transform)
        }))
        .append("g")
        .attr("id", "graph_canvas")
    // mit attr koennen natuerlich alle moeglichen D3 Dinge gemaht werden
    return canvas;
}

// Lese ale Kanten aus dem JSON Objekt und Zeichne diese //
function create_connections(canvas) {

    var ret_connections = new Array;

    var from, to, id, curEdge;
    // Gehe alle Kanten ab und hole jeweils den Start (from) und Zielknoten (to)
    for (var i = 0; i < editGraph.edges.length; i++) {

        curEdge = editGraph.edges[i]
        from = curEdge.src;
        to = curEdge.dest;
        id = from.name + "_" + to.name;

        // Zeichne die Linien zwischen den Knoten
        // Wir muessen immer die Knoten nach Namen aufloesen, dies geschieht mit
        // der Funktion get_node_by_name um an die x und y Werte zu gelangen.

        var newLine = canvas.append("path")
            // Start der Linie
            .attr("d", function(d){
            return "M " + from.cx + " " + from.cy + "\n L " + to.cx + " " + to.cy;
            })
            .attr("class", "graph_edge")
            .attr("id", from.name + "_" + to.name);
        if (curEdge.show){
            write_constraint_on_edge(curEdge, id);
        }

        ret_connections.push(newLine);
    }

    return ret_connections;

}

function write_constraint_on_edge(edgeData, id){
    canvas
    .append("text")
    .attr("y", -8)
    .attr("x",-12)
    .append("textPath")
    .attr("xlink:href", "#" + id)
    .attr("text-anchor", "center")
    .attr("startOffset", "50%")
    .attr("class", "constraint-condition")
    .text(edgeData.constraint);
}

function create_nodes(canvas) {
    var ret_nodes = new Array;

    for (var i = 0; i < editGraph.nodes.length; i++) {
        ret_nodes.push(canvas.append("circle") // an die Canvas / SVG anfuegen
            .attr("cx", editGraph.nodes[i].cx) // abstand nach links ( relativ in svg )
            .attr("cy", editGraph.nodes[i].cy) // abstand nach oben ( relativ in svg )
            .attr("r", 40) // Radius
            .attr("stroke-width", 10) // Border / Rahmen um den Kreis
            .attr("stroke", "#536dfe") // Farbe des Rahmen
            .attr("fill", "#512da8")
            .attr('id', function() {
                return editGraph.nodes[i].name + "_node"
            })); // Fuellfarbe des Kreies);
        canvas.append("text")
            .attr("x", editGraph.nodes[i].cx)
            .attr("y", editGraph.nodes[i].cy - 50)
            .attr("class", "node_domain")
            .attr('text-anchor', 'middle')
            .attr('id', function() {
                return editGraph.nodes[i].name + "_domain"
            })
            .text('{' + graphHistory[currentPosition].nodes[i].domain + '}');
        canvas.append("text")
            .attr("x", editGraph.nodes[i].cx)
            .attr("y", editGraph.nodes[i].cy + 5)
            .attr("class", "node_label")
            .attr('text-anchor', 'middle')
            .style('fill', 'white')
            .text(editGraph.nodes[i].name)
            .attr('id', function() {
                return editGraph.nodes[i].name + "_nodeName"
            });
    }

    return ret_nodes;
}

//// ---------------- INIT D3 END ----------------


//// ---------------- STEPPING FUNCS ----------------

function focus_edge_in_graph(lines) {
    focused_edge = lines[0];
    if (last_focused_edge != null) {
        document.getElementById(last_focused_edge.src.name + "_" + last_focused_edge.dest.name).classList.remove("focus_edge");
        document.getElementById(last_focused_edge.dest.name + "_" + last_focused_edge.src.name).classList.remove("focus_edge");
    }
    last_focused_edge = focused_edge;
    var id = focused_edge.src + "_" + focused_edge.dest;
    document.getElementById(focused_edge.src.name + "_" + focused_edge.dest.name).classList.add("focus_edge");
    document.getElementById(focused_edge.dest.name + "_" + focused_edge.src.name).classList.add("focus_edge");
}
// Funktion um zu der naechsten Zeile zu wechseln
// Bisher nur einfach Implementierung.
function next_line(check) {
    //// Markierung der naechsten richtigen Codezeile ////
    var elems = document.querySelectorAll(".line-of-code");

    // Wenn check true, dann gehen wir einen Schritt weiter //
    if (check) {

        // Ende der Daten / der Animation //
        if (graphHistory.length <= currentPosition + 1) {
            // Hier muessen wir die Animation beenden, dies geht leider nicht
            // mit der toggle Funktion, da diese uns dann wieder an den Anfang
            // bringen wuerde.
            clearInterval(next_line_intervall);
            next_line_intervall = null;
            set_play_button_to("replay");
            if (showEndOfAnimationNotification) {
                notify_send("Ende der Animation erreicht.", "notify");
                showEndOfAnimationNotification = false;
            }
            // document.getElementById('next-button').disabled = true;
            show_removed_items();
            return;
        }

        prevLine = currentLine;
        update_all_domains(currentPosition);
        highlight_current_domains();
        currentPosition++;
        currentLine = graphHistory[currentPosition].lineNum; // else { // zurueck

        // Stelle alten Hintergrund der Zeile wieder her.
        if (prevLine % 2) {
            elems.item(prevLine).style.background = "white";
            elems.item(prevLine).style.color = main_font_color;
        } else {
            elems.item(prevLine).style.background = "rgba(230, 230, 230, 0.5)";
            elems.item(prevLine).style.color = main_font_color;
        }

        // Faerbe die aktuelle Zeile ein
        elems.item(currentLine).style.background = "#536dfe";
        elems.item(currentLine).style.color = "white";

        // select a random node | just for testing //
        // focus_node("A");

        // Zeige queue wenn wir Zeile 3 erreicht haben //
        if (currentPosition == 2) {
            document.getElementById('table_rows').innerHTML = " ";
        }
        if (currentPosition >= 2) {
            add_lines_to_table(focusHistory[currentPosition - 1].table_add);
            if (focusHistory[currentPosition].table_remove[0]  != null)
            {
              console.log("hier")
            }
            remove_lines_from_table(focusHistory[currentPosition].table_remove);
        }

    } else {
        // Zurueck
        if (currentPosition == 0)
            return; // // TODO: Info an Nutzer dass Ende erreicht

        // Da nicht die effizienteste Moeglichkeit, bitte in Zukuft
        // andere Loesung ausdenken.
        set_play_button_to("play");

        prevLine = currentLine;
        update_all_domains(currentPosition);
        currentPosition--;
        currentLine = graphHistory[currentPosition].lineNum;

        // Stelle alten Hintergrund der Zeile wieder her.
        if (prevLine % 2) {
            elems.item(prevLine).style.background = "white";
            elems.item(prevLine).style.color = main_font_color;
        } else {
            elems.item(prevLine).style.background = "rgba(230, 230, 230, 0.5)";
            elems.item(prevLine).style.color = main_font_color;
        }

        // Faerbe die aktuelle Zeile ein
        elems.item(currentLine).style.background = "#536dfe";
        elems.item(currentLine).style.color = "white";

        // select a random node | just for testing //
        focus_node("B");

        if (currentPosition > 2) {
            add_lines_to_table(focusHistory[currentPosition].table_add);


        } else {
            // Leere Tabelle, wenn wir unter Zeile 3 sind //
            document.getElementById('table_rows').innerHTML = " ";
        }

    }

    //// Ende Markierung der naechsten richtigen Codezeile ////

    //// Aendere die Werte in der Statusbar ////
    document.getElementById('steps').innerHTML = currentPosition.toString();
    document.getElementById('steps-to-do').innerHTML = graphHistory.length.toString() - 1;
    //// Ende aendere die Werte in der Statusbar ////



}

//// Automatische Animation ////
// Variable, in welcher das Intervallobjekt gespeichert wird
var next_line_intervall = null;
// Schrittgeschwindigkeit in Millisekunden
var animation_speed = 300;


function toggle_animation() {
    showEndOfAnimationNotification = true; // Freigeben der
    // Wenn wir am Ende der Animation sind, dann starten wir wieder von vorne
    if (graphHistory.length <= currentPosition + 1) {
        currentPosition = 0;
    }
    // Wenn keine Animation laeuft, dann starten wir eine neue
    if (!next_line_intervall) {
        next_line_intervall = setInterval(function() {
            set_play_button_to("pause");
            next_line(true);
        }, animation_speed);
    } else {
        // Breche die Animation ab, wenn eine Animation laeuft
        clearInterval(next_line_intervall);
        // Fuer die If - Abfrage, damit man nachschauen kann, ob
        // der Intervall abgebrochen wurde.
        next_line_intervall = null;
        set_play_button_to("play");
    }
}

// Funktion um das Icon von der Play - Taste zu aendern
function set_play_button_to(setting) {
    switch (setting) {
        case "play":
            document.getElementById('play_button').src = "./data/icon/play.png";
            break;
        case "pause":
            document.getElementById('play_button').src = "./data/icon/pause.png";
            break;
        case "replay":
            document.getElementById('play_button').src = "./data/icon/replay.png";
            break;
        default:
            console.log("Unbekannter Wert an set_play_button_to uebergeben");
    }
}

function reset_animation() {
    currentPosition = 0;
}

function get_domain_in_graph(nodeName) {
    return document.getElementById(nodeName + "_domain");
}

function highlight_current_domains() {
    if (currentPosition == 0) return;
    for (var i = 0; i < focusHistory[currentPosition + 1]["highlight"].length; i++) {
        if (focusHistory[currentPosition + 1]["highlight"][i] == null) {
            return;
        }
        var nodeName = focusHistory[currentPosition + 1]["highlight"][i][0];
        var isRed = focusHistory[currentPosition + 1]["highlight"][i][1];
        var elemToHighlight = focusHistory[currentPosition + 1]["highlight"][i][2];
//Focus-History falsch?

        var textElement = get_domain_in_graph(nodeName);
        var curDomain = textElement.innerHTML;
        if (isRed) {
            if (redExplain == 2) {
                show_infobox(document.getElementById('D_domain'), "left", "Wiedersprüchliche Bed. (rot)");
            } redExplain++;
            textElement.innerHTML = curDomain.replace(elemToHighlight, "<tspan style='fill:var(--secundary-color)'>" + elemToHighlight + "</tspan>");
        } else {
            if (greenExplain == 0) {
                show_infobox(document.getElementById('E_domain'), "left", "Erfüellte Bedingung (grün)");
            } greenExplain++;
            textElement.innerHTML = curDomain.replace(elemToHighlight, "<tspan style='fill:var(--green-accent-dark)'>" + elemToHighlight + "</tspan>");
        }
    }
}
//// Ende Automatische Animation ////

//// ---------------- STEPPING FUNCS END ----------------

//// ---------------- UTIL ----------------

// Updates the Text-Element representing the domain of the variables
function update_all_domains(curPosition) {
    update_all_domains_in_graph(curPosition);
    update_domains_in_table(graphHistory[curPosition]);
}

function update_all_domains_in_graph(curPosition) {
    var nodes = graphHistory[curPosition].nodes;
    for (var i = 0; i < nodes.length; i++) {
        update_domain([nodes[i].name], nodes[i].domain);
    }
}

// Helper function for update_all_domains
function update_domain(nodeName, newDomain) {
    document.getElementById(nodeName + "_domain").innerHTML ='{' + newDomain + '}';
}

function show_removed_items(){
    for (var i = 0; i < editGraph.nodes.length; i++){
        var removedDomain = removedVals[editGraph.nodes[i].name];
        var elem = document.getElementById(editGraph.nodes[i].name + "_domain");
        if (!elem.innerHTML.includes("style")){
        elem.innerHTML = elem.innerHTML + "<tspan style='fill:var(--secundary-color)'> { " + removedDomain + " } </tspan>";
    }else {
        return;
    }}
}
// Just for testing //
function focus_node(id) {
    // Vorherigen gefocusten Radius normalisieren //
    d3.select("#" + last_selected_node + "_node").transition().attr("r", node_radius);
    d3.select("#" + last_selected_node + "_domain").transition().attr("y", d3.select("#" + last_selected_node + "_node").attr("cy") - 50);

    // Neuen Knoten und Domain focusieren //
    d3.select("#" + id + "_node").transition().attr("r", node_radius_focused);
    d3.select("#" + id + "_domain").transition().attr("y", d3.select("#" + id + "_node").attr("cy") - 70);
    last_selected_node = id; // Speichere den zuletzt geaenderten Knoten
}

function get_node_by_name(name) {
    var nodes = editGraph.nodes;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].name == name) {
            return nodes[i];
        }
    }
    return null;
}


//// ---------------- UTIL END ----------------
