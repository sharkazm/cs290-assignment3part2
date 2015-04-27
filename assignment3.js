var favorites = new Array();        //create arrays to hold lists
var results = new Array(); 

function gist(gistID, gistDesc, gistURL){       //contents of a gist object

  this.gistID = gistID; 
  this.gistDesc = gistDesc;
  this.gistURL = gistURL;
  this.fav = false; 
}

function addFav(i) {              //adds a gist to the favorite list
  favorites.push(results[i]);     
  createList("fav"); 
  results.splice(i, 1);  
  createList("res"); 
  localStorage.setItem("favorites", JSON.stringify(favorites)); 
}

function remFav(i) {             //removes a gist from the favorite list
  favorites.splice(i, 1);  
  
  createList("fav"); 
  localStorage.setItem("favorites", JSON.stringify(favorites)); 
}

function findID(_gistID, listName) {    //locates a gist by ID number to be added or removed
  if (listName == "fav") { 
    for (var i = 0; i < favorites.length; i++) {
      if (favorites[i].gistID === _gistID) { 
        return i; 
      }
    }
  }

  else {
    for (var i = 0; i < results.length; i++) {
      if (results[i].gistID === _gistID) {
        return i; 
      }
    }
  } 
}

function createList(listName) {     //used to add or remove favorites, create list

  var gistList;
  var div; 

  if (listName == "fav") {  
    div = document.getElementById("faves"); 
    gistList = favorites; 
  }

  else {
    div = document.getElementById("list"); 
    gistList = results; 
  }

  for (var k = div.childNodes.length - 1; k >= 0; k--) {
    div.removeChild(div.childNodes[k]);
  }

  gistList.forEach(function (_gist) {
    var inDiv = document.createElement("div");
    inDiv.id = _gist.gistID; 

    if (listName == "fav") {
      var addButton = document.createElement("button"); 
      addButton.innerHTML = "Remove"; 
      addButton.setAttribute("gistID", _gist.gistID);

      addButton.onclick = function() {
        var gistID = this.getAttribute("gistID"); 
        var favRem = findID(gistID, listName);
        remFav(favRem);  
      }
    }
    else {
      var addButton = document.createElement("button"); 
      addButton.innerHTML = "Add"; 
      addButton.setAttribute("gistID", _gist.gistID); 

      addButton.onclick = function() {
        var gistID = this.getAttribute("gistID"); 
        var favAdd = findID(gistID, listName);
        addFav(favAdd);  
      }
    }

    inDiv.appendChild(addButton); 

    var descDiv = document.createElement("span");

    descDiv.innerHTML = _gist.gistDesc; 

    inDiv.appendChild(descDiv);

    var b = document.createElement("b"); 

    inDiv.appendChild(b); 

    var link = document.createElement("a"); 

    var text = document.createTextNode(_gist.gistURL.toString()); 

    link.appendChild(text); 
    link.title = "Gist URL"; 
    link.href = _gist.gistURL;

    inDiv.appendChild(link); 
    div.appendChild(inDiv);

  });
}

window.onload = function () {
  favorites = localStorage.getItem("favorites"); 

  if (favorites !== null) {
    favorites = JSON.parse(favorites); 
    createList("fav"); 
  }

  else {
    favorites = new Array();
  }
}   

function getGist() {             //retrieves gist information for the list

  var url = "https://api.github.com/gists/public?page=1"; 
  results = [];
  var page = document.getElementById("pagenums"); 
  var pageNum = page.options[page.selectedIndex].value;

  for (var i = 1; i <= pageNum; i++){ 
    var request = new XMLHttpRequest(); 
    if(!request){
      throw "Bad Request"; 
    }

    url = url.substring(0, url.length - 1); 
    url += i; 

    request.open("Get", url); 
    request.send(); 

    request.onreadystatechange = function() {

      if(this.readyState === 4) {
        var _gistList = JSON.parse(this.responseText);

        for (var j = 0; j < _gistList.length; j++) {
          var _gistURL = _gistList[j].html_url; 
          var _gistID = _gistList[j].id; 
          var _gistDesc = _gistList[j].description; 
          var inFavs = false; 

          if (_gistDesc === "" || _gistDesc === null)
            _gistDesc = "No Description"; 

          if (favorites !== null) {
            for (var k = 0; k < favorites.length; k++) {

             if (_gistID == favorites[k].gistID) {
                inFavs = true; 
               break; 
              }
            }
          }

          if (!inFavs) {
            var newGist = new gist(_gistID, _gistDesc, _gistURL); 
            results.push(newGist);
          } 
        }

        createList("res"); 
      }
    }
  }
}

