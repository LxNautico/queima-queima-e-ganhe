(() => {
  const mode=document.querySelector('#mode'),game=document.querySelector('.game'),precision=document.querySelector('#precision'),flick=document.querySelector('#flick'),status=document.querySelector('#status');
  if(!mode||!game||!precision||!flick)return;
  const option=document.createElement('option');option.value='rival';option.textContent='Duelo contra rival virtual';
  const duelOption=mode.querySelector('option[value="duel"]');mode.insertBefore(option,duelOption||null);
  const panel=document.createElement('section');panel.id='rivalPanel';panel.hidden=true;panel.innerHTML=`
    <style>
      #rivalPanel{margin:8px 0 14px;padding:11px;border:2px solid #587b8c;border-radius:13px;background:linear-gradient(135deg,#edf7f4,#cde2dd);color:#263e46}
      #rivalPanel[hidden]{display:none}#rivalPanel header{display:flex;align-items:center;justify-content:space-between;gap:9px}#rivalPanel h2{margin:0;font:700 1.05rem Georgia}
      #rivalPanel select{padding:6px;border:1px solid #668896;border-radius:7px;background:#fff}#rivalScoreboard{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:8px;margin-top:9px}
      #rivalScoreboard span{display:grid;padding:7px;border-radius:9px;background:#fff9}#rivalScoreboard span:last-child{text-align:right}#rivalScoreboard b{font-size:1.25rem;color:#c43d2c}#rivalTurn{margin:7px 0 0;font-size:.76rem;font-weight:800;text-align:center}
      #rivalPanel.thinking{animation:rivalPulse .65s infinite alternate}@keyframes rivalPulse{to{box-shadow:0 0 16px #4c91a766}}
    </style>
    <header><h2>🤖 Duelo contra rival</h2><label>Rival <select id="rivalStyle"><option value="cautious">Lina · cautelosa</option><option value="balanced" selected>Brasa · equilibrado</option><option value="aggressive">Vulcan · agressivo</option></select></label></header>
    <div id="rivalScoreboard"><span>VOCÊ <b id="humanRivalScore">0</b></span><strong>×</strong><span><em id="rivalName">BRASA</em><b id="virtualRivalScore">0</b></span></div><p id="rivalTurn">Sua vez: faça o primeiro lançamento.</p>`;
  document.querySelector('.hud').before(panel);
  const styleSelect=panel.querySelector('#rivalStyle'),humanScore=panel.querySelector('#humanRivalScore'),botScore=panel.querySelector('#virtualRivalScore'),rivalName=panel.querySelector('#rivalName'),turn=panel.querySelector('#rivalTurn');
  const rivals={cautious:{name:'LINA',message:'prefere retornos seguros',values:[10,20,20,40,40,60,60,80]},balanced:{name:'BRASA',message:'equilibra risco e precisão',values:[0,20,40,40,60,60,80,100]},aggressive:{name:'VULCAN',message:'arrisca força máxima',values:[0,0,20,60,80,100,100,100]}};
  let playerTotal=0,virtualTotal=0,shots=0,lastEvent='',thinking=false,finished=false,timer;
  function resetDuel(){clearTimeout(timer);playerTotal=0;virtualTotal=0;shots=0;lastEvent='';thinking=false;finished=false;humanScore.textContent='0';botScore.textContent='0';styleSelect.disabled=false;panel.classList.remove('thinking');const rival=rivals[styleSelect.value];rivalName.textContent=rival.name;turn.textContent=`Sua vez · ${rival.name} ${rival.message}.`}
  function botPlay(){const rival=rivals[styleSelect.value],floor=document.querySelector('#floor').value,difficulty=document.querySelector('#difficulty').value;let pool=[...rival.values],result=pool[Math.floor(Math.random()*pool.length)];if(floor==='glass'&&Math.random()<.12)result=0;if(floor==='rubber'&&Math.random()<.1)result=Math.min(result,40);if(difficulty==='hard'&&result>0)result=Math.min(100,result+20);virtualTotal+=result;botScore.textContent=virtualTotal;panel.classList.remove('thinking');thinking=false;turn.textContent=result===0?`${rival.name} exagerou e não pontuou.`:`${rival.name} marcou ${result} pontos.`;
    if(shots>=5){finished=true;styleSelect.disabled=false;const verdict=playerTotal===virtualTotal?'Empate!':playerTotal>virtualTotal?'Você venceu!':`${rival.name} venceu!`;status.textContent=`Final: ${verdict} Você ${playerTotal} × ${rival.name} ${virtualTotal}.`;flick.disabled=true;flick.textContent='DUELO FINALIZADO';turn.textContent=`🏁 ${verdict} Placar ${playerTotal} × ${virtualTotal}.`;return}
    flick.disabled=false;flick.textContent='SEGURE PARA CARREGAR';setTimeout(()=>{turn.textContent='Sua vez. Controle a força e responda ao rival.'},850)}
  function record(){if(mode.value!=='rival'||thinking||finished)return;const text=precision.textContent.trim(),score=Number(document.querySelector('#score').textContent)||0,key=`${text}|${document.querySelector('#turn').textContent}|${score}`;if(!/^RETORNO/i.test(text)||key===lastEvent)return;lastEvent=key;shots++;playerTotal=score;humanScore.textContent=playerTotal;thinking=true;styleSelect.disabled=true;flick.disabled=true;flick.textContent='RIVAL JOGANDO...';panel.classList.add('thinking');turn.textContent=`${rivals[styleSelect.value].name} está calculando o lançamento…`;timer=setTimeout(botPlay,700)}
  styleSelect.addEventListener('change',resetDuel);
  document.querySelector('#reset').addEventListener('click',()=>{if(mode.value==='rival')resetDuel()});
  addEventListener('qqe-special-result',()=>{if(mode.value!=='rival'||finished)return;playerTotal=Number(document.querySelector('#score').textContent)||playerTotal;humanScore.textContent=playerTotal});
  mode.addEventListener('change',()=>{panel.hidden=mode.value!=='rival';if(mode.value==='rival')resetDuel();else clearTimeout(timer)});
  new MutationObserver(()=>setTimeout(record,0)).observe(precision,{subtree:true,childList:true,characterData:true});
})();
