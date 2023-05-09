
function showGlossaryItem(evt) {
    removeGlossaryItem();
    var element = evt.target;
    var item = evt.target.getAttribute("data-term");
    var def = evt.target.getAttribute("data-definition");
    var x;
    if (window.innerWidth && (evt.clientX + 400 > window.innerWidth)) {
        x = window.innerWidth - 420 + pageXOffset;
        if (x < 10)
           x = 10;
    }
    else {
        x = evt.clientX + pageXOffset;
    }
    var y = evt.clientY + pageYOffset;
    var popup = document.createElement("div");
    var img = document.createElement("img");
    img.src = "../resource/close24.png";
    img.style.position = "absolute";
    img.style.left = "4px";
    img.style.top = "4px";
    img.width = "49";
    img.height = "24";
    img.setAttribute("title","Click here or press ESC to close.");
    popup.appendChild(img);
    var text;
    popup.style.position = "absolute";
    popup.style.width = "380px";
    popup.style.maxHeight = "380px";
    popup.style.overflow = "auto";
    popup.style.backgroundColor = "#FFF8D0"
    popup.style.color = "#740b0b";
    popup.style.padding = "8px 8px 3px 8px";
    popup.style.border = "3px solid #740b0b";
    popup.style.borderRadius = "16px";
    popup.style.left = (x-12) + "px";
    popup.style.top = (y-12) + "px";
    popup.style.boxShadow = "0px 0px 12px black";
    text = document.createElement("h4");
    text.style.margin = "0px 0px 0px 60px";
    text.style.padding = "0px 0px 6px 0px";
    text.innerHTML = item;
    popup.appendChild(text);
    img.onclick = removeGlossaryItem;
    text = document.createElement("p");
    text.style.textIndent = "25px";
    text.style.margin = "0px";
    text.style.padding = "5px";
    text.style.borderTop = "thin solid #740b0b";
    text.style.borderBottom = "thin solid #740b0b";
    text.innerHTML = def;
    popup.appendChild(text);
    text = document.createElement("p");
    text.style.textIndent = "0px";
    text.style.fontSize = "85%";
    text.style.margin = "0px";
    text.style.padding = "5px";
    text.style.fontStyle = "italic";
    text.style.textAlign = "center";
    text.innerHTML = "<a target='glossary_window' href=\"http://www.google.com/search?q=" +
        encodeURI(item) + "\">Google \"" + item + "\"</a><br>" +
        "<a target='glossary_window' href=\"http://www.google.com/search?q=" +
        encodeURI("computer graphics " + item) + "\">Google \"computer graphics " + item + "\"</a><br>" +
        "(links open in a separate tab or window)";
    popup.appendChild(text);
    document.body.appendChild(popup);
    var rect = popup.getBoundingClientRect();
    if (rect && rect.height && window.innerHeight) {
        if (evt.clientY + rect.height > window.innerHeight) {
            var top = window.innerHeight - rect.height - 20;
            if (top < 10) {
                top = 10;
            }
            top += pageYOffset;
            popup.style.top = top + "px";
        }
    }
    currentGlossaryPopup = popup;
    document.addEventListener("keydown", removeGlossaryOnESC);
}

function removeGlossaryItem() {
    if (currentGlossaryPopup == null) {
        return;
    }
    document.body.removeChild(currentGlossaryPopup);
    currentGlossaryPopup = null;
    document.removeEventListener("keydown", removeGlossaryOnESC);
}

function removeGlossaryOnESC(evt) {
    if (evt.keyCode == 27) {
        removeGlossaryItem();
    }
}

var words = document.getElementsByClassName("word");
for (var i = 0; i < words.length; i++) {
    if (words[i].getAttribute("data-term")) {
       words[i].addEventListener("click",showGlossaryItem);
    }
}

var newwords = document.getElementsByClassName("newword");
for (var i = 0; i < newwords.length; i++) {
    if (newwords[i].getAttribute("data-term")) {
       newwords[i].addEventListener("click",showGlossaryItem);
    }
}

var currentGlossaryPopup = null;
