(function(){
  const DIRS = ['up','down','left','right','up-right','up-left','down-right','down-left'];

  function resolveDir(el){
    const explicit = el.getAttribute('data-punch');
    if(explicit && DIRS.includes(explicit)) return explicit;
    const r = el.getBoundingClientRect();
    const cx = window.innerWidth/2;
    const cy = window.innerHeight/2;
    const ex = r.left + r.width/2;
    const ey = r.top + r.height/2;
    const dx = ex - cx;
    const dy = ey - cy;
    const ax = Math.abs(dx);
    const ay = Math.abs(dy);
    if(ax < 60 && ay < 60) return 'up';
    if(ax > ay * 2.2) return dx > 0 ? 'right' : 'left';
    if(ay > ax * 2.2) return dy > 0 ? 'down' : 'up';
    if(dx > 0 && dy > 0) return 'down-right';
    if(dx > 0 && dy < 0) return 'up-right';
    if(dx < 0 && dy > 0) return 'down-left';
    return 'up-left';
  }

  function gloveMarkup(){
    return `
      <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <radialGradient id="pg1" cx="38%" cy="32%" r="78%">
            <stop offset="0%" stop-color="#ff5959"/>
            <stop offset="55%" stop-color="#dc2626"/>
            <stop offset="100%" stop-color="#5e0f0f"/>
          </radialGradient>
          <linearGradient id="pcuff" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#262626"/>
            <stop offset="100%" stop-color="#0c0c0c"/>
          </linearGradient>
        </defs>
        <g transform="translate(0,4)">
          <path d="M70 122 C 64 86 86 70 104 74 C 116 76 122 90 120 108 C 118 130 104 152 86 154 C 70 156 74 138 70 122 Z" fill="url(#pg1)" stroke="#1a1a1a" stroke-width="4" stroke-linejoin="round"/>
          <path d="M62 124 C 56 70 110 44 158 64 C 206 84 216 142 196 174 C 178 202 134 210 102 198 C 70 186 64 162 62 124 Z" fill="url(#pg1)" stroke="#1a1a1a" stroke-width="4" stroke-linejoin="round"/>
          <path d="M86 96 C 116 86 168 90 200 108" stroke="#7a1414" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>
          <path d="M82 148 C 116 154 168 152 200 142" stroke="#7a1414" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>
          <path d="M168 80 C 184 88 196 104 200 122" stroke="#ffb4b4" stroke-width="6" fill="none" stroke-linecap="round" opacity=".55"/>
          <rect x="78" y="184" width="124" height="38" rx="4" fill="url(#pcuff)" stroke="#000" stroke-width="3"/>
          <rect x="78" y="190" width="124" height="6" fill="#d4af37"/>
          <rect x="78" y="212" width="124" height="3" fill="#d4af37" opacity=".7"/>
          <text x="140" y="138" text-anchor="middle" font-family="Impact, 'Arial Black', sans-serif" font-size="36" font-weight="900" fill="#1a1a1a" letter-spacing="2">K.O.</text>
        </g>
      </svg>`;
  }

  function crackMarkup(){
    return `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g fill="none" stroke="#ffe6a8" stroke-width="3" stroke-linecap="round" opacity=".95">
          <path d="M100 100 L40 20"/><path d="M100 100 L70 12"/><path d="M100 100 L130 8"/>
          <path d="M100 100 L180 28"/><path d="M100 100 L196 90"/><path d="M100 100 L184 168"/>
          <path d="M100 100 L120 196"/><path d="M100 100 L60 192"/><path d="M100 100 L8 150"/>
          <path d="M100 100 L4 80"/><path d="M100 100 L18 30"/>
        </g>
        <g fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity=".85">
          <path d="M100 100 L52 56"/><path d="M100 100 L150 50"/>
          <path d="M100 100 L156 142"/><path d="M100 100 L46 142"/>
        </g>
        <circle cx="100" cy="100" r="6" fill="#fff"/>
      </svg>`;
  }

  let inFlight = false;
  function fire(el){
    if(inFlight) return;
    const href = el.getAttribute('data-punch-to') || el.getAttribute('href');
    if(!href) return;
    inFlight = true;

    const dir = resolveDir(el);
    const r = el.getBoundingClientRect();
    const fx = ((r.left + r.width/2) / window.innerWidth) * 100;
    const fy = ((r.top + r.height/2) / window.innerHeight) * 100;

    const overlay = document.createElement('div');
    overlay.className = 'punch-overlay punch-' + dir;
    overlay.style.setProperty('--fx', fx + '%');
    overlay.style.setProperty('--fy', fy + '%');
    overlay.innerHTML = `
      <div class="flash"></div>
      <div class="crack">${crackMarkup()}</div>
      <div class="glove-wrap">${gloveMarkup()}</div>
    `;
    document.body.appendChild(overlay);
    document.body.classList.add('punch-locking');

    window.setTimeout(()=>document.body.classList.add('punch-shake'), 280);
    window.setTimeout(()=>document.body.classList.remove('punch-shake'), 660);
    window.setTimeout(()=>{ window.location.href = href; }, 540);
  }

  function init(){
    document.querySelectorAll('[data-punch-to]').forEach(el=>{
      el.addEventListener('click', ev=>{
        ev.preventDefault();
        fire(el);
      });
      el.addEventListener('keydown', ev=>{
        if(ev.key === 'Enter' || ev.key === ' '){
          ev.preventDefault();
          fire(el);
        }
      });
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
