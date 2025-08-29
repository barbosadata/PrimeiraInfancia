// ----------------------
// Funções auxiliares
// ----------------------
function formatNumber(value) {
  return new Intl.NumberFormat('pt-BR').format(Math.round(value));
}

function formatPercent(value) {
  return (value * 100).toFixed(2).replace('.', ',');
}

function getPerc(num, denom) {
  return denom > 0 ? (num / denom) : 0;
}

// ----------------------
// Bloco 1: Cadastro Único e Pobreza
// ----------------------
function gerarBloco1(dados) {
  const munName = dados['CRAS'];
  const municipio = dados['Municipio'];

  const total_cad_mun = dados['fam-cadunico_mun'];
  const total_cad_estado = dados['fam-cadunico_estado'];
  const total_cad_br = dados['fam-cadunico_br'];

  const cad_des_mun = dados['cadunico-desatualizado_mun'];
  const cad_des_estado = dados['cadunico-desatualizado_estado'];
  const cad_des_br = dados['cadunico-desatualizado_br'];

  const cad_0a6_mun = dados['fam-0a6-desatualizadas_mun'];
  const cad_0a6_estado = dados['fam-0a6-desatualizadas_estado'];
  const cad_0a6_br = dados['fam-0a6-desatualizadas_nacional'];

  const pobreza_pre_mun = dados['fam-em-pobreza-antes-pbf_mun'];
  const pobreza_pre_estado = dados['fam-em-pobreza-antes-pbf_estado'];
  const pobreza_pre_br = dados['fam-em-pobreza-antes-pbf_br'];

  const pobreza_pos_mun = dados['fam-pobreza-pos-pbf_mun'];
  const pobreza_pos_estado = dados['fam-pobreza-pos-pbf_estado'];
  const pobreza_pos_br = dados['fam-pobreza-pos-pbf_br'];

  const pi_pobreza_mun = dados['fam-primeira-infancia-e-pobreza_mun'];
  const pi_pobreza_estado = dados['fam-primeira-infancia-e-pobreza_estado'];
  const pi_pobreza_br = dados['fam-primeira-infancia-e-pobreza_br'];

  const fam_0a6_mun = dados['fam-0a6_mun'];
  const fam_0a6_estado = dados['fam-0a6_estado'];
  const fam_0a6_br = dados['fam-0a6_br'];

  const cri_0a3 = dados['pessoas-0a3_mun'];
  const cri_4a6 = dados['pessoas-4a6_mun'];
  const total_criancas = cri_0a3 + cri_4a6;

  const fam_rural_0a6 = dados['fam-primeira-infancia-e-area-rural_mun'];
  const perc_fam_rural_0a6 = getPerc(fam_rural_0a6, fam_0a6_mun);

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

  return `
    <p><strong>O CRAS ${munName}</strong> está localizado no município de <strong>${municipio}</strong>, que possui <strong>${formatNumber(total_cad_mun)}</strong> famílias inscritas no Cadastro Único — o que representa ${formatPercent(getPerc(total_cad_mun, total_cad_estado))}% do total estadual e ${formatPercent(getPerc(total_cad_mun, total_cad_br))}% do total nacional.</p>

    <p>A taxa de cadastros desatualizados no município é de <strong>${formatPercent(perc_cad_des_mun)}%</strong>, valor semelhante à média estadual (${formatPercent(perc_cad_des_estado)}%) e inferior à nacional (${formatPercent(perc_cad_des_br)}%).</p>

    <p>Entre as famílias com crianças de 0 a 6 anos, a taxa de desatualização sobe para <strong>${formatPercent(perc_0a6_des_mun)}%</strong>, bem acima da média estadual (${formatPercent(perc_0a6_des_estado)}%) e próxima à nacional (${formatPercent(perc_0a6_des_br)}%).</p>

    <p>Antes do Bolsa Família, <strong>${formatPercent(perc_pobreza_pre_mun)}%</strong> das famílias do município estavam em pobreza — abaixo da média estadual (${formatPercent(perc_pobreza_pre_estado)}%), mas acima da nacional (${formatPercent(perc_pobreza_pre_br)}%).</p>

    <p>Após o recebimento do benefício, essa taxa caiu para <strong>${formatPercent(perc_pobreza_pos_mun)}%</strong>, embora ainda acima das médias estadual (${formatPercent(perc_pobreza_pos_estado)}%) e nacional (${formatPercent(perc_pobreza_pos_br)}%).</p>

    <p><strong>${formatPercent(perc_pi_pobreza_mun)}%</strong> das famílias com crianças de 0 a 6 anos seguem em pobreza, superando as médias estadual (${formatPercent(perc_pi_pobreza_estado)}%) e nacional (${formatPercent(perc_pi_pobreza_br)}%).</p>

    <p>O município possui <strong>${formatNumber(fam_0a6_mun)}</strong> famílias com crianças pequenas, representando ${formatPercent(perc_fam_0a6_mun)}% do total local.</p>

    <p>Essas famílias concentram <strong>${formatNumber(total_criancas)}</strong> crianças, sendo <strong>${formatNumber(cri_0a3)}</strong> de 0 a 3 anos e <strong>${formatNumber(cri_4a6)}</strong> de 4 a 6 anos.</p>

    <p>Dentre elas, <strong>${formatNumber(fam_rural_0a6)}</strong> vivem em áreas rurais, o que representa <strong>${formatPercent(perc_fam_rural_0a6)}%</strong>.</p>
  `;
}

