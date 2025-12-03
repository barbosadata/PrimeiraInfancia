// =========================
// FUNÇÕES AUXILIARES GERAIS
// =========================
function getPerc(part, total) {
    return total > 0 ? (part / total) * 100 : 0;
}

function formatNumber(n) {
  const num = typeof n === 'number' ? n : parseNumberFlexible(n);
  if (isNaN(num)) return '0';
  return Math.round(num).toLocaleString('pt-BR');
}

function formatPercent(p) {
  const num = typeof p === 'number' ? p : parseNumberFlexible(p);
  if (isNaN(num)) return '0,0';
  return Number(num).toFixed(2).replace('.', ',');
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.color = 'red';
    errorDiv.style.padding = '10px';
    errorDiv.style.marginTop = '10px';
    errorDiv.textContent = 'Erro: ' + message;
    document.querySelector('.container').appendChild(errorDiv);
}
  
function clearErrors() {
    const errorDivs = document.querySelectorAll('div[style*="color: red"]');
    errorDivs.forEach(div => div.remove());
}

// Normalize incoming Excel header text to a canonical key when possible.
function canonicalKeyFromHeader(raw) {
    if (!raw) return null;
    const low = String(raw).toLowerCase();
    // remove diacritics
    const norm = low.normalize && low.normalize('NFD') ? low.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : low;
    // compact to letters+numbers only (underscores used as separators)
    const compact = norm.replace(/[^a-z0-9]/g, '_');

    // common canonical mappings (extend as needed)
    if (compact.indexOf('cras') !== -1) return 'CRAS';
    if (compact.indexOf('municip') !== -1) return 'Municipio';
    if (compact.indexOf('nutric') !== -1 || compact.indexOf('acompnutric') !== -1) return 'nao_acomp_nutricional_0a7';
    if (compact.indexOf('vacin') !== -1 || compact.indexOf('vacina') !== -1) return 'nao_vacinacao_0a7';
    if (compact.indexOf('prenat') !== -1) return 'nao_prenatal_adequad';
    // be flexible for various PBF header variants
    if (compact.indexOf('fam_pbf') !== -1 || compact.indexOf('pbf_0a6') !== -1 || (compact.indexOf('pbf') !== -1 && compact.indexOf('0a6') !== -1) || (compact.indexOf('pbf') !== -1 && compact.indexOf('fam') !== -1)) return 'fam_pbf_0a6';

    return null; // unknown -> keep original header as key
}

// Robust number parser: accept numbers or strings with '.' thousands and ',' decimals
function parseNumberFlexible(v) {
    if (typeof v === 'number') return v;
    if (v === undefined || v === null) return NaN;
    const s = String(v).trim();
    if (s === '') return NaN;
    const normalized = s.replace(/\./g, '').replace(',', '.');
    const num = Number(normalized);
    return isNaN(num) ? NaN : num;
}

function formatPercentFrom(part, total) {
    const p = parseNumberFlexible(part);
    const t = parseNumberFlexible(total);
    if (isNaN(p) || isNaN(t) || t <= 0) return null;
    return getPerc(p, t).toFixed(2).replace('.', ',');
}

// Fallback: find header index/key by relaxed patterns
function findHeaderKey(headers, patterns) {
    if (!headers || !headers.length) return null;
    const lowHeaders = headers.map(h => (h || '').toString().toLowerCase());
    for (const pat of patterns) {
        for (let i = 0; i < lowHeaders.length; i++) {
            if (!lowHeaders[i]) continue;
            if (lowHeaders[i].indexOf(pat) !== -1) return headers[i];
        }
    }
    return null;
}

// Render a small debug panel showing header->mapped keys and the processed `dados` object.
// ... debug panel removed

