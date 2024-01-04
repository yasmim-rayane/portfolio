var icon = document.getElementById("icon");
icon.onclick = function () {
    document.body.classList.toggle("dark-theme");
    if (document.body.classList.contains("dark-theme")) {
        icon.src = "assets/images/Light_Mode.png";
    } else {
        icon.src = "assets/images/Dark_Mode.png";
    }
}

function infoHtml() {
    var htmlInfo = document.getElementById("info-html");
    if (htmlInfo.style.display === "none") {
        htmlInfo.style.display = "inline";
    } else {
        htmlInfo.style.display = "none";
    } 
}

function infoCss() {
    var cssInfo = document.getElementById("info-css");
    if (cssInfo.style.display === "none") {
        cssInfo.style.display = "inline";
    } else {
        cssInfo.style.display = "none";
    } 
}

function infoBoot() {
    var bootstrapInfo = document.getElementById("info-bootstrap");
    if (bootstrapInfo.style.display === "none") {
        bootstrapInfo.style.display = "inline";
    } else {
        bootstrapInfo.style.display = "none";
    } 
}

function infoSass() {
    var sassInfo = document.getElementById("info-sass");
    if (sassInfo.style.display === "none") {
        sassInfo.style.display = "inline";
    } else {
        sassInfo.style.display = "none";
    } 
}

function infoJs() {
    var jsInfo = document.getElementById("info-js");
    if (jsInfo.style.display === "none") {
        jsInfo.style.display = "inline";
    } else {
        jsInfo.style.display = "none";
    } 
}

function infoIllustrator() {
    var illustratorInfo = document.getElementById("info-illustrator");
    if (illustratorInfo.style.display === "none") {
        illustratorInfo.style.display = "inline";
    } else {
        illustratorInfo.style.display = "none";
    } 
}

function infoPhotoshop() {
    var photoshopInfo = document.getElementById("info-photoshop");
    if (photoshopInfo.style.display === "none") {
        photoshopInfo.style.display = "inline";
    } else {
        photoshopInfo.style.display = "none";
    } 
}

function infoFigma() {
    var figmaInfo = document.getElementById("info-figma");
    if (figmaInfo.style.display === "none") {
        figmaInfo.style.display = "inline";
    } else {
        figmaInfo.style.display = "none";
    } 
}

function infoPy() {
    var pyInfo = document.getElementById("info-py");
    if (pyInfo.style.display === "none") {
        pyInfo.style.display = "inline";
    } else {
        pyInfo.style.display = "none";
    } 
}