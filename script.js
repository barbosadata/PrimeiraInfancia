document.getElementById('fileInput').addEventListener('change', handleFile, false);

function handleFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    // Considera a primeira planilha
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const json = XLSX.utils.sheet_to_json(sheet);

    console.log("Dados carregados:", json);

    document.getElementById('output').innerHTML = `
      <p><strong>Arquivo carregado com sucesso.</strong> Total de registros: ${json.length}</p>
      <pre>${JSON.stringify(json[0], null, 2)}</pre>
    `;
  };

  reader.readAsArrayBuffer(file);
}