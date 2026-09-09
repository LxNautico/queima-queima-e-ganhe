(() => {
  const board = document.querySelector('#board');
  const puck = document.querySelector('#puck');
  const precision = document.querySelector('#precision');
  const status = document.querySelector('#status');
  if (!board || !puck || !precision || !status) return;

  const style = document.createElement('style');
  style.textContent = `
    #fxLayer{position:fixed;inset:0;z-index:900;overflow:hidden;pointer-events:none}
    .fx-particle{position:fixed;left:var(--x);top:var(--y);width:var(--size);height:var(--size);display:grid;place-items:center;font-size:var(--size);line-height:1;animation:fxBurst var(--time) cubic-bezier(.12,.72,.3,1) forwards;filter:drop-shadow(0 2px 2px #0005)}
    .fx-confetti{border-radius:2px;background:var(--color);font-size:0;animation-name:fxConfetti}
    .fx-ring{position:fixed;left:var(--x);top:var(--y);width:20px;height:20px;border:5px solid #ffce45;border-radius:50%;transform:translate(-50%,-50%);animation:fxRing .7s ease-out forwards}
    #fxAnnouncement{position:fixed;z-index:905;left:50%;top:30%;transform:translate(-50%,-50%) scale(.7);padding:10px 18px;border:3px solid #fff1ae;border-radius:14px;background:linear-gradient(#f06a2c,#bf2d27);color:#fff7de;font:900 clamp(1.15rem,4vw,2rem) Georgia;text-shadow:1px 2px #7d211c;box-shadow:0 8px 30px #0008;pointer-events:none;opacity:0}
    #fxAnnouncement.show{animation:fxAnnounce 1.25s ease both}
    #board.fx-impact{animation:fxImpact .32s ease}
    #board.fx-error{animation:fxError .32s ease}
    #puck.fx-glow{box-shadow:0 0 10px 5px #ffce45,0 0 28px 12px #ef4d2a!important}
    @keyframes fxBurst{0%{transform:translate(-50%,-50%) scale(.35);opacity:1}100%{transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) rotate(var(--spin)) scale(1.15);opacity:0}}
    @keyframes fxConfetti{0%{transform:translate(-50%,-50%) rotate(0);opacity:1}100%{transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) rotate(var(--spin));opacity:0}}
    @keyframes fxRing{to{width:130px;height:130px;opacity:0;border-width:1px}}
    @keyframes fxImpact{35%{transform:scale(1.012);filter:brightness(1.22)}70%{transform:scale(.997)}}
    @keyframes fxError{20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}}
    @keyframes fxAnnounce{0%{opacity:0;transform:translate(-50%,-50%) scale(.6)}18%,75%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-65%) scale(1.08)}}
    @media(prefers-reduced-motion:reduce){.fx-particle,.fx-ring,#fxAnnouncement.show,#board.fx-impact,#board.fx-error{animation-duration:.01ms!important}.fx-particle,.fx-ring{display:none}}
  `;
  document.head.append(style);

  const layer = document.createElement('div');
  layer.id = 'fxLayer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.append(layer);
  const announcement = document.createElement('div');
  announcement.id = 'fxAnnouncement';
  announcement.setAttribute('aria-live', 'polite');
  document.body.append(announcement);

  const center = () => {
    const rect = puck.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  };
  const vibrate = pattern => navigator.vibrate?.(pattern);
  const replayClass = (element, name, duration = 400) => {
    element.classList.remove(name);
    void element.offsetWidth;
    element.classList.add(name);
    setTimeout(() => element.classList.remove(name), duration);
  };
  const announce = message => {
    announcement.textContent = message;
    replayClass(announcement, 'show', 1300);
  };
  const burst = ({ symbols = ['✨'], count = 18, confetti = false, spread = 130 } = {}) => {
    const origin = center();
    for (let index = 0; index < count; index++) {
      const particle = document.createElement('i');
      const angle = (Math.PI * 2 * index / count) + Math.random() * .35;
      const distance = spread * (.45 + Math.random() * .75);
      particle.className = `fx-particle${confetti ? ' fx-confetti' : ''}`;
      if (!confetti) particle.textContent = symbols[index % symbols.length];
      particle.style.setProperty('--x', `${origin.x}px`);
      particle.style.setProperty('--y', `${origin.y}px`);
      particle.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
      particle.style.setProperty('--dy', `${Math.sin(angle) * distance + (confetti ? 90 : 0)}px`);
      particle.style.setProperty('--spin', `${Math.round(Math.random() * 720 - 360)}deg`);
      particle.style.setProperty('--size', `${confetti ? 7 + Math.random() * 7 : 15 + Math.random() * 12}px`);
      particle.style.setProperty('--time', `${650 + Math.random() * 450}ms`);
      particle.style.setProperty('--color', ['#ffca3a','#f05b35','#69bd65','#69c8e4','#fff3b0'][index % 5]);
      layer.append(particle);
      setTimeout(() => particle.remove(), 1200);
    }
  };
  const ring = () => {
    const origin = center();
    const item = document.createElement('i');
    item.className = 'fx-ring';
    item.style.setProperty('--x', `${origin.x}px`);
    item.style.setProperty('--y', `${origin.y}px`);
    layer.append(item);
    setTimeout(() => item.remove(), 750);
  };

  let lastEvent = '';
  const react = () => {
    if (document.body.classList.contains('tutorial-open')) return;
    const precisionText = precision.textContent.trim();
    const statusText = status.textContent.trim();
    const eventKey = `${precisionText}|${statusText}`;
    if (!precisionText || eventKey === lastEvent) return;
    lastEvent = eventKey;

    if (/RETORNO INVÁLIDO|não tocou|não chegou/i.test(`${precisionText} ${statusText}`)) {
      replayClass(board, 'fx-error');
      vibrate(35);
      return;
    }
    if (/COMBO x(\d+)/i.test(statusText)) {
      const combo = statusText.match(/COMBO x(\d+)/i)?.[1] || '2';
      burst({ symbols: ['🔥','⚡','✨'], count: 28, spread: 175 });
      replayClass(puck, 'fx-glow', 800);
      announce(`COMBO x${combo}!`);
      vibrate([45,35,70]);
      return;
    }
    if (precision.classList.contains('precision-burn') || /—\s*(100|200|300|400|500) pontos/i.test(precisionText)) {
      burst({ symbols: ['🔥','✨'], count: 22, spread: 150 });
      ring();
      replayClass(board, 'fx-impact');
      announce('QUEIMA!');
      vibrate([55,25,55]);
      return;
    }
    if (/RETORNO:/i.test(precisionText)) {
      burst({ symbols: ['✨'], count: 10, spread: 85 });
      ring();
      vibrate(25);
    }
  };

  let lastVictory = '';
  const victory = () => {
    const matchText = document.querySelector('#matchState')?.textContent || '';
    const text = `${matchText} ${status.textContent}`;
    if (!/Vencedor!|Duelo final:|Final:\s*\d+/i.test(text) || text === lastVictory) return;
    lastVictory = text;
    burst({ count: 55, confetti: true, spread: 280 });
    announce(/Vencedor!/i.test(text) ? '🏆 VITÓRIA!' : '🏁 PARTIDA CONCLUÍDA!');
    vibrate([80,45,80,45,140]);
  };

  new MutationObserver(() => { react(); victory(); }).observe(document.querySelector('.game'), {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['class', 'data-state']
  });
})();
