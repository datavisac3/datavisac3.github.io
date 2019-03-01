var greGraph, editGraph;
var graphHistory = new Array; // Die Entwicklung des Graphen während der Algorithmusausführung
var queueHistory = new Array; // Die Entwicklung der Queue parallel zu graphHistory
var focusHistory = new Array; // Datenstruktur enthält welche Elemente im Graphen fokusiert werden => null === keinen Sinn, einen String falls etwas besonders notwendig sein sollte, ansonsten src,dest,edge
var removedVals = {}; // Datenstruktur die entfernte Werte für eine finale Gegenüberstellung von original und veränderten Graph enthält
var focusHistoryTemp = null;
var queue = null;

// ############## AC3 ###############
function ac3(graph) {
    preGraph = JSON.parse(graph);
    editGraph = JSON.parse(graph);
    prepare_graphs();

    queue = create_array_from_edges(editGraph.edges);

    // [PSEUDO] Funktionausruf
    add_to_history(0);

    // [PSEUDO] Queue
    add_to_history(1);

    for (var i = 0; i < queue.length; i++) {
        add_queue_element_to_focus_history(queue[i]);
    }
    // [PSEUDO] While
    add_to_history(2);
    while (queue.length > 0) {

        // [PSEUDO] Kante aus Queue popen
        add_to_history(3);
        var currentEdge = queue.splice(0,1).pop();
        add_remove_queue_element_to_focus_history(currentEdge);
        // [PSEUDO] Funktionsaufruf von entferneInkonsistenteWerte()
        add_to_history(4);
        if (remove_inconsistent_values(currentEdge)) {
            add_to_history(5); // [PSEUDO] Iteration Nachbarn
            add_neighbours_to_queue(currentEdge.src);
            add_queue_element_to_focus_history()
            add_to_history(6); // [PSEUDO] Nachbarn2Queue

        }
    }
    console.log("FINISHED with: ");
    for (var x = 0; x < editGraph.nodes.length; x++) {
        console.log(x + " : " + editGraph.nodes[x].domain)
    }
}
// ############## END AC3 ###############

///////// entferneInkonsistenteWerte /////////
function remove_inconsistent_values(currentEdge) {
    // [PSEUDO] Funktionsaufruf
    add_to_history(8);
    // [PSEUDO] remove = false
    add_to_history(9);
    var removed = false;
    var srcNode = currentEdge.src;
    var destNode = currentEdge.dest;
    var supported = false; //Is a value x supported in y

    var valX = -1;
    var valY = -1;
    var cons = null;

    // [PSEUDO] forEach DomainX
    add_to_history(10);
    //TODO: Abweichung zum Pseudocode => entweder hier umschreiben oder Pseudocode anpassen
    for (var x = 0; x < srcNode.domain.length; x++) { // Wir checken für jeden Wert in src ob es in dest einen Wert gibt, der diesen stützt
        cons = currentEdge.constraint;
        valX = srcNode.domain[x];
        supported = false;
        add_highlight_domain_to_focus_history(srcNode.name, true, valX);
        add_to_history(11); // Hier mglw. Überflüssig?
        for (var y = 0; y < destNode.domain.length; y++) {
            valY = destNode.domain[y];
            if (checkIfConsistent(valX, valY, currentEdge.constraint)) { // x wird durch y gestützt
                add_highlight_domain_to_focus_history(srcNode.name, false, valX);
                add_highlight_domain_to_focus_history(destNode.name, false, valY);
                add_to_history(11); // Domain-Vergleichen
                supported = true; //Falls wir einen Wert finden der x stützt => x ist safe also nächsten Wert auschecken
                break;
            }
            add_highlight_domain_to_focus_history(srcNode.name, true, valX);
            add_highlight_domain_to_focus_history(destNode.name, true, valY);
            add_to_history(11); // Domain-Vergleichen
        }
        if (!supported) {
            add_to_history(12);
            console.log("removing " + srcNode.domain[x] + " from " + srcNode.domain);
            remove_value_from_domain(srcNode, srcNode.domain[x]);
            add_to_history(13);
            x--;
            removed = true;
        }

    }
    add_to_history(14);
    return removed;
}
///////// History /////////
function add_to_history(lineNum) {

// Erstellt neues FocusHistoryTemp-Element und initilalisiert arrays mit null
    if (focusHistoryTemp == null) {
        focusHistoryTemp = create_focus_history_object();
    }

    focusHistoryTemp["highlight"].push(null);
    focusHistoryTemp["unused"].push(null);
    focusHistoryTemp["table_add"].push(null);
    focusHistoryTemp["table_remove"].push(null);

    graphHistory.push(create_display_object_from_graph(lineNum, true));
    queueHistory.push(create_display_object_from_graph(null, false));

    // Fuegt focusHistoryTemp zu der focusHistory hinzu //
    focusHistory.push(create_display_object_from_graph(143, false));
    // TODO: Kommentar adden
    // var focusLen = focusHistory.table_add.length-1;
    // focusHistroy[focusLen].table_add.reverse();
    focusHistoryTemp = null;
}
///// Fucus history /////
// Erstellt ein neues FocusHistory Element //
function create_focus_history_object() {
    return { "highlight": [], "unused":[], "table_add":[], "table_remove":[] };
}
// Feugt eine Kante der Queue in die focusHistoryTemp ein
function add_highlight_domain_to_focus_history(node, isRed, elemToHighlight){
    if (focusHistoryTemp == null) {
        focusHistoryTemp = create_focus_history_object();
    }
    focusHistoryTemp["highlight"].push([node, isRed, elemToHighlight]);
}

