(()=>{
  const key='qqLanguage',pages={'pt-BR':'guia.html',en:'guide.html',es:'guia-es.html'};
  const normalize=value=>{const code=String(value||'').toLowerCase();return code.startsWith('en')?'en':code.startsWith('es')?'es':'pt-BR'};
  const current=location.pathname.endsWith('/guide.html')?'en':location.pathname.endsWith('/guia-es.html')?'es':'pt-BR';
  const selected=normalize(localStorage.getItem(key)||navigator.language);
  if(selected!==current){location.replace('./'+pages[selected]);return}
  addEventListener('DOMContentLoaded',()=>{const picker=document.querySelector('#guideLanguage');if(!picker)return;picker.value=current;picker.addEventListener('change',event=>{const language=normalize(event.target.value);localStorage.setItem(key,language);location.href='./'+pages[language]})});
})();
