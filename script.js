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
    const totalFam = row["fam-cadunico"];
    const total0a6 = row["fam-0a6"];
    const totalPessoas = row["pessoas-total"];
    const totalFamRural = row["fam-rural"] ?? 0;

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

    // Valores absolutos
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
    setValue("valor-fam-rural", totalFamRural);
    setValue("valor-fam-7a15-trabalho-infantil", row["fam-7a15-trabalho-infantil"]);

    // Percentuais
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

    const percFamRural = setPercent("perc-fam-rural", totalFamRural, totalFam);
    setSinal("sinal-fam-rural", percFamRural, { red: 50, yellow: 25 });

    const percTrabalhoInfantil = setPercent("perc-fam-7a15-trabalho-infantil", row["fam-7a15-trabalho-infantil"], totalFam);
    setSinal("sinal-trabalho-infantil", percTrabalhoInfantil, { red: 10, yellow: 5 });

    // Interpretações
    const interpretacoes = [];

    if (perc0a6 >= 30) {
      interpretacoes.push("⚠️ Atenção: este município possui uma proporção significativa de famílias com crianças de 0 a 6 anos no Cadastro Único.");
    }

    if (percDesatualizados >= 25) {
      interpretacoes.push("⚠️ O percentual de cadastros desatualizados está elevado. Recomenda-se mutirão de atualização e busca ativa.");
    }

    if (percForaEscola0a6 >= 40) {
      interpretacoes.push("🛑 Alta proporção de crianças de 0 a 6 anos fora da escola. Fortalecer a articulação com a Educação.");
    }

    if (percSemOcupado >= 15 || percSemEmpregado >= 15) {
      interpretacoes.push("🔎 Muitas famílias com crianças pequenas vivem sem adulto ocupado ou empregado. Priorizar apoio à parentalidade.");
    }

    if (percPCDCuidados >= 20) {
      interpretacoes.push("🧩 Muitas famílias com crianças pequenas e pessoas com deficiência que necessitam de cuidados.");
    }

    if (percGPTE >= 50 || percGPTE0a6 >= 40) {
      interpretacoes.push("🌍 Presença significativa de famílias em territórios com exclusão. Considerar vulnerabilidades locais.");
    }

    if (percTrabalhoInfantil >= 5) {
      interpretacoes.push("🚨 Indícios relevantes de trabalho infantil entre crianças de 7 a 15 anos.");
    }

    if (percFamRural >= 50) {
      interpretacoes.push("🏞️ A maioria das famílias vive em áreas rurais. Adaptar estratégias de atendimento.");
    }

    // Texto do resumo
    const nomeMunicipio = row["Municipio"] ?? "o município";
    const totalFam0a6 = total0a6 ?? 0;
    const perc0a6Texto = totalFam > 0 ? ((totalFam0a6 / totalFam) * 100).toFixed(1) : '—';
    const totalFamGPTE0a6 = row["fam-gpte-0a6"] ?? 0;
    const perc0a6GPTE = totalFam0a6 > 0 ? ((totalFamGPTE0a6 / totalFam0a6) * 100).toFixed(1) : '—';
    const perc0a6Rural = totalFam0a6 > 0 ? ((totalFamRural / totalFam0a6) * 100).toFixed(1) : '—';
    const percDesatualizadosFinal = percDesatualizados?.toFixed(1) ?? '—';

    document.getElementById("interpretacao-bloco-1").innerHTML = `
  <div id="resumo-bloco-1" class="resumo-dinamico">
    <p>No município de <strong>${nomeMunicipio}</strong>, há um total de <strong>${totalFam0a6}</strong> famílias com crianças de 0 a 6 anos inseridas no Cadastro Único 
    (<em>${perc0a6Texto}% das famílias registradas</em> — Fonte: Cadastro Único).</p>

    <p>Dessas, <strong>${totalFamRural}</strong> vivem em áreas rurais 
    (<em>${perc0a6Rural}%</em>) e <strong>${totalFamGPTE0a6}</strong> pertencem a Grupos Populacionais Tradicionais e Específicos - GPTE 
    (<em>${perc0a6GPTE}%</em> — Fonte: Cadastro Único).</p>

    <p>Além disso, <strong>${percDesatualizadosFinal}%</strong> das famílias estão com o cadastro desatualizado 
    (Fonte: Cadastro Único / Prontuário SUAS).</p>
  </div>

  <h3>Leitura orientada dos dados:</h3>
  <ul>${interpretacoes.map(txt => `<li>${txt}</li>`).join("")}</ul>
`;
     // === BLOCO 2: Serviços ofertados ===
    const servicoMapeado = [
      { nome: "PAIF", oferta: "oferta_paif", familias: "n_familias_paif" },
      { nome: "PCF (Criança Feliz)", oferta: "oferta_cpf", familias: "n_familias_cpf" },
      { nome: "SCFV", oferta: "oferta_scfv", familias: "n_familias_scfv" },
      { nome: "PSB em domicílio", oferta: "oferta_psb_domicilio", familias: "n_familias_psb_domicilio" },
      { nome: "Benefício eventual", oferta: "oferta_beneficio_eventual", familias: "n_familias_beneficio_eventual" }
    ];

    const tabelaServicosBody = document.getElementById("tabela-servicos-body");
    tabelaServicosBody.innerHTML = "";

    let totalServicos = 0;
    let totalOfertados = 0;

    servicoMapeado.forEach(servico => {
      const ofertado = (row[servico.oferta] ?? "").toString().toLowerCase().trim() === "sim";
      const atendidas = row[servico.familias] ?? "—";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${servico.nome}</td>
        <td>${ofertado ? "✅ Sim" : "❌ Não"}</td>
        <td>${atendidas}</td>
      `;
      tabelaServicosBody.appendChild(tr);

      totalServicos += 1;
      if (ofertado) totalOfertados += 1;
    });

    const percOfertados = ((totalOfertados / totalServicos) * 100).toFixed(0);

    let interpretacao = "";
    if (percOfertados >= 80) {
      interpretacao = "O CRAS oferta a maior parte dos serviços previstos, indicando boa capacidade instalada.";
    } else if (percOfertados >= 50) {
      interpretacao = "O CRAS oferta parte relevante dos serviços, mas há espaço para ampliar sua atuação.";
    } else {
      interpretacao = "O número de serviços ofertados diretamente pelo CRAS é baixo, o que pode indicar restrições operacionais.";
    }

    document.getElementById("interpretacao-bloco-2").innerHTML = `
      <p>O CRAS oferta <strong>${totalOfertados}</strong> de <strong>${totalServicos}</strong> serviços essenciais para a atenção à primeira infância.</p>
      <p>${interpretacao}</p>
    `;
    // === BLOCO 3: Violações de Direitos ===
function preencherBloco3(row) {
  // Preencher valores absolutos
  document.getElementById("valor-violencia-menores").textContent = row["violencia_menores_10_anos"] || "—";
  document.getElementById("valor-pcd-cuidados").textContent = row["fam-0a6-pcd-cuidados"] || "—";
  document.getElementById("valor-sem-ocupado").textContent = row["fam-0a6-sem-ocupado"] || "—";
  document.getElementById("valor-sem-empregado").textContent = row["fam-0a6-sem-empregado"] || "—";
  document.getElementById("valor-fora-escola-0a6").textContent = row["fam-0a6-fora-escola"] || "—";
  document.getElementById("valor-fora-escola-4a6").textContent = row["fam-4a6-fora-escola"] || "—";
  document.getElementById("valor-vacinacao-atrasada").textContent = row["criancas_ate7_anos_vacinacao_atrasada"] || "—";
  document.getElementById("valor-frequencia-baixa").textContent = row["criancas_4a5_frequencia_escolar_menor_60"] || "—";
  document.getElementById("valor-condicionalidades").textContent = row["fam_descump_condicionalidades"] || "—";
  document.getElementById("valor-pobreza-pos-pbf").textContent = row["fam-pbf-continuam-pobreza"] || "—";
  document.getElementById("valor-trabalho-infantil").textContent = row["fam_trabalho_infantil_7a15"] || "—";

  const totalPBF_0a6 = row["fam_pbf_0a6"] ?? 0;
  const totalFam = row["pessoas-total"] ?? 0;

  function setPercentBloco3(id, numerador, denominador) {
    const valor = denominador > 0 ? (numerador / denominador) * 100 : 0;
    document.getElementById(id).textContent = valor.toFixed(1) + "%";
    return valor;
  }

  function setSinalBloco3(id, valor, faixas) {
    if (valor >= faixas.red) {
      document.getElementById(id).textContent = "🟥";
    } else if (valor >= faixas.yellow) {
      document.getElementById(id).textContent = "🟨";
    } else {
      document.getElementById(id).textContent = "🟩";
    }
  }

  // Percentuais
  const percVacinacaoAtrasada = setPercentBloco3("perc-vacinacao-atrasada", row["criancas_ate7_anos_vacinacao_atrasada"], totalPBF_0a6);
  setSinalBloco3("sinal-vacinacao-atrasada", percVacinacaoAtrasada, { red: 20, yellow: 10 });

  const percFreqBaixa = setPercentBloco3("perc-frequencia-baixa", row["criancas_4a5_frequencia_escolar_menor_60"], totalPBF_0a6);
  setSinalBloco3("sinal-frequencia-baixa", percFreqBaixa, { red: 20, yellow: 10 });

  const percCondicionalidade = setPercentBloco3("perc-condicionalidades", row["fam_descump_condicionalidades"], totalPBF_0a6);
  setSinalBloco3("sinal-condicionalidades", percCondicionalidade, { red: 20, yellow: 10 });

  const percPobrezaPosPBF = setPercentBloco3("perc-pobreza-pos-pbf", row["fam-pbf-continuam-pobreza"], totalPBF_0a6);
  setSinalBloco3("sinal-pobreza-pos-pbf", percPobrezaPosPBF, { red: 20, yellow: 10 });

  const percForaEscola4a6 = setPercentBloco3("perc-fora-escola-4a6", row["fam-4a6-fora-escola"], totalPBF_0a6);
  setSinalBloco3("sinal-fora-escola-4a6", percForaEscola4a6, { red: 10, yellow: 5 });

  const percTrabalhoInfantil = setPercentBloco3("perc-trabalho-infantil", row["fam_trabalho_infantil_7a15"], totalFam);
  setSinalBloco3("sinal-trabalho-infantil", percTrabalhoInfantil, { red: 10, yellow: 5 });

  // Interpretação automática
  const interpretacoesBloco3 = [];
  if (percVacinacaoAtrasada >= 20) interpretacoesBloco3.push("🛑 Alta taxa de vacinação atrasada entre crianças até 7 anos.");
  else if (percVacinacaoAtrasada >= 10) interpretacoesBloco3.push("⚠️ Percentual relevante de vacinação atrasada entre crianças até 7 anos.");

  if (percFreqBaixa >= 20) interpretacoesBloco3.push("🛑 Muitas crianças de 4 e 5 anos com frequência escolar abaixo de 60%.");
  else if (percFreqBaixa >= 10) interpretacoesBloco3.push("⚠️ Frequência escolar reduzida entre parte das crianças de 4 a 5 anos.");

  if (percCondicionalidade >= 20) interpretacoesBloco3.push("🛑 Muitas famílias descumprindo condicionalidades do PBF.");
  else if (percCondicionalidade >= 10) interpretacoesBloco3.push("⚠️ Parte das famílias não está cumprindo as condicionalidades do programa.");

  if (percPobrezaPosPBF >= 20) interpretacoesBloco3.push("🛑 Elevado número de famílias ainda em pobreza mesmo após acesso ao PBF.");
  else if (percPobrezaPosPBF >= 10) interpretacoesBloco3.push("⚠️ Parte das famílias permanece em situação de pobreza após o PBF.");

  if (percForaEscola4a6 >= 10) interpretacoesBloco3.push("🛑 Muitas crianças de 4 a 6 anos fora da escola.");
  else if (percForaEscola4a6 >= 5) interpretacoesBloco3.push("⚠️ Parte significativa das crianças de 4 a 6 anos fora da escola.");

  if (percTrabalhoInfantil >= 10) interpretacoesBloco3.push("🛑 Indícios graves de trabalho infantil entre crianças de 7 a 15 anos.");
  else if (percTrabalhoInfantil >= 5) interpretacoesBloco3.push("⚠️ Indícios de trabalho infantil entre crianças de 7 a 15 anos.");

  document.getElementById("interpretacao-bloco-3").innerHTML = `
    <h3>Leitura orientada dos dados:</h3>
    <ul>${interpretacoesBloco3.map(txt => `<li>${txt}</li>`).join("")}</ul>
  `;
} // aqui fecha a função

// fora da função, você lê o arquivo:
reader.readAsArrayBuffer(file);
