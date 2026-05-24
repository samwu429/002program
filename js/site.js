(function(){
  function initNav(){
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.topnav');
    if(!toggle || !nav) return;
    const close = ()=>{
      toggle.classList.remove('open');
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', ev=>{
      ev.stopPropagation();
      const open = !toggle.classList.contains('open');
      toggle.classList.toggle('open', open);
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click', close);
    });
    document.addEventListener('click', ev=>{
      if(!nav.classList.contains('open')) return;
      if(nav.contains(ev.target) || toggle.contains(ev.target)) return;
      close();
    });
    document.addEventListener('keydown', ev=>{
      if(ev.key === 'Escape') close();
    });
    window.addEventListener('resize', ()=>{
      if(window.innerWidth > 920) close();
    });
  }

  function initLang(){
    const btn = document.querySelector('.lang-toggle');
    if(!btn) return;
    const html = document.documentElement;
    const apply = (lang)=>{
      html.setAttribute('lang', lang);
      try{ localStorage.setItem('site.lang', lang); }catch(e){}
      btn.setAttribute('aria-label', lang === 'zh' ? 'Switch to English' : '切换到中文');
    };
    btn.addEventListener('click', ()=>{
      const cur = html.getAttribute('lang') === 'en' ? 'en' : 'zh';
      apply(cur === 'zh' ? 'en' : 'zh');
    });
  }

  function start(){ initNav(); initLang(); }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
