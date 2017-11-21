
function getJSON() {
    var url = '/API/backup/'
    var xmlHttp = new XMLHttpRequest(); 
    
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            document.getElementById("tableContainer").innerHTML = xmlHttp.responseText;
            console.log(xmlHttp.responseText)
        }
            
    }

    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}