// ----------------------
// Bloco 2: Vulnerabilidades e riscos sociais
// ----------------------
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

  let texto = `<p><strong>Este bloco reúne dados que revelam riscos acumulados e vulnerabilidades estruturais nas famílias com crianças de 0 a 6 anos</strong>, o que impacta diretamente suas oportunidades de desenvolvimento.</p>`;

  if (trabalhoInfantil && totalFamilias) {
    const percTI = getPerc(trabalhoInfantil, totalFamilias);
    texto += `<p>No município, <strong>${formatNumber(trabalhoInfantil)}</strong> famílias estão em situação de trabalho infantil — <strong>${formatPercent(percTI)}%</strong> do total cadastrado.</p>`;
  }

  if (trabalhoInfantilReferenciada) {
    texto += `<p>Dessas, <strong>${formatNumber(trabalhoInfantilReferenciada)}</strong> foram referenciadas ao CRAS no ano, sinalizando a atuação da Proteção Social Básica.</p>`;
  }

  if (pcdCuidados && totalFam0a6) {
    const percPCD = getPerc(pcdCuidados, totalFam0a6);
    texto += `<p>Há <strong>${formatNumber(pcdCuidados)}</strong> famílias com crianças com deficiência que demandam cuidados permanentes — <strong>${formatPercent(percPCD)}%</strong> das famílias com crianças pequenas.</p>`;
  }

  if (fam0a6SemOcupado && totalFam0a6) {
    const percSemOcupado = getPerc(fam0a6SemOcupado, totalFam0a6);
    texto += `<p><strong>${formatNumber(fam0a6SemOcupado)}</strong> famílias com crianças de 0 a 6 anos não possuem nenhum integrante ocupado — <strong>${formatPercent(percSemOcupado)}%</strong>.</p>`;
  }

  if (fam0a6SemLer && totalFam0a6) {
    const percSemLer = getPerc(fam0a6SemLer, totalFam0a6);
    texto += `<p><strong>${formatNumber(fam0a6SemLer)}</strong> famílias não têm nenhum membro alfabetizado — <strong>${formatPercent(percSemLer)}%</strong> das famílias com crianças pequenas.</p>`;
  }

  if (famSemOcupado && totalFamilias) {
    const percGeralSemOcupado = getPerc(famSemOcupado, totalFamilias);
    texto += `<p><strong>${formatNumber(famSemOcupado)}</strong> famílias cadastradas não possuem integrantes ocupados — <strong>${formatPercent(percGeralSemOcupado)}%</strong>.</p>`;
  }

  if (famGPTE0a6 && totalFam0a6) {
    const percGPTE = getPerc(famGPTE0a6, totalFam0a6);
    texto += `<p><strong>${formatNumber(famGPTE0a6)}</strong> famílias com crianças pequenas vivem em territórios com GPTE — <strong>${formatPercent(percGPTE)}%</strong>.</p>`;
  }

  if (fam0a6Desatualizadas && totalFam0a6) {
    const percDesat = getPerc(fam0a6Desatualizadas, totalFam0a6);
    texto += `<p><strong>${formatNumber(fam0a6Desatualizadas)}</strong> famílias com crianças pequenas têm cadastros desatualizados — <strong>${formatPercent(percDesat)}%</strong>.</p>`;
  }
  document.getElementById('interpretacao-bloco-2').innerHTML = texto;


  return texto;
}

