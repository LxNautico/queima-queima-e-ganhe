(() => {
  const board=document.querySelector('#board'),puck=document.querySelector('#puck'),flick=document.querySelector('#flick'),precision=document.querySelector('#precision');
  if(!board||!puck||!flick||!precision)return;
  const trail=document.createElement('canvas');trail.id='shotTrail';trail.setAttribute('aria-hidden','true');board.append(trail);
  const review=document.createElement('section');review.id='shotReview';review.hidden=true;review.setAttribute('aria-live','polite');review.innerHTML='<span id="shotGradeIcon">🎯</span><div><small>AVALIAÇÃO DO LANÇAMENTO</small><strong id="shotGrade">—</strong><p id="shotTip"></p></div>';
  (document.querySelector('#metrics')||precision).after(review);
  const style=document.createElement('style');style.textContent=`
    #shotTrail{position:absolute;z-index:3;inset:0;width:100%;height:100%;pointer-events:none;opacity:.8}
    #shotReview{display:grid;grid-template-columns:42px 1fr;align-items:center;gap:10px;width:min(520px,100%);margin:7px auto 10px;padding:8px 12px;border:1px solid #c89143;border-radius:11px;background:#fff9e8;color:#503522;text-align:left;animation:shotReviewIn .25s ease-out}
    #shotReview[hidden]{display:none}#shotGradeIcon{font-size:1.7rem;text-align:center}#shotReview small{display:block;color:#916032;font-size:.58rem;font-weight:900;letter-spacing:.1em}#shotGrade{font:700 1.05rem Georgia}#shotTip{margin:2px 0 0;font-size:.72rem;color:#70533b}
    #shotReview[data-grade="perfect"]{border-color:#d93f2f;background:#ffe4ac}#shotReview[data-grade="great"]{border-color:#55a065;background:#e9f4d7}#shotReview[data-grade="risk"]{border-color:#d18b2d;background:#fff0ca}#shotReview[data-grade="fail"]{border-color:#c34a3c;background:#ffe0d5}
    @keyframes shotReviewIn{from{opacity:0;transform:translateY(-5px)}}`;
  document.head.append(style);
  const icon=review.querySelector('#shotGradeIcon'),grade=review.querySelector('#shotGrade'),tip=review.querySelector('#shotTip');
  let context,lastPoint,lastX=.04,stopX=.04,direction=1,drawing=false,lastResult='';
  const finishWithFeedback=finish;finish=function(){stopX=x;drawing=false;finishWithFeedback()};
  function size(){const rect=board.getBoundingClientRect(),ratio=Math.min(2,devicePixelRatio||1);trail.width=Math.max(1,Math.round(rect.width*ratio));trail.height=Math.max(1,Math.round(rect.height*ratio));context=trail.getContext('2d');context.scale(ratio,ratio);lastPoint=null}
  function clearTrail(){size();context.clearRect(0,0,trail.width,trail.height);lastX=.04;direction=1;drawing=true;review.hidden=true}
  function sample(){if(!drawing){requestAnimationFrame(sample);return}const rect=board.getBoundingClientRect(),x=(parseFloat(puck.style.left)||4)/100;if(x<lastX-.0001)direction=-1;else if(x>lastX+.0001)direction=1;const point={x:x*rect.width,y:rect.height*(direction>0?.46:.56)};if(lastPoint&&Math.abs(point.x-lastPoint.x)>.2){context.beginPath();context.moveTo(lastPoint.x,lastPoint.y);context.lineTo(point.x,point.y);context.lineWidth=direction>0?2:3;context.lineCap='round';context.strokeStyle=direction>0?'rgba(255,255,255,.62)':'rgba(255,190,55,.78)';context.stroke()}lastPoint=point;lastX=x;if(!flick.textContent.includes('MOVIMENTO')&&Math.abs(x-.04)>.001)drawing=false;requestAnimationFrame(sample)}
  function show(type,symbol,title,message){review.dataset.grade=type;icon.textContent=symbol;grade.textContent=title;tip.textContent=message;review.hidden=false}
  function classify(){const text=precision.textContent.trim();if(!/^RETORNO/i.test(text)||text===lastResult)return;lastResult=text;const finalX=stopX,shot=window.qqeLastShot||{};if(/QUEIMADO/i.test(text)){show('fail','💥','Força excessiva','A peça alcançou a parede inicial. Reduza um pouco a carga.');return}if(/INVÁLIDO|não tocou/i.test(text)){show('fail','↛','Impulso insuficiente','A peça não alcançou o fim iluminado. Aumente um pouco a força.');return}if(shot.hitChallenge||/DESAFIO CUMPRIDO/i.test(text)){show('perfect','🏹','Na mosca!','Você acertou exatamente a faixa pedida e conquistou o bônus.');return}if(Number(shot.rawPoints)===100||precision.classList.contains('precision-burn')){show('perfect','🔥','Queima perfeita!','Retorno na faixa de 100 pontos. Excelente controle.');return}const zone=Math.min(5,Math.floor(finalX*6)),center=(zone+.5)/6,deviation=Math.abs(finalX-center)/(1/12);if(deviation<=.2)show('great','🎯','Excelente','A peça parou muito perto do centro da faixa.');else if(deviation<=.5)show('great','✓','Retorno seguro','Boa margem em relação às bordas da faixa.');else show('risk','⚠','Retorno arriscado','A peça parou perto da divisão. Um pequeno ajuste muda o resultado.');}
  flick.addEventListener('pointerdown',()=>{if(!flick.disabled)clearTrail()},true);
  new MutationObserver(()=>setTimeout(classify,0)).observe(precision,{subtree:true,childList:true,characterData:true});
  addEventListener('resize',()=>{if(!drawing)size()});size();requestAnimationFrame(sample);
})();
