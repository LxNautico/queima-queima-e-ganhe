(() => {
  const STORAGE_KEY = 'qqeTutorialConcluidoV1';
  const steps = [
    {
      target: '#springBay',
      icon: '🌀',
      title: 'Prepare o impulso',
      text: 'A mola é a força do seu peteleco. Quanto mais você carregar, mais energia ela entrega à peça.'
    },
    {
      target: '#flick',
      icon: '👆',
      title: 'Segure e solte',
      text: 'Pressione e segure o botão para carregar. Solte no momento desejado para lançar a peça.'
    },
    {
      target: '.finish',
      icon: '🔥',
      title: 'Primeiro, queime',
      text: 'A jogada só pontua depois que a peça toca o fim iluminado do tabuleiro. Esse toque é a queima.'
    },
    {
      target: '#slots',
      icon: '🎯',
      title: 'Pontue no retorno',
      text: 'A força de volta decide o resultado. Vale a pontuação da faixa onde a peça finalmente parar.'
    },
    {
      target: '#floorControls',
      icon: '🏁',
      title: 'Domine cada piso',
      text: 'Madeira é equilibrada, vidro é mais sensível e borracha exige mais impulso. Agora é sua vez de ganhar!'
    }
  ];

  const style = document.createElement('style');
  style.textContent = `
    #tutorialHelp{margin:0 0 12px 7px;border:1px solid #c89143;border-radius:8px;padding:6px 10px;background:#fff6d9;color:#553a28;font-weight:bold}
    #tutorialOverlay{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:18px;background:rgba(10,20,29,.76);backdrop-filter:blur(2px)}
    #tutorialOverlay[hidden]{display:none}
    #tutorialCard{position:relative;z-index:1010;width:min(440px,100%);padding:24px;border:4px solid #c89143;border-radius:20px;background:#fff6d9;color:#38271d;box-shadow:0 20px 60px #0009;text-align:center}
    #tutorialIcon{display:block;font-size:2.5rem;margin-bottom:5px}
    #tutorialCard h2{margin:0 0 10px;font:700 1.55rem Georgia;color:#70351f}
    #tutorialCard p{min-height:4.2em;margin:0 auto 16px;line-height:1.45}
    #tutorialProgress{display:flex;justify-content:center;gap:7px;margin-bottom:17px}
    #tutorialProgress i{width:9px;height:9px;border-radius:50%;background:#d8c59e}
    #tutorialProgress i.active{background:#e6502a;transform:scale(1.25)}
    #tutorialActions{display:flex;justify-content:center;gap:8px;flex-wrap:wrap}
    #tutorialActions button{padding:9px 14px;border:0;border-radius:9px;background:#253a4b;color:#fff;font-weight:bold}
    #tutorialActions #tutorialNext{background:#e6502a}
    #tutorialActions #tutorialSkip{background:transparent;color:#6c5140;text-decoration:underline}
    .tutorial-focus{position:relative!important;z-index:1005!important;outline:5px solid #ffcf4a!important;outline-offset:5px;box-shadow:0 0 0 10px rgba(230,80,42,.34),0 0 28px #ffcf4a!important;pointer-events:none!important}
    body.tutorial-open{overflow:hidden}
    @media(max-width:600px){#tutorialCard{padding:19px 15px}#tutorialCard p{min-height:5.5em}.tutorial-focus{outline-width:3px!important;outline-offset:2px}}
  `;
  document.head.append(style);

  const help = document.createElement('button');
  help.id = 'tutorialHelp';
  help.type = 'button';
  help.textContent = '❔ Como jogar';
  document.querySelector('#soundToggle').after(help);

  const overlay = document.createElement('div');
  overlay.id = 'tutorialOverlay';
  overlay.hidden = true;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'tutorialTitle');
  overlay.innerHTML = `
    <section id="tutorialCard">
      <span id="tutorialIcon" aria-hidden="true"></span>
      <h2 id="tutorialTitle"></h2>
      <p id="tutorialText"></p>
      <div id="tutorialProgress" aria-label="Progresso do tutorial"></div>
      <div id="tutorialActions">
        <button id="tutorialBack" type="button">Anterior</button>
        <button id="tutorialNext" type="button">Próximo</button>
        <button id="tutorialSkip" type="button">Pular tutorial</button>
      </div>
    </section>`;
  document.body.append(overlay);

  const icon = overlay.querySelector('#tutorialIcon');
  const title = overlay.querySelector('#tutorialTitle');
  const text = overlay.querySelector('#tutorialText');
  const progress = overlay.querySelector('#tutorialProgress');
  const back = overlay.querySelector('#tutorialBack');
  const next = overlay.querySelector('#tutorialNext');
  const skip = overlay.querySelector('#tutorialSkip');
  let current = 0;
  let highlighted = null;

  const clearHighlight = () => {
    highlighted?.classList.remove('tutorial-focus');
    highlighted = null;
  };

  const render = () => {
    clearHighlight();
    const step = steps[current];
    icon.textContent = step.icon;
    title.textContent = step.title;
    text.textContent = step.text;
    back.hidden = current === 0;
    next.textContent = current === steps.length - 1 ? 'Começar a jogar' : 'Próximo';
    progress.replaceChildren(...steps.map((_, index) => {
      const dot = document.createElement('i');
      if (index === current) dot.className = 'active';
      return dot;
    }));
    highlighted = document.querySelector(step.target);
    highlighted?.classList.add('tutorial-focus');
    next.focus();
  };

  const open = () => {
    current = 0;
    overlay.hidden = false;
    document.body.classList.add('tutorial-open');
    render();
  };

  const close = () => {
    clearHighlight();
    overlay.hidden = true;
    document.body.classList.remove('tutorial-open');
    localStorage.setItem(STORAGE_KEY, '1');
    help.focus();
  };

  back.onclick = () => { if (current > 0) { current--; render(); } };
  next.onclick = () => { if (current < steps.length - 1) { current++; render(); } else close(); };
  skip.onclick = close;
  help.onclick = open;
  document.addEventListener('keydown', event => {
    if (overlay.hidden) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowRight') next.click();
    if (event.key === 'ArrowLeft' && current > 0) back.click();
  });

  if (!localStorage.getItem(STORAGE_KEY)) setTimeout(open, 450);
})();