function add_queue_element_to_focus_history(elemToAdd) {
    if (focusHistoryTemp == null) {
        focusHistoryTemp = create_focus_history_object();
    }
    focusHistoryTemp["table_add"].push(elemToAdd);
}

function add_remove_queue_element_to_focus_history(elementToRemove){
    if (focusHistoryTemp == null) {
        focusHistoryTemp = create_focus_history_object();
    }
    focusHistoryTemp["table_remove"].push(elementToRemove);
}
//// ENDE Focus History ////
//// Allgemein History ////
function create_display_object_from_graph(num, isGraph) {
    if (isGraph) {
        editGraph.lineNum = num;
        return JSON.parse(JSON.stringify(editGraph));
    } else {
        if (num != null) { // Fuege focus zur history hinzu
            return JSON.parse(JSON.stringify(focusHistoryTemp));
        }
        return JSON.parse(JSON.stringify(queue))
    }
}
///////// ENDE History ////////
///////// GRAPH Preperaton /////////
function prepare_graphs() {
    change_name_to_reference(editGraph);
    change_name_to_reference(preGraph);
    for (var i = 0; i < editGraph.nodes.length; i++){
        removedVals[editGraph.nodes[i].name] = [];
    }
}

function change_name_to_reference(graph) {
    graph.edges = add_directed_edges(graph).reverse();
    for (var i = 0; i < graph.edges.length; i++) {
        graph.edges[i].src = get_node_by_name(graph.edges[i].src);
        graph.edges[i].dest = get_node_by_name(graph.edges[i].dest)
    }
}

function set_graphs(graphString) {
    preGraph = JSON.parse(graphString);
    editGraph = JSON.parse(graphString)
}

function remove_value_from_domain(node, val) {
    var domain = node.domain;
    val = Number(val);
    var index = -1;
    for (var i = 0; i < domain.length; i++) {
        if (domain[i] === val) {
            index = i;
            break;
        }
    }
    removedVals[node.name].push(val);
    domain.splice(index, 1);
}

function checkIfConsistent(x, y, constraint) {
    switch (constraint) {
        case "<":
            return x < y;
        case ">":
            return x > y;
        case "=":
            return x === y;
        case "!=":
            return x !== y;
        case ">=":
            return x >= y;
        case "<=":
            return x <= y;
        default:
            return null;
    }

}

function add_neighbours_to_queue(name) {
    var edges = editGraph.edges;
    var tmp;
    for (var i = 0; i < edges.length; i++) {
        tmp = edges;
        if (edges[i].dest == name && not_already_in_queue(edges[i])) {
            queue.splice(0,0,edges[i]);
            add_queue_element_to_focus_history(edges[i]);
        }
    }
    return queue;
}

function not_already_in_queue(edge){
    for (var i = 0; i < queue.length; i++){
        if (queue[i] === edge){
            return false
        }
    }
    return true
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

function reverse_condition(condition) {
    switch (condition) {
        case "<":
            return ">";
        case ">":
            return "<";
        case "=":
            return "=";
        case "!=":
            return "!="
        case ">=":
            return "<=";
        case "<=":
            return ">=";
        default:
            return null;
    }
}

function add_directed_edges(graph) {
    var e = graph.edges;
    var edges = new Array;
    for (var i = 0; i < e.length; i++) {
        e[i].show = true;
        edges.push(e[i]);
        edges.push(get_swaped_edge(e[i]));
    }
    return edges;
}

function get_swaped_edge(edge) {
    return {
        src: edge.dest,
        dest: edge.src,
        constraint: reverse_condition(edge.constraint),
        show: false
    };
}

function create_array_from_edges(edges) {
    var arr = new Array;
    for (var i = 0; i < edges.length; i++) {
        arr.push(edges[i]);
    }
    return arr;
}

//// End Graph preparation ////
