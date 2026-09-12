(() => {
  const mode = document.querySelector('#mode');
  const game = document.querySelector('.game');
  const precision = document.querySelector('#precision');
  const flick = document.querySelector('#flick');
  if (!mode || !game || !precision || !flick) return;

  const option = document.createElement('option');
  option.value = 'circuit';
  option.textContent = 'Circuito Queima-Queima';
  mode.insertBefore(option, mode.firstElementChild);

  const panel = document.createElement('section');
  panel.id = 'circuitPanel';
  panel.hidden = true;
  panel.innerHTML = `
    <style>
      #circuitPanel{margin:10px 0 14px;padding:12px;border:2px solid #d37b2f;border-radius:13px;background:linear-gradient(135deg,#fff0b8,#ffd989);color:#50321f;text-align:left}
      #circuitPanel[hidden]{display:none}#circuitPanel header{display:flex;align-items:center;justify-content:space-between;gap:10px}
      #circuitPanel small{font-weight:900;letter-spacing:.1em;color:#a74628}#circuitPanel h2{margin:3px 0 0;font:700 1.15rem Georgia}
      #circuitProgress{height:8px;margin:9px 0;overflow:hidden;border-radius:20px;background:#b98a55}#circuitProgress i{display:block;height:100%;background:linear-gradient(90deg,#e44e2d,#ffbd35);transition:width .25s}
      #circuitObjective{margin:5px 0;font-weight:800}#circuitStatus{margin:4px 0 0;font-size:.82rem}
      #circuitAction{padding:8px 11px;border:0;border-radius:8px;background:#273d4b;color:#fff;font-weight:800}#circuitAction[hidden]{display:none}
      #circuitPanel.success{border-color:#4d9c62;background:linear-gradient(135deg,#e8f5c9,#bce29c)}#circuitPanel.failure{border-color:#b34836;background:linear-gradient(135deg,#ffe1c3,#f4b095)}
    </style>
    <header><div><small id="circuitStep">ETAPA 1 DE 10</small><h2>🔥 Circuito Queima-Queima</h2></div><button id="circuitAction" hidden></button></header>
    <div id="circuitProgress"><i></i></div><p id="circuitObjective"></p><p id="circuitStatus"></p>`;
  document.querySelector('.hud').before(panel);

  const missions = [
    { title:'Aquecimento', objective:'Faça pelo menos 150 pontos em até 5 lançamentos.', test:s=>s.score>=150, progress:s=>`${s.score}/150 pontos` },
    { title:'Explorador de faixas', objective:'Acerte duas faixas diferentes em retornos válidos.', test:s=>s.zones.size>=2, progress:s=>`${s.zones.size}/2 faixas diferentes` },
    { title:'Primeira grande queima', objective:'Pare uma vez na faixa de 100 pontos.', test:s=>s.hits100>=1, progress:s=>`${s.hits100}/1 acerto em 100` },
    { title:'Mão de vidro', objective:'No piso de vidro, consiga 120 pontos sem retorno queimado.', floor:'glass', test:s=>s.score>=120&&!s.startBurns, progress:s=>`${s.score}/120 pontos · ${s.startBurns} queimadas` },
    { title:'Regularidade', objective:'Faça três retornos válidos na mesma etapa.', test:s=>s.valid>=3, progress:s=>`${s.valid}/3 retornos válidos` },
    { title:'Na mosca', objective:'Cumpra o desafio indicado pelo tabuleiro.', test:s=>s.targets>=1, progress:s=>`${s.targets}/1 desafio cumprido` },
    { title:'Controle absoluto', objective:'Complete os 5 lançamentos sem nenhuma tentativa inválida.', endOnly:true, test:s=>s.shots>=5&&!s.invalid, progress:s=>`${s.shots}/5 lançamentos · ${s.invalid} inválidos` },
    { title:'Escalada', objective:'Faça três retornos válidos com pontuações crescentes.', test:s=>s.increasing>=3, progress:s=>`${s.increasing}/3 resultados crescentes` },
    { title:'Força na borracha', objective:'No piso de borracha, alcance 200 pontos.', floor:'rubber', test:s=>s.score>=200, progress:s=>`${s.score}/200 pontos` },
    { title:'Prova do Mestre', objective:'Acerte o 100 sem tocar a parede inicial.', test:s=>s.hits100>=1&&!s.startBurns, progress:s=>`${s.hits100}/1 acerto · ${s.startBurns} queimadas` }
  ];
  const KEY = 'qqeCircuitV1';
  const load = () => { try { return { stage:1,total:0,...JSON.parse(localStorage.getItem(KEY)||'{}')}; } catch { return {stage:1,total:0}; } };
  let career = load(), missionState, lastEvent = '', resolved = false;
  const step = panel.querySelector('#circuitStep'), objective = panel.querySelector('#circuitObjective'), message = panel.querySelector('#circuitStatus'), bar = panel.querySelector('#circuitProgress i'), action = panel.querySelector('#circuitAction');
  const freshMission = () => ({shots:0,score:0,zones:new Set(),valid:0,invalid:0,startBurns:0,hits100:0,targets:0,increasing:0,lastPoints:-1});

  function configureFloor(mission) {
    if (!mission.floor) return;
    document.querySelector('#difficulty').value = 'custom';
    document.querySelector('#floor').value = mission.floor;
    document.querySelector('#floor').dispatchEvent(new Event('change'));
  }
  function beginMission() {
    resolved = false; lastEvent = ''; missionState = freshMission(); panel.className = '';
    const index = Math.max(0, Math.min(9, career.stage - 1)), mission = missions[index];
    step.textContent = `ETAPA ${index + 1} DE ${missions.length} · ${mission.title}`;
    objective.textContent = mission.objective; message.textContent = mission.progress(missionState);
    bar.style.width = `${index / missions.length * 100}%`; action.hidden = true;
    configureFloor(mission);
  }
  function resolve(success) {
    if (resolved) return; resolved = true; flick.disabled = true;
    panel.className = success ? 'success' : 'failure';
    if (success) {
      career.total += missionState.score;
      if (career.stage >= missions.length) {
        message.textContent = `Circuito concluído! Pontuação acumulada: ${career.total.toLocaleString('pt-BR')}.`;
        action.textContent = 'Recomeçar circuito'; career.stage = 1; career.completed = (career.completed || 0) + 1;
      } else {
        message.textContent = `Etapa concluída! Total do circuito: ${career.total.toLocaleString('pt-BR')} pontos.`;
        action.textContent = 'Próxima etapa'; career.stage++;
      }
      bar.style.width = '100%';
    } else { message.textContent = 'Objetivo não alcançado em 5 lançamentos. Tente novamente.'; action.textContent = 'Repetir etapa'; }
    localStorage.setItem(KEY, JSON.stringify(career)); action.hidden = false;
  }
  function record() {
    if (mode.value !== 'circuit' || resolved) return;
    const text = precision.textContent.trim(), turn = document.querySelector('#turn').textContent, score = Number(document.querySelector('#score').textContent)||0;
    if (!/^RETORNO/i.test(text)) return;
    const key = `${text}|${turn}|${score}`; if (key === lastEvent) return; lastEvent = key;
    const shot=window.qqeLastShot||{},mission = missions[career.stage-1], valid = /^RETORNO:/i.test(text), startBurn = /QUEIMADO/i.test(text), points = Number(shot.rawPoints)||Number(text.match(/—\s*(\d+)\s+pontos/i)?.[1])||0, zone = Number(shot.zone)||Number(text.match(/faixa\s+(\d+)/i)?.[1])||0;
    missionState.shots++; missionState.score = score; missionState.invalid += valid ? 0 : 1; missionState.startBurns += startBurn ? 1 : 0;
    if (valid) { missionState.valid++; if(zone) missionState.zones.add(zone); if(points>missionState.lastPoints) missionState.increasing++; else missionState.increasing=1; missionState.lastPoints=points; }
    if (valid && points===100) missionState.hits100++;
    if (valid && (shot.hitChallenge||/DESAFIO CUMPRIDO/i.test(text))) missionState.targets++;
    message.textContent = mission.progress(missionState);
    const finished = /FINALIZADA|FINALIZADO/.test(flick.textContent) || missionState.shots >= 5;
    if (mission.test(missionState) && !mission.endOnly) resolve(true); else if (finished) resolve(mission.test(missionState));
  }
  action.onclick = () => { reset(); beginMission(); flick.disabled = false; };
  mode.addEventListener('change', () => { panel.hidden = mode.value !== 'circuit'; if (mode.value === 'circuit') beginMission(); });
  addEventListener('qqe-special-result',()=>{if(mode.value!=='circuit'||resolved)return;const mission=missions[career.stage-1];missionState.score=Number(document.querySelector('#score').textContent)||missionState.score;message.textContent=mission.progress(missionState);if(mission.test(missionState)&&!mission.endOnly)resolve(true)});
  new MutationObserver(() => setTimeout(record,0)).observe(precision,{subtree:true,childList:true,characterData:true});
  if (mode.value === 'match' && !window.qqeRoom) { mode.value = 'circuit'; mode.dispatchEvent(new Event('change')); }
})();
