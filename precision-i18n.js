(() => {
  const ptToEn=window.QQ_PRECISION_EN||{},ptToEs=window.QQ_PRECISION_ES||{},enToPt=Object.fromEntries(Object.entries(ptToEn).map(([pt,en])=>[en,pt])),esToPt=Object.fromEntries(Object.entries(ptToEs).map(([pt,es])=>[es,pt]));
  const normalize=value=>{const code=String(value||'').toLowerCase();return code.startsWith('en')?'en':code.startsWith('es')?'es':'pt-BR'};
  let language=normalize(localStorage.getItem('qqLanguage')||navigator.language),busy=false;
  const originals=new WeakMap(),placeholderOriginals=new WeakMap();
  const exact=value=>{const portuguese=enToPt[value]||esToPt[value]||value;return language==='en'?(ptToEn[portuguese]||portuguese):language==='es'?(ptToEs[portuguese]||portuguese):portuguese};
  function dynamic(value){
    let text=exact(value);
    if(language==='en')text=text
      .replace(/^DESAFIO: pare na faixa (\d+) para ganhar \+(\d+) bônus$/,'CHALLENGE: stop in the $1-point zone to earn a +$2 bonus')
      .replace(/^(\d+) de (\d+)$/,'$1 of $2').replace(/^treino (\d+)$/,'training $1').replace(/^Jogador (\d+)$/,'Player $1')
      .replace(/^Impulso extra: (\d+)%$/,'Extra boost: $1%').replace(/^ETAPA (\d+) DE (\d+)(.*)$/,'STAGE $1 OF $2$3')
      .replace(/^Faça pelo menos (\d+) pontos em até 5 lançamentos\.$/,'Score at least $1 points in up to 5 shots.')
      .replace(/^Some (\d+) pontos e acerte (\d+) faixas diferentes\.$/,'Score $1 points and hit $2 different zones.')
      .replace(/^Faça (um acerto|dois acertos) em 100 e some (\d+) pontos\.$/,(_,hits,points)=>'Hit the 100-point zone '+(hits==='um acerto'?'once':'twice')+' and score '+points+' points.')
      .replace(/^Faça (\d+) retornos válidos e alcance (\d+) pontos\.$/,'Make $1 valid returns and reach $2 points.')
      .replace(/^Cumpra (\d+) desafios? e some (\d+) pontos\.$/,'Complete $1 challenge(s) and score $2 points.')
      .replace(/^Obtenha uma sequência crescente de (\d+) retornos e alcance (\d+) pontos\.$/,'Build an increasing sequence of $1 returns and reach $2 points.')
      .replace(/^No piso de (madeira|vidro|borracha), alcance (\d+) pontos\.$/,(_,floor,points)=>'On '+(floor==='madeira'?'wood':floor==='vidro'?'glass':'rubber')+', reach '+points+' points.')
      .replace(/^Faça (\d+) pontos e acerte (\d+) faixas diferentes\.$/,'Score $1 points and hit $2 different zones.')
      .replace(/^Faça (\d+) retornos limpos e some (\d+) pontos\.$/,'Make $1 clean returns and score $2 points.')
      .replace(/^Complete 5 lançamentos válidos e some (\d+) pontos\.$/,'Complete 5 valid shots and score $1 points.')
      .replace(/^Baralho (\d+): (\d+)\/300 desafios sinalizados · (\d+) disponíveis\.$/,'Deck $1: $2/300 challenges marked · $3 available.')
      .replace(/^Etapa concluída! Total do circuito: ([\d.]+) pontos\.$/,'Stage complete! Circuit total: $1 points.')
      .replace(/^Objetivo não alcançado em 5 lançamentos\. Clique em “Repetir etapa” para reiniciar este desafio\.$/,'Goal not reached in 5 shots. Select “Retry stage” to restart this challenge.')
      .replace(/^Domínio da madeira$/,'Wood Mastery').replace(/^Domínio do vidro$/,'Glass Mastery').replace(/^Domínio da borracha$/,'Rubber Mastery')
      .replace(/^A faixa (\d+) está proibida e zerará a jogada\.$/,'Zone $1 is forbidden and will cancel the shot.')
      .replace(/^RETORNO: faixa (\d+) — (\d+) pontos( · DESAFIO CUMPRIDO!)?$/,'RETURN: zone $1 — $2 points$3').replace(' · DESAFIO CUMPRIDO!',' · CHALLENGE COMPLETE!')
      .replace(/^RETORNO INVÁLIDO: não tocou a parede final\.$/,'INVALID RETURN: the puck did not touch the end wall.').replace(/^RETORNO INVÁLIDO · QUEIMADO: tocou a parede inicial — 0 pontos\.$/,'INVALID RETURN · BURNED: touched the starting wall — 0 points.')
      .replace(/^Força excessiva\. Você carregou cerca de (\d+)%\. Reduza um pouco, principalmente quando o 100 estiver perto do início\.$/,'Excessive power. You charged about $1%. Reduce it slightly, especially when the 100-point zone is near the start.')
      .replace(/^O botão não alcançou o fim iluminado\.(.*)$/,'The puck did not reach the illuminated end.$1').replace(' Combine a carga com mais impulso extra.',' Combine the charge with more extra boost.').replace(' Aumente em passos pequenos: o vidro responde rapidamente.',' Increase it in small steps: glass responds quickly.').replace(' Aumente a carga gradualmente.',' Increase the charge gradually.')
      .replace(/^Circuito concluído! ([\d.]+) pontos acumulados\. O próximo retirará outras 10 cartas do baralho\.$/,'Circuit complete! $1 accumulated points. The next circuit will draw 10 new cards from the deck.')
      .replace(/^A força escolhida também define o rebote…$/,'The selected power also determines the rebound…').replace(/^Não chegou à parede final: tentativa nula\.$/,'The puck did not reach the end wall: invalid attempt.')
      .replace(/^Força demais: o botão tocou a parede inicial e não pontuou\.$/,'Too much power: the puck touched the starting wall and scored no points.')
      .replace(/pontuação duplicada: \+(\d+) extra/g,'score doubled: +$1 extra').replace(/\+100 pelo Super 100/g,'+100 for Super 100').replace(/\+25 extra pelo desafio turbinado/g,'+25 extra for the boosted challenge').replace(/faixa (\d+) proibida: jogada zerada/g,'forbidden zone $1: shot canceled').replace(/\+40 por precisão central/g,'+40 for center precision').replace(/penalidade de (\d+) pontos/g,'$1-point penalty').replace(/sem bônus/g,'no bonus').replace(/ · EVENTO: /g,' · EVENT: ')
      .replace(/^Velocidade máxima: ([\d,]+) m\/s · Tempo: ([\d,]+) s · Distância: ([\d,]+) cm$/,'Maximum speed: $1 m/s · Time: $2 s · Distance: $3 cm')
      .replace(/^🪵 Madeira clássica · equilíbrio$/,'🪵 Classic wood · balanced').replace(/^💎 Vidro · alta sensibilidade$/,'💎 Glass · high sensitivity').replace(/^⬛ Borracha · maior resistência$/,'⬛ Rubber · greater resistance')
      .replace(/^(\d+)\/(\d+) medalhas · (\d+) brasas conquistadas$/,'$1/$2 medals · $3 embers earned').replace(/^Bloqueada · /,'Locked · ').replace(/^\+(\d+) brasas$/,'+$1 embers')
      .replace(/(\d+)\/(\d+) pontos/g,'$1/$2 points').replace(/(\d+)\/(\d+) faixas/g,'$1/$2 zones').replace(/(\d+)\/(\d+) retornos/g,'$1/$2 returns').replace(/(\d+)\/5 lançamentos/g,'$1/5 shots').replace(/(\d+)\/(\d+) desafios?/g,'$1/$2 challenges').replace(/(\d+)\/(\d+) melhor sequência/g,'$1/$2 best sequence')
      .replace(/^Rodada mental (\d+)\/5 · (\d+)\/(\d+) respostas corretas$/,'Mental round $1/5 · $2/$3 correct answers')
      .replace(/^Este símbolo é igual ao de (\d+) lançamento(?:s)? atrás\? Use sua memória; o símbolo anterior não será mostrado\.$/,'Is this symbol the same as $1 shot(s) ago? Use your memory; the previous symbol will not be shown.')
      .replace(/^Memorize este símbolo\. A comparação começa no lançamento (\d+)\.$/,'Memorize this symbol. Comparison starts on shot $1.')
      .replace(/^Fim da sessão: (\d+)\/(\d+) respostas corretas \((\d+)%\)\. Use Recomeçar para tentar novamente\.$/,'Session complete: $1/$2 correct answers ($3%). Select Restart to try again.');
    if(language==='en')text=text
      .replace(/^Sua vez · ([^ ]+) prefere retornos seguros\.$/,'Your turn · $1 prefers safe returns.')
      .replace(/^Sua vez · ([^ ]+) equilibra risco e precisão\.$/,'Your turn · $1 balances risk and accuracy.')
      .replace(/^Sua vez · ([^ ]+) arrisca força máxima\.$/,'Your turn · $1 risks maximum power.')
      .replace(/^([^ ]+) venceu!$/,'$1 won!')
      .replace(/^Final: Você (\d+) × ([^ ]+) (\d+)\.$/,'Final: You $1 × $2 $3.')
      .replace(/^🏁 (.+) Placar (\d+) × (\d+)\.$/,'🏁 $1 Score $2 × $3.')
      .replace(/^Vez de (.+)\.$/,'$1\'s turn.')
      .replace(/^Sala (.+)$/,'Room $1');
    else if(language==='es')text=text
      .replace(/^DESAFIO: pare na faixa (\d+) para ganhar \+(\d+) bônus$/,'DESAFÍO: detente en la zona $1 para ganar +$2 extra')
      .replace(/^(\d+) de (\d+)$/,'$1 de $2').replace(/^treino (\d+)$/,'entrenamiento $1').replace(/^Jogador (\d+)$/,'Jugador $1')
      .replace(/^Impulso extra: (\d+)%$/,'Impulso extra: $1%').replace(/^ETAPA (\d+) DE (\d+)(.*)$/,'ETAPA $1 DE $2$3')
      .replace(/^Rodada mental (\d+)\/5 · (\d+)\/(\d+) respostas corretas$/,'Ronda mental $1/5 · $2/$3 respuestas correctas')
      .replace(/^Memorize este símbolo\. A comparação começa no lançamento (\d+)\.$/,'Memoriza este símbolo. La comparación comienza en el tiro $1.')
      .replace(/^Este símbolo é igual ao de (\d+) lançamento(?:s)? atrás\? Use sua memória; o símbolo anterior não será mostrado\.$/,'¿Este símbolo es igual al de hace $1 tiro(s)? Usa tu memoria; el símbolo anterior no se mostrará.')
      .replace(/^Fim da sessão: (\d+)\/(\d+) respostas corretas \((\d+)%\)\. Use Recomeçar para tentar novamente\.$/,'Fin de la sesión: $1/$2 respuestas correctas ($3%). Usa Reiniciar para intentarlo de nuevo.')
      .replace(/^Sua vez · ([^ ]+) prefere retornos seguros\.$/,'Tu turno · $1 prefiere regresos seguros.').replace(/^Sua vez · ([^ ]+) equilibra risco e precisão\.$/,'Tu turno · $1 equilibra riesgo y precisión.').replace(/^Sua vez · ([^ ]+) arrisca força máxima\.$/,'Tu turno · $1 arriesga la fuerza máxima.');
    else text=text.replace(/^CHALLENGE: stop in the (\d+)-point zone to earn a \+(\d+) bonus$/,'DESAFIO: pare na faixa $1 para ganhar +$2 bônus').replace(/^(\d+) of (\d+)$/,'$1 de $2').replace(/^training (\d+)$/,'treino $1').replace(/^Player (\d+)$/,'Jogador $1').replace(/^Extra boost: (\d+)%$/,'Impulso extra: $1%').replace(/^STAGE (\d+) OF (\d+)(.*)$/,'ETAPA $1 DE $2$3');
    return text;
  }
  function translateText(node){
    if(!node?.nodeValue||!node.nodeValue.trim())return;
    if(language==='pt-BR'&&originals.has(node)){node.nodeValue=originals.get(node);originals.delete(node);return}
    const before=node.nodeValue,lead=before.match(/^\s*/)[0],trail=before.match(/\s*$/)[0],core=before.trim(),after=dynamic(core);
    if(after!==core){if(language!=='pt-BR'&&!originals.has(node))originals.set(node,before);node.nodeValue=lead+after+trail}
  }
  function apply(root=document){busy=true;const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>/^(SCRIPT|STYLE|TEXTAREA)$/.test(n.parentElement?.tagName)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}),nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(translateText);root.querySelectorAll?.('[placeholder]').forEach(el=>{if(language==='pt-BR'&&placeholderOriginals.has(el)){el.placeholder=placeholderOriginals.get(el);placeholderOriginals.delete(el);return}const next=dynamic(el.placeholder);if(next!==el.placeholder){if(language!=='pt-BR'&&!placeholderOriginals.has(el))placeholderOriginals.set(el,el.placeholder);el.placeholder=next}});root.querySelectorAll?.('#playerInputs input').forEach(el=>{if(/^(Jogador|Player|Jugador) \d+$/.test(el.value))el.value=dynamic(el.value)});document.documentElement.lang=language;document.title=language==='en'?'Queima-Queima e Ganhe! — Precision Game':language==='es'?'¡Queima-Queima y Gana! — Juego de precisión':'Queima-Queima e Ganhe!';const select=document.querySelector('#precisionLanguage');if(select)select.value=language;busy=false}
  function setLanguage(value){language=normalize(value);localStorage.setItem('qqLanguage',language);apply();dispatchEvent(new CustomEvent('qq-language-change',{detail:{language}}))}
  function installPicker(){if(document.querySelector('#precisionLanguage'))return;const style=document.createElement('style');style.textContent='.precision-language{display:flex;justify-content:center;align-items:center;gap:7px;margin:0 0 10px;color:#fff;font-size:.75rem;font-weight:800}.precision-language select{padding:6px 9px;border:1px solid #70cce9;border-radius:8px;background:#173249;color:#fff;font-weight:800}';document.head.append(style);const label=document.createElement('label');label.className='precision-language';label.innerHTML='<span>Idioma</span><select id="precisionLanguage"><option value="pt-BR">Português</option><option value="en">English</option><option value="es">Español</option></select>';document.querySelector('main')?.prepend(label);label.querySelector('select').value=language;label.querySelector('select').addEventListener('change',event=>setLanguage(event.target.value))}
  function init(){
    installPicker();apply();
    const pendingText=new Set(),pendingRoots=new Set();let scheduled=false;
    const flush=()=>{scheduled=false;if(language==='pt-BR'||busy){pendingText.clear();pendingRoots.clear();return}busy=true;pendingText.forEach(translateText);pendingRoots.forEach(root=>apply(root));pendingText.clear();pendingRoots.clear();busy=false};
    new MutationObserver(records=>{
      if(language==='pt-BR'||busy)return;
      records.forEach(record=>record.type==='characterData'?pendingText.add(record.target):record.addedNodes.forEach(node=>{if(node.nodeType===Node.TEXT_NODE)pendingText.add(node);else if(node.nodeType===Node.ELEMENT_NODE)pendingRoots.add(node)}));
      if(!scheduled){scheduled=true;requestAnimationFrame(flush)}
    }).observe(document.body,{subtree:true,childList:true,characterData:true});
  }
  if(document.readyState==='loading')addEventListener('DOMContentLoaded',init,{once:true});else init();
  window.qqPrecisionI18n={apply,setLanguage,translateValue:dynamic,get language(){return language}};
})();
