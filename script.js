// =========================
// FUNÇÕES AUXILIARES GERAIS
// =========================
function getPerc(part, total) {
  return total > 0 ? (part / total) * 100 : 0;
}

function formatNumber(n) {
  return Number(n).toLocaleString('pt-BR');
}

function formatPercent(p) {
  return getPerc(p, 1).toFixed(1).replace(".", ",");
}

// =========================
// LEITURA DO ARQUIVO EXCEL
// =========================
document.getElementById('fileInput').addEventListener('change', function (e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Conversão da matriz (linhas e colunas) em objeto: {nome_coluna: valor}
    const header = json[0];
    const values = json[1];
    const dados = {};
    for (let i = 0; i < header.length; i++) {
      dados[header[i]] = values[i];
    }

    // Gerar blocos e atualizar HTML
    // Bloco 1
    const textoBloco1 = gerarBloco1(dados);
    if (document.getElementById('interpretacao-bloco-1')) {
      document.getElementById('interpretacao-bloco-1').innerHTML = textoBloco1
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br>");
    }

    // Bloco 2
    const textoBloco2 = gerarBloco2(dados);
    if (document.getElementById('interpretacao-bloco-2')) {
      document.getElementById('interpretacao-bloco-2').innerHTML = textoBloco2
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br>");
    }
  };

  reader.readAsArrayBuffer(file);
});

// ========================
// BLOCO 1 – Perfil do território
// ========================
function gerarBloco1(municipioData) {
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

  // Texto de interpretação
  const texto = `
**Bloco 1. Perfil do território**
O CRAS **${munName}** está localizado no município de **${municipio}**, que possui **${formatNumber(total_cad_mun)}** famílias inscritas no Cadastro Único. No estado são **${formatNumber(total_cad_estado)}** e no Brasil **${formatNumber(total_cad_br)}**.

A taxa de cadastros desatualizados no município é de **${formatPercent(perc_cad_des_mun)}%**, valor semelhante à média estadual (${formatPercent(perc_cad_des_estado)}%) e inferior à nacional (${formatPercent(perc_cad_des_br)}%).

Entretanto, entre as famílias com crianças de 0 a 6 anos, a taxa de desatualização sobe para **${formatPercent(perc_0a6_des_mun)}%**, bem acima da média estadual (${formatPercent(perc_0a6_des_estado)}%) e nacional (${formatPercent(perc_0a6_des_br)}%).

Antes do recebimento do Bolsa Família, **${formatPercent(perc_pobreza_pre_mun)}%** das famílias do município estavam em situação de pobreza — abaixo da média estadual (${formatPercent(perc_pobreza_pre_estado)}%) e nacional (${formatPercent(perc_pobreza_pre_br)}%).

Após o recebimento do benefício, essa taxa caiu para **${formatPercent(perc_pobreza_pos_mun)}%**, o que representa melhora significativa, embora ainda acima das médias estadual (${formatPercent(perc_pobreza_pos_estado)}%) e nacional (${formatPercent(perc_pobreza_pos_br)}%).

**${formatPercent(perc_pi_pobreza_mun)}%** das famílias com crianças de 0 a 6 anos ainda estão em situação de pobreza no município, bem acima da média estadual (${formatPercent(perc_pi_pobreza_estado)}%) e nacional (${formatPercent(perc_pi_pobreza_br)}%).

Atualmente, há **${formatNumber(fam_0a6_mun)}** famílias com crianças de 0 a 6 anos no município, o que corresponde a **${formatPercent(perc_fam_0a6_mun)}%** do total local do Cadastro Único.

Essas famílias concentram **${formatNumber(total_criancas)}** crianças, sendo **${formatNumber(cri_0a3)}** de 0 a 3 anos e **${formatNumber(cri_4a6)}** de 4 a 6 anos.

Entre elas, **${formatNumber(fam_rural_0a6)}** vivem em áreas rurais, o que corresponde a **${formatPercent(perc_fam_rural_0a6)}%** — dado relevante para pensar estratégias de busca ativa e oferta de serviços.
`;

  return texto;
}

