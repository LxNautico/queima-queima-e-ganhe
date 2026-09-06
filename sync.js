// Espelha o estado visual da partida para quem está na mesma sala.
(() => {
  let applying = false, previous = '',lastScore='';
  const boardEl=document.querySelector('#board');const playfield=document.createElement('div');playfield.id='playfield';const springBay=document.createElement('div');springBay.id='springBay';const spring=document.createElement('div');spring.id='spring';spring.innerHTML='<span>〰〰〰</span><i></i>';boardEl.parentNode.insertBefore(playfield,boardEl);playfield.append(springBay,boardEl);springBay.append(spring);
  const style=document.createElement('style');style.textContent='#playfield{display:grid;grid-template-columns:78px minmax(0,1fr);align-items:stretch}#springBay{position:relative;min-height:180px;overflow:hidden;border:10px solid #784d2f;border-right:0;border-radius:16px 0 0 16px;background:linear-gradient(#26333b,#111a20);box-shadow:inset 0 0 15px #000}#springBay:after{content:"";position:absolute;z-index:6;right:-4px;top:calc(50% - 19px);width:9px;height:38px;border-radius:5px;background:#c89143;box-shadow:0 0 0 2px #f5dfab}#spring{position:absolute;z-index:5;left:5px;top:50%;width:68px;transform:translateY(-50%) scaleX(1);transform-origin:left;color:#d9e8ee;font:900 30px/1 monospace;letter-spacing:-7px;text-shadow:1px 2px #243746;transition:transform .08s}#spring i{display:block;position:absolute;right:-2px;top:9px;width:16px;height:28px;border-radius:5px;background:linear-gradient(90deg,#b4bec2,#f3f5ed,#7e898d);box-shadow:2px 2px 2px #000}#spring.launch{animation:springHit .22s ease-out}@keyframes springHit{0%{transform:translateY(-50%) scaleX(.25)}55%{transform:translate(8px,-50%) scaleX(1.15)}100%{transform:translateY(-50%) scaleX(1)}}';document.head.append(style);
  const springTimer=setInterval(()=>{const fill=document.querySelector('#fill');const pct=parseFloat(fill?.style.width)||0;spring.style.transform=`translateY(-50%) scaleX(${Math.max(.18,1-pct/120)})`},40);
  document.querySelector('#flick').addEventListener('pointerup',()=>{spring.classList.add('launch');setTimeout(()=>spring.classList.remove('launch'),230)});
  const snap = () => ({
    board: document.querySelector('#board').className,
    slots: document.querySelector('#slots').innerHTML,
    puck: document.querySelector('#puck').style.left,
    score: document.querySelector('#score').textContent,
    turn: document.querySelector('#turn').textContent,
    status: document.querySelector('#status').textContent,
    precision: document.querySelector('#precision').textContent,config:{difficulty:document.querySelector('#difficulty').value,floor:document.querySelector('#floor').value,mode:document.querySelector('#mode').value,players:document.querySelector('#playerCount').value}
  });
  const publish = () => {
    if (applying || !window.qqeRoom || window.qqeRoom.role !== 'player') return;
    const state = JSON.stringify(snap());
    if (state !== previous) { previous = state; const board=JSON.parse(state);if(lastScore&&lastScore!==board.score){window.qqeRoom.client.from('room_games').select('current_player,players').eq('room_code',window.qqeRoom.room).single().then(({data})=>{if(data?.players?.length)window.qqeRoom.client.from('room_games').update({current_player:(data.current_player+1)%data.players.length,updated_at:new Date().toISOString()}).eq('room_code',window.qqeRoom.room)})}lastScore=board.score; window.qqeRoom.sendState(board); window.qqeRoom.client.from('room_games').upsert({room_code:window.qqeRoom.room,board,phase:'turn',updated_at:new Date().toISOString()}); }
  };
  new MutationObserver(publish).observe(document.querySelector('.game'), {subtree:true,childList:true,characterData:true,attributes:true});
  setInterval(()=>{if(window.qqeRoom&&(window.qqeRoom.role==='viewer'||!window.qqeRoom.turnAllowed)){document.querySelector('#flick').disabled=true;document.querySelector('#reset').disabled=true}},300);
  window.addEventListener('qqe-game-record', ({detail})=>{if(detail?.players){window.qqeRoom.players=detail.players;window.qqeRoom.turnAllowed=window.qqeRoom.role==='player'&&detail.players[detail.current_player]===window.qqeRoom.playerName;const count=document.querySelector('#playerCount');const mode=document.querySelector('#mode');if(count&&detail.players.length>=2){mode.value='duel';count.value=Math.min(4,detail.players.length);count.dispatchEvent(new Event('change'));[...document.querySelectorAll('#playerInputs input')].forEach((input,i)=>input.value=detail.players[i]||'');document.querySelector('#playerLabel').textContent=detail.players[detail.current_player]||''}}if(detail?.board?.config){for(const [key,value] of Object.entries(detail.board.config)){const el=document.querySelector('#'+(key==='players'?'playerCount':key));if(el)el.value=value}}if(detail?.board)window.dispatchEvent(new CustomEvent('qqe-remote-state',{detail:detail.board}))});
  window.addEventListener('qqe-remote-state', ({detail:s}) => {
    applying = true;
    document.querySelector('#board').className=s.board;
    document.querySelector('#slots').innerHTML=s.slots;
    document.querySelector('#puck').style.left=s.puck;
    document.querySelector('#score').textContent=s.score;
    document.querySelector('#turn').textContent=s.turn;
    document.querySelector('#status').textContent=s.status;
    document.querySelector('#precision').textContent=s.precision;
    setTimeout(()=>applying=false,0);
  });
})();