// ========================
// GERAÇÃO DOS BLOCOS
// ========================
function gerarBloco1(dados) {
    // Dados municipais, estaduais e nacionais
    const munName = dados['CRAS'] || 'N/A';
    const municipio = dados['Municipio'] || 'N/A';
    const total_cad_mun = dados['fam-cadunico_mun'] || 0;
    const total_cad_estado = dados['fam-cadunico_estado'] || 0;
    const total_cad_br = dados['fam-cadunico_br'] || 0;

    const cad_des_mun = dados['cadunico-desatualizado_mun'] || 0;
    const cad_des_estado = dados['cadunico-desatualizado_estado'] || 0;
    const cad_des_br = dados['cadunico-desatualizado_br'] || 0;

    const cad_0a6_mun = dados['fam-0a6-desatualizadas_mun'] || 0;
    const cad_0a6_estado = dados['fam-0a6-desatualizadas_estado'] || 0;
    const cad_0a6_br = dados['fam-0a6-desatualizadas_nacional'] || 0;

    const pobreza_pre_mun = dados['fam-em-pobreza-antes-pbf_mun'] || 0;
    const pobreza_pre_estado = dados['fam-em-pobreza-antes-pbf_estado'] || 0;
    const pobreza_pre_br = dados['fam-em-pobreza-antes-pbf_br'] || 0;

    const pobreza_pos_mun = dados['fam-pobreza-pos-pbf_mun'] || 0;
    const pobreza_pos_estado = dados['fam-pobreza-pos-pbf_estado'] || 0;
    const pobreza_pos_br = dados['fam-pobreza-pos-pbf_br'] || 0;

    const pi_pobreza_mun = dados['fam-primeira-infancia-e-pobreza_mun'] || 0;
    const pi_pobreza_estado = dados['fam-primeira-infancia-e-pobreza_estado'] || 0;
    const pi_pobreza_br = dados['fam-primeira-infancia-e-pobreza_br'] || 0;

    const fam_0a6_mun = dados['fam-0a6_mun'] || 0;
    const fam_0a6_estado = dados['fam-0a6_estado'] || 0;
    const fam_0a6_br = dados['fam-0a6_br'] || 0;

    const cri_0a3 = dados['pessoas-0a3_mun'] || 0;
    const cri_4a6 = dados['pessoas-4a6_mun'] || 0;
    const total_criancas = Number(cri_0a3) + Number(cri_4a6);

    const fam_rural_0a6 = dados['fam-primeira-infancia-e-area-rural_mun'] || 0;

    // Cálculo das porcentagens
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
    const perc_fam_rural_0a6 = getPerc(fam_rural_0a6, fam_0a6_mun);

    // Montagem do texto de interpretação
    let texto = "**Perfil do território e indicadores sociais**\n\n";
    
    texto += `O território do **${munName}** está localizado no município de **${municipio}**, que possui **${formatNumber(total_cad_mun)}** famílias inscritas no Cadastro Único — representando ${formatPercentFrom(total_cad_mun, total_cad_estado)}% do total estadual e ${formatPercentFrom(total_cad_mun, total_cad_br)}% do total nacional.\n\n`;
    
    texto += `Em relação à atualização cadastral, observa-se que **${formatPercent(perc_cad_des_mun)}%** das famílias estão com cadastros desatualizados, percentual que se mantém próximo à média estadual (${formatPercent(perc_cad_des_estado)}%) e abaixo da nacional (${formatPercent(perc_cad_des_br)}%). No entanto, quando analisamos especificamente as famílias com crianças de 0 a 6 anos, a taxa de desatualização aumenta para **${formatPercent(perc_0a6_des_mun)}%**, superando significativamente a média estadual (${formatPercent(perc_0a6_des_estado)}%) e aproximando-se da nacional (${formatPercent(perc_0a6_des_br)}%).\n\n`;
    
    texto += `O impacto do Programa Bolsa Família (PBF) é notável no território. Antes do benefício, **${formatPercent(perc_pobreza_pre_mun)}%** das famílias encontravam-se em situação de pobreza, índice inferior à média estadual (${formatPercent(perc_pobreza_pre_estado)}%) mas superior à nacional (${formatPercent(perc_pobreza_pre_br)}%). Após o recebimento do benefício, esta taxa reduziu para **${formatPercent(perc_pobreza_pos_mun)}%**, embora ainda permaneça acima das médias estadual (${formatPercent(perc_pobreza_pos_estado)}%) e nacional (${formatPercent(perc_pobreza_pos_br)}%).\n\n`;
    
    texto += `Um dado preocupante é que **${formatPercent(perc_pi_pobreza_mun)}%** das famílias com crianças na primeira infância permanecem em situação de pobreza, percentual consideravelmente superior tanto à média estadual (${formatPercent(perc_pi_pobreza_estado)}%) quanto à nacional (${formatPercent(perc_pi_pobreza_br)}%).\n\n`;
    
    texto += `O território conta atualmente com **${formatNumber(fam_0a6_mun)}** famílias com crianças de 0 a 6 anos, representando ${formatPercent(perc_fam_0a6_mun)}% do total de famílias cadastradas. Nestas famílias, encontram-se **${formatNumber(total_criancas)}** crianças, distribuídas entre **${formatNumber(cri_0a3)}** crianças de 0 a 3 anos e **${formatNumber(cri_4a6)}** de 4 a 6 anos.\n\n`;
    
    if (fam_rural_0a6 > 0) {
        texto += `Um aspecto territorial relevante é a presença de **${formatNumber(fam_rural_0a6)}** famílias com crianças pequenas em áreas rurais, correspondendo a **${formatPercent(perc_fam_rural_0a6)}%** do total. Esta característica demanda estratégias específicas de atendimento e acesso a serviços, considerando as particularidades destes territórios.\n\n`;
    }

    return texto;
}

