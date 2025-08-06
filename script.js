let selecoes = [];

async function carregarJogos() {
  const res = await fetch('api_jogos.json');
  const jogos = await res.json();
  mostrarJogos(jogos);
}

function mostrarJogos(jogos) {
  const container = document.getElementById('jogos-container');
  container.innerHTML = '';
  jogos.forEach(jogo => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h3>${jogo.timeA} x ${jogo.timeB}</h3>
      <button onclick="selecionarOdd('${jogo.timeA}', ${jogo.odds[0]})">${jogo.odds[0]}</button>
      <button onclick="selecionarOdd('Empate', ${jogo.odds[1]})">${jogo.odds[1]}</button>
      <button onclick="selecionarOdd('${jogo.timeB}', ${jogo.odds[2]})">${jogo.odds[2]}</button>
    `;
    container.appendChild(div);
  });
}

function selecionarOdd(time, odd) {
  selecoes.push({ time, odd });
  atualizarBoletim();
}

function atualizarBoletim() {
  const ul = document.getElementById('selecoes');
  ul.innerHTML = '';
  selecoes.forEach(sel => {
    const li = document.createElement('li');
    li.textContent = `${sel.time} @ ${sel.odd}`;
    ul.appendChild(li);
  });
  atualizarRetorno();
}

function atualizarRetorno() {
  const valor = parseFloat(document.getElementById('valorAposta').value) || 0;
  const totalOdd = selecoes.reduce((acc, sel) => acc * sel.odd, 1);
  document.getElementById('retornoPotencial').textContent = (valor * totalOdd).toFixed(2);
}

function finalizarAposta() {
  alert('Aposta finalizada com sucesso! Escolha o método de pagamento.');
}

function filtrarDia(dia) {
  console.log("Filtrar por dia:", dia);
}

function filtrarEsporte(esporte) {
  console.log("Filtrar por esporte:", esporte);
}

carregarJogos();