(() => {
  const game=document.querySelector('.game');if(!game)return;
  const panel=document.createElement('details');panel.id='achievementPanel';panel.innerHTML=`
    <style>
      #achievementPanel{margin:18px auto 0;padding:14px;border:3px solid #a85b30;border-radius:16px;background:linear-gradient(145deg,#fff2c8,#edcb83);color:#4f3221;text-align:left}
      #achievementPanel summary{cursor:pointer;user-select:none;font:700 1.25rem Georgia}#achievementSummary{margin:9px 0;padding:8px 10px;border-radius:9px;background:#fff9e8;font-size:.82rem}
      #achievementGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.qqAchievement{display:grid;place-items:center;min-height:102px;padding:9px;border:1px solid #bf803b;border-radius:11px;background:#fff8de;text-align:center}
      .qqAchievement i{font-style:normal;font-size:1.8rem}.qqAchievement b{font-size:.76rem}.qqAchievement small{color:#775b43;font-size:.62rem}.qqAchievement.locked{filter:grayscale(1);opacity:.42}
      #achievementRewards{margin:10px 0 0;color:#7e431f;font-size:.75rem;font-weight:bold}.reward-bronze #puck{box-shadow:0 0 0 3px #d58b48,0 0 13px #f2a85d!important}.reward-gold #puck{box-shadow:0 0 0 3px #ffd34e,0 0 22px #ff9d2e!important;animation:rewardPuckGlow 1.4s infinite alternate}@keyframes rewardPuckGlow{to{filter:brightness(1.18)}}
      @media(max-width:650px){#achievementGrid{grid-template-columns:repeat(2,1fr)}.qqAchievement{min-height:88px}}
    </style>
    <summary>🏅 Medalhas e recompensas</summary><p id="achievementSummary"></p><div id="achievementGrid"></div><p id="achievementRewards"></p>`;
  const ranking=document.querySelector('#ranking');(ranking||game).after(panel);
  const summary=panel.querySelector('#achievementSummary'),grid=panel.querySelector('#achievementGrid'),rewards=panel.querySelector('#achievementRewards');
  let lastSnapshot='';
  function read(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'null')||fallback}catch{return fallback}}
  function render(){const stats=read('qqeBalanceStatsV1',{}),circuit=read('qqeCircuitV1',{stage:1,total:0,completed:0}),completedCircuits=circuit.completed||((circuit.stage||1)===1&&(circuit.total||0)>0?1:0),floors=['wood','glass','rubber'].map(key=>stats[key]||{}),launches=floors.reduce((sum,item)=>sum+(item.launches||0),0),hits100=floors.reduce((sum,item)=>sum+(item.hits100||0),0),valid=floors.reduce((sum,item)=>sum+(item.burns||0),0),returnBurns=floors.reduce((sum,item)=>sum+(item.returnBurns||0),0),bestStreak=Math.max(0,...floors.map(item=>item.best100Streak||0)),allFloors=floors.every(item=>(item.launches||0)>0),snapshot=[launches,hits100,valid,returnBurns,bestStreak,allFloors,circuit.stage,completedCircuits].join('|');if(snapshot===lastSnapshot)return;lastSnapshot=snapshot;
    const achievements=[
      ['🔥','Primeira Queima','Acerte a faixa de 100',hits100>=1,50],['🧭','Três Superfícies','Jogue nos três pisos',allFloors,75],['🎯','Especialista em 100','Faça 5 acertos em 100',hits100>=5,100],['🔥','Sequência Ardente','Consiga combo x3 em 100',bestStreak>=3,125],
      ['🛡️','Mão Controlada','20 retornos com até 10% queimados',valid>=20&&returnBurns/Math.max(1,launches)<=.1,150],['🏁','Piloto do Circuito','Alcance a etapa 6',circuit.stage>=6||completedCircuits>=1,175],['⭐','Veterano','Complete 50 lançamentos',launches>=50,200],['👑','Mestre Queima-Queima','Conclua o Circuito',completedCircuits>=1,500]
    ],unlocked=achievements.filter(item=>item[3]),embers=unlocked.reduce((sum,item)=>sum+item[4],0);summary.textContent=`${unlocked.length}/${achievements.length} medalhas · ${embers} brasas conquistadas`;grid.innerHTML=achievements.map(([icon,title,description,done,reward])=>`<article class="qqAchievement${done?'':' locked'}"><i>${done?icon:'🔒'}</i><b>${title}</b><small>${done?description:`Bloqueada · ${description}`}</small><small>+${reward} brasas</small></article>`).join('');rewards.textContent=unlocked.length>=6?'✨ Recompensa ativa: acabamento dourado da peça.':unlocked.length>=3?'✨ Recompensa ativa: acabamento bronze da peça.':'Desbloqueie 3 medalhas para receber o primeiro acabamento especial.';document.body.classList.toggle('reward-bronze',unlocked.length>=3&&unlocked.length<6);document.body.classList.toggle('reward-gold',unlocked.length>=6)}
  render();setInterval(render,700);
})();
