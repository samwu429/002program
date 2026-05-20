(function(){
  const DIRS = ['up','down','left','right','up-left','up-right','down-left','down-right'];
  const SPARK_COLORS = ['#f1c668','#d4a64a','#fff5d0','#ffba5a','#c8302a','#fff5d0','#f1c668','#ffd680'];

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
    if(ax < 70 && ay < 70) return 'up';
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
    const M = 280;
    let gx = 0, gy = 0, rot = 0, angDeg = 0;
    if(dir === 'up')         { gx = 0;             gy = (H - by) + M; rot = -8;  angDeg = 270; }
    else if(dir === 'down')  { gx = 0;             gy = -(by + M);    rot = 8;   angDeg = 90; }
    else if(dir === 'left')  { gx = (W - bx) + M;  gy = 0;            rot = -14; angDeg = 180; }
    else if(dir === 'right') { gx = -(bx + M);     gy = 0;            rot = 14;  angDeg = 0; }
    else if(dir === 'up-left')   { gx = (W - bx) + M; gy = (H - by) + M; rot = -22; angDeg = 225; }
    else if(dir === 'up-right')  { gx = -(bx + M);    gy = (H - by) + M; rot = 22;  angDeg = 315; }
    else if(dir === 'down-left') { gx = (W - bx) + M; gy = -(by + M);    rot = -22; angDeg = 135; }
    else if(dir === 'down-right'){ gx = -(bx + M);    gy = -(by + M);    rot = 22;  angDeg = 45; }
    return { gx, gy, rot, angDeg };
  }

  function gloveMarkup(){
    return `
      <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <radialGradient id="pgv1" cx="38%" cy="32%" r="78%">
            <stop offset="0%" stop-color="#1c1a14"/>
            <stop offset="55%" stop-color="#0e0c08"/>
            <stop offset="100%" stop-color="#040302"/>
          </radialGradient>
          <linearGradient id="pgvg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#f1c668"/>
            <stop offset="55%" stop-color="#d4a64a"/>
            <stop offset="100%" stop-color="#7a5418"/>
          </linearGradient>
          <linearGradient id="pgvcuff" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#1a1610"/>
            <stop offset="100%" stop-color="#050402"/>
          </linearGradient>
        </defs>
        <g transform="translate(0,4)">
          <path d="M70 122 C 64 86 86 70 104 74 C 116 76 122 90 120 108 C 118 130 104 152 86 154 C 70 156 74 138 70 122 Z" fill="url(#pgv1)" stroke="url(#pgvg)" stroke-width="3" stroke-linejoin="round"/>
          <path d="M62 124 C 56 70 110 44 158 64 C 206 84 216 142 196 174 C 178 202 134 210 102 198 C 70 186 64 162 62 124 Z" fill="url(#pgv1)" stroke="url(#pgvg)" stroke-width="3.5" stroke-linejoin="round"/>
          <path d="M86 96 C 116 86 168 90 200 108" stroke="url(#pgvg)" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/>
          <path d="M82 148 C 116 154 168 152 200 142" stroke="url(#pgvg)" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/>
          <path d="M168 80 C 184 88 196 104 200 122" stroke="#f1c668" stroke-width="5" fill="none" stroke-linecap="round" opacity=".35"/>
          <g transform="translate(118,114)" opacity=".9">
            <path d="M-22 -6 C -28 -6 -32 0 -28 8 C -25 14 -19 15 -17 12 C -18 9 -18 4 -17 0 C -18 -2 -20 -6 -22 -6 Z" fill="url(#pgvg)"/>
            <path d="M22 -6 C 28 -6 32 0 28 8 C 25 14 19 15 17 12 C 18 9 18 4 17 0 C 18 -2 20 -6 22 -6 Z" fill="url(#pgvg)"/>
            <path d="M0 -10 C -8 -10 -12 -4 -12 4 C -12 12 -8 18 -4 20 L -4 26 L 4 26 L 4 20 C 8 18 12 12 12 4 C 12 -4 8 -10 0 -10 Z" fill="url(#pgvg)"/>
          </g>
          <rect x="78" y="184" width="124" height="38" rx="4" fill="url(#pgvcuff)" stroke="url(#pgvg)" stroke-width="2"/>
          <rect x="78" y="190" width="124" height="5" fill="url(#pgvg)"/>
          <rect x="78" y="213" width="124" height="3" fill="url(#pgvg)" opacity=".7"/>
        </g>
      </svg>`;
  }

  function radialCracksMarkup(){
    const rays = [];
    const lines = 36;
    for(let i = 0; i < lines; i++){
      const ang = (i * 360 / lines) + (Math.random() - .5) * 5;
      const len = 700 + Math.random() * 500;
      const x2 = 1200 + Math.cos(ang * Math.PI/180) * len;
      const y2 = 1200 + Math.sin(ang * Math.PI/180) * len;
      const w = .5 + Math.random() * 2.5;
      const c = Math.random() > .7 ? '#fff5d0' : (Math.random() > .5 ? '#f1c668' : '#d4a64a');
      rays.push(`<line x1="1200" y1="1200" x2="${x2.toFixed(0)}" y2="${y2.toFixed(0)}" stroke="${c}" stroke-width="${w.toFixed(2)}" stroke-linecap="round" opacity="${(.5 + Math.random() * .5).toFixed(2)}"/>`);
    }
    for(let i = 0; i < 8; i++){
      const ang = Math.random() * 360;
      const r1 = 60 + Math.random() * 80;
      const r2 = r1 + 60 + Math.random() * 120;
      const x1 = 1200 + Math.cos(ang * Math.PI/180) * r1;
      const y1 = 1200 + Math.sin(ang * Math.PI/180) * r1;
      const x2 = 1200 + Math.cos((ang + 35 + Math.random() * 30) * Math.PI/180) * r2;
      const y2 = 1200 + Math.sin((ang + 35 + Math.random() * 30) * Math.PI/180) * r2;
      rays.push(`<line x1="${x1.toFixed(0)}" y1="${y1.toFixed(0)}" x2="${x2.toFixed(0)}" y2="${y2.toFixed(0)}" stroke="#fff5d0" stroke-width="1.5" stroke-linecap="round" opacity=".7"/>`);
    }
    return `<svg viewBox="0 0 2400 2400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${rays.join('')}<circle cx="1200" cy="1200" r="14" fill="#fff5d0"/><circle cx="1200" cy="1200" r="30" fill="none" stroke="#f1c668" stroke-width="2" opacity=".7"/></svg>`;
  }

  function btnCrackMarkup(){
    return `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g fill="none" stroke="#f1c668" stroke-width="3" stroke-linecap="round" opacity=".98">
          <path d="M100 100 L40 20"/><path d="M100 100 L70 12"/><path d="M100 100 L130 8"/>
          <path d="M100 100 L180 28"/><path d="M100 100 L196 90"/><path d="M100 100 L184 168"/>
          <path d="M100 100 L120 196"/><path d="M100 100 L60 192"/><path d="M100 100 L8 150"/>
          <path d="M100 100 L4 80"/><path d="M100 100 L18 30"/>
        </g>
        <g fill="none" stroke="#fff5d0" stroke-width="1.5" stroke-linecap="round" opacity=".95">
          <path d="M100 100 L52 56"/><path d="M100 100 L150 50"/>
          <path d="M100 100 L156 142"/><path d="M100 100 L46 142"/>
          <path d="M100 100 L100 30"/><path d="M100 100 L170 100"/>
        </g>
        <circle cx="100" cy="100" r="5" fill="#fff5d0"/>
      </svg>`;
  }

  const SHARDS_12 = [
    'polygon(50% 50%, 22% 0%, 50% 0%)',
    'polygon(50% 50%, 50% 0%, 78% 0%)',
    'polygon(50% 50%, 78% 0%, 100% 0%, 100% 28%)',
    'polygon(50% 50%, 100% 28%, 100% 58%)',
    'polygon(50% 50%, 100% 58%, 100% 100%, 72% 100%)',
    'polygon(50% 50%, 72% 100%, 42% 100%)',
    'polygon(50% 50%, 42% 100%, 14% 100%)',
    'polygon(50% 50%, 14% 100%, 0% 100%, 0% 68%)',
    'polygon(50% 50%, 0% 68%, 0% 32%)',
    'polygon(50% 50%, 0% 32%, 0% 0%, 22% 0%)',
    'polygon(50% 50%, 28% 28%, 50% 30%)',
    'polygon(50% 50%, 50% 30%, 72% 28%)',
  ];

  function shardVector(i, n){
    const a = (i / n) * Math.PI * 2 + (Math.random() - .5) * .4;
    const dist = 90 + Math.random() * 90;
    return {
      tx: Math.cos(a) * dist,
      ty: Math.sin(a) * dist - 20,
      r: (Math.random() - .5) * 220,
    };
  }

  function readBackground(el){
    const cs = window.getComputedStyle(el);
    const bgImage = cs.backgroundImage;
    const bgColor = cs.backgroundColor;
    const borderColor = cs.borderTopColor;
    if(bgImage && bgImage !== 'none' && !bgImage.startsWith('url(')) return bgImage;
    if(bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') return bgColor;
    if(borderColor && borderColor !== 'rgba(0, 0, 0, 0)') return 'linear-gradient(135deg,' + borderColor + ',#d4a64a)';
    return 'linear-gradient(135deg,#181410,#d4a64a)';
  }

  function shatter(el, rect){
    const bg = readBackground(el);
    const cs = window.getComputedStyle(el);
    const container = document.createElement('div');
    container.className = 'btn-shatter';
    container.style.left = rect.left + 'px';
    container.style.top = rect.top + 'px';
    container.style.width = rect.width + 'px';
    container.style.height = rect.height + 'px';

    el.style.visibility = 'hidden';

    const flash = document.createElement('div');
    flash.className = 'btn-coreflash';
    container.appendChild(flash);

    SHARDS_12.forEach((clip, i)=>{
      const v = shardVector(i, SHARDS_12.length);
      const sd = document.createElement('div');
      sd.className = 'shard';
      sd.style.background = bg;
      sd.style.clipPath = clip;
      sd.style.webkitClipPath = clip;
      sd.style.setProperty('--tx', v.tx.toFixed(1) + 'px');
      sd.style.setProperty('--ty', v.ty.toFixed(1) + 'px');
      sd.style.setProperty('--r', v.r.toFixed(1) + 'deg');
      sd.style.animationDelay = (i * 9) + 'ms';
      container.appendChild(sd);
    });

    const crackEl = document.createElement('div');
    crackEl.className = 'btn-crack-svg';
    crackEl.innerHTML = btnCrackMarkup();
    container.appendChild(crackEl);

    document.body.appendChild(container);
  }

  let _audio = null;
  function getAudio(){
    if(_audio) return _audio;
    try{
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if(!Ctx) return null;
      _audio = new Ctx();
    }catch(e){ return null; }
    return _audio;
  }
  function playImpact(){
    const ctx = getAudio();
    if(!ctx) return;
    const now = ctx.currentTime;

    const o1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    o1.type = 'sine';
    o1.frequency.setValueAtTime(180, now);
    o1.frequency.exponentialRampToValueAtTime(38, now + 0.22);
    g1.gain.setValueAtTime(0.0001, now);
    g1.gain.exponentialRampToValueAtTime(0.9, now + 0.006);
    g1.gain.exponentialRampToValueAtTime(0.0008, now + 0.32);
    o1.connect(g1).connect(ctx.destination);
    o1.start(now);
    o1.stop(now + 0.34);

    const o2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    o2.type = 'triangle';
    o2.frequency.setValueAtTime(420, now);
    o2.frequency.exponentialRampToValueAtTime(90, now + 0.16);
    g2.gain.setValueAtTime(0.0001, now);
    g2.gain.exponentialRampToValueAtTime(0.5, now + 0.004);
    g2.gain.exponentialRampToValueAtTime(0.0006, now + 0.22);
    o2.connect(g2).connect(ctx.destination);
    o2.start(now);
    o2.stop(now + 0.24);

    const dur = 0.28;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for(let i = 0; i < data.length; i++){
      const env = Math.pow(1 - i / data.length, 2.2);
      data[i] = (Math.random() * 2 - 1) * env;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const flt = ctx.createBiquadFilter();
    flt.type = 'highpass';
    flt.frequency.value = 1600;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.65, now);
    ng.gain.exponentialRampToValueAtTime(0.0008, now + dur);
    src.connect(flt).connect(ng).connect(ctx.destination);
    src.start(now);

    const dur2 = 0.6;
    const buf2 = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur2), ctx.sampleRate);
    const data2 = buf2.getChannelData(0);
    for(let i = 0; i < data2.length; i++){
      const env = Math.pow(1 - i / data2.length, 3);
      data2[i] = (Math.random() * 2 - 1) * env * 0.35;
    }
    const src2 = ctx.createBufferSource();
    src2.buffer = buf2;
    const flt2 = ctx.createBiquadFilter();
    flt2.type = 'lowpass';
    flt2.frequency.value = 280;
    const ng2 = ctx.createGain();
    ng2.gain.setValueAtTime(0.5, now);
    ng2.gain.exponentialRampToValueAtTime(0.0008, now + dur2);
    src2.connect(flt2).connect(ng2).connect(ctx.destination);
    src2.start(now);
  }

  function el(tag, cls, css){
    const n = document.createElement(tag);
    if(cls) n.className = cls;
    if(css) for(const k in css) n.style.setProperty(k, css[k]);
    return n;
  }

  let inFlight = false;
  function fire(target){
    if(inFlight) return;
    const href = target.getAttribute('data-punch-to') || target.getAttribute('href');
    if(!href) return;
    inFlight = true;

    const dir = resolveDir(target);
    const rect = target.getBoundingClientRect();
    const bx = rect.left + rect.width/2;
    const by = rect.top + rect.height/2;
    const start = computeStart(dir, rect);

    const stage = document.createElement('div');
    stage.className = 'punch-stage';
    stage.style.setProperty('--bx', bx + 'px');
    stage.style.setProperty('--by', by + 'px');
    stage.style.setProperty('--gx', start.gx + 'px');
    stage.style.setProperty('--gy', start.gy + 'px');
    stage.style.setProperty('--rot', start.rot + 'deg');

    const vign = el('div', 'vignette');
    stage.appendChild(vign);

    const speedAng = start.angDeg;
    for(let i = 0; i < 9; i++){
      const off = (i - 4) * 7 + (Math.random() - .5) * 5;
      const len = 380 + Math.random() * 280;
      const w = 1 + Math.random() * 2.4;
      const d = 60 + i * 16 + Math.random() * 40;
      const ln = el('div', 'speedline');
      ln.style.setProperty('--ang', (speedAng + off) + 'deg');
      ln.style.setProperty('--len', len + 'px');
      ln.style.setProperty('--w', w.toFixed(1) + 'px');
      ln.style.setProperty('--d', d + 'ms');
      stage.appendChild(ln);
    }

    const trails = [
      { td: -60, op: .22, bl: 6 },
      { td: -40, op: .35, bl: 4 },
      { td: -20, op: .55, bl: 2 },
      { td:   0, op: 1,   bl: 0 },
    ];
    trails.forEach(t=>{
      const g = el('div', 'glove-trail');
      g.style.setProperty('--td', t.td + 'ms');
      g.style.setProperty('--op', t.op);
      g.style.setProperty('--bl', t.bl + 'px');
      g.innerHTML = gloveMarkup();
      stage.appendChild(g);
    });

    const pre = el('div', 'preflash');
    stage.appendChild(pre);

    const wf = el('div', 'whiteflash');
    stage.appendChild(wf);

    const iflash = el('div', 'impact-flash');
    stage.appendChild(iflash);

    [0, 90, 180, 280].forEach((delay, i)=>{
      const sw = el('div', 'shockwave' + (i ? ' wr' + (i + 1) : ''));
      sw.style.setProperty('--swd', delay + 'ms');
      stage.appendChild(sw);
    });

    const cracks = el('div', 'radial-cracks');
    cracks.innerHTML = radialCracksMarkup();
    stage.appendChild(cracks);

    for(let i = 0; i < 28; i++){
      const ang = Math.random() * Math.PI * 2;
      const dist = 180 + Math.random() * 420;
      const sz = 4 + Math.random() * 8;
      const clr = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];
      const sp = el('div', 'spark');
      sp.style.setProperty('--tx', (Math.cos(ang) * dist).toFixed(1) + 'px');
      sp.style.setProperty('--ty', (Math.sin(ang) * dist).toFixed(1) + 'px');
      sp.style.setProperty('--sz', sz.toFixed(1) + 'px');
      sp.style.setProperty('--clr', clr);
      sp.style.setProperty('--sd', (520 + Math.random() * 480) + 'ms');
      sp.style.setProperty('--ssd', (Math.random() * 60) + 'ms');
      stage.appendChild(sp);
    }

    for(let i = 0; i < 14; i++){
      const ang = -Math.PI/2 + (Math.random() - .5) * 1.4;
      const dist = 80 + Math.random() * 200;
      const em = el('div', 'ember');
      const clr = Math.random() > .6 ? '#fff5d0' : '#f1c668';
      em.style.setProperty('--tx', (Math.cos(ang) * dist).toFixed(1) + 'px');
      em.style.setProperty('--ty', (Math.sin(ang) * dist).toFixed(1) + 'px');
      em.style.setProperty('--clr', clr);
      em.style.setProperty('--ed', (900 + Math.random() * 500) + 'ms');
      em.style.setProperty('--esd', (Math.random() * 220) + 'ms');
      em.style.left = bx + 'px';
      em.style.top = by + 'px';
      em.style.marginLeft = '-1.5px';
      em.style.marginTop = '-1.5px';
      em.style.position = 'absolute';
      stage.appendChild(em);
    }

    const smoke = el('div', 'smoke');
    stage.appendChild(smoke);

    document.body.appendChild(stage);
    document.body.classList.add('punch-locking');
    document.body.style.setProperty('--bx', bx + 'px');
    document.body.style.setProperty('--by', by + 'px');
    document.body.classList.add('punch-tint');

    const IMPACT = 340;
    const TOTAL = 1080;

    window.setTimeout(()=>{
      playImpact();
      shatter(target, rect);
      document.body.classList.add('punch-shake');
      document.body.classList.add('punch-zoom');
      document.body.classList.add('punch-curtain');
    }, IMPACT);

    window.setTimeout(()=>{
      document.body.classList.remove('punch-shake');
      document.body.classList.remove('punch-zoom');
    }, IMPACT + 540);

    window.setTimeout(()=>{ window.location.href = href; }, TOTAL);
  }

  function arm(el){
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
  }

  function init(){
    document.querySelectorAll('[data-punch-to]').forEach(arm);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