function gerarBloco2(dados) {
    // Dados básicos
    const totalFamilias = dados["n_familias_cadunico_mun"] || 0;
    const totalFam0a6 = dados["fam-0a6_mun"] || 0;

    // Indicadores de vulnerabilidade
    const trabalhoInfantil = dados["fam_trabalho_infantil_mun"] || 0;
    const trabalhoInfantilReferenciada = dados["fam_trabalho_infantil_referenciada_no_CRAS_anual"] || 0;
    const pcdCuidados = dados["fam-0a6-pcd-cuidados_mun"] || 0;
    const fam0a6SemOcupado = dados["fam-0a6-sem-ocupado_mun"] || 0;
    const fam0a6SemLer = dados["fam-0a6-sem-ler_mun"] || 0;
    const famSemOcupado = dados["fam-sem-ocupado_mun"] || 0;
    const famGPTE0a6 = dados["fam-gpte-0a6_mun"] || 0;
    const fam0a6Desatualizadas = dados["fam-0a6-desatualizadas_mun"] || 0;

    let texto = `**Bloco 2. Vulnerabilidades e riscos sociais para crianças pequenas**\n\n`;

    texto += `Este bloco reúne dados que revelam **riscos acumulados e vulnerabilidades estruturais** nas famílias com crianças de 0 a 6 anos, o que impacta diretamente suas oportunidades de desenvolvimento.\n\n`;

    // 2.1 Trabalho Infantil
    texto += `**2.1 Trabalho Infantil**\n\n`;
    if (trabalhoInfantil > 0 && totalFamilias > 0) {
        const percTI = (trabalhoInfantil / totalFamilias * 100).toFixed(2);
        texto += `No município, **${formatNumber(trabalhoInfantil)} famílias estão em situação de trabalho infantil**, o que representa cerca de **${percTI}% do total cadastrado**. Esse dado exige atenção redobrada à atuação articulada entre assistência social, educação e o sistema de garantias.\n\n`;

        if (trabalhoInfantilReferenciada > 0) {
            texto += `Entre essas, **${formatNumber(trabalhoInfantilReferenciada)} foram referenciadas ao CRAS ao longo do ano**, apontando para o potencial (e também o limite) da atuação da Proteção Social Básica nesse enfrentamento.\n\n`;
        }
    } else {
        texto += `Não há dados disponíveis sobre trabalho infantil para este município.\n\n`;
    }

    // 2.2 Acesso ao Trabalho e Ocupação
    texto += `**2.2 Acesso ao Trabalho e Ocupação**\n\n`;
    if (fam0a6SemOcupado > 0 && totalFam0a6 > 0) {
        const percSemOcupado = (fam0a6SemOcupado / totalFam0a6 * 100).toFixed(2);
        texto += `Cerca de **${formatNumber(fam0a6SemOcupado)} famílias com crianças de 0 a 6 anos não possuem nenhum integrante ocupado**, o que representa **${percSemOcupado}% dessa população** e pode indicar situações de extrema vulnerabilidade socioeconômica.\n\n`;
    }
    if (famSemOcupado > 0 && totalFamilias > 0) {
        const percGeralSemOcupado = (famSemOcupado / totalFamilias * 100).toFixed(2);
        texto += `Em termos gerais, **${formatNumber(famSemOcupado)} famílias cadastradas no município não possuem integrantes ocupados**, cerca de **${percGeralSemOcupado}% do total**, reforçando o cenário de vulnerabilidade socioeconômica ampliada.\n\n`;
    }
    if ((fam0a6SemOcupado === 0 || !totalFam0a6) && (famSemOcupado === 0 || !totalFamilias)) {
        texto += `Não há dados disponíveis sobre acesso ao trabalho e ocupação para este município.\n\n`;
    }

    // 2.3 Alfabetização
    texto += `**2.3 Alfabetização**\n\n`;
    if (fam0a6SemLer > 0 && totalFam0a6 > 0) {
        const percSemLer = (fam0a6SemLer / totalFam0a6 * 100).toFixed(2);
        texto += `**${formatNumber(fam0a6SemLer)} famílias não contam com nenhum membro alfabetizado**, o que corresponde a **${percSemLer}% das famílias com crianças pequenas** — uma barreira significativa à promoção de estímulos cognitivos no ambiente familiar.\n\n`;
    } else {
        texto += `Não há dados disponíveis sobre alfabetização para este município.\n\n`;
    }

    // 2.4 Grupos Populacionais Tradicionais e Específicos (GPTE)
    texto += `**2.4 Grupos Populacionais Tradicionais e Específicos (GPTE)**\n\n`;
    if (famGPTE0a6 > 0 && totalFam0a6 > 0) {
        const percGPTE = (famGPTE0a6 / totalFam0a6 * 100).toFixed(2);
        texto += `O dado de **${formatNumber(famGPTE0a6)} famílias com crianças de 0 a 6 anos em territórios de Grupos Populacionais Tradicionais e Específicos (GPTE)** representa **${percGPTE}% das famílias com crianças pequenas**, exigindo respostas territorializadas e culturalmente sensíveis.\n\n`;
    } else {
        texto += `Não há dados disponíveis sobre GPTE para este município.\n\n`;
    }

    // 2.5 Situação do Cadastro Único
    texto += `**2.5 Situação do Cadastro Único**\n\n`;
    if (fam0a6Desatualizadas > 0 && totalFam0a6 > 0) {
        const percDesatualizadas = (fam0a6Desatualizadas / totalFam0a6 * 100).toFixed(2);
        texto += `**${formatNumber(fam0a6Desatualizadas)} famílias com crianças de 0 a 6 anos estão com o cadastro desatualizado**, o que representa **${percDesatualizadas}% dessa população** e pode comprometer seu acesso a benefícios e serviços prioritários.\n\n`;
    } else {
        texto += `Não há dados disponíveis sobre desatualização do Cadastro Único para este município.\n\n`;
    }

    // 2.6 Crianças com Deficiência e Necessidade de Cuidados
    texto += `**2.6 Crianças com Deficiência e Necessidade de Cuidados**\n\n`;
    if (pcdCuidados > 0 && totalFam0a6 > 0) {
        const percPCD = (pcdCuidados / totalFam0a6 * 100).toFixed(2);
        texto += `Há **${formatNumber(pcdCuidados)} famílias com crianças pequenas com deficiência que demandam cuidados permanentes**, representando **${percPCD}% do total de famílias com crianças de 0 a 6 anos** — um grupo prioritário do Trabalho Social com Famílias e Territórios no PAIF e/ou acompanhamento pelos Serviços Complementares, que demanda atenção integral e estratégias específicas de apoio.\n\n`;
    } else {
        texto += `Não há dados disponíveis sobre crianças com deficiência e necessidade de cuidados para este município.\n\n`;
    }

    return texto;
}

