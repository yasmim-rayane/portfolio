var icon = document.getElementById("icon");
icon.onclick = function () {
    document.body.classList.toggle("dark-theme");
    if (document.body.classList.contains("dark-theme")) {
        icon.src = "assets/images/Light_Mode.png";
    } else {
        icon.src = "assets/images/Dark_Mode.png";
    }
}

let langs = document.querySelector(".langs"),
    link = document.querySelector(".langs"),
    headerHome = document.querySelector(".headerHome")

link.forEach(el=>{
    el.addEventListener("click",()=>{
        let attr = el.getAttribute("language")
        headerHome.textContent = data[attr].title
    })
})

let data = {
    portuguese: {
        headerHome: "Home",
        headerAbout: "",
        headerSkills: "",
        headerProjects: "",
        headerContact: "",
        homeDesc: "",
        aboutTitle: "",
        aboutDesc:"",
        skillsTitle: "",
        skillsDesc: "",
        projectsTitle: "",
        projectsDesc: "",
        contactTitle: "",
        contactDesc: ""
    },
    english: {
        headerHome: "Página Inicial",
        headerAbout: "",
        headerSkills: "",
        headerProjects: "",
        headerContact: "",
        homeDesc: "",
        aboutTitle: "",
        aboutDesc:"",
        skillsTitle: "",
        skillsDesc: "",
        projectsTitle: "",
        projectsDesc: "",
        contactTitle: "",
        contactDesc: ""
    }
}