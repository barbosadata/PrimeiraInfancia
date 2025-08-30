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
    const munName = dados['CRAS'] || 'N/A';
    const municipio = dados['Municipio'] || 'N/A';
    const total_cad_mun = dados['fam-cadunico_mun'] || 0;
    const cad_des_mun = dados['cadunico-desatualizado_mun'] || 0;
    const cad_0a6_mun = dados['fam-0a6-desatualizadas_mun'] || 0;
    const pobreza_pre_mun = dados['fam-em-pobreza-antes-pbf_mun'] || 0;
    const pobreza_pos_mun = dados['fam-pobreza-pos-pbf_mun'] || 0;
    const pi_pobreza_mun = dados['fam-primeira-infancia-e-pobreza_mun'] || 0;
    const fam_0a6_mun = dados['fam-0a6_mun'] || 0;
    const cri_0a3 = dados['pessoas-0a3_mun'] || 0;
    const cri_4a6 = dados['pessoas-4a6_mun'] || 0;
    const total_criancas = Number(cri_0a3) + Number(cri_4a6);
    const fam_rural_0a6 = dados['fam-primeira-infancia-e-area-rural_mun'] || 0;

    let texto = "";
    texto += `No território do **${munName}** em **${municipio}**, há **${formatNumber(total_criancas)} crianças** de 0 a 6 anos cadastradas, sendo **${formatNumber(cri_0a3)}** de 0 a 3 anos e **${formatNumber(cri_4a6)}** de 4 a 6 anos.\n\n`;
    texto += `Das **${formatNumber(total_cad_mun)} famílias** cadastradas no CadÚnico, **${formatNumber(fam_0a6_mun)} famílias** têm crianças na primeira infância (${formatPercent(fam_0a6_mun/total_cad_mun)}%).\n\n`;
    texto += `Existem **${formatNumber(cad_des_mun)} famílias** (${formatPercent(cad_des_mun/total_cad_mun)}%) com cadastro desatualizado, das quais **${formatNumber(cad_0a6_mun)}** têm crianças de 0 a 6 anos.\n\n`;
    texto += `Antes do Bolsa Família, **${formatNumber(pobreza_pre_mun)} famílias** (${formatPercent(pobreza_pre_mun/total_cad_mun)}%) estavam em situação de pobreza. Após o benefício, esse número caiu para **${formatNumber(pobreza_pos_mun)} famílias** (${formatPercent(pobreza_pos_mun/total_cad_mun)}%).\n\n`;
    texto += `Entre as famílias com crianças na primeira infância, **${formatNumber(pi_pobreza_mun)}** ainda permanecem em situação de pobreza mesmo após receberem o benefício.\n\n`;
    
    if (fam_rural_0a6 > 0) {
        texto += `**${formatNumber(fam_rural_0a6)} famílias** com crianças na primeira infância residem em área rural.\n`;
    }

    return texto;
}

function gerarBloco2(dados) {
    const munName = dados['CRAS'] || 'N/A';
    const fam_pi_mulher = dados['fam-primeira-infancia-e-responsavel-mulher_mun'] || 0;
    const fam_pi_jovem = dados['fam-primeira-infancia-e-responsavel-jovem_mun'] || 0;
    const fam_pi_idoso = dados['fam-primeira-infancia-e-responsavel-idoso_mun'] || 0;
    const fam_pi_analfabeto = dados['fam-primeira-infancia-e-responsavel-analfabeto_mun'] || 0;
    const fam_pi_deficiente = dados['fam-primeira-infancia-e-pcd_mun'] || 0;
    const fam_pi_total = dados['fam-0a6_mun'] || 0;

    let texto = "";
    texto += `No território do **${munName}**, entre as famílias com crianças na primeira infância:\n\n`;

    if (fam_pi_mulher > 0) {
        texto += `**${formatNumber(fam_pi_mulher)}** (${formatPercent(fam_pi_mulher/fam_pi_total)}%) são chefiadas por mulheres.\n\n`;
    }

    if (fam_pi_jovem > 0) {
        texto += `**${formatNumber(fam_pi_jovem)}** (${formatPercent(fam_pi_jovem/fam_pi_total)}%) têm responsáveis jovens (até 24 anos).\n\n`;
    }

    if (fam_pi_idoso > 0) {
        texto += `**${formatNumber(fam_pi_idoso)}** (${formatPercent(fam_pi_idoso/fam_pi_total)}%) têm responsáveis idosos (60 anos ou mais).\n\n`;
    }

    if (fam_pi_analfabeto > 0) {
        texto += `**${formatNumber(fam_pi_analfabeto)}** (${formatPercent(fam_pi_analfabeto/fam_pi_total)}%) têm responsáveis que não sabem ler/escrever.\n\n`;
    }

    if (fam_pi_deficiente > 0) {
        texto += `**${formatNumber(fam_pi_deficiente)}** (${formatPercent(fam_pi_deficiente/fam_pi_total)}%) têm pessoas com deficiência.\n`;
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
