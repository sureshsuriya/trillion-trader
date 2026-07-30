// THEME TOGGLE
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', () => {
    const cur = root.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    if(typeof loadTVChart === 'function'){ loadTVChart(next); loadTVCalendar(next); }
  });

  // MOBILE MENU
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  burgerBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

  // TICKER — LIVE DATA (no API key required)
  // Gold/Silver/BTC/ETH: gold-api.com — true real-time, cached 30s server-side
  // Forex majors: Frankfurter (ECB) — updates once per trading day, not per-minute
  const tickerState = {
    'XAU/USD': {v:2412.30, prev:2412.30, label:'Gold'},
    'XAG/USD': {v:28.44, prev:28.44, label:'Silver'},
    'BTC/USD': {v:64120, prev:64120, label:'Bitcoin'},
    'ETH/USD': {v:3450, prev:3450, label:'Ethereum'},
    'EUR/USD': {v:1.0851, prev:1.0851, label:'Euro'},
    'GBP/USD': {v:1.2734, prev:1.2734, label:'Pound'},
    'USD/JPY': {v:156.22, prev:156.22, label:'Yen'},
    'AUD/USD': {v:0.6612, prev:0.6612, label:'Aussie'},
  };

  function renderTicker(){
    const track = document.getElementById('tickerTrack');
    let html = '';
    for(let r=0; r<2; r++){
      Object.entries(tickerState).forEach(([sym, d])=>{
        const up = d.v >= d.prev;
        const decimals = d.v >= 100 ? 2 : 4;
        html += `<span class="tick"><b>${sym}</b> ${d.v.toLocaleString(undefined,{minimumFractionDigits:decimals,maximumFractionDigits:decimals})} <span class="${up?'up':'down'}">${up?'▲':'▼'}</span></span>`;
      });
    }
    track.innerHTML = html;
  }
  renderTicker();

  async function fetchGoldApi(symbol){
    try{
      const res = await fetch(`https://api.gold-api.com/price/${symbol}`);
      if(!res.ok) return null;
      const data = await res.json();
      return data.price;
    }catch(e){ return null; }
  }
  async function fetchFrankfurter(base, symbol){
    try{
      const res = await fetch(`https://api.frankfurter.dev/v1/latest?base=${base}&symbols=${symbol}`);
      if(!res.ok) return null;
      const data = await res.json();
      return data.rates ? data.rates[symbol] : null;
    }catch(e){ return null; }
  }

  async function updateTicker(){
    const jobs = [
      fetchGoldApi('XAU').then(p => p && setPrice('XAU/USD', p)),
      fetchGoldApi('XAG').then(p => p && setPrice('XAG/USD', p)),
      fetchGoldApi('BTC').then(p => p && setPrice('BTC/USD', p)),
      fetchGoldApi('ETH').then(p => p && setPrice('ETH/USD', p)),
      fetchFrankfurter('EUR','USD').then(p => p && setPrice('EUR/USD', p)),
      fetchFrankfurter('GBP','USD').then(p => p && setPrice('GBP/USD', p)),
      fetchFrankfurter('USD','JPY').then(p => p && setPrice('USD/JPY', p)),
      fetchFrankfurter('AUD','USD').then(p => p && setPrice('AUD/USD', p)),
    ];
    await Promise.allSettled(jobs);
    renderTicker();
  }
  function setPrice(sym, newVal){
    const d = tickerState[sym];
    d.prev = d.v;
    d.v = newVal;
  }
  updateTicker();
  setInterval(updateTicker, 60000); // refresh every 60 seconds

  // 3D CANDLES
  function buildCandles(){
    const scene = document.getElementById('candleScene');
    const heights = [70,110,60,150,90,180,120,200,140];
    let html = '';
    heights.forEach((h,i)=>{
      const isGreen = i % 3 !== 0;
      const wickH = Math.round(h*0.35);
      html += `<div class="candle" style="height:${h}px;">
        <div class="wick" style="height:${wickH}px;"></div>
        <div class="body3d ${isGreen?'g':'r'}" style="width:100%; height:${h}px; animation-delay:${i*0.15}s;"></div>
      </div>`;
    });
    scene.innerHTML = html;
  }
  buildCandles();


  // TAB SWITCHING
  document.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
      document.querySelectorAll('.tool-panel').forEach(p=>p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-'+btn.dataset.tab).classList.add('active');
    });
  });

  // CALCULATORS
  function calcLot(){
    const bal = parseFloat(document.getElementById('lot-balance').value)||0;
    const risk = parseFloat(document.getElementById('lot-risk').value)||0;
    const sl = parseFloat(document.getElementById('lot-sl').value)||1;
    const pipVal = parseFloat(document.getElementById('lot-pair').value)||10;
    const riskAmt = bal*(risk/100);
    const lots = riskAmt/(sl*pipVal);
    document.getElementById('lot-out-risk').textContent = '$'+riskAmt.toFixed(2);
    document.getElementById('lot-out-lot').textContent = lots.toFixed(2);
    document.getElementById('lot-out-units').textContent = Math.round(lots*100000).toLocaleString();
  }
  function calcRisk(){
    const bal = parseFloat(document.getElementById('risk-balance').value)||0;
    const pct = parseFloat(document.getElementById('risk-pct').value)||0;
    const trades = parseFloat(document.getElementById('risk-trades').value)||1;
    const dd = parseFloat(document.getElementById('risk-dd').value)||0;
    const perTrade = bal*(pct/100);
    const dailyMax = bal*(dd/100);
    document.getElementById('risk-out-per').textContent = '$'+perTrade.toFixed(2);
    document.getElementById('risk-out-daily').textContent = '$'+dailyMax.toFixed(2);
    document.getElementById('risk-out-floor').textContent = '$'+(bal-dailyMax).toFixed(2);
  }
  function calcPL(){
    const lot = parseFloat(document.getElementById('pl-lot').value)||0;
    const entry = parseFloat(document.getElementById('pl-entry').value)||0;
    const exit = parseFloat(document.getElementById('pl-exit').value)||0;
    const dir = document.getElementById('pl-dir').value;
    const isJpy = entry > 20; // rough heuristic for JPY pairs
    const pipSize = isJpy ? 0.01 : 0.0001;
    let diff = dir === 'buy' ? (exit-entry) : (entry-exit);
    const pips = diff/pipSize;
    const pipValPerLot = isJpy ? 9.09 : 10;
    const money = pips*pipValPerLot*lot;
    document.getElementById('pl-out-pips').textContent = pips.toFixed(1);
    document.getElementById('pl-out-money').textContent = (money>=0?'$':'-$')+Math.abs(money).toFixed(2);
  }
  function calcPip(){
    const lot = parseFloat(document.getElementById('pip-lot').value)||0;
    const pipVal = parseFloat(document.getElementById('pip-pair').value)||10;
    document.getElementById('pip-out').textContent = '$'+(lot*pipVal).toFixed(2);
  }

  // FAQ ACCORDION
  document.querySelectorAll('.faq-item').forEach(item=>{
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', ()=>{
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i=>{ i.classList.remove('open'); i.querySelector('.faq-a').style.maxHeight = null; });
      if(!isOpen){ item.classList.add('open'); a.style.maxHeight = a.scrollHeight+'px'; }
    });
  });

  // COPY CODE
  function copyCode(code, btn){
    navigator.clipboard.writeText(code).then(()=>{
      const orig = btn.textContent; btn.textContent = 'Copied!';
      setTimeout(()=>btn.textContent = orig, 1500);
    });
  }

  // CONTACT FORM — opens a real mailto with the message pre-filled (no backend yet)
  function handleContact(e){
    e.preventDefault();
    const name = document.getElementById('ct-name').value;
    const email = document.getElementById('ct-email').value;
    const subject = document.getElementById('ct-subject').value || 'Website enquiry';
    const msg = document.getElementById('ct-msg').value;
    const body = `From: ${name} (${email})\n\n${msg}`;
    // NOTE: replace this with the client's real support email before launch
    window.location.href = `mailto:REPLACE-WITH-CLIENT-EMAIL@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  // SESSION TIMES (IST reference)
  const sessions = [
    {name:'Sydney', startUTC:22, endUTC:7},
    {name:'Tokyo', startUTC:0, endUTC:9},
    {name:'London', startUTC:8, endUTC:17},
    {name:'New York', startUTC:13, endUTC:22},
  ];
  function renderSessions(){
    const now = new Date();
    const utcHour = now.getUTCHours() + now.getUTCMinutes()/60;
    let html = '';
    sessions.forEach(s=>{
      let active;
      if(s.startUTC < s.endUTC){ active = utcHour >= s.startUTC && utcHour < s.endUTC; }
      else { active = utcHour >= s.startUTC || utcHour < s.endUTC; }
      html += `<div class="session-row"><span><span class="dot ${active?'live':'off'}"></span>${s.name}</span><span class="mono" style="color:${active?'var(--green)':'var(--text-low)'}">${active?'OPEN':'CLOSED'}</span></div>`;
    });
    document.getElementById('sessionList').innerHTML = html;
  }
  renderSessions();
  setInterval(renderSessions, 60000);

  // Initial calc render
  calcLot(); calcRisk(); calcPL(); calcPip();

  // TRADINGVIEW WIDGETS (official script-based embeds — these build their own internal iframe)
  function watchWidget(containerId, fallback){
    const container = document.getElementById(containerId);
    const loader = container.querySelector('.widget-loading');
    let done = false;
    const start = Date.now();
    const iv = setInterval(()=>{
      if(done) return;
      const iframe = container.querySelector('iframe');
      if(iframe){
        done = true; clearInterval(iv);
        if(loader) loader.remove();
      } else if(Date.now() - start > 8000){
        done = true; clearInterval(iv);
        container.innerHTML = `<div class="widget-fallback">
          <p>The live widget didn't load — this can happen if your network or browser blocks third-party scripts.</p>
          <a href="${fallback}" target="_blank" rel="noopener" class="btn btn-gold btn-sm">Open Live Chart on TradingView</a>
        </div>`;
      }
    }, 400);
  }

  function loadTVChart(theme){
    theme = theme || root.getAttribute('data-theme') || 'dark';
    const el = document.querySelector('#tvChartContainer .tradingview-widget-container__widget');
    if(!el) return;
    el.innerHTML = '';
    document.getElementById('tvChartContainer').querySelectorAll('script').forEach(scr => scr.remove());
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    s.async = true;
    s.innerHTML = JSON.stringify({
      autosize: true, symbol: 'OANDA:XAUUSD', interval: '60',
      timezone: 'Asia/Kolkata', theme: theme, style: '1', locale: 'en',
      toolbar_bg: theme === 'dark' ? '#131822' : '#FBFAF7', enable_publishing: false, hide_top_toolbar: false,
      save_image: false, allow_symbol_change: true
    });
    document.getElementById('tvChartContainer').appendChild(s);
    watchWidget('tvChartContainer', 'https://www.tradingview.com/symbols/OANDA-XAUUSD/');
  }
  function loadTVCalendar(theme){
    theme = theme || root.getAttribute('data-theme') || 'dark';
    const el = document.querySelector('#tvCalendarContainer .tradingview-widget-container__widget');
    if(!el) return;
    el.innerHTML = '';
    document.getElementById('tvCalendarContainer').querySelectorAll('script').forEach(scr => scr.remove());
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
    s.async = true;
    s.innerHTML = JSON.stringify({
      colorTheme: theme, isTransparent: false, width: '100%', height: '100%', locale: 'en',
      importanceFilter: '-1,0,1', countryFilter: 'us,eu,gb,jp,in,au,ca,cn'
    });
    document.getElementById('tvCalendarContainer').appendChild(s);
    watchWidget('tvCalendarContainer', 'https://www.tradingview.com/economic-calendar/');
  }
  loadTVChart();
  loadTVCalendar();