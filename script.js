document.getElementById('fileInput').addEventListener('change', handleFile, false);

function handleFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet);

    if (json.length === 0) return;
    const row = json[0];

    const municipio = row["Municipio"] ?? "(município não identificado)";
    const cras = row["CRAS"] ?? "(CRAS não identificado)";
    const totalFam = row["fam-cadunico_mun"] ?? 0;
    const total0a6 = row["fam-0a6"] ?? 0;
    const totalGPTE = row["fam-gpte-0a6"] ?? 0;
    const totalRural = row["fam-rural"] ?? 0;
    const cadDesat = row["cadunico-desatualizado_br"] ?? 0;

    const p0a6 = totalFam > 0 ? (total0a6 / totalFam) * 100 : 0;
    const pGPTE = total0a6 > 0 ? (totalGPTE / total0a6) * 100 : 0;
    const pRural = total0a6 > 0 ? (totalRural / total0a6) * 100 : 0;
    const pDesat = totalFam > 0 ? (cadDesat / totalFam) * 100 : 0;

    let interpretacoes = [];

    interpretacoes.push(`<strong>${municipio} - ${cras}</strong>`);
    interpretacoes.push(`Famílias com crianças de 0 a 6 anos: <strong>${p0a6.toFixed(1)}%</strong>`);
    interpretacoes.push(`Famílias com 0 a 6 anos e GPTE: <strong>${pGPTE.toFixed(1)}%</strong>`);
    interpretacoes.push(`Famílias com 0 a 6 anos em área rural: <strong>${pRural.toFixed(1)}%</strong>`);
    interpretacoes.push(`Cadastro Único desatualizado: <strong>${pDesat.toFixed(1)}%</strong>`);

    document.getElementById('interpretacao-bloco-1').innerHTML =
      `<div class="resumo-dinamico">
        <h3>Resumo</h3>
        <ul><li>${interpretacoes.join('</li><li>')}</li></ul>
      </div>`;
  };

  reader.readAsArrayBuffer(file);
}