// ========================
// BLOCO 3 – Acesso à educação infantil e condicionalidades educacionais do PBF
// ========================
function gerarBloco3(dados) {
    const totalFam0a6 = dados["fam-0a6_mun"] || 0;
    const foraEscola0a6 = dados["fam-0a6-fora-escola_mun"] || 0;
    const foraEscola4a6 = dados["fam-4a6-fora-escola_mun"] || 0;
    const foraEscola7a17 = dados["fam-7a17-fora-escola_mun"] || 0;
    const famCom4a6ForaEscola = dados["fam-com-4-a-6-fora-da-escola"] || 0;
    const baixaFrequencia4a6 = dados["nao_frequencia_4a6"] || 0;

    let texto = `**Bloco 3. Acesso à Educação e condicionalidades educacionais do PBF**\n\n`;

    texto += `O direito à educação e à aprendizagem precoce **são condicionalidades de educação do PBF** e um dos pilares para o desenvolvimento integral das crianças. Este bloco apresenta dados que evidenciam desafios importantes no acesso e na permanência escolar de crianças pequenas e de suas famílias, com implicações diretas sobre suas trajetórias educacionais e sociais.\n\n`;

    if (foraEscola0a6 > 0 && totalFam0a6 > 0) {
        const perc0a6 = formatPercent(foraEscola0a6 / totalFam0a6);
        texto += `Em **${formatNumber(foraEscola0a6)} famílias**, ao menos uma criança de 0 a 6 anos está fora da escola, o que representa **${perc0a6}% das famílias com crianças pequenas no município**. A ausência de vínculo escolar nessa faixa etária compromete oportunidades de socialização e desenvolvimento.\n\n`;
    }

    if (foraEscola4a6 > 0 && totalFam0a6 > 0) {
        const perc4a6 = formatPercent(foraEscola4a6 / totalFam0a6);
        texto += `Entre as crianças de 4 a 6 anos, cuja matrícula é obrigatória, **${formatNumber(foraEscola4a6)} famílias** relataram crianças fora da escola — cerca de **${perc4a6}% do total de famílias com crianças pequenas**. Essa situação demanda ação imediata de busca ativa.\n\n`;
    }

    if (baixaFrequencia4a6 > 0 && totalFam0a6 > 0) {
        const percFreq = formatPercent(baixaFrequencia4a6 / totalFam0a6);
        texto += `Mesmo entre matriculadas, a **baixa frequência escolar** é relevante: **${formatNumber(baixaFrequencia4a6)} famílias** com crianças de 4 a 6 anos apresentam frequência irregular, cerca de **${percFreq}%**. A irregularidade compromete aprendizagem e deve ser monitorada.\n\n`;
    }

    if (foraEscola7a17 > 0) {
        texto += `Além da primeira infância, **${formatNumber(foraEscola7a17)} famílias** têm crianças ou adolescentes de 7 a 17 anos fora da escola, indicando continuidade de trajetórias de exclusão escolar.\n\n`;
    }

    if (famCom4a6ForaEscola > 0) {
        texto += `Um dado crítico: **${formatNumber(famCom4a6ForaEscola)} famílias** possuem crianças de 4 a 6 anos fora da escola — um grupo que é prioritário nas estratégias de matrícula e retenção escolar.\n\n`;
    }

    return texto;
}

