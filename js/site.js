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

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();
