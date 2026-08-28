// Espelha o estado visual da partida para quem está na mesma sala.
(() => {
  let applying = false, previous = '',lastScore='';
  const snap = () => ({
    board: document.querySelector('#board').className,
    slots: document.querySelector('#slots').innerHTML,
    puck: document.querySelector('#puck').style.left,
    score: document.querySelector('#score').textContent,
    turn: document.querySelector('#turn').textContent,
    status: document.querySelector('#status').textContent,
    precision: document.querySelector('#precision').textContent
  });
  const publish = () => {
    if (applying || !window.qqeRoom || window.qqeRoom.role !== 'player') return;
    const state = JSON.stringify(snap());
    if (state !== previous) { previous = state; const board=JSON.parse(state);if(lastScore&&lastScore!==board.score){window.qqeRoom.client.from('room_games').select('current_player,players').eq('room_code',window.qqeRoom.room).single().then(({data})=>{if(data?.players?.length)window.qqeRoom.client.from('room_games').update({current_player:(data.current_player+1)%data.players.length,updated_at:new Date().toISOString()}).eq('room_code',window.qqeRoom.room)})}lastScore=board.score; window.qqeRoom.sendState(board); window.qqeRoom.client.from('room_games').upsert({room_code:window.qqeRoom.room,board,phase:'turn',updated_at:new Date().toISOString()}); }
  };
  new MutationObserver(publish).observe(document.querySelector('.game'), {subtree:true,childList:true,characterData:true,attributes:true});
  setInterval(()=>{if(window.qqeRoom&&(window.qqeRoom.role==='viewer'||window.qqeRoom.turnAllowed===false)){document.querySelector('#flick').disabled=true;document.querySelector('#reset').disabled=true}},300);
  window.addEventListener('qqe-game-record', ({detail})=>{if(detail?.players){window.qqeRoom.turnAllowed=window.qqeRoom.role==='player'&&detail.players[detail.current_player]===window.qqeRoom.playerName;const count=document.querySelector('#playerCount');const mode=document.querySelector('#mode');if(count&&detail.players.length>=2){mode.value='duel';count.value=Math.min(4,detail.players.length);count.dispatchEvent(new Event('change'));[...document.querySelectorAll('#playerInputs input')].forEach((input,i)=>input.value=detail.players[i]||'');document.querySelector('#playerLabel').textContent=detail.players[detail.current_player]||''}}if(detail?.board)window.dispatchEvent(new CustomEvent('qqe-remote-state',{detail:detail.board}))});
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

