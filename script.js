// =========================
// FUNÇÕES AUXILIARES GERAIS
// =========================
function getPerc(part, total) {
    return total > 0 ? (part / total) * 100 : 0;
}

function formatNumber(n) {
    if (typeof n !== 'number') {
        return '0';
    }
    return Math.round(n).toLocaleString('pt-BR');
}

function formatPercent(p) {
    if (typeof p !== 'number') {
        return '0,0';
    }
    return getPerc(p, 1).toFixed(1).replace(".", ",");
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
    
    texto += `O território do **${munName}** está localizado no município de **${municipio}**, que possui **${formatNumber(total_cad_mun)}** famílias inscritas no Cadastro Único — representando ${formatPercent(getPerc(total_cad_mun, total_cad_estado))}% do total estadual e ${formatPercent(getPerc(total_cad_mun, total_cad_br))}% do total nacional.\n\n`;
    
    texto += `Em relação à atualização cadastral, observa-se que **${formatPercent(perc_cad_des_mun)}%** das famílias estão com cadastros desatualizados, percentual que se mantém próximo à média estadual (${formatPercent(perc_cad_des_estado)}%) e abaixo da nacional (${formatPercent(perc_cad_des_br)}%). No entanto, quando analisamos especificamente as famílias com crianças de 0 a 6 anos, a taxa de desatualização aumenta para **${formatPercent(perc_0a6_des_mun)}%**, superando significativamente a média estadual (${formatPercent(perc_0a6_des_estado)}%) e aproximando-se da nacional (${formatPercent(perc_0a6_des_br)}%).\n\n`;
    
    texto += `O impacto do Programa Bolsa Família é notável no território. Antes do benefício, **${formatPercent(perc_pobreza_pre_mun)}%** das famílias encontravam-se em situação de pobreza, índice inferior à média estadual (${formatPercent(perc_pobreza_pre_estado)}%) mas superior à nacional (${formatPercent(perc_pobreza_pre_br)}%). Após o recebimento do benefício, esta taxa reduziu para **${formatPercent(perc_pobreza_pos_mun)}%**, embora ainda permaneça acima das médias estadual (${formatPercent(perc_pobreza_pos_estado)}%) e nacional (${formatPercent(perc_pobreza_pos_br)}%).\n\n`;
    
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

    if (trabalhoInfantil > 0 && totalFamilias > 0) {
        const percTI = (trabalhoInfantil / totalFamilias * 100).toFixed(2);
        texto += `No município, **${formatNumber(trabalhoInfantil)} famílias estão em situação de trabalho infantil**, o que representa cerca de **${percTI}% do total cadastrado**. Esse dado exige atenção redobrada à atuação articulada entre assistência social, educação e o sistema de garantias.\n\n`;

        if (trabalhoInfantilReferenciada > 0) {
            texto += `Entre essas, **${formatNumber(trabalhoInfantilReferenciada)} foram referenciadas ao CRAS ao longo do ano**, apontando para o potencial (e também o limite) da atuação da Proteção Social Básica nesse enfrentamento.\n\n`;
        }
    }

    if (pcdCuidados > 0 && totalFam0a6 > 0) {
        const percPCD = (pcdCuidados / totalFam0a6 * 100).toFixed(2);
        texto += `Há **${formatNumber(pcdCuidados)} famílias com crianças pequenas com deficiência que demandam cuidados permanentes**, representando **${percPCD}% do total de famílias com crianças de 0 a 6 anos** — um grupo que demanda atenção integral e estratégias específicas de apoio.\n\n`;
    }

    if (fam0a6SemOcupado > 0 && totalFam0a6 > 0) {
        const percSemOcupado = (fam0a6SemOcupado / totalFam0a6 * 100).toFixed(2);
        texto += `Cerca de **${formatNumber(fam0a6SemOcupado)} famílias com crianças de 0 a 6 anos não possuem nenhum integrante ocupado**, o que representa **${percSemOcupado}% dessa população** e pode indicar situações de extrema vulnerabilidade socioeconômica.\n\n`;
    }

    if (fam0a6SemLer > 0 && totalFam0a6 > 0) {
        const percSemLer = (fam0a6SemLer / totalFam0a6 * 100).toFixed(2);
        texto += `Além disso, **${formatNumber(fam0a6SemLer)} famílias não contam com nenhum membro alfabetizado**, o que corresponde a **${percSemLer}% das famílias com crianças pequenas** — uma barreira significativa à promoção de estímulos cognitivos no ambiente familiar.\n\n`;
    }

    if (famSemOcupado > 0 && totalFamilias > 0) {
        const percGeralSemOcupado = (famSemOcupado / totalFamilias * 100).toFixed(2);
        texto += `Em termos gerais, **${formatNumber(famSemOcupado)} famílias cadastradas no município não possuem integrantes ocupados**, cerca de **${percGeralSemOcupado}% do total**, reforçando o cenário de vulnerabilidade socioeconômica ampliada.\n\n`;
    }

    if (famGPTE0a6 > 0 && totalFam0a6 > 0) {
        const percGPTE = (famGPTE0a6 / totalFam0a6 * 100).toFixed(2);
        texto += `O dado de **${formatNumber(famGPTE0a6)} famílias com crianças de 0 a 6 anos em territórios com Grandes Problemas e Tradições Específicas (GPTE)** representa **${percGPTE}% das famílias com crianças pequenas**, exigindo respostas territorializadas e culturalmente sensíveis.\n\n`;
    }

    if (fam0a6Desatualizadas > 0 && totalFam0a6 > 0) {
        const percDesatualizadas = (fam0a6Desatualizadas / totalFam0a6 * 100).toFixed(2);
        texto += `Por fim, **${formatNumber(fam0a6Desatualizadas)} famílias com crianças de 0 a 6 anos estão com o cadastro desatualizado**, o que representa **${percDesatualizadas}% dessa população** e pode comprometer seu acesso a benefícios e serviços prioritários.\n\n`;
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
                if (header[i]) {
                    const value = values[i];
                    dados[header[i]] = typeof value === 'number' ? value : Number(value) || 0;
                }
            }

            console.log('Dados processados:', dados);

            // Gerar e exibir os blocos
            const bloco1Element = document.getElementById('interpretacao-bloco-1');
            const bloco2Element = document.getElementById('interpretacao-bloco-2');

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

