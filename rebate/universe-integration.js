document.addEventListener('DOMContentLoaded',()=>{
  const link=document.createElement('a');
  link.className='universe-back';
  link.href='../index.html';
  link.textContent='← Universo Queima-Queima';
  link.setAttribute('aria-label','Voltar ao Universo Queima-Queima');
  document.body.prepend(link);
});
