(() => {
  const installButton=document.querySelector('#installApp'),installHelp=document.querySelector('#installHelp');let installPrompt=null;
  if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
  addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;installButton.hidden=false});
  installButton?.addEventListener('click',async()=>{if(!installPrompt){installHelp.hidden=false;return}installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;installButton.hidden=true});
  addEventListener('appinstalled',()=>{installPrompt=null;installButton.hidden=true;installHelp.textContent='Aplicativo instalado com sucesso!';installHelp.hidden=false});
})();