// ========================
// BLOCO 4 – Acesso à saúde e condicionalidades do PBF
// ========================
function gerarBloco4(dados) {
    const totalFamPBF0a6 = dados["fam_pbf_0a6"] || 0;

    const semAcompanhamentoNutricional = dados["nao_acomp_nutricional_0a7"] || 0;
    const semVacinacao = dados["nao_vacinacao_0a7"] || 0;
    const semPreNatalAdequado = dados["nao_prenatal_adequad"] || 0;

    let texto = `**Bloco 4. Acesso aos Serviços de Saúde e Condicionalidades de Saúde**\n\n`;

    texto += `Este bloco apresenta dados sobre o cumprimento das **condicionalidades de saúde do PBF**, com foco nas famílias com crianças de 0 a 6 anos. O não cumprimento dessas condicionalidades pode indicar barreiras de acesso aos serviços básicos de saúde e comprometer o desenvolvimento infantil, especialmente entre a população mais vulnerável.\n\n`;

    if (semAcompanhamentoNutricional > 0) {
        if (totalFamPBF0a6 > 0) {
            const percNutri = formatPercentFrom(semAcompanhamentoNutricional, totalFamPBF0a6);
            texto += `No município, **${formatNumber(semAcompanhamentoNutricional)} famílias com crianças de 0 a 6 anos beneficiárias do PBF não realizaram o acompanhamento nutricional**, o que representa **${percNutri}% do total de beneficiárias com crianças pequenas**. Isso pode sinalizar falhas no acesso ou no monitoramento territorial da atenção básica à saúde.\n\n`;
        } else {
            texto += `No município, **${formatNumber(semAcompanhamentoNutricional)} famílias com crianças de 0 a 6 anos beneficiárias do PBF não realizaram o acompanhamento nutricional**. (Total de famílias PBF com crianças pequenas ausente nos dados, portanto não foi possível calcular percentual.)\n\n`;
        }
    }

    if (semVacinacao > 0) {
        if (totalFamPBF0a6 > 0) {
            const percVacina = formatPercentFrom(semVacinacao, totalFamPBF0a6);
            texto += `Além disso, **${formatNumber(semVacinacao)} famílias com crianças pequenas beneficiárias do PBF não cumpriram a condicionalidade de vacinação**, o que equivale a **${percVacina}% do total desse público**. A imunização em atraso ou não realizada exige ação intersetorial urgente entre saúde, assistência social e escolas.\n\n`;
        } else {
            texto += `Além disso, **${formatNumber(semVacinacao)} famílias com crianças pequenas beneficiárias do PBF não cumpriram a condicionalidade de vacinação**. (Total de famílias PBF com crianças pequenas ausente nos dados, portanto não foi possível calcular percentual.)\n\n`;
        }
    }

    if (semPreNatalAdequado > 0) {
        texto += `Em relação às gestantes, **${formatNumber(semPreNatalAdequado)} famílias relataram ausência de pré-natal adequado**, descumprindo também condicionalidade de saúde essencial para o bem-estar materno-infantil.\n\n`;
    }

    return texto;
}

// ========================
// BLOCO 5 – Violações de direitos e proteção
// ========================
function gerarBloco5(dados) {
    const violFisica = dados["viol_fisica_0a9"] || 0;
    const violPsico = dados["viol_psicologica_0a9"] || 0;
    const violSexual = dados["viol_sexual_0a9"] || 0;
    const negligencia = dados["neglig_abandono_0a9"] || 0;
    const acolhimento = dados["acolhimento_0a17_mun"] || 0;

    let texto = `**Bloco 5. Violações de direitos e proteção**\n\n`;

    texto += `Este bloco evidencia a presença de **violações graves de direitos de crianças e adolescentes**, sobretudo na primeira infância. Os dados reforçam a urgência de uma **resposta intersetorial articulada** entre os sistemas de assistência social, saúde, educação, segurança pública e justiça. Além disso, apontam para a importância de estratégias preventivas e de apoio às famílias nos territórios.\n\n`;

    if (violFisica) {
        texto += `Foram registradas **${formatNumber(violFisica)} situações de violência física contra crianças de 0 a 9 anos**, revelando a urgência de ações de prevenção, proteção e responsabilização nos territórios afetados.\n\n`;
    }

    if (violPsico) {
        texto += `Também ocorreram **${formatNumber(violPsico)} casos de violência psicológica**, forma muitas vezes invisibilizada, mas com impactos profundos no desenvolvimento emocional e relacional das crianças.\n\n`;
    }

    if (violSexual) {
        texto += `A gravidade se acentua com os **${formatNumber(violSexual)} registros de violência sexual** contra crianças de até 9 anos — um dado alarmante que exige resposta imediata dos órgãos de proteção, com prioridade absoluta na escuta protegida e encaminhamento adequado.\n\n`;
    }

    if (negligencia) {
        texto += `Além disso, **${formatNumber(negligencia)} ocorrências de negligência ou abandono** foram notificadas, indicando rupturas na capacidade protetiva das famílias e demandando intervenções coordenadas do CRAS, Conselho Tutelar e rede de apoio local.\n\n`;
    }

    if (acolhimento) {
        texto += `Por fim, o município contabilizou **${formatNumber(acolhimento)} crianças e adolescentes em situação de acolhimento institucional ou familiar**, reflexo das violações anteriores e da ausência de alternativas de cuidado e suporte adequadas no território.\n\n`;
    }

    return texto;
}

