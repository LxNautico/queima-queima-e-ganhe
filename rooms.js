(() => {
  const client = window.supabase.createClient(
    'https://cqipwdksohxcgrknjofm.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxaXB3ZGtzb2h4Y2dya25qb2ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4NjY5MzIsImV4cCI6MjEwMzQ0MjkzMn0.I3JKEFj3E0RkZ4mPiP98-A0iwx7emTUQqVURi1TKSF0'
  );
  let channel;
  const game = document.querySelector('.game');
  const panel = document.createElement('section');
  panel.id = 'roomPanel';
  panel.innerHTML = `<style>#roomPanel{margin:0 0 18px;padding:14px;border:2px solid #c89143;border-radius:12px;background:#fff0c8}#roomPanel input,#roomPanel select,#roomPanel button{padding:7px;border:1px solid #9d6c36;border-radius:7px}#roomPanel button{background:#253a4b;color:#fff;border:0;font-weight:bold}#roomPeople{margin:9px 0 0;color:#553a28;font-size:.88rem}</style><b>🌐 Sala ao vivo</b><div><input id="roomName" maxlength="20" placeholder="Seu nome"><select id="roomRole"><option value="player">Jogador</option><option value="viewer">Espectador</option></select><button id="createRoom">Criar sala</button></div><div><input id="roomCode" maxlength="8" placeholder="Código da sala"><button id="joinRoom">Entrar</button></div><div id="roomPeople">Crie uma sala ou entre com um código.</div>`;
  game.prepend(panel);
  const $ = s => panel.querySelector(s);
  const code = () => Math.random().toString(36).slice(2,8).toUpperCase();
  function renderPeople(){
    const people = Object.values(channel.presenceState()).flat();
    $('#roomPeople').textContent = `Sala ${channel.topic.replace('qqe:','')} · ${people.length} online: ${people.map(p=>`${p.name} (${p.role==='player'?'jogador':'assistindo'})`).join(', ')}`;
  }
  function connect(room){
    if(!$('#roomName').value.trim()) return $('#roomPeople').textContent='Informe seu nome para entrar.';
    channel?.unsubscribe();
    channel = client.channel(`qqe:${room}`, {config:{presence:{key:crypto.randomUUID()},broadcast:{self:false}}});
    channel.on('presence',{event:'sync'},renderPeople).on('broadcast',{event:'game-state'},({payload})=>window.dispatchEvent(new CustomEvent('qqe-remote-state',{detail:payload}))).subscribe(async status=>{
      if(status==='SUBSCRIBED'){
        await channel.track({name:$('#roomName').value.trim(),role:$('#roomRole').value});
        $('#roomPeople').textContent=`Sala ${room} conectada. Compartilhe este código.`;
        window.qqeRoom={sendState:data=>channel.send({type:'broadcast',event:'game-state',payload:data}),role:$('#roomRole').value};
      }
    });
  }
  $('#createRoom').onclick=()=>{const room=code();$('#roomCode').value=room;connect(room)};
  $('#joinRoom').onclick=()=>{const room=$('#roomCode').value.trim().toUpperCase();if(room)connect(room);else $('#roomPeople').textContent='Digite o código da sala.'};
})();

