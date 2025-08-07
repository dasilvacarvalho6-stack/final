
let jogosData = [];
let apostas = [];

fetch("api_jogos.json")
  .then((res) => res.json())
  .then((data) => {
    jogosData = data;
    renderizarJogos(jogosData);
    popularFiltros(jogosData);
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
      const oddBtn = document.createElement("button");
      oddBtn.className = "odd-btn";
      oddBtn.innerText = `${odd.tipo} - ${odd.valor}`;
      oddBtn.onclick = () => selecionarOdd(jogo, odd, oddBtn);
      oddsContainer.appendChild(oddBtn);
    });

    jogoDiv.appendChild(oddsContainer);
    container.appendChild(jogoDiv);
  });
}

function selecionarOdd(jogo, odd, btn) {
  apostas.push({ jogo, odd });
  atualizarBoletim();
  document.querySelectorAll(".odd-btn").forEach((b) => b.classList.remove("selected"));
  btn.classList.add("selected");
}

function atualizarBoletim() {
  const container = document.getElementById("boletim");
  container.innerHTML = "<h3>Boletim de Aposta</h3>";

  let totalOdd = 1;

  apostas.forEach(({ jogo, odd }) => {
    const item = document.createElement("div");
    item.className = "boletim-item";
    item.innerText = `${jogo.timeA} vs ${jogo.timeB} | ${odd.tipo} @ ${odd.valor}`;
    container.appendChild(item);
    totalOdd *= parseFloat(odd.valor);
  });

  const footer = document.createElement("div");
  footer.className = "boletim-footer";

  const input = document.createElement("input");
  input.type = "number";
  input.placeholder = "Valor da aposta";
  input.oninput = () => {
    const retorno = document.getElementById("retorno");
    const valor = parseFloat(input.value || 0);
    retorno.innerText = "Retorno: R$ " + (valor * totalOdd).toFixed(2);
  };

  const retorno = document.createElement("div");
  retorno.id = "retorno";
  retorno.innerText = "Retorno: R$ 0.00";

  const btn = document.createElement("button");
  btn.id = "finalizarBtn";
  btn.innerText = "Finalizar Aposta";
  btn.onclick = () => alert("Aposta finalizada!");

  footer.appendChild(input);
  footer.appendChild(retorno);
  footer.appendChild(btn);
  container.appendChild(footer);
}

function popularFiltros(lista) {
  const ligaSelect = document.getElementById("filtro-liga");
  const dataInput = document.getElementById("filtro-data");

  const ligas = [...new Set(lista.map((j) => j.liga))];
  ligas.forEach((liga) => {
    const option = document.createElement("option");
    option.value = liga;
    option.innerText = liga;
    ligaSelect.appendChild(option);
  });

  ligaSelect.onchange = () => filtrar();
  dataInput.onchange = () => filtrar();
}

function filtrar() {
  const liga = document.getElementById("filtro-liga").value;
  const data = document.getElementById("filtro-data").value;

  let filtrados = [...jogosData];

  if (liga) {
    filtrados = filtrados.filter((j) => j.liga === liga);
  }

  if (data) {
    filtrados = filtrados.filter((j) => j.data === data);
  }

  renderizarJogos(filtrados);
}