// ========================
// BLOCO FINAL – ALERTAS E PRIORIDADES
// ========================
function gerarBlocoAlertas(dados) {
    const alertsCritico = [];
    const alertsAtencao = [];
    const alertsMonitoramento = [];

    const fam0a6 = parseNumberFlexible(dados["fam-0a6_mun"]);
    const fam0a6Desat = parseNumberFlexible(dados["fam-0a6-desatualizadas_mun"]);
    const nFamCad = parseNumberFlexible(dados["n_familias_cadunico_mun"]);

    // avoid division by zero
    const safePct = (num, den) => {
        const n = parseNumberFlexible(num);
        const d = parseNumberFlexible(den);
        if (isNaN(n) || isNaN(d) || d === 0) return 0;
        return (n / d) * 100;
    };

    // 🔴 CRÍTICO
    // Cadastro desatualizado
    const percDesatualizadas = safePct(fam0a6Desat, fam0a6);
    if (percDesatualizadas >= 30) {
        alertsCritico.push(`🔴 **Cadastro desatualizado:** Mais de 30% das famílias com crianças pequenas estão com o Cadastro Único desatualizado (${percDesatualizadas.toFixed(2)}%). É fundamental intensificar a busca ativa e mutirões de atualização para garantir o acesso a benefícios e serviços.`);
    }

    // Trabalho infantil
    const percTI = safePct(dados["fam_trabalho_infantil_mun"], nFamCad);
    if (percTI >= 3) {
        alertsCritico.push(`🔴 **Trabalho infantil:** ${formatNumber(dados["fam_trabalho_infantil_mun"])} famílias estão em situação de trabalho infantil (${percTI.toFixed(2)}%). O CRAS deve priorizar abordagens intersetoriais com foco em proteção e reintegração escolar.`);
    }

    // Violência
    const totalViolencia = ["viol_fisica_0a9", "viol_psicologica_0a9", "viol_sexual_0a9", "neglig_abandono_0a9"].reduce((sum, key) => sum + (parseNumberFlexible(dados[key]) || 0), 0);
    if (totalViolencia >= 5) {
        alertsCritico.push(`🔴 **Violações de direitos:** Foram registrados ${formatNumber(totalViolencia)} casos graves de violência contra crianças. É urgente o fortalecimento dos fluxos com o Conselho Tutelar e a rede de proteção.`);
    }

    // Risco socioeconômico elevado
    const percSemEmprego = safePct(dados["fam-0a6-sem-ocupado_mun"], fam0a6);
    if (percSemEmprego >= 40) {
        alertsCritico.push(`🔴 **Risco socioeconômico elevado:** ${percSemEmprego.toFixed(2)}% das famílias com crianças pequenas não possuem nenhum integrante ocupado. Priorizar ações de inclusão produtiva e proteção social.`);
    }

    // 🟠 ATENÇÃO
    // Frequência escolar e acesso à educação
    const percForaEscola = safePct(dados["fam-4a6-fora-escola_mun"], fam0a6);
    if (percForaEscola >= 5) {
        alertsAtencao.push(`🟠 **Frequência escolar:** ${percForaEscola.toFixed(2)}% das famílias com crianças de 4 a 6 anos estão fora da escola. Recomenda-se articulação imediata com a rede de educação para identificar causas e encaminhar soluções.`);
    }

    // Condicionalidades de saúde
    const percSemAcompNutri = safePct(dados["nao_acomp_nutricional_0a7"], dados["fam_pbf_0a6"]);
    if (percSemAcompNutri >= 25) {
        alertsAtencao.push(`🟠 **Condicionalidade de nutrição:** ${percSemAcompNutri.toFixed(2)}% das famílias com crianças pequenas beneficiárias do PBF estão sem acompanhamento nutricional registrado. CRAS e Saúde devem alinhar estratégias para garantir essa cobertura.`);
    }

    const percSemVacina = safePct(dados["nao_vacinacao_0a7"], dados["fam_pbf_0a6"]);
    if (percSemVacina >= 20) {
        alertsAtencao.push(`🟠 **Vacinação incompleta:** ${percSemVacina.toFixed(2)}% das famílias com crianças pequenas no PBF apresentam atraso vacinal. Reforçar o acompanhamento conjunto com a Atenção Básica.`);
    }

    // Baixa alfabetização
    const percSemLer = safePct(dados["fam-0a6-sem-ler_mun"], fam0a6);
    if (percSemLer >= 15) {
        alertsAtencao.push(`🟠 **Baixa alfabetização:** ${percSemLer.toFixed(2)}% das famílias com crianças pequenas não possuem nenhum membro alfabetizado. Recomenda-se articulação com programas de alfabetização e educação de jovens e adultos.`);
    }

    // 🟡 MONITORAMENTO
    // GPTE
    const percGPTE = safePct(dados["fam-gpte-0a6_mun"], fam0a6);
    if (percGPTE >= 20) {
        alertsMonitoramento.push(`🟡 **Grupos Populacionais Tradicionais e Específicos (GPTE):** ${percGPTE.toFixed(2)}% das famílias com crianças pequenas vivem em territórios GPTE. O planejamento do CRAS deve priorizar esses territórios com estratégias específicas.`);
    }

    // Área rural
    const percRural = safePct(dados["fam-primeira-infancia-e-area-rural_mun"], fam0a6);
    if (percRural >= 25) {
        alertsMonitoramento.push(`🟡 **Área rural:** ${percRural.toFixed(2)}% das famílias com crianças pequenas vivem em áreas rurais. Estratégias de atendimento devem considerar as especificidades territoriais e de acesso a serviços.`);
    }

    // Crianças com deficiência
    const percPCD = safePct(dados["fam-0a6-pcd-cuidados_mun"], fam0a6);
    if (percPCD >= 5) {
        alertsMonitoramento.push(`🟡 **Crianças com deficiência:** ${percPCD.toFixed(2)}% das famílias com crianças pequenas possuem crianças com deficiência que demandam cuidados. Garantir acesso prioritário aos serviços e acompanhamento especializado.`);
    }

    // Generate final text
    let texto = `**🔎 Bloco Final – Alertas e Prioridades para Ação Intersetorial**\n\n`;
    texto += `A seguir, apresentamos os principais alertas identificados com base nos dados do município. Eles representam **sinais de alerta para o planejamento territorial do CRAS**, indicando pontos críticos que demandam atenção imediata ou monitoramento contínuo.\n\n`;

    // Legenda
    texto += `**📊 Legenda de Criticidade:**\n\n`;
    texto += `🔴 **Crítico:** Situações que demandam ação imediata e articulação prioritária\n`;
    texto += `🟠 **Atenção:** Situações que requerem intervenção em curto prazo\n`;
    texto += `🟡 **Monitoramento:** Situações que exigem acompanhamento contínuo\n`;
    texto += `✅ **Estável:** Nenhum alerta identificado nos critérios estabelecidos\n\n`;
    texto += `---\n\n`;

    const totalAlertas = alertsCritico.length + alertsAtencao.length + alertsMonitoramento.length;

    if (totalAlertas === 0) {
        texto += `✅ **Status: Estável**\n\n`;
        texto += `Não foram identificados alertas críticos com os dados disponíveis. Ainda assim, recomenda-se manter o monitoramento ativo e revisar os protocolos de acompanhamento das famílias com crianças pequenas.\n\n`;
    } else {
        // Resumo quantitativo
        texto += `**📈 Resumo de Alertas Identificados:**\n\n`;
        if (alertsCritico.length > 0) {
            texto += `🔴 Crítico: ${alertsCritico.length} alerta(s)\n`;
        }
        if (alertsAtencao.length > 0) {
            texto += `🟠 Atenção: ${alertsAtencao.length} alerta(s)\n`;
        }
        if (alertsMonitoramento.length > 0) {
            texto += `🟡 Monitoramento: ${alertsMonitoramento.length} alerta(s)\n`;
        }
        texto += `\n**Total: ${totalAlertas} alerta(s)**\n\n`;
        texto += `---\n\n`;

        // Alertas críticos
        if (alertsCritico.length > 0) {
            texto += `**🔴 ALERTAS CRÍTICOS** (${alertsCritico.length})\n\n`;
            alertsCritico.forEach((alert) => {
                texto += `${alert}\n\n`;
            });
            texto += `---\n\n`;
        }

        // Alertas de atenção
        if (alertsAtencao.length > 0) {
            texto += `**🟠 ALERTAS DE ATENÇÃO** (${alertsAtencao.length})\n\n`;
            alertsAtencao.forEach((alert) => {
                texto += `${alert}\n\n`;
            });
            texto += `---\n\n`;
        }

        // Alertas de monitoramento
        if (alertsMonitoramento.length > 0) {
            texto += `**🟡 ALERTAS DE MONITORAMENTO** (${alertsMonitoramento.length})\n\n`;
            alertsMonitoramento.forEach((alert) => {
                texto += `${alert}\n\n`;
            });
            texto += `---\n\n`;
        }

        // Resumo final
        texto += `**💡 Considerações Finais**\n\n`;
        texto += `Este diagnóstico identificou **${totalAlertas} situação(ões)** que demandam atenção do CRAS e da rede intersetorial. `;
        if (alertsCritico.length > 0) {
            texto += `Especialmente os **${alertsCritico.length} alerta(s) crítico(s)** requerem ação imediata e coordenada. `;
        }
        texto += `Recomenda-se a elaboração de um plano de ação territorial que priorize essas famílias e articule respostas integradas entre assistência social, saúde, educação e demais políticas públicas.\n\n`;
    }

    return texto;
}

