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

    const row = json[0]; // Considera apenas a primeira linha
    const totalFam = row["fam-cadunico"];
    const total0a6 = row["fam-0a6"];
    const totalPessoas = row["pessoas-total"];

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

    // Preenchimento dos valores absolutos
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
    setValue("valor-fam-7a15-trabalho-infantil", row["fam-7a15-trabalho-infantil"]);

    // Cálculo de percentuais
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

    const percTrabalhoInfantil = setPercent("perc-fam-7a15-trabalho-infantil", row["fam-7a15-trabalho-infantil"], totalFam);
    setSinal("sinal-trabalho-infantil", percTrabalhoInfantil, { red: 10, yellow: 5 });
  };

  reader.readAsArrayBuffer(file);
}
