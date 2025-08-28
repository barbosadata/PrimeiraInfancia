document.getElementById('fileInput').addEventListener('change', handleFile, false);

function handleFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet);

    if (json.length === 0) return;
    const row = json[0];

    const municipio = row["Municipio"] ?? "(município não identificado)";
    const cras = row["CRAS"] ?? "(CRAS não identificado)";
    const totalFam = row["fam-cadunico"] ?? 0;
    const total0a6 = row["fam-0a6"] ?? 0;
    const totalGPTE = row["fam-gpte-0a6"] ?? 0;
    const totalRural = row["fam-rural"] ?? 0;
    const cadDesat = row["cadunico-desatualizados"] ?? 0;

    const p0a6 = totalFam > 0 ? (total0a6 / totalFam) * 100 : 0;
    const pGPTE = total0a6 > 0 ? (totalGPTE / total0a6) * 100 : 0;
    const pRural = total0a6 > 0 ? (totalRural / total0a6) * 100 : 0;
    const pDesat = totalFam > 0 ? (cadDesat / totalFam) * 100 : 0;

    const interpretacoes = [];

    // 1. Proporção de famílias com crianças de 0 a 6 anos
    if (p0a6 < 10) {
      interpretacoes.push("Baixa proporção de famílias com crianças pequenas no território. Pode indicar baixa demanda para serviços da primeira infância.");
    } else if (p0a6 <= 30) {
      interpretacoes.push("Presença moderada de famílias com crianças de 0 a 6 anos. Planejamento deve considerar estratégias para esse público.");
    } else {
      interpretacoes.push("Alta proporção de famílias com crianças pequenas. Recomendado priorizar ações voltadas à primeira infância.");
    }

    // 2. Proporção de famílias com crianças pequenas em territórios GPTE
    if (pGPTE >= 30) {
      interpretacoes.push("Expressiva presença de crianças em territórios de alta vulnerabilidade (GPTE). Ações devem ser intensificadas nesses locais.");
    }

    // 3. Proporção de famílias com crianças pequenas em áreas rurais
    if (pRural >= 20) {
      interpretacoes.push("Atenção à população em áreas rurais com crianças pequenas. Estratégias como equipes volantes ou itinerância podem ser necessárias.");
    }

    // 4. Proporção de cadastros desatualizados
    if (pDesat >= 20) {
      interpretacoes.push("Alto percentual de cadastros desatualizados. Recomendado implementar mutirões e ações de busca ativa.");
    }

    renderResumo(cras, municipio, p0a6, pGPTE, pRural, pDesat, interpretacoes);
  };

  reader.readAsArrayBuffer(file);
}

function renderResumo(cras, municipio, p0a6, pGPTE, pRural, pDesat, interpretacoes) {
  const div = document.getElementById('interpretacao-bloco-1');
  div.innerHTML = `
    <h3>Resumo do Diagnóstico – ${cras}, ${municipio}</h3>
    <ul>
      <li><span class="label">% de famílias com crianças de 0 a 6 anos:</span> ${p0a6.toFixed(1)}%</li>
      <li><span class="label">% dessas famílias em territórios GPTE:</span> ${pGPTE.toFixed(1)}%</li>
      <li><span class="label">% dessas famílias em área rural:</span> ${pRural.toFixed(1)}%</li>
      <li><span class="label">% de cadastros desatualizados:</span> ${pDesat.toFixed(1)}%</li>
    </ul>
    <h3>Interpretação</h3>
    <ul>${interpretacoes.map(txt => `<li>${txt}</li>`).join('')}</ul>
  `;
}