// =========================
// LEITURA DO ARQUIVO EXCEL
// =========================
document.getElementById('fileInput').addEventListener('change', async function (e) {
    clearErrors();
    
    const file = e.target.files[0];
    if (!file) {
        showError('Nenhum arquivo selecionado');
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
        try {
            console.log('Arquivo carregado, processando...');
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            if (!workbook.SheetNames.length) {
                throw new Error('Arquivo Excel vazio');
            }
            
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (!json || json.length < 2) {
                throw new Error('Arquivo Excel não tem dados suficientes');
            }

            const header = json[0];
            const values = json[1];

            if (!header || !values) {
                throw new Error('Formato Excel inválido - faltam cabeçalhos ou valores');
            }

            console.log('Processando dados...');
            console.log('Cabeçalhos:', header);
            console.log('Valores:', values);

            const dados = {};
            for (let i = 0; i < header.length; i++) {
                if (!header[i]) continue;
                const rawKey = String(header[i]).trim();
                const mapped = canonicalKeyFromHeader(rawKey);
                const key = mapped || rawKey;
                const value = values[i];

                // Preserve textual fields for CRAS and Municipio (mapped or raw)
                if (String(key).toLowerCase() === 'cras' || String(key).toLowerCase() === 'municipio') {
                    dados[key] = value !== undefined && value !== null ? String(value).trim() : 'N/A';
                    continue;
                }

                // Try to coerce numeric values. Accept comma as decimal separator.
                if (typeof value === 'number') {
                    dados[key] = value;
                } else if (value === undefined || value === null || String(value).trim() === '') {
                    dados[key] = 0;
                } else {
                    const normalized = String(value).replace(/\./g, '').replace(',', '.').trim();
                    const num = Number(normalized);
                    dados[key] = isNaN(num) ? 0 : num;
                }
            }
            // If fam_pbf_0a6 wasn't mapped, try a relaxed fallback search in headers
            if (!dados['fam_pbf_0a6']) {
                const fallbackKey = findHeaderKey(header, ['pbf', 'fam_pbf', 'familias pbf', 'total pbf', 'familias beneficiarias', 'pbf_0a6', 'pbf0a6', 'familias pbf 0a6', 'fam pbf']);
                if (fallbackKey) {
                    const idx = header.indexOf(fallbackKey);
                    const rawVal = values[idx];
                    const num = parseNumberFlexible(rawVal);
                    if (!isNaN(num)) dados['fam_pbf_0a6'] = num;
                }
            }

                    console.log('Dados processados:', dados);
                    // keep last parsed dados for report generation
                    window.__lastDados = dados;

            // Gerar e exibir os blocos
            const bloco1Element = document.getElementById('interpretacao-bloco-1');
            const bloco2Element = document.getElementById('interpretacao-bloco-2');
            const bloco3Element = document.getElementById('interpretacao-bloco-3');

            if (bloco1Element) {
                const textoBloco1 = gerarBloco1(dados);
                bloco1Element.innerHTML = textoBloco1
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\n/g, "<br>");
            }

            if (bloco2Element) {
                const textoBloco2 = gerarBloco2(dados);
                bloco2Element.innerHTML = textoBloco2
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\n/g, "<br>");
            }

            if (bloco3Element) {
                const textoBloco3 = gerarBloco3(dados);
                bloco3Element.innerHTML = textoBloco3
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\n/g, "<br>");
            }

            const bloco4Element = document.getElementById('interpretacao-bloco-4');
            if (bloco4Element) {
                const textoBloco4 = gerarBloco4(dados);
                bloco4Element.innerHTML = textoBloco4
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\n/g, "<br>");
            }

            const bloco5Element = document.getElementById('interpretacao-bloco-5');
            if (bloco5Element) {
                const textoBloco5 = gerarBloco5(dados);
                bloco5Element.innerHTML = textoBloco5
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\n/g, "<br>");
            }

            const blocoAlertasElement = document.getElementById('interpretacao-bloco-alertas');
            if (blocoAlertasElement) {
                const textoAlertas = gerarBlocoAlertas(dados);
                blocoAlertasElement.innerHTML = textoAlertas
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\n/g, "<br>");
            }


        } catch (error) {
            console.error('Erro ao processar arquivo:', error);
            showError(error.message);
        }
    };

    reader.onerror = function () {
        showError('Erro ao ler o arquivo');
    };

    try {
        reader.readAsArrayBuffer(file);
    } catch (error) {
        showError('Erro ao ler o arquivo: ' + error.message);
    }
});

