let jogosData = [];
let apostas = [];

fetch("api_jogos.json")
  .then((res) => res.json())
  .then((data) => {
    jogosData = data;
    renderizarJogos(jogosData);
  });

function renderizarJogos(lista) {
  const container = document.getElementById("jogos");
  container.innerHTML = "";

  lista.forEach((jogo) => {
    const jogoDiv = document.createElement("div");
    jogoDiv.className = "jogo";

    const title = document.createElement("h3");
    title.innerText = `${jogo.timeA} vs ${jogo.timeB}`;
    jogoDiv.appendChild(title);

    const info = document.createElement("p");
    info.innerText = `${jogo.liga} - ${jogo.data}`;
    jogoDiv.appendChild(info);

    const oddsContainer = document.createElement("div");
    oddsContainer.className = "odds";

    jogo.odds.forEach((odd) => {
      const oddBtn = document.createElement("div");
      oddBtn.className = "odd";
      oddBtn.innerText = `${odd.nome} - ${odd.valor}`;
      oddBtn.dataset.odd = odd.valor;
      oddBtn.dataset.jogo = `${jogo.timeA} vs ${jogo.timeB}`;
      oddBtn.dataset.tipo = odd.nome;

      oddBtn.addEventListener("click", () => {
        oddBtn.classList.toggle("selected");
        const selected = oddBtn.classList.contains("selected");

        if (selected) {
          apostas.push({
            jogo: oddBtn.dataset.jogo,
            tipo: oddBtn.dataset.tipo,
            odd: parseFloat(oddBtn.dataset.odd),
          });
        } else {
          apostas = apostas.filter(
            (a) =>
              !(
                a.jogo === oddBtn.dataset.jogo &&
                a.tipo === oddBtn.dataset.tipo
              )
          );
        }

        atualizarBoletim();
      });

      oddsContainer.appendChild(oddBtn);
    });

    jogoDiv.appendChild(oddsContainer);
    container.appendChild(jogoDiv);
  });
}

document.getElementById("filtroData").addEventListener("change", aplicarFiltros);
document.getElementById("filtroLiga").addEventListener("change", aplicarFiltros);

function aplicarFiltros() {
  const dataSelecionada = document.getElementById("filtroData").value;
  const ligaSelecionada = document.getElementById("filtroLiga").value;

  const filtrados = jogosData.filter((jogo) => {
    const matchData = !dataSelecionada || jogo.data === dataSelecionada;
    const matchLiga = !ligaSelecionada || jogo.liga === ligaSelecionada;
    return matchData && matchLiga;
  });

  renderizarJogos(filtrados);
}

function atualizarBoletim() {
  const apostasDiv = document.getElementById("apostasSelecionadas");
  const totalOdds = document.getElementById("totalOdds");
  const retorno = document.getElementById("retorno");
  const valorInput = document.getElementById("valorAposta");

  apostasDiv.innerHTML = "";

  apostas.forEach((aposta) => {
    const div = document.createElement("div");
    div.innerText = `${aposta.jogo} - ${aposta.tipo} @ ${aposta.odd}`;
    apostasDiv.appendChild(div);
  });

  const total = apostas.reduce((acc, a) => acc * a.odd, 1);
  totalOdds.innerText = total.toFixed(2);

  const valor = parseFloat(valorInput.value) || 0;
  retorno.innerText = `R$ ${(valor * total).toFixed(2)}`;
}

document.getElementById("valorAposta").addEventListener("input", atualizarBoletim);

function finalizarAposta() {
  if (apostas.length === 0) {
    alert("Selecione ao menos uma odd!");
    return;
  }

  document.getElementById("modalPagamento").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modalPagamento").style.display = "none";
}

function pagarPix() {
  alert("Pagamento via Pix gerado (simulação).");
  fecharModal();
}

function gerarCodigo() {
  const codigo = Math.floor(Math.random() * 1000000);
  alert(`Código para pagamento manual: #${codigo}`);
  fecharModal();
}
