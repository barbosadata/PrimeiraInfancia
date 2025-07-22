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

    const row = json[0]; // Considera apenas a primeira linha
    const totalFam = row["fam-cadunico"];
    const total0a6 = row["fam-0a6"];
    const totalPessoas = row["pessoas-total"];

    function setValue(id, value) {
      document.getElementById(id).textContent = value ?? '—';
    }

    function setPercent(id, numerador, denominador) {
      const valor = denominador > 0 ? (numerador / denominador) * 100 : 0;
      setValue(id, valor.toFixed(1) + '%');
      return valor;
    }

    function setSinal(id, valor, faixas) {
      if (valor >= faixas.red) {
        setValue(id, '🟥');
      } else if (valor >= faixas.yellow) {
        setValue(id, '🟨');
      } else {
        setValue(id, '🟩');
      }
    }

    // Preenchimento dos valores absolutos
    setValue("valor-fam-cadunico", totalFam);
    setValue("valor-cadunico-desatualizados", row["cadunico-desatualizados"]);
    setValue("valor-fam-0a6", total0a6);
    setValue("valor-fam-0a6-desatualizadas", row["fam-0a6-desatualizadas"]);
    setValue("valor-fam-0a6-fora-escola", row["fam-0a6-fora-escola"]);
    setValue("valor-fam-4a6-fora-escola", row["fam-4a6-fora-escola"]);
    setValue("valor-fam-0a6-pcd-cuidados", row["fam-0a6-pcd-cuidados"]);
    setValue("valor-fam-0a6-sem-ocupado", row["fam-0a6-sem-ocupado"]);
    setValue("valor-fam-0a6-sem-empregado", row["fam-0a6-sem-empregado"]);
    setValue("valor-fam-gpte", row["fam-gpte"]);
    setValue("valor-fam-gpte-0a6", row["fam-gpte-0a6"]);
    setValue("valor-fam-rural", row["fam-rural"]);
    setValue("valor-fam-7a15-trabalho-infantil", row["fam-7a15-trabalho-infantil"]);

    // Cálculo de percentuais
    const percDesatualizados = setPercent("perc-cadunico-desatualizados", row["cadunico-desatualizados"], totalFam);
    setSinal("sinal-cadastro", percDesatualizados, { red: 25, yellow: 15 });

    const perc0a6 = setPercent("perc-fam-0a6", totalFam > 0 ? total0a6 : 0, totalFam);
    setSinal("sinal-fam-0a6", perc0a6, { red: 40, yellow: 20 });

    const perc0a6Desat = setPercent("perc-fam-0a6-desatualizadas", row["fam-0a6-desatualizadas"], total0a6);
    setSinal("sinal-fam-0a6-desatualizadas", perc0a6Desat, { red: 25, yellow: 15 });

    const percForaEscola0a6 = setPercent("perc-fam-0a6-fora-escola", row["fam-0a6-fora-escola"], total0a6);
    setSinal("sinal-escola-0a6", percForaEscola0a6, { red: 40, yellow: 20 });

    const percForaEscola4a6 = setPercent("perc-fam-4a6-fora-escola", row["fam-4a6-fora-escola"], total0a6);
    setSinal("sinal-escola-4a6", percForaEscola4a6, { red: 15, yellow: 7 });

    const percPCDCuidados = setPercent("perc-fam-0a6-pcd-cuidados", row["fam-0a6-pcd-cuidados"], total0a6);
    setSinal("sinal-pcd-cuidados", percPCDCuidados, { red: 20, yellow: 10 });

    const percSemOcupado = setPercent("perc-fam-0a6-sem-ocupado", row["fam-0a6-sem-ocupado"], total0a6);
    setSinal("sinal-sem-ocupado", percSemOcupado, { red: 40, yellow: 25 });

    const percSemEmpregado = setPercent("perc-fam-0a6-sem-empregado", row["fam-0a6-sem-empregado"], total0a6);
    setSinal("sinal-sem-empregado", percSemEmpregado, { red: 40, yellow: 25 });

    const percGPTE = setPercent("perc-fam-gpte", row["fam-gpte"], totalFam);
    setSinal("sinal-gpte", percGPTE, { red: 50, yellow: 25 });

    const percGPTE0a6 = setPercent("perc-fam-gpte-0a6", row["fam-gpte-0a6"], total0a6);
    setSinal("sinal-gpte-0a6", percGPTE0a6, { red: 40, yellow: 20 });

    const percFamRural = setPercent("perc-fam-rural", row["fam-rural"], totalFam);
    setSinal("sinal-fam-rural", percFamRural, { red: 50, yellow: 25 }); // Ajuste os limites como quiser

    const percTrabalhoInfantil = setPercent("perc-fam-7a15-trabalho-infantil", row["fam-7a15-trabalho-infantil"], totalFam);
    const interpretacoes = [];