// Generate a printable HTML report and open print dialog
function generatePrintableReport(dados) {
        if (!dados) {
                alert('Nenhum dado carregado. Por favor, carregue um arquivo Excel primeiro.');
                return;
        }

        const title = `Relatório - Diagnóstico da Primeira Infância`;
        const format = (s) => String(s === undefined || s === null ? '' : s);

        // Build HTML sections from current blocks
        const bloco1 = gerarBloco1(dados).replace(/\n/g, '<br>');
        const bloco2 = gerarBloco2(dados).replace(/\n/g, '<br>');
        const bloco3 = gerarBloco3(dados).replace(/\n/g, '<br>');
        const bloco4 = gerarBloco4(dados).replace(/\n/g, '<br>');
        const bloco5 = gerarBloco5(dados).replace(/\n/g, '<br>');
        const alertas = gerarBlocoAlertas(dados).replace(/\n/g, '<br>');

        const html = `
        <html>
        <head>
            <meta charset="utf-8">
            <title>${title}</title>
            <style>
                body{font-family:Arial, Helvetica, sans-serif;color:#222;padding:20px}
                h1{font-size:20px;margin-bottom:8px}
                h2{font-size:16px;margin-top:18px}
                .section{margin-bottom:12px}
                .muted{color:#555;font-size:13px}
            </style>
        </head>
        <body>
            <h1>${title}</h1>
            <div class="muted">Gerado em: ${new Date().toLocaleString()}</div>

            <div class="section"><h2>Bloco 1 – Perfil do território</h2>${bloco1}</div>
            <div class="section"><h2>Bloco 2 – Vulnerabilidades e riscos sociais</h2>${bloco2}</div>
            <div class="section"><h2>Bloco 3 – Acesso à Educação</h2>${bloco3}</div>
            <div class="section"><h2>Bloco 4 – Saúde e Condicionalidades</h2>${bloco4}</div>
            <div class="section"><h2>Bloco 5 – Violações de direitos</h2>${bloco5}</div>
            <div class="section"><h2>Bloco Final – Alertas e Prioridades</h2>${alertas}</div>

        </body>
        </html>`;

        const win = window.open('', '_blank');
        win.document.open();
        win.document.write(html);
        win.document.close();
        // give it a moment to render then print
        setTimeout(() => {
                try { win.print(); } catch (e) { console.warn('print failed', e); }
        }, 500);
}

// Wire print button
document.getElementById('btnPrint').addEventListener('click', () => {
        generatePrintableReport(window.__lastDados);
});








