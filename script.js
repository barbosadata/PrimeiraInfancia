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
    const row = json[0]; // Só usamos a primeira linha

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

    interpretacoes.push(`<strong>Município:</strong> ${municipio}`);
    interpretacoes.push(`<strong>CRAS:</strong> ${cras}`);
    interpretacoes.push(`<strong>Total de famílias no CadÚnico:</strong> ${totalFam}`);
    interpretacoes.push(`<strong>Famílias com crianças de 0 a 6 anos:</strong> ${total0a6} (${p0a6.toFixed(1)}%)`);

    if (pGPTE >= 20) {
      interpretacoes.push(`🔴 Alta proporção de famílias com crianças 0 a 6 anos em territórios GPTE: ${pGPTE.toFixed(1)}%. Recomenda-se atuação territorial prioritária com equipes volantes ou parcerias locais.`);
    } else if (pGPTE >= 10) {
      interpretacoes.push(`🟡 Presença relevante de famílias com crianças pequenas em GPTE: ${pGPTE.toFixed(1)}%. Planejar ações focadas e priorização nos atendimentos.`);
    } else {
      interpretacoes.push(`🟢 Baixa proporção de famílias em GPTE com crianças pequenas (${pGPTE.toFixed(1)}%).`);
    }

    if (pRural >= 20) {
      interpretacoes.push(`🔴 Alta presença de famílias com crianças pequenas em áreas rurais: ${pRural.toFixed(1)}%. Necessário planejar ações com foco em deslocamento e logística.`);
    } else if (pRural >= 10) {
      interpretacoes.push(`🟡 Presença significativa de famílias com crianças pequenas em zonas rurais: ${pRural.toFixed(1)}%. Avaliar logística e acessibilidade.`);
    } else {
      interpretacoes.push(`🟢 Baixa proporção de famílias em áreas rurais com crianças pequenas (${pRural.toFixed(1)}%).`);
    }

    if (pDesat >= 30) {
      interpretacoes.push(`🔴 Alto percentual de CadÚnico desatualizado: ${pDesat.toFixed(1)}%. Urgente reforçar estratégias de atualização cadastral.`);
    } else if (pDesat >= 15) {
      interpretacoes.push(`🟡 Percentual relevante de desatualização cadastral: ${pDesat.toFixed(1)}%. Reforçar mutirões e visitas para atualização.`);
    } else {
      interpretacoes.push(`🟢 Baixa proporção de cadastros desatualizados (${pDesat.toFixed(1)}%).`);
    }

    document.getElementById('interpretacao-bloco-1').innerHTML = `
      <h3>Resumo do Diagnóstico</h3>
      <ul><li>${interpretacoes.join("</li><li>")}</li></ul>
    `;
  };

  reader.readAsArrayBuffer(file);
}

