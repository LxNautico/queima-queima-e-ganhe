(() =>{
  const KEY = 'qqeBalanceStatsV1';
  const floorNames = { wood: '🪵 Madeira', glass: '💎 Vidro', rubber: '⬛ Borracha' };
  const empty = () => ({
    launches: 0, burns: 0, returnBurns: 0, hits100: 0, points: 0,
    chargeTotal: 0, charge100Total: 0, boostTotal: 0,
    timeTotal: 0, distanceTotal: 0, current100Streak: 0, best100Streak: 0
  });
  const load = () => {
    try { return { wood: empty(), glass: empty(), rubber: empty(), ...JSON.parse(localStorage.getItem(KEY) || '{}') }; }
    catch { return { wood: empty(), glass: empty(), rubber: empty() }; }
  };
  let stats = load();

  const panel = document.createElement('details');
  panel.id = 'balancePanel';
  panel.innerHTML = `
    <style>
      #balancePanel{margin-top:18px;padding:15px;border:3px solid #4f7484;border-radius:16px;background:#edf8f8;color:#253a4b;text-align:left}
      #balancePanel summary{cursor:pointer;font:700 1.2rem Georgia;color:#315564;user-select:none}
      #balancePanel>p{margin:8px 0;color:#55717c;font-size:.84rem}
      #balanceGrid{display:grid;grid-template-columns:repeat(3,minmax(190px,1fr));gap:10px;margin-top:12px}
      .balanceCard{padding:12px;border:1px solid #90b4bc;border-radius:12px;background:#fff}
      .balanceCard h3{margin:0 0 8px;font-size:1rem}
      .balanceCard dl{display:grid;grid-template-columns:1fr auto;gap:6px 10px;margin:0;font-size:.8rem}
      .balanceCard dt{color:#55717c}.balanceCard dd{margin:0;font-weight:bold;text-align:right}
      .accuracy100{color:#c53427!important;font-size:1rem}
      #clearBalance{margin-top:12px;padding:7px 10px;border:1px solid #688c98;border-radius:8px;background:#fff;color:#315564;cursor:pointer}
      @media(max-width:720px){#balanceGrid{grid-template-columns:1fr}.balanceCard dl{font-size:.86rem}}
    </style>
    <summary>📊 Laboratório de balanceamento</summary>
    <p>Estatísticas dos lançamentos feitos neste dispositivo. Use-as para comparar os três pisos.</p>
    <div id="balanceGrid"></div>
    <button id="clearBalance" type="button">Limpar estatísticas</button>`;
  const ranking = document.querySelector('#ranking');
  (ranking || document.querySelector('.game')).after(panel);
  const grid = panel.querySelector('#balanceGrid');

  const percent = (value, total) => total ? `${(value * 100 / total).toFixed(1).replace('.', ',')}%` : '—';
  const average = (value, total, suffix = '') => total ? `${(value / total).toFixed(1).replace('.', ',')}${suffix}` : '—';
  const render = () => {
    grid.replaceChildren(...Object.entries(floorNames).map(([floor, name]) => {
      const item = stats[floor] || empty();
      const card = document.createElement('article');
      card.className = 'balanceCard';
      card.innerHTML = `<h3>${name}</h3><dl>
        <dt>Lançamentos</dt><dd>${item.launches}</dd>
        <dt>Queimas válidas</dt><dd>${item.burns} · ${percent(item.burns, item.launches)}</dd>
        <dt>Retornos queimados</dt><dd>${item.returnBurns || 0} · ${percent(item.returnBurns || 0, item.launches)}</dd>
        <dt>Acertos na faixa 100</dt><dd>${item.hits100}</dd>
        <dt>Precisão geral em 100</dt><dd class="accuracy100">${percent(item.hits100, item.launches)}</dd>
        <dt>Precisão em 100 após queima</dt><dd>${percent(item.hits100, item.burns)}</dd>
        <dt>Melhor sequência em 100</dt><dd>x${item.best100Streak || 0}</dd>
        <dt>Força média</dt><dd>${average(item.chargeTotal, item.launches, '%')}</dd>
        <dt>Força média nos 100</dt><dd>${average(item.charge100Total, item.hits100, '%')}</dd>
        <dt>Impulso extra médio</dt><dd>${average(item.boostTotal, item.launches, '%')}</dd>
        <dt>Tempo médio</dt><dd>${average(item.timeTotal, item.launches, ' s')}</dd>
        <dt>Distância média</dt><dd>${average(item.distanceTotal, item.launches, ' cm')}</dd>
        <dt>Pontos acumulados</dt><dd>${item.points}</dd>
      </dl>`;
      return card;
    }));
  };
  render();

  let armed = false;
  let lastCharge = 0;
  let lastRecorded = '';
  let launchValues = [];
  let launchFloor = 'wood';
  const flick = document.querySelector('#flick');
  flick.addEventListener('pointerdown', () => {
    if (!flick.disabled) {
      armed = true;
      launchValues = [...(window.qqeGameState?.export?.().values || [])];
      launchFloor = document.querySelector('#board').className.match(/floor-(wood|glass|rubber)/)?.[1] || document.querySelector('#floor').value || 'wood';
    }
  }, true);
  window.addEventListener('pointerup', () => {
    if (!armed) return;
    lastCharge = Math.max(0, Math.min(100, parseFloat(document.querySelector('#fill')?.style.width) || 0));
  }, true);

  const parseMetric = (text, label) => {
    const match = text.match(new RegExp(`${label}:\\s*([\\d,.]+)`,'i'));
    return match ? Number(match[1].replace(',', '.')) || 0 : 0;
  };
  const record = () => {
    if (!armed) return;
    const precision = document.querySelector('#precision');
    const precisionText = precision.textContent.trim();
    if (!/^RETORNO:/i.test(precisionText) && !/RETORNO INVÁLIDO/i.test(precisionText)) return;
    const state = window.qqeGameState?.export?.() || {};
    const metricsText = document.querySelector('#metrics')?.textContent || '';
    const zone = Number(precisionText.match(/faixa\s+(\d+)/i)?.[1]) || 0;
    const rawBand = zone ? Number(launchValues[zone - 1]) || 0 : 0;
    const returnBurned = /QUEIMADO/i.test(precisionText);
    const reachedWall = returnBurned || !/INVÁLIDO/i.test(precisionText);
    const validBurn = reachedWall && !returnBurned;
    const hit100 = validBurn && rawBand === 100;
    const points = Number(precisionText.match(/—\s*(\d+)\s+pontos/i)?.[1]) || 0;
    const floor = launchFloor;
    const eventKey = [floor, precisionText, document.querySelector('#turn').textContent, state.score].join('|');
    if (eventKey === lastRecorded) return;
    lastRecorded = eventKey;
    armed = false;

    const item = stats[floor] || empty();
    item.launches++;
    item.burns += validBurn ? 1 : 0;
    item.returnBurns = (item.returnBurns || 0) + (returnBurned ? 1 : 0);
    item.hits100 += hit100 ? 1 : 0;
    item.points += points;
    item.chargeTotal += lastCharge;
    item.boostTotal += floor === 'rubber' ? Number(document.querySelector('#boost')?.value) || 0 : 0;
    item.timeTotal += parseMetric(metricsText, 'Tempo');
    item.distanceTotal += parseMetric(metricsText, 'Distância');
    if (hit100) {
      item.charge100Total += lastCharge;
      item.current100Streak++;
      item.best100Streak = Math.max(item.best100Streak, item.current100Streak);
    } else item.current100Streak = 0;
    stats[floor] = item;
    localStorage.setItem(KEY, JSON.stringify(stats));
    render();
  };

  new MutationObserver(() => setTimeout(record, 0)).observe(document.querySelector('#precision'), {
    subtree: true, childList: true, characterData: true
  });
  panel.querySelector('#clearBalance').onclick = () => {
    if (!confirm('Apagar todas as estatísticas locais de balanceamento?')) return;
    stats = { wood: empty(), glass: empty(), rubber: empty() };
    localStorage.removeItem(KEY);
    render();
  };
})();

