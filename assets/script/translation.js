const SEMESTER_CONFIG = {
  startYear: 2025, // Ano do 1º semestre (2025.1)
  secondSemesterStartMonth: 8, // 1º semestre: Jan–Jul (1–7); 2º semestre: Ago–Dez (8–12)
  totalSemesters: 10
};

const MONTHS_PT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const PERIODS = {
  dpWorld: { startYear: 2026, startMonth: 7 },
  aps: { startYear: 2025, startMonth: 11, endYear: 2026, endMonth: 6 },
  deicmar: { startYear: 2024, startMonth: 9, endYear: 2025, endMonth: 10 },
  roboLia: { startYear: 2026, startMonth: 3 }
};

function getCurrentSemester(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1 = Jan .. 12 = Dez
  const semesterInYear = month < SEMESTER_CONFIG.secondSemesterStartMonth ? 1 : 2;
  const semester = (year - SEMESTER_CONFIG.startYear) * 2 + semesterInYear;
  return Math.max(1, semester);
}

function formatEnglishOrdinal(n) {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

function getSemesterText(lang, date = new Date()) {
  const current = getCurrentSemester(date);
  const total = SEMESTER_CONFIG.totalSemesters;

  if (current > total) {
    return lang === "pt" ? "Graduada" : "Graduated";
  }

  if (lang === "pt") {
    return `${current}º de ${total} semestres`;
  }

  return `${formatEnglishOrdinal(current)} of ${total} semesters`;
}

function getPtAboutText(date = new Date()) {
  const degreeLine = getCurrentSemester(date) > SEMESTER_CONFIG.totalSemesters
    ? "Bacharelado em Engenharia da Computação na Universidade Santa Cecília.<br>"
    : "Graduanda em Engenharia da Computação na Universidade Santa Cecília.<br>";

  return (
    "Focada em engenharia e análise de dados, automação de processos, IA e robótica autônoma.<br>" +
    degreeLine
  );
}

function formatDuration(totalMonths, lang) {
  const safeMonths = Math.max(1, totalMonths);
  const years = Math.floor(safeMonths / 12);
  const months = safeMonths % 12;

  if (lang === "pt") {
    const parts = [];
    if (years > 0) parts.push(`${years} ${years === 1 ? "ano" : "anos"}`);
    if (months > 0) parts.push(`${months} ${months === 1 ? "mês" : "meses"}`);
    return parts.join(" e ");
  }

  const parts = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? "yr" : "yrs"}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? "mo" : "mos"}`);
  return parts.join(" ");
}

function formatPeriod({ startYear, startMonth, endYear = null, endMonth = null }, lang, now = new Date()) {
  const monthsList = lang === "pt" ? MONTHS_PT : MONTHS_EN;
  const startLabel = `${monthsList[startMonth - 1]} ${startYear}`;
  const isOngoing = endYear === null || endMonth === null;
  const effectiveEndYear = isOngoing ? now.getFullYear() : endYear;
  const effectiveEndMonth = isOngoing ? now.getMonth() + 1 : endMonth;
  const totalMonths = (effectiveEndYear - startYear) * 12 + (effectiveEndMonth - startMonth) + 1;
  const endLabel = isOngoing
    ? (lang === "pt" ? "Atual" : "Present")
    : `${monthsList[endMonth - 1]} ${endYear}`;
  return `${startLabel} – ${endLabel} (${formatDuration(totalMonths, lang)})`;
}

const translations = {
  en: {
    hello: "&lt;Hello/&gt;",
    im: "I'm",
    name: "Yasmim Rayane",
    role: "Data Intern @ DP World",
    about:
      "Focused on data engineering, process automation, AI, and autonomous robotics.<br>" +
      "Bachelor’s Degree in Computer Engineering at Universidade Santa Cecília.<br>",
    get semester() {
      return getSemesterText("en");
    },
    download: "Download resume",
    // Mini prompt keys/values
    mpConst: "profile",
    mpKeyName: "name",
    mpNameVal: "'Yasmim Rayane'",
    mpKeyRole: "focus",
    mpRoleVal: "'Data, Automation & AI'",
    mpKeySkills: "stack",
    mpSkill1: "'Python'",
    mpSkill2: "'SQL'",
    mpSkill3: "'Databricks'",
    mpSkill4: "'AI & Robotics'",
    mpKeyPassion: "interests",
    mpPassionVal: "'AI & Autonomous Robotics'",
    mpKeyStatus: "status",
    mpStatusVal: "'Data Intern @ DP World'",
    // Experience section
    experienceTitle: "Experience",
    expDpWorldRole: "Data Intern in Operational Excellence & Innovation",
    get expDpWorldPeriod() {
      return `DP World · ${formatPeriod(PERIODS.dpWorld, "en")}`;
    },
    expDpWorldDesc:
      "Data pipelines and process automation on Microsoft Power Platform (Power Automate, Dataverse) and Dynamics 365, complex SQL queries, data lake processing with Databricks, and interactive Power BI dashboards.",
    expApsRole: "Data Intern in IT Governance",
    get expApsPeriod() {
      return `Autoridade Portuária de Santos (APS) · ${formatPeriod(PERIODS.aps, "en")}`;
    },
    expApsDesc:
      "Data modeling and analysis in Power BI (DAX & M), operational workflow automation with Power Automate and Dataverse, Power Apps prototyping, IT environment governance, and technical documentation.",
    expDeicmarRole: "Customs Apprentice",
    get expDeicmarPeriod() {
      return `Bandeirantes Deicmar · ${formatPeriod(PERIODS.deicmar, "en")}`;
    },
    expDeicmarDesc:
      "Operational and administrative support in customs routines (Registration, Endorsement, GPDI, Deconsolidation, and API Recintos) and physical/digital document management.",
    // Research, Publications & Awards section
    highlightsTitle: "Research, Publications & Awards",
    hlLiaBadge: "Research",
    hlLiaTitle: "Autonomous Robot Lia",
    get hlLiaMeta() {
      return formatPeriod(PERIODS.roboLia, "en");
    },
    hlLiaDesc:
      "Leading a 7-member multidisciplinary team in software architecture, backend, real-time communication, AI integration (Ollama LLMs, RAG, intent classification), computer vision, speech synthesis, ROS 2 (Python/C++), Docker, and Gazebo.",
    hlConicBadge: "Publication",
    hlConicTitle: "Digital Handgrip Dynamometer",
    hlConicMeta: "26th National Congress of Scientific Initiation (CONIC) · 2026",
    hlConicDesc:
      "ESP32-based digital dynamometer with Bluetooth, mobile app, and cloud integration to track handgrip strength measurements for physical rehabilitation.",
    hlCobricBadge: "Publication",
    hlCobricTitle: "Computer Vision-Controlled Robotic Hand",
    hlCobricMeta: "18th Brazilian Congress of Scientific Initiation (COBRIC) · 2026",
    hlCobricDesc:
      "Assistive and educational robotic hand using Python image processing integrated with Arduino to control five servomotors for finger movement.",
    hlHackathonBadge: "Award",
    hlHackathonTitle: "🥇 1st Place at ConstruInova Litoral Hackathon",
    hlHackathonMeta: "Oct 2025",
    hlHackathonDesc: "First place award in the ConstruInova Litoral innovation hackathon.",
    // Projects & GitHub
    projects: "Recent projects",
    viewAll: "View all my works...",
    noProjectDesc: "No description available.",
    githubError: "Unable to load GitHub projects. Please try again later.",
    // Contact & Footer
    contact: "Get in Touch",
    contactText:
      "Have an opportunity, an interesting project, or want to chat about data, automation, AI, or engineering? Send me a message below!",
    namePlaceholder: "Name",
    emailPlaceholder: "E-mail",
    messagePlaceholder: "Message",
    send: "Send message!",
    get footer() {
      return `&copy; ${new Date().getFullYear()} Yasmim Rayane.`;
    },
    noScript: "We're sorry but this portfolio doesn't work properly without JavaScript enabled. Please enable it to continue.",
    offline: "You are offline",
    langToggleLabel: "Switch to Portuguese",
    themeToggleLabel: "Change theme",
    themeSwitchToLight: "Switch to light theme",
    themeSwitchToDark: "Switch to dark theme",
    backToTop: "Yasmim Rayane: Back to top"
  },
  pt: {
    hello: "&lt;Olá/&gt;",
    im: "eu sou",
    name: "Yasmim Rayane",
    role: "Estagiária em Dados @ DP World",
    get about() {
      return getPtAboutText();
    },
    get semester() {
      return getSemesterText("pt");
    },
    download: "Baixar currículo",
    // Mini prompt keys/values
    mpConst: "perfil",
    mpKeyName: "nome",
    mpNameVal: "'Yasmim Rayane'",
    mpKeyRole: "foco",
    mpRoleVal: "'Dados, Automação e IA'",
    mpKeySkills: "stack",
    mpSkill1: "'Python'",
    mpSkill2: "'SQL'",
    mpSkill3: "'Databricks'",
    mpSkill4: "'IA & Robótica'",
    mpKeyPassion: "interesses",
    mpPassionVal: "'IA e Robótica Autônoma'",
    mpKeyStatus: "status",
    mpStatusVal: "'Estagiária @ DP World'",
    // Experience section
    experienceTitle: "Experiência",
    expDpWorldRole: "Estágio em Dados na Excelência Operacional & Inovação",
    get expDpWorldPeriod() {
      return `DP World · ${formatPeriod(PERIODS.dpWorld, "pt")}`;
    },
    expDpWorldDesc:
      "Desenvolvimento de pipelines de dados e automação na Microsoft Power Platform (Power Automate, Dataverse) e Dynamics 365, consultas SQL complexas, tratamento em data lake com Databricks e dashboards analíticos no Power BI.",
    expApsRole: "Estágio em Dados na Governança de TI",
    get expApsPeriod() {
      return `Autoridade Portuária de Santos (APS) · ${formatPeriod(PERIODS.aps, "pt")}`;
    },
    expApsDesc:
      "Modelagem e análise de dados em Power BI (DAX e M), automação de rotinas com Power Automate e Dataverse, soluções iniciais em Power Apps, governança de ambientes de TI e documentação técnica.",
    expDeicmarRole: "Jovem Aprendiz no Aduaneiro",
    get expDeicmarPeriod() {
      return `Bandeirantes Deicmar · ${formatPeriod(PERIODS.deicmar, "pt")}`;
    },
    expDeicmarDesc:
      "Suporte às rotinas operacionais e administrativas do setor aduaneiro (Registro, Averbação, GPDI, Desconsolidação e API Recintos) e gestão documental física e digital.",
    // Research, Publications & Awards section
    highlightsTitle: "Pesquisa, Publicações & Prêmios",
    hlLiaBadge: "Iniciação Científica",
    hlLiaTitle: "Robô Autônomo Lia",
    get hlLiaMeta() {
      return formatPeriod(PERIODS.roboLia, "pt");
    },
    hlLiaDesc:
      "Liderança de equipe multidisciplinar de 7 integrantes na arquitetura de software, back-end, comunicação em tempo real, integração de IA (LLMs via Ollama, RAG, classificação de intenções), visão computacional, síntese de voz, ROS 2 (Python/C++), Docker e Gazebo.",
    hlConicBadge: "Publicação",
    hlConicTitle: "Dinamômetro de Preensão Palmar Digital",
    hlConicMeta: "26º Congresso Nacional de Iniciação Científica (CONIC) · 2026",
    hlConicDesc:
      "Dinamômetro digital baseado em ESP32 com comunicação Bluetooth, aplicação móvel e computação em nuvem para rastreabilidade de força palmar na reabilitação física.",
    hlCobricBadge: "Publicação",
    hlCobricTitle: "Mão Robótica Controlada por Visão Computacional",
    hlCobricMeta: "18º Congresso Brasileiro de Iniciação Científica (COBRIC) · 2026",
    hlCobricDesc:
      "Mão robótica assistiva e educacional utilizando processamento de imagens em Python integrado ao Arduino para controle de cinco servomotores.",
    hlHackathonBadge: "Prêmio",
    hlHackathonTitle: "🥇 1º Lugar no Hackathon ConstruInova Litoral",
    hlHackathonMeta: "Out 2025",
    hlHackathonDesc: "Premiação de 1º lugar no hackathon de inovação ConstruInova Litoral.",
    // Projects & GitHub
    projects: "Projetos recentes",
    viewAll: "Ver todos os meus trabalhos...",
    noProjectDesc: "Sem descrição disponível.",
    githubError: "Não foi possível carregar os projetos do GitHub. Tente novamente mais tarde.",
    // Contact & Footer
    contact: "Fale comigo",
    contactText:
      "Tem alguma oportunidade, projeto interessante ou quer trocar uma ideia sobre dados, automação, IA ou engenharia? Me mande uma mensagem por aqui!",
    namePlaceholder: "Nome",
    emailPlaceholder: "E-mail",
    messagePlaceholder: "Mensagem",
    send: "Enviar mensagem!",
    get footer() {
      return `&copy; ${new Date().getFullYear()} Yasmim Rayane.`;
    },
    noScript: "Desculpe, mas este portfólio não funciona corretamente sem o JavaScript habilitado. Por favor, habilite-o para continuar.",
    offline: "Você está offline",
    langToggleLabel: "Mudar para inglês",
    themeToggleLabel: "Alterar tema",
    themeSwitchToLight: "Mudar para tema claro",
    themeSwitchToDark: "Mudar para tema escuro",
    backToTop: "Yasmim Rayane: Voltar ao topo"
  }
};

const STORAGE_KEY = "siteLang";
let currentLang = typeof localStorage !== "undefined" ? (localStorage.getItem(STORAGE_KEY) || "en") : "en";

function getCurrentLang() {
  return currentLang;
}

function getTranslation(key, lang = currentLang) {
  const dict = translations[lang] || translations.en;
  return dict[key] ?? translations.en[key] ?? "";
}

function applyTranslations(lang) {
  const dict = translations[lang] || translations.en;

  if (typeof document !== "undefined") {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }

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

  // Atualiza a bandeira e acessibilidade do botão de idioma
  const flag = document.getElementById('langFlag');
  if (flag) {
    if (lang === 'en') {
      flag.src = 'assets/images/icons/usa-flag.svg';
      flag.alt = dict.langToggleLabel;
    } else {
      flag.src = 'assets/images/icons/brazil-flag.png';
      flag.alt = dict.langToggleLabel;
    }
  }

  const langToggleBtn = document.getElementById('langToggle');
  if (langToggleBtn && dict.langToggleLabel) {
    langToggleBtn.setAttribute('title', dict.langToggleLabel);
    langToggleBtn.setAttribute('aria-label', dict.langToggleLabel);
  }

  const headerBrand = document.getElementById('headerBrand');
  if (headerBrand && dict.backToTop) {
    headerBrand.setAttribute('aria-label', dict.backToTop);
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

if (typeof document !== "undefined" && typeof window !== "undefined") {
  initI18n();
  window.toggleLanguage = toggleLanguage;
}

export {
  applyTranslations,
  toggleLanguage,
  getCurrentLang,
  getTranslation,
  getCurrentSemester,
  getSemesterText,
  getPtAboutText,
  formatDuration,
  formatPeriod
};
