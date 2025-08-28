document.getElementById('fileInput').addEventListener('change', handleFile);

function handleFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    if (json.length === 0) {
      alert("Arquivo sem dados.");
      return;
    }

    analisarBloco1(json[0]);
  };
  reader.readAsArrayBuffer(file);
}

function analisarBloco1(row) {
  const output = document.getElementById('interpretacao-bloco-1');
  output.innerHTML = "";

  const formatPct = (num, den) => {
    if (den === 0 || isNaN(num) || isNaN(den)) return "0.00%";
    return `${((num / den) * 100).toFixed(2)}%`;
  };

  const formatNum = (val) => {
    const num = Number(val);
    return isNaN(num) ? "0" : num.toLocaleString("pt-BR");
  };

  const resumo = [];

  const municipio = row["Municipio"] || "Município desconhecido";
  const cras = row["CRAS"] || "CRAS não informado";

  const famCad = {
    mun: +row["fam-cadunico_mun"],
    estado: +row["fam-cadunico_estado"],
    br: +row["fam-cadunico_br"]
  };

  const cadDes = {
    mun: +row["cadunico-desatualizado_mun"],
    estado: +row["cadunico-desatualizado_estado"],
    br: +row["cadunico-desatualizado_br"]
  };

  const desat0a6 = {
    mun: +row["fam-0a6-desatualizadas_mun"],
    estado: +row["fam-0a6-desatualizadas_estado"],
    br: +row["fam-0a6-desatualizadas_nacional"]
  };

  const pobrezaAntes = {
    mun: +row["fam-em-pobreza-antes-pbf_mun"],
    estado: +row["fam-em-pobreza-antes-pbf_estado"],
    br: +row["fam-em-pobreza-antes-pbf_br"]
  };

  const pobrezaDepois = {
    mun: +row["fam-pobreza-pos-pbf_mun"],
    estado: +row["fam-pobreza-pos-pbf_estado"],
    br: +row["fam-pobreza-pos-pbf_br"]
  };

  const pobreza0a6 = {
    mun: +row["fam-primeira-infancia-e-pobreza_mun"],
    estado: +row["fam-primeira-infancia-e-pobreza_estado"],
    br: +row["fam-primeira-infancia-e-pobreza_br"]
  };

  const fam0a6 = {
    mun: +row["fam-0a6_mun"],
    estado: +row["fam-0a6_estado"],
    br: +row["fam-0a6_br"]
  };

  const pessoas03 = +row["pessoas-0a3_mun"];
  const pessoas46 = +row["pessoas-4a6_mun"];
  const totalCriancas = pessoas03 + pessoas46;

  const famRural0a6 = +row["fam-primeira-infancia-e-area-rural_mun"];
  const famRuralTotal = +row["fam-rural"];
  const pctRural0a6 = formatPct(famRural0a6, famRuralTotal);

  resumo.push(`<strong>${municipio} - ${cras}</strong>`);

  // Cadastro Único
  resumo.push(`Cadastro Único: ${formatNum(famCad.mun)} famílias registradas no município, comparado a ${formatNum(famCad.estado)} no estado e ${formatNum(famCad.br)} no Brasil.`);

  resumo.push(`Percentual de cadastros desatualizados: ${formatPct(cadDes.mun, famCad.mun)}, estado: ${formatPct(cadDes.estado, famCad.estado)}, Brasil: ${formatPct(cadDes.br, famCad.br)}.`);

  resumo.push(`Desatualização entre famílias com crianças de 0 a 6 anos: ${formatPct(desat0a6.mun, fam0a6.mun)}, estado: ${formatPct(desat0a6.estado, fam0a6.estado)}, Brasil: ${formatPct(desat0a6.br, fam0a6.br)}.`);

  // Pobreza
  resumo.push(`Pobreza antes do PBF: ${formatPct(pobrezaAntes.mun, famCad.mun)} no município, ${formatPct(pobrezaAntes.estado, famCad.estado)} no estado, ${formatPct(pobrezaAntes.br, famCad.br)} no Brasil.`);
  resumo.push(`Pobreza após o PBF: ${formatPct(pobrezaDepois.mun, famCad.mun)} no município, ${formatPct(pobrezaDepois.estado, famCad.estado)} no estado, ${formatPct(pobrezaDepois.br, famCad.br)} no Brasil.`);

  // Pobreza com crianças
  resumo.push(`Famílias com crianças pequenas em situação de pobreza: ${formatPct(pobreza0a6.mun, famCad.mun)}, estado: ${formatPct(pobreza0a6.estado, famCad.estado)}, Brasil: ${formatPct(pobreza0a6.br, famCad.br)}.`);

  // Primeira infância
  resumo.push(`Famílias com crianças de 0 a 6 anos: ${formatNum(fam0a6.mun)} no município (${formatNum(fam0a6.estado)} no estado, ${formatNum(fam0a6.br)} no país).`);
  resumo.push(`Total de crianças no Cadastro Único: ${formatNum(totalCriancas)} (0-3 anos: ${formatNum(pessoas03)}, 4-6 anos: ${formatNum(pessoas46)}).`);

  resumo.push(`Famílias com crianças de 0 a 6 anos em área rural: ${formatNum(famRural0a6)} (${pctRural0a6}).`);

  output.innerHTML = `<h3>Panorama Geral</h3><ul><li>${resumo.join("</li><li>")}</li></ul>`;
}
