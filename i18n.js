(() => {
  const dictionaries=window.QQ_I18N_DICTIONARIES||{},storageKey='qqLanguage',supported=['pt-BR','en','es'];
  const normalize=value=>{const code=String(value||'').toLowerCase();return code.startsWith('en')?'en':code.startsWith('es')?'es':'pt-BR'};
  let language=normalize(localStorage.getItem(storageKey)||navigator.language);
  const translate=(key,fallback='')=>dictionaries[language]?.[key]??dictionaries['pt-BR']?.[key]??fallback??key;
  function apply(root=document){
    root.querySelectorAll('[data-i18n]').forEach(element=>{element.textContent=translate(element.dataset.i18n,element.textContent)});
    root.querySelectorAll('[data-i18n-aria]').forEach(element=>element.setAttribute('aria-label',translate(element.dataset.i18nAria,element.getAttribute('aria-label'))));
    root.querySelectorAll('[data-i18n-placeholder]').forEach(element=>element.setAttribute('placeholder',translate(element.dataset.i18nPlaceholder,element.getAttribute('placeholder'))));
    document.documentElement.lang=language;document.title=translate(document.querySelector('title[data-i18n]')?.dataset.i18n||'meta.title',document.title);
    const select=document.querySelector('#languageSelect');if(select)select.value=language;
  }
  function setLanguage(value){language=supported.includes(value)?value:normalize(value);localStorage.setItem(storageKey,language);apply();dispatchEvent(new CustomEvent('qq-language-change',{detail:{language}}))}
  window.qqI18n={t:translate,apply,setLanguage,get language(){return language},supported};
  addEventListener('DOMContentLoaded',()=>{apply();document.querySelector('#languageSelect')?.addEventListener('change',event=>setLanguage(event.target.value))});
})();
