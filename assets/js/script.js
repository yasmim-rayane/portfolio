var icon = document.getElementById("icon");
icon.onclick = function () {
    document.body.classList.toggle("dark-theme");
    if (document.body.classList.contains("dark-theme")) {
        icon.src = "assets/images/Light_Mode.png";
    } else {
        icon.src = "assets/images/Dark_Mode.png";
    }
}