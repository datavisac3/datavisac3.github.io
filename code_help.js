function what_line(line_nm){
	var line_nm = parseInt(line_nm,10);
	var main_pic = document.getElementById('pic_gif');
	var sec_pic = document.getElementById('explain_pic');
	if(line_nm<8){
		
		if (line_nm==2){
			
			main_pic.style.display = 'inline';
			sec_pic.style.display = 'none';
			main_pic.src = './data/helpZ2.png';
			document.getElementById('test').innerHTML = 'Alle Kanten des Graphen werden der Queue dt. Warteschlange hinzugefügt.' +
					' Die Kanten tragen Informationen über die Knotenverbindung, sowie die Bedingungen,' + 
					' welche im späteren Verlauf abgerufen werden, und von den Domains eingehalten werden müssen.';
			document.getElementById("htest").innerHTML = ' ';
		}
		if (line_nm==3){
			main_pic.style.display = 'none';
			sec_pic.style.display = 'inline';
			sec_pic.src = './data/while2.gif';
			document.getElementById("test").innerHTML = 'Solange die Warteschlange/Queue Kanten zur Überprüfung enthält, also NICHT leer ist, wird die While-Schleife (Zeile 4 bis 7) aufgerufen.';
			document.getElementById('htest').innerHTML = 'Eine While-Schleife ist eine Abfolge von Befehlen, die immer wieder in fester Reihenfolge aufgerufen werden.' + 'Dies geschieht bis die Abfrage, ob die festgelegte Bedingung der Schleife noch gültig ist, nicht mehr zutrifft.';
		}
		if (line_nm==4){
			main_pic.style.display = 'none';
			sec_pic.style.display = 'none';
			document.getElementById("test").innerHTML = 'Die Kante, welche an erster Stelle der Warteschlange steht, wird herausgenommen.'+' (x,y) bezeichnet die Kante, welche x mit y verbindet.';
			document.getElementById("htest").innerHTML = ' ';
		}
		if (line_nm==5){
			main_pic.style.display = 'none';
			sec_pic.style.display = 'inline';
			sec_pic.src = './data/if2.png';
			document.getElementById("test").innerHTML = 'Wenn die Funktion entferneInkonsistenteWerte wahr ist, also eine Domäne verkleinert hat (siehe auch Erklärungen ab Z. 8), wird der IF-Code (Zeile 11-13) ausgeführt.';
			document.getElementById("htest").innerHTML = 'If-Anweisungen sind Bedingungsabfragen.' + ' Wenn die aufgestellte Bedingung wahr ist, wird der Codeblock innerhalb der If-Klammer ausgeführt.' + 'Bei negativem Ergebnis wird dieser übersprungen.';
		}
		if (line_nm==6){
			main_pic.style.display = 'none';
			sec_pic.style.display = 'none';
			document.getElementById("test").innerHTML = ' Foreach, also für jeden Nachbarknoten (/Knoten der mit x mit einer Kante direkt verbunden ist) von x wird der folgende, eingerückte Code (Z.7) ausgeführt';
			document.getElementById("htest").innerHTML = ' ';
		}
		if (line_nm==7){
			main_pic.style.display = 'none';
			sec_pic.style.display = 'none';
			document.getElementById("test").innerHTML = 'Jede Kante, abgesehen von der Kante (x,y), wird in die Queue (von Zeile 2) eingefügt. Dies dient dazu um festzustellen, ob es die Kantenbedingungen von den jeweiligen Nachbarn von x und x noch eingehalten werden.';
			document.getElementById("htest").innerHTML = ' ';
		}
	}
	else{
		if (line_nm==8){
			main_pic.style.display = 'none';
			sec_pic.style.display = 'none';
			document.getElementById("test").innerHTML = ' entferneInkonsistenteWerte überprüft die Domains (den Wertebereich der jeweiligen Knoten) von Knoten x und y, ob beide  Knoten min. einen gültigen Wert aufweisen, der die Kantenbedingung erfüllt.';
			document.getElementById("htest").innerHTML = ' ';
			}
		if (line_nm==9){
			main_pic.style.display = 'none';
			sec_pic.style.display = 'none';
			document.getElementById("test").innerHTML = ' removed ist eine Hilfsvariable, die bei der Veränderung einer Domain verändert wird und dem Ausgabewert der Funktion wiedergibt.';
			document.getElementById("htest").innerHTML = ' ';
			}
		if (line_nm==10){
			main_pic.style.display = 'none';
			sec_pic.style.display = 'none';
			document.getElementById("test").innerHTML = ' Für jeden Wert innerhalb der Domain eines Knotens wird der folgende Codeblock (Z. 11-13) ausgeführt. Hierbei ist das Ziel einen Wert in Knoten y zu finden, so dass beide Knoten (x und y) die entsprechenden Kantenbedingung(en) erfüllen. ';
			document.getElementById("htest").innerHTML = ' ';
			}
		if (line_nm==11){
			main_pic.style.display = 'none';
			sec_pic.style.display = 'float';
			sec_pic.src = './data/if2.png';
			document.getElementById("test").innerHTML = 'IF-Bedingung: Es gibt kein Wert in Knoten y, so dass der aktuell ausgewählte Wert aus x (siehe Z.10, auch v1 benannt) und dieser die Kantenbedingungen erfüllen, so wird der Codeblock Zeile 12-13 ausgeführt. ';
			document.getElementById("htest").innerHTML = ' ';
			}
		if (line_nm==12){
			main_pic.style.display = 'none';
			sec_pic.style.display = 'none';
			document.getElementById("test").innerHTML = ' D(x) bezeichnet die Domain (den Wertebereich) von Knoten x. Dieser wird nun verkleinert, um den Wert v1. Da wie in der IF-Bedingung schon erwähnt, kein Wertepaar aus v1 und einem Wert aus Knoten y die Kantenbedingung erfüllen kann. ';
			document.getElementById("htest").innerHTML = ' ';
			}
		if (line_nm==13){
			main_pic.style.display = 'none';
			sec_pic.style.display = 'none';
			document.getElementById("test").innerHTML = ' Ist wie oben (Z.9) erwähnt eine Hilfsvariable, welche jetzt auf WAHR gesetzt wird. Da wir erfolgreich einen Wert in einer Domain (v1 aus der Domain von Knoten x) entfernt haben. '
			document.getElementById("htest").innerHTML = ' ';
			}
		if (line_nm==14){
			main_pic.style.display = 'none';
			sec_pic.style.display = 'none';
			document.getElementById("test").innerHTML = ' Gibt den Ausgabewert der Funktion entferneInkonsistenteWerte zurück, dieser ist WAHR oder FALSCH, in Abhängigkeit ob wir nun in dem Funktionsaufruf einen Wert aus einer Domain entfernt haben oder nicht. ';
			document.getElementById("htest").innerHTML = ' ';
			}
		
	}
}



