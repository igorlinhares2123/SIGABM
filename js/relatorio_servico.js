/* SIGABM — Módulo Isolado: Relatório Completo de Serviço (Aluno de Dia) */
window.SIGABM_RelatorioServico = (function() {
  if (!document.getElementById('rsAppRoot')) return { ensureInit: () => {} };
let LOGO_CBMBA = "img/brasao_cbmba.png";
let LOGO_ABM = "img/brasao_abm.png";
let LOGO_CBMBA_DATA = "";
let LOGO_ABM_DATA = "";

function preloadCrestAsDataUri(imgPath) {
 return new Promise(resolve => {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
   try {
    const c = document.createElement("canvas");
    c.width = img.naturalWidth || 160;
    c.height = img.naturalHeight || 160;
    c.getContext("2d").drawImage(img, 0, 0);
    resolve(c.toDataURL("image/png"));
   } catch (e) { resolve(""); }
  };
  img.onerror = () => resolve("");
  img.src = imgPath;
 });
}
preloadCrestAsDataUri(LOGO_CBMBA).then(d => { if (d) LOGO_CBMBA_DATA = d; });
preloadCrestAsDataUri(LOGO_ABM).then(d => { if (d) LOGO_ABM_DATA = d; });

const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm = s => String(s ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();

function getTodayISO() {
 const d = new Date();
 const yyyy = d.getFullYear();
 const mm = String(d.getMonth() + 1).padStart(2, "0");
 const dd = String(d.getDate()).padStart(2, "0");
 return `${yyyy}-${mm}-${dd}`;
}
$("assumeDate").value = getTodayISO();

let toastTimer = null;

function askAppConfirm(message, title = "Confirmação") {
 return new Promise(resolve => {
  const modal = $("appConfirmModal");
  const msgEl = $("appConfirmMessage");
  const titleEl = $("appConfirmTitle");
  const okBtn = $("appConfirmOkBtn");
  const cancelBtn = $("appConfirmCancelBtn");
  if (!modal || !msgEl || !okBtn || !cancelBtn) {
   resolve(true);
   return;
  }
  titleEl.textContent = title;
  msgEl.textContent = message;
  modal.style.display = "block";
  const cleanup = (val) => {
   modal.style.display = "none";
   okBtn.onclick = null;
   cancelBtn.onclick = null;
   resolve(val);
  };
  okBtn.onclick = () => cleanup(true);
  cancelBtn.onclick = () => cleanup(false);
 });
}

function showToast(msg) {
 const el = $("toastMsg");
 if (!el) return;
 el.textContent = msg;
 el.style.display = "block";
 if (toastTimer) clearTimeout(toastTimer);
 toastTimer = setTimeout(() => { el.style.display = "none"; }, 6000);
}

function fmtMil(n) {
 return `${n} ${n === 1 ? "militar" : "militares"}`;
}
function fmtSel(n) {
 return `${n} ${n === 1 ? "selecionado" : "selecionados"}`;
}

const people = [
 ["01","ARTHUR AUGUSTO BONFIM VAZ","92.163.557","Espadarte","M","VAZ"],
 ["02","PATRÍCIA ARAUJO DAS MERCÊS","92.163.558","Espadarte","F","PATRICIA"],
 ["03","RYAN LAGO ARAUJO RIEPER","92.163.571","Espadarte","M","RIEPER"],
 ["04","RUBEM PEREIRA ARAUJO","30.583.372","Espadarte","M","RUBEM"],
 ["05","ANA BEATRIZ SANTOS SAMPAIO","92.049.836","Espadarte","F","BEATRIZ"],
 ["06","JULIANA MATOS LOPES MOTA","92.163.595","Espadarte","F","JULIANA"],
 ["07","IGOR ALVES LINHARES","92.114.097","Espadarte","M","LINHARES"],
 ["08","LUÍS HENRIQUE SANTIAGO MONTE ALBUQUERQUE","92.114.050","Espadarte","M","ALBUQUERQUE"],
 ["10","FERNANDA LEAL SOUZA","92.163.589","Espadarte","F","FERNANDA"],
 ["11","JULIO CESAR FERREIRA DOS SANTOS JUNIOR","92.163.563","Espadarte","M","JÚLIO CESAR"],
 ["12","EMILY JULIANE RODRIGUES ALVES DE MOURA","92.163.566","Espadarte","F","EMILY"],
 ["13","YGOR RANIERY NASCIMENTO COSTA","92.052.157","Espadarte","M","RANIERY"],
 ["14","REGINALDO OLIVEIRA CRUZ NETO","92.114.261","Espadarte","M","REGINALDO"],
 ["15","VINICIUS DOS SANTOS FALCÃO","92.129.056","Espadarte","M","FALCÃO"],
 ["16","RYAN PABLO BASTOS PORTO","92.163.577","Espadarte","M","PORTO"],
 ["17","ADRIELE MOTA DE OLIVEIRA SANTOS","92.163.550","Espadarte","F","ADRIELE"],
 ["18","GABRIELA SILVA LIMA","92.069.086","Espadarte","F","GABRIELA"],
 ["19","ESDRAS FERREIRA DE ALCÂNTARA","92.163.584","Espadarte","M","ESDRAS"],
 ["20","FRANCLIN FAGUNDES DE OLIVEIRA","89.646.378-1","Espadarte","M","FRANCLIN"],
 ["21","RAFAEL SATURNINO DOURADO","92.069.327","Espadarte","M","SATURNINO"],
 ["22","GESSÉ DE CRISTO ALMEIDA","92.069.130","Espadarte","M","GESSÉ"],
 ["23","ADAN CERQUEIRA LOPES","89.642.669-0","Espadarte","M","LOPES"],
 ["24","CAÍQUE CERQUEIRA SANTANA","92.051.807","Espadarte","M","CAÍQUE"],
 ["25","PABLO MIGUEL DA SILVA E SILVA","92.163.567","Espadarte","M","SILVA E SILVA"],
 ["26","ARTHUR EDUARDO DOS SANTOS SOUZA","92.138.801","Espadarte","M","EDUARDO"],
 ["27","GABRIEL FIGUEIREDO GOES","92.163.593","Espadarte","M","GABRIEL"],
 ["28","CRISTIANE FIGUEIREDO BARRETO PEREIRA","303977102","Espadarte","F","CRISTIANE"],
 ["29","BRENO LOPES SOUZA","89.645.574-6","Espadarte","M","BRENO"],
 ["30","LAVÍNIA DA SILVA SOUZA","92.163.552","Espadarte","F","LAVÍNIA"],
 ["31","LUCAS NASCIMENTO DE VASCONCELOS ARAÚJO","291-7 (CBMAL)","Guardião","M","VASCONCELOS"],
 ["32","YAN GOES ARAUJO DA SILVA","92.114.091","Guardião","M","GOES"],
 ["33","THAUANNE DA ROCHA CINTRA","249-6 (CBMAL)","Guardião","F","THAUANNE"],
 ["34","GUSTAVO RAPHAEL SILVA BATISTA PEREIRA","92.176.435","Guardião","M","GUSTAVO"],
 ["35","CAUÃ SANTOS DA SILVA","92.176.944","Guardião","M","CAUÃ"],
 ["36","EDSEL ANTONIO VITALI NETO","92.113.969","Guardião","M","EDSEL"],
 ["37","WILLIAN SUZARTE CRUZ","92.052.187","Guardião","M","WILLIAN"],
 ["38","UALLACE SANTOS SILVA","89.649.353","Guardião","M","UALLACE"],
 ["39","LUÍS FERNANDO MARQUES ROCHA","89.643.272-2","Guardião","M","ROCHA"],
 ["40","RODRIGO DA SILVA MERCÊS","89.654.240-4","Guardião","M","MERCÊS"],
 ["41","ABRAÃO CABRAL DA SILVA OLIVEIRA","92.177.083","Guardião","M","ABRAÃO"],
 ["42","GEORGE LUCAS FERREIRA DA COSTA","89.642.039-3","Guardião","M","GEORGE"],
 ["43","MARCOS GOMES DA SILVA","92.176.079","Guardião","M","GOMES"],
 ["44","LORENA PAULA DOS SANTOS BRITO","92.177.069","Guardião","F","PAULA"],
 ["45","LUANA MOTHÉ SOARES","92.177.060","Guardião","F","MOTHÉ"],
 ["46","VANESSA ANDRADE CAVALCANTE","92.068.765","Guardião","F","VANESSA ANDRADE"],
 ["47","RAFAEL OLIVEIRA DO CARMO","92.114.117","Guardião","M","DO CARMO"],
 ["48","MIRELA GOIS BATISTA ALVES","92.050.930","Guardião","F","MIRELA"],
 ["49","CARLOS DE SOUZA SANTOS","89.646.616-1","Guardião","M","SOUZA SANTOS"],
 ["50","ALFREDO LEONARDO MOREIRA SILVA DE JESUS","89.641.607-7","Guardião","M","DE JESUS"],
 ["51","RAMON GONÇALVES RIBEIRO SANTOS","89.643.269-1","Guardião","M","GONÇALVES"],
 ["52","ADENILSON SANTANA DOS SANTOS JUNIOR","92.049.385","Guardião","M","ADENILSON"],
 ["53","VICTOR GABRIEL GOIS PAIM","11476-8 (CBMSE)","Guardião","M","PAIM"],
 ["54","GABRIEL DA SILVA ALVES","30.645.339-3 (PMBA)","Guardião","M","ALVES"],
 ["55","GUSTAVO VICTOR BARROS SANTANA","92.176.087","Guardião","M","BARROS"],
 ["56","ALISSON RÉGIS MOREIRA","92.049.758","Guardião","M","RÉGIS"],
 ["57","JOÃO FERNANDO ALVES DE LIMA BARRETO","92.176.092","Guardião","M","LIMA BARRETO"],
 ["58","KELVIN FIGUEREDO SANTOS","92.176.115","Guardião","M","KELVIN"],
 ["59","ALANA MOURA LIMA","92.176.171","Guardião","F","ALANA MOURA"],
 ["60","ANA CRISTINA DIAS ALVES","12.352-1 (CBMSE)","Guardião","F","CRISTINA"],
 ["61","RICARDO NASCIMENTO DOS SANTOS","92.176.078","Guardião","M","NASCIMENTO"],
 ["62","CÁCIA MARCELA DE OLIVEIRA MIRANDA","92.069.139","Guardião","F","MARCELA"],
 ["63","EMMANUELE MARIA SANTOS PEREIRA","92.128.551","Guardião","F","MARIA PEREIRA"],
 ["64","MARIANA LIMA VIEIRA","92.069.169","Guardião","F","MARIANA"],
 ["65","MATHEUS LIMA SENA DOS SANTOS","92.177.074","Guardião","M","SENA"],
 ["66","ADRIAN FALCÃO VIEIRA SILVA","92.112.999","Guardião","M","VIEIRA"],
 ["67","MAKLEY DA SILVA PEREIRA","92.129.092","Guardião","M","MAKLEY"]
];

const defaultOfficers = [
 ["FRANCISCO HENRIQUE DE FARIAS ASSIS NETO","89.640.127-6","TEN QOBM","ASSIS NETO"],
 ["DIEGO DE JESUS SANTOS","30.527.717","TEN QOBM","DIEGO"],
 ["EVANDRO SANTOS DA CONCEIÇÃO","89.644.047-4","TEN QOBM","EVANDRO"],
 ["DENISSON DOS SANTOS AMARO LIMA","92.109.777","TEN QOBM","AMARO"],
 ["RAISA MARIANA FERREIRA SANTOS","89.641.457-0","TEN QOBM","RAISA"],
 ["FRANCISCO ALVES CARIBÉ NETO","30.289.936-9","TEN QOABM","CARIBÉ"],
 ["EDMÁRIO OLIVEIRA SANTOS","30.388.260","TEN QOABM","EDMÁRIO"],
 ["WENDY NEY BARRETO DE SANTA BARBARA","30.310.651-5","TEN QOABM","WENDY"],
 ["RICARDO SILVA DA CRUZ","30.290.165-3","TEN QOABM","RICARDO"],
 ["UBIRAJARA SAMPAIO DOS SANTOS","30.257.077-9","TEN QOABM","UBIRAJARA"],
 ["ALESSANDRA RIBEIRO QUIRINO","30.289.866","TEN QOABM","ALESSANDRA"],
 ["EMERSON AUGUSTO BISET MARQUES","30.256.893-4","TEN QOABM","EMERSON"],
 ["URBEVAL WESLLEY SANTOS DA SILVA","30.299.575","TEN QOABM","URBEVAL"],
 ["VALDINEI SAMPAIO SANTA CRUZ","30.294.586-9","TEN QOABM","VALDINEI"],
 ["DARLENE DOS SANTOS FIGUERÊDO","30.299.842-2","TEN QOABM","DARLENE"],
 ["AIDIL OLIVEIRA LIMA PEREIRA","30.289.953","TEN QOABM","AIDIL"],
 ["ANILTON BITTENCOURT PEREIRA","30.299.589-8","TEN QOAPM","BITTENCOURT"],
 ["SILVIO CESAR PEREIRA SANTOS","30.299.500-0","TEN QOA BM","SILVIO"],
 ["JOSÉ CARLOS OLIVEIRA MATOS","30.270.975","TEN QOA BM","MATOS"],
 ["GIOVANNI MARIO DE ALCANTARA","30.268.304","TEN QOABM","GIOVANNI"],
 ["RAIMUNDO JORGE SOUZA CACHOEIRA","30.246.410-6","TEN QOABM","CACHOEIRA"]
];

let customOfficers = [];
try { customOfficers = JSON.parse(localStorage.getItem("abm_custom_officers_v10") || "[]"); } catch(e) {}
let officers = [...defaultOfficers, ...customOfficers];

const materialsAluno = [
 { text: "01 pasta com CDFs, recursos, cautelas e demais documentações", checked: true },
 { text: "01 chave da sala do Oficial de Dia", checked: true },
 { text: "01 chave da porta principal", checked: true },
 { text: "01 chave da sala da turma Espadarte", checked: true },
 { text: "01 chave da porta de vidro do pavilhão de aulas", checked: true },
 { text: "01 chave do alojamento feminino externo", checked: true },
 { text: "01 celular funcional com carregador", checked: true }
];

const materialsMasc = [
 { text: "04 cadeirinhas nível 3", checked: true },
 { text: "11 ascensores de punho", checked: true },
 { text: "10 ascensores de peito", checked: true },
 { text: "05 fitas anelares pretas", checked: true },
 { text: "05 fitas anelares amarelas", checked: true },
 { text: "06 polias simples", checked: true },
 { text: "06 polias duplas", checked: true },
 { text: "01 corda de 200 metros", checked: true },
 { text: "03 placas de ancoragem", checked: true },
 { text: "40 mosquetões tipo D", checked: true },
 { text: "10 mosquetões tipo X", checked: true },
 { text: "18 freios oito", checked: true },
 { text: "01 rede para prática de voleibol", checked: true },
 { text: "02 bolas de voleibol", checked: true },
 { text: "01 par de antenas para rede de voleibol", checked: true },
 { text: "02 redes de futebol", checked: true },
 { text: "01 controle de ar-condicionado", checked: true },
 { text: "01 bolsa/mochila de APH na convivência masculina", checked: true },
 { text: "02 lanternas na convivência masculina", checked: true },
 { text: "02 caixas pretas sem tampa (JIM Espadarte)", checked: true },
 { text: "01 caixa térmica de isopor com materiais de limpeza", checked: true },
 { text: "Caixas com copos d’água", checked: true },
 { text: "Cones, barras, anilhas e pesos para musculação", checked: true },
 { text: "01 mochila, 01 capacete, 01 facão e materiais da JIM", checked: true },
 { text: "Uniformes em desuso na caixa da convivência masculina", checked: true }
];

const materialsFem = [
 { text: "01 cadeira de escritório com rodas (patrimônio 00001453)", checked: true },
 { text: "01 controle de ar na convivência feminina", checked: true },
 { text: "01 bolsa/mochila de APH na convivência feminina", checked: true },
 { text: "01 lanterna na convivência feminina", checked: true },
 { text: "01 prancha rígida e 01 par de head block na convivência feminina", checked: true }
];

const photoSectionCatalog = [
 { id: "misc",         label: "VIII) Diversos (Alterações e Informações Gerais)" },
 { id: "infoDormMEsp", label: "VI - a.1) Alojamento Masculino (Espadartes 2025)" },
 { id: "infoDormMGua", label: "VI - a.2) Alojamento Masculino (Guardiões 2026)" },
 { id: "infoBathM",    label: "VI - a.3) Banheiro Masculino (em conjunto)" },
 { id: "infoDormFEsp", label: "VI - b.1) Alojamento Feminino (Espadartes 2025)" },
 { id: "infoDormFGua", label: "VI - b.2) Alojamento Feminino (Guardiões 2026)" },
 { id: "infoBathF",    label: "VI - b.3) Banheiro Feminino (em conjunto)" },
 { id: "infoCommon",   label: "VI - c) Área Comum, Salas de Aula e Rancho" },
 { id: "changesDuty",  label: "III) Alterações — Efetivo de Serviço" },
 { id: "changes2025",  label: "III) Alterações — 1º CFO 2025 (Espadartes)" },
 { id: "changes2026",  label: "III) Alterações — 1º CFO 2026 (Guardiões)" },
 { id: "matAluno",     label: "II - 1.1) Material a cargo do Aluno de Dia" },
 { id: "matMasc",      label: "II - 1.2) Material — Área Masculina" },
 { id: "matFem",       label: "II - 1.3) Material — Área Feminina" },
 { id: "received",     label: "IV) Documentos Recebidos" },
 { id: "delivered",    label: "V) Documentos Entregues" },
 { id: "otherDuty",    label: "I) Efetivo de Serviço (Observações)" },
 { id: "sleepNotes",   label: "VII) Pernoite (Observações)" }
];

function getPhotoSectionLabel(secId) {
 const found = photoSectionCatalog.find(s => s.id === secId);
 return found ? found.label : "VIII) Diversos";
}

function renderMatSection(containerId, list, cls) {
 $(containerId).innerHTML = list.map((m, i) =>
  `<label class="checkline"><input type="checkbox" class="${cls}" value="${i}" ${m.checked ? "checked" : ""}><span>${esc(m.text)}</span></label>`
 ).join("");
 $(containerId).addEventListener("change", () => { renderPreview(); focusPreviewSection(containerId); triggerAutoSave(); });
}
renderMatSection("matAluno", materialsAluno, "matcheck-aluno");
renderMatSection("matMasc", materialsMasc, "matcheck-masc");
renderMatSection("matFem", materialsFem, "matcheck-fem");

window.toggleMatGroup = function(containerId, state) {
 $(containerId).querySelectorAll("input[type=checkbox]").forEach(cb => cb.checked = state);
 renderPreview();
 triggerAutoSave();
};

let activePreviewSection = null;

function isLandscapeSideBySide() {
 return window.matchMedia("(orientation: landscape) and (min-width: 680px)").matches;
}

const fieldToPreviewSectionMap = {
 assumeDate: "header",
 assumeTime: "header",
 officerMode: "header",
 student: "header",
 officer1: "header",
 officer2: "header",
 officerWar1: "header",
 officerWar2: "header",
 nextStudent: "passagem",
 handoverTime: "passagem",
 dutySearch: "duty",
 otherDuty: "duty",
 extraMatAluno: "matAluno",
 extraMatMasc: "matMasc",
 extraMatFem: "matFem",
 changesDuty: "changesDuty",
 changes2025: "changes2025",
 changes2026: "changes2026",
 received: "received",
 delivered: "delivered",
 infoDormMEsp: "infoDormMEsp",
 infoDormMGua: "infoDormMGua",
 infoBathM: "infoBathM",
 infoDormFEsp: "infoDormFEsp",
 infoDormFGua: "infoDormFGua",
 infoBathF: "infoBathF",
 infoCommon: "infoCommon",
 sleepSearch: "sleep",
 sleepNotes: "sleep",
 misc: "misc"
};

function focusPreviewSection(secKey) {
 if (!secKey) return;
 activePreviewSection = secKey;
 const previewEl = $("preview");
 if (!previewEl) return;
 previewEl.querySelectorAll(".prev-sec-block").forEach(el => {
  el.classList.toggle("active-preview-sec", el.id === `prev_sec_${secKey}`);
 });
 if (!isLandscapeSideBySide()) return;
 const targetEl = $(`prev_sec_${secKey}`);
 if (!targetEl) return;
 const previewRect = previewEl.getBoundingClientRect();
 const targetRect = targetEl.getBoundingClientRect();
 const currentScroll = previewEl.scrollTop;
 const offsetInsidePreview = targetRect.top - previewRect.top + currentScroll;
 const desiredScrollTop = Math.max(0, offsetInsidePreview - Math.min(110, previewEl.clientHeight * 0.22));
 previewEl.scrollTo({ top: desiredScrollTop, behavior: "smooth" });
}

// Sistema de Digitação Livre Universal + Autocompletar @Militar e /Atalhos
let atFormatMode = "full";
try { atFormatMode = localStorage.getItem("abm_at_format_mode") || "full"; } catch(e) {}

function boldWarAsterisks(fullName, warName) {
 if (!warName || !warName.trim()) return fullName;
 const fnNorm = norm(fullName), wnNorm = norm(warName);
 const idx = fnNorm.indexOf(wnNorm);
 if (idx !== -1) {
  return `${fullName.slice(0, idx)}**${fullName.slice(idx, idx + wnNorm.length)}**${fullName.slice(idx + wnNorm.length)}`;
 }
 const words = wnNorm.split(/\s+/).filter(Boolean);
 return fullName.split(/(\s+)/).map(tk => words.includes(norm(tk)) ? `**${tk}**` : tk).join("");
}

function formatMilitaryMention(entry, isOfficer, mode = atFormatMode) {
 if (isOfficer) {
  const [fullName, mat, rank, war] = entry;
  if (mode === "short") return `**${rank}** **${war}**`;
  if (mode === "war_mat") return `**${rank}** **${war}**, Mat.: ${mat}`;
  return `**${rank}** ${boldWarAsterisks(fullName, war)}, Mat.: ${mat}`;
 } else {
  const [num, fullName, mat, group, sex, war] = entry;
  if (mode === "short") return `**AL OF BM** **${war}**, Nº ${num}`;
  if (mode === "war_mat") return `**AL OF BM** **${war}**, Nº ${num}, Mat.: ${mat}`;
  return `**AL OF BM** ${boldWarAsterisks(fullName, war)}, Nº ${num}, Mat.: ${mat}`;
 }
}

function getCurrentOfficerShortBold() {
 const el = $("officer1");
 const warEl = $("officerWar1");
 if (el && el.value !== "" && officers[Number(el.value)]) {
  const o = officers[Number(el.value)];
  const w = (warEl && warEl.value.trim()) ? warEl.value.trim() : o[3];
  return `**${o[2]}** **${w}**`;
 }
 return "**TEN BM** **AMARO**";
}

function getSlashCommands() {
 const offBold = getCurrentOfficerShortBold();
 const now = new Date();
 const hh = String(now.getHours()).padStart(2, "0");
 const mm = String(now.getMinutes()).padStart(2, "0");
 return [
  { cmd: "/permuta",  title: "Permuta de Serviço", text: "Permuta de Serviço do @ com o @" },
  { cmd: "/aut",      title: "Autorizado pelo Oficial de Dia", text: `Autorizado pelo ${offBold}.` },
  { cmd: "/apec",     title: "Liberado da APEC pelo Oficial de Dia", text: `liberado da APEC pelo ${offBold}.` },
  { cmd: "/entregue", title: "Entregue ao Oficial de Dia", text: `Entregue ao ${offBold}.` },
  { cmd: "/amg",      title: "Deslocamento p/ Clínica AMG", text: "deslocou-se para a clínica AMG às 07h30min, retornando à ABM às 10h30min." },
  { cmd: "/hosp",     title: "Deslocamento p/ Hospital / Consulta", text: `deslocou-se para atendimento médico às ${hh}h${mm}min, autorizado pelo ${offBold}.` },
  { cmd: "/hora",     title: `Horário atual (${hh}h${mm}min)`, text: `às ${hh}h${mm}min` },
  { cmd: "/sem",      title: "Sem alterações", text: "Sem alterações." }
 ];
}

let smartPopupEl = null;
let activeTa = null, activeTokenStart = -1, activeTokenEnd = -1, activeCandidates = [], activeCandIdx = 0, activePopupType = "at";

function ensureSmartPopup() {
 if (!smartPopupEl) {
  smartPopupEl = document.createElement("div");
  smartPopupEl.id = "smartPopupMenu";
  document.body.appendChild(smartPopupEl);
 }
 return smartPopupEl;
}

window.setAtFormatMode = function(m) {
 atFormatMode = m;
 try { localStorage.setItem("abm_at_format_mode", m); } catch(e) {}
 renderSmartPopup();
};

function findAtCandidates(query) {
 const q = norm(query);
 const out = [];
 if ("SERVICO".startsWith(q) && q.length >= 2) {
  out.push({ isGroupDuty: true, score: 300 });
 }
 people.forEach((p, idx) => {
  const nWar = norm(p[5]), nFull = norm(p[1]), nNum = norm(p[0]);
  let score = 0;
  if (!q) score = 50 - idx * 0.1;
  else if (nWar === q || nNum === q || nNum === q.padStart(2, "0")) score = 200;
  else if (nWar.startsWith(q)) score = 150;
  else if (nWar.includes(q)) score = 110;
  else if (nFull.includes(q) || p[2].includes(q)) score = 80;
  if (score > 0) out.push({ isOfficer: false, entry: p, score });
 });
 officers.forEach(o => {
  const nWar = norm(o[3]), nFull = norm(o[0]);
  let score = 0;
  if (q && (nWar === q || nWar.startsWith(q))) score = 140;
  else if (q && nFull.includes(q)) score = 70;
  if (score > 0) out.push({ isOfficer: true, entry: o, score });
 });
 return out.sort((a, b) => b.score - a.score).slice(0, 10);
}

function findSlashCandidates(query) {
 const q = norm(query);
 return getSlashCommands().filter(c => !q || norm(c.cmd.slice(1)).startsWith(q) || norm(c.title).includes(q));
}

function renderSmartPopup() {
 const pop = ensureSmartPopup();
 if (!activeCandidates.length || !activeTa) {
  pop.style.display = "none";
  return;
 }
 const rect = activeTa.getBoundingClientRect();
 const topPos = Math.min(window.innerHeight - 330, Math.max(10, rect.bottom + 4));
 const leftPos = Math.min(window.innerWidth - Math.min(560, window.innerWidth * 0.95), Math.max(10, rect.left));
 pop.style.top = `${topPos}px`;
 pop.style.left = `${leftPos}px`;
 pop.style.display = "block";

 if (activePopupType === "slash") {
  pop.innerHTML = `
   <div class="sp-head"><span>Atalhos Rápidos (/) — Use as setas e Enter ou Tab</span></div>
   <div class="sp-list">
    ${activeCandidates.map((c, idx) => `
     <div class="sp-item ${idx === activeCandIdx ? "active" : ""}" onmousedown="event.preventDefault();applySmartCandidate(${idx})">
      <div><b>${esc(c.cmd)}</b> — ${esc(c.title)}<br><small style="color:#617184">${esc(c.text)}</small></div>
     </div>
    `).join("")}
   </div>`;
  return;
 }

 pop.innerHTML = `
  <div class="sp-head">
   <span>Inserir Militar (@) — Use as setas e Enter ou Tab</span>
   <div class="sp-mode-bar">
    <button type="button" class="sp-mode-btn ${atFormatMode === "full" ? "active" : ""}" onmousedown="event.preventDefault();setAtFormatMode('full')">Completo</button>
    <button type="button" class="sp-mode-btn ${atFormatMode === "war_mat" ? "active" : ""}" onmousedown="event.preventDefault();setAtFormatMode('war_mat')">Só Guerra+Mat</button>
    <button type="button" class="sp-mode-btn ${atFormatMode === "short" ? "active" : ""}" onmousedown="event.preventDefault();setAtFormatMode('short')">Curto (Guerra+Nº)</button>
   </div>
  </div>
  <div class="sp-list">
   ${activeCandidates.map((m, idx) => {
    if (m.isGroupDuty) {
     return `<div class="sp-item ${idx === activeCandIdx ? "active" : ""}" onmousedown="event.preventDefault();applySmartCandidate(${idx})">
      <div><b>@servico — Inserir lista do Efetivo de Serviço selecionado</b></div>
     </div>`;
    }
    const label = m.isOfficer
     ? `<b>${esc(m.entry[2])} ${esc(m.entry[3])}</b> (${esc(m.entry[0])}) · Mat. ${esc(m.entry[1])}`
     : `Nº ${esc(m.entry[0])} — <b>AL OF BM ${esc(m.entry[5])}</b> (${esc(m.entry[1])}) · Mat. ${esc(m.entry[2])}`;
    return `<div class="sp-item ${idx === activeCandIdx ? "active" : ""}" onmousedown="event.preventDefault();applySmartCandidate(${idx})">
     <div>${label}</div>
     <div class="sp-mini-btns">
      <button type="button" onmousedown="event.preventDefault();event.stopPropagation();applySmartCandidate(${idx},'full')">Completo</button>
      <button type="button" onmousedown="event.preventDefault();event.stopPropagation();applySmartCandidate(${idx},'war_mat')">Guerra+Mat</button>
      <button type="button" onmousedown="event.preventDefault();event.stopPropagation();applySmartCandidate(${idx},'short')">Curto</button>
     </div>
    </div>`;
   }).join("")}
  </div>`;
}

window.applySmartCandidate = function(idx, customMode) {
 const cand = activeCandidates[idx];
 if (!cand || !activeTa) return;
 let replacement = "";
 if (activePopupType === "slash") {
  replacement = cand.text;
 } else if (cand.isGroupDuty) {
  const dutyList = getOrderedDutyList();
  replacement = dutyList.length
   ? dutyList.map(x => formatMilitaryMention(x.p, false, customMode || atFormatMode)).join(";\n")
   : "";
 } else {
  replacement = formatMilitaryMention(cand.entry, cand.isOfficer, customMode || atFormatMode);
 }
 const v = activeTa.value;
 activeTa.value = v.slice(0, activeTokenStart) + replacement + v.slice(activeTokenEnd);
 const newPos = activeTokenStart + replacement.length;
 activeTa.selectionStart = activeTa.selectionEnd = newPos;
 ensureSmartPopup().style.display = "none";
 activeCandidates = [];
 if (activeTa.id === "previewDirectTextarea" && activeDirectLinkedFieldId) {
  const linked = $(activeDirectLinkedFieldId);
  if (linked) linked.value = activeTa.value;
 }
 renderLineChipsForTextarea(activeTa);
 renderPreview();
 triggerAutoSave();
};

// Alternador de Modo de Visão (100% Escrita, Foco na Escrita, 50%/50%, Foco na Prévia)
window.setAppViewMode = function(mode) {
 const rsRoot = document.getElementById("rsAppRoot");
 if (rsRoot) {
  rsRoot.classList.remove("vm-write-full", "vm-write-focus", "vm-preview-focus");
  if (mode === "write-full") rsRoot.classList.add("vm-write-full");
  else if (mode === "write-focus") rsRoot.classList.add("vm-write-focus");
  else if (mode === "preview-focus") rsRoot.classList.add("vm-preview-focus");
 }
 const bar = $("viewModeBar");
 if (bar) {
  bar.querySelectorAll(".vm-btn").forEach(b => b.classList.toggle("active", b.dataset.mode === mode));
 }
 try { localStorage.setItem("abm_view_mode_pref", mode); } catch(e) {}
};
try {
 const savedVm = localStorage.getItem("abm_view_mode_pref");
 if (savedVm && ["write-full", "write-focus", "split", "preview-focus"].includes(savedVm)) {
  setTimeout(() => window.setAppViewMode(savedVm), 50);
 }
} catch(e) {}

// Contadores ao vivo nas gavetas retráteis de Material a Cargo (1.1, 1.2, 1.3)
window.toggleAllMatDrawers = function(openState) {
 ["drawer_matAluno", "drawer_matMasc", "drawer_matFem"].forEach(id => {
  const el = $(id);
  if (el) el.open = !!openState;
 });
};

window.toggleAllMainDrawers = function(openState) {
 document.querySelectorAll("details.sec-drawer, details.mat-drawer").forEach(el => {
  el.open = !!openState;
 });
};

window.toggleAllInfoDrawers = function(mode) {
 const infoIds = ["infoDormMEsp", "infoDormMGua", "infoBathM", "infoDormFEsp", "infoDormFGua", "infoBathF", "infoCommon"];
 infoIds.forEach(fid => {
  const dr = $(`drawer_${fid}`);
  const ta = $(fid);
  if (!dr || !ta) return;
  if (mode === "filled") {
   const count = parseStructuredLines(ta.value, false).length + photoData.filter(p => p.section === fid).length;
   dr.open = count > 0;
  } else {
   dr.open = !!mode;
  }
 });
};

function setStatusPillState(badgeEl, count, emptyLabel, singularLabel, pluralLabel) {
 if (!badgeEl) return;
 if (count > 0) {
  badgeEl.textContent = `${count} ${count === 1 ? singularLabel : pluralLabel}`;
  badgeEl.classList.remove("status-empty");
  badgeEl.classList.add("status-filled");
 } else {
  badgeEl.textContent = emptyLabel;
  badgeEl.classList.remove("status-filled");
  badgeEl.classList.add("status-empty");
 }
}

function updateMaterialSummaryBadges() {
 const configs = [
  { sec: "matAluno", cls: "matcheck-aluno", total: materialsAluno.length, extraId: "extraMatAluno" },
  { sec: "matMasc",  cls: "matcheck-masc",  total: materialsMasc.length,  extraId: "extraMatMasc" },
  { sec: "matFem",   cls: "matcheck-fem",   total: materialsFem.length,   extraId: "extraMatFem" }
 ];
 configs.forEach(c => {
  const badge = $(`summaryBadge_${c.sec}`);
  if (!badge) return;
  const checkedCount = document.querySelectorAll(`.${c.cls}:checked`).length;
  const extraCount = $(c.extraId) ? parseStructuredLines($(c.extraId).value, false).filter(x => x.type === "bullet").length : 0;
  badge.textContent = `${checkedCount}/${c.total} fixos${extraCount > 0 ? ` + ${extraCount} extra${extraCount > 1 ? "s" : ""}` : ""}`;
 });

 const countItemsInField = (fid) => {
  const ta = $(fid);
  const manual = ta ? parseStructuredLines(ta.value, false).length : 0;
  const photos = (typeof photoData !== "undefined" && Array.isArray(photoData)) ? photoData.filter(p => p.section === fid).length : 0;
  return manual + photos;
 };

 const totalChanges = countItemsInField("changesDuty") + countItemsInField("changes2025") + countItemsInField("changes2026");
 setStatusPillState($("summaryBadge_changes"), totalChanges, "Sem alterações", "alteração", "alterações");
 setStatusPillState($("summaryBadge_received"), countItemsInField("received"), "Não consta", "documento", "documentos");
 setStatusPillState($("summaryBadge_delivered"), countItemsInField("delivered"), "Não consta", "documento", "documentos");
 setStatusPillState($("summaryBadge_misc"), countItemsInField("misc"), "Não consta", "item", "itens");

 const infoFields = ["infoDormMEsp", "infoDormMGua", "infoBathM", "infoDormFEsp", "infoDormFGua", "infoBathF", "infoCommon"];
 infoFields.forEach(fid => {
  setStatusPillState($(`summaryBadge_${fid}`), countItemsInField(fid), "Não consta", "alteração", "alterações");
 });

 const pCount = (typeof photoData !== "undefined" && Array.isArray(photoData)) ? photoData.length : 0;
 setStatusPillState($("summaryBadge_photos"), pCount, "0 fotos", "foto", "fotos");
}

// Micro-barra de Formatação Contextual Única (aparece apenas na caixa de texto em que o usuário clicou, sem poluir o programa!)
let ctxToolbarEl = null;
let ctxActiveTextarea = null;
let ctxHideTimer = null;

function ensureCtxFormatToolbar() {
 if (!ctxToolbarEl) {
  ctxToolbarEl = document.createElement("div");
  ctxToolbarEl.id = "ctxFormatToolbar";
  ctxToolbarEl.className = "ctx-format-bar";
  ctxToolbarEl.innerHTML = `
   <span class="ctx-label">Formatar:</span>
   <button type="button" onmousedown="event.preventDefault();runCtxFormatAction('bullet')" title="Inserir tópico com bolinha (•)">• Bolinha</button>
   <button type="button" onmousedown="event.preventDefault();runCtxFormatAction('free')" title="Escrever linha sem bolinha (ou remover bolinha da linha atual)">¶ Sem bolinha</button>
   <button type="button" onmousedown="event.preventDefault();runCtxFormatAction('spacer')" title="Inserir linha em branco para separar blocos">↵ Linha vazia</button>
   <button type="button" onmousedown="event.preventDefault();runCtxFormatAction('indent')" title="Adicionar recuo (Tab / 4 espaços)">⇥ Recuo</button>
   <button type="button" onmousedown="event.preventDefault();runCtxFormatAction('bold')" title="Colocar texto selecionado em Negrito (Ctrl+B)"><b>B</b> Negrito</button>
   <button type="button" onmousedown="event.preventDefault();runCtxFormatAction('at')" title="Inserir Aluno ou Oficial formatado (@)">@Militar</button>
   <button type="button" onmousedown="event.preventDefault();runCtxFormatAction('slash')" title="Inserir frase pronta da rotina (/)">/Frases</button>
   <button type="button" onmousedown="event.preventDefault();runCtxFormatAction('expand')" style="margin-left:auto" title="Aumentar ou reduzir o tamanho desta caixa">⤢ Altura</button>
  `;
 }
 return ctxToolbarEl;
}

function attachCtxToolbarToTextarea(ta) {
 if (!ta) return;
 if (ctxHideTimer) { clearTimeout(ctxHideTimer); ctxHideTimer = null; }
 ctxActiveTextarea = ta;
 const bar = ensureCtxFormatToolbar();
 if (ta.previousElementSibling !== bar) {
  ta.insertAdjacentElement("beforebegin", bar);
 }
 bar.classList.add("visible");
}

function scheduleHideCtxToolbar(ta) {
 if (ctxHideTimer) clearTimeout(ctxHideTimer);
 ctxHideTimer = setTimeout(() => {
  if (ctxActiveTextarea === ta && ctxToolbarEl) {
   ctxToolbarEl.classList.remove("visible");
  }
 }, 180);
}

window.runCtxFormatAction = function(action) {
 const ta = ctxActiveTextarea;
 if (!ta) return;
 if (ctxHideTimer) { clearTimeout(ctxHideTimer); ctxHideTimer = null; }
 ta.focus();
 const s = ta.selectionStart, e = ta.selectionEnd, v = ta.value;

 if (action === "bullet") {
  const lineStart = v.lastIndexOf("\n", s - 1) + 1;
  const lineEndIdx = v.indexOf("\n", s);
  const lineEnd = lineEndIdx === -1 ? v.length : lineEndIdx;
  const curLine = v.slice(lineStart, lineEnd);
  if (/^\s*•/.test(curLine)) {
   // Se a linha atual já tem bolinha, cria um novo tópico abaixo
   const insert = "\n• ";
   ta.value = v.slice(0, e) + insert + v.slice(e);
   ta.selectionStart = ta.selectionEnd = e + insert.length;
  } else {
   // Transforma a linha atual em tópico com bolinha
   const cleanLine = curLine.replace(/^\s*/, "");
   const rep = `• ${cleanLine}`;
   ta.value = v.slice(0, lineStart) + rep + v.slice(lineEnd);
   ta.selectionStart = ta.selectionEnd = lineStart + rep.length;
  }
 } else if (action === "free") {
  const lineStart = v.lastIndexOf("\n", s - 1) + 1;
  const lineEndIdx = v.indexOf("\n", s);
  const lineEnd = lineEndIdx === -1 ? v.length : lineEndIdx;
  const curLine = v.slice(lineStart, lineEnd);
  if (/^\s*•/.test(curLine)) {
   // Remove a bolinha da linha atual imediatamente!
   const withoutBullet = curLine.replace(/^\s*•+\s?/, "");
   ta.value = v.slice(0, lineStart) + withoutBullet + v.slice(lineEnd);
   ta.selectionStart = ta.selectionEnd = lineStart + withoutBullet.length;
  } else {
   // Insere nova linha livre sem bolinha
   const nl = (s > 0 && v[s - 1] !== "\n") ? "\n" : "";
   ta.value = v.slice(0, s) + nl + v.slice(e);
   ta.selectionStart = ta.selectionEnd = s + nl.length;
  }
 } else if (action === "spacer") {
  const prefix = (s > 0 && v[s - 1] !== "\n") ? "\n\n" : "\n";
  ta.value = v.slice(0, s) + prefix + v.slice(e);
  ta.selectionStart = ta.selectionEnd = s + prefix.length;
 } else if (action === "indent") {
  ta.value = v.slice(0, s) + "    " + v.slice(e);
  ta.selectionStart = ta.selectionEnd = s + 4;
 } else if (action === "bold") {
  const sel = v.slice(s, e) || "negrito";
  ta.value = v.slice(0, s) + `**${sel}**` + v.slice(e);
  ta.selectionStart = s + 2;
  ta.selectionEnd = s + 2 + sel.length;
 } else if (action === "at") {
  const needSpace = (s > 0 && !/[\s(•\-]/.test(v[s - 1])) ? " " : "";
  const ins = `${needSpace}@`;
  ta.value = v.slice(0, s) + ins + v.slice(e);
  ta.selectionStart = ta.selectionEnd = s + ins.length;
  ta.dispatchEvent(new Event("input"));
  return;
 } else if (action === "slash") {
  const needSpace = (s > 0 && !/[\s(•\-]/.test(v[s - 1])) ? " " : "";
  const ins = `${needSpace}/`;
  ta.value = v.slice(0, s) + ins + v.slice(e);
  ta.selectionStart = ta.selectionEnd = s + ins.length;
  ta.dispatchEvent(new Event("input"));
  return;
 } else if (action === "expand") {
  const curH = parseInt(ta.style.minHeight || "76", 10);
  ta.style.minHeight = curH < 200 ? "260px" : "76px";
  return;
 }

 if (ta.id === "previewDirectTextarea" && activeDirectLinkedFieldId) {
  const linked = $(activeDirectLinkedFieldId);
  if (linked) linked.value = ta.value;
 }
 renderLineChipsForTextarea(ta);
 renderPreview();
 triggerAutoSave();
};

function initBulletTextareas() {
 document.querySelectorAll(".bullet-input").forEach(ta => {
  ta.addEventListener("focus", () => {
   attachCtxToolbarToTextarea(ta);
   if (ta.value === "") {
    ta.value = "• ";
    ta.selectionStart = ta.selectionEnd = ta.value.length;
   }
   const secKey = fieldToPreviewSectionMap[ta.id];
   if (secKey) focusPreviewSection(secKey);
  });

  ta.addEventListener("keydown", e => {
   const pop = ensureSmartPopup();
   if (pop.style.display === "block" && activeCandidates.length > 0 && activeTa === ta) {
    if (e.key === "ArrowDown") { e.preventDefault(); activeCandIdx = (activeCandIdx + 1) % activeCandidates.length; renderSmartPopup(); return; }
    if (e.key === "ArrowUp") { e.preventDefault(); activeCandIdx = (activeCandIdx - 1 + activeCandidates.length) % activeCandidates.length; renderSmartPopup(); return; }
    if (e.key === "Enter" || e.key === "Tab") { e.preventDefault(); applySmartCandidate(activeCandIdx); return; }
    if (e.key === "Escape") { e.preventDefault(); pop.style.display = "none"; activeCandidates = []; return; }
   }

   if (e.key === "Tab") {
    e.preventDefault();
    const s = ta.selectionStart, end = ta.selectionEnd, v = ta.value;
    ta.value = v.slice(0, s) + "    " + v.slice(end);
    ta.selectionStart = ta.selectionEnd = s + 4;
    renderPreview(); triggerAutoSave();
    return;
   }

   if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
    e.preventDefault();
    const s = ta.selectionStart, end = ta.selectionEnd, v = ta.value;
    const sel = v.slice(s, end) || "texto";
    ta.value = v.slice(0, s) + `**${sel}**` + v.slice(end);
    ta.selectionStart = s + 2; ta.selectionEnd = s + 2 + sel.length;
    renderPreview(); triggerAutoSave();
    return;
   }

   if (e.key === "Enter") {
    e.preventDefault();
    const s = ta.selectionStart, end = ta.selectionEnd, v = ta.value;
    const lineStart = v.lastIndexOf("\n", s - 1) + 1;
    const currentLine = v.slice(lineStart, s);

    if (e.shiftKey) {
     ta.value = v.slice(0, s) + "\n" + v.slice(end);
     ta.selectionStart = ta.selectionEnd = s + 1;
    } else if (/^\s*•\s*$/.test(currentLine)) {
     // Apertar Enter numa linha que só tem "• " remove a bolinha automaticamente para você escrever livremente!
     ta.value = v.slice(0, lineStart) + v.slice(end);
     ta.selectionStart = ta.selectionEnd = lineStart;
    } else if (/^\s*•/.test(currentLine)) {
     const insert = "\n• ";
     ta.value = v.slice(0, s) + insert + v.slice(end);
     ta.selectionStart = ta.selectionEnd = s + insert.length;
    } else {
     const leadIndent = (currentLine.match(/^( +)/) || ["", ""])[1];
     const insert = "\n" + leadIndent;
     ta.value = v.slice(0, s) + insert + v.slice(end);
     ta.selectionStart = ta.selectionEnd = s + insert.length;
    }
    renderLineChipsForTextarea(ta);
    renderPreview();
    const secKey = fieldToPreviewSectionMap[ta.id];
    if (secKey) focusPreviewSection(secKey);
    triggerAutoSave();
   }
  });

  ta.addEventListener("input", () => {
   let pos = ta.selectionStart;
   let val = ta.value;
   const before = val.slice(0, pos);

   // 1. Converter "- " ou "* " no início da linha para "• "
   const bulletShortcut = before.match(/(^|\n)( *)[\-*] $/);
   if (bulletShortcut) {
    const prefixLen = bulletShortcut[0].length;
    const replacement = `${bulletShortcut[1]}${bulletShortcut[2]}• `;
    ta.value = val.slice(0, pos - prefixLen) + replacement + val.slice(pos);
    pos = pos - prefixLen + replacement.length;
    ta.selectionStart = ta.selectionEnd = pos;
    val = ta.value;
   }

   // 2. Converter horário militar rápido: "14:21h " -> "14h21min "
   const timeShortcut = val.slice(0, pos).match(/\b(\d{2}):(\d{2})[hH](\s|[.,;)])$/);
   if (timeShortcut) {
    const fullMatch = timeShortcut[0];
    const replacement = `${timeShortcut[1]}h${timeShortcut[2]}min${timeShortcut[3]}`;
    ta.value = val.slice(0, pos - fullMatch.length) + replacement + val.slice(pos);
    pos = pos - fullMatch.length + replacement.length;
    ta.selectionStart = ta.selectionEnd = pos;
    val = ta.value;
   }

   const curBefore = val.slice(0, pos);

   // 3. Auto-expansão imediata se digitar @nome_exato seguido de vírgula ou ponto-e-vírgula
   const exactAt = curBefore.match(/(?:^|[\s(•\-])@([A-Za-zÀ-ÿ0-9]+(?:\s+[A-Za-zÀ-ÿ0-9]+)?)([,;:])$/);
   if (exactAt) {
    const qNorm = norm(exactAt[1]);
    const punc = exactAt[2];
    const exactP = people.find(p => norm(p[5]) === qNorm || norm(p[0]) === qNorm);
    if (exactP) {
     const atIdx = curBefore.lastIndexOf("@");
     const rep = formatMilitaryMention(exactP, false, atFormatMode) + punc;
     ta.value = val.slice(0, atIdx) + rep + val.slice(pos);
     ta.selectionStart = ta.selectionEnd = atIdx + rep.length;
     ensureSmartPopup().style.display = "none";
     activeCandidates = [];
     renderLineChipsForTextarea(ta);
     renderPreview();
     triggerAutoSave();
     return;
    }
   }

   // 4. Detectar @militar ou /atalho aberto
   const atMatch = curBefore.match(/(?:^|[\s(•\-])@([A-Za-zÀ-ÿ0-9]{0,22})$/);
   const slashMatch = curBefore.match(/(?:^|[\s(•\-])\/([A-Za-zÀ-ÿ0-9]{0,15})$/);

   if (atMatch) {
    activeTa = ta;
    activePopupType = "at";
    activeTokenStart = curBefore.lastIndexOf("@");
    activeTokenEnd = pos;
    activeCandidates = findAtCandidates(atMatch[1]);
    activeCandIdx = 0;
    renderSmartPopup();
   } else if (slashMatch) {
    activeTa = ta;
    activePopupType = "slash";
    activeTokenStart = curBefore.lastIndexOf("/");
    activeTokenEnd = pos;
    activeCandidates = findSlashCandidates(slashMatch[1]);
    activeCandIdx = 0;
    renderSmartPopup();
   } else {
    ensureSmartPopup().style.display = "none";
    activeCandidates = [];
   }

   renderLineChipsForTextarea(ta);
   renderPreview();
   const secKey = fieldToPreviewSectionMap[ta.id];
   if (secKey) focusPreviewSection(secKey);
   triggerAutoSave();
  });

  ta.addEventListener("blur", () => {
   scheduleHideCtxToolbar(ta);
   setTimeout(() => { if (activeTa === ta) ensureSmartPopup().style.display = "none"; }, 200);
   if (ta.value.trim() === "•") {
    ta.value = "";
   }
   renderLineChipsForTextarea(ta);
   renderPreview();
   triggerAutoSave();
  });
 });
}
initBulletTextareas();

function boldWarName(fullName, warName) {
 if (!warName || !warName.trim()) return esc(fullName);
 const fnNorm = norm(fullName);
 const wnNorm = norm(warName);
 const idx = fnNorm.indexOf(wnNorm);
 if (idx !== -1) {
  const before = fullName.slice(0, idx);
  const match = fullName.slice(idx, idx + wnNorm.length);
  const after = fullName.slice(idx + wnNorm.length);
  return `${esc(before)}<b>${esc(match)}</b>${esc(after)}`;
 }
 const words = wnNorm.split(/\s+/).filter(Boolean);
 return fullName.split(/(\s+)/).map(token => {
  if (words.includes(norm(token))) return `<b>${esc(token)}</b>`;
  return esc(token);
 }).join("");
}

let savedOfficerWar = {};
try { savedOfficerWar = JSON.parse(localStorage.getItem("abm_officer_warnames_v10") || "{}"); } catch(e) {}
function getOfficerWar(idx) {
 return savedOfficerWar[idx] !== undefined ? savedOfficerWar[idx] : (officers[idx]?.[3] || "");
}
function setOfficerWar(idx, val) {
 savedOfficerWar[idx] = val;
 try { localStorage.setItem("abm_officer_warnames_v10", JSON.stringify(savedOfficerWar)); } catch(e) {}
}

function fillCadetSelect(id) {
 const el = $(id);
 el.innerHTML = '<option value="">— Selecione —</option>' + people.map((p, i) =>
  `<option value="${i}">Nº ${esc(p[0])} — AL OF BM ${esc(p[5])} (${esc(p[1])}) · Mat. ${esc(p[2])}</option>`
 ).join("");
}
fillCadetSelect("student");
fillCadetSelect("nextStudent");
$("student").value = "6";

let previousStudentIdx = null;
let isRestoringState = false;

function setSleepCheckboxState(idx, checkedState) {
 const sleepCb = $(`sleep_${idx}`);
 if (sleepCb) {
  sleepCb.checked = checkedState;
  sleepCb.closest(".person")?.classList.toggle("selected", checkedState);
 }
}

function syncStudentSelectionToDuty(autoCheckSleep = true) {
 const sVal = $("student").value;
 const newIdx = sVal === "" ? null : Number(sVal);

 if (previousStudentIdx !== null && previousStudentIdx !== newIdx) {
  const prevCb = $(`duty_${previousStudentIdx}`);
  const prevRole = document.querySelector(`.role[data-i="${previousStudentIdx}"]`);
  const prevRow = prevCb?.closest(".person");
  const prevBadge = $(`duty_student_badge_${previousStudentIdx}`);
  if (prevCb) {
   prevCb.disabled = false;
   prevCb.checked = false;
  }
  if (prevRole) prevRole.value = "Sentinela";
  if (prevRow) {
   prevRow.classList.remove("selected", "is-student");
  }
  if (prevBadge) prevBadge.style.display = "none";
  if (autoCheckSleep && !isRestoringState) {
   setSleepCheckboxState(previousStudentIdx, false);
  }
 }

 if (newIdx !== null) {
  const cb = $(`duty_${newIdx}`);
  const roleSel = document.querySelector(`.role[data-i="${newIdx}"]`);
  const row = cb?.closest(".person");
  const badge = $(`duty_student_badge_${newIdx}`);
  if (cb) {
   cb.checked = true;
   cb.disabled = true;
  }
  if (row) {
   row.classList.add("selected", "is-student");
  }
  if (roleSel) {
   roleSel.value = "Aluno de Dia";
  }
  if (badge) badge.style.display = "inline-block";
  if (autoCheckSleep && !isRestoringState) {
   setSleepCheckboxState(newIdx, true);
  }
 }

 const studentEntry = newIdx !== null ? people[newIdx] : null;
 document.querySelectorAll(".role").forEach(sel => {
  const idx = Number(sel.dataset.i);
  const pEntry = people[idx];
  const optAluno = sel.querySelector('option[value="Aluno de Dia"]');
  const optAdj = sel.querySelector('option[value="Adjunto do Aluno de Dia"]');
  if (optAluno) optAluno.textContent = formatDutyRoleLabel("Aluno de Dia", pEntry, studentEntry);
  if (optAdj) optAdj.textContent = formatDutyRoleLabel("Adjunto do Aluno de Dia", pEntry, studentEntry);
 });
 if (newIdx !== null) {
  const badge = $(`duty_student_badge_${newIdx}`);
  if (badge) badge.textContent = `1º — ${getStudentTitleByGender(studentEntry)} (fixo)`;
 }
 previousStudentIdx = newIdx;
 syncDutyToSleepBadges();
 updateDutyCount();
}

// Quando outro Aluno de Dia seleciona seu nome no mesmo PC, verifica se ele tem um rascunho próprio salvo
$("student").addEventListener("change", async () => {
 const chosenIdx = $("student").value;
 syncStudentSelectionToDuty();
 if (!isRestoringState && chosenIdx !== "") {
  const savedForStudent = await loadDraftForStudent(chosenIdx);
  if (savedForStudent && savedForStudent.student === chosenIdx) {
   const p = people[Number(chosenIdx)];
   const timeStr = savedForStudent.savedAt ? new Date(savedForStudent.savedAt).toLocaleTimeString("pt-BR") : "";
   if (await askAppConfirm(`Foi encontrado um rascunho salvo neste dispositivo para o Aluno de Dia AL OF BM ${p[5]} (${timeStr}). Deseja retomar esse preenchimento?\n\nClique em Cancelar para iniciar um relatório limpo para ${p[5]}.`, "Retomar Rascunho Salvo")) {
    setState(savedForStudent);
    showToast(`Rascunho de AL OF BM ${p[5]} restaurado!`);
    return;
   }
  }
 }
 triggerAutoSave();
});

function plusTime(dateStr, timeStr, hoursToAdd) {
 const [h, m] = (timeStr || "07:00").split(":").map(Number);
 const d = new Date((dateStr || getTodayISO()) + "T00:00:00");
 d.setHours(h + hoursToAdd, m, 0, 0);
 const yyyy = d.getFullYear();
 const mm = String(d.getMonth() + 1).padStart(2, "0");
 const dd = String(d.getDate()).padStart(2, "0");
 const hh = String(d.getHours()).padStart(2, "0");
 const min = String(d.getMinutes()).padStart(2, "0");
 return { date: `${yyyy}-${mm}-${dd}`, time: `${hh}:${min}` };
}

function fmtDate(s) {
 if (!s) return "____/____/______";
 const [y, m, d] = s.split("-");
 return `${d}/${m}/${y}`;
}

function renderOfficerFields() {
 const is12 = $("officerMode").value === "12";
 const count = is12 ? 2 : 1;
 const prevVals = [1, 2].map(n => $(`officer${n}`) ? $(`officer${n}`).value : "");
 const date = $("assumeDate").value || getTodayISO();
 const offStartTime = "07:00";
 const offEnd1 = plusTime(date, offStartTime, is12 ? 12 : 24);
 const offEnd24 = plusTime(date, offStartTime, 24);

 let html = "";
 for (let n = 1; n <= count; n++) {
  const shiftLabel = is12
   ? (n === 1 ? `1º Turno (12h): das 07:00h de ${fmtDate(date)} às ${offEnd1.time}h de ${fmtDate(offEnd1.date)}`
              : `2º Turno (12h — fechando 24h): das ${offEnd1.time}h de ${fmtDate(offEnd1.date)} às ${offEnd24.time}h de ${fmtDate(offEnd24.date)}`)
   : `Turno de 24h: das 07:00h de ${fmtDate(date)} às ${offEnd24.time}h de ${fmtDate(offEnd24.date)}`;

  html += `<div class="officercard">
   <div class="field" style="margin-bottom:8px">
    <label for="officer${n}">${is12 ? `${n}º Oficial de Dia` : `Oficial de Dia (24h — 07:00h às 07:00h)`}</label>
    <select id="officer${n}">
     <option value="">— Selecione o Oficial de Dia —</option>
     ${officers.map((o, i) => `<option value="${i}">${esc(o[2])} ${esc(o[0])} · Mat. ${esc(o[1])}</option>`).join("")}
    </select>
    <div class="hint">${esc(shiftLabel)}</div>
   </div>
   <div class="field" style="margin-bottom:0">
    <label for="officerWar${n}">Nome de Guerra do ${is12 ? `${n}º ` : ""}Oficial de Dia (destacado em negrito no relatório)</label>
    <input id="officerWar${n}" placeholder="Ex.: CARIBÉ, AMARO, EMERSON...">
   </div>
  </div>`;
 }
 $("officerFields").innerHTML = html;

 for (let n = 1; n <= count; n++) {
  const sel = $(`officer${n}`);
  const warInput = $(`officerWar${n}`);
  if (prevVals[n - 1] !== "" && officers[Number(prevVals[n - 1])]) {
   sel.value = prevVals[n - 1];
   warInput.value = getOfficerWar(Number(sel.value));
  }
  sel.addEventListener("change", () => {
   if (sel.value !== "") {
    warInput.value = getOfficerWar(Number(sel.value));
   } else {
    warInput.value = "";
   }
   renderPreview();
   triggerAutoSave();
  });
  warInput.addEventListener("input", () => {
   if (sel.value !== "") {
    setOfficerWar(Number(sel.value), warInput.value);
   }
   renderPreview();
   triggerAutoSave();
  });
 }
 renderPreview();
}

$("addCustomOfficerBtn").addEventListener("click", () => {
 const rank = $("newOffRank").value.trim().toUpperCase() || "TEN QOBM";
 const mat = $("newOffMat").value.trim() || "S/M";
 const name = $("newOffName").value.trim().toUpperCase();
 const war = $("newOffWar").value.trim().toUpperCase();
 if (!name) {
  showToast("Informe pelo menos o Nome Completo do Oficial de Dia.");
  return;
 }
 const finalWar = war || name.split(/\s+/)[0];
 const newEntry = [name, mat, rank, finalWar];
 customOfficers.push(newEntry);
 try { localStorage.setItem("abm_custom_officers_v10", JSON.stringify(customOfficers)); } catch(e) {}
 officers = [...defaultOfficers, ...customOfficers];
 const newIndex = String(officers.length - 1);
 renderOfficerFields();
 if ($("officer1")) {
  $("officer1").value = newIndex;
  if ($("officerWar1")) $("officerWar1").value = finalWar;
 }
 $("newOffRank").value = "";
 $("newOffMat").value = "";
 $("newOffName").value = "";
 $("newOffWar").value = "";
 renderPreview();
 triggerAutoSave();
 showToast(`Oficial ${rank} ${finalWar} adicionado à lista e selecionado!`);
});

let dutyGroupFilter = "Todos";
function renderDuty() {
 const list = $("dutyList");
 list.innerHTML = "";
 people.forEach((p, i) => {
  const div = document.createElement("div");
  div.className = "person";
  div.dataset.search = `${p[0]} ${p[1]} ${p[2]} ${p[3]} ${p[5]}`.toLowerCase();
  div.dataset.group = p[3];
  div.innerHTML = `
   <input type="checkbox" class="dutycheck" id="duty_${i}">
   <div class="person-body">
    <label for="duty_${i}" style="margin:0;cursor:pointer;font-weight:500;font-size:12.5px">
     Nº ${esc(p[0])} — <b>AL OF BM</b> ${boldWarName(p[1], p[5])}
     <span class="student-badge" id="duty_student_badge_${i}" style="display:none">1º — Aluno de Dia (fixo)</span>
    </label>
    <small>Matrícula: ${esc(p[2])} · Turma: ${esc(p[3])} · Nome de Guerra: <b>${esc(p[5])}</b></small>
    <div class="role-wrap">
     <select class="role" data-i="${i}" style="padding:6px;font-size:12px">
      <option value="Sentinela">Sentinela</option>
      <option value="Aluno de Dia">${p[4] === "F" ? "Aluna de Dia" : "Aluno de Dia"}</option>
      <option value="Adjunto do Aluno de Dia">${p[4] === "F" ? "Adjunta do(a) Aluno(a) de Dia" : "Adjunto do(a) Aluno(a) de Dia"}</option>
      <option value="Comandante da Guarda">Comandante da Guarda</option>
      <option value="Auxiliar">Auxiliar</option>
      <option value="Plantão">Plantão</option>
     </select>
    </div>
   </div>`;
  list.appendChild(div);
  const cb = div.querySelector(".dutycheck");
  cb.addEventListener("change", () => {
   div.classList.toggle("selected", cb.checked);
   setSleepCheckboxState(i, cb.checked);
   syncDutyToSleepBadges();
   updateDutyCount();
   triggerAutoSave();
  });
  div.querySelector(".role").addEventListener("change", () => {
   renderPreview();
   triggerAutoSave();
  });
 });

 const applyFilter = () => {
  const q = $("dutySearch").value.toLowerCase().trim();
  list.querySelectorAll(".person").forEach(row => {
   const matchGroup = dutyGroupFilter === "Todos" || row.dataset.group === dutyGroupFilter;
   const matchSearch = row.dataset.search.includes(q);
   row.style.display = (matchGroup && matchSearch) ? "flex" : "none";
  });
  $("dutyGroups").querySelectorAll("button").forEach(b => b.classList.toggle("active", b.dataset.group === dutyGroupFilter));
 };

 $("dutySearch").oninput = applyFilter;
 $("dutyGroups").querySelectorAll("button").forEach(b => {
  b.onclick = () => { dutyGroupFilter = b.dataset.group; applyFilter(); };
 });
 $("dutySelectVisible").onclick = () => {
  list.querySelectorAll(".person").forEach(row => {
   if (row.style.display !== "none") {
    const cb = row.querySelector(".dutycheck");
    const idx = Number(cb.id.split("_")[1]);
    cb.checked = true;
    row.classList.add("selected");
    setSleepCheckboxState(idx, true);
   }
  });
  syncDutyToSleepBadges();
  updateDutyCount();
  triggerAutoSave();
 };
 $("dutyClearVisible").onclick = () => {
  const studentIdx = $("student").value === "" ? null : Number($("student").value);
  list.querySelectorAll(".person").forEach(row => {
   if (row.style.display !== "none") {
    const cb = row.querySelector(".dutycheck");
    const idx = Number(cb.id.split("_")[1]);
    if (idx === studentIdx) return;
    cb.checked = false;
    row.classList.remove("selected");
    setSleepCheckboxState(idx, false);
   }
  });
  syncDutyToSleepBadges();
  updateDutyCount();
  triggerAutoSave();
 };
 applyFilter();
 syncStudentSelectionToDuty();
}

function getOrderedDutyList() {
 const studentVal = $("student").value;
 const studentIdx = studentVal === "" ? null : Number(studentVal);
 const checked = [...document.querySelectorAll(".dutycheck:checked")].map(c => {
  const i = Number(c.id.split("_")[1]);
  const p = people[i];
  const role = document.querySelector(`.role[data-i="${i}"]`).value;
  return { i, p, role };
 });

 const result = [];
 if (studentIdx !== null) {
  const existing = checked.find(x => x.i === studentIdx);
  result.push({
   i: studentIdx,
   p: people[studentIdx],
   role: existing ? existing.role : "Aluno de Dia"
  });
 }
 checked.forEach(item => {
  if (item.i !== studentIdx) result.push(item);
 });
 const roleRank = { "Aluno de Dia": 1, "Aluna de Dia": 1, "Adjunto do Aluno de Dia": 2, "Adjunta do Aluno de Dia": 2, "Adjunto da Aluna de Dia": 2, "Adjunta da Aluna de Dia": 2, "Comandante da Guarda": 3 };
 result.sort((a, b) => {
  const rA = roleRank[a.role] || 4;
  const rB = roleRank[b.role] || 4;
  return rA - rB;
 });
 return result;
}

function syncDutyToSleepBadges() {
 const studentVal = $("student").value;
 const studentIdx = studentVal === "" ? null : Number(studentVal);
 people.forEach((_, i) => {
  const isDuty = $(`duty_${i}`)?.checked || i === studentIdx;
  const isSleeping = $(`sleep_${i}`)?.checked;
  const badge = $(`sleep_duty_badge_${i}`);
  if (badge) {
   badge.style.display = isDuty ? "inline-block" : "none";
   if (isDuty) {
    if (isSleeping) {
     badge.style.background = "#e3f2fd";
     badge.style.color = "#0d47a1";
     badge.textContent = (i === studentIdx) ? "Aluno de Dia (pernoitará — desmarque se sair)" : "De Serviço (pernoitará — desmarque se sair)";
    } else {
     badge.style.background = "#fbe9e7";
     badge.style.color = "#963a31";
     badge.textContent = (i === studentIdx) ? "Aluno de Dia (retirado do pernoite)" : "De Serviço (retirado do pernoite)";
    }
   }
  }
 });
 updateSleepCount();
}

function updateDutyCount() {
 const ordered = getOrderedDutyList();
 $("dutyCount").textContent = fmtSel(ordered.length);
 renderPreview();
}

let sleepGroupFilter = "Todos";
function renderSleep() {
 const list = $("sleepList");
 list.innerHTML = "";
 people.forEach((p, i) => {
  const div = document.createElement("div");
  div.className = "person";
  div.dataset.search = `${p[0]} ${p[1]} ${p[2]} ${p[3]} ${p[5]}`.toLowerCase();
  div.dataset.group = p[3];
  div.dataset.sex = p[4];
  div.dataset.idx = String(i);
  div.innerHTML = `
   <input type="checkbox" class="sleepcheck" id="sleep_${i}">
   <div class="person-body">
    <label for="sleep_${i}" style="margin:0;cursor:pointer;font-weight:500;font-size:12.5px">
     Nº ${esc(p[0])} — <b>AL OF BM</b> ${boldWarName(p[1], p[5])}
     <span class="duty-badge" id="sleep_duty_badge_${i}" style="display:none">De Serviço</span>
    </label>
    <small>Matrícula: ${esc(p[2])} · Turma: ${esc(p[3])} · ${p[4] === "F" ? "Feminino" : "Masculino"}</small>
   </div>`;
  list.appendChild(div);
  const cb = div.querySelector(".sleepcheck");
  cb.addEventListener("change", () => {
   div.classList.toggle("selected", cb.checked);
   syncDutyToSleepBadges();
   triggerAutoSave();
  });
 });

 const applyFilter = () => {
  const q = $("sleepSearch").value.toLowerCase().trim();
  const studentVal = $("student").value;
  const studentIdx = studentVal === "" ? null : Number(studentVal);
  list.querySelectorAll(".person").forEach(row => {
   const idx = Number(row.dataset.idx);
   const isDuty = $(`duty_${idx}`)?.checked || idx === studentIdx;
   const matchGroup = sleepGroupFilter === "Todos"
    || (sleepGroupFilter === "Servico" && isDuty)
    || row.dataset.group === sleepGroupFilter
    || row.dataset.sex === sleepGroupFilter;
   const matchSearch = row.dataset.search.includes(q);
   row.style.display = (matchGroup && matchSearch) ? "flex" : "none";
  });
  $("sleepGroups").querySelectorAll("button").forEach(b => b.classList.toggle("active", b.dataset.group === sleepGroupFilter));
 };

 $("sleepSearch").oninput = applyFilter;
 $("sleepGroups").querySelectorAll("button").forEach(b => {
  b.onclick = () => { sleepGroupFilter = b.dataset.group; applyFilter(); };
 });
 $("sleepSelectVisible").onclick = () => {
  list.querySelectorAll(".person").forEach(row => {
   if (row.style.display !== "none") {
    const cb = row.querySelector(".sleepcheck");
    cb.checked = true;
    row.classList.add("selected");
   }
  });
  syncDutyToSleepBadges();
  triggerAutoSave();
 };
 $("sleepClearVisible").onclick = () => {
  list.querySelectorAll(".person").forEach(row => {
   if (row.style.display !== "none") {
    const cb = row.querySelector(".sleepcheck");
    cb.checked = false;
    row.classList.remove("selected");
   }
  });
  syncDutyToSleepBadges();
  triggerAutoSave();
 };
 $("sleepClearAll").onclick = () => {
  list.querySelectorAll(".sleepcheck").forEach(cb => {
   cb.checked = false;
   cb.closest(".person").classList.remove("selected");
  });
  syncDutyToSleepBadges();
  triggerAutoSave();
 };
 applyFilter();
 syncDutyToSleepBadges();
}

function updateSleepCount() {
 const checkedSleep = document.querySelectorAll(".sleepcheck:checked").length;
 $("sleepCount").textContent = fmtMil(checkedSleep);
 renderPreview();
}

let photoData = [];
$("photos").addEventListener("change", async e => {
 for (const f of e.target.files) {
  if (!f.type.startsWith("image/")) continue;
  const data = await new Promise(res => {
   const r = new FileReader();
   r.onload = () => res(r.result);
   r.readAsDataURL(f);
  });
  photoData.push({
   name: f.name,
   data,
   section: "misc",
   desc: ""
  });
 }
 $("photos").value = "";
 renderPhotos();
 renderPreview();
 triggerAutoSave();
});

function renderPhotos() {
 $("photoList").innerHTML = photoData.map((p, i) => `
  <div class="photocard">
   <div class="photocard-top">
    <img src="${p.data}" alt="Foto ${i + 1}">
    <div class="photocard-body">
     <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
      <strong style="font-size:13px;color:var(--navy)">Foto ${String(i + 1).padStart(2, "0")} — ${esc(p.name)}</strong>
      <button class="danger small" type="button" onclick="removePhoto(${i})">Remover</button>
     </div>
     <div class="field" style="margin-bottom:8px">
      <label style="font-size:12px">Vincular esta foto a qual seção/local do relatório?</label>
      <select onchange="updatePhotoSection(${i}, this.value)" style="padding:6px 8px;font-size:12px">
       ${photoSectionCatalog.map(sec => `<option value="${sec.id}" ${p.section === sec.id ? "selected" : ""}>${esc(sec.label)}</option>`).join("")}
      </select>
     </div>
     <div class="field" style="margin-bottom:0">
      <label style="font-size:12px">Descrição da alteração registrada na Foto ${String(i + 1).padStart(2, "0")}:</label>
      <input type="text" value="${esc(p.desc)}" oninput="updatePhotoDesc(${i}, this.value)" placeholder="Ex.: Torneira com vazamento na bancada principal (constará na seção acima e no Anexo Fotográfico)" style="padding:6px 8px;font-size:12px">
     </div>
    </div>
   </div>
  </div>
 `).join("");
}

window.removePhoto = i => { photoData.splice(i, 1); renderPhotos(); renderPreview(); triggerAutoSave(); };
window.updatePhotoSection = (i, val) => { if (photoData[i]) { photoData[i].section = val; renderPreview(); triggerAutoSave(); } };
window.updatePhotoDesc = (i, val) => { if (photoData[i]) { photoData[i].desc = val; renderPreview(); triggerAutoSave(); } };

const weekday = s => s ? new Date(s + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long" }) : "";

const MILITARY_RANK_REGEX = /\b(AL\s+OF\s+(?:QOBM|BM)|(?:1º\s+|2º\s+)?TEN\s+(?:QOBM|QOABM|QOAPM|BM)|CAP\s+(?:QOBM|QOABM|QOAPM|BM)|MAJ\s+(?:QOBM|BM)|TC\s+(?:QOBM|BM)|TEN\s+CEL\s+(?:QOBM|BM)|CEL\s+(?:QOBM|BM)|SUB\s*TEN\s+BM|(?:1º\s+|2º\s+|3º\s+)?SGT\s+BM|CB\s+BM|SD\s+BM)\b/gi;

function applyAutoRankAsterisks(rawText) {
 const raw = String(rawText ?? "");
 const autoRankOn = $("autoBoldRanksToggle") ? $("autoBoldRanksToggle").checked : true;
 if (!autoRankOn) return raw;
 // Só aplica fora de blocos já entre asteriscos
 const parts = raw.split(/(\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g);
 return parts.map(part => {
  if ((part.startsWith("**") && part.endsWith("**")) || (part.startsWith("*") && part.endsWith("*"))) {
   return part;
  }
  return part.replace(MILITARY_RANK_REGEX, "**$1**");
 }).join("");
}

function stripBoldAsterisks(s) {
 return String(s ?? "")
  .replace(/\*\*([^*\n]+)\*\*/g, "$1")
  .replace(/\*([^*\n]+)\*/g, "$1");
}

function preserveSpacesInHtml(htmlStr) {
 return String(htmlStr ?? "")
  .replace(/\t/g, "    ")
  .replace(/^ +/gm, m => "&nbsp;".repeat(m.length))
  .replace(/ {2,}/g, m => " " + "&nbsp;".repeat(m.length - 1));
}

function formatWhatsAppBold(rawText) {
 const withRanks = applyAutoRankAsterisks(rawText);
 const escaped = esc(withRanks)
  .replace(/\*\*([^*\n]+)\*\*/g, "<b>$1</b>")
  .replace(/\*([^*\n]+)\*/g, "<b>$1</b>");
 return preserveSpacesInHtml(escaped);
}

function parseStructuredLines(s, keepSpacers = true) {
 if (!s || !s.trim()) return [];
 const rawLines = String(s).split(/\r?\n/);
 const temp = [];
 rawLines.forEach(rawLine => {
  const expanded = rawLine.replace(/\t/g, "    ");
  const t = expanded.trim();
  if (!t || t === "•") {
   temp.push({ type: "spacer", text: "", noAutoPunct: true });
   return;
  }
  if (t.startsWith("•")) {
   const leadMatch = expanded.match(/^( +)•/);
   const leadSpaces = leadMatch ? leadMatch[1] : "";
   const afterBullet = expanded.replace(/^\s*•+\s?/, "");
   const hasTrailingSpace = /\s+$/.test(afterBullet);
   const text = leadSpaces + afterBullet.replace(/\s+$/, "");
   if (text.trim()) temp.push({ type: "bullet", text, noAutoPunct: hasTrailingSpace });
  } else {
   temp.push({ type: "subtopic", text: expanded.replace(/\s+$/, ""), noAutoPunct: true });
  }
 });
 while (temp.length && temp[0].type === "spacer") temp.shift();
 while (temp.length && temp[temp.length - 1].type === "spacer") temp.pop();
 return keepSpacers ? temp : temp.filter(x => x.type !== "spacer");
}

function cleanLines(s) {
 return parseStructuredLines(s, false).map(x => stripBoldAsterisks(x.text));
}

function applyAutomaticPunctuation(items) {
 if (!items || !items.length) return [];
 const autoOn = $("autoPunctuationToggle") ? $("autoPunctuationToggle").checked : true;
 if (!autoOn) return items;
 const processed = items.map(item => ({ ...item }));
 const hasSubtopicsOrSpacers = processed.some(x => x.type === "subtopic" || x.type === "spacer");
 let i = 0;
 while (i < processed.length) {
  if (processed[i].type === "bullet") {
   let start = i, end = i;
   while (end < processed.length && processed[end].type === "bullet") end++;
   for (let k = start; k < end; k++) {
    const raw = processed[k].text || "";
    const trimmed = raw.trim();
    if (processed[k].noAutoPunct || /[:!?]$/.test(trimmed)) {
     processed[k].text = raw.replace(/\s+$/, "");
    } else if (hasSubtopicsOrSpacers && /[.;]$/.test(trimmed)) {
     processed[k].text = raw.replace(/\s+$/, "");
    } else {
     const base = raw.replace(/[;.,\s]+$/, "");
     if (base.trim()) {
      processed[k].text = (k < end - 1) ? `${base};` : `${base}.`;
     }
    }
   }
   i = end;
  } else {
   i++;
  }
 }
 return processed;
}

const PT_STOPWORDS = new Set([
 "PARA","COMO","PELO","PELA","PELOS","PELAS","ESTE","ESTA","ESSE","ESSA","ISSO","AQUELE","AQUELA",
 "ENTRE","SOBRE","APOS","ANTE","COM","SEM","POR","DOS","DAS","NOS","NAS","UMA","UNS","UMAS","FOI",
 "FORAM","ESTAO","SER","SAO","TEM","TINHA","MAIS","MENOS","MUITO","TODOS","TODAS","OUTRO","OUTRA",
 "CADA","ONDE","QUANDO","QUAL","QUAIS","DEVIDO","SENDO","FEITO","FEITA","QUE","NAO","SIM","AOS",
 "SEU","SUA","SEUS","SUAS","DELE","DELA","MESMO","MESMA","TAMBEM","AINDA","JUNTOS","JUNTO","ATE",
 "DESDE","DURANTE","CONTRA","PERANTE","SEGUNDO","CONFORME","MEDIANTE","ACERCA","PERTO","LONGE",
 "DENTRO","FORA","ACIMA","ABAIXO","DIANTE","ATRAS","ALEM","AQUEM","ANTES","DEPOIS","AGORA","HOJE",
 "ONTEM","SEMPRE","NUNCA","JAMAIS","TALVEZ","ACASO","APENAS","SOMENTE","QUASE","LOGO","POIS","PORTANTO"
]);

// Palavras genéricas de rotina/relatório que não são o objeto principal da foto (peso muito baixo se aparecerem sozinhas)
const GENERIC_REPORT_WORDS = new Set([
 "ALTERACAO","ALTERACOES","FOTO","FOTOS","IMAGEM","IMAGENS","ANEXO","ANEXOS","REGISTRO","REGISTROS",
 "SERVICO","DIA","TURNO","ALUNO","ALUNA","OFICIAL","CADETE","MILITAR","MILITARES","TURMA","CURSO",
 "ESPADARTE","ESPADARTES","GUARDIAO","GUARDIOES","AREA","LOCAL","SALA","ALOJAMENTO","BANHEIRO",
 "MASCULINO","FEMININO","CONJUNTO","COMUM","RANCHO","ABM","CBMBA","APRESENTANDO","APRESENTA",
 "ENCONTRA","ENCONTRADO","ENCONTRADA","CONSTATADO","CONSTATADA","VERIFICADO","VERIFICADA",
 "OBSERVADO","OBSERVADA","DANIFICADO","DANIFICADA","QUEBRADO","QUEBRADA","DEFEITO","PROBLEMA",
 "SITUACAO","ESTADO","PARTE","LADO","CIMA","BAIXO","FRENTE","FUNDO","MATERIAL","MATERIAIS",
 "EQUIPAMENTO","EQUIPAMENTOS","ITEM","ITENS","UNIDADE","UNIDADES","QUANTIDADE","CONFERENCIA",
 "CAUTELA","PASSAGEM","ASSUNCAO","RECEBIDO","ENTREGUE","NOVO","NOVA","VELHO","VELHA","BOM","BOA"
]);

function getNormalizedKeywords(text) {
 if (!text) return [];
 const clean = norm(stripBoldAsterisks(text)).replace(/[^A-Z0-9\s]/g, " ");
 return clean.split(/\s+/).filter(w => w.length >= 3 && !PT_STOPWORDS.has(w));
}

function stemPt(w) {
 if (!w || w.length < 4) return w;
 return w
  .replace(/OES$/, "AO")
  .replace(/AES$/, "AO")
  .replace(/AIS$/, "AL")
  .replace(/EIS$/, "EL")
  .replace(/OIS$/, "OL")
  .replace(/NS$/, "M")
  .replace(/S$/, "");
}

function extractPhotoTokens(descText) {
 if (!descText) return [];
 const starred = new Set();
 const starRegex = /\*{1,2}([^*\n]+)\*{1,2}/g;
 let m;
 while ((m = starRegex.exec(descText)) !== null) {
  norm(m[1]).replace(/[^A-Z0-9\s]/g, " ").split(/\s+/).filter(Boolean).forEach(w => starred.add(w));
 }
 const clean = norm(descText).replace(/[^A-Z0-9\s]/g, " ");
 const rawWords = clean.split(/\s+/).filter(w => w.length >= 2 && !PT_STOPWORDS.has(w));
 return rawWords.map((w, index) => {
  const isGeneric = GENERIC_REPORT_WORDS.has(w) || GENERIC_REPORT_WORDS.has(stemPt(w));
  const isStarred = starred.has(w);
  const isNumberOrCode = /\d/.test(w);
  // As primeiras palavras substantivas (não genéricas) da descrição da foto costumam ser o assunto/objeto principal (ex.: "Rescue tube", "Torneira", "Ar-condicionado")
  let baseWeight = isGeneric ? 0.35 : 4.0;
  if (!isGeneric && index <= 2) baseWeight += 2.5; // Foco no sujeito principal no início da descrição
  if (!isGeneric && w.length >= 6) baseWeight += 1.0; // Palavras específicas mais longas têm mais peso
  if (isNumberOrCode) baseWeight += 2.0; // Números de patrimônio/item
  if (isStarred) baseWeight += 8.0; // Se o usuário destacou com *palavra*, peso máximo!
  return { word: w, stem: stemPt(w), isGeneric, isStarred, weight: baseWeight, pos: index };
 });
}

function scorePhotoAgainstItem(photoTokens, rawPhotoDesc, itemText, docFreqMap, totalItems) {
 if (!photoTokens.length || !itemText) return 0;
 const itemNorm = norm(itemText).replace(/[^A-Z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
 const itemWords = itemNorm.split(" ").filter(Boolean);
 const itemStems = itemWords.map(stemPt);
 const descNorm = norm(rawPhotoDesc).replace(/[^A-Z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

 let totalScore = 0;
 let matchedNonGeneric = 0;
 let matchedStarred = 0;
 const matchedPositions = [];

 // 1. Bônus altíssimo se a expressão completa (ou bigramas/trigramas do assunto principal) aparecer exatamente no item
 if (descNorm.length >= 4 && itemNorm.includes(descNorm)) {
  totalScore += 30;
  matchedNonGeneric += 2;
 }

 // Testar pares de palavras consecutivas (ex.: "RESCUE TUBE", "QUADRO BRANCO", "PORTA PRINCIPAL", "AR CONDICIONADO")
 for (let i = 0; i < photoTokens.length - 1; i++) {
  const w1 = photoTokens[i];
  const w2 = photoTokens[i + 1];
  if (!w1.isGeneric || !w2.isGeneric) {
   const bigram = `${w1.word} ${w2.word}`;
   const bigramStem = `${w1.stem} ${w2.stem}`;
   const itemStemJoined = itemStems.join(" ");
   if (itemNorm.includes(bigram) || itemStemJoined.includes(bigramStem)) {
    totalScore += 18;
    matchedNonGeneric += 2;
   }
  }
 }

 // 2. Avaliar cada palavra da descrição com raridade (IDF): se uma palavra só existe em 1 tópico de Diversos, ela vale muito mais!
 photoTokens.forEach((tk, idx) => {
  let matchType = 0; // 0 = no match, 1 = partial/prefix, 2 = stem match, 3 = exact word match
  if (itemWords.includes(tk.word)) {
   matchType = 3;
  } else if (tk.stem.length >= 4 && itemStems.includes(tk.stem)) {
   matchType = 2.6;
  } else if (tk.word.length >= 5 && itemWords.some(iw => iw.length >= 5 && (iw.startsWith(tk.word.slice(0, 5)) || tk.word.startsWith(iw.slice(0, 5))))) {
   matchType = 1.5;
  }

  if (matchType > 0) {
   const df = docFreqMap.get(tk.stem) || 1;
   // Raridade: se o termo aparece em apenas 1 tópico dentre vários, multiplica por 2.5x; se aparece em todos, reduz!
   const rarityBoost = totalItems > 1 ? (1 + ((totalItems - df) / totalItems) * 2.0) : 1.5;
   totalScore += tk.weight * (matchType / 3) * rarityBoost;
   if (!tk.isGeneric) matchedNonGeneric++;
   if (tk.isStarred) matchedStarred++;
   matchedPositions.push(idx);
  }
 });

 // Se só bateu palavras genéricas (ex.: "alteração", "quebrado", "sala") mas nenhuma palavra principal/específica quando a descrição tinha palavras específicas, zera ou reduz drasticamente para não vincular no lugar errado!
 const hasSpecificTokensInDesc = photoTokens.some(t => !t.isGeneric);
 if (hasSpecificTokensInDesc && matchedNonGeneric === 0 && matchedStarred === 0) {
  return 0;
 }

 return totalScore;
}

function formatPhotoRefBadge(photoNums) {
 if (!photoNums || !photoNums.length) return "";
 if (photoNums.length === 1) return `(vide Foto ${photoNums[0]})`;
 const last = photoNums[photoNums.length - 1];
 const rest = photoNums.slice(0, -1).join(", ");
 return `(vide Fotos ${rest} e ${last})`;
}

function mergeSectionItemsWithPhotos(baseItems, sectionId) {
 const items = baseItems.map(x => ({ ...x }));
 const photosForSec = [];
 photoData.forEach((p, idx) => {
  if (p.section === sectionId) {
   photosForSec.push({ num: String(idx + 1).padStart(2, "0"), desc: (p.desc || "").trim() });
  }
 });
 if (!photosForSec.length) return items;

 // Calcula a frequência de cada radical (stem) entre os tópicos da seção para saber quais palavras são únicas/principais de um tópico específico
 const docFreqMap = new Map();
 items.forEach(item => {
  const uniqueStems = new Set(
   norm(item.text).replace(/[^A-Z0-9\s]/g, " ").split(/\s+/).filter(Boolean).map(stemPt)
  );
  uniqueStems.forEach(st => docFreqMap.set(st, (docFreqMap.get(st) || 0) + 1));
 });

 const attachedByIdx = {};
 const unattached = [];

 photosForSec.forEach(photo => {
  if (!items.length) {
   unattached.push(photo);
   return;
  }
  const photoTokens = extractPhotoTokens(photo.desc);
  let bestIdx = -1;
  let bestScore = 0;
  if (photoTokens.length > 0) {
   items.forEach((item, idx) => {
    // Prioriza tópicos com bolinha ('bullet') sobre subtítulos
    const sc = scorePhotoAgainstItem(photoTokens, photo.desc, item.text, docFreqMap, items.length) * (item.type === "bullet" ? 1.0 : 0.6);
    if (sc > bestScore) {
     bestScore = sc;
     bestIdx = idx;
    }
   });
  }
  if (bestIdx !== -1 && bestScore >= 2.0) {
   if (!attachedByIdx[bestIdx]) attachedByIdx[bestIdx] = [];
   attachedByIdx[bestIdx].push(photo.num);
  } else if (!photo.desc) {
   // Sem descrição na foto: anexa ao último item já escrito na seção
   const lastIdx = items.length - 1;
   if (!attachedByIdx[lastIdx]) attachedByIdx[lastIdx] = [];
   attachedByIdx[lastIdx].push(photo.num);
  } else if (items.length === 1 && sectionId !== "matAluno" && sectionId !== "matMasc" && sectionId !== "matFem") {
   // Se o usuário escreveu apenas um único parágrafo na seção, vincula a ele
   if (!attachedByIdx[0]) attachedByIdx[0] = [];
   attachedByIdx[0].push(photo.num);
  } else {
   unattached.push(photo);
  }
 });

 const merged = items.map((item, idx) => {
  if (attachedByIdx[idx] && attachedByIdx[idx].length) {
   const cleanBase = item.text.replace(/[;.,\s]+$/, "").trim();
   return { ...item, text: `${cleanBase} ${formatPhotoRefBadge(attachedByIdx[idx])}` };
  }
  return item;
 });

 unattached.forEach(photo => {
  const cleanDesc = photo.desc ? photo.desc.replace(/[;.,\s]+$/, "").trim() : "Alteração constante em anexo";
  merged.push({ type: "bullet", text: `${cleanDesc} (vide Foto ${photo.num})` });
 });

 return merged;
}

function renderMixedItemsHTML(items, fallbackText) {
 const realItems = (items || []).filter(x => x.type !== "spacer");
 if (!realItems.length) {
  return fallbackText ? `<ul><li>${esc(fallbackText)}</li></ul>` : "";
 }
 const punctuated = applyAutomaticPunctuation(items);
 let html = "";
 let inUl = false;
 punctuated.forEach(item => {
  if (item.type === "spacer") {
   if (inUl) { html += "</ul>"; inUl = false; }
   html += `<div class="custom-spacer">&nbsp;</div>`;
  } else if (item.type === "subtopic") {
   if (inUl) { html += "</ul>"; inUl = false; }
   html += `<div class="custom-subtopic">${formatWhatsAppBold(item.text)}</div>`;
  } else {
   if (!inUl) { html += "<ul>"; inUl = true; }
   html += `<li>${formatWhatsAppBold(item.text)}</li>`;
  }
 });
 if (inUl) html += "</ul>";
 return html;
}

function renderSectionBulletsWithPhotos(textValue, sectionId, fallbackText) {
 const manualItems = parseStructuredLines(textValue);
 const allItems = mergeSectionItemsWithPhotos(manualItems, sectionId);
 return renderMixedItemsHTML(allItems, fallbackText);
}

function getSectionManualSummaryForPhoto(sectionId) {
 const el = $(sectionId);
 if (!el || !el.value) return "";
 const lines = cleanLines(el.value);
 return lines.join(" | ");
}

function formatCadetPernoiteLine(p, idx, arr) {
 const autoOn = $("autoPunctuationToggle") ? $("autoPunctuationToggle").checked : true;
 const punct = autoOn ? (idx < arr.length - 1 ? ";" : ".") : "";
 return `<li><b>AL OF BM</b> ${boldWarName(p[1], p[5])}, Nº ${esc(p[0])}, Mat.: ${esc(p[2])}${punct}</li>`;
}


function getStudentTitleByGender(studentEntry) {
 return (studentEntry && studentEntry[4] === "F") ? "Aluna de Dia" : "Aluno de Dia";
}

function formatDutyRoleLabel(rawRole, personEntry, studentEntry) {
 const isPersonFem = personEntry && personEntry[4] === "F";
 const isStudentFem = studentEntry && studentEntry[4] === "F";
 if (rawRole === "Aluno de Dia") {
  return isPersonFem ? "Aluna de Dia" : "Aluno de Dia";
 }
 if (rawRole === "Adjunto do Aluno de Dia") {
  const adjWord = isPersonFem ? "Adjunta" : "Adjunto";
  const prepStudent = isStudentFem ? "da Aluna de Dia" : "do Aluno de Dia";
  return `${adjWord} ${prepStudent}`;
 }
 return rawRole;
}

const PREVIEW_SEC_META = {
 header:       { label: "Cabeçalho e Escala", fieldId: "student", drawerId: null, isText: false, hint: "Clique p/ ajustar Cabeçalho" },
 duty:         { label: "I) Efetivo de Serviço (Observações / Permutas)", fieldId: "otherDuty", drawerId: "drawer_duty", focusControl: "dutySearch", isText: true, hint: "Clique p/ editar Efetivo / Permutas" },
 matAluno:     { label: "II - 1.1) Material a cargo do Aluno de Dia (Observações)", fieldId: "extraMatAluno", drawerId: "drawer_matAluno", isText: true, hint: "Clique p/ conferir ou adicionar obs." },
 matMasc:      { label: "II - 1.2) Material — Área Masculina (Observações)", fieldId: "extraMatMasc", drawerId: "drawer_matMasc", isText: true, hint: "Clique p/ conferir ou adicionar obs." },
 matFem:       { label: "II - 1.3) Material — Área Feminina (Observações)", fieldId: "extraMatFem", drawerId: "drawer_matFem", isText: true, hint: "Clique p/ conferir ou adicionar obs." },
 changesDuty:  { label: "III) Alterações — Efetivo de Serviço", fieldId: "changesDuty", drawerId: "drawer_changes", isText: true, hint: "Clique p/ editar na hora" },
 changes2025:  { label: "III) Alterações — 1º CFO 2025 (Espadartes)", fieldId: "changes2025", drawerId: "drawer_changes", isText: true, hint: "Clique p/ editar na hora" },
 changes2026:  { label: "III) Alterações — 1º CFO 2026 (Guardiões)", fieldId: "changes2026", drawerId: "drawer_changes", isText: true, hint: "Clique p/ editar na hora" },
 received:     { label: "IV) Documentos Recebidos", fieldId: "received", drawerId: "drawer_received", isText: true, hint: "Clique p/ editar na hora" },
 delivered:    { label: "V) Documentos Entregues", fieldId: "delivered", drawerId: "drawer_delivered", isText: true, hint: "Clique p/ editar na hora" },
 infoDormMEsp: { label: "VI - a.1) Alojamento masculino — Espadartes 2025", fieldId: "infoDormMEsp", drawerId: "drawer_infoDormMEsp", isText: true, hint: "Clique p/ editar na hora" },
 infoDormMGua: { label: "VI - a.2) Alojamento masculino — Guardiões 2026", fieldId: "infoDormMGua", drawerId: "drawer_infoDormMGua", isText: true, hint: "Clique p/ editar na hora" },
 infoBathM:    { label: "VI - a.3) Banheiro masculino (em conjunto)", fieldId: "infoBathM", drawerId: "drawer_infoBathM", isText: true, hint: "Clique p/ editar na hora" },
 infoDormFEsp: { label: "VI - b.1) Alojamento feminino — Espadartes 2025", fieldId: "infoDormFEsp", drawerId: "drawer_infoDormFEsp", isText: true, hint: "Clique p/ editar na hora" },
 infoDormFGua: { label: "VI - b.2) Alojamento feminino — Guardiões 2026", fieldId: "infoDormFGua", drawerId: "drawer_infoDormFGua", isText: true, hint: "Clique p/ editar na hora" },
 infoBathF:    { label: "VI - b.3) Banheiro feminino (em conjunto)", fieldId: "infoBathF", drawerId: "drawer_infoBathF", isText: true, hint: "Clique p/ editar na hora" },
 infoCommon:   { label: "VI - c) Área comum, salas de aula e rancho", fieldId: "infoCommon", drawerId: "drawer_infoCommon", isText: true, hint: "Clique p/ editar na hora" },
 sleep:        { label: "VII) Pernoite (Observações)", fieldId: "sleepNotes", drawerId: "drawer_sleep", focusControl: "sleepSearch", isText: true, hint: "Clique p/ ajustar Pernoite ou Obs." },
 misc:         { label: "VIII) Diversos", fieldId: "misc", drawerId: "drawer_misc", isText: true, hint: "Clique p/ editar na hora" },
 photos:       { label: "IX) Anexos Fotográficos", fieldId: "photos", drawerId: "drawer_photos", isText: false, hint: "Clique p/ gerenciar Fotos" },
 passagem:     { label: "Passagem do Serviço", fieldId: "nextStudent", drawerId: null, isText: false, hint: "Clique p/ selecionar próximo Aluno de Dia" }
};

function secCls(secKey) {
 const meta = PREVIEW_SEC_META[secKey];
 const hint = meta ? meta.hint : "Clique p/ editar";
 return `prev-sec-block${activePreviewSection === secKey ? " active-preview-sec" : ""}" data-sec="${secKey}" data-edit-hint="${hint}`;
}

function renderPreview() {
 if (typeof updateMaterialSummaryBadges === 'function') updateMaterialSummaryBadges();
 const previewEl = $("preview");
 const savedScrollTop = previewEl ? previewEl.scrollTop : 0;

 const date = $("assumeDate").value || getTodayISO();
 const time = $("assumeTime").value || "06:50";
 const handover = $("handoverTime").value || "06:50";
 const is12 = $("officerMode").value === "12";
 const end24Student = plusTime(date, time, 24);

 const offStartTime = "07:00";
 const offEnd1 = plusTime(date, offStartTime, is12 ? 12 : 24);
 const offEnd24 = plusTime(date, offStartTime, 24);

 const studentIdx = $("student").value;
 const student = studentIdx === "" ? null : people[Number(studentIdx)];
 const nextIdx = $("nextStudent").value;
 const next = nextIdx === "" ? null : people[Number(nextIdx)];

 const countOfficers = is12 ? 2 : 1;
 const officerEntries = [];
 for (let n = 1; n <= countOfficers; n++) {
  const el = $(`officer${n}`);
  const warEl = $(`officerWar${n}`);
  if (el && el.value !== "" && officers[Number(el.value)]) {
   const o = officers[Number(el.value)];
   const w = warEl ? warEl.value : getOfficerWar(Number(el.value));
   const start = (is12 && n === 2) ? offEnd1 : { date, time: offStartTime };
   const end = (is12 && n === 1) ? offEnd1 : offEnd24;
   officerEntries.push(`<b>${esc(o[2])}</b> ${boldWarName(o[0], w)}, Mat.: ${esc(o[1])}, das ${esc(start.time)}H do dia ${esc(fmtDate(start.date))} às ${esc(end.time)}H do dia ${esc(fmtDate(end.date))}`);
  }
 }

 const duty = getOrderedDutyList();
 const dutySet = new Set(duty.map(x => x.i));

 const matsAluno = mergeSectionItemsWithPhotos([
  ...[...document.querySelectorAll(".matcheck-aluno:checked")].map(c => ({ type: "bullet", text: materialsAluno[Number(c.value)].text })),
  ...parseStructuredLines($("extraMatAluno").value)
 ], "matAluno");
 const matsMasc = mergeSectionItemsWithPhotos([
  ...[...document.querySelectorAll(".matcheck-masc:checked")].map(c => ({ type: "bullet", text: materialsMasc[Number(c.value)].text })),
  ...parseStructuredLines($("extraMatMasc").value)
 ], "matMasc");
 const matsFem = mergeSectionItemsWithPhotos([
  ...[...document.querySelectorAll(".matcheck-fem:checked")].map(c => ({ type: "bullet", text: materialsFem[Number(c.value)].text })),
  ...parseStructuredLines($("extraMatFem").value)
 ], "matFem");

 const sleepDutyList = duty.filter(x => $(`sleep_${x.i}`) ? $(`sleep_${x.i}`).checked : true).map(x => x.p);

 const extraSleepIndices = [...document.querySelectorAll(".sleepcheck:checked")]
  .map(c => Number(c.id.split("_")[1]))
  .filter(i => !dutySet.has(i));

 const extraSleepPeople = extraSleepIndices.map(i => people[i]);
 const espMasc = extraSleepPeople.filter(p => p[3] === "Espadarte" && p[4] === "M");
 const espFem = extraSleepPeople.filter(p => p[3] === "Espadarte" && p[4] === "F");
 const guaMasc = extraSleepPeople.filter(p => p[3] === "Guardião" && p[4] === "M");
 const guaFem = extraSleepPeople.filter(p => p[3] === "Guardião" && p[4] === "F");

 const totalEspPernoite = espMasc.length + espFem.length;
 const totalGuaPernoite = guaMasc.length + guaFem.length;
 const totalPernoiteCount = sleepDutyList.length + totalEspPernoite + totalGuaPernoite;

 let html = `
 <div class="rep-header">
  <img src="${LOGO_CBMBA}" alt="Brasão CBMBA">
  <div class="rep-header-center">
   <h4>CORPO DE BOMBEIROS MILITAR DA BAHIA</h4>
   <h4>INSTITUTO MILITAR DE ENSINO SUPERIOR DE BOMBEIROS</h4>
   <h4>ACADEMIA DE BOMBEIROS MILITAR</h4>
  </div>
  <img src="${LOGO_ABM}" alt="Brasão ABM">
 </div>

 <div id="prev_sec_header" class="${secCls("header")}">
  <div class="reporttitle">RELATÓRIO DO SERVIÇO DE ${student && student[4] === "F" ? "ALUNA DE DIA" : "ALUNO DE DIA"} À ACADEMIA DE BOMBEIROS MILITAR, DAS ${esc(time)}H DO DIA ${esc(fmtDate(date))}, ${esc(weekday(date))}, ÀS ${esc(handover)}H DO DIA ${esc(fmtDate(end24Student.date))}, ${esc(weekday(end24Student.date))}.</div>
  <p><b>LOCAL:</b> BR 324, 540, Via Cia Sul - ABM, CEP: 43.700-000, Simões Filho - BA.</p>
  <p><b>${student && student[4] === "F" ? "ALUNA DE DIA" : "ALUNO DE DIA"}:</b> ${student ? `<b>AL OF BM</b> ${boldWarName(student[1], student[5])}, Nº ${esc(student[0])}, Mat.: ${esc(student[2])}.` : "[selecionar Aluno(a) de Dia]"}</p>
  ${officerEntries.length > 1
   ? officerEntries.map((entry, idx) => `<p><b>${idx + 1}º OFICIAL DE DIA:</b> ${entry}.</p>`).join("\n  ")
   : `<p><b>OFICIAL DE DIA:</b> ${officerEntries.length === 1 ? officerEntries[0] + "." : "[selecionar Oficial(is) de Dia]"}</p>`}
  <p><b>ASSUNÇÃO:</b> Assumi o serviço de ${getStudentTitleByGender(student)} da Academia de Bombeiros Militar, às ${esc(time)}h, fazendo constar as ordens, alterações e materiais à disposição.</p>
 </div>

 <div id="prev_sec_duty" class="${secCls("duty")}">
  <h5>I) EFETIVO DE SERVIÇO</h5>
  <table>
   <thead>
    <tr>
     <th style="width:65px">Ordem</th>
     <th>Nome de Guerra</th>
     <th style="width:70px">Número</th>
     <th style="width:170px">Função</th>
    </tr>
   </thead>
   <tbody>
    ${duty.length ? duty.map((x, idx) => `
     <tr>
      <td>${idx + 1}º</td>
      <td><b>AL OF BM</b> ${boldWarName(x.p[1], x.p[5])}<br>Mat.: ${esc(x.p[2])}</td>
      <td>${esc(x.p[0])}</td>
      <td>${esc(formatDutyRoleLabel(x.role, x.p, student))}</td>
     </tr>`).join("") : `<tr><td colspan="4">Selecione o Aluno de Dia e o efetivo de serviço no painel lateral.</td></tr>`}
   </tbody>
  </table>
  ${renderSectionBulletsWithPhotos($("otherDuty").value, "otherDuty", "")}
 </div>

 <h5>II) MATERIAL A CARGO</h5>
 <div id="prev_sec_matAluno" class="${secCls("matAluno")}">
  <div class="subhead">1.1 A cargo do Aluno de Dia</div>
  ${renderMixedItemsHTML(matsAluno, "Não consta.")}
 </div>

 <div id="prev_sec_matMasc" class="${secCls("matMasc")}">
  <div class="subhead">1.2 Área Masculina</div>
  ${renderMixedItemsHTML(matsMasc, "Não consta.")}
 </div>

 <div id="prev_sec_matFem" class="${secCls("matFem")}">
  <div class="subhead">1.3 Área Feminina</div>
  ${renderMixedItemsHTML(matsFem, "Não consta.")}
 </div>

 <h5>III) ALTERAÇÕES DOS CURSOS</h5>
 <div id="prev_sec_changesDuty" class="${secCls("changesDuty")}">
  <div class="subhead">EFETIVO DE SERVIÇO:</div>
  ${renderSectionBulletsWithPhotos($("changesDuty").value, "changesDuty", "Sem alterações.")}
 </div>

 <div id="prev_sec_changes2025" class="${secCls("changes2025")}">
  <div class="subhead">1º CFO 2025 - ESPADARTES:</div>
  ${renderSectionBulletsWithPhotos($("changes2025").value, "changes2025", "Sem alterações.")}
 </div>

 <div id="prev_sec_changes2026" class="${secCls("changes2026")}">
  <div class="subhead">1º CFO 2026 - GUARDIÕES:</div>
  ${renderSectionBulletsWithPhotos($("changes2026").value, "changes2026", "Sem alterações.")}
 </div>

 <div id="prev_sec_received" class="${secCls("received")}">
  <h5>IV) DOCUMENTOS RECEBIDOS</h5>
  ${renderSectionBulletsWithPhotos($("received").value, "received", "Não consta.")}
 </div>

 <div id="prev_sec_delivered" class="${secCls("delivered")}">
  <h5>V) DOCUMENTOS ENTREGUES</h5>
  ${renderSectionBulletsWithPhotos($("delivered").value, "delivered", "Não consta.")}
 </div>

 <h5>VI) INFORMAÇÕES</h5>
 <div class="subhead">a. Área Masculina:</div>
 <div id="prev_sec_infoDormMEsp" class="${secCls("infoDormMEsp")}">
  <div class="subhead-gender">Alojamento masculino - Turma ESPADARTES 2025:</div>
  ${renderSectionBulletsWithPhotos($("infoDormMEsp").value, "infoDormMEsp", "Não consta.")}
 </div>
 <div id="prev_sec_infoDormMGua" class="${secCls("infoDormMGua")}">
  <div class="subhead-gender">Alojamento masculino - Turma GUARDIÕES 2026:</div>
  ${renderSectionBulletsWithPhotos($("infoDormMGua").value, "infoDormMGua", "Não consta.")}
 </div>
 <div id="prev_sec_infoBathM" class="${secCls("infoBathM")}">
  <div class="subhead-gender">Banheiro masculino (em conjunto):</div>
  ${renderSectionBulletsWithPhotos($("infoBathM").value, "infoBathM", "Não consta.")}
 </div>

 <div class="subhead">b. Área Feminina:</div>
 <div id="prev_sec_infoDormFEsp" class="${secCls("infoDormFEsp")}">
  <div class="subhead-gender">Alojamento feminino - Turma ESPADARTES 2025:</div>
  ${renderSectionBulletsWithPhotos($("infoDormFEsp").value, "infoDormFEsp", "Não consta.")}
 </div>
 <div id="prev_sec_infoDormFGua" class="${secCls("infoDormFGua")}">
  <div class="subhead-gender">Alojamento feminino - Turma GUARDIÕES 2026:</div>
  ${renderSectionBulletsWithPhotos($("infoDormFGua").value, "infoDormFGua", "Não consta.")}
 </div>
 <div id="prev_sec_infoBathF" class="${secCls("infoBathF")}">
  <div class="subhead-gender">Banheiro feminino (em conjunto):</div>
  ${renderSectionBulletsWithPhotos($("infoBathF").value, "infoBathF", "Não consta.")}
 </div>

 <div id="prev_sec_infoCommon" class="${secCls("infoCommon")}">
  <div class="subhead">c. Área comum, salas de aula e rancho:</div>
  ${renderSectionBulletsWithPhotos($("infoCommon").value, "infoCommon", "Não consta.")}
 </div>

 <div id="prev_sec_sleep" class="${secCls("sleep")}">
  <h5>VII) PERNOITE</h5>
  <p><b>Total do efetivo que pernoitará:</b> <b>${totalPernoiteCount}</b> ${totalPernoiteCount === 1 ? "militar" : "militares"}</p>

  <div class="subhead">Efetivo de Serviço: ${fmtMil(sleepDutyList.length)}</div>
  <ul>
   ${sleepDutyList.length ? sleepDutyList.map(formatCadetPernoiteLine).join("") : "<li>Não consta.</li>"}
  </ul>

  <div class="subhead">Turma ESPADARTES 2025: ${fmtMil(totalEspPernoite)}</div>
  <div class="subhead-gender">Masculino da turma ESPADARTES: ${fmtMil(espMasc.length)}</div>
  <ul>
   ${espMasc.length ? espMasc.map(formatCadetPernoiteLine).join("") : "<li>Não consta.</li>"}
  </ul>
  <div class="subhead-gender">Feminino da turma ESPADARTES: ${fmtMil(espFem.length)}</div>
  <ul>
   ${espFem.length ? espFem.map(formatCadetPernoiteLine).join("") : "<li>Não consta.</li>"}
  </ul>

  <div class="subhead">Turma GUARDIÕES 2026: ${fmtMil(totalGuaPernoite)}</div>
  <div class="subhead-gender">Masculino da turma GUARDIÕES: ${fmtMil(guaMasc.length)}</div>
  <ul>
   ${guaMasc.length ? guaMasc.map(formatCadetPernoiteLine).join("") : "<li>Não consta.</li>"}
  </ul>
  <div class="subhead-gender">Feminino da turma GUARDIÕES: ${fmtMil(guaFem.length)}</div>
  <ul>
   ${guaFem.length ? guaFem.map(formatCadetPernoiteLine).join("") : "<li>Não consta.</li>"}
  </ul>

  ${renderSectionBulletsWithPhotos($("sleepNotes").value, "sleepNotes", "")}
 </div>

 <div id="prev_sec_misc" class="${secCls("misc")}">
  <h5>VIII) DIVERSOS</h5>
  ${renderSectionBulletsWithPhotos($("misc").value, "misc", "Não consta.")}
 </div>
 `;

 if (photoData.length) {
  html += `<div id="prev_sec_photos" class="${secCls("photos")}"><h5>IX) ANEXOS</h5>` + photoData.map((p, idx) => {
   const num = String(idx + 1).padStart(2, "0");
   const ownDesc = p.desc && p.desc.trim() ? p.desc.trim() : "";
   const cleanDesc = ownDesc ? (/[.!;?]$/.test(ownDesc) ? ownDesc : `${ownDesc}.`) : "";
   return `<div class="photo-item">
    <img class="photoout" src="${p.data}" alt="Foto ${num}">
    <p class="photo-caption"><b>Foto ${num}${cleanDesc ? ":" : ""}</b>${cleanDesc ? ` ${formatWhatsAppBold(cleanDesc)}` : ""}</p>
   </div>`;
  }).join("") + `</div>`;
 }

 html += `
 <div id="prev_sec_passagem" class="${secCls("passagem")}">
  <h5>PASSAGEM DO SERVIÇO</h5>
  <p>Passei o serviço às ${esc(handover)}h do dia ${esc(fmtDate(end24Student.date))} para ${next ? `<b>AL OF BM</b> ${boldWarName(next[1], next[5])}, Nº ${esc(next[0])}, Mat.: ${esc(next[2])}` : "[selecionar próximo Aluno de Dia]"}, com todas as ordens e alterações constantes em relatório.</p>
  <p style="text-align:center;margin-top:26px">Simões Filho - BA, ${esc(fmtDate(end24Student.date))}.</p>
  <div class="sig">
   ${student ? `${boldWarName(student[1], student[5])} - <b>AL OF QOBM</b>` : "[NOME DO ALUNO DE DIA] - <b>AL OF QOBM</b>"}<br>
   ${getStudentTitleByGender(student)}${student ? ` - Nº ${esc(student[0])} | Mat.: ${esc(student[2])}` : ""}
  </div>
 </div>`;

 previewEl.innerHTML = html;
 previewEl.scrollTop = savedScrollTop;
}

const formFields = [
 "assumeDate","assumeTime","handoverTime","student","nextStudent",
 "otherDuty","extraMatAluno","extraMatMasc","extraMatFem",
 "changesDuty","changes2025","changes2026","received","delivered",
 "infoDormMEsp","infoDormMGua","infoBathM","infoDormFEsp","infoDormFGua","infoBathF","infoCommon",
 "sleepNotes","misc"
];

function getState() {
 const s = { officerMode: $("officerMode").value, savedAt: new Date().toISOString(), sleepVersion: 2, autoPunctuation: $("autoPunctuationToggle") ? $("autoPunctuationToggle").checked : true, autoBoldRanks: $("autoBoldRanksToggle") ? $("autoBoldRanksToggle").checked : true };
 formFields.forEach(id => s[id] = $(id).value);
 const count = s.officerMode === "12" ? 2 : 1;
 s.officers = [];
 for (let i = 1; i <= count; i++) s.officers.push($(`officer${i}`)?.value ?? "");
 s.customOfficers = customOfficers;
 s.savedOfficerWar = savedOfficerWar;
 s.duty = [...document.querySelectorAll(".dutycheck")].map((c, i) => ({
  checked: c.checked,
  role: document.querySelector(`.role[data-i="${i}"]`).value
 }));
 s.sleep = [...document.querySelectorAll(".sleepcheck")].map(c => c.checked);
 s.matAluno = [...document.querySelectorAll(".matcheck-aluno")].map(c => c.checked);
 s.matMasc = [...document.querySelectorAll(".matcheck-masc")].map(c => c.checked);
 s.matFem = [...document.querySelectorAll(".matcheck-fem")].map(c => c.checked);
 s.photoData = photoData;
 return s;
}

function setState(s) {
 if (!s) return;
 isRestoringState = true;
 if (Array.isArray(s.customOfficers)) {
  customOfficers = s.customOfficers;
  officers = [...defaultOfficers, ...customOfficers];
  try { localStorage.setItem("abm_custom_officers_v10", JSON.stringify(customOfficers)); } catch(e) {}
 }
 if (s.savedOfficerWar) {
  savedOfficerWar = s.savedOfficerWar;
  try { localStorage.setItem("abm_officer_warnames_v10", JSON.stringify(savedOfficerWar)); } catch(e) {}
 }
 if (s.officerMode) $("officerMode").value = s.officerMode;
 if (s.autoPunctuation !== undefined && $("autoPunctuationToggle")) $("autoPunctuationToggle").checked = !!s.autoPunctuation;
 if (s.autoBoldRanks !== undefined && $("autoBoldRanksToggle")) $("autoBoldRanksToggle").checked = !!s.autoBoldRanks;
 formFields.forEach(id => { if (s[id] !== undefined) $(id).value = s[id]; });
 renderOfficerFields();
 (s.officers || []).forEach((v, i) => {
  const el = $(`officer${i + 1}`);
  const warEl = $(`officerWar${i + 1}`);
  if (el) {
   el.value = v;
   if (warEl && v !== "") warEl.value = getOfficerWar(Number(v));
  }
 });
 (s.duty || []).forEach((x, i) => {
  const c = $(`duty_${i}`);
  if (c) {
   c.checked = !!x.checked;
   c.disabled = false;
   c.closest(".person").classList.toggle("selected", !!x.checked);
   c.closest(".person").classList.remove("is-student");
   const badge = $(`duty_student_badge_${i}`);
   if (badge) badge.style.display = "none";
   const r = document.querySelector(`.role[data-i="${i}"]`);
   if (r && x.role) r.value = x.role;
  }
 });
 (s.sleep || []).forEach((v, i) => {
  const c = $(`sleep_${i}`);
  if (c) {
   const isLegacyDuty = (!s.sleepVersion) && (s.duty?.[i]?.checked || String(i) === String(s.student));
   const finalChecked = !!v || !!isLegacyDuty;
   c.checked = finalChecked;
   c.closest(".person").classList.toggle("selected", finalChecked);
  }
 });
 (s.matAluno || []).forEach((v, i) => {
  const c = document.querySelectorAll(".matcheck-aluno")[i];
  if (c) c.checked = !!v;
 });
 (s.matMasc || []).forEach((v, i) => {
  const c = document.querySelectorAll(".matcheck-masc")[i];
  if (c) c.checked = !!v;
 });
 (s.matFem || []).forEach((v, i) => {
  const c = document.querySelectorAll(".matcheck-fem")[i];
  if (c) c.checked = !!v;
 });
 if (Array.isArray(s.photoData)) {
  photoData = s.photoData;
  renderPhotos();
 }
 previousStudentIdx = null;
 syncStudentSelectionToDuty();
 updateSleepCount();
 ["infoDormMEsp", "infoDormMGua", "infoBathM", "infoDormFEsp", "infoDormFGua", "infoBathF", "infoCommon"].forEach(fid => {
  const dr = $(`drawer_${fid}`);
  const ta = $(fid);
  if (dr && ta && ta.value.trim()) dr.open = true;
 });
 refreshAllLineChipBars();
 renderPreview();
 isRestoringState = false;
}

function resetToCleanForm() {
 isRestoringState = true;
 formFields.forEach(id => { if (!["assumeDate","assumeTime","handoverTime"].includes(id)) $(id).value = ""; });
 $("assumeDate").value = getTodayISO();
 $("assumeTime").value = "06:50";
 $("handoverTime").value = "06:50";
 $("student").value = "";
 $("nextStudent").value = "";
 $("officerMode").value = "24";
 previousStudentIdx = null;
 renderOfficerFields();
 renderSleep();
 renderDuty();
 renderMatSection("matAluno", materialsAluno, "matcheck-aluno");
 renderMatSection("matMasc", materialsMasc, "matcheck-masc");
 renderMatSection("matFem", materialsFem, "matcheck-fem");
 photoData = [];
 renderPhotos();
 ["infoDormMEsp", "infoDormMGua", "infoBathM", "infoDormFEsp", "infoDormFGua", "infoBathF", "infoCommon"].forEach(fid => {
  const dr = $(`drawer_${fid}`);
  const ta = $(fid);
  if (dr && ta && ta.value.trim()) dr.open = true;
 });
 refreshAllLineChipBars();
 renderPreview();
 isRestoringState = false;
}

// =========================================================================
// GERADOR NATIVO REAL DE MICROSOFT WORD (.DOCX OPENXML EM ZIP)
// E HTML PURO PARA GOOGLE DOCS
// =========================================================================
const CRC32_TABLE = (() => {
 const t = new Uint32Array(256);
 for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  t[i] = c >>> 0;
 }
 return t;
})();

function crc32Bytes(u8) {
 let crc = 0xFFFFFFFF;
 for (let i = 0; i < u8.length; i++) {
  crc = CRC32_TABLE[(crc ^ u8[i]) & 0xFF] ^ (crc >>> 8);
 }
 return (crc ^ 0xFFFFFFFF) >>> 0;
}

function createZipArchive(files) {
 const encoder = new TextEncoder();
 const localParts = [];
 const centralParts = [];
 let offset = 0;

 files.forEach(f => {
  const nameBytes = encoder.encode(f.name);
  const dataBytes = (f.data instanceof Uint8Array) ? f.data : encoder.encode(String(f.data));
  const crc = crc32Bytes(dataBytes);
  const size = dataBytes.length;

  const localHeader = new Uint8Array(30 + nameBytes.length);
  const lv = new DataView(localHeader.buffer);
  lv.setUint32(0, 0x04034b50, true);
  lv.setUint16(4, 20, true);
  lv.setUint16(6, 0x0800, true); // UTF-8 filename flag
  lv.setUint16(8, 0, true); // STORE (no compression needed)
  lv.setUint16(10, 0, true);
  lv.setUint16(12, 0, true);
  lv.setUint32(14, crc, true);
  lv.setUint32(18, size, true);
  lv.setUint32(22, size, true);
  lv.setUint16(26, nameBytes.length, true);
  lv.setUint16(28, 0, true);
  localHeader.set(nameBytes, 30);

  localParts.push(localHeader, dataBytes);

  const centralHeader = new Uint8Array(46 + nameBytes.length);
  const cv = new DataView(centralHeader.buffer);
  cv.setUint32(0, 0x02014b50, true);
  cv.setUint16(4, 20, true);
  cv.setUint16(6, 20, true);
  cv.setUint16(8, 0x0800, true);
  cv.setUint16(10, 0, true);
  cv.setUint16(12, 0, true);
  cv.setUint16(14, 0, true);
  cv.setUint32(16, crc, true);
  cv.setUint32(20, size, true);
  cv.setUint32(24, size, true);
  cv.setUint16(28, nameBytes.length, true);
  cv.setUint16(30, 0, true);
  cv.setUint16(32, 0, true);
  cv.setUint16(34, 0, true);
  cv.setUint16(36, 0, true);
  cv.setUint32(38, 0, true);
  cv.setUint32(42, offset, true);
  centralHeader.set(nameBytes, 46);

  centralParts.push(centralHeader);
  offset += localHeader.length + size;
 });

 let centralSize = 0;
 centralParts.forEach(p => centralSize += p.length);

 const eocd = new Uint8Array(22);
 const ev = new DataView(eocd.buffer);
 ev.setUint32(0, 0x06054b50, true);
 ev.setUint16(4, 0, true);
 ev.setUint16(6, 0, true);
 ev.setUint16(8, files.length, true);
 ev.setUint16(10, files.length, true);
 ev.setUint32(12, centralSize, true);
 ev.setUint32(16, offset, true);
 ev.setUint16(20, 0, true);

 return new Blob([...localParts, ...centralParts, eocd], {
  type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
 });
}

function dataUriToBytesAndExt(dataUri) {
 if (!dataUri || !dataUri.startsWith("data:image/")) return null;
 const [meta, b64] = dataUri.split(",");
 const mime = meta.split(":")[1].split(";")[0];
 let ext = mime.split("/")[1] || "png";
 if (ext === "jpeg") ext = "jpg";
 const binStr = atob(b64);
 const u8 = new Uint8Array(binStr.length);
 for (let i = 0; i < binStr.length; i++) u8[i] = binStr.charCodeAt(i);
 return { u8, ext, mime };
}

function xmlEsc(s) {
 return String(s ?? "").replace(/[&<>'"]/g, c => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&apos;", '"': "&quot;"
 }[c]));
}

function wRun(text, opts = {}) {
 const sz = opts.sz || 22; // 11pt = 22 half-points
 const color = opts.color || "000000";
 return `<w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" w:eastAsia="Arial"/>${opts.bold ? "<w:b/><w:bCs/>" : ""}<w:color w:val="${color}"/><w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/><w:lang w:val="pt-BR"/></w:rPr><w:t xml:space="preserve">${xmlEsc(text)}</w:t></w:r>`;
}

function wRunsWarName(fullName, warName, opts = {}) {
 if (!warName || !warName.trim()) return wRun(fullName, opts);
 const fnNorm = norm(fullName);
 const wnNorm = norm(warName);
 const idx = fnNorm.indexOf(wnNorm);
 if (idx !== -1) {
  const before = fullName.slice(0, idx);
  const match = fullName.slice(idx, idx + wnNorm.length);
  const after = fullName.slice(idx + wnNorm.length);
  return (before ? wRun(before, opts) : "") + wRun(match, { ...opts, bold: true }) + (after ? wRun(after, opts) : "");
 }
 return wRun(fullName, opts);
}

function wRunsWhatsAppBold(rawText, opts = {}) {
 const withRanks = applyAutoRankAsterisks(String(rawText ?? "").replace(/\t/g, "    "));
 const parts = withRanks.split(/(\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g);
 return parts.filter(Boolean).map(part => {
  if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
   return wRun(part.slice(2, -2), { ...opts, bold: true });
  }
  if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
   return wRun(part.slice(1, -1), { ...opts, bold: true });
  }
  return wRun(part, opts);
 }).join("");
}

function wPara(runsXml, opts = {}) {
 const jc = opts.align || "both";
 const before = opts.before !== undefined ? opts.before : 80;
 const after = opts.after !== undefined ? opts.after : 80;
 const line = opts.line || 312; // 1.3x single line spacing (240 = 1.0x), never < 276 so glyphs are never clipped!
 const left = opts.left || 0;
 const keepNext = opts.keepNext ? "<w:keepNext/>" : "";
 const borderTop = opts.borderTop ? `<w:pBdr><w:top w:val="single" w:sz="4" w:space="8" w:color="B5B5B5"/></w:pBdr>` : "";
 const borderBottom = opts.borderBottom ? `<w:pBdr><w:bottom w:val="single" w:sz="12" w:space="8" w:color="102D4F"/></w:pBdr>` : "";
 return `<w:p><w:pPr>${keepNext}${borderTop}${borderBottom}<w:spacing w:before="${before}" w:after="${after}" w:line="${line}" w:lineRule="auto"/>${left ? `<w:ind w:left="${left}"/>` : ""}<w:jc w:val="${jc}"/></w:pPr>${runsXml}</w:p>`;
}

function wBulletPara(runsXml) {
 return `<w:p><w:pPr><w:spacing w:before="50" w:after="50" w:line="312" w:lineRule="auto"/><w:ind w:left="420" w:hanging="240"/><w:jc w:val="both"/></w:pPr>${wRun("•  ", { bold: true })}${runsXml}</w:p>`;
}

function wSectionTitle(titleText) {
 return wPara(wRun(titleText, { bold: true, sz: 23, color: "000000" }), {
  align: "left", before: 320, after: 120, borderTop: true, keepNext: true
 });
}

function wSubhead(text) {
 return wPara(wRun(text, { bold: true, sz: 22, color: "000000" }), {
  align: "left", before: 200, after: 80, keepNext: true
 });
}

function wSubheadGender(text) {
 return wPara(wRun(text, { bold: true, sz: 21, color: "000000" }), {
  align: "left", before: 140, after: 60, left: 180, keepNext: true
 });
}

function wRenderMixedItems(items, fallbackText) {
 const realItems = (items || []).filter(x => x.type !== "spacer");
 if (!realItems.length) {
  return fallbackText ? wBulletPara(wRun(fallbackText)) : "";
 }
 const punctuated = applyAutomaticPunctuation(items);
 return punctuated.map(item => {
  if (item.type === "spacer") {
   return wPara("", { align: "left", before: 0, after: 0, line: 240 });
  }
  if (item.type === "subtopic") {
   return wPara(wRunsWhatsAppBold(item.text, { sz: 22 }), { align: "left", before: 35, after: 35 });
  }
  return wBulletPara(wRunsWhatsAppBold(item.text, { sz: 22 }));
 }).join("");
}

function wRenderSectionWithPhotos(textValue, sectionId, fallbackText) {
 const manualItems = parseStructuredLines(textValue);
 const allItems = mergeSectionItemsWithPhotos(manualItems, sectionId);
 return wRenderMixedItems(allItems, fallbackText);
}

function wCadetPernoiteBullet(p, idx, arr) {
 const autoOn = $("autoPunctuationToggle") ? $("autoPunctuationToggle").checked : true;
 const punct = autoOn ? (idx < arr.length - 1 ? ";" : ".") : "";
 const runs = wRun("AL OF BM ", { bold: true }) + wRunsWarName(p[1], p[5]) + wRun(`, Nº ${p[0]}, Mat.: ${p[2]}${punct}`);
 return wBulletPara(runs);
}

function wInlineImageXml(rId, cx, cy, docPrId, name, withBorder = false) {
 const borderXml = withBorder ? `<a:ln w="9525"><a:solidFill><a:srgbClr val="000000"/></a:solidFill></a:ln>` : "";
 return `<w:r><w:rPr><w:noProof/></w:rPr><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:effectExtent l="0" t="0" r="0" b="0"/><wp:docPr id="${docPrId}" name="${xmlEsc(name)}"/><wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="${docPrId}" name="${xmlEsc(name)}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${rId}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom>${borderXml}</pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
}

function buildTrueDocxBlob(includeEmbeddedState = true) {
 renderPreview();
 const zipFiles = [];
 const rels = [
  `<Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>`,
  `<Relationship Id="rIdSettings" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>`
 ];
 let nextRId = 10;
 let nextDocPrId = 1;

 function addImageToDocx(dataUri, baseName) {
  const parsed = dataUriToBytesAndExt(dataUri);
  if (!parsed) return null;
  const rId = `rId${nextRId++}`;
  const fileName = `${baseName}.${parsed.ext}`;
  zipFiles.push({ name: `word/media/${fileName}`, data: parsed.u8 });
  rels.push(`<Relationship Id="${rId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${fileName}"/>`);
  return rId;
 }

 const rIdCbmba = addImageToDocx(LOGO_CBMBA_DATA || LOGO_CBMBA, "logo_cbmba");
 const rIdAbm = addImageToDocx(LOGO_ABM_DATA || LOGO_ABM, "logo_abm");

 const date = $("assumeDate").value || getTodayISO();
 const time = $("assumeTime").value || "06:50";
 const handover = $("handoverTime").value || "06:50";
 const is12 = $("officerMode").value === "12";
 const end24Student = plusTime(date, time, 24);
 const offStartTime = "07:00";
 const offEnd1 = plusTime(date, offStartTime, is12 ? 12 : 24);
 const offEnd24 = plusTime(date, offStartTime, 24);

 const studentIdx = $("student").value;
 const student = studentIdx === "" ? null : people[Number(studentIdx)];
 const nextIdx = $("nextStudent").value;
 const next = nextIdx === "" ? null : people[Number(nextIdx)];

 const countOfficers = is12 ? 2 : 1;
 const officerRunsList = [];
 for (let n = 1; n <= countOfficers; n++) {
  const el = $(`officer${n}`);
  const warEl = $(`officerWar${n}`);
  if (el && el.value !== "" && officers[Number(el.value)]) {
   const o = officers[Number(el.value)];
   const w = warEl ? warEl.value : getOfficerWar(Number(el.value));
   const start = (is12 && n === 2) ? offEnd1 : { date, time: offStartTime };
   const end = (is12 && n === 1) ? offEnd1 : offEnd24;
   officerRunsList.push(
    wRun(`${o[2]} `, { bold: true }) +
    wRunsWarName(o[0], w) +
    wRun(`, Mat.: ${o[1]}, das ${start.time}H do dia ${fmtDate(start.date)} às ${end.time}H do dia ${fmtDate(end.date)}`)
   );
  }
 }

 const duty = getOrderedDutyList();
 const dutySet = new Set(duty.map(x => x.i));

 const matsAluno = mergeSectionItemsWithPhotos([
  ...[...document.querySelectorAll(".matcheck-aluno:checked")].map(c => ({ type: "bullet", text: materialsAluno[Number(c.value)].text })),
  ...parseStructuredLines($("extraMatAluno").value)
 ], "matAluno");
 const matsMasc = mergeSectionItemsWithPhotos([
  ...[...document.querySelectorAll(".matcheck-masc:checked")].map(c => ({ type: "bullet", text: materialsMasc[Number(c.value)].text })),
  ...parseStructuredLines($("extraMatMasc").value)
 ], "matMasc");
 const matsFem = mergeSectionItemsWithPhotos([
  ...[...document.querySelectorAll(".matcheck-fem:checked")].map(c => ({ type: "bullet", text: materialsFem[Number(c.value)].text })),
  ...parseStructuredLines($("extraMatFem").value)
 ], "matFem");

 const sleepDutyList = duty.filter(x => $(`sleep_${x.i}`) ? $(`sleep_${x.i}`).checked : true).map(x => x.p);
 const extraSleepIndices = [...document.querySelectorAll(".sleepcheck:checked")]
  .map(c => Number(c.id.split("_")[1]))
  .filter(i => !dutySet.has(i));
 const extraSleepPeople = extraSleepIndices.map(i => people[i]);
 const espMasc = extraSleepPeople.filter(p => p[3] === "Espadarte" && p[4] === "M");
 const espFem = extraSleepPeople.filter(p => p[3] === "Espadarte" && p[4] === "F");
 const guaMasc = extraSleepPeople.filter(p => p[3] === "Guardião" && p[4] === "M");
 const guaFem = extraSleepPeople.filter(p => p[3] === "Guardião" && p[4] === "F");
 const totalEspPernoite = espMasc.length + espFem.length;
 const totalGuaPernoite = guaMasc.length + guaFem.length;
 const totalPernoiteCount = sleepDutyList.length + totalEspPernoite + totalGuaPernoite;

 // 1. Cabeçalho institucional com brasões laterais + linha preta simples abaixo do cabeçalho
 const logoEmu = 760000; // ~80px
 const hdrBottomBorder = `<w:tcBorders><w:top w:val="none"/><w:left w:val="none"/><w:bottom w:val="single" w:sz="6" w:space="0" w:color="000000"/><w:right w:val="none"/></w:tcBorders>`;
 const headerTableXml = `<w:tbl><w:tblPr><w:tblW w:w="10200" w:type="dxa"/><w:jc w:val="center"/><w:tblCellSpacing w:w="0" w:type="dxa"/><w:tblBorders><w:top w:val="none"/><w:left w:val="none"/><w:bottom w:val="single" w:sz="6" w:space="0" w:color="000000"/><w:right w:val="none"/><w:insideH w:val="none"/><w:insideV w:val="none"/></w:tblBorders><w:tblCellMar><w:top w:w="40" w:type="dxa"/><w:left w:w="60" w:type="dxa"/><w:bottom w:w="140" w:type="dxa"/><w:right w:w="60" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid><w:gridCol w:w="1400"/><w:gridCol w:w="7400"/><w:gridCol w:w="1400"/></w:tblGrid><w:tr><w:tc><w:tcPr><w:tcW w:w="1400" w:type="dxa"/>${hdrBottomBorder}<w:vAlign w:val="center"/></w:tcPr>${wPara(rIdCbmba ? wInlineImageXml(rIdCbmba, logoEmu, logoEmu, nextDocPrId++, "Brasao_CBMBA") : "", { align: "center", before: 0, after: 0, line: 240 })}</w:tc><w:tc><w:tcPr><w:tcW w:w="7400" w:type="dxa"/>${hdrBottomBorder}<w:vAlign w:val="center"/></w:tcPr>${wPara(wRun("CORPO DE BOMBEIROS MILITAR DA BAHIA", { bold: true, sz: 24, color: "000000" }), { align: "center", before: 20, after: 40, line: 300 })}${wPara(wRun("INSTITUTO MILITAR DE ENSINO SUPERIOR DE BOMBEIROS", { bold: true, sz: 24, color: "000000" }), { align: "center", before: 20, after: 40, line: 300 })}${wPara(wRun("ACADEMIA DE BOMBEIROS MILITAR", { bold: true, sz: 24, color: "000000" }), { align: "center", before: 20, after: 40, line: 300 })}</w:tc><w:tc><w:tcPr><w:tcW w:w="1400" w:type="dxa"/>${hdrBottomBorder}<w:vAlign w:val="center"/></w:tcPr>${wPara(rIdAbm ? wInlineImageXml(rIdAbm, logoEmu, logoEmu, nextDocPrId++, "Brasao_ABM") : "", { align: "center", before: 0, after: 0, line: 240 })}</w:tc></w:tr></w:tbl>`;

 // 2. Tabela I) Efetivo de Serviço com bordas pretas simples e cabeçalho cinza neutro (padrão Word)
 const cellBordersXml = `<w:tcBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="000000"/><w:left w:val="single" w:sz="4" w:space="0" w:color="000000"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="000000"/><w:right w:val="single" w:sz="4" w:space="0" w:color="000000"/></w:tcBorders>`;
 const tblBordersXml = `<w:tblBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="000000"/><w:left w:val="single" w:sz="4" w:space="0" w:color="000000"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="000000"/><w:right w:val="single" w:sz="4" w:space="0" w:color="000000"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="000000"/><w:insideV w:val="single" w:sz="4" w:space="0" w:color="000000"/></w:tblBorders>`;
 const cellMarginsXml = `<w:tblCellMar><w:top w:w="100" w:type="dxa"/><w:left w:w="140" w:type="dxa"/><w:bottom w:w="100" w:type="dxa"/><w:right w:w="140" w:type="dxa"/></w:tblCellMar>`;

 function wHeaderCell(text, widthDxa) {
  return `<w:tc><w:tcPr><w:tcW w:w="${widthDxa}" w:type="dxa"/>${cellBordersXml}<w:shd w:val="clear" w:color="auto" w:fill="EAEAEA"/><w:vAlign w:val="center"/></w:tcPr>${wPara(wRun(text, { bold: true, sz: 21 }), { align: "left", before: 20, after: 20, line: 280 })}</w:tc>`;
 }

 const dutyRowsXml = duty.length ? duty.map((x, idx) => `
  <w:tr>
   <w:tc><w:tcPr><w:tcW w:w="1000" w:type="dxa"/>${cellBordersXml}<w:vAlign w:val="center"/></w:tcPr>${wPara(wRun(`${idx + 1}º`, { sz: 21 }), { align: "left", before: 20, after: 20, line: 280 })}</w:tc>
   <w:tc><w:tcPr><w:tcW w:w="5400" w:type="dxa"/>${cellBordersXml}<w:vAlign w:val="center"/></w:tcPr>${wPara(wRun("AL OF BM ", { bold: true, sz: 21 }) + wRunsWarName(x.p[1], x.p[5], { sz: 21 }), { align: "left", before: 20, after: 20, line: 280 })}${wPara(wRun(`Mat.: ${x.p[2]}`, { sz: 20 }), { align: "left", before: 0, after: 20, line: 280 })}</w:tc>
   <w:tc><w:tcPr><w:tcW w:w="1200" w:type="dxa"/>${cellBordersXml}<w:vAlign w:val="center"/></w:tcPr>${wPara(wRun(x.p[0], { sz: 21 }), { align: "left", before: 20, after: 20, line: 280 })}</w:tc>
   <w:tc><w:tcPr><w:tcW w:w="2600" w:type="dxa"/>${cellBordersXml}<w:vAlign w:val="center"/></w:tcPr>${wPara(wRun(formatDutyRoleLabel(x.role, x.p, student), { sz: 21 }), { align: "left", before: 20, after: 20, line: 280 })}</w:tc>
  </w:tr>`).join("") : `<w:tr><w:tc><w:tcPr><w:tcW w:w="10200" w:type="dxa"/><w:gridSpan w:val="4"/>${cellBordersXml}</w:tcPr>${wPara(wRun("Não consta.", { sz: 21 }), { align: "left", before: 40, after: 40, line: 280 })}</w:tc></w:tr>`;

 const dutyTableXml = `<w:tbl><w:tblPr><w:tblW w:w="10200" w:type="dxa"/><w:jc w:val="center"/><w:tblCellSpacing w:w="0" w:type="dxa"/>${tblBordersXml}${cellMarginsXml}</w:tblPr><w:tblGrid><w:gridCol w:w="1000"/><w:gridCol w:w="5400"/><w:gridCol w:w="1200"/><w:gridCol w:w="2600"/></w:tblGrid><w:tr>${wHeaderCell("Ordem", 1000)}${wHeaderCell("Nome de Guerra", 5400)}${wHeaderCell("Número", 1200)}${wHeaderCell("Função", 2600)}</w:tr>${dutyRowsXml}</w:tbl>`;

 // 3. IX) ANEXOS em DOCX — Opção A (Imagem centralizada com moldura preta fina 1pt + legenda centralizada logo abaixo)
 let photosDocxXml = "";
 if (photoData.length) {
  photosDocxXml += wSectionTitle("IX) ANEXOS");
  photoData.forEach((p, idx) => {
   const num = String(idx + 1).padStart(2, "0");
   const ownDesc = p.desc && p.desc.trim() ? p.desc.trim() : "";
   const cleanDesc = ownDesc ? (/[.!;?]$/.test(ownDesc) ? ownDesc : `${ownDesc}.`) : "";
   const rIdPhoto = addImageToDocx(p.data, `anexo_foto_${num}`);
   if (rIdPhoto) {
    photosDocxXml += wPara(wInlineImageXml(rIdPhoto, 3800000, 2600000, nextDocPrId++, `Foto_${num}`, true), { align: "center", before: 180, after: 60, line: 240, keepNext: true });
   }
   const captionRuns = wRun(`Foto ${num}${cleanDesc ? ":" : ""}`, { bold: true, sz: 21, color: "000000" }) + (cleanDesc ? wRun(" ", { sz: 21 }) + wRunsWhatsAppBold(cleanDesc, { sz: 21, color: "000000" }) : "");
   photosDocxXml += wPara(captionRuns, { align: "center", before: 0, after: 220 });
  });
 }

 const studentTitleUpper = student && student[4] === "F" ? "ALUNA DE DIA" : "ALUNO DE DIA";
 const studentTitleNormal = getStudentTitleByGender(student);
 const titleStr = `RELATÓRIO DO SERVIÇO DE ${studentTitleUpper} À ACADEMIA DE BOMBEIROS MILITAR, DAS ${time}H DO DIA ${fmtDate(date)}, ${weekday(date).toUpperCase()}, ÀS ${handover}H DO DIA ${fmtDate(end24Student.date)}, ${weekday(end24Student.date).toUpperCase()}.`;

 const studentRuns = student
  ? (wRun("AL OF BM ", { bold: true }) + wRunsWarName(student[1], student[5]) + wRun(`, Nº ${student[0]}, Mat.: ${student[2]}.`))
  : wRun("[selecionar Aluno(a) de Dia]");

 const officerParasXml = officerRunsList.length > 1
  ? officerRunsList.map((runs, idx) => wPara(wRun(`${idx + 1}º OFICIAL DE DIA: `, { bold: true }) + runs + wRun("."), { before: 80, after: 80 })).join("")
  : wPara(wRun("OFICIAL DE DIA: ", { bold: true }) + (officerRunsList.length === 1 ? officerRunsList[0] + wRun(".") : wRun("[selecionar Oficial(is) de Dia]")), { before: 80, after: 80 });

 const nextStudentRuns = next
  ? (wRun("AL OF BM ", { bold: true }) + wRunsWarName(next[1], next[5]) + wRun(`, Nº ${next[0]}, Mat.: ${next[2]}`))
  : wRun("[selecionar próximo Aluno de Dia]");

 const sigLine1Runs = student
  ? (wRunsWarName(student[1], student[5]) + wRun(" - ") + wRun("AL OF QOBM", { bold: true }))
  : (wRun("[NOME DO ALUNO DE DIA] - ") + wRun("AL OF QOBM", { bold: true }));

 const sigLine2Runs = wRun(`${studentTitleNormal}${student ? ` - Nº ${student[0]} | Mat.: ${student[2]}` : ""}`);

 const bodyContentXml = [
  headerTableXml,
  wPara(wRun(titleStr, { bold: true, sz: 23 }), { align: "center", before: 280, after: 220, line: 320 }),
  wPara(wRun("LOCAL: ", { bold: true }) + wRun("BR 324, 540, Via Cia Sul - ABM, CEP: 43.700-000, Simões Filho - BA."), { before: 80, after: 80 }),
  wPara(wRun(`${studentTitleUpper}: `, { bold: true }) + studentRuns, { before: 80, after: 80 }),
  officerParasXml,
  wPara(wRun("ASSUNÇÃO: ", { bold: true }) + wRun(`Assumi o serviço de ${studentTitleNormal} da Academia de Bombeiros Militar, às ${time}h, fazendo constar as ordens, alterações e materiais à disposição.`), { before: 80, after: 140 }),

  wSectionTitle("I) EFETIVO DE SERVIÇO"),
  dutyTableXml,
  wRenderSectionWithPhotos($("otherDuty").value, "otherDuty", ""),

  wSectionTitle("II) MATERIAL A CARGO"),
  wSubhead("1.1 A cargo do Aluno de Dia"),
  wRenderMixedItems(matsAluno, "Não consta."),
  wSubhead("1.2 Área Masculina"),
  wRenderMixedItems(matsMasc, "Não consta."),
  wSubhead("1.3 Área Feminina"),
  wRenderMixedItems(matsFem, "Não consta."),

  wSectionTitle("III) ALTERAÇÕES DOS CURSOS"),
  wSubhead("EFETIVO DE SERVIÇO:"),
  wRenderSectionWithPhotos($("changesDuty").value, "changesDuty", "Sem alterações."),
  wSubhead("1º CFO 2025 - ESPADARTES:"),
  wRenderSectionWithPhotos($("changes2025").value, "changes2025", "Sem alterações."),
  wSubhead("1º CFO 2026 - GUARDIÕES:"),
  wRenderSectionWithPhotos($("changes2026").value, "changes2026", "Sem alterações."),

  wSectionTitle("IV) DOCUMENTOS RECEBIDOS"),
  wRenderSectionWithPhotos($("received").value, "received", "Não consta."),

  wSectionTitle("V) DOCUMENTOS ENTREGUES"),
  wRenderSectionWithPhotos($("delivered").value, "delivered", "Não consta."),

  wSectionTitle("VI) INFORMAÇÕES"),
  wSubhead("a. Área Masculina:"),
  wSubheadGender("Alojamento masculino - Turma ESPADARTES 2025:"),
  wRenderSectionWithPhotos($("infoDormMEsp").value, "infoDormMEsp", "Não consta."),
  wSubheadGender("Alojamento masculino - Turma GUARDIÕES 2026:"),
  wRenderSectionWithPhotos($("infoDormMGua").value, "infoDormMGua", "Não consta."),
  wSubheadGender("Banheiro masculino (em conjunto):"),
  wRenderSectionWithPhotos($("infoBathM").value, "infoBathM", "Não consta."),

  wSubhead("b. Área Feminina:"),
  wSubheadGender("Alojamento feminino - Turma ESPADARTES 2025:"),
  wRenderSectionWithPhotos($("infoDormFEsp").value, "infoDormFEsp", "Não consta."),
  wSubheadGender("Alojamento feminino - Turma GUARDIÕES 2026:"),
  wRenderSectionWithPhotos($("infoDormFGua").value, "infoDormFGua", "Não consta."),
  wSubheadGender("Banheiro feminino (em conjunto):"),
  wRenderSectionWithPhotos($("infoBathF").value, "infoBathF", "Não consta."),

  wSubhead("c. Área comum, salas de aula e rancho:"),
  wRenderSectionWithPhotos($("infoCommon").value, "infoCommon", "Não consta."),

  wSectionTitle("VII) PERNOITE"),
  wPara(wRun("Total do efetivo que pernoitará: ", { bold: true }) + wRun(String(totalPernoiteCount), { bold: true }) + wRun(" " + (totalPernoiteCount === 1 ? "militar" : "militares")), { before: 80, after: 100 }),
  wSubhead(`Efetivo de Serviço: ${fmtMil(sleepDutyList.length)}`),
  sleepDutyList.length ? sleepDutyList.map(wCadetPernoiteBullet).join("") : wBulletPara(wRun("Não consta.")),

  wSubhead(`Turma ESPADARTES 2025: ${fmtMil(totalEspPernoite)}`),
  wSubheadGender(`Masculino da turma ESPADARTES: ${fmtMil(espMasc.length)}`),
  espMasc.length ? espMasc.map(wCadetPernoiteBullet).join("") : wBulletPara(wRun("Não consta.")),
  wSubheadGender(`Feminino da turma ESPADARTES: ${fmtMil(espFem.length)}`),
  espFem.length ? espFem.map(wCadetPernoiteBullet).join("") : wBulletPara(wRun("Não consta.")),

  wSubhead(`Turma GUARDIÕES 2026: ${fmtMil(totalGuaPernoite)}`),
  wSubheadGender(`Masculino da turma GUARDIÕES: ${fmtMil(guaMasc.length)}`),
  guaMasc.length ? guaMasc.map(wCadetPernoiteBullet).join("") : wBulletPara(wRun("Não consta.")),
  wSubheadGender(`Feminino da turma GUARDIÕES: ${fmtMil(guaFem.length)}`),
  guaFem.length ? guaFem.map(wCadetPernoiteBullet).join("") : wBulletPara(wRun("Não consta.")),
  wRenderSectionWithPhotos($("sleepNotes").value, "sleepNotes", ""),

  wSectionTitle("VIII) DIVERSOS"),
  wRenderSectionWithPhotos($("misc").value, "misc", "Não consta."),

  photosDocxXml,

  wSectionTitle("PASSAGEM DO SERVIÇO"),
  wPara(wRun(`Passei o serviço às ${handover}h do dia ${fmtDate(end24Student.date)} para `) + nextStudentRuns + wRun(", com todas as ordens e alterações constantes em relatório."), { before: 100, after: 200 }),
  wPara(wRun(`Simões Filho - BA, ${fmtDate(end24Student.date)}.`), { align: "center", before: 360, after: 480 }),
  wPara(sigLine1Runs, { align: "center", before: 120, after: 40, line: 300 }),
  wPara(sigLine2Runs, { align: "center", before: 0, after: 200, line: 300 })
 ].join("");

 let stateCommentXml = "";
 if (includeEmbeddedState) {
  try {
   stateCommentXml = `<!--ABM_STATE_START:${encodeURIComponent(JSON.stringify(getState()))}:ABM_STATE_END-->`;
  } catch (e) {}
 }

 const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
 <w:body>
  ${bodyContentXml}
  <w:sectPr>
   <w:pgSz w:w="11906" w:h="16838"/>
   <w:pgMar w:top="850" w:right="850" w:bottom="850" w:left="850" w:header="450" w:footer="450" w:gutter="0"/>
  </w:sectPr>
 </w:body>
</w:document>`;

 const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
 <w:docDefaults>
  <w:rPrDefault>
   <w:rPr>
    <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:eastAsia="Arial" w:cs="Arial"/>
    <w:sz w:val="22"/>
    <w:szCs w:val="22"/>
    <w:color w:val="000000"/>
    <w:lang w:val="pt-BR" w:eastAsia="pt-BR" w:bidi="ar-SA"/>
   </w:rPr>
  </w:rPrDefault>
  <w:pPrDefault>
   <w:pPr>
    <w:spacing w:after="80" w:line="312" w:lineRule="auto"/>
   </w:pPr>
  </w:pPrDefault>
 </w:docDefaults>
 <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
  <w:name w:val="Normal"/>
  <w:qFormat/>
 </w:style>
</w:styles>`;

 const settingsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
 <w:zoom w:percent="100"/>
 <w:compat>
  <w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/>
  <w:compatSetting w:name="overrideTableStyleFontSizeAndJustification" w:uri="http://schemas.microsoft.com/office/word" w:val="1"/>
  <w:compatSetting w:name="enableOpenTypeFeatures" w:uri="http://schemas.microsoft.com/office/word" w:val="1"/>
 </w:compat>
</w:settings>
${stateCommentXml}`;

 const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
 <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
 <Default Extension="xml" ContentType="application/xml"/>
 <Default Extension="png" ContentType="image/png"/>
 <Default Extension="jpg" ContentType="image/jpeg"/>
 <Default Extension="gif" ContentType="image/gif"/>
 <Default Extension="webp" ContentType="image/webp"/>
 <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
 <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
 <Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
</Types>`;

 const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
 <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

 const wordRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
 ${rels.join("\n ")}
</Relationships>`;

 zipFiles.push(
  { name: "[Content_Types].xml", data: contentTypesXml },
  { name: "_rels/.rels", data: rootRelsXml },
  { name: "word/_rels/document.xml.rels", data: wordRelsXml },
  { name: "word/styles.xml", data: stylesXml },
  { name: "word/settings.xml", data: settingsXml },
  { name: "word/document.xml", data: documentXml }
 );

 return createZipArchive(zipFiles);
}

function buildCleanGoogleDocsHTML(includeEmbeddedState = true) {
 renderPreview();
 const previewClone = $("preview").cloneNode(true);
 previewClone.querySelectorAll("[data-edit-hint]").forEach(el => {
  el.removeAttribute("data-edit-hint");
  el.removeAttribute("data-sec");
  el.classList.remove("active-preview-sec", "prev-sec-block");
 });
 const repHeader = previewClone.querySelector(".rep-header");
 if (repHeader) {
  const tableHeader = document.createElement("table");
  tableHeader.setAttribute("style", "width:100%;border:none;border-bottom:1px solid #000;border-collapse:collapse;margin-bottom:14px;padding-bottom:8px");
  tableHeader.innerHTML = `
   <tr>
    <td style="width:90px;border:none;text-align:left;vertical-align:middle">
     <img src="${LOGO_CBMBA}" width="75" height="75" style="width:75px;height:75px">
    </td>
    <td style="border:none;text-align:center;vertical-align:middle;font-family:Arial,sans-serif;font-size:12.5pt;font-weight:bold;line-height:1.4">
     <div>CORPO DE BOMBEIROS MILITAR DA BAHIA</div>
     <div>INSTITUTO MILITAR DE ENSINO SUPERIOR DE BOMBEIROS</div>
     <div>ACADEMIA DE BOMBEIROS MILITAR</div>
    </td>
    <td style="width:90px;border:none;text-align:right;vertical-align:middle">
     <img src="${LOGO_ABM}" width="75" height="75" style="width:75px;height:75px">
    </td>
   </tr>`;
  repHeader.replaceWith(tableHeader);
 }

 let embeddedStateBlock = "";
 if (includeEmbeddedState) {
  try {
   const encodedState = encodeURIComponent(JSON.stringify(getState()));
   embeddedStateBlock = `<!--ABM_STATE_START:${encodedState}:ABM_STATE_END-->`;
  } catch (e) {}
 }

 return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
 <meta charset="utf-8">
 <title>Relatório de Serviço — ABM</title>
 <style>
  @page { size: A4; margin: 1.8cm; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 11pt; line-height: 1.6; color: #000; max-width: 21cm; margin: 0 auto; padding: 15px; }
  .reporttitle { text-align: center; font-weight: bold; text-transform: uppercase; margin: 20px 0 16px; font-size: 11.5pt; line-height: 1.5; }
  p { margin: 8px 0; text-align: justify; line-height: 1.6; }
  h5 { font-size: 11.5pt; margin: 26px 0 10px; padding-top: 8px; border-top: 1px solid #b5b5b5; font-weight: bold; }
  .subhead { font-weight: bold; margin: 15px 0 6px; font-size: 11pt; }
  .subhead-gender { font-weight: bold; margin: 10px 0 4px 12px; font-size: 10.5pt; }
  .custom-subtopic { margin: 12px 0 5px 0; font-size: 11pt; line-height: 1.5; }
  ul { margin: 6px 0 14px 0; padding-left: 22px; }
  li { margin: 5px 0; line-height: 1.55; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0 16px; font-size: 10.5pt; }
  th, td { border: 1px solid #000; padding: 6px 8px; text-align: left; vertical-align: middle; line-height: 1.45; }
  th { background-color: #eaeaea; font-weight: bold; }
  .sig { text-align: center; margin-top: 38px; line-height: 1.65; }
  .photo-item { margin: 16px 0 22px; text-align: center; }
  .photoout { max-width: 460px; height: auto; display: block; margin: 8px auto 6px; border: 1px solid #000; }
  .photo-caption { font-size: 10.5pt; margin: 4px auto 14px; text-align: center; }
 </style>
</head>
<body>
 ${previewClone.innerHTML}
 ${embeddedStateBlock}
</body>
</html>`;
}

function downloadBlobFile(contentOrBlob, filename, mimeType) {
 const blob = (contentOrBlob instanceof Blob) ? contentOrBlob : new Blob([contentOrBlob], { type: mimeType });
 if (window.navigator && window.navigator.msSaveOrOpenBlob) {
  window.navigator.msSaveOrOpenBlob(blob, filename);
  return;
 }
 const url = URL.createObjectURL(blob);
 const a = document.createElement("a");
 a.style.display = "none";
 a.href = url;
 a.download = filename;
 document.body.appendChild(a);
 a.click();
 setTimeout(() => {
  a.remove();
  URL.revokeObjectURL(url);
 }, 1500);
}

// =========================================================================
// SALVAMENTO AUTOMÁTICO MULTI-USUÁRIO (ISOLADO POR ALUNO DE DIA + SESSÃO)
// =========================================================================
const DB_NAME = "ABM_Relatorio_MultiUser_DB";
const STORE_NAME = "drafts";
let dbInstance = null;
let linkedDriveFileHandle = null;
let autoSaveTimer = null;

function openAutoSaveDB() {
 return new Promise((resolve) => {
  if (dbInstance) return resolve(dbInstance);
  if (!window.indexedDB) return resolve(null);
  const req = indexedDB.open(DB_NAME, 1);
  req.onupgradeneeded = e => {
   const db = e.target.result;
   if (!db.objectStoreNames.contains(STORE_NAME)) {
    db.createObjectStore(STORE_NAME);
   }
  };
  req.onsuccess = e => {
   dbInstance = e.target.result;
   resolve(dbInstance);
  };
  req.onerror = () => resolve(null);
 });
}

async function saveToIndexedDB(key, stateObj) {
 const db = await openAutoSaveDB();
 if (!db) return;
 return new Promise(resolve => {
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).put(stateObj, key);
  tx.oncomplete = () => resolve(true);
  tx.onerror = () => resolve(false);
 });
}

async function loadFromIndexedDB(key) {
 const db = await openAutoSaveDB();
 if (!db) return null;
 return new Promise(resolve => {
  const tx = db.transaction(STORE_NAME, "readonly");
  const req = tx.objectStore(STORE_NAME).get(key);
  req.onsuccess = () => resolve(req.result || null);
  req.onerror = () => resolve(null);
 });
}

async function loadDraftForStudent(studentIdx) {
 if (studentIdx === "" || studentIdx === null || studentIdx === undefined) return null;
 const idb = await loadFromIndexedDB(`student_draft_${studentIdx}`);
 if (idb) return idb;
 try {
  const ls = localStorage.getItem(`abm_student_draft_v10_${studentIdx}`);
  if (ls) return JSON.parse(ls);
 } catch (e) {}
 return null;
}

async function writeToLinkedDriveFile() {
 if (!linkedDriveFileHandle) return;
 try {
  const docxBlob = buildTrueDocxBlob(true);
  const writable = await linkedDriveFileHandle.createWritable();
  await writable.write(docxBlob);
  await writable.close();
  const nowStr = new Date().toLocaleTimeString("pt-BR");
  $("driveSyncStatus").textContent = `Salvo no Drive (${linkedDriveFileHandle.name}) às ${nowStr}`;
 } catch (err) {
  $("driveSyncStatus").textContent = "Permissão de gravação pausada. Clique em Auto-Salvar na Pasta do Drive.";
 }
}

function getSigabmAccountKey() {
 const u = (typeof window.SIGABM_getCurrentUser === "function") ? window.SIGABM_getCurrentUser() : "";
 return u ? `acct_${u}` : "";
}

async function performImmediateAutoSave() {
 if (isRestoringState) return;
 const acctKey = getSigabmAccountKey();
 if (!acctKey) return;
 const state = getState();
 const studentIdx = state.student;

 await saveToIndexedDB(`sigabm_rs_${acctKey}`, state);
 try {
  localStorage.setItem(`sigabm_rs_ls_${acctKey}`, JSON.stringify({ ...state, photoData: [] }));
 } catch (e) {}

 if (linkedDriveFileHandle) {
  await writeToLinkedDriveFile();
 }

 const timeStr = new Date().toLocaleTimeString("pt-BR");
 const studentName = studentIdx !== "" && people[Number(studentIdx)] ? ` (${people[Number(studentIdx)][5]})` : "";
 $("autoSaveBadge").textContent = `Salvo localmente${studentName} às ${timeStr}`;
}

function triggerAutoSave() {
 if (isRestoringState) return;
 $("autoSaveBadge").textContent = "Salvando...";
 if (autoSaveTimer) clearTimeout(autoSaveTimer);
 autoSaveTimer = setTimeout(performImmediateAutoSave, 250);
}

// Menu Executivo de Rascunho
$("draftMenu").addEventListener("change", async (e) => {
 const val = e.target.value;
 e.target.value = "";
 if (val === "prev_report") {
  openPrevReportModal();
  return;
 }
 if (val === "new") {
  if (!(await askAppConfirm("Deseja limpar todos os campos e iniciar um relatório do zero?", "Novo Relatório Limpo"))) return;
  try { sessionStorage.removeItem("abm_active_tab_draft_v10"); } catch(er) {}
  resetToCleanForm();
  $("autoSaveBadge").textContent = "Formulário limpo";
  showToast("Formulário limpo. Pronto para novo preenchimento.");
 } else if (val === "download") {
  const docxBlob = buildTrueDocxBlob(true);
  const d = $("assumeDate").value || getTodayISO();
  const studentIdx = $("student").value;
  const war = studentIdx !== "" && people[Number(studentIdx)] ? `_${people[Number(studentIdx)][5]}` : "";
  downloadBlobFile(docxBlob, `Relatorio_Rascunho_ABM_${d}${war}.docx`, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  showToast("Rascunho salvo no aparelho.");
 } else if (val === "upload") {
  $("importDraftInput").click();
 } else if (val === "drive") {
  const d = $("assumeDate").value || getTodayISO();
  const studentIdx = $("student").value;
  const war = studentIdx !== "" && people[Number(studentIdx)] ? `_${people[Number(studentIdx)][5]}` : "";
  if (window.showSaveFilePicker) {
   window.showSaveFilePicker({ suggestedName: `Relatorio_Rascunho_ABM_${d}${war}.docx`, types: [{ description: "Word", accept: { "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] } }] })
    .then(async handle => {
     linkedDriveFileHandle = handle;
     await performImmediateAutoSave();
     showToast("Pasta vinculada. O rascunho será salvo automaticamente.");
    }).catch(er => { if (er.name !== "AbortError") showToast("Não foi possível vincular a pasta."); });
  } else {
   showToast("Função indisponível neste navegador. Use a opção de salvar rascunho manualmente.");
  }
 }
});

$("importDraftInput").addEventListener("change", async e => {
 const f = e.target.files?.[0];
 if (!f) return;
 try {
  const buf = await f.arrayBuffer();
  const rawAscii = new TextDecoder("iso-8859-1").decode(new Uint8Array(buf));
  const cleanTxt = rawAscii.replace(/=\r?\n/g, "");
  let parsed = null;
  const match = cleanTxt.match(/ABM_STATE_START:([A-Za-z0-9%_\-\.!~*'()]+):ABM_STATE_END/);
  if (match && match[1]) {
   parsed = JSON.parse(decodeURIComponent(match[1].replace(/=25/g, "%")));
  } else {
   parsed = JSON.parse(new TextDecoder("utf-8").decode(new Uint8Array(buf)));
  }
  setState(parsed);
  await performImmediateAutoSave();
  showToast("Rascunho carregado com sucesso.");
 } catch (err) {
  showToast("Não foi possível restaurar o rascunho.");
 }
 e.target.value = "";
});

// Menu Executivo de Exportação
function copyFormattedPreviewToClipboard() {
 renderPreview();
 let copiedRich = false;
 try {
  const sel = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents($("preview"));
  sel.removeAllRanges(); sel.addRange(range);
  copiedRich = document.execCommand("copy");
  sel.removeAllRanges();
 } catch (e) {}
 if (!copiedRich && navigator.clipboard && window.ClipboardItem) {
  const htmlContent = buildCleanGoogleDocsHTML(false);
  const plainText = $("preview").innerText;
  const item = new ClipboardItem({ "text/html": new Blob([htmlContent], { type: "text/html" }), "text/plain": new Blob([plainText], { type: "text/plain" }) });
  navigator.clipboard.write([item]).catch(() => {});
  copiedRich = true;
 }
 return copiedRich;
}

$("btnExportMenu").addEventListener("click", () => {
 const format = $("exportFormat").value;
 const d = $("assumeDate").value || getTodayISO();
 const studentIdx = $("student").value;
 const war = studentIdx !== "" && people[Number(studentIdx)] ? `_${people[Number(studentIdx)][5]}` : "";
 
 if (format === "pdf") {
  renderPreview();
  document.body.classList.add("rs-printing-mode");
  const cleanupPrint = () => document.body.classList.remove("rs-printing-mode");
  window.addEventListener("afterprint", cleanupPrint, { once: true });
  setTimeout(() => { window.print(); setTimeout(cleanupPrint, 1200); }, 40);
 } else if (format === "word") {
  const docxBlob = buildTrueDocxBlob(true);
  downloadBlobFile(docxBlob, `Relatorio_Aluno_de_Dia_ABM_${d}${war}.docx`, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  showToast("Arquivo Word (.docx) gerado.");
 } else if (format === "gdocs") {
  const cleanHtml = buildCleanGoogleDocsHTML(true);
  downloadBlobFile(cleanHtml, `Relatorio_GoogleDocs_ABM_${d}${war}.html`, "text/html;charset=utf-8");
  copyFormattedPreviewToClipboard();
  showToast("Arquivo HTML gerado e texto copiado para a área de transferência.");
 } else if (format === "text") {
  renderPreview();
  const textToCopy = $("preview").innerText;
  let ok = false;
  try {
   const tempTa = document.createElement("textarea");
   tempTa.value = textToCopy; tempTa.style.position = "fixed"; tempTa.style.left = "-9999px";
   document.body.appendChild(tempTa); tempTa.focus(); tempTa.select();
   ok = document.execCommand("copy"); document.body.removeChild(tempTa);
  } catch (e) {}
  if (!ok && navigator.clipboard) navigator.clipboard.writeText(textToCopy).catch(() => {});
  showToast("Texto do relatório copiado para a área de transferência.");
 } else if (format === "app") {
  const fullHtml = "<!DOCTYPE html>\n" + document.documentElement.outerHTML;
  const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
  downloadBlobFile(blob, "Relatorio_Servico_ABM.html", "text/html;charset=utf-8");
  showToast("Aplicativo offline baixado.");
 }
});

formFields.forEach(id => {
 const el = $(id);
 if (!el) return;
 el.addEventListener("focus", () => {
  const secKey = fieldToPreviewSectionMap[id];
  if (secKey) focusPreviewSection(secKey);
 });
 if (id === "student") return;
 el.addEventListener("input", () => {
  renderPreview();
  const secKey = fieldToPreviewSectionMap[id];
  if (secKey) focusPreviewSection(secKey);
  triggerAutoSave();
 });
});
$("dutyList").addEventListener("change", () => focusPreviewSection("duty"));
$("sleepList").addEventListener("change", () => focusPreviewSection("sleep"));
$("assumeDate").addEventListener("change", () => { renderOfficerFields(); triggerAutoSave(); });
$("assumeTime").addEventListener("change", () => { renderOfficerFields(); triggerAutoSave(); });
$("officerMode").addEventListener("change", () => { renderOfficerFields(); triggerAutoSave(); });
$("autoPunctuationToggle").addEventListener("change", () => { renderPreview(); triggerAutoSave(); });
$("autoBoldRanksToggle").addEventListener("change", () => { renderPreview(); triggerAutoSave(); });

$("refresh").onclick = () => {
 renderPreview();
 showToast("Prévia do relatório atualizada.");
};
$("save").onclick = async () => {
 await performImmediateAutoSave();
 showToast("Relatório salvo.");
};

$("clear").onclick = async () => {
 if (!(await askAppConfirm("Deseja limpar todos os campos deste relatório?", "Limpar Formulário"))) return;
 resetToCleanForm();
 showToast("Formulário limpo.");
};


// =========================================================================
// IMPORTADOR INTELIGENTE DO RELATÓRIO ANTERIOR (.DOCX, .PDF, .HTML, TEXTO)
// + REMOVEDOR RÁPIDO ITEM A ITEM (✕)
// =========================================================================
const IMPORT_DEST_CATALOG = [
 { id: "matAluno",     group: "mat",  label: "II - 1.1) Material a cargo do Aluno de Dia" },
 { id: "matMasc",      group: "mat",  label: "II - 1.2) Material — Área Masculina" },
 { id: "matFem",       group: "mat",  label: "II - 1.3) Material — Área Feminina" },
 { id: "received",     group: "doc",  label: "IV) Documentos Recebidos (passados p/ você)" },
 { id: "delivered",    group: "doc",  label: "V) Documentos Entregues" },
 { id: "infoDormMEsp", group: "info", label: "VI - a.1) Alojamento Masculino — Espadartes 2025" },
 { id: "infoDormMGua", group: "info", label: "VI - a.2) Alojamento Masculino — Guardiões 2026" },
 { id: "infoBathM",    group: "info", label: "VI - a.3) Banheiro Masculino (em conjunto)" },
 { id: "infoDormFEsp", group: "info", label: "VI - b.1) Alojamento Feminino — Espadartes 2025" },
 { id: "infoDormFGua", group: "info", label: "VI - b.2) Alojamento Feminino — Guardiões 2026" },
 { id: "infoBathF",    group: "info", label: "VI - b.3) Banheiro Feminino (em conjunto)" },
 { id: "infoCommon",   group: "info", label: "VI - c) Área Comum, Salas de Aula e Rancho" },
 { id: "changesDuty",  group: "alt",  label: "III) Alterações — Efetivo de Serviço" },
 { id: "changes2025",  group: "alt",  label: "III) Alterações — 1º CFO 2025 (Espadartes)" },
 { id: "changes2026",  group: "alt",  label: "III) Alterações — 1º CFO 2026 (Guardiões)" },
 { id: "misc",         group: "misc", label: "VIII) Diversos" },
 { id: "sleepNotes",   group: "misc", label: "VII) Pernoite (Observações)" },
 { id: "otherDuty",    group: "misc", label: "I) Efetivo de Serviço (Observações)" }
];

const IMPORT_GROUPS_META = [
 { key: "mat",  label: "II) Materiais a Cargo (Fixos + Extras)", defaultChecked: true },
 { key: "doc",  label: "IV) Documentos Recebidos", defaultChecked: true },
 { key: "info", label: "VI) Instalações (Alojamentos, Banheiros e Rancho)", defaultChecked: true },
 { key: "misc", label: "VIII) Diversos", defaultChecked: true },
 { key: "alt",  label: "III) Alterações dos Cursos / Efetivo", defaultChecked: false }
];

let groupEnabledState = { mat: true, doc: true, info: true, misc: true, alt: false };
let parsedPrevReportItems = [];
let prevReportStudentCandidate = "";
let detectedHandoverInfo = null;
let pasteAutoTimer = null;

function extractHandoverFromLines(lines) {
 if (!lines || !lines.length) return null;
 const joined = lines.join(" ");
 const passMatch = joined.match(/Passei\s+o\s+servi[cç]o\s+[aà]s\s+(\d{1,2}:\d{2})[hH]?\s+do\s+dia\s+(\d{2})\/(\d{2})\/(\d{4})\s+para\s+([^,.]+(?:,\s*N[º°o]\s*\d+)?)/i);
 if (!passMatch) return null;
 const timeStr = passMatch[1].padStart(5, "0");
 const isoDate = `${passMatch[4]}-${passMatch[3]}-${passMatch[2]}`;
 const targetRaw = norm(passMatch[5]);

 let foundIdx = -1;
 const numMatch = targetRaw.match(/N[º°O]?\s*(\d{1,2})\b/);
 if (numMatch) {
  const numStr = numMatch[1].padStart(2, "0");
  foundIdx = people.findIndex(p => p[0] === numStr);
 }
 if (foundIdx === -1) {
  foundIdx = people.findIndex(p => targetRaw.includes(norm(p[1])) || targetRaw.includes(norm(p[5])));
 }
 if (foundIdx === -1) return null;
 return {
  studentIdx: String(foundIdx),
  studentEntry: people[foundIdx],
  assumeDate: isoDate,
  dateBr: `${passMatch[2]}/${passMatch[3]}/${passMatch[4]}`,
  assumeTime: timeStr
 };
}

function updateHandoverBannerUI() {
 const banner = $("prevReportHandoverBanner");
 const txt = $("prevReportHandoverText");
 if (!banner || !txt) return;
 if (!detectedHandoverInfo || !detectedHandoverInfo.studentEntry) {
  banner.style.display = "none";
  return;
 }
 const p = detectedHandoverInfo.studentEntry;
 banner.style.display = "block";
 txt.innerHTML = `Preencher meu Cabeçalho automaticamente com a Passagem de Serviço detectada: <b>AL OF BM ${esc(p[5])} (Nº ${esc(p[0])})</b> · Assunção em <b>${esc(detectedHandoverInfo.dateBr)} às ${esc(detectedHandoverInfo.assumeTime)}h</b>`;
}

function openPrevReportModal() {
 $("prevReportModal").style.display = "block";
 renderPrevReportModalItems();
}
function closePrevReportModal() {
 $("prevReportModal").style.display = "none";
}

$("openPrevReportBtn").addEventListener("click", openPrevReportModal);
$("closePrevReportModalBtn").addEventListener("click", closePrevReportModal);
$("cancelPrevReportBtn").addEventListener("click", closePrevReportModal);
$("selectPrevReportFileBtn").addEventListener("click", () => $("prevReportFileInput").click());

$("markAllPrevBtn").addEventListener("click", () => {
 Object.keys(groupEnabledState).forEach(k => groupEnabledState[k] = true);
 parsedPrevReportItems.forEach(it => { if (!it.isTenenteDoc) it.checked = true; });
 renderPrevReportModalItems();
});
$("unmarkAllPrevBtn").addEventListener("click", () => {
 Object.keys(groupEnabledState).forEach(k => groupEnabledState[k] = false);
 parsedPrevReportItems.forEach(it => { it.checked = false; });
 renderPrevReportModalItems();
});

function runPasteAnalysisNow() {
 const raw = ($("pastePrevReportTextarea").value || "").trim();
 if (!raw) return false;
 const rawLines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
 const cleanedLines = preprocessRawReportLines(rawLines);
 processExtractedPrevReportLines(cleanedLines, "Texto colado");
 return parsedPrevReportItems.length > 0;
}

$("analyzePastedReportBtn").addEventListener("click", () => {
 if (!runPasteAnalysisNow()) {
  showToast("Cole o texto do relatório anterior na caixa antes de separar os tópicos.");
 } else {
  showToast(`${parsedPrevReportItems.length} itens identificados.`);
 }
});

// Reconhecimento 100% automático assim que o usuário cola ou digita o texto na caixa!
$("pastePrevReportTextarea").addEventListener("input", () => {
 if (pasteAutoTimer) clearTimeout(pasteAutoTimer);
 pasteAutoTimer = setTimeout(() => {
  if (($("pastePrevReportTextarea").value || "").trim().length > 20) {
   runPasteAnalysisNow();
  }
 }, 180);
});

// Pré-processador inteligente: limpa cabeçalhos/rodapés de impressão do navegador e reconstrói linhas quebradas do PDF
function preprocessRawReportLines(rawLines) {
 if (!rawLines || !rawLines.length) return [];
 const step1 = [];
 for (let i = 0; i < rawLines.length; i++) {
  let l = String(rawLines[i] || "").replace(/\s+/g, " ").trim();
  if (!l) continue;
  if (/^(file:\/\/\/|https?:\/\/)/i.test(l)) continue;
  if (/^\d{2}\/\d{2}\/\d{4},?\s+\d{2}:\d{2}\b/.test(l) || /ABM.*Gerador\s+de\s+Relat/i.test(l)) continue;
  if (/^Nomes\s+de\s+Guerra\s+em\s+Negrito$/i.test(l)) continue;
  if (/^\d+\s*\/\s*\d+$/.test(l)) continue;
  l = l
   .replace(/^[•\-*]+\s*[•\-*]+\s*/, "• ")
   .replace(/\$(\d+)\^\{\\circ\}\$/g, "$1º")
   .replace(/\$N\^\{[o°\\circ]+\}\s*(\d*)\$/gi, (_, d) => d ? `Nº ${d}` : "Nº")
   .replace(/1\s+ΒΙΟ\s+BIO/gi, "1 BIO");

  if (/^1[º°]\s*CFO\s*[-–—]?$/i.test(l) && i + 1 < rawLines.length) {
   const nxt = String(rawLines[i + 1] || "").trim();
   if (/^(Espadarte|Guardi)/i.test(nxt)) {
    step1.push(`1º CFO - ${nxt}`);
    i++;
    continue;
   }
  }
  step1.push(l);
 }

 const step2 = [];
 let i = 0;
 while (i < step1.length) {
  const cur = step1[i];
  const nCur = norm(cur).replace(/^[•\-*\s]+/, "").trim();
  if (/MAT\.?\s*:?\s*$/i.test(nCur) && i + 1 < step1.length && /^\d{3,}/.test(step1[i + 1].trim())) {
   step1[i] = `${cur} ${step1[i + 1].trim()}`;
   step1.splice(i + 1, 1);
   continue;
  }
  if (/ENTREGUE\s+A[O]?\s+(TEN|OFICIAL|CAP)\s*$/i.test(nCur) && i + 1 < step1.length) {
   step1[i] = `${cur} ${step1[i + 1].trim()}`;
   step1.splice(i + 1, 1);
   continue;
  }
  step2.push(cur);
  i++;
 }

 const step3 = [];
 let k = 0;
 while (k < step2.length) {
  const isDocPrefixOnly = s => /^[•\-*\s]*\d+\s+(COMUNICAC[AÃ]O|ATESTADO|BIO|PARTE|OFICIO|MEMORANDO|CAUTELA|RECURSO|CDF)S?\.?$/i.test(norm(s));
  if (isDocPrefixOnly(step2[k])) {
   const prefixes = [], strayMats = [];
   let scan = k;
   while (scan < step2.length) {
    const cand = step2[scan].trim();
    if (isDocPrefixOnly(cand)) { prefixes.push(cand.replace(/^[•\-*\s]+/, "").trim()); scan++; }
    else if (/^\d{6,}[.,;]?$/.test(cand)) { strayMats.push(cand); scan++; }
    else if (/^Deslocou\s+para$/i.test(cand)) { scan++; }
    else break;
   }
   const bodies = [];
   while (scan < step2.length && /^([•\-*\s]*AL\s+OF\s+BM\b)/i.test(norm(step2[scan]))) {
    let b = step2[scan].replace(/^[•\-*\s]+/, "").trim();
    if (/MAT\.?\s*:?\s*$/i.test(norm(b)) && strayMats.length > 0) b = `${b} ${strayMats.shift()}`;
    bodies.push(b);
    scan++;
   }
   if (prefixes.length > 0 && bodies.length > 0) {
    const count = Math.max(prefixes.length, bodies.length);
    for (let m = 0; m < count; m++) {
     const pfx = prefixes[m] || prefixes[prefixes.length - 1] || "";
     const bdy = bodies[m] || "";
     if (pfx && bdy) step3.push(`• ${pfx} - ${bdy}`);
     else if (bdy) step3.push(`• ${bdy}`);
     else if (pfx) step3.push(`• ${pfx}`);
    }
    k = scan;
    continue;
   }
  }
  step3.push(step2[k]);
  k++;
 }

 function isAnyHeading(lineStr) {
  for (const ctx of ["header", "mat", "changes", "docs", "info", "misc"]) {
   if (detectHeadingTransition(lineStr, ctx)) return true;
  }
  return false;
 }

 const merged = [];
 for (let j = 0; j < step3.length; j++) {
  const t = step3[j].trim();
  if (!t) continue;
  if (!merged.length) { merged.push(t); continue; }
  const prev = merged[merged.length - 1];
  const nT = norm(t), nPrev = norm(prev);

  // Se a linha começa com letra minúscula (ex.: "na parte de sentar.", "molhado.", "contrataram esse serviço."), é sempre continuação!
  const startsLower = /^[a-zà-ÿ]/.test(t) || /^,\s*entregue\b/i.test(t);
  if (startsLower && !isAnyHeading(t)) {
   merged[merged.length - 1] = `${prev} ${t}`;
   continue;
  }

  const startsWithBullet = /^[•\-*–—]\s*/.test(t);
  const startsWithQty = /^\d{1,3}\s+[A-Za-zÀ-ÿ]/.test(t);
  const isCurHeading = isAnyHeading(t);
  const isPrevHeading = isAnyHeading(prev);
  const isHeaderMeta = /^(LOCAL|ALUN[OA]|\d*º?\s*OFICIAL|ASSUNCAO|SIMOES FILHO|TOTAL DO EFETIVO|PERNOITARAM|SERVICO:|EFETIVO ALOJADO|EFETIVO APECADO|MASCULINO|FEMININO|TURMA ESPADARTES|TURMA GUARDIOES|ORDEM\b|\d+º\b|FOTO\s+\d+)/.test(nT);
  const startsNewParaKw = /^(INICIO\s+AS|AS\s+\d{1,2}H|OBS\b|OBSERVAC|ALEM\s+DOS|TEN\s+BM\b)/.test(nT);

  const startsAlOf = /^AL\s+OF\s+BM\b/.test(nT);
  const prevExpectsAlOf = /(\b(O|OS|A|AS|AO|AOS|DO|DOS|DA|DAS|PELO|PELA|COM|PARA|E)\s*$|\b(COMUNICACAO|ATESTADO|PARTE|BIO)\s*[-–—]?\s*$|\(\s*$)/.test(nPrev);
  const prevEndsCompleteMat = /MAT\.?:?\s*[\d.\-]+(\s*\([A-Z]+\))?[.;,]?$/.test(nPrev);

  const prevClean = prev.replace(/\s*\(vide\s+Fotos?\s+[^)]+\)\s*$/i, "").trim();
  const prevEndsPunct = /[.;:!?]$/.test(prevClean) && !/MAT\.?\s*:$/i.test(norm(prevClean));

  if (!startsWithBullet && !startsWithQty && !isCurHeading && !isPrevHeading
      && !isHeaderMeta && !startsNewParaKw && !prevEndsCompleteMat
      && !prevEndsPunct && (!startsAlOf || prevExpectsAlOf)
      && !/^(CORPO|INSTITUTO|ACADEMIA|RELATORIO|LOCAL|ALUN|OFICIAL|ASSUNCAO|ORDEM)/.test(nPrev)) {
   merged[merged.length - 1] = `${prev} ${t}`;
  } else {
   merged.push(t);
  }
 }
 return merged;
}

// Extrator nativo de arquivos Word (.docx)
async function extractLinesFromDocxArrayBuffer(buf) {
 const u8 = new Uint8Array(buf);
 const view = new DataView(buf);
 let eocd = -1;
 for (let i = u8.length - 22; i >= Math.max(0, u8.length - 65557); i--) {
  if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
 }
 if (eocd === -1) throw new Error("Não é um arquivo .docx válido");
 const totalEntries = view.getUint16(eocd + 10, true);
 let cdPtr = view.getUint32(eocd + 16, true);

 for (let i = 0; i < totalEntries; i++) {
  if (view.getUint32(cdPtr, true) !== 0x02014b50) break;
  const method = view.getUint16(cdPtr + 10, true);
  const compSize = view.getUint32(cdPtr + 20, true);
  const nameLen = view.getUint16(cdPtr + 28, true);
  const extraLen = view.getUint16(cdPtr + 30, true);
  const commentLen = view.getUint16(cdPtr + 32, true);
  const localOffset = view.getUint32(cdPtr + 42, true);
  const name = new TextDecoder("utf-8").decode(u8.subarray(cdPtr + 46, cdPtr + 46 + nameLen));

  if (name === "word/document.xml") {
   const lNameLen = view.getUint16(localOffset + 26, true);
   const lExtraLen = view.getUint16(localOffset + 28, true);
   const dataOffset = localOffset + 30 + lNameLen + lExtraLen;
   const compData = u8.subarray(dataOffset, dataOffset + compSize);
   let xmlStr = "";
   if (method === 0) {
    xmlStr = new TextDecoder("utf-8").decode(compData);
   } else if (method === 8) {
    if (window.DecompressionStream) {
     try {
      const ds = new DecompressionStream("deflate-raw");
      const writer = ds.writable.getWriter();
      writer.write(compData);
      writer.close();
      const outBuf = await new Response(ds.readable).arrayBuffer();
      xmlStr = new TextDecoder("utf-8").decode(outBuf);
     } catch (e) {}
    }
    if (!xmlStr) {
     const inf = jsInflateBytes(compData, true);
     if (inf) xmlStr = new TextDecoder("utf-8").decode(inf);
    }
   }
   return extractParagraphsFromWordXml(xmlStr);
  }
  cdPtr += 46 + nameLen + extraLen + commentLen;
 }
 return [];
}

function isCodeOrSystemGarbageLine(line) {
 const t = String(line || "").trim();
 if (!t) return true;
 if (/^(function\s*\(|function\s+[A-Za-z0-9_]+|const\s+[A-Za-z0-9_$]+\s*=|let\s+[A-Za-z0-9_$]+\s*=|var\s+[A-Za-z0-9_$]+\s*=|window\.|document\.|return\s+|if\s*\(|else\s+if\s*\(|}\s*else\s*{|forEach\(|addEventListener\()/.test(t)) return true;
 if (/[{};]$/.test(t) && (/(=>|===|!==|\.value\b|\.style\b|\.classList\b|querySelector|getElementById|createElement|localStorage|sessionStorage)/.test(t))) return true;
 if (/^<\/?(div|span|button|select|option|input|label|textarea|script|style|header|footer|main|section|article|details|summary|h[1-6]|table|tr|td|th)\b/i.test(t)) return true;
 return false;
}

function extractParagraphsFromWordXml(xmlStr) {
 if (!xmlStr) return [];
 const xmlDoc = new DOMParser().parseFromString(xmlStr, "application/xml");
 const outLines = [];
 const pList = xmlDoc.getElementsByTagName("w:p");
 const nodes = pList.length ? Array.from(pList) : Array.from(xmlDoc.getElementsByTagName("p"));
 nodes.forEach(p => {
  let line = "";
  const children = p.getElementsByTagName("*");
  for (let i = 0; i < children.length; i++) {
   const el = children[i];
   const tag = el.nodeName || el.localName;
   if (tag === "w:t" || tag === "t") line += el.textContent;
   else if (tag === "w:br" || tag === "br") line += "\n";
   else if (tag === "w:tab" || tag === "tab") line += " ";
  }
  line.split(/\r?\n/).forEach(sub => {
   const clean = sub.replace(/\s+/g, " ").trim();
   if (clean && !isCodeOrSystemGarbageLine(clean)) outLines.push(clean);
  });
 });
 // IMPORTANTE: Em arquivos Word (.docx), cada <w:p> já é um parágrafo real completo!
 // Não aplicamos fusão de quebras visuais de PDF para nunca grudar parágrafos distintos do Word.
 return outLines;
}

function u8ToBinaryString(u8) {
 let res = "";
 const chunk = 8192;
 for (let i = 0; i < u8.length; i += chunk) {
  res += String.fromCharCode.apply(null, u8.subarray(i, Math.min(u8.length, i + chunk)));
 }
 return res;
}

const WIN_ANSI_MAP = {
 0x80: "\u20AC", 0x82: "\u201A", 0x83: "\u0192", 0x84: "\u201E", 0x85: "\u2026", 0x86: "\u2020", 0x87: "\u2021",
 0x88: "\u02C6", 0x89: "\u2030", 0x8A: "\u0160", 0x8B: "\u2039", 0x8C: "\u0152", 0x8E: "\u017D",
 0x91: "\u2018", 0x92: "\u2019", 0x93: "\u201C", 0x94: "\u201D", 0x95: "\u2022", 0x96: "\u2013", 0x97: "\u2014",
 0x98: "\u02DC", 0x99: "\u2122", 0x9A: "\u0161", 0x9B: "\u203A", 0x9C: "\u0153", 0x9E: "\u017E", 0x9F: "\u0178"
};

function jsInflateBytes(data, rawDeflate = false) {
 try {
  if (!data || data.length < 2) return null;
  let pos = 0;
  if (!rawDeflate) {
   if (data.length < 6) return null;
   if ((data[0] & 0x0F) !== 8 || (data[0] >> 4) > 7 || (((data[0] << 8) | data[1]) % 31) !== 0) {
    return null;
   }
   pos = 2;
   if (data[1] & 0x20) pos += 4;
  }
  let bitBuf = 0, bitCnt = 0;
  const MAX_OUT = 2 * 1024 * 1024;
  const out = [];
  function bits(n) {
   while (bitCnt < n) {
    if (pos >= data.length) return -1;
    bitBuf |= data[pos++] << bitCnt;
    bitCnt += 8;
   }
   const v = bitBuf & ((1 << n) - 1);
   bitBuf >>>= n;
   bitCnt -= n;
   return v;
  }
  function buildTree(lengths) {
   const counts = new Int32Array(16), offsets = new Int32Array(16);
   for (let i = 0; i < lengths.length; i++) {
    const l = lengths[i];
    if (l > 0 && l <= 15) counts[l]++;
   }
   counts[0] = 0;
   let total = 0;
   for (let i = 1; i <= 15; i++) { offsets[i] = total; total += counts[i]; }
   const symbols = new Int32Array(total);
   for (let i = 0; i < lengths.length; i++) {
    const len = lengths[i];
    if (len > 0 && len <= 15) symbols[offsets[len]++] = i;
   }
   return { counts, symbols };
  }
  function decode(tree) {
   let code = 0, first = 0, index = 0;
   for (let len = 1; len <= 15; len++) {
    const b = bits(1);
    if (b < 0) return -1;
    code |= b;
    const count = tree.counts[len];
    if (code - count < first) return tree.symbols[index + (code - first)];
    index += count;
    first = (first + count) << 1;
    code <<= 1;
   }
   return -1;
  }
  const fixedLitLen = new Uint8Array(288);
  for (let i = 0; i <= 143; i++) fixedLitLen[i] = 8;
  for (let i = 144; i <= 255; i++) fixedLitLen[i] = 9;
  for (let i = 256; i <= 279; i++) fixedLitLen[i] = 7;
  for (let i = 280; i <= 287; i++) fixedLitLen[i] = 8;
  const fixedDist = new Uint8Array(32);
  fixedDist.fill(5);
  const fixedLitTree = buildTree(fixedLitLen), fixedDistTree = buildTree(fixedDist);
  const lenBase = [3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];
  const lenExtra = [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
  const distBase = [1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577];
  const distExtra = [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];
  const clOrder = [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];

  let bfinal = 0;
  while (!bfinal) {
   bfinal = bits(1);
   const btype = bits(2);
   if (bfinal < 0 || btype < 0 || btype === 3) break;
   if (btype === 0) {
    bitBuf = 0; bitCnt = 0;
    if (pos + 4 > data.length) break;
    const len = data[pos] | (data[pos + 1] << 8);
    pos += 4;
    if (out.length + len > MAX_OUT) return null;
    for (let i = 0; i < len && pos < data.length; i++) out.push(data[pos++]);
   } else {
    let litTree = fixedLitTree, distTree = fixedDistTree;
    if (btype === 2) {
     const hlitBits = bits(5), hdistBits = bits(5), hclenBits = bits(4);
     if (hlitBits < 0 || hdistBits < 0 || hclenBits < 0) break;
     const hlit = hlitBits + 257, hdist = hdistBits + 1, hclen = hclenBits + 4;
     const clLengths = new Uint8Array(19);
     for (let i = 0; i < hclen; i++) {
      const b3 = bits(3);
      if (b3 < 0) return null;
      clLengths[clOrder[i]] = b3;
     }
     const clTree = buildTree(clLengths);
     const allLengths = new Uint8Array(hlit + hdist);
     let idx = 0;
     while (idx < hlit + hdist) {
      const sym = decode(clTree);
      if (sym < 0) return null;
      if (sym < 16) allLengths[idx++] = sym;
      else if (sym === 16) {
       const b2 = bits(2);
       if (b2 < 0) return null;
       const prev = idx > 0 ? allLengths[idx - 1] : 0;
       let rep = b2 + 3;
       while (rep-- > 0 && idx < allLengths.length) allLengths[idx++] = prev;
      } else if (sym === 17) {
       const b3 = bits(3);
       if (b3 < 0) return null;
       let rep = b3 + 3;
       while (rep-- > 0 && idx < allLengths.length) allLengths[idx++] = 0;
      } else if (sym === 18) {
       const b7 = bits(7);
       if (b7 < 0) return null;
       let rep = b7 + 11;
       while (rep-- > 0 && idx < allLengths.length) allLengths[idx++] = 0;
      } else {
       return null;
      }
     }
     litTree = buildTree(allLengths.subarray(0, hlit));
     distTree = buildTree(allLengths.subarray(hlit));
    }
    while (true) {
     const sym = decode(litTree);
     if (sym < 0) return out.length ? new Uint8Array(out) : null;
     if (sym === 256) break;
     if (sym < 256) {
      if (out.length >= MAX_OUT) return null;
      out.push(sym);
     } else {
      const lIdx = sym - 257;
      if (lIdx >= lenBase.length) return null;
      const eb = bits(lenExtra[lIdx]);
      if (eb < 0) return null;
      const length = lenBase[lIdx] + eb;
      const dSym = decode(distTree);
      if (dSym < 0 || dSym >= distBase.length) return null;
      const db = bits(distExtra[dSym]);
      if (db < 0) return null;
      const dist = distBase[dSym] + db;
      let src = out.length - dist;
      if (src < 0 || out.length + length > MAX_OUT) return null;
      for (let i = 0; i < length; i++) out.push(out[src++]);
     }
    }
   }
  }
  return out.length ? new Uint8Array(out) : null;
 } catch (e) {
  return null;
 }
}

// Extrator Nativo Universal 100% Offline de PDF
async function extractLinesFromPdfArrayBuffer(buf) {
 const u8 = new Uint8Array(buf);
 const rawBin = u8ToBinaryString(u8);

 const objects = new Map();
 const objRegex = /(\d+)\s+0\s+obj\b([\s\S]*?)endobj/g;
 let om;
 while ((om = objRegex.exec(rawBin)) !== null) {
  const oid = parseInt(om[1], 10);
  const content = om[2];
  const sIdx = content.indexOf("stream");
  let dictPart = content;
  let streamDec = null;
  if (sIdx !== -1) {
   dictPart = content.slice(0, sIdx);
   let dStart = sIdx + 6;
   if (content[dStart] === "\r" && content[dStart + 1] === "\n") dStart += 2;
   else if (content[dStart] === "\n" || content[dStart] === "\r") dStart += 1;
   const eIdx = content.indexOf("endstream", dStart);
   if (eIdx !== -1 && (eIdx - dStart) > 0 && (eIdx - dStart) < 2000000) {
    let dEnd = eIdx;
    if (content[dEnd - 2] === "\r" && content[dEnd - 1] === "\n") dEnd -= 2;
    else if (content[dEnd - 1] === "\n" || content[dEnd - 1] === "\r") dEnd -= 1;
    const rawSlice = content.slice(dStart, dEnd);
    const subBytes = new Uint8Array(rawSlice.length);
    for (let i = 0; i < rawSlice.length; i++) subBytes[i] = rawSlice.charCodeAt(i) & 0xFF;
    const inflated = jsInflateBytes(subBytes, false);
    if (inflated && inflated.length) {
     streamDec = u8ToBinaryString(inflated);
    } else if (rawSlice.includes("BT") || rawSlice.includes("beginbf")) {
     streamDec = rawSlice;
    }
   }
  }
  objects.set(oid, { dict: dictPart, stream: streamDec });
 }

 function hexToUtf16Str(hex) {
  let s = "";
  for (let i = 0; i + 3 < hex.length; i += 4) {
   s += String.fromCharCode(parseInt(hex.slice(i, i + 4), 16));
  }
  if (!s && hex.length === 2) s = String.fromCharCode(parseInt(hex, 16));
  return s;
 }

 function parseCMapStream(st) {
  const gmap = new Map();
  if (!st || (!st.includes("beginbfchar") && !st.includes("beginbfrange"))) return gmap;
  const charBlocks = st.match(/beginbfchar([\s\S]*?)endbfchar/g) || [];
  charBlocks.forEach(blk => {
   const pairs = blk.match(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g) || [];
   pairs.forEach(p => {
    const pm = p.match(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/);
    if (pm) gmap.set(parseInt(pm[1], 16), hexToUtf16Str(pm[2]));
   });
  });
  const rangeBlocks = st.match(/beginbfrange([\s\S]*?)endbfrange/g) || [];
  rangeBlocks.forEach(blk => {
   const rngs = blk.match(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*(?:<([0-9A-Fa-f]+)>|\[([\s\S]*?)\])/g) || [];
   rngs.forEach(r => {
    const rm = r.match(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*(?:<([0-9A-Fa-f]+)>|\[([\s\S]*?)\])/);
    if (rm) {
     const start = parseInt(rm[1], 16), end = parseInt(rm[2], 16);
     if (rm[3]) {
      let targetCode = parseInt(rm[3], 16);
      for (let c = start; c <= end && (c - start) < 512; c++) {
       gmap.set(c, String.fromCharCode(targetCode++));
      }
     } else if (rm[4]) {
      const arrHex = rm[4].match(/<([0-9A-Fa-f]+)>/g) || [];
      for (let c = start, idx = 0; c <= end && idx < arrHex.length; c++, idx++) {
       gmap.set(c, hexToUtf16Str(arrHex[idx].slice(1, -1)));
      }
     }
    }
   });
  });
  return gmap;
 }

 const cmapsByObjId = new Map();
 objects.forEach((obj, oid) => {
  if (obj.stream && (obj.stream.includes("beginbfchar") || obj.stream.includes("beginbfrange"))) {
   cmapsByObjId.set(oid, parseCMapStream(obj.stream));
  }
 });

 const fontInfoByOid = new Map();
 objects.forEach((obj, oid) => {
  const dCompact = obj.dict.replace(/\s+/g, "");
  if (dCompact.includes("/Type/Font") || dCompact.includes("/Subtype/Type0") || dCompact.includes("/Subtype/TrueType")) {
   const tuMatch = obj.dict.match(/\/ToUnicode\s+(\d+)\s+0\s+R/);
   const isIdH = obj.dict.includes("/Identity-H") || obj.dict.includes("/Type0");
   const cmap = (tuMatch && cmapsByObjId.has(parseInt(tuMatch[1], 10))) ? cmapsByObjId.get(parseInt(tuMatch[1], 10)) : null;
   fontInfoByOid.set(oid, { cmap, isCid: isIdH });
  }
 });

 const pages = [];
 const sortedOids = Array.from(objects.keys()).sort((a, b) => a - b);
 sortedOids.forEach(oid => {
  const d = objects.get(oid).dict;
  if (/\/Type\s*\/Page\b/.test(d)) {
   const pageFonts = new Map();
   const fmList = d.matchAll(/\/(F\d+)\s+(\d+)\s+0\s+R/g);
   for (const fm of fmList) {
    const fOid = parseInt(fm[2], 10);
    if (fontInfoByOid.has(fOid)) pageFonts.set(fm[1], fontInfoByOid.get(fOid));
   }
   const cm = d.match(/\/Contents\s+(\d+)\s+0\s+R/);
   if (cm && objects.has(parseInt(cm[1], 10))) {
    pages.push({ contentOid: parseInt(cm[1], 10), pageFonts });
   }
  }
 });

 if (!pages.length) {
  const fallbackFonts = new Map();
  objects.forEach(obj => {
   const fmList = obj.dict.matchAll(/\/(F\d+)\s+(\d+)\s+0\s+R/g);
   for (const fm of fmList) {
    const fOid = parseInt(fm[2], 10);
    if (fontInfoByOid.has(fOid)) fallbackFonts.set(fm[1], fontInfoByOid.get(fOid));
   }
  });
  sortedOids.forEach(oid => {
   const st = objects.get(oid).stream;
   if (st && st.includes("BT") && st.includes("ET")) {
    pages.push({ contentOid: oid, pageFonts: fallbackFonts });
   }
  });
 }

 function decodeByte(code, finfo) {
  if (finfo && finfo.cmap) {
   return finfo.cmap.has(code) ? finfo.cmap.get(code) : "";
  }
  if (WIN_ANSI_MAP[code]) return WIN_ANSI_MAP[code];
  return code >= 32 ? String.fromCharCode(code) : "";
 }

 function decodeLit(lit, finfo) {
  const inner = lit.slice(1, -1);
  let out = "";
  for (let i = 0; i < inner.length; i++) {
   if (inner[i] === "\\" && i + 1 < inner.length) {
    const nx = inner[i + 1];
    if (/[0-7]/.test(nx)) {
     const octMatch = inner.slice(i + 1, i + 4).match(/^[0-7]{1,3}/);
     const oct = octMatch ? octMatch[0] : nx;
     out += decodeByte(parseInt(oct, 8), finfo);
     i += oct.length;
    } else if (nx === "\r" || nx === "\n") {
     i += (nx === "\r" && inner[i + 2] === "\n") ? 2 : 1;
    } else {
     const escMap = { n: "\n", r: "\r", t: " ", b: "", f: "" };
     out += (escMap[nx] !== undefined ? escMap[nx] : nx);
     i++;
    }
   } else {
    out += decodeByte(inner.charCodeAt(i) & 0xFF, finfo);
   }
  }
  return out;
 }

 function decodeHex(hexTok, finfo) {
  const h = hexTok.slice(1, -1).replace(/\s+/g, "");
  if (!h) return "";
  const step = (finfo && (finfo.isCid || finfo.cmap) && h.length % 4 === 0) ? 4 : 2;
  let out = "";
  for (let i = 0; i < h.length; i += step) {
   const code = parseInt(h.slice(i, i + step), 16);
   out += decodeByte(code, finfo);
  }
  return out;
 }

 const btBlockRegex = /\bBT\b([\s\S]*?)\bET\b/g;
 const tokenRegex = /\/(F\d+)\s+[\d.]+\s+Tf\b|(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(Td|TD)\b|(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+Tm\b|\b(T\*)\b|(\((?:\\.|[^\\()])*\)|<[0-9A-Fa-f\s]+>)/g;

 const extractedLines = [];
 pages.forEach(pg => {
  const st = objects.get(pg.contentOid)?.stream;
  if (!st) return;
  let curFont = null, curLine = "", lastY = null, curY = 0;
  let btMatch;
  btBlockRegex.lastIndex = 0;
  while ((btMatch = btBlockRegex.exec(st)) !== null) {
   const btBody = btMatch[1];
   let m;
   tokenRegex.lastIndex = 0;
   while ((m = tokenRegex.exec(btBody)) !== null) {
    if (m[1]) {
     curFont = m[1];
    } else if (m[4]) {
     const dy = parseFloat(m[3]);
     curY += dy;
     if (Math.abs(dy) > 1.5) {
      if (curLine.trim()) extractedLines.push(curLine.replace(/\s+/g, " ").trim());
      curLine = "";
      lastY = curY;
     }
    } else if (m[10] !== undefined) {
     const tmY = parseFloat(m[10]);
     curY = tmY;
     if (lastY !== null && Math.abs(tmY - lastY) > 3.5) {
      if (curLine.trim()) extractedLines.push(curLine.replace(/\s+/g, " ").trim());
      curLine = "";
     }
     lastY = tmY;
    } else if (m[11]) {
     if (curLine.trim()) extractedLines.push(curLine.replace(/\s+/g, " ").trim());
     curLine = "";
    } else if (m[12]) {
     const strTok = m[12];
     const finfo = pg.pageFonts.get(curFont);
     if (strTok.startsWith("<")) curLine += decodeHex(strTok, finfo);
     else curLine += decodeLit(strTok, finfo);
    }
   }
  }
  if (curLine.trim()) extractedLines.push(curLine.replace(/\s+/g, " ").trim());
 });

 if (extractedLines.length > 0) {
  return preprocessRawReportLines(extractedLines);
 }
 return [];
}

function isDeliveredToOfficerOrLieutenant(text) {
 const n = norm(text);
 return /\b(ENTREGUE|ENTREGUES|PASSAD[OA]S?|ENCAMINHAD[OA]S?|DEIXAD[OA]S?|REMETID[OA]S?|ARQUIVAD[OA]S?|DESPACHAD[OA]S?)\b.*\b(TENENTE|TEN\b|OFICIAL|CAPITAO|CAP\b|MAJOR|MAJ\b|COORDENACAO|COMANDO|SALA DO OFICIAL|OF DE DIA)/.test(n)
  || /\b(AO|PARA O|PRO|COM O|NA SALA DO|A)\s+(TENENTE|TEN\b|TEN BM|OFICIAL DE DIA|OF DE DIA|CAPITAO|COORDENADOR)\b/.test(n);
}

function detectDeliverySubheadTarget(line) {
 const n = norm(line).replace(/^[•\-*\s]+/, "").trim();
 if (n.length > 55) return null;
 if (/^(ENTREGUE[S]?\s+)?(AO|PARA O|A|COM O)\s+(TEN\b|TENENTE|OFICIAL|CAP\b|CAPITAO|MAJ\b|COORDENADOR)/.test(n)) {
  return "tenente";
 }
 if (/^(ENTREGUE[S]?\s+)?(AO|PARA O|A)\s+(PROXIMO\s+)?ALUN[OA]\s+DE\s+DIA/.test(n)) {
  return "aluno";
 }
 return null;
}

function getBaseDocComparisonKey(docText) {
 return norm(docText)
  .replace(/,?\s*\b(ENTREGUE|PASSAD[OA]|ENCAMINHAD[OA]|DEIXAD[OA]).*$/i, "")
  .replace(/[^A-Z0-9]/g, "");
}

function matchLineToFixedMaterial(cleanLineText, preferredSecId) {
 const lineNorm = norm(cleanLineText).replace(/^[^A-Z0-9]+/, "").replace(/[;.,*\s]+$/, "").trim();
 if (!lineNorm || lineNorm.length < 3) return null;
 if (/^(NAO CONSTA|SEM ALTERAC|NADA CONSTA|NENHUM|NENHUMA|OBSERVAC)/.test(lineNorm)) return null;

 // Não casar itens dentro de um subtópico customizado de Material (ex: Sala do Oficial de Dia, Cautela do CFO 2026, Materiais de altura Guardiões)
 if (preferredSecId && preferredSecId.endsWith("_sub")) {
  return null;
 }

 const pools = [
  { secId: "matAluno", list: materialsAluno },
  { secId: "matMasc",  list: materialsMasc },
  { secId: "matFem",   list: materialsFem }
 ];

 if (preferredSecId) {
  pools.sort((a, b) => (a.secId === preferredSecId ? -1 : b.secId === preferredSecId ? 1 : 0));
 }

 const lineWithoutQty = lineNorm.replace(/^\d+\s*(UNIDADE[S]?|UNID|PAR|PARES)?\s*(DE\s+)?/, "").trim();
 const lineTokens = getNormalizedKeywords(lineWithoutQty);

 let bestMatch = null;
 let bestScore = 0;

 pools.forEach(pool => {
  pool.list.forEach((matObj, idx) => {
   const matNorm = norm(matObj.text).replace(/[;.,\s]+$/, "").trim();
   const matWithoutQty = matNorm.replace(/^\d+\s*(UNIDADE[S]?|UNID|PAR|PARES)?\s*(DE\s+)?/, "").trim();

   if (lineNorm === matNorm || (lineWithoutQty.length >= 5 && lineWithoutQty === matWithoutQty)) {
    const sc = 100 + (pool.secId === preferredSecId ? 20 : 0);
    if (sc > bestScore) {
     bestScore = sc;
     bestMatch = { secId: pool.secId, index: idx, officialText: matObj.text, originalText: cleanLineText };
    }
    return;
   }

   if (lineWithoutQty.length >= 6 && (matWithoutQty.includes(lineWithoutQty) || lineWithoutQty.includes(matWithoutQty))) {
    const lineHasFem = /\bFEMININ/.test(lineNorm);
    const lineHasMasc = /\bMASCULIN/.test(lineNorm);
    const matHasFem = /\bFEMININ/.test(matNorm);
    const matHasMasc = /\bMASCULIN/.test(matNorm);
    if ((lineHasFem && matHasMasc) || (lineHasMasc && matHasFem)) return;
    if (preferredSecId === "matFem" && pool.secId === "matMasc") return;
    if (preferredSecId === "matMasc" && pool.secId === "matFem") return;

    const sc = 70 + (pool.secId === preferredSecId ? 20 : 0);
    if (sc > bestScore) {
     bestScore = sc;
     bestMatch = { secId: pool.secId, index: idx, officialText: matObj.text, originalText: cleanLineText };
    }
    return;
   }

   const matTokens = getNormalizedKeywords(matWithoutQty);
   if (!matTokens.length || !lineTokens.length) return;

   const lineHasFem = /\bFEMININ/.test(lineNorm);
   const lineHasMasc = /\bMASCULIN/.test(lineNorm);
   const matHasFem = /\bFEMININ/.test(matNorm);
   const matHasMasc = /\bMASCULIN/.test(matNorm);
   if ((lineHasFem && matHasMasc) || (lineHasMasc && matHasFem)) return;
   if (preferredSecId === "matFem" && pool.secId === "matMasc") return;
   if (preferredSecId === "matMasc" && pool.secId === "matFem") return;

   let hits = 0;
   lineTokens.forEach(lt => {
    const lStem = stemPt(lt);
    if (matTokens.some(mt => mt === lt || stemPt(mt) === lStem)) hits++;
   });

   const ratio = hits / Math.max(1, Math.min(lineTokens.length, matTokens.length));
   if (hits >= 2 || (hits === 1 && matTokens.length === 1 && ratio >= 0.8)) {
    const sc = (hits * 18) + (ratio * 20) + (pool.secId === preferredSecId ? 15 : 0);
    if (sc > bestScore && sc >= 30) {
     bestScore = sc;
     bestMatch = { secId: pool.secId, index: idx, officialText: matObj.text, originalText: cleanLineText };
    }
   }
  });
 });

 return bestMatch;
}

function guessMaterialDestSection(lineText, currentSubSec) {
 if (currentSubSec && currentSubSec.startsWith("matAluno")) return "matAluno";
 if (currentSubSec && currentSubSec.startsWith("matFem")) return "matFem";
 if (currentSubSec && currentSubSec.startsWith("matMasc")) return "matMasc";
 const n = norm(lineText);
 if (/\b(FEMININ|CONVIVENCIA FEM|ALOJAMENTO FEM|HEAD BLOCK|PRANCHA RIGIDA|00001453)\b/.test(n)) return "matFem";
 if (/\b(PASTA|CDF|CAUTELA|CELULAR FUNCIONAL|CHAVE|PORTA PRINCIPAL|PORTA DE VIDRO|SALA DO OFICIAL)\b/.test(n)) return "matAluno";
 return "matMasc";
}

function guessInfoDestSection(lineText, currentSubSec, infoGender = "M") {
 const n = norm(lineText);
 const isFem = /\b(FEMININ|ALOJAMENTO FEM|BANHEIRO FEM|AREA FEM)\b/.test(n) || infoGender === "F";
 const isBath = /\b(BANHEIRO|SANITARIO|CHUVEIRO|TORNEIRA|PIA\b|PIAS\b|VASO|PRIVADA|CABINE|BACIA SANITARIA|DESCARGA|CAIXA ACOPLADA|MICTORIO|BOX|SIFAO|FOSSA|REGISTRO HIDRAULICO|ESGOTO)\b/.test(n);
 const isDorm = /\b(ALOJAMENTO|CAMA|BELICHE|ARMARIO|COLCHAO|RODAPE|MOFO NAS PAREDES)\b/.test(n);
 const isCommon = /\b(RANCHO|CADEIRA[S]? DO RANCHO|REFEITORIO|SALA DE AULA|AUDITORIO|AREA COMUM|PATIO|QUADRA|COPA|BEBEDOURO|PORTA DA SALA DO OFICIAL)\b/.test(n);
 const isGua = /\b(GUARDIAO|GUARDIOES|2026)\b/.test(n);

 if (currentSubSec && currentSubSec !== "info_root") return currentSubSec;
 if (isCommon && !isDorm && !isBath) return "infoCommon";
 if (isBath) return isFem ? "infoBathF" : "infoBathM";
 if (isDorm) {
  if (isFem) return isGua ? "infoDormFGua" : "infoDormFEsp";
  return isGua ? "infoDormMGua" : "infoDormMEsp";
 }
 return "infoCommon";
}

// Avaliador Semântico de Contexto da Frase: garante que alterações de Banheiros, Alojamentos e Área Comum NUNCA caiam em Documentos Recebidos ou Alterações de Cursos mesmo se o colega não colocou título de seção!
function classifySemanticOverride(cleanText, currentSec, mainContext, infoGender = "M") {
 if (mainContext === "mat") return currentSec;
 const n = norm(cleanText);

 // Nunca sobrescrever se a linha for claramente um documento (atestado, comunicação, CDF, BIO, parte, ofício)
 if (/^\d+\s*(ATESTADO|COMUNICAC|CDF|BIO|PARTE|OFICIO|MEMORANDO)\b/.test(n) || /\b(ATESTADO DE COMPARECIMENTO|ATESTADO MEDICO|XERIFE)\b/.test(n)) {
  return currentSec;
 }

 if (mainContext === "docs" || mainContext === "changes" || mainContext === "info") {
  const isBath = /\b(BANHEIRO|SANITARIO|CABINE SANITARIA|BACIA SANITARIA|VASO SANITARIO|PRIVADA|DESCARGA|CAIXA ACOPLADA|MICTORIO|CHUVEIRO|TORNEIRA|PIA\b|PIAS\b|SIFAO|REGISTRO HIDRAULICO|BOX DO BANHEIRO|ULTIMO BOX|PRIMEIRO BOX|PENULTIMO BOX|TUBULACAO DE ESGOTO|RETORNO DA TUBULACAO|FOSSA CHEIA|LIXEIRA[S]? NO BANHEIRO)\b/.test(n);
  const isDorm = /\b(MOFO NAS PAREDES|MANCHAS DE MOFO|RODAPE DO ALOJAMENTO|AR-CONDICIONADO APRESENTA DEFEITO|PORTA PRINCIPAL DO ALOJAMENTO|PORTA PRINCIPAL APRESENTA DEFEITO|ALOJAMENTO[S]? UTILIZADO[S]? PELA TURMA)\b/.test(n);
  const isCommon = /\b(CADEIRA[S]? DO RANCHO|MESA[S]? DO RANCHO|PORTA DA SALA DO OFICIAL.*DEFEITO|BEBEDOURO.*DEFEITO)\b/.test(n);

  if (isCommon) return "infoCommon";
  if (isBath) {
   if (/\bFEMININ/.test(n)) return "infoBathF";
   if (/\bMASCULIN/.test(n)) return "infoBathM";
   if (currentSec === "infoBathF" || currentSec === "infoDormFEsp" || currentSec === "infoDormFGua" || infoGender === "F") return "infoBathF";
   return "infoBathM";
  }
  if (isDorm) {
   const g = (/\bFEMININ/.test(n) || currentSec === "infoDormFEsp" || currentSec === "infoDormFGua" || currentSec === "infoBathF" || infoGender === "F") ? "F" : "M";
   const isGua = /\b(2026|GUARDI)/.test(n);
   return g === "F" ? (isGua ? "infoDormFGua" : "infoDormFEsp") : (isGua ? "infoDormMGua" : "infoDormMEsp");
  }
 }
 return currentSec;
}

// Detector Universal de Cabeçalhos e Subtópicos (reconhece qualquer numeração ou ausência de título geral "VI) INFORMAÇÕES")
function detectHeadingTransition(line, mainContext = "header", infoGender = "M", currentSec = "header") {
 const cleanLine = String(line || "").replace(/^[•\-*\s]+/, "").trim();
 const n = norm(cleanLine);
 if (n.length > 95 || n.length < 3) return null;
 if (/^OBSERVAC(AO|OES):\s+\S+/i.test(n)) return null;

 const hasRomanOrNum = /^([IVXLCDM]+\s*[)\-.]|\d+\.\d+\b|\d+\s*[)\-.])\s*/.test(n);
 const withoutNum = n.replace(/^([IVXLCDM]+\s*[)\-.]|\d+\.\d+\s*[)\-.]?|\d+\s*[)\-.]|[A-Z]\s*[)\-.])\s*/, "").trim();

 // 1. Seções Principais (I a XI e Passagem)
 if (/^EFETIVO DE SERVICO:?$/.test(withoutNum) && (hasRomanOrNum || mainContext === "header")) return { sec: "duty_table", main: "duty_table" };
 if (/^MATERIA(L|IS) A CARGO:?$|^MATERIA(L|IS) CARGA:?$/.test(withoutNum)) return { sec: "matAluno", main: "mat" };

 // Alterações (separadas ou combinadas na mesma linha, ex: "ALTERAÇÕES CURSOS 1º CFO 2025:")
 if (/^ALTERACOES DO EFETIVO( DE SERVICO)?:?$/.test(withoutNum)) return { sec: "changesDuty", main: "changes" };
 if (/^ALTERACOES\s+(DOS\s+)?CURSOS\s+(1[º°]\s*)?CFO\s*2025|^ALTERACOES.*ESPADARTE/.test(withoutNum)) return { sec: "changes2025", main: "changes" };
 if (/^ALTERACOES\s+(DOS\s+)?CURSOS\s+(1[º°]\s*)?CFO\s*2026|^ALTERACOES.*GUARDI/.test(withoutNum)) return { sec: "changes2026", main: "changes" };
 if (/^ALTERACOES DOS CURSOS:?$|^ALTERACOES:?$/.test(withoutNum)) return { sec: "changes2025", main: "changes" };

 if (/^DOCUMENTOS RECEBIDOS:?$/.test(withoutNum)) return { sec: "prev_received_docs", main: "docs" };
 if (/^DOCUMENTOS ENTREGUES( PARA O PROXIMO ALUNO DE DIA)?:?$|^DOCUMENTOS PASSADOS:?$/.test(withoutNum)) return { sec: "prev_delivered_docs", main: "docs" };

 // Pernoite / Efetivo Apecado / Efetivo Alojado (avaliado antes de Alojamentos!)
 if (/^PERNOITE:?$|^EFETIVO APECADO|^EFETIVO ALOJADO/.test(withoutNum)) return { sec: "pernoite_section", main: "pernoite_section" };

 if (/^DIVERSOS:?$|^OUTRAS INFORMACOES:?$|^OBSERVACOES GERAIS:?$/.test(withoutNum)) return { sec: "misc", main: "misc" };
 if (/^ANEXOS:?$|^REGISTRO FOTOGRAFICO:?$/.test(withoutNum)) return { sec: "photos_section", main: "photos_section" };
 if (/^PASSAGEM DO SERVICO:?$|^PASSAGEM DE SERVICO:?$/.test(withoutNum)) return { sec: "passagem_section", main: "passagem_section" };

 // 2. Cabeçalhos de Instalações / Alojamentos / Banheiros / Área Comum / Salas de Aula / Rancho
 // Reconhecidos a partir de QUALQUER seção anterior (mesmo que o colega não tenha colocado um título "VI) INFORMAÇÕES"!)
 if (/^INFORMACOES(\s*[-–—]\s*INSTALACOES)?:?$|^INSTALACOES( FISICAS)?:?$/.test(withoutNum)) {
  return { sec: "info_root", main: "info", gender: "M" };
 }

 if (mainContext === "info" || mainContext === "docs" || mainContext === "changes" || mainContext === "header") {
  if (/^(ALTERACOES\s+DOS\s+)?ALOJAMENTOS?\s+MASCULINOS?:?$|^AREA\s+MASCULINA:?$/.test(withoutNum) && mainContext !== "mat") {
   return { sec: "infoDormMEsp", main: "info", gender: "M" };
  }
  if (/^(ALTERACOES\s+DOS\s+)?ALOJAMENTOS?\s+FEMININOS?:?$|^AREA\s+FEMININA:?$/.test(withoutNum) && mainContext !== "mat") {
   return { sec: "infoDormFEsp", main: "info", gender: "F" };
  }
  if (/^ALOJAMENTO[S]?\b/.test(withoutNum) && !/\b(CHAVE|CONSTRUIDO|REFORMA)\b/.test(withoutNum) && withoutNum.length <= 55) {
   const g = /FEMININ/.test(withoutNum) ? "F" : (/MASCULIN/.test(withoutNum) ? "M" : infoGender);
   const isGua = /2026|GUARDI/.test(withoutNum);
   const target = g === "F" ? (isGua ? "infoDormFGua" : "infoDormFEsp") : (isGua ? "infoDormMGua" : "infoDormMEsp");
   return { sec: target, main: "info", gender: g };
  }
  if (/^BANHEIRO[S]?\s+(MASCULINO|FEMININO)/.test(withoutNum)) {
   const g = /FEMININ/.test(withoutNum) ? "F" : "M";
   return { sec: g === "F" ? "infoBathF" : "infoBathM", main: "info", gender: g };
  }
  if (mainContext === "info" && (currentSec === "infoBathM" || currentSec === "infoBathF") && /^PAVILHAO DE (ALOJAMENTOS|AULAS):?$/.test(withoutNum)) {
   return { sec: currentSec, main: "info", gender: infoGender };
  }
  if (/^(ALTERACOES\s+DA\s+)?(AREA COMUM|SALA[S]? DE AULA)|^GRADE DE RANCHO|^RANCHO:?$/.test(withoutNum)) {
   return { sec: "infoCommon", main: "info", gender: infoGender };
  }
 }

 // 3. Subseções dentro de II) MATERIAL A CARGO (mainContext === "mat")
 if (mainContext === "mat") {
  if (/^1\.1\b/.test(n) || /^(A CARGO DO )?ALUN[OA] DE DIA:?$/.test(withoutNum)) return { sec: "matAluno", main: "mat" };
  if (/^1\.2\b/.test(n) || /^AREA MASCULINA:?$|^CONVIVENCIA MASCULINA:?$|^MATERIA(L|IS) ESPORTIVO[S]?:?$|^EQUIPAMENTO[S]? DE SALVAMENTO EM ALTURA:?$|^EQUIPAMENTO[S]? DE SALVAMENTO AQUATICO:?$|^CAUTELA[S]? DO CFO 2025:?$/.test(withoutNum)) {
   return { sec: "matMasc", main: "mat" };
  }
  if (/^1\.3\b/.test(n) || /^AREA FEMININA:?$|^CONVIVENCIA FEMININA:?$/.test(withoutNum)) return { sec: "matFem", main: "mat" };
  if (/^SALA DO OFICIAL( DE DIA)?:?$/.test(withoutNum)) {
   return { sec: "matAluno_sub", main: "mat", subtopicTitle: "**Sala do Oficial de Dia:**", targetSec: "matAluno" };
  }
  const rawStrip = String(line || "").trim();
  const startsWithBullet = /^[•\-*–—]/.test(rawStrip);
  const startsWithQty = /^\d+\s+/.test(withoutNum);
  const startsLower = /^[a-zà-ÿ]/.test(rawStrip);
  const endsSentencePunct = /[.;!?]$/.test(rawStrip);
  const isKnownNoQtyMat = /^(CAIXAS COM COPOS|CONES, BARRAS|UNIFORMES EM DESUSO|OBSERVAC|NAO CONSTA|SEM ALTERAC|MATERIAL A CARGO)/.test(withoutNum);
  if (!startsWithBullet && !startsWithQty && !startsLower && !endsSentencePunct && !isKnownNoQtyMat && withoutNum.length <= 65) {
   let cleanTitle = cleanLine.replace(/\s*\(vide\s+Fotos?\s+[^)]+\)\s*/gi, "").replace(/\s+:/g, ":").trim();
   if (!cleanTitle.endsWith(":")) cleanTitle += ":";
   const target = withoutNum.includes("FEMININ") ? "matFem" : ((withoutNum.includes("OFICIAL") || withoutNum.includes("ALUNO")) ? "matAluno" : "matMasc");
   return { sec: `${target}_sub`, main: "mat", subtopicTitle: `**${cleanTitle}**`, targetSec: target };
  }
 }

 // 4. Subseções dentro de III) ALTERAÇÕES DOS CURSOS (quando mainContext === "changes")
 if (mainContext === "changes") {
  if (/^EFETIVO DE SERVICO:?$/.test(withoutNum)) return { sec: "changesDuty", main: "changes" };
  if (/^(1[º°]\s*)?CFO\s*(2025)?\s*[-–—]?\s*ESPADARTE[S]?:?$|^TURMA ESPADARTE[S]?:?$|^ESPADARTE[S]?:?$|^1[º°]\s*CFO\s*2025:?$/.test(withoutNum)) return { sec: "changes2025", main: "changes" };
  if (/^(1[º°]\s*)?CFO\s*(2026)?\s*[-–—]?\s*GUARDI(AO|OES):?$|^TURMA GUARDI(AO|OES):?$|^GUARDI(AO|OES):?$|^1[º°]\s*CFO\s*2026:?$/.test(withoutNum)) return { sec: "changes2026", main: "changes" };
 }

 return null;
}

function cleanImportedItemText(rawLine) {
 return String(rawLine || "")
  .replace(/^[•\-*–—]+\s*/, "")
  .replace(/\s*\(vide\s+Fotos?\s+[^)]+\)/gi, "")
  .replace(/[;.,\s]+$/, "")
  .trim();
}

function isTrivialEmptyLine(cleanText) {
 if (isCodeOrSystemGarbageLine(cleanText)) return true;
 const n = norm(cleanText);
 if (!n || n.length < 2) return true;
 if (/^(NAO CONSTA|SEM ALTERACAO|SEM ALTERACOES|SEM ALTERACOES REGISTRADAS|NADA CONSTA|NADA A REGISTRAR|NADA A RELATAR|S\/A|N\/C)$/.test(n)) return true;
 if (/^(ORDEM|NOME|NOME DE GUERRA|NUMERO|FUNCAO|MATRICULA|TOTAL DO EFETIVO|EFETIVO DE SERVICO:\s*\d+|PERNOITARAM NA ABM|SERVICO:\s*\d+|EFETIVO ALOJADO|EFETIVO APECADO|MASCULINO:\s*\d*|FEMININO:\s*\d*|TURMA ESPADARTES|TURMA GUARDIOES|MASCULINO DA TURMA|FEMININO DA TURMA)/.test(n)) return true;
 if (/^(CORPO DE BOMBEIROS|INSTITUTO MILITAR|ACADEMIA DE BOMBEIROS|BOMBEIROS|ABM|RELATORIO DO SERVICO|LOCAL:\s*BR|OFICIAL DE DIA:|TEN QOBM|TEN QOABM|ASSUNCAO:\s*ASSUMI|SIMOES FILHO)/.test(n)) return true;
 return false;
}

function parseStateObjectIntoImportItems(stateObj, sourceLabel) {
 const items = [];
 let nextId = 1;

 (stateObj.matAluno || []).forEach((checked, idx) => {
  if (checked && materialsAluno[idx]) {
   items.push({ id: nextId++, destSec: "matAluno", group: "mat", text: materialsAluno[idx].text, matchedMat: { secId: "matAluno", index: idx, officialText: materialsAluno[idx].text }, checked: groupEnabledState.mat, isTenenteDoc: false });
  }
 });
 parseStructuredLines(stateObj.extraMatAluno || "", false).forEach(x => {
  const ct = cleanImportedItemText(x.text);
  if (ct && !isTrivialEmptyLine(ct)) items.push({ id: nextId++, destSec: "matAluno", group: "mat", text: ct, isSubtopic: x.type === "subtopic", matchedMat: x.type === "subtopic" ? null : matchLineToFixedMaterial(ct, "matAluno"), checked: groupEnabledState.mat, isTenenteDoc: false });
 });

 (stateObj.matMasc || []).forEach((checked, idx) => {
  if (checked && materialsMasc[idx]) {
   items.push({ id: nextId++, destSec: "matMasc", group: "mat", text: materialsMasc[idx].text, matchedMat: { secId: "matMasc", index: idx, officialText: materialsMasc[idx].text }, checked: groupEnabledState.mat, isTenenteDoc: false });
  }
 });
 parseStructuredLines(stateObj.extraMatMasc || "", false).forEach(x => {
  const ct = cleanImportedItemText(x.text);
  if (ct && !isTrivialEmptyLine(ct)) items.push({ id: nextId++, destSec: "matMasc", group: "mat", text: ct, isSubtopic: x.type === "subtopic", matchedMat: x.type === "subtopic" ? null : matchLineToFixedMaterial(ct, "matMasc"), checked: groupEnabledState.mat, isTenenteDoc: false });
 });

 (stateObj.matFem || []).forEach((checked, idx) => {
  if (checked && materialsFem[idx]) {
   items.push({ id: nextId++, destSec: "matFem", group: "mat", text: materialsFem[idx].text, matchedMat: { secId: "matFem", index: idx, officialText: materialsFem[idx].text }, checked: groupEnabledState.mat, isTenenteDoc: false });
  }
 });
 parseStructuredLines(stateObj.extraMatFem || "", false).forEach(x => {
  const ct = cleanImportedItemText(x.text);
  if (ct && !isTrivialEmptyLine(ct)) items.push({ id: nextId++, destSec: "matFem", group: "mat", text: ct, isSubtopic: x.type === "subtopic", matchedMat: x.type === "subtopic" ? null : matchLineToFixedMaterial(ct, "matFem"), checked: groupEnabledState.mat, isTenenteDoc: false });
 });

 const docSources = [
  ...parseStructuredLines(stateObj.delivered || "", false).map(x => ({ text: x.text, fromDelivered: true })),
  ...parseStructuredLines(stateObj.received || "", false).map(x => ({ text: x.text, fromDelivered: false }))
 ];
 const seenDocs = new Map();
 docSources.forEach(d => {
  const ct = cleanImportedItemText(d.text);
  if (!ct || isTrivialEmptyLine(ct)) return;
  const baseKey = getBaseDocComparisonKey(ct);
  const tenente = isDeliveredToOfficerOrLieutenant(ct);
  if (seenDocs.has(baseKey)) {
   const prevItem = seenDocs.get(baseKey);
   if (tenente) {
    prevItem.text = ct;
    prevItem.isTenenteDoc = true;
    prevItem.checked = false;
    prevItem.originNote = "Despachado / Entregue ao Oficial";
   }
   return;
  }
  const newItem = {
   id: nextId++,
   destSec: "received",
   group: "doc",
   text: ct,
   matchedMat: null,
   checked: groupEnabledState.doc && !tenente,
   isTenenteDoc: tenente,
   originNote: d.fromDelivered ? "Documentos Entregues do anterior" : "Documentos Recebidos do anterior"
  };
  seenDocs.set(baseKey, newItem);
  items.push(newItem);
 });

 const textSecList = [
  { sec: "infoDormMEsp", group: "info" },
  { sec: "infoDormMGua", group: "info" },
  { sec: "infoBathM",    group: "info" },
  { sec: "infoDormFEsp", group: "info" },
  { sec: "infoDormFGua", group: "info" },
  { sec: "infoBathF",    group: "info" },
  { sec: "infoCommon",   group: "info" },
  { sec: "misc",         group: "misc" },
  { sec: "changesDuty",  group: "alt"  },
  { sec: "changes2025",  group: "alt"  },
  { sec: "changes2026",  group: "alt"  }
 ];
 textSecList.forEach(cfg => {
  parseStructuredLines(stateObj[cfg.sec] || "", false).forEach(x => {
   const ct = x.type === "subtopic" ? x.text.trim() : cleanImportedItemText(x.text);
   if (ct && !isTrivialEmptyLine(ct)) {
    items.push({
     id: nextId++,
     destSec: cfg.sec,
     group: cfg.group,
     text: ct,
     isSubtopic: x.type === "subtopic",
     matchedMat: null,
     checked: !!groupEnabledState[cfg.group],
     isTenenteDoc: false
    });
   }
  });
 });

 detectedHandoverInfo = null;
 if (stateObj.nextStudent !== undefined && stateObj.nextStudent !== "" && people[Number(stateObj.nextStudent)]) {
  const endObj = plusTime(stateObj.assumeDate || getTodayISO(), stateObj.assumeTime || "06:50", 24);
  detectedHandoverInfo = {
   studentIdx: String(stateObj.nextStudent),
   studentEntry: people[Number(stateObj.nextStudent)],
   assumeDate: endObj.date,
   dateBr: fmtDate(endObj.date),
   assumeTime: stateObj.handoverTime || "06:50"
  };
 }
 updateHandoverBannerUI();
 parsedPrevReportItems = items;
 const prevStudentName = (stateObj.student !== "" && people[Number(stateObj.student)]) ? `AL OF BM ${people[Number(stateObj.student)][5]}` : "";
 $("prevReportStatusText").textContent = `Relatório anterior (${sourceLabel}${prevStudentName ? " — " + prevStudentName : ""}) reconhecido com ${items.length} itens prontos!`;
 renderPrevReportModalItems();
}

function processExtractedPrevReportLines(lines, sourceLabel) {
 const items = [];
 let nextId = 1;
 let currentSec = "header";
 let mainContext = "header";
 let infoGender = "M";
 let inTenenteDeliveredBlock = false;
 prevReportStudentCandidate = "";
 const docItemsList = [];

 lines.forEach(rawLine => {
  const trimmed = String(rawLine || "").trim();
  if (!trimmed || isCodeOrSystemGarbageLine(trimmed)) return;

  const nLine = norm(trimmed);
  if (/^ALUN[OA](\([OA]\))?\s+DE\s+DIA:/.test(nLine)) {
   prevReportStudentCandidate = trimmed.replace(/^ALUN[OA](\([OA]\))?\s+DE\s+DIA:\s*/i, "");
   return;
  }

  const transition = detectHeadingTransition(trimmed, mainContext, infoGender, currentSec);
  if (transition) {
   currentSec = transition.sec;
   if (transition.main) mainContext = transition.main;
   if (transition.gender) infoGender = transition.gender;
   inTenenteDeliveredBlock = false;
   if (transition.subtopicTitle && transition.targetSec) {
    items.push({
     id: nextId++,
     destSec: transition.targetSec,
     group: "mat",
     text: transition.subtopicTitle,
     isSubtopic: true,
     matchedMat: null,
     checked: groupEnabledState.mat,
     isTenenteDoc: false,
     originNote: "Subtópico de Material"
    });
   }
   return;
  }

  // Se estiver dentro de Documentos Recebidos ou Entregues, verificar se a linha é um subtítulo de destino (ex.: "Ao Ten BM Amaro:")
  if (currentSec === "prev_delivered_docs" || currentSec === "prev_received_docs") {
   const subTarget = detectDeliverySubheadTarget(trimmed);
   if (subTarget === "tenente") {
    inTenenteDeliveredBlock = true;
    return;
   } else if (subTarget === "aluno") {
    inTenenteDeliveredBlock = false;
    return;
   }
  }

  if (currentSec === "duty_table") {
   if (/^[•\-*]/.test(trimmed)) {
    const cleanDutyNote = cleanImportedItemText(trimmed);
    if (!isTrivialEmptyLine(cleanDutyNote)) {
     items.push({
      id: nextId++,
      destSec: "otherDuty",
      group: "misc",
      text: cleanDutyNote,
      matchedMat: null,
      checked: groupEnabledState.misc,
      isTenenteDoc: false,
      originNote: "Observação do Efetivo de Serviço"
     });
    }
   }
   return;
  }

  if (["header", "pernoite_section", "photos_section", "passagem_section"].includes(currentSec)) {
   return;
  }

  const hadExplicitBullet = /^[•\-*–—]/.test(trimmed);
  const cleanText = cleanImportedItemText(trimmed);
  if (isTrivialEmptyLine(cleanText)) return;

  // Avaliação Semântica de Contexto: se uma frase fala de pia, sifão, vaso, cabine sanitária, infiltração, mofo em alojamento, cadeira do rancho quebrada, etc., redireciona automaticamente para VI) Instalações!
  const effectiveSec = classifySemanticOverride(cleanText, currentSec, mainContext, infoGender);
  if (effectiveSec.startsWith("info") && mainContext !== "info") {
   mainContext = "info";
   currentSec = effectiveSec;
  }

  if (effectiveSec.startsWith("mat")) {
   const matched = matchLineToFixedMaterial(cleanText, effectiveSec);
   const targetSec = matched ? matched.secId : guessMaterialDestSection(cleanText, effectiveSec);
   items.push({
    id: nextId++,
    destSec: targetSec,
    group: "mat",
    text: cleanText,
    originalText: cleanText,
    matchedMat: matched,
    checked: groupEnabledState.mat,
    isTenenteDoc: false,
    originNote: effectiveSec.endsWith("_sub") ? "Bloco adicional de Material" : ""
   });
  } else if (effectiveSec === "prev_delivered_docs" || effectiveSec === "prev_received_docs") {
   const tenente = inTenenteDeliveredBlock || isDeliveredToOfficerOrLieutenant(cleanText);
   const baseKey = getBaseDocComparisonKey(cleanText);

   // Procurar se este documento já apareceu em Documentos Recebidos (inclusive versão abreviada sem a data/xerife no final, como no relatório do Lopes!)
   const existingDoc = docItemsList.find(d => {
    if (!d.baseKey || baseKey.length < 6) return false;
    if (d.baseKey === baseKey) return true;
    if (baseKey.length >= 12 && d.baseKey.length >= 12 && (d.baseKey.startsWith(baseKey) || baseKey.startsWith(d.baseKey))) return true;
    return false;
   });

   if (existingDoc) {
    if (tenente) {
     existingDoc.isTenenteDoc = true;
     existingDoc.checked = false;
     existingDoc.originNote = "Já entregue ao Tenente/Oficial na passagem";
    }
    return;
   }

   const newDocItem = {
    id: nextId++,
    destSec: "received",
    group: "doc",
    text: cleanText,
    baseKey,
    matchedMat: null,
    checked: groupEnabledState.doc && !tenente,
    isTenenteDoc: tenente,
    originNote: tenente ? "Entregue ao Tenente/Oficial" : (effectiveSec === "prev_delivered_docs" ? "Passado p/ próximo Aluno de Dia" : "Constava em Documentos Recebidos")
   };
   docItemsList.push(newDocItem);
   items.push(newDocItem);
  } else if (effectiveSec.startsWith("info")) {
   const guessedInfoSec = guessInfoDestSection(cleanText, effectiveSec, infoGender);
   items.push({
    id: nextId++,
    destSec: guessedInfoSec,
    group: "info",
    text: cleanText,
    matchedMat: null,
    checked: groupEnabledState.info,
    isTenenteDoc: false
   });
  } else if (effectiveSec.startsWith("changes")) {
   items.push({
    id: nextId++,
    destSec: effectiveSec,
    group: "alt",
    text: cleanText,
    matchedMat: null,
    checked: groupEnabledState.alt,
    isTenenteDoc: false
   });
  } else if (effectiveSec === "misc") {
   const isFreeLineInMisc = !hadExplicitBullet && (
    /^AL\s+OF\s+BM\b/i.test(norm(trimmed)) ||
    /^(1[º°]\s*CFO|TURMA\s+ESPADARTE|TURMA\s+GUARDI|INICIO\s+AS|AS\s+\d{1,2}H|OBS\b|ALEM\s+DOS|TEN\s+BM\b|SEGUE\s+ANEXO)/i.test(norm(trimmed))
   );
   items.push({
    id: nextId++,
    destSec: "misc",
    group: "misc",
    text: isFreeLineInMisc ? trimmed.replace(/\s*\(vide\s+Fotos?\s+[^)]+\)/gi, "").trim() : cleanText,
    isSubtopic: isFreeLineInMisc,
    matchedMat: null,
    checked: groupEnabledState.misc,
    isTenenteDoc: false
   });
  }
 });

 // Limpar subtópicos de material vazios (ex.: "**Equipamentos de salvamento aquático:**" quando não há itens abaixo dele)
 const filteredItems = items.filter((it, idx) => {
  if (it.group === "mat" && it.isSubtopic) {
   const nextIt = items[idx + 1];
   return nextIt && nextIt.group === "mat" && !nextIt.isSubtopic && nextIt.destSec === it.destSec;
  }
  return true;
 });

 const deduped = [];
 const seenKeys = new Set();
 filteredItems.forEach(it => {
  const k = `${it.destSec}::${norm(it.text)}`;
  if (!seenKeys.has(k)) {
   seenKeys.add(k);
   deduped.push(it);
  }
 });

 detectedHandoverInfo = extractHandoverFromLines(lines);
 updateHandoverBannerUI();
 parsedPrevReportItems = deduped;
 const selCount = deduped.filter(x => x.checked).length;
 $("prevReportStatusText").textContent = `${deduped.length} itens identificados e classificados por contexto (${selCount} marcados para importação).`;
 renderPrevReportModalItems();
}

function renderPrevReportModalItems() {
 const catBar = $("prevReportCategoryBar");
 const container = $("prevReportItemsContainer");

 catBar.style.display = "flex";
 catBar.innerHTML = IMPORT_GROUPS_META.map(g => {
  const groupItems = parsedPrevReportItems.filter(x => x.group === g.key);
  const checkedCount = groupItems.filter(x => x.checked).length;
  const isGroupChecked = groupItems.length > 0 ? (checkedCount > 0) : !!groupEnabledState[g.key];
  const countBadge = ` (${checkedCount}/${groupItems.length})`;
  return `<label class="import-cat-chip" style="${isGroupChecked ? "border-color:var(--navy);background:#eef5fc" : "opacity:0.75"}">
   <input type="checkbox" ${isGroupChecked ? "checked" : ""} onchange="togglePrevImportGroup('${g.key}', this.checked)">
   <span>${esc(g.label)}${countBadge}</span>
  </label>`;
 }).join("");

 if (!parsedPrevReportItems.length) {
  container.innerHTML = `<div class="hint" style="text-align:center;padding:24px 12px;font-size:12.5px">
   Anexe o arquivo <b>.pdf</b> / <b>.docx</b> na Opção 1 ou cole o texto na Opção 2 acima. Assim que você anexar ou colar, todos os itens aparecerão listados aqui automaticamente!
  </div>`;
  return;
 }

 let html = "";
 IMPORT_DEST_CATALOG.forEach(dest => {
  const secItems = parsedPrevReportItems.filter(x => x.destSec === dest.id);
  if (!secItems.length) return;
  const secCheckedCount = secItems.filter(x => x.checked).length;
  html += `<div class="import-group-box">
   <div class="import-group-head" style="flex-wrap:wrap;gap:8px">
    <div style="display:flex;align-items:center;gap:8px">
     <span>${esc(dest.label)}</span>
     <span class="pill">${secCheckedCount} de ${secItems.length} marcados</span>
    </div>
    <div style="display:flex;align-items:center;gap:6px;margin-left:auto">
     <button type="button" class="secondary small" onclick="toggleSectionBoxItems('${dest.id}', true)" style="padding:2px 7px;font-size:11px">Marcar bloco</button>
     <button type="button" class="secondary small" onclick="toggleSectionBoxItems('${dest.id}', false)" style="padding:2px 7px;font-size:11px">Desmarcar</button>
     <select onchange="if(this.value){moveCheckedInSectionBox('${dest.id}', this.value);this.value='';}" style="width:auto;padding:2px 7px;font-size:11px;border-radius:6px;border:1px solid #1e4f7d;background:#fff;color:#102d4f;font-weight:700;cursor:pointer">
      <option value="">⇄ Mover marcados deste bloco p/...</option>
      ${IMPORT_DEST_CATALOG.filter(d => d.id !== dest.id).map(d => `<option value="${d.id}">${esc(d.label)}</option>`).join("")}
     </select>
    </div>
   </div>
   <div>
    ${secItems.map(item => `
     <div class="import-item-row ${item.isTenenteDoc ? "ignored-tenente" : ""}" style="${item.isSubtopic ? "background:#f0f6fc;font-weight:700" : ""}">
      <input type="checkbox" ${item.checked ? "checked" : ""} onchange="toggleSinglePrevItem(${item.id}, this.checked)">
      <div class="import-item-main">
       <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <input type="text" value="${esc(item.text)}" oninput="updateSinglePrevItemText(${item.id}, this.value)" style="flex:1;min-width:220px;${item.isSubtopic ? "font-weight:700;color:#102d4f;background:#fff" : ""}">
        <div style="display:inline-flex;align-items:center;gap:4px;background:#eef5fc;border:1px solid #b8d0e8;padding:3px 7px;border-radius:6px;flex-shrink:0" title="Se este item estiver na seção errada, mude aqui para enviá-lo ao local exato do seu relatório">
         <span style="font-size:11px;font-weight:800;color:#102d4f">Destino:</span>
         <select onchange="changeSinglePrevItemDest(${item.id}, this.value)" style="width:auto;padding:2px 6px;font-size:11.5px;font-weight:700;color:#102d4f;border:1px solid #9cb8d6;border-radius:5px;background:#fff;cursor:pointer">
          ${IMPORT_DEST_CATALOG.map(d => `<option value="${d.id}" ${d.id === item.destSec ? "selected" : ""}>${esc(d.label)}</option>`).join("")}
         </select>
        </div>
       </div>
       <div class="import-item-meta">
        ${item.isSubtopic ? `<span class="badge-extra">Subtópico / Linha livre</span>` : (item.matchedMat ? `<span class="badge-match">✓ Marca caixinha fixa: "${esc(item.matchedMat.officialText)}"</span>` : `<span class="badge-extra">+ Entra como item com bolinha (•)</span>`)}
        ${item.isTenenteDoc ? `<span class="badge-warn">${esc(item.originNote || "Entregue ao Tenente/Oficial (desmarcado)")}</span>` : (item.originNote ? `<span>· ${esc(item.originNote)}</span>` : "")}
       </div>
      </div>
     </div>
    `).join("")}
   </div>
  </div>`;
 });

 container.innerHTML = html;
}

window.toggleSectionBoxItems = (secId, state) => {
 parsedPrevReportItems.forEach(it => {
  if (it.destSec === secId) it.checked = !!state;
 });
 renderPrevReportModalItems();
};

window.moveCheckedInSectionBox = (fromSecId, toSecId) => {
 if (!toSecId || fromSecId === toSecId) return;
 const targetCat = IMPORT_DEST_CATALOG.find(d => d.id === toSecId);
 let movedCount = 0;
 parsedPrevReportItems.forEach(it => {
  if (it.destSec === fromSecId && it.checked) {
   it.destSec = toSecId;
   if (targetCat) {
    it.group = targetCat.group;
    groupEnabledState[targetCat.group] = true;
   }
   it.isTenenteDoc = false;
   if (it.group === "mat" && !it.isSubtopic) {
    it.matchedMat = matchLineToFixedMaterial(it.text, toSecId);
   } else {
    it.matchedMat = null;
   }
   movedCount++;
  }
 });
 if (movedCount === 0) {
  showToast("Selecione os itens que deseja mover primeiro.");
  return;
 }
 renderPrevReportModalItems();
 showToast(`${movedCount} ${movedCount === 1 ? "item movido" : "itens movidos"} para ${targetCat ? targetCat.label : toSecId}!`);
};

window.togglePrevImportGroup = (groupKey, state) => {
 groupEnabledState[groupKey] = state;
 parsedPrevReportItems.forEach(it => {
  if (it.group === groupKey) {
   it.checked = state ? (!it.isTenenteDoc || groupKey !== "doc") : false;
  }
 });
 renderPrevReportModalItems();
};

window.toggleSinglePrevItem = (id, state) => {
 const found = parsedPrevReportItems.find(x => x.id === id);
 if (found) {
  found.checked = state;
  if (state) groupEnabledState[found.group] = true;
  renderPrevReportModalItems();
 }
};

window.updateSinglePrevItemText = (id, newText) => {
 const found = parsedPrevReportItems.find(x => x.id === id);
 if (found) {
  found.text = newText;
  if (found.group === "mat" && !found.isSubtopic) {
   found.matchedMat = matchLineToFixedMaterial(newText, found.destSec);
  }
 }
};

window.changeSinglePrevItemDest = (id, newDest) => {
 const found = parsedPrevReportItems.find(x => x.id === id);
 if (found) {
  found.destSec = newDest;
  const cat = IMPORT_DEST_CATALOG.find(d => d.id === newDest);
  if (cat) {
   found.group = cat.group;
   groupEnabledState[cat.group] = true;
  }
  found.checked = true;
  found.isTenenteDoc = false;
  if (found.group === "mat" && !found.isSubtopic) {
   found.matchedMat = matchLineToFixedMaterial(found.text, newDest);
  } else {
   found.matchedMat = null;
  }
  renderPrevReportModalItems();
  showToast(`Item movido para ${cat ? cat.label : newDest}!`);
 }
};

$("prevReportFileInput").addEventListener("change", async e => {
 const f = e.target.files?.[0];
 if (!f) return;
 $("prevReportStatusText").textContent = `⏳ Lendo e separando tópicos de ${f.name}...`;
 try {
  const buf = await f.arrayBuffer();
  const ext = f.name.toLowerCase().split(".").pop();

  const rawAscii = new TextDecoder("utf-8", { fatal: false }).decode(new Uint8Array(buf)).replace(/=\r?\n/g, "");
  const stateMatch = rawAscii.match(/ABM_STATE_START:([A-Za-z0-9%_\-\.!~*'()]+):ABM_STATE_END/);
  if (stateMatch && stateMatch[1]) {
   try {
    const stateObj = JSON.parse(decodeURIComponent(stateMatch[1].replace(/=25/g, "%")));
    parseStateObjectIntoImportItems(stateObj, f.name);
    e.target.value = "";
    return;
   } catch (err) {}
  }

  let extractedLines = [];
  if (ext === "docx") {
   extractedLines = await extractLinesFromDocxArrayBuffer(buf);
  } else if (ext === "pdf") {
   extractedLines = await extractLinesFromPdfArrayBuffer(buf);
  } else {
   const utf8 = new TextDecoder("utf-8").decode(new Uint8Array(buf));
   if (utf8.includes("initBulletTextareas") && utf8.includes("buildTrueDocxBlob")) {
    const doc = new DOMParser().parseFromString(utf8, "text/html");
    const previewArt = doc.getElementById("preview");
    if (!previewArt || !previewArt.textContent.trim() || previewArt.textContent.includes("[selecionar Oficial")) {
     $("prevReportStatusText").textContent = `O arquivo "${f.name}" é o aplicativo em branco, e não um relatório preenchido! Selecione o arquivo .pdf ou .docx do relatório anterior.`;
     showToast("Selecione o arquivo .pdf ou .docx do relatório anterior.");
     e.target.value = "";
     return;
    }
    extractedLines = preprocessRawReportLines(previewArt.innerText.split(/\r?\n/));
   } else if (utf8.includes("<html") || utf8.includes("<body") || utf8.includes("<p")) {
    const doc = new DOMParser().parseFromString(utf8, "text/html");
    doc.querySelectorAll("script, style, header, footer, .modal-backdrop, .previewtools").forEach(el => el.remove());
    extractedLines = preprocessRawReportLines((doc.body ? doc.body.innerText : "").split(/\r?\n/));
   } else {
    extractedLines = preprocessRawReportLines(utf8.split(/\r?\n/));
   }
  }

  if (!extractedLines || !extractedLines.length) {
   $("prevReportStatusText").textContent = `O arquivo ${f.name} está em imagem ou protegido. Copie o texto dele e cole na Opção 2 ao lado!`;
   $("pastePrevReportTextarea").focus();
  } else {
   $("pastePrevReportTextarea").value = extractedLines.join("\n");
   processExtractedPrevReportLines(extractedLines, f.name);
  }
 } catch (err) {
  $("prevReportStatusText").textContent = `Não foi possível ler ${f.name} diretamente (${err.message || "formato especial"}). Cole o texto na Opção 2!`;
  $("pastePrevReportTextarea").focus();
 }
 e.target.value = "";
});

function appendLineToBulletTextarea(textareaId, newLineText, isSubtopic = false) {
 const ta = $(textareaId);
 if (!ta) return;
 const cleanNew = isSubtopic ? String(newLineText || "").trim() : cleanImportedItemText(newLineText);
 if (!cleanNew) return;
 const existingItems = parseStructuredLines(ta.value);
 const normNew = norm(cleanImportedItemText(cleanNew));
 if (existingItems.some(el => norm(cleanImportedItemText(el.text)) === normNew)) return;
 existingItems.push({ type: isSubtopic ? "subtopic" : "bullet", text: cleanNew });
 ta.value = existingItems.map(it => it.type === "subtopic" ? it.text : `• ${it.text}`).join("\n");
}

$("applyPrevReportBtn").addEventListener("click", () => {
 if (!parsedPrevReportItems.length && ($("pastePrevReportTextarea").value || "").trim()) {
  runPasteAnalysisNow();
 }

 const selected = parsedPrevReportItems.filter(x => x.checked && x.text.trim());
 const shouldApplyHeader = detectedHandoverInfo && $("applyDetectedHandoverToggle") && $("applyDetectedHandoverToggle").checked;
 if (!selected.length && !shouldApplyHeader) {
  showToast("Anexe um arquivo (.pdf/.docx) ou cole o texto do relatório anterior primeiro.");
  return;
 }
 if (shouldApplyHeader) {
  if (detectedHandoverInfo.assumeDate) $("assumeDate").value = detectedHandoverInfo.assumeDate;
  if (detectedHandoverInfo.assumeTime) $("assumeTime").value = detectedHandoverInfo.assumeTime;
  if (detectedHandoverInfo.studentIdx !== undefined) {
   $("student").value = detectedHandoverInfo.studentIdx;
   syncStudentSelectionToDuty();
  }
  renderOfficerFields();
 }

 const syncExactMats = $("uncheckMissingMatsToggle") ? $("uncheckMissingMatsToggle").checked : true;
 const matSecsInvolved = new Set(selected.filter(x => x.group === "mat").map(x => x.destSec));

 if (syncExactMats) {
  if (matSecsInvolved.has("matAluno")) toggleMatGroup("matAluno", false);
  if (matSecsInvolved.has("matMasc"))  toggleMatGroup("matMasc", false);
  if (matSecsInvolved.has("matFem"))   toggleMatGroup("matFem", false);
 }

 const matClassMap = { matAluno: "matcheck-aluno", matMasc: "matcheck-masc", matFem: "matcheck-fem" };
 const matExtraFieldMap = { matAluno: "extraMatAluno", matMasc: "extraMatMasc", matFem: "extraMatFem" };

 selected.forEach(item => {
  if (item.destSec === "matAluno" || item.destSec === "matMasc" || item.destSec === "matFem") {
   if (item.isSubtopic) {
    appendLineToBulletTextarea(matExtraFieldMap[item.destSec], item.text, true);
    return;
   }
   const m = item.matchedMat;
   if (m) {
    const cbs = document.querySelectorAll(`.${matClassMap[m.secId]}`);
    if (cbs[m.index]) cbs[m.index].checked = true;
   } else {
    appendLineToBulletTextarea(matExtraFieldMap[item.destSec], item.text, false);
   }
  } else {
   appendLineToBulletTextarea(item.destSec, item.text, !!item.isSubtopic);
  }
 });

 ["extraMatAluno", "extraMatMasc", "extraMatFem"].forEach(taId => {
  const ta = $(taId);
  if (!ta || !ta.value) return;
  const lines = parseStructuredLines(ta.value);
  const cleaned = lines.filter((it, idx) => {
   if (it.type !== "subtopic") return true;
   return idx + 1 < lines.length && lines[idx + 1].type === "bullet";
  });
  ta.value = cleaned.map(it => it.type === "subtopic" ? it.text : `• ${it.text}`).join("\n");
 });

 closePrevReportModal();
 refreshAllLineChipBars();
 renderPreview();
 triggerAutoSave();
 showToast(`${selected.length} itens importados para o relatório.`);
});

// Etiquetas duplicadas desativadas para manter o formulário limpo
function renderLineChipsForTextarea(ta) {
 if (!ta || !ta.id) return;
 const bar = $(`chips_${ta.id}`);
 if (bar) bar.remove();
}
function refreshAllLineChipBars() {
 document.querySelectorAll(".line-chips-bar").forEach(el => el.remove());
 if (typeof updateMaterialSummaryBadges === "function") updateMaterialSummaryBadges();
}

// =========================================================================
// EDIÇÃO E NAVEGAÇÃO DIRETA PELA PRÉVIA (FOLHA A4 INTERATIVA)
// =========================================================================
let activeDirectLinkedFieldId = null;

function openAndScrollLeftField(secKey, focusInput = true) {
 const meta = PREVIEW_SEC_META[secKey];
 if (!meta) return;
 if (meta.drawerId) {
  const dr = $(meta.drawerId);
  if (dr) dr.open = true;
 }
 const targetId = meta.focusControl || meta.fieldId;
 const el = $(targetId);
 if (el) {
  const parentDrawer = el.closest("details");
  if (parentDrawer) parentDrawer.open = true;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  if (focusInput) {
   setTimeout(() => el.focus({ preventScroll: true }), 120);
  }
 }
}

function openDirectPreviewEditor(secKey) {
 const meta = PREVIEW_SEC_META[secKey];
 if (!meta) return;
 focusPreviewSection(secKey);

 // Se a seção clicada for de seleção pura (Cabeçalho, Fotos, Passagem), navega direto para o controle no formulário
 if (!meta.isText) {
  if (document.getElementById("rsAppRoot")?.classList.contains("vm-preview-focus")) {
   window.setAppViewMode("split");
  }
  openAndScrollLeftField(secKey, true);
  return;
 }

 // Para Efetivo de Serviço, Material ou Pernoite, abre também a gaveta no painel esquerdo para facilitar marcações
 if (meta.drawerId) {
  const dr = $(meta.drawerId);
  if (dr) dr.open = true;
 }

 const sourceTa = $(meta.fieldId);
 const dock = $("previewDirectEditor");
 const directTa = $("previewDirectTextarea");
 const labelEl = $("pdeSectionLabel");
 if (!sourceTa || !dock || !directTa) return;

 activeDirectLinkedFieldId = meta.fieldId;
 labelEl.textContent = meta.label;
 dock.classList.add("visible");
 directTa.value = sourceTa.value || "• ";
 setTimeout(() => {
  directTa.focus();
  directTa.selectionStart = directTa.selectionEnd = directTa.value.length;
 }, 30);
}

function closeDirectPreviewEditor() {
 const dock = $("previewDirectEditor");
 const directTa = $("previewDirectTextarea");
 if (dock) dock.classList.remove("visible");
 if (directTa && activeDirectLinkedFieldId) {
  const sourceTa = $(activeDirectLinkedFieldId);
  if (sourceTa && sourceTa.value.trim() === "•") {
   sourceTa.value = "";
   renderPreview();
   triggerAutoSave();
  }
 }
 activeDirectLinkedFieldId = null;
}

$("pdeCloseBtn").addEventListener("click", closeDirectPreviewEditor);
$("pdeFocusFormBtn").addEventListener("click", () => {
 if (!activeDirectLinkedFieldId) return;
 const secKey = fieldToPreviewSectionMap[activeDirectLinkedFieldId] || activePreviewSection;
 if (document.getElementById("rsAppRoot")?.classList.contains("vm-preview-focus")) {
  window.setAppViewMode("split");
 }
 closeDirectPreviewEditor();
 if (secKey) openAndScrollLeftField(secKey, true);
});

$("previewDirectTextarea").addEventListener("input", () => {
 if (!activeDirectLinkedFieldId) return;
 const sourceTa = $(activeDirectLinkedFieldId);
 if (sourceTa) {
  sourceTa.value = $("previewDirectTextarea").value;
  renderPreview();
  const secKey = fieldToPreviewSectionMap[activeDirectLinkedFieldId];
  if (secKey) focusPreviewSection(secKey);
  triggerAutoSave();
 }
});

$("previewDirectTextarea").addEventListener("keydown", (e) => {
 if (e.key === "Escape" && ensureSmartPopup().style.display !== "block") {
  e.preventDefault();
  closeDirectPreviewEditor();
 } else if (activeDirectLinkedFieldId) {
  setTimeout(() => {
   const sourceTa = $(activeDirectLinkedFieldId);
   if (sourceTa && sourceTa.value !== $("previewDirectTextarea").value) {
    sourceTa.value = $("previewDirectTextarea").value;
    renderPreview();
    triggerAutoSave();
   }
  }, 0);
 }
});

// Sincronizar via mão dupla: se o usuário editar no painel esquerdo enquanto o editor direto estiver aberto
document.querySelectorAll(".bullet-input").forEach(ta => {
 if (ta.id === "previewDirectTextarea") return;
 ta.addEventListener("input", () => {
  if (activeDirectLinkedFieldId === ta.id) {
   $("previewDirectTextarea").value = ta.value;
  }
 });
});

$("preview").addEventListener("click", (e) => {
 const secBlock = e.target.closest(".prev-sec-block");
 if (!secBlock) return;
 const secKey = secBlock.dataset.sec || secBlock.id.replace(/^prev_sec_/, "");
 if (!secKey) return;
 // Se clicou sobre a tabela do Efetivo de Serviço ou na lista de nomes do Pernoite, rola o painel esquerdo até a lista correspondente
 if ((secKey === "duty" && e.target.closest("table")) || (secKey === "sleep" && e.target.closest("ul, .subhead, .subhead-gender"))) {
  openAndScrollLeftField(secKey, false);
 }
 openDirectPreviewEditor(secKey);
});

// Inicialização Multi-Usuário:
// - Sempre inicia limpo ao abrir uma nova janela/computador!
// - Se o usuário apenas recarregar a mesma aba (F5) onde já estava trabalhando, restaura a sessão ativa daquela aba.
async function reloadForCurrentUser() {
 resetToCleanForm();
 const acctKey = getSigabmAccountKey();
 if (!acctKey) {
  $("autoSaveBadge").textContent = "Pronto";
  return;
 }
 try {
  const idbDraft = await loadFromIndexedDB(`sigabm_rs_${acctKey}`);
  const lsRaw = localStorage.getItem(`sigabm_rs_ls_${acctKey}`);
  const stateToRestore = idbDraft || (lsRaw ? JSON.parse(lsRaw) : null);
  if (stateToRestore) {
   setState(stateToRestore);
   const timeStr = stateToRestore.savedAt ? new Date(stateToRestore.savedAt).toLocaleTimeString("pt-BR") : "agora";
   $("autoSaveBadge").textContent = `Rascunho local restaurado (${timeStr})`;
  } else {
   $("autoSaveBadge").textContent = "Pronto (novo relatório)";
  }
 } catch (e) {
  $("autoSaveBadge").textContent = "Pronto";
 }
}

(async function initApp() {
 renderSleep();
 renderDuty();
 renderOfficerFields();
 await reloadForCurrentUser();
})();

// =========================================================================
// INTEGRAÇÃO COM O MAPA DE FORÇA (SIGABM_AlunoDia) — MESCLAGEM SEGURA
// =========================================================================
async function importFromMapaDeForca() {
 if (!window.SIGABM_AlunoDia || typeof window.SIGABM_AlunoDia.getReportBridgeData !== "function") {
  showToast("Mapa de Força indisponível no momento.");
  return;
 }
 const mf = window.SIGABM_AlunoDia.getReportBridgeData();
 if (!mf) return;

 const byNum = {};
 people.forEach((p, idx) => { byNum[p[0]] = { idx, p }; });

 const dutyEntries = [];
 const seenDuty = new Set();
 const addDuty = (num, role) => {
  if (!num || !byNum[num] || seenDuty.has(num)) return;
  seenDuty.add(num);
  dutyEntries.push({ num, idx: byNum[num].idx, p: byNum[num].p, role });
 };

 if (mf.alDia) addDuty(mf.alDia, "Aluno de Dia");
 if (mf.adj) addDuty(mf.adj, "Adjunto do Aluno de Dia");
 if (mf.cmt) addDuty(mf.cmt, "Comandante da Guarda");
 (mf.sentinelas || []).forEach(num => addDuty(num, "Sentinela"));

 const permutaLines = [];
 Object.keys(mf.permutas || {}).forEach(subNum => {
  const origNum = mf.permutas[subNum];
  if (origNum && byNum[subNum] && byNum[origNum]) {
   const subP = byNum[subNum].p;
   const origP = byNum[origNum].p;
   permutaLines.push(
    `Permuta de Serviço: ${formatMilitaryMention(subP, false, "full")} assumiu o serviço no lugar de ${formatMilitaryMention(origP, false, "full")}`
   );
  }
 });

 const altDuty = [];
 const altEsp = [];
 const altGua = [];
 Object.keys(mf.estado || {}).forEach(num => {
  const st = mf.estado[num];
  if (!st || st === "FORMA" || st === "SERVIÇO" || st === "POSTO DE SERVIÇO") return;
  if (!byNum[num]) return;
  const p = byNum[num].p;
  const mot = (mf.motivos && mf.motivos[num]) ? String(mf.motivos[num]).trim() : "";
  const statusLabel = st === "BAIXADO / S.M."
   ? "Baixado / S.M."
   : (st === "MISSÃO / DESTACADO" ? "Missão / Destacado" : "Em forma com observação");
  const line = `${formatMilitaryMention(p, false, "full")} — ${statusLabel}${mot ? ` (${mot})` : ""}`;

  if (seenDuty.has(num)) altDuty.push(line);
  else if (p[3] === "Espadarte") altEsp.push(line);
  else altGua.push(line);
 });

 const totalChanges = altDuty.length + altEsp.length + altGua.length;
 if (!dutyEntries.length && !permutaLines.length && !totalChanges) {
  showToast("Nenhuma escala ou alteração marcada no Mapa de Força ainda.");
  return;
 }

 const resumo = [
  `Dados encontrados no Mapa de Força:`,
  `• Efetivo de Serviço: ${dutyEntries.length} militar(es)`,
  `• Permutas registradas: ${permutaLines.length}`,
  `• Alterações: ${totalChanges} (${altDuty.length} Efetivo, ${altEsp.length} Espadartes, ${altGua.length} Guardiões)`,
  ``,
  `Os textos já existentes (ou importados do relatório anterior) serão preservados sem duplicação. Deseja aplicar agora?`
 ].join("\n");

 if (!(await askAppConfirm(resumo, "Puxar Dados do Mapa de Força"))) return;

 if (mf.alDia && byNum[mf.alDia]) {
  $("student").value = String(byNum[mf.alDia].idx);
  syncStudentSelectionToDuty(true);
 }

 if (dutyEntries.length > 0) {
  // Limpa marcações antigas de serviço (exceto Aluno de Dia) e aplica exatamente a escala do Mapa de Força
  const alDiaIdx = mf.alDia && byNum[mf.alDia] ? byNum[mf.alDia].idx : null;
  document.querySelectorAll(".dutycheck").forEach((cb, i) => {
   if (i === alDiaIdx) return;
   cb.checked = false;
   cb.closest(".person")?.classList.remove("selected");
  });
  dutyEntries.forEach(item => {
   const cb = $(`duty_${item.idx}`);
   const rSel = document.querySelector(`.role[data-i="${item.idx}"]`);
   if (cb) {
    cb.checked = true;
    cb.closest(".person")?.classList.add("selected");
   }
   if (rSel) rSel.value = item.role;
   setSleepCheckboxState(item.idx, true);
  });
  syncDutyToSleepBadges();
  updateDutyCount();
 }

 permutaLines.forEach(l => appendLineToBulletTextarea("otherDuty", l, false));
 altDuty.forEach(l => appendLineToBulletTextarea("changesDuty", l, false));
 altEsp.forEach(l => appendLineToBulletTextarea("changes2025", l, false));
 altGua.forEach(l => appendLineToBulletTextarea("changes2026", l, false));

 if (totalChanges > 0 && $("drawer_changes")) $("drawer_changes").open = true;
 renderPreview();
 triggerAutoSave();
 showToast("Dados do Mapa de Força aplicados ao Relatório com sucesso.");
}

const btnImportMf = $("btnImportFromMapaForca");
if (btnImportMf) btnImportMf.addEventListener("click", importFromMapaDeForca);

  return {
    ensureInit: function() {
      renderPreview();
    },
    importFromMapaDeForca,
    reloadForCurrentUser
  };
})();