// Carrega a área de avaliações depois dos painéis de estatísticas.
if (!document.querySelector('script[data-qqe-community]')) {
  const communityScript = document.createElement('script');
  communityScript.src = 'community.js?v=20260909-1';
  communityScript.dataset.qqeCommunity = 'true';
  document.body.append(communityScript);
}

// Carrega o modo de progressão do Circuito Queima-Queima.
if (!document.querySelector('script[data-qqe-circuit]')) {
  const circuitScript = document.createElement('script');
  circuitScript.src = 'circuit.js?v=20260912-1';
  circuitScript.dataset.qqeCircuit = 'true';
  document.body.append(circuitScript);
}

// Carrega o rastro e a avaliação técnica de cada lançamento.
if (!document.querySelector('script[data-qqe-shot-feedback]')) {
  const feedbackScript = document.createElement('script');
  feedbackScript.src = 'shot-feedback.js?v=20260912-1';
  feedbackScript.dataset.qqeShotFeedback = 'true';
  document.body.append(feedbackScript);
}

// Carrega medalhas, brasas e recompensas cosméticas.
if (!document.querySelector('script[data-qqe-achievements]')) {
  const achievementScript = document.createElement('script');
  achievementScript.src = 'achievements.js?v=20260912-1';
  achievementScript.dataset.qqeAchievements = 'true';
  document.body.append(achievementScript);
}

