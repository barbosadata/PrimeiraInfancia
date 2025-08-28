document.getElementById('fileInput').addEventListener('change', handleFile);

function handleFile(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(worksheet);

    if (json.length === 0) {
      document.getElementById('interpretacao-bloco-1').textContent = "Arquivo vazio.";
      return;
    }

    const row = json[0]; // Uma única linha por arquivo
    gerarBloco1(row);
  };

  reader.readAsArrayBuffer(file);
}

function gerarBloco1(row) {
  const out = document.getElementById('interpretacao-bloco-1');
  out.innerHTML = ""; // Limpa conteúdo anterior

  const mun = row["Municipio"];
  const cras = row["CRAS"];

  const cadMun = row["fam-cadunico_mun"];
  const cadEst = row["fam-cadunico_estado"];
  const cadBr  = row["fam-cadunico_br"];

  const cadDesatMun = row["cadunico-desatualizado_mun"];
  const cadDesatEst = row["cadunico-desatualizado_estado"];
  const cadDesatBr  = row["cadunico-desatualizado_br"];

  const desat0a6Mun = row["fam-0a6-desatualizadas_mun"];
  const desat0a6Est = row["fam-0a6-desatualizadas_estado"];
  const desat0a6Br  = row["fam-0a6-desatualizadas_nacional"];

  const pobrezaAntesMun = row["fam-em-pobreza-antes-pbf_mun"];
  const pobrezaAntesEst = row["fam-em-pobreza-antes-pbf_estado"];
  const pobrezaAntesBr  = row["fam-em-pobreza-antes-pbf_br"];

  const pobrezaDepoisMun = row["fam-pobreza-pos-pbf_mun"];
  const pobrezaDepoisEst = row["fam-pobreza-pos-pbf_estado"];
  const pobrezaDepoisBr  = row["fam-pobreza-pos-pbf_br"];

  const piPobrezaMun = row["fam-primeira-infancia-e-pobreza_mun"];
  const piPobrezaEst = row["fam-primeira-infancia-e-pobreza_estado"];
  const piPobrezaBr  = row["fam-primeira-infancia-e-pobreza_br"];

  const piMun = row["fam-0a6_mun"];
  const piEst = row["fam-0a6_estado"];
  const piBr  = row["fam-0a6_br"];

  const cri0a3 = row["pessoas-0a3_mun"];
  const cri4a6 = row["pessoas-4a6_mun"];
  const criTotal = cri0a3 + cri4a6;

  const piRural = row["fam-primeira-infancia-e-area-rural_mun"];
  const percPiRural = piMun > 0 ? (100 * piRural / piMun).toFixed(1) : "0";

  // ---------- Geração dos blocos ----------

  let html = `<h3>${mun} – ${cras}</h3>`;

  // PANORAMA GERAL
  html += `<p><strong>Cadastro Único:</strong> ${cadMun} famílias registradas no município, comparado a ${cadEst} no estado e ${cadBr} no Brasil.</p>`;
  html += `<p>Percentual de cadastros desatualizados: ${cadDesatMun}%, estado: ${cadDesatEst}%, Brasil: ${cadDesatBr}%.</p>`;
  html += `<p>Desatualização entre famílias com crianças de 0 a 6 anos: ${desat0a6Mun}%, estado: ${desat0a6Est}%, Brasil: ${desat0a6Br}%.</p>`;
  if (desat0a6Mun > desat0a6Br || desat0a6Mun > desat0a6Est) {
    html += `<p class="alerta">🔴 Alerta: Alta proporção de cadastros desatualizados entre famílias com crianças pequenas.</p>`;
  }

  // POBREZA
  html += `<p><strong>Pobreza antes do PBF:</strong> ${pobrezaAntesMun}% no município, ${pobrezaAntesEst}% no estado, ${pobrezaAntesBr}% no Brasil.</p>`;
  html += `<p><strong>Pobreza após o PBF:</strong> ${pobrezaDepoisMun}% no município, ${pobrezaDepoisEst}% no estado, ${pobrezaDepoisBr}% no Brasil.</p>`;
  if (pobrezaDepoisMun > pobrezaDepoisEst || pobrezaDepoisMun > pobrezaDepoisBr) {
    html += `<p class="alerta">🟡 Atenção: percentual elevado de famílias em pobreza mesmo após o PBF.</p>`;
  }
  html += `<p>Famílias com crianças pequenas em situação de pobreza: ${piPobrezaMun}%, estado: ${piPobrezaEst}%, Brasil: ${piPobrezaBr}%.</p>`;

  // PRIMEIRA INFÂNCIA
  html += `<p><strong>Famílias com crianças de 0 a 6 anos:</strong> ${piMun} no município (${piEst} no estado, ${piBr} no país).</p>`;
  html += `<p>Total de crianças no Cadastro Único: ${criTotal} (0-3 anos: ${cri0a3}, 4-6 anos: ${cri4a6}).</p>`;
  html += `<p>Famílias com crianças de 0 a 6 anos em área rural: ${piRural} (${percPiRural}%).</p>`;
  if (percPiRural >= 30) {
    html += `<p class="alerta">🟡 Atenção: presença significativa de famílias com crianças pequenas em áreas rurais.</p>`;
  }

  // RECOMENDAÇÕES
  html += `<h4>✅ Recomendações prioritárias</h4><ul>`;
  if (desat0a6Mun > desat0a6Br || desat0a6Mun > desat0a6Est) {
    html += `<li>Reforçar atualização cadastral de famílias com crianças pequenas.</li>`;
  }
  if (pobrezaDepoisMun > pobrezaDepoisEst || pobrezaDepoisMun > pobrezaDepoisBr) {
    html += `<li>Mapear famílias com possível demanda por benefícios eventuais.</li>`;
  }
  if (percPiRural >= 30) {
    html += `<li>Planejar estratégias de busca ativa e atendimento rural para primeira infância.</li>`;
  }
  html += `</ul>`;

  out.innerHTML = html;
}
