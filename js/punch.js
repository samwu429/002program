(function(){
  const DIRS = ['up','down','left','right','up-left','up-right','down-left','down-right'];

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

  function computeStart(dir, rect){
    const W = window.innerWidth;
    const H = window.innerHeight;
    const bx = rect.left + rect.width/2;
    const by = rect.top + rect.height/2;
    const M = 260;
    let gx = 0, gy = 0, rot = 0;
    if(dir === 'up')         { gx = 0;             gy = (H - by) + M; rot = -6; }
    else if(dir === 'down')  { gx = 0;             gy = -(by + M);    rot = 6; }
    else if(dir === 'left')  { gx = (W - bx) + M;  gy = 0;            rot = -12; }
    else if(dir === 'right') { gx = -(bx + M);     gy = 0;            rot = 12; }
    else if(dir === 'up-left')   { gx = (W - bx) + M; gy = (H - by) + M; rot = -18; }
    else if(dir === 'up-right')  { gx = -(bx + M);    gy = (H - by) + M; rot = 18; }
    else if(dir === 'down-left') { gx = (W - bx) + M; gy = -(by + M);    rot = -18; }
    else if(dir === 'down-right'){ gx = -(bx + M);    gy = -(by + M);    rot = 18; }
    return { gx, gy, rot };
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

  const SHARDS = [
    { clip:'polygon(45% 52%, 15% 0%, 75% 0%)',                              tx: 20,  ty:-110, r:-14 },
    { clip:'polygon(45% 52%, 75% 0%, 100% 0%, 100% 40%)',                   tx: 100, ty: -60, r: 28 },
    { clip:'polygon(45% 52%, 100% 40%, 100% 100%, 60% 100%)',               tx: 115, ty:  60, r: 52 },
    { clip:'polygon(45% 52%, 60% 100%, 10% 100%)',                          tx: -10, ty: 120, r:-22 },
    { clip:'polygon(45% 52%, 10% 100%, 0% 100%, 0% 0%, 15% 0%)',            tx:-110, ty: -28, r:-52 },
  ];

  function readBackground(el){
    const cs = window.getComputedStyle(el);
    const bgImage = cs.backgroundImage;
    const bgColor = cs.backgroundColor;
    const borderColor = cs.borderTopColor;
    if(bgImage && bgImage !== 'none' && !bgImage.startsWith('url(')) return bgImage;
    if(bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') return bgColor;
    if(borderColor && borderColor !== 'rgba(0, 0, 0, 0)' && borderColor !== 'transparent') return 'linear-gradient(135deg,' + borderColor + ',#dc2626)';
    return 'linear-gradient(135deg,#2a2a2a,#dc2626)';
  }

  function shatter(el, rect){
    const bg = readBackground(el);
    const container = document.createElement('div');
    container.className = 'btn-shatter';
    container.style.left = rect.left + 'px';
    container.style.top = rect.top + 'px';
    container.style.width = rect.width + 'px';
    container.style.height = rect.height + 'px';

    el.style.visibility = 'hidden';

    const flash = document.createElement('div');
    flash.className = 'btn-flash';
    container.appendChild(flash);

    SHARDS.forEach((s, i)=>{
      const sd = document.createElement('div');
      sd.className = 'shard';
      sd.style.background = bg;
      sd.style.clipPath = s.clip;
      sd.style.webkitClipPath = s.clip;
      sd.style.setProperty('--tx', s.tx + 'px');
      sd.style.setProperty('--ty', s.ty + 'px');
      sd.style.setProperty('--r', s.r + 'deg');
      sd.style.animationDelay = (i * 14) + 'ms';
      container.appendChild(sd);
    });

    const crackEl = document.createElement('div');
    crackEl.className = 'btn-crack-overlay';
    crackEl.innerHTML = crackMarkup();
    container.appendChild(crackEl);

    document.body.appendChild(container);
  }

  let inFlight = false;
  function fire(el){
    if(inFlight) return;
    const href = el.getAttribute('data-punch-to') || el.getAttribute('href');
    if(!href) return;
    inFlight = true;

    const dir = resolveDir(el);
    const rect = el.getBoundingClientRect();
    const bx = rect.left + rect.width/2;
    const by = rect.top + rect.height/2;
    const { gx, gy, rot } = computeStart(dir, rect);

    const overlay = document.createElement('div');
    overlay.className = 'punch-overlay';
    overlay.style.setProperty('--bx', bx + 'px');
    overlay.style.setProperty('--by', by + 'px');
    overlay.style.setProperty('--gx', gx + 'px');
    overlay.style.setProperty('--gy', gy + 'px');
    overlay.style.setProperty('--rot', rot + 'deg');
    overlay.innerHTML = `<div class="glove-wrap">${gloveMarkup()}</div>`;
    document.body.appendChild(overlay);
    document.body.classList.add('punch-locking');

    const IMPACT = 360;
    const TOTAL = 860;

    window.setTimeout(()=>{
      shatter(el, rect);
      document.body.classList.add('punch-shake');
    }, IMPACT);
    window.setTimeout(()=>document.body.classList.remove('punch-shake'), IMPACT + 320);
    window.setTimeout(()=>{ window.location.href = href; }, TOTAL);
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
