document.addEventListener("DOMContentLoaded", function () {
  const scriptURL = "https://script.google.com/macros/library/d/1M6ZM8DGifS75JeetBIvgURLTBDQZYVDNbsA7oVC2JQ71Y5s1C0CWenvw/1";

  // -------------------------
  // FORMULÁRIO DE ENTRADAS
  // -------------------------
  const entradaForm = document.getElementById("entrada-form");
  if (entradaForm) {
    entradaForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const data = document.getElementById("data").value;
      const comanda = document.getElementById("comanda").value;
      const pagamento = document.getElementById("pagamento").value;

      const itensDOM = document.querySelectorAll(".card-item");
      if (itensDOM.length === 0) {
        alert("Adicione ao menos um item na comanda.");
        return;
      }

      const itens = [];
      const quantidades = [];
      const valores = [];
      let pesoTotal = 0;
      let valorTotal = 0;
      let erro = false;

      itensDOM.forEach(item => {
        const nome = item.querySelector(".item-nome").value;
        const quantidade = item.querySelector(".item-quantidade")?.value || "";
        const peso = item.querySelector(".item-peso")?.value || "";
        const valor = item.querySelector(".item-valor").value;

        if (!nome || !valor || (nome === "KG" && !peso) || (nome !== "KG" && !quantidade)) {
          erro = true;
        }

        itens.push(nome);
        quantidades.push(nome === "KG" ? peso : quantidade);
        valores.push(valor);

        valorTotal += parseFloat(valor || 0);
        if (nome === "KG") {
          pesoTotal += parseFloat(peso || 0);
        }
      });

      if (erro) {
        alert("Preencha corretamente todos os campos de cada item.");
        return;
      }

      const payload = {
        tipo: "entrada",
        data: data,
        numero_comanda: comanda,
        forma_pagamento: pagamento,
        itens: itens,
        quantidades: quantidades,
        valores: valores,
        peso: pesoTotal,
        valor_total: valorTotal.toFixed(2)
      };

      console.log("Enviando entrada:", payload);

      fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(result => {
          if (result.status === "sucesso") {
            alert("Entrada salva com sucesso!");
            entradaForm.reset();
            document.getElementById("itens-container").innerHTML = "";

            // ✅ Feedback visual com borda verde temporária
            entradaForm.classList.add("sucesso");
            setTimeout(() => entradaForm.classList.remove("sucesso"), 2000);
          } else {
            alert("Erro: " + result.mensagem);
          }
        })
        .catch(error => {
          alert("Erro ao salvar os dados: " + error.message);
        });
    });
  }

  // -------------------------
  // FORMULÁRIO DE DESPESAS
  // -------------------------
  const despesasForm = document.getElementById("despesas-form");
  if (despesasForm) {
    despesasForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const payload = {
        tipo: "despesa",
        data: document.getElementById("data").value,
        descricao: document.getElementById("descricao").value,
        quantidade: document.getElementById("quantidade").value,
        valor_total: document.getElementById("valor").value,
        forma_pagamento: document.getElementById("pagamento-despesa").value
      };

      fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(result => {
          if (result.status === "sucesso") {
            alert("Despesa salva com sucesso!");
            despesasForm.reset();

            // Feedback visual com borda verde temporária
            despesasForm.classList.add("sucesso");
            setTimeout(() => despesasForm.classList.remove("sucesso"), 2000);
          } else {
            alert("Erro: " + result.mensagem);
          }
        })
        .catch(error => {
          alert("Erro ao salvar a despesa: " + error.message);
        });

    });
  }

  // -------------------------
  // FORMULÁRIO DE NOTAS FISCAIS
  // -------------------------
  const nfForm = document.getElementById("nf-form");
  if (nfForm) {
    nfForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const payload = {
        tipo: "nf",
        data: document.getElementById("data").value,
        numero_nf: document.getElementById("numero-nf").value,  // Corrigido
        nome_empresa: document.getElementById("empresa").value,
        valor_total: document.getElementById("valor").value,
        forma_pagamento: document.getElementById("pagamento").value  // Corrigido
      };


      fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(result => {
          if (result.status === "sucesso") {
            alert("Nota Fiscal registrada com sucesso!");
            nfForm.reset();

            // ✅ Feedback visual com borda verde temporária
            nfForm.classList.add("sucesso");
            setTimeout(() => nfForm.classList.remove("sucesso"), 2000);
          } else {
            alert("Erro: " + result.mensagem);
          }
        })
        .catch(error => {
          alert("Erro ao salvar NF: " + error.message);
        });
    });
  }
});
