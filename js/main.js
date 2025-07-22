// main.js - Integração com Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://vqfohtlpdhkzcnyupofk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxZm9odGxwZGhremNueXVwb2ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NTQ4NDcsImV4cCI6MjA2NjAzMDg0N30.XwRRSSHKdRAq6Dh--8lC3V8jcBJLsz21G9vV-IDz6hE';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --------------------------------
// FORMULÁRIO DE ENTRADAS
// --------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const entradaForm = document.getElementById("entrada-form");
  if (entradaForm) {
    entradaForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const data = document.getElementById("data").value;
      const comanda = document.getElementById("comanda").value;
      const pagamento = document.getElementById("pagamento").value;
      const nomeCliente = document.getElementById("nome-cliente").value.trim();
      const telefoneCliente = document.getElementById("telefone-cliente").value.trim();
      const itensDOM = document.querySelectorAll(".card-item");

      if (itensDOM.length === 0) {
        alert("Adicione ao menos um item na comanda.");
        return;
      }

      const itens = [], quantidades = [], valores = [];
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
        nome_cliente: nomeCliente,
        telefone_cliente: telefoneCliente,
        itens,
        quantidades,
        valores,
        peso: pesoTotal,
        valor_total: parseFloat(valorTotal.toFixed(2))
      };

      const { error } = await supabase.from('registros').insert([payload]);

      if (error) {
        alert("Erro ao salvar os dados: " + error.message);
      } else {
        alert("Entrada salva com sucesso!");
        entradaForm.reset();
        document.getElementById("itens-container").innerHTML = "";
        entradaForm.classList.add("sucesso");
        setTimeout(() => entradaForm.classList.remove("sucesso"), 2000);
      }
    });
  }

  // --------------------------------
  // FORMULÁRIO DE DESPESAS
  // --------------------------------
  const despesasForm = document.getElementById("despesas-form");
  if (despesasForm) {
    despesasForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const payload = {
        tipo: "despesa",
        data: document.getElementById("data").value,
        descricao: document.getElementById("descricao").value,
        quantidade: document.getElementById("quantidade").value,
        valor_total: document.getElementById("valor").value,
        forma_pagamento: document.getElementById("pagamento-despesa").value
      };

      const { error } = await supabase.from('registros').insert([payload]);

      if (error) {
        alert("Erro ao salvar a despesa: " + error.message);
      } else {
        alert("Despesa salva com sucesso!");
        despesasForm.reset();
        despesasForm.classList.add("sucesso");
        setTimeout(() => despesasForm.classList.remove("sucesso"), 2000);
      }
    });
  }

  // --------------------------------
  // FORMULÁRIO DE NF
  // --------------------------------
  const nfForm = document.getElementById("nf-form");
  if (nfForm) {
    nfForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const payload = {
        tipo: "nf",
        data: document.getElementById("data").value,
        numero_nf: document.getElementById("numero_nf").value,
        nome_empresa: document.getElementById("empresa").value,
        valor_total: document.getElementById("valor").value,
        forma_pagamento: document.getElementById("pagamento").value
      };

      const { error } = await supabase.from('registros').insert([payload]);

      if (error) {
        alert("Erro ao salvar NF: " + error.message);
      } else {
        alert("Nota Fiscal registrada com sucesso!");
        nfForm.reset();
        nfForm.classList.add("sucesso");
        setTimeout(() => nfForm.classList.remove("sucesso"), 2000);
      }
    });
  }
});
