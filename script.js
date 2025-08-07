document.addEventListener("DOMContentLoaded", async () => {
  const jogosContainer = document.getElementById("jogos");
  const boletimContainer = document.getElementById("boletim");
  const finalizarBtn = document.getElementById("finalizar-aposta");
  let apostas = [];

  async function carregarJogos() {
    try {
      const resposta = await fetch("/api/jogos");
      const jogos = await resposta.json();
      jogosContainer.innerHTML = "";

      for (const jogo of jogos) {
        const fixtureId = jogo.fixture.id;
        const home = jogo.teams.home.name;
        const away = jogo.teams.away.name;
        const hora = new Date(jogo.fixture.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const odds = await buscarOdds(fixtureId);
        if (!odds) continue;

        const div = document.createElement("div");
        div.className = "jogo";
        div.innerHTML = `
          <strong>${home} vs ${away}</strong> - ${hora}<br/>
          <button class="odd-btn" data-jogo="${home} vs ${away}" data-odd="${odds.home}">${home} (${odds.home})</button>
          <button class="odd-btn" data-jogo="${home} vs ${away}" data-odd="${odds.draw}">Empate (${odds.draw})</button>
          <button class="odd-btn" data-jogo="${home} vs ${away}" data-odd="${odds.away}">${away} (${odds.away})</button>
        `;
        jogosContainer.appendChild(div);
      }

      document.querySelectorAll(".odd-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const jogo = btn.getAttribute("data-jogo");
          const odd = parseFloat(btn.getAttribute("data-odd"));
          apostas.push({ jogo, odd });
          atualizarBoletim();
        });
      });

    } catch (erro) {
      jogosContainer.innerHTML = "<p>Erro ao carregar jogos.</p>";
    }
  }

  async function buscarOdds(fixtureId) {
    try {
      const resposta = await fetch(`/api/odds/${fixtureId}`);
      const dados = await resposta.json();

      const mercado = dados[0]?.bookmakers[0]?.bets.find(m => m.name === "Match Winner");
      if (!mercado) return null;

      const [home, draw, away] = mercado.values;
      return {
        home: parseFloat(home.odd),
        draw: parseFloat(draw.odd),
        away: parseFloat(away.odd)
      };
    } catch (erro) {
      return null;
    }
  }

  function atualizarBoletim() {
    boletimContainer.innerHTML = "";
    let total = 1;

    apostas.forEach((aposta, i) => {
      const div = document.createElement("div");
      div.textContent = `${aposta.jogo} - Odd: ${aposta.odd}`;
      boletimContainer.appendChild(div);
      total *= aposta.odd;
    });

    const valorInput = document.createElement("input");
    valorInput.type = "number";
    valorInput.placeholder = "Valor da aposta";
    valorInput.id = "valor-aposta";
    boletimContainer.appendChild(valorInput);

    const retorno = document.createElement("div");
    retorno.id = "retorno";
    boletimContainer.appendChild(retorno);

    valorInput.addEventListener("input", () => {
      const valor = parseFloat(valorInput.value);
      if (!isNaN(valor)) {
        retorno.textContent = `Possível retorno: R$ ${(valor * total).toFixed(2)}`;
      } else {
        retorno.textContent = "";
      }
    });

    finalizarBtn.style.display = "block";
  }

  finalizarBtn.addEventListener("click", () => {
    alert("Aposta finalizada! Código gerado: " + Math.floor(Math.random() * 1000000));
    apostas = [];
    boletimContainer.innerHTML = "";
    finalizarBtn.style.display = "none";
  });

  // Inicia carregamento
  carregarJogos();
});
