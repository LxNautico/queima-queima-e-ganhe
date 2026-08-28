(() => {
  const client = window.supabase.createClient(
    'https://cqipwdksohxcgrknjofm.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxaXB3ZGtzb2h4Y2dya25qb2ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4NjY5MzIsImV4cCI6MjEwMzQ0MjkzMn0.I3JKEFj3E0RkZ4mPiP98-A0iwx7emTUQqVURi1TKSF0'
  );
  let channel;
  const game = document.querySelector('.game');
  const panel = document.createElement('section');
  panel.id = 'roomPanel';
  panel.innerHTML = `<style>#roomPanel{margin:0 0 18px;padding:14px;border:2px solid #c89143;border-radius:12px;background:#fff0c8}#roomPanel input,#roomPanel select,#roomPanel button{padding:7px;border:1px solid #9d6c36;border-radius:7px}#roomPanel button{background:#253a4b;color:#fff;border:0;font-weight:bold}#roomPeople{margin:9px 0;color:#553a28;font-size:.88rem}#roomGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px;margin-top:12px}.roomCard{padding:8px;background:#fff9e8;border:1px solid #c89143;border-radius:8px;font-size:.82rem}</style><b>🌐 Sala ao vivo</b><div><input id="roomName" maxlength="20" placeholder="Seu nome"><select id="roomRole"><option value="player">Jogador</option><option value="viewer">Espectador</option></select><button id="createRoom">Criar sala</button></div><div><input id="roomCode" maxlength="8" placeholder="Código da sala"><button id="joinRoom">Entrar</button></div><div id="roomPeople">Crie uma sala ou entre com um código.</div><div id="challengeActions"></div><div id="roomGrid">Carregando salas abertas…</div>`;
  game.prepend(panel);
  const $ = s => panel.querySelector(s);
  const code = () => Math.random().toString(36).slice(2,8).toUpperCase();
  let currentRoom=''; function requestChallenge(code,target){const name=$('#roomName').value.trim();client.from('game_rooms').select('challenge_queue').eq('code',code).single().then(({data})=>client.from('game_rooms').update({challenge_queue:[...(data.challenge_queue||[]),{from:name,to:target}],updated_at:new Date().toISOString()}).eq('code',code)).then(()=>$('#roomPeople').textContent=`Desafio enviado para ${target}.`)}async function showChallenges(){if(!currentRoom)return;const {data}=await client.from('game_rooms').select('challenge_queue').eq('code',currentRoom).single();const mine=(data?.challenge_queue||[]).filter(c=>c.to===$('#roomName').value.trim());$('#challengeActions').innerHTML=mine.map(c=>`<button data-accept="${c.from}">Aceitar desafio de ${c.from}</button>`).join('');[...panel.querySelectorAll('[data-accept]')].forEach(b=>b.onclick=()=>acceptChallenge(b.dataset.accept))}async function acceptChallenge(name){const {data}=await client.from('game_rooms').select('*').eq('code',currentRoom).single();await client.from('game_rooms').update({challenge_queue:(data.challenge_queue||[]).filter(c=>!(c.from===name&&c.to===$('#roomName').value.trim())),active_players:[...new Set([...data.active_players,name])],spectators:(data.spectators||[]).filter(n=>n!==name),updated_at:new Date().toISOString()}).eq('code',currentRoom);$('#roomPeople').textContent=`Desafio de ${name} aceito: ele entra na próxima partida.`}  function renderPeople(){
    const people = Object.values(channel.presenceState()).flat();
    $('#roomPeople').textContent = `Sala ${channel.topic.replace('qqe:','')} · ${people.length} online: ${people.map(p=>`${p.name} (${p.role==='player'?'jogador':'assistindo'})`).join(', ')}`;
  }
  async function refreshRooms(){const {data,error}=await client.from('game_rooms').select('*').order('updated_at',{ascending:false});if(error){$('#roomGrid').textContent='Não foi possível listar salas: '+error.message;return}$('#roomGrid').innerHTML=data.length?data.map(r=>`<div class="roomCard"><b>Sala ${r.code}</b><br>🎮 ${(r.active_players||[]).length} jogando · 👁 ${(r.spectators||[]).length} assistindo<br><button data-room="${r.code}">Entrar</button> ${(r.active_players||[]).map(n=>`<button data-challenge="${r.code}|${n}">Desafiar ${n}</button>`).join('')}</div>`).join(''):'Nenhuma sala aberta no momento.';[...panel.querySelectorAll('[data-challenge]')].forEach(b=>b.onclick=()=>{const [code,target]=b.dataset.challenge.split('|');requestChallenge(code,target)});[...panel.querySelectorAll('[data-room]')].forEach(b=>b.onclick=()=>{$('#roomCode').value=b.dataset.room;connect(b.dataset.room)})}async function registerRoom(room){const name=$('#roomName').value.trim(),role=$('#roomRole').value;const {data}=await client.from('game_rooms').select('*').eq('code',room).maybeSingle();let players=data?.active_players||[],viewers=data?.spectators||[];if(role==='player')players=[...new Set([...players,name])];else viewers=[...new Set([...viewers,name])];await client.from('game_rooms').upsert({code:room,host_name:data?.host_name||name,active_players:players,spectators:viewers,status:'waiting',updated_at:new Date().toISOString()});refreshRooms()}\n  function connect(room){currentRoom=room;
    if(!$('#roomName').value.trim()) return $('#roomPeople').textContent='Informe seu nome para entrar.';
    channel?.unsubscribe();
    channel = client.channel(`qqe:${room}`, {config:{presence:{key:crypto.randomUUID()},broadcast:{self:false}}});
    channel.on('presence',{event:'sync'},renderPeople).on('broadcast',{event:'game-state'},({payload})=>window.dispatchEvent(new CustomEvent('qqe-remote-state',{detail:payload}))).subscribe(async status=>{
      if(status==='SUBSCRIBED'){
        await registerRoom(room);\n        await channel.track({name:$('#roomName').value.trim(),role:$('#roomRole').value});
        $('#roomPeople').textContent=`Sala ${room} conectada. Compartilhe este código.`;
        window.qqeRoom={sendState:data=>channel.send({type:'broadcast',event:'game-state',payload:data}),role:$('#roomRole').value};
      }
    });
  }
  client.channel('room-directory').on('postgres_changes',{event:'*',schema:'public',table:'game_rooms'},()=>{refreshRooms();showChallenges()}).subscribe();refreshRooms();\n  $('#createRoom').onclick=()=>{const room=code();$('#roomCode').value=room;connect(room)};
  $('#joinRoom').onclick=()=>{const room=$('#roomCode').value.trim().toUpperCase();if(room)connect(room);else $('#roomPeople').textContent='Digite o código da sala.'};
})();

