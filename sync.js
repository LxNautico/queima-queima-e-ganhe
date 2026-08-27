// Espelha o estado visual da partida para quem está na mesma sala.
(() => {
  let applying = false, previous = '';
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
    if (state !== previous) { previous = state; window.qqeRoom.sendState(JSON.parse(state)); }
  };
  new MutationObserver(publish).observe(document.querySelector('.game'), {subtree:true,childList:true,characterData:true,attributes:true});
  setInterval(()=>{if(window.qqeRoom?.role==='viewer'){document.querySelector('#flick').disabled=true;document.querySelector('#reset').disabled=true}},300);\n  window.addEventListener('qqe-remote-state', ({detail:s}) => {
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

