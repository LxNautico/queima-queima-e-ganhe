(() => {
  const mode=document.querySelector('#mode'),precision=document.querySelector('#precision'),flick=document.querySelector('#flick'),status=document.querySelector('#status'),game=document.querySelector('.game');if(!mode||!precision||!flick)return;
  const panel=document.createElement('section');panel.id='specialEvent';panel.hidden=true;panel.innerHTML='<span id="eventIcon">⚡</span><div><small>RODADA SURPRESA</small><strong id="eventTitle"></strong><p id="eventDescription"></p></div>';
  document.querySelector('.hud').before(panel);
  const style=document.createElement('style');style.textContent='#specialEvent{display:grid;grid-template-columns:42px 1fr;align-items:center;gap:9px;margin:8px 0 13px;padding:9px 12px;border:2px solid #e58b2d;border-radius:12px;background:linear-gradient(135deg,#fff0a9,#ffc866);color:#4d301e;text-align:left;animation:eventPulse .7s 2 alternate}#specialEvent[hidden]{display:none}#eventIcon{font-size:1.8rem;text-align:center}#specialEvent small{display:block;color:#a44327;font-size:.58rem;font-weight:900;letter-spacing:.13em}#eventTitle{font:700 1.05rem Georgia}#eventDescription{margin:2px 0 0;font-size:.72rem}@keyframes eventPulse{to{box-shadow:0 0 18px #ff9a32;transform:scale(1.008)}}';document.head.append(style);
  const icon=panel.querySelector('#eventIcon'),title=panel.querySelector('#eventTitle'),description=panel.querySelector('#eventDescription');
  const allowed=()=>['match','training','circuit','rival'].includes(mode.value);
  const catalog=[
    {id:'double',icon:'×2',title:'Tudo em dobro',description:'A pontuação desta jogada será duplicada.'},
    {id:'super100',icon:'🔥',title:'Super 100',description:'Parar na faixa 100 concede +100 pontos extras.'},
    {id:'challenge',icon:'🏹',title:'Desafio turbinado',description:'Cumprir o desafio concede mais +25, totalizando +50.'},
    {id:'limited',icon:'🔒',title:'Carga limitada',description:'Nesta jogada, a carga máxima será de 78%.'},
    {id:'forbidden',icon:'⛔',title:'Faixa proibida',description:'Uma faixa sorteada zera completamente a jogada.'},
    {id:'center',icon:'🎯',title:'Centro perfeito',description:'Pare perto do centro da faixa e receba +40 pontos.'},
    {id:'danger',icon:'💥',title:'Parede perigosa',description:'Tocar a parede inicial retira 25 pontos do placar.'}
  ];
  let active=null,shots=0,nextAt=3+Math.floor(Math.random()*2),lastResult='';
  function announce(event){active={...event};if(event.id==='forbidden'){active.blocked=[10,20,40,60,80,100][Math.floor(Math.random()*6)];active.description=`A faixa ${active.blocked} está proibida e zerará a jogada.`}icon.textContent=active.icon;title.textContent=active.title;description.textContent=active.description;panel.hidden=false}
  function adjust(points){const before=score,playerBefore=Math.max(1,player-1||playerCount);score=Math.max(0,score+points);const applied=score-before;if(mode.value==='duel'&&playerScores[playerBefore-1]!=null)playerScores[playerBefore-1]=Math.max(0,playerScores[playerBefore-1]+applied);document.querySelector('#score').textContent=score;if(score>best){best=score;localStorage.setItem('qqeBest',best);document.querySelector('#best').textContent=best}return applied}
  function resolve(){const text=precision.textContent.trim();if(!allowed()||!/^RETORNO/i.test(text)||text===lastResult)return;lastResult=text;shots++;if(active){const shot=window.qqeLastShot||{},valid=shot.reachedEnd&&!shot.touchedStartWall,scoreBefore=Number(document.querySelector('#score').textContent)||0;let delta=0,result='';if(active.id==='double'&&valid){const previous=Number(window.qqeEventPreviousScore)||0,earned=Math.max(0,scoreBefore-previous);delta=adjust(earned);result=`pontuação duplicada: +${delta} extra`}
      if(active.id==='super100'&&valid&&shot.rawPoints===100){delta=adjust(100);result='+100 pelo Super 100'}
      if(active.id==='challenge'&&valid&&shot.hitChallenge){delta=adjust(25);result='+25 extra pelo desafio turbinado'}
      if(active.id==='forbidden'&&valid&&shot.rawPoints===active.blocked){const earned=Math.max(0,scoreBefore-(Number(window.qqeEventPreviousScore)||0));delta=adjust(-earned);result=`faixa ${active.blocked} proibida: jogada zerada`}
      if(active.id==='center'&&valid){const center=(Math.min(5,Math.max(0,(shot.zone||1)-1))+.5)/6,deviation=Math.abs((shot.stopX||0)-center)/(1/12);if(deviation<=.25){delta=adjust(40);result='+40 por precisão central'}}
      if(active.id==='danger'&&shot.touchedStartWall){delta=adjust(-25);result=`penalidade de ${Math.abs(delta)} pontos`}
      if(/Final:\s*\d+/i.test(status.textContent))status.textContent=status.textContent.replace(/Final:\s*\d+/i,`Final: ${score}`);status.textContent+=` · EVENTO: ${result||'sem bônus'}.`;dispatchEvent(new CustomEvent('qqe-special-result',{detail:{score,result,delta}}));panel.hidden=true;active=null;nextAt=shots+3+Math.floor(Math.random()*2)}
    if(!active&&shots>=nextAt&&allowed())announce(catalog[Math.floor(Math.random()*catalog.length)])}
  flick.addEventListener('pointerdown',()=>{if(!flick.disabled)window.qqeEventPreviousScore=Number(document.querySelector('#score').textContent)||0},true);
  addEventListener('pointerup',()=>{if(active?.id==='limited'&&charging)charge=Math.min(charge,78)},true);
  mode.addEventListener('change',()=>{panel.hidden=true;active=null;shots=0;nextAt=3+Math.floor(Math.random()*2)});
  new MutationObserver(()=>setTimeout(resolve,0)).observe(precision,{subtree:true,childList:true,characterData:true});
})();