// ========================
// BLOCO 2 – Vulnerabilidades e riscos sociais
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

  texto += `Este bloco reúne dados que revelam **riscos acumulados e vulnerabilidades estruturais** nas famílias com crianças de 0 a 6 anos, o que impacta diretamente suas oportunidades de desenvolvimento e autonomia.\n\n`;

  if (trabalhoInfantil && totalFamilias) {
    const percTI = (trabalhoInfantil / totalFamilias * 100).toFixed(2).replace(".", ",");
    texto += `No município, **${formatNumber(trabalhoInfantil)} famílias estão em situação de trabalho infantil**, o que representa cerca de **${percTI}% do total cadastrado**. Esse dado exige atenção prioritária das políticas públicas.\n\n`;
  }

  if (trabalhoInfantilReferenciada) {
    texto += `Entre essas, **${formatNumber(trabalhoInfantilReferenciada)} foram referenciadas ao CRAS ao longo do ano**, apontando para o potencial (e também o limite) da atuação da Proteção Social Básica.\n\n`;
  }

  if (pcdCuidados && totalFam0a6) {
    const percPCD = (pcdCuidados / totalFam0a6 * 100).toFixed(2).replace(".", ",");
    texto += `Há **${formatNumber(pcdCuidados)} famílias com crianças pequenas com deficiência que demandam cuidados permanentes**, representando **${percPCD}% do total de famílias com crianças pequenas**.\n\n`;
  }

  if (fam0a6SemOcupado && totalFam0a6) {
    const percSemOcupado = (fam0a6SemOcupado / totalFam0a6 * 100).toFixed(2).replace(".", ",");
    texto += `Cerca de **${formatNumber(fam0a6SemOcupado)} famílias com crianças de 0 a 6 anos não possuem nenhum integrante ocupado**, o que representa **${percSemOcupado}% dessa população** e pode indicar situação de vulnerabilidade socioeconômica.\n\n`;
  }

  if (fam0a6SemLer && totalFam0a6) {
    const percSemLer = (fam0a6SemLer / totalFam0a6 * 100).toFixed(2).replace(".", ",");
    texto += `Além disso, **${formatNumber(fam0a6SemLer)} famílias não contam com nenhum membro alfabetizado**, o que corresponde a **${percSemLer}% das famílias com crianças pequenas** — uma barreira importante para o acesso a direitos.\n\n`;
  }

  if (famSemOcupado && totalFamilias) {
    const percGeralSemOcupado = (famSemOcupado / totalFamilias * 100).toFixed(2).replace(".", ",");
    texto += `Em termos gerais, **${formatNumber(famSemOcupado)} famílias cadastradas no município não possuem integrantes ocupados**, cerca de **${percGeralSemOcupado}% do total**, reforçando o caráter estrutural da vulnerabilidade.\n\n`;
  }

  if (famGPTE0a6 && totalFam0a6) {
    const percGPTE = (famGPTE0a6 / totalFam0a6 * 100).toFixed(2).replace(".", ",");
    texto += `O dado de **${formatNumber(famGPTE0a6)} famílias com crianças de 0 a 6 anos em territórios com Grandes Problemas e Tradições Específicas (GPTE)** representa **${percGPTE}% das famílias dessa faixa etária**.\n\n`;
  }

  if (fam0a6Desatualizadas && totalFam0a6) {
    const percDesatualizadas = (fam0a6Desatualizadas / totalFam0a6 * 100).toFixed(2).replace(".", ",");
    texto += `Por fim, **${formatNumber(fam0a6Desatualizadas)} famílias com crianças de 0 a 6 anos estão com o cadastro desatualizado**, o que representa **${percDesatualizadas}% dessa população** e pode dificultar o acesso a benefícios e serviços.\n\n`;
  }

  return texto;
}
