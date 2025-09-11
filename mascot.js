function showMascotGreeting() {
  const mascot = document.createElement('div');
  mascot.innerHTML = `
    <div style="font-size: 2em; margin: 20px;">
      🧸 Olá! Eu sou <strong>Tico</strong>, o ursinho explorador!
      <br>Vamos brincar e aprender juntos no Alegrakids!
    </div>
  `;
  document.body.insertBefore(mascot, document.body.firstChild);

  const balao = document.createElement('div');
  balao.id = 'tico-balao';
  balao.style = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: #F8BBD0;
    padding: 15px;
    border-radius: 15px;
    font-size: 1.2em;
    max-width: 300px;
    display: none;
    box-shadow: 2px 2px 10px rgba(0,0,0,0.2);
  `;
  document.body.appendChild(balao);
}

function falarComTico(mensagem) {
  const balao = document.getElementById('tico-balao');
  if (!balao) return;
  balao.innerText = `🧸 Tico diz: ${mensagem}`;
  balao.style.display = 'block';
  setTimeout(() => balao.style.display = 'none', 4000);
}
