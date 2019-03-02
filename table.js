function add_lines_to_table(lines) {

    var parent = document.getElementById("table_rows");

    var src, dest, dSrc, dDest, con = null;
    var i = 0;
    while (lines[i] != null) {

        src = lines[i].src.name;
        dest = lines[i].dest.name;
        dSrc = lines[i].src.domain;
        dDest = lines[i].dest.domain;
        con = lines[i].constraint;

        var table_row = document.createElement("div");
        table_row.className += "table_row";
        table_row.id = src + "_" + dest + '_table_line';

        var x = '<div class="table_cell" id="' + 'cell_' + src + '">' + src + ' {' + dSrc + '}' + '</div>';
        table_row.innerHTML =  '<div class="table_cell  cell_' + src + '">' + src + ' {' + dSrc + '}' + '</div>';
        table_row.innerHTML += '<div class="table_cell">' + con + '</div>';
        table_row.innerHTML += '<div class="table_cell cell_'  + dest + `">` + dest + ' {' + dDest + '}' + `</div>`;

        parent.appendChild(table_row);

        i++;
    }
}



// Entfernt die übergebene Kante aus der Tabelle
function remove_lines_from_table(lines) {

    if (showInfoBox && currentPosition > 3) show_queue_infobox();

    var i = 0;
    while (lines[i] != null) {
        focus_edge_in_graph(lines);

        var src = lines[i].src.name;
        var dest = lines[i].dest.name;
        var id = src + '_' + dest + '_table_line';

        remove_pervious_curent_edge(id);
        document.getElementById(id).classList.add("first_table_row");
        document.getElementById(id).classList.remove("table_row");

        var divs = document.getElementsByClassName('table_row');
        for (var j = 0; j < divs.length; j++) {
            divs[j].style.animationDuration="0s";
        }
        setTimeout(function() {
            divs = document.getElementsByClassName('table_row');
            for (var k = 0; k < divs.length; k++) {
                divs[k].style.animationDuration="1s";
            }
        }, 1000)

        i++;
    }
}
function remove_pervious_curent_edge(id){
  var parent = document.getElementById('table_rows');
  if (document.getElementsByClassName('first_table_row')[0] != null){
    parent.removeChild(document.getElementsByClassName('first_table_row')[0]);
  }
}

function update_domains_in_table(curGraph) {
    for (var i = 0; i < curGraph.nodes.length; i++) {
        //var svg_text = canvas.select("#"+nodeName+"_domain").text('{'+newDomain+'}');
        var curNode = curGraph.nodes[i];
        var curDomain = curNode.domain;
        var divs = document.getElementsByClassName("cell_" + curNode.name);
        for (var j = 0; j < divs.length; j++) {
            divs[j].innerHTML=curNode.name+  ' {'+curDomain+'}';
        }
    }
}
