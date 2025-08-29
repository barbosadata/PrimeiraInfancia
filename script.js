document.getElementById('fileInput').addEventListener('change', function (e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet);

    const municipioData = json[0]; // Primeira linha com dados do município

    const formatNumber = (value) =>
      new Intl.NumberFormat('pt-BR').format(Math.round(value));
    const formatPercent = (num) =>
      (num * 100).toFixed(2).replace('.', ',');

    const getPerc = (num, denom) => denom > 0 ? (num / denom) : 0;

    // Dados brutos
    const munName = municipioData['CRAS'];
    const municipio = municipioData['Municipio'];
    const total_cad_mun = municipioData['fam-cadunico_mun'];
    const total_cad_estado = municipioData['fam-cadunico_estado'];
    const total_cad_br = municipioData['fam-cadunico_br'];

    const cad_des_mun = municipioData['cadunico-desatualizado_mun'];
    const cad_des_estado = municipioData['cadunico-desatualizado_estado'];
    const cad_des_br = municipioData['cadunico-desatualizado_br'];

    const cad_0a6_mun = municipioData['fam-0a6-desatualizadas_mun'];
    const cad_0a6_estado = municipioData['fam-0a6-desatualizadas_estado'];
    const cad_0a6_br = municipioData['fam-0a6-desatualizadas_nacional'];

    const pobreza_pre_mun = municipioData['fam-em-pobreza-antes-pbf_mun'];
    const pobreza_pre_estado = municipioData['fam-em-pobreza-antes-pbf_estado'];
    const pobreza_pre_br = municipioData['fam-em-pobreza-antes-pbf_br'];

    const pobreza_pos_mun = municipioData['fam-pobreza-pos-pbf_mun'];
    const pobreza_pos_estado = municipioData['fam-pobreza-pos-pbf_estado'];
    const pobreza_pos_br = municipioData['fam-pobreza-pos-pbf_br'];

    const pi_pobreza_mun = municipioData['fam-primeira-infancia-e-pobreza_mun'];
    const pi_pobreza_estado = municipioData['fam-primeira-infancia-e-pobreza_estado'];
    const pi_pobreza_br = municipioData['fam-primeira-infancia-e-pobreza_br'];

    const fam_0a6_mun = municipioData['fam-0a6_mun'];
    const fam_0a6_estado = municipioData['fam-0a6_estado'];
    const fam_0a6_br = municipioData['fam-0a6_br'];

    const cri_0a3 = municipioData['pessoas-0a3_mun'];
    const cri_4a6 = municipioData['pessoas-4a6_mun'];
    const total_criancas = cri_0a3 + cri_4a6;

    const fam_rural_0a6 = municipioData['fam-primeira-infancia-e-area-rural_mun'];
    const perc_fam_rural_0a6 = getPerc(fam_rural_0a6, fam_0a6_mun);

    // Porcentagens
    const perc_cad_des_mun = getPerc(cad_des_mun, total_cad_mun);
    const perc_cad_des_estado = getPerc(cad_des_estado, total_cad_estado);
    const perc_cad_des_br = getPerc(cad_des_br, total_cad_br);

    const perc_0a6_des_mun = getPerc(cad_0a6_mun, fam_0a6_mun);
    const perc_0a6_des_estado = getPerc(cad_0a6_estado, fam_0a6_estado);
    const perc_0a6_des_br = getPerc(cad_0a6_br, fam_0a6_br);

    const perc_pobreza_pre_mun = getPerc(pobreza_pre_mun, total_cad_mun);
    const perc_pobreza_pre_estado = getPerc(pobreza_pre_estado, total_cad_estado);
    const perc_pobreza_pre_br = getPerc(pobreza_pre_br, total_cad_br);

    const perc_pobreza_pos_mun = getPerc(pobreza_pos_mun, total_cad_mun);
    const perc_pobreza_pos_estado = getPerc(pobreza_pos_estado, total_cad_estado);
    const perc_pobreza_pos_br = getPerc(pobreza_pos_br, total_cad_br);

    const perc_pi_pobreza_mun = getPerc(pi_pobreza_mun, total_cad_mun);
    const perc_pi_pobreza_estado = getPerc(pi_pobreza_estado, total_cad_estado);
    const perc_pi_pobreza_br = getPerc(pi_pobreza_br, total_cad_br);

    const perc_fam_0a6_mun = getPerc(fam_0a6_mun, total_cad_mun);

    // Geração de texto com análise narrativa
    const texto = `
      <p><strong>O CRAS ${munName}</strong> está localizado no município de <strong>${municipio}</strong>, que possui <strong>${formatNumber(total_cad_mun)}</strong> famílias inscritas no Cadastro Único — o que representa ${formatPercent(getPerc(total_cad_mun, total_cad_estado))}% do total estadual e ${formatPercent(getPerc(total_cad_mun, total_cad_br))}% do total nacional.</p>

      <p>A taxa de cadastros desatualizados no município é de <strong>${formatPercent(perc_cad_des_mun)}%</strong>, valor semelhante à média estadual (${formatPercent(perc_cad_des_estado)}%) e inferior à nacional (${formatPercent(perc_cad_des_br)}%), o que sugere que o processo de atualização cadastral está relativamente em dia.</p>

      <p>Entretanto, entre as famílias com crianças de 0 a 6 anos, a taxa de desatualização sobe para <strong>${formatPercent(perc_0a6_des_mun)}%</strong>, bem acima da média estadual (${formatPercent(perc_0a6_des_estado)}%) e próxima à nacional (${formatPercent(perc_0a6_des_br)}%), o que indica atenção necessária para esse público prioritário.</p>

      <p>Antes do recebimento do Bolsa Família, <strong>${formatPercent(perc_pobreza_pre_mun)}%</strong> das famílias do município estavam em situação de pobreza — abaixo da média estadual (${formatPercent(perc_pobreza_pre_estado)}%), mas acima da nacional (${formatPercent(perc_pobreza_pre_br)}%).</p>

      <p>Após o recebimento do benefício, essa taxa caiu para <strong>${formatPercent(perc_pobreza_pos_mun)}%</strong>, o que representa melhora significativa, embora ainda acima das médias estadual (${formatPercent(perc_pobreza_pos_estado)}%) e nacional (${formatPercent(perc_pobreza_pos_br)}%).</p>

      <p><strong>${formatPercent(perc_pi_pobreza_mun)}%</strong> das famílias com crianças de 0 a 6 anos ainda estão em situação de pobreza no município, bem acima da média estadual (${formatPercent(perc_pi_pobreza_estado)}%) e também superior à nacional (${formatPercent(perc_pi_pobreza_br)}%).</p>

      <p>Atualmente, há <strong>${formatNumber(fam_0a6_mun)}</strong> famílias com crianças de 0 a 6 anos no município, o que corresponde a ${formatPercent(perc_fam_0a6_mun)}% do total local do Cadastro Único.</p>

      <p>Essas famílias concentram <strong>${formatNumber(total_criancas)}</strong> crianças, sendo <strong>${formatNumber(cri_0a3)}</strong> de 0 a 3 anos e <strong>${formatNumber(cri_4a6)}</strong> de 4 a 6 anos.</p>

      <p>Entre elas, <strong>${formatNumber(fam_rural_0a6)}</strong> vivem em áreas rurais, o que corresponde a <strong>${formatPercent(perc_fam_rural_0a6)}%</strong> — dado relevante para pensar estratégias específicas de atendimento domiciliar e acesso a serviços.</p>
    `;

    document.getElementById('interpretacao-bloco-1').innerHTML = texto;
  };

  // ========================