// Carrega os adversários virtuais para partidas individuais.
if (!document.querySelector('script[data-qqe-rival]')) {
  const rivalScript = document.createElement('script');
  rivalScript.src = 'rival.js?v=20260912-1';
  rivalScript.dataset.qqeRival = 'true';
  document.body.append(rivalScript);
}

// Carrega rodadas surpresa nos modos individuais.
if (!document.querySelector('script[data-qqe-events]')) {
  const eventScript = document.createElement('script');
  eventScript.src = 'events.js?v=20260912-1';
  eventScript.dataset.qqeEvents = 'true';
  document.body.append(eventScript);
}

// Carrega o Técnico QQ, assistente local de dicas e ajuda.
if (!document.querySelector('script[data-qqe-coach]')) {
  const coachScript = document.createElement('script');
  coachScript.src = 'coach.js?v=20260912-1';
  coachScript.dataset.qqeCoach = 'true';
  document.body.append(coachScript);
}

// Identificação permanente da autoria do jogo e do repositório oficial.
(() => {
  const author = 'Alex Alexandre Guedes Ramos';
  const copyright = `Copyright © 2026 ${author}. Todos os direitos reservados.`;
  const setMeta = (name, content) => {
    let meta = document.head.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.append(meta);
    }
    meta.content = content;
  };
  setMeta('author', author);
  setMeta('copyright', copyright);
  if (document.querySelector('.creator-credit')) return;
  const credit = document.createElement('footer');
  credit.className = 'creator-credit';
  credit.innerHTML = `© 2026 ${author} · <a href="https://github.com/LxNautico" rel="author">LxNautico</a> · Todos os direitos reservados.`;
  Object.assign(credit.style, {
    margin: '24px 0 6px',
    textAlign: 'center',
    color: '#6c5140',
    fontSize: '.72rem'
  });
  const link = credit.querySelector('a');
  link.style.color = '#8b3b28';
  document.querySelector('main')?.append(credit);

  if (!document.querySelector('.hub-link')) {
    const hubLink = document.createElement('a');
    hubLink.className = 'hub-link';
    hubLink.href = './index.html';
    hubLink.textContent = '← Central dos Jogos';
    Object.assign(hubLink.style, {
      display: 'inline-block',
      marginBottom: '4px',
      color: '#fff0b7',
      fontSize: '.78rem',
      fontWeight: 'bold'
    });
    document.querySelector('main')?.prepend(hubLink);
  }
})();
