(() => {
  const ptToEn=window.QQ_BITCOIN_EN||{},ptToEs=window.QQ_BITCOIN_ES||{},enToPt=Object.fromEntries(Object.entries(ptToEn).map(([pt,en])=>[en,pt])),esToPt=Object.fromEntries(Object.entries(ptToEs).map(([pt,es])=>[es,pt]));
  const normalize=value=>{const code=String(value||'').toLowerCase();return code.startsWith('en')?'en':code.startsWith('es')?'es':'pt-BR'};
  let language=normalize(localStorage.getItem('qqLanguage')||navigator.language),busy=false;
  const originals=new WeakMap(),attributeOriginals=new WeakMap();
  const exact=value=>{const portuguese=enToPt[value]||esToPt[value]||value;return language==='en'?(ptToEn[portuguese]||portuguese):language==='es'?(ptToEs[portuguese]||portuguese):portuguese};
  function translateValue(value){
    let text=exact(value);
    if(language==='en')text=text
      .replace(/^Bloco Nº: (\d+)$/,'Block No.: $1').replace(/^Desafio: (\d+)s$/,'Challenge: $1s')
      .replace(/^Faltam (\d+) blocos para o (.+)$/,'$1 blocks remaining until $2')
      .replace(/^Saldo para compras: ([\d.]+) (.+) do jogo$/,'Purchase balance: $1 in-game $2')
      .replace(/^Valor em ([A-Z0-9]+):$/,'Amount in $1:').replace(/^⏱️ Partida: (.+)$/,'⏱️ Game: $1')
      .replace(/^(\d+)\/100 concluídos · bloco atual (\d+)\/100$/,'$1/100 completed · current block $2/100').replace(/^Marco de (\d+) blocos$/,'$1-block milestone')
      .replace(/^Bloco (\d+): concluído$/,'Block $1: completed').replace(/^Bloco (\d+): atual$/,'Block $1: current').replace(/^Bloco (\d+): próximo$/,'Block $1: next').replace(/^Bloco (\d+): pendente$/,'Block $1: pending')
      .replace(/^🎯 Sequência: (\d+) acertos? · ⏱️ tempo total no topo · ⌛ tempo deste desafio acima$/,'🎯 Streak: $1 correct · ⏱️ total time above · ⌛ current challenge time above')
      .replace(/^🎖️ Campanhas de 100 blocos · (\d+) concluída\(s\) · (\d+)\/3 dificuldades vencidas$/,'🎖️ 100-block campaigns · $1 completed · $2/3 difficulties cleared')
      .replace(/^Fácil: (\d+)$/,'Easy: $1').replace(/^Médio: (\d+)$/,'Medium: $1').replace(/^Difícil: (\d+)$/,'Hard: $1')
      .replace(/^Nenhuma conquista encontrada para (.+)\.$/,'No achievements found for $1.').replace(/^🏆 CONQUISTAS DE (.+)$/,'🏆 $1 ACHIEVEMENTS')
      .replace(/^(.+) insuficiente para depositar\.$/,'Insufficient $1 to deposit.').replace(/^💼 Depositou ([\d.]+) (.+) na carteira\.$/,'💼 Deposited $1 $2 into the wallet.').replace(/^💰 Sacou ([\d.]+) (.+) da carteira\.$/,'💰 Withdrew $1 $2 from the wallet.')
      .replace(/^(.+): carteira ([\d.]+) \| livre ([\d.]+)( ← selecionada)?$/,'$1: wallet $2 | available $3$4').replace(' ← selecionada',' ← selected')
      .replace(/^Rendimento simulado: ([\d.]+)% ao dia sobre o valor depositado\.$/,'Simulated yield: $1% per day on the deposited amount.')
      .replace(/^(.+) guardada há: (.+)\. Rendeu desde esta atualização: ([\d.]+) (.+)\.$/,'$1 stored for: $2. Earned since this update: $3 $4.')
      .replace(/^BLOCO #(\d+)$/,'BLOCK #$1').replace(/^Bloco #(\d+)/,'Block #$1').replace(/^Vida (\d+)$/,'Life $1')
      .replace(/^🚀 Mineração agora em (.+)\.$/,'🚀 Now mining $1.').replace(/^🪙 Medalha Satoshi desbloqueada! \(100 blocos em cada nível\)$/,'🪙 Satoshi Medal unlocked! (100 blocks on each level)')
      .replace(/^🌐 Conquista: Maestro das Criptos \(0\.05 de cada moeda\)$/,'🌐 Achievement: Crypto Maestro (0.05 of every coin)')
      .replace(/^Termo do jogo: (.+)\.$/,'Game term: $1.').replace(/^(\d+) conceitos$/,'$1 concepts').replace(/^Buscar entre (\d+) conceitos\.\.\.$/,'Search among $1 concepts...')
      .replace(/^(\d+) conceito encontrado · deslize a lista para ver mais\.$/,'$1 concept found · scroll the list to see more.').replace(/^(\d+) conceitos encontrados · deslize a lista para ver mais\.$/,'$1 concepts found · scroll the list to see more.')
      .replace(/^Abrir artigo sobre (.+)$/,'Open article about $1').replace(/^Buscar na Wikipédia por (.+)$/,'Search Wikipedia for $1').replace(/^Pesquisar (.+) na web$/,'Search the web for $1')
      .replace(/^Chat do Jogo \(Você: (.+)\)$/,'Game Chat (You: $1)')
      .replace(/^Logado como: (.+)$/,'Signed in as: $1')
      .replace(/^Preço: ([\d.]+) BTC$/,'Price: $1 BTC')
      .replace(/^Saldo para compras: ([\d.]+) BTC do jogo$/,'Purchase balance: $1 in-game BTC')
      .replace(/^💡 Aprenda: (.+)$/,'💡 Learn: $1')
      .replace(/^📖 Capítulo (\d+)$/,'📖 Chapter $1').replace(/^(\d+)º Capítulo do bitcoin$/,'Bitcoin chapter $1')
      .replace(/^🔐 Descriptografe \(Cifra de César, chave: (\d+)( →| ←)\):$/,'🔐 Decrypt (Caesar Cipher, key: $1$2):')
      .replace(/^🔢 Converta ASCII para texto:$/,'🔢 Convert ASCII to text:').replace(/^🔢 Decodifique ASCII:$/,'🔢 Decode ASCII:').replace(/^🔄 Decodifique Base64:$/,'🔄 Decode Base64:')
      .replace(/^Dica: Desloque (\d+) letras$/,'Hint: Shift $1 letters').replace(/^Dica: Desloque (\d+) posições$/,'Hint: Shift $1 positions')
      .replace(/^Dica: Cada 3 números = 1 caractere$/,'Hint: Every 3 numbers = 1 character')
      .replace(/^Chave: ([+-]?\d+) \(desloque (\d+) posições para frente\)$/,'Key: $1 (shift $2 positions forward)')
      .replace(/^Chave: ([+-]?\d+) \(desloque (\d+) posições para trás\)$/,'Key: $1 (shift $2 positions backward)')
      .replace(/^Use tabela ASCII \(cada 3 números = 1 caractere\)$/,'Use the ASCII table (every 3 numbers = 1 character)')
      .replace(/^Base64 termina com = ou ==$/,'Base64 ends with = or ==')
      .replace(/^✅ CORRETO! \+(\d+) de bônus \(cifra, rapidez, precisão e sequência\)\.$/,'✅ CORRECT! +$1 bonus (cipher, speed, accuracy, and streak).')
      .replace(/^💡 DICA: (.+)$/,'💡 HINT: $1').replace(/^🏆 Nenhuma conquista ainda\. Continue minerando!$/,'🏆 No achievements yet. Keep mining!')
      .replace(/^🏆 (.+) ainda não tem conquistas\. Continue minerando!$/,'🏆 $1 has no achievements yet. Keep mining!').replace(/^🏆 (.+) ainda não tem conquistas registradas\.$/,'🏆 $1 has no registered achievements.')
      .replace(/^Bloco (\d+)\/100 · Fácil\. /,'Block $1/100 · Easy. ').replace(/^Bloco (\d+)\/100 · Médio\. /,'Block $1/100 · Medium. ').replace(/^Bloco (\d+)\/100 · Difícil\. /,'Block $1/100 · Hard. ')
      .replace(/^Dificuldade: FÁCIL \|/,'Difficulty: EASY |').replace(/^Dificuldade: MÉDIO \|/,'Difficulty: MEDIUM |').replace(/^Dificuldade: DIFÍCIL \|/,'Difficulty: HARD |').replace(/ \| Vidas: /,' | Lives: ').replace(/ \| Bloco: /,' | Block: ').replace(/ \| Tempo: /,' | Time: ').replace(/ \| Tipo atual: /,' | Current type: ');
    if(language==='en')text=text
      .replace(/^Objetivo: quebrar (\d+) blocos resolvendo o enigma criptográfico\. Use o decodificador \(César, ASCII ou Base64\) para achar a resposta, clique “Usar e Enviar” e valide\. Cada acerto minera um bloco e registra hash\. /,'Goal: break $1 blocks by solving cryptographic puzzles. Use the decoder (Caesar, ASCII, or Base64), select “Use and Submit,” and validate. Each correct answer mines a block and records a hash. ')
      .replace(/^Me diga o tema \(tempo, vidas, chave, ASCII, Base64, hash, enciclopédia\) ou pergunte “passo a passo”\. /,'Tell me the topic (time, lives, key, ASCII, Base64, hash, encyclopedia) or ask for “step by step.” ')
      .replace(/^1\) Abra o decodificador\. 2\) Preencha com o texto cifrado já mostrado no problema\. 3\) Escolha o método do nível \(César\/ASCII\/Base64\)\. 4\) Ajuste a chave\/slider \(tente 3, 5 ou 13 em César\)\. 5\) Clique “Usar e Enviar” para colar no campo de resposta\. 6\) Validar\. /,'1) Open the decoder. 2) Enter the encrypted text shown in the challenge. 3) Choose the level method (Caesar/ASCII/Base64). 4) Adjust the key/slider (try 3, 5, or 13 for Caesar). 5) Select “Use and Submit.” 6) Validate. ')
      .replace(/^Tempo: (.+)\. No fácil é mais folgado; no médio\/difícil acelera\. Precisa pausar\? Abra a Enciclopédia que os timers param\.$/,'Time: $1. Easy provides more time; Medium and Hard are faster. To pause, open the Encyclopedia.')
      .replace(/^Vidas: (.+)\. Após 2 erros aparece dica automática\. Se estiver com 1 vida, foque nos enigmas ASCII\/Base64 \(normalmente curtos\)\.$/,'Lives: $1. An automatic hint appears after 2 errors. With 1 life remaining, focus on the usually shorter ASCII/Base64 puzzles.')
      .replace(/^Tempo por desafio: fácil 60s \(César\), médio 45s \(César\/ASCII\) e difícil 30s \(César\/ASCII\/Base64\)\. O cronômetro no alto mostra o tempo total da partida\. /,'Challenge time: Easy 60s (Caesar), Medium 45s (Caesar/ASCII), and Hard 30s (Caesar/ASCII/Base64). The upper timer shows total game time. ')
      .replace(/^Erros seguidos \((\d+)\)\? Reveja o tipo do enigma: se o texto tem números separados por espaço, é ASCII; se tem letras misturadas, tente César; se parecer embaralhado com maiúsc\/minúsc e “=”, teste Base64\. /,'Consecutive errors ($1)? Check the puzzle type: spaced numbers indicate ASCII; letters may indicate Caesar; mixed-case scrambled text with “=” may indicate Base64. ')
      .replace(/^Bloco atual: (.+)\. Cada acerto minera e aparece no simulador blockchain; a cada 6 blocos abre um capítulo da história do Bitcoin\.$/,'Current block: $1. Every correct answer mines a block displayed in the blockchain simulator; every 6 blocks unlocks a Bitcoin history chapter.')
      .replace(/^Score atual: (\d+)\. O ranking salva no final da partida; visite a enciclopédia e conclua metas para ganhar pontos extras\.$/,'Current score: $1. The ranking is saved at the end; visit the Encyclopedia and complete goals for extra points.')
      .replace(/^A cada 6 blocos liberamos um capítulo da história do Bitcoin\. Falta pouco\? Blocos: (.+)\.$/,'Every 6 blocks unlocks a chapter in Bitcoin history. Progress: $1.')
      .replace(/Dificuldade: FÁCIL/g,'Difficulty: EASY').replace(/Dificuldade: MÉDIO/g,'Difficulty: MEDIUM').replace(/Dificuldade: DIFÍCIL/g,'Difficulty: HARD').replace(/ \| Vidas: /g,' | Lives: ').replace(/ \| Bloco: /g,' | Block: ').replace(/ \| Tempo: /g,' | Time: ').replace(/ \| Tipo atual: /g,' | Current type: ').replace(/s restantes/g,'s remaining').replace(/tempo n\/d/g,'time n/a');
    if(language==='es')text=text.replace(/^Bloco Nº: (\d+)$/,'Bloque N.º: $1').replace(/^Desafio: (\d+)s$/,'Desafío: $1s').replace(/^Faltam (\d+) blocos para o (.+)$/,'Faltan $1 bloques para $2').replace(/^Valor em ([A-Z0-9]+):$/,'Valor en $1:').replace(/^(\d+)\/100 concluídos · bloco atual (\d+)\/100$/,'$1/100 completados · bloque actual $2/100').replace(/^Bloco (\d+): concluído$/,'Bloque $1: completado').replace(/^Bloco (\d+): atual$/,'Bloque $1: actual').replace(/^Bloco (\d+): próximo$/,'Bloque $1: siguiente').replace(/^Bloco (\d+): pendente$/,'Bloque $1: pendiente').replace(/^BLOCO #(\d+)$/,'BLOQUE #$1').replace(/^Bloco #(\d+)/,'Bloque #$1').replace(/^Termo do jogo: (.+)\.$/,'Término del juego: $1.').replace(/^(\d+) conceitos$/,'$1 conceptos').replace(/^Abrir artigo sobre (.+)$/,'Abrir artículo sobre $1').replace(/^Buscar na Wikipédia por (.+)$/,'Buscar $1 en Wikipedia').replace(/^Pesquisar (.+) na web$/,'Buscar $1 en la web').replace(/^Logado como: (.+)$/,'Sesión iniciada como: $1').replace(/^💡 Aprenda: (.+)$/,'💡 Aprende: $1').replace(/^📖 Capítulo (\d+)$/,'📖 Capítulo $1').replace(/^🔢 Converta ASCII para texto:$/,'🔢 Convierte ASCII a texto:').replace(/^🔢 Decodifique ASCII:$/,'🔢 Decodifica ASCII:').replace(/^🔄 Decodifique Base64:$/,'🔄 Decodifica Base64:').replace(/^Dica:/,'Consejo:').replace(/^✅ CORRETO!/,'✅ ¡CORRECTO!').replace(/^💡 DICA:/,'💡 CONSEJO:');
    return text;
  }
  function translateText(node){
    if(!node?.nodeValue||!node.nodeValue.trim())return;
    if(language==='pt-BR'&&originals.has(node)){node.nodeValue=originals.get(node);originals.delete(node);return}
    const before=node.nodeValue,lead=before.match(/^\s*/)[0],trail=before.match(/\s*$/)[0],after=translateValue(before.trim());
    if(after!==before.trim()){if(language!=='pt-BR'&&!originals.has(node))originals.set(node,before);node.nodeValue=lead+after+trail}
  }
  function translateAttributes(root){
    root.querySelectorAll?.('[placeholder],[title],[aria-label]').forEach(element=>{
      const saved=attributeOriginals.get(element)||{};
      ['placeholder','title','aria-label'].forEach(name=>{
        if(!element.hasAttribute(name))return;
        if(language==='pt-BR'&&saved[name]!=null){element.setAttribute(name,saved[name]);delete saved[name];return}
        const current=element.getAttribute(name),next=translateValue(current);
        if(next!==current){if(language!=='pt-BR'&&saved[name]==null)saved[name]=current;element.setAttribute(name,next)}
      });
      if(Object.keys(saved).length)attributeOriginals.set(element,saved);else attributeOriginals.delete(element);
    });
  }
  function apply(root=document){
    busy=true;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:node=>/^(SCRIPT|STYLE|TEXTAREA)$/.test(node.parentElement?.tagName)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}),nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(translateText);translateAttributes(root);
    document.documentElement.lang=language;document.title=language==='en'?'₿ JogoBitcoin — Educational Blockchain':language==='es'?'₿ JogoBitcoin — Blockchain educativo':'₿ JogoBitcoin - Blockchain Educacional';
    const select=document.querySelector('#bitcoinLanguage');if(select)select.value=language;busy=false;
  }
  function setLanguage(value){language=normalize(value);localStorage.setItem('qqLanguage',language);apply();dispatchEvent(new CustomEvent('qq-language-change',{detail:{language}}))}
  const nativeAlert=window.alert.bind(window),nativeConfirm=window.confirm.bind(window);
  window.alert=message=>nativeAlert(translateValue(String(message)));
  window.confirm=message=>nativeConfirm(translateValue(String(message)));
  function installPicker(){
    if(document.querySelector('#bitcoinLanguage'))return;
    const style=document.createElement('style');style.textContent='.bitcoin-language{position:fixed;z-index:15000;top:12px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:7px;padding:6px 9px;border:1px solid #00d9d0;border-radius:10px;background:#071821e8;color:#e7ffff;font-size:.72rem;font-weight:800}.bitcoin-language select{padding:5px 8px;border:1px solid #00bdb5;border-radius:7px;background:#102b39;color:#fff;font-weight:800}@media(max-width:600px){.bitcoin-language{top:6px;padding:4px 6px;font-size:.66rem}.bitcoin-language select{padding:4px 6px}}';document.head.append(style);
    const label=document.createElement('label');label.className='bitcoin-language';label.innerHTML='<span>Idioma</span><select id="bitcoinLanguage"><option value="pt-BR">Português</option><option value="en">English</option><option value="es">Español</option></select>';document.body.prepend(label);label.querySelector('select').value=language;label.querySelector('select').addEventListener('change',event=>setLanguage(event.target.value));
  }
  function init(){
    installPicker();apply();
    const pendingText=new Set(),pendingRoots=new Set();let scheduled=false;
    const flush=()=>{scheduled=false;if(language==='pt-BR'||busy){pendingText.clear();pendingRoots.clear();return}busy=true;pendingText.forEach(translateText);pendingRoots.forEach(root=>apply(root));pendingText.clear();pendingRoots.clear();busy=false};
    new MutationObserver(records=>{if(language==='pt-BR'||busy)return;records.forEach(record=>record.type==='characterData'?pendingText.add(record.target):record.addedNodes.forEach(node=>{if(node.nodeType===Node.TEXT_NODE)pendingText.add(node);else if(node.nodeType===Node.ELEMENT_NODE)pendingRoots.add(node)}));if(!scheduled){scheduled=true;requestAnimationFrame(flush)}}).observe(document.body,{subtree:true,childList:true,characterData:true});
  }
  if(document.readyState==='loading')addEventListener('DOMContentLoaded',init,{once:true});else init();
  window.qqBitcoinI18n={apply,setLanguage,translateValue,get language(){return language}};
})();
