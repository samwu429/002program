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
    const btn = document.querySelector('.lang-switch');
    if(!btn) return;
    const html = document.documentElement;
    const sync = ()=>{
      const cur = html.getAttribute('lang') === 'zh' ? 'zh' : 'en';
      btn.setAttribute('aria-checked', String(cur === 'zh'));
      btn.setAttribute('aria-label', cur === 'en' ? 'Switch language · 切换到中文' : 'Switch language · Switch to English');
    };
    const apply = (lang)=>{
      html.setAttribute('lang', lang);
      try{ localStorage.setItem('site.lang', lang); }catch(e){}
      sync();
    };
    btn.addEventListener('click', ()=>{
      const cur = html.getAttribute('lang') === 'zh' ? 'zh' : 'en';
      apply(cur === 'en' ? 'zh' : 'en');
    });
    sync();
  }

  function start(){ initNav(); initLang(); }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
