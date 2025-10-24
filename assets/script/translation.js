const translations = {
  en: {
    hello: "&lt;Hello/&gt;",
    im: "I'm",
    name: "Yasmim Rayane",
    role: "UI/UX Designer & Front-end Developer",
    about:
      "Web Developer focused on performance, security, and design.<br>" +
      "Bachelor’s Degree in Computer Engineering at Universidade Santa Cecília.<br>",
    semester: "2nd of 10 semesters",
    download: "Download resume",
    projects: "Recent projects",
    // Project titles & descriptions
    projPhonebookTitle: "Phonebook",
    projPhonebookDesc: "Focuses on managing contacts, creating accounts, and ensuring data security.",
    projTodoTitle: "To-do list",
    projTodoDesc: "A webpage of a to-do list.",
    projCalculatorTitle: "Calculator",
    projCalculatorDesc: "A calculator using TkInterCustom library.",
    projClockTitle: "Digital clock",
    projClockDesc: "A webpage of a digital clock.",
    // Mini prompt keys/values
    mpConst: "developer",
    mpKeyName: "name",
    mpNameVal: "'Yasmim Rayane'",
    mpKeyRole: "role",
    mpRoleVal: "'UI/UX Designer & Developer'",
    mpKeySkills: "skills",
    mpSkillBootstrap: "'Bootstrap'",
    mpSkillSass: "'Sass'",
    mpSkillFigma: "'Figma'",
    mpSkillDesignSystems: "'Design'",
    mpKeyPassion: "passion",
    mpPassionVal: "'Creating beautiful UX'",
    mpKeyStatus: "status",
    mpStatusVal: "'Available for hire'",
    contact: "Get in Touch",
    contactText:
      "I'm always open to discussing new opportunities, interesting projects, or just having a chat about web development and design. Feel free to reach out!",
    namePlaceholder: "Name",
    emailPlaceholder: "E-mail",
    messagePlaceholder: "Message",
    send: "Send message!",
    viewAll: "View all my works...",
    footer: "&copy; 2025 Yasmim Rayane.",
    noScript: "We're sorry but this portfolio doesn't work properly without JavaScript enabled. Please enable it to continue.",
    offline: "You are offline"
  },
  pt: {
    hello: "&lt;Olá/&gt;",
    im: "eu sou",
    name: "Yasmim Rayane",
    role: "Designer UI/UX & Desenvolvedora Front-end",
    about:
      "Desenvolvedora web focada em performance, segurança e design.<br>" +
      "Graduanda em Engenharia da Computação na Universidade Santa Cecília.<br>",
    semester: "2º de 10 semestres",
    download: "Baixar currículo",
    projects: "Projetos recentes",
    // Project titles & descriptions
    projPhonebookTitle: "Agenda Telefônica",
    projPhonebookDesc: "Focado em gerenciar contatos, criar contas e garantir segurança dos dados.",
    projTodoTitle: "Lista de Tarefas",
    projTodoDesc: "Uma página de lista de tarefas.",
    projCalculatorTitle: "Calculadora",
    projCalculatorDesc: "Uma calculadora usando a biblioteca TkInterCustom.",
    projClockTitle: "Relógio Digital",
    projClockDesc: "Uma página de relógio digital.",
    // Mini prompt keys/values
    mpConst: "desenvolvedora",
    mpKeyName: "nome",
    mpNameVal: "'Yasmim Rayane'",
    mpKeyRole: "cargo",
    mpRoleVal: "'Designer UI/UX & Desenvolvedora'",
    mpKeySkills: "habilidades",
    mpSkillBootstrap: "'Bootstrap'",
    mpSkillSass: "'Sass'",
    mpSkillFigma: "'Figma'",
    mpSkillDesignSystems: "'Design'",
    mpKeyPassion: "paixao",
    mpPassionVal: "'Criar UX bonito'",
    mpKeyStatus: "status",
    mpStatusVal: "'Estagiária na APS'",
    contact: "Fale comigo",
    contactText:
      "Estou sempre aberta para conversar sobre novas oportunidades, projetos interessantes ou apenas bater um papo sobre desenvolvimento e design. Sinta-se à vontade para entrar em contato!",
    namePlaceholder: "Nome",
    emailPlaceholder: "E-mail",
    messagePlaceholder: "Mensagem",
    send: "Enviar mensagem!",
    viewAll: "Ver todos os meus trabalhos...",
    footer: "&copy; 2025 Yasmim Rayane.",
    noScript: "Desculpe, mas este portfólio não funciona corretamente sem o JavaScript habilitado. Por favor, habilite-o para continuar.",
    offline: "Você está offline"
  }
};

const STORAGE_KEY = "siteLang";
let currentLang = localStorage.getItem(STORAGE_KEY) || "en";

function applyTranslations(lang) {
  const dict = translations[lang] || translations.en;

  // Aplica traduções para elementos com texto simples
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key && dict[key]) el.textContent = dict[key];
  });

  // Aplica traduções para elementos com HTML
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (key && dict[key]) el.innerHTML = dict[key];
  });

  // Aplica traduções para placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key && dict[key]) el.placeholder = dict[key];
  });

  // Atualiza a bandeira do idioma
  const flag = document.getElementById('langFlag');
  if (flag) {
    if (lang === 'en') {
      flag.src = 'assets/images/icons/usa-flag.svg';
      flag.alt = 'Switch to Portuguese';
    } else {
      flag.src = 'assets/images/icons/brazil-flag.png';
      flag.alt = 'Mudar para Inglês';
    }
  }

  // Atualiza o idioma no localStorage
  localStorage.setItem(STORAGE_KEY, lang);
  currentLang = lang;

  // Dispara evento de tradução aplicada
  document.dispatchEvent(new CustomEvent('i18n:applied', { detail: { lang } }));
}

function toggleLanguage() {
  applyTranslations(currentLang === 'en' ? 'pt' : 'en');
}

let i18nReady = false;
function initI18n() {
  if (i18nReady) return;
  if (document.readyState === 'loading') return document.addEventListener('DOMContentLoaded', initI18n, { once: true });
  applyTranslations(currentLang);
  document.addEventListener('click', e => {
    if (e.target.closest('#langToggle')) toggleLanguage();
  });
  // Fallback reapply (caso conteúdo carregue depois)
  setTimeout(() => applyTranslations(currentLang), 200);
  i18nReady = true;
}

initI18n();
window.toggleLanguage = toggleLanguage;
export { applyTranslations, toggleLanguage };