if (perc0a6 >= 30) {
  interpretacoes.push("⚠️ Atenção: este município possui uma proporção significativa de famílias com crianças de 0 a 6 anos no Cadastro Único. Isso indica alta demanda potencial por serviços voltados à primeira infância.");
}

if (percDesatualizados >= 25) {
  interpretacoes.push("⚠️ O percentual de cadastros desatualizados está elevado. Recomenda-se a realização de um mutirão de atualização e estratégias de busca ativa.");
}

if (percForaEscola0a6 >= 40) {
  interpretacoes.push("🛑 Alta proporção de crianças de 0 a 6 anos fora da escola. É essencial fortalecer a articulação com a Secretaria de Educação para garantir o acesso à creche e pré-escola.");
}

if (percSemOcupado >= 15 || percSemEmpregado >= 15) {
  interpretacoes.push("🔎 Muitas famílias com crianças pequenas vivem sem um adulto ocupado ou empregado. Estratégias de fortalecimento da parentalidade e acesso à rede de proteção devem ser priorizadas.");
}

if (percPCDCuidados >= 20) {
  interpretacoes.push("🧩 Há um número elevado de famílias com crianças pequenas e pessoas com deficiência que necessitam de cuidados. É fundamental articular ações intersetoriais e apoio específico a essas famílias.");
}

if (percGPTE >= 50 || percGPTE0a6 >= 40) {
  interpretacoes.push("🌍 A presença de famílias em áreas com Grandes Problemas de Território e Exclusão (GPTE) é significativa. As ações devem considerar vulnerabilidades territoriais e estratégias de busca ativa.");
}

if (percTrabalhoInfantil >= 5) {
  interpretacoes.push("🚨 Há indícios relevantes de trabalho infantil entre crianças de 7 a 15 anos. É necessário acionar a rede de proteção e o sistema de garantia de direitos.");
}
if (percFamRural >= 50) {
  interpretacoes.push("🏞️ Mais da metade das famílias do município vivem em áreas rurais. As estratégias de visitação domiciliar e cobertura dos serviços devem considerar barreiras de acesso.");
}


// Mostrar as interpretações no HTML
document.getElementById("interpretacao-bloco-1").innerHTML = `
  <h3>Leitura orientada dos dados:</h3>
  <ul>
    ${interpretacoes.map(txt => `<li>${txt}</li>`).join("")}
  </ul>
`;
    setSinal("sinal-trabalho-infantil", percTrabalhoInfantil, { red: 10, yellow: 5 });
  };
// === TEXTO DINÂMICO DO BLOCO 1 ===

const nomeMunicipio = row["Municipio"] ?? "o município";
const totalFam0a6 = total0a6 ?? 0;
const perc0a6 = totalFam > 0 ? ((totalFam0a6 / totalFam) * 100).toFixed(1) : '—';

const totalFamRural = row["fam-rural"] ?? 0;
const perc0a6Rural = totalFam0a6 > 0 ? ((totalFamRural / totalFam0a6) * 100).toFixed(1) : '—';

const totalFamGPTE0a6 = row["fam-gpte-0a6"] ?? 0;
const perc0a6GPTE = totalFam0a6 > 0 ? ((totalFamGPTE0a6 / totalFam0a6) * 100).toFixed(1) : '—';
const totalFamRural = row["fam-rural"] ?? 0;

const percDesatualizadosFinal = percDesatualizados?.toFixed(1) ?? '—';

document.getElementById('resumo-bloco-1').innerHTML = `
  <p>No município de <strong>${nomeMunicipio}</strong>, há um total de <strong>${totalFam0a6}</strong> famílias com crianças de 0 a 6 anos inseridas no Cadastro Único 
  (<em>${perc0a6}% das famílias registradas</em> — Fonte: Cadastro Único).</p>
  
   <p>Dessas, <strong>${totalFamRural}</strong> vivem em áreas rurais 
(<em>${perc0a6Rural}%</em>) e <strong>${totalFamGPTE0a6}</strong> pertencem a Grupos Populacionais Tradicionais e Específicos - GPTE 
(<em>${perc0a6GPTE}%</em> — Fonte: Cadastro Único).</p>
  
  <p>Além disso, <strong>${percDesatualizadosFinal}%</strong> das famílias estão com o cadastro desatualizado 
  (Fonte: Cadastro Único / Prontuário SUAS).</p>
`;

  reader.readAsArrayBuffer(file);
}