// BLOCO 2 – VULNERABILIDADES
// ========================

function gerarBloco2(dados) {
  const totalFamilias = dados["n_familias_cadunico_mun"];
  const totalFam0a6 = dados["fam-0a6_mun"];

  const trabalhoInfantil = dados["fam_trabalho_infantil_mun"];
  const trabalhoInfantilReferenciada = dados["fam_trabalho_infantil_referenciada_no_CRAS_anual"];
  const pcdCuidados = dados["fam-0a6-pcd-cuidados_mun"];
  const fam0a6SemOcupado = dados["fam-0a6-sem-ocupado_mun"];
  const fam0a6SemLer = dados["fam-0a6-sem-ler_mun"];
  const famSemOcupado = dados["fam-sem-ocupado_mun"];
  const famGPTE0a6 = dados["fam-gpte-0a6_mun"];
  const fam0a6Desatualizadas = dados["fam-0a6-desatualizadas_mun"];

  let texto = `**Bloco 2. Vulnerabilidades e riscos sociais para crianças pequenas**\n\n`;

  texto += `Este bloco reúne dados que revelam **riscos acumulados e vulnerabilidades estruturais** nas famílias com crianças de 0 a 6 anos, o que impacta diretamente suas oportunidades de desenvolvimento.\n\n`;

  if (trabalhoInfantil && totalFamilias) {
    const percTI = (trabalhoInfantil / totalFamilias * 100).toFixed(2);
    texto += `No município, **${formatNumber(trabalhoInfantil)} famílias estão em situação de trabalho infantil**, o que representa cerca de **${percTI}% do total cadastrado**. Esse dado exige atenção redobrada à atuação articulada entre assistência social, educação e o sistema de garantias.\n\n`;
  }

  if (trabalhoInfantilReferenciada) {
    texto += `Entre essas, **${formatNumber(trabalhoInfantilReferenciada)} foram referenciadas ao CRAS ao longo do ano**, apontando para o potencial (e também o limite) da atuação da Proteção Social Básica nesse enfrentamento.\n\n`;
  }

  if (pcdCuidados && totalFam0a6) {
    const percPCD = (pcdCuidados / totalFam0a6 * 100).toFixed(2);
    texto += `Há **${formatNumber(pcdCuidados)} famílias com crianças pequenas com deficiência que demandam cuidados permanentes**, representando **${percPCD}% do total de famílias com crianças de 0 a 6 anos** — um grupo que demanda atenção integral e estratégias específicas de apoio.\n\n`;
  }

  if (fam0a6SemOcupado && totalFam0a6) {
    const percSemOcupado = (fam0a6SemOcupado / totalFam0a6 * 100).toFixed(2);
    texto += `Cerca de **${formatNumber(fam0a6SemOcupado)} famílias com crianças de 0 a 6 anos não possuem nenhum integrante ocupado**, o que representa **${percSemOcupado}% dessa população** e pode indicar situações de extrema vulnerabilidade socioeconômica.\n\n`;
  }

  if (fam0a6SemLer && totalFam0a6) {
    const percSemLer = (fam0a6SemLer / totalFam0a6 * 100).toFixed(2);
    texto += `Além disso, **${formatNumber(fam0a6SemLer)} famílias não contam com nenhum membro alfabetizado**, o que corresponde a **${percSemLer}% das famílias com crianças pequenas** — uma barreira significativa à promoção de estímulos cognitivos no ambiente familiar.\n\n`;
  }

  if (famSemOcupado && totalFamilias) {
    const percGeralSemOcupado = (famSemOcupado / totalFamilias * 100).toFixed(2);
    texto += `Em termos gerais, **${formatNumber(famSemOcupado)} famílias cadastradas no município não possuem integrantes ocupados**, cerca de **${percGeralSemOcupado}% do total**, reforçando o cenário de vulnerabilidade socioeconômica ampliada.\n\n`;
  }

  if (famGPTE0a6 && totalFam0a6) {
    const percGPTE = (famGPTE0a6 / totalFam0a6 * 100).toFixed(2);
    texto += `O dado de **${formatNumber(famGPTE0a6)} famílias com crianças de 0 a 6 anos em territórios com Grandes Problemas e Tradições Específicas (GPTE)** representa **${percGPTE}% das famílias com crianças pequenas**, exigindo respostas territorializadas e culturalmente sensíveis.\n\n`;
  }

  if (fam0a6Desatualizadas && totalFam0a6) {
    const percDesatualizadas = (fam0a6Desatualizadas / totalFam0a6 * 100).toFixed(2);
    texto += `Por fim, **${formatNumber(fam0a6Desatualizadas)} famílias com crianças de 0 a 6 anos estão com o cadastro desatualizado**, o que representa **${percDesatualizadas}% dessa população** e pode comprometer seu acesso a benefícios e serviços prioritários.\n\n`;
  }

  return texto;
}


  reader.readAsArrayBuffer(file);
});

