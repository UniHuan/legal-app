// 移动端应用逻辑 (基于prototype_mobile.html)
const mobile = {
  currentPage: 'home',

  async init() {
    this.loadHome();
    // AI presets
    document.getElementById('aiPresets').innerHTML = `
      <button class="ai-preset" onclick="mobile.quickAsk('房东卖房我能不搬吗')">🏠 房东卖房</button>
      <button class="ai-preset" onclick="mobile.quickAsk('收到假货退一赔三怎么操作')">🛒 假货索赔</button>
      <button class="ai-preset" onclick="mobile.quickAsk('没打借条能要回钱吗')">💰 借贷纠纷</button>
      <button class="ai-preset" onclick="mobile.quickAsk('楼上装修噪音扰民怎么办')">🔨 装修噪音</button>`;
    // Tools
    document.getElementById('toolsContent').innerHTML = `
      <div class="section-title">🛠️ 便民工具</div>
      <div class="tool-list-item" onclick="mobile.showTemplates()"><span class="tl-icon">📄</span><div><div class="tl-title">法律文书参考</div><div class="tl-desc">借条·租房合同·遗嘱</div></div></div>
      <div class="tool-list-item" onclick="mobile.showCalc()"><span class="tl-icon">🧮</span><div><div class="tl-title">诉讼费计算器</div><div class="tl-desc">输入标的额自动计算</div></div></div>
      <div class="tool-list-item"><a href="tel:12348" style="text-decoration:none;color:inherit;display:flex;align-items:center;gap:12px;width:100%"><span class="tl-icon">📞</span><div><div class="tl-title">一键拨打12348</div><div class="tl-desc">免费·24小时·专业律师</div></div></a></div>`;
  },

  navigate(page) {
    this.currentPage = page;
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById('screen-' + page);
    if (el) el.classList.add('active');
    document.querySelectorAll('.bottom-nav .nav-item').forEach(n => n.classList.remove('active'));
    const nav = document.querySelector(`.bottom-nav .nav-item[data-page="${page}"]`);
    if (nav) nav.classList.add('active');
    document.getElementById('screenContainer').scrollTop = 0;

    switch (page) {
      case 'home': this.loadHome(); break;
      case 'values': this.loadValues(); break;
      case 'code': this.loadCodeList(); break;
    }
  },

  goHome() { this.navigate('home'); },

  // Home
  async loadHome() {
    document.getElementById('homeCategories').innerHTML = Object.entries(CATEGORIES).map(([k,v]) =>
      `<div class="grid-item" onclick="mobile.goCategory('${k}')"><span class="emoji">${v.icon}</span>${v.label}</div>`).join('');
    const scenes = await api.getScenarios(8);
    document.getElementById('hotScenes').innerHTML = scenes.map(s => `
      <div class="scene-card" onclick="mobile.openScene('${s.id}')">
        <div class="title">${s.title}</div>
        <div class="conclusion ${s.conclusion_type}" style="font-size:11px;padding:4px 8px;">${s.conclusion}</div>
        <div style="display:flex;gap:4px;margin-top:4px;">${(s.value_tags||[]).map(v=>`<span class="tag tag-blue" style="font-size:10px;">${v}</span>`).join('')}</div>
      </div>`).join('');
  },

  async goCategory(cat) {
    const info = CATEGORIES[cat];
    const scenes = await api.getScenarios(50, cat);
    this.navigate('category');
    document.getElementById('categoryContent').innerHTML = `
      <div class="category-header"><span class="cat-icon">${info.icon}</span><div><span class="cat-name">${info.label}</span><div style="font-size:12px;color:#64748B;">共${scenes.length}个场景</div></div></div>
      <button class="btn-secondary" onclick="mobile.goHome()" style="margin-bottom:12px;width:100%;">← 返回首页</button>
      ${scenes.map(s => `<div class="card" onclick="mobile.openScene('${s.id}')"><div style="font-weight:600;font-size:14px;">${s.title}</div><div class="conclusion ${s.conclusion_type}" style="font-size:12px;padding:5px 8px;margin-top:6px;">${s.conclusion}</div></div>`).join('')}`;
  },

  async search(q) {
    if(!q||q.length<2) return;
    const scenes = await api.searchScenes(q);
    if(scenes.length>0) return this.openScene(scenes[0].id);
    this.navigate('ai'); document.getElementById('aiInput').value=q; this.askAI();
  },

  // Scene Detail
  async openScene(id) {
    this.navigate('scene');
    const s = await api.getScene(id);
    if(!s) return;
    document.getElementById('sceneContent').innerHTML = `
      <div class="header-bar"><a class="back" onclick="mobile.goHome()">← 返回</a><span style="font-size:14px;color:#64748B;">场景详情</span></div>
      <h1>${s.title}</h1>
      <div class="conclusion ${s.conclusion_type}">${s.conclusion}</div>
      <div class="section-title" style="margin:12px 0 8px;">📋 你可以这样做</div>
      <div class="card"><ol class="steps">${(s.steps||[]).map((st,i)=>`<li><span class="step-num">${i+1}</span><span>${st}</span></li>`).join('')}</ol></div>
      <div class="section-title" style="margin:12px 0 8px;">📜 法律怎么说</div>
      <div class="card"><div class="law-section"><div class="collapse-header" onclick="this.nextElementSibling.classList.toggle('open');this.querySelector('span').textContent=this.nextElementSibling.classList.contains('open')?'▼':'▶'"><span>💬 大白话版 ▶</span></div><div class="collapse-body open">${s.legal_analysis}</div></div></div>
      ${(s.warnings||[]).length?`<div class="warn-box"><strong>⚠️ 容易踩的坑：</strong>${s.warnings.map(w=>`<div>· ${w}</div>`).join('')}</div>`:''}
      <div class="tags-row">${(s.value_tags||[]).map(v=>`<span class="tag tag-blue">${v}</span>`).join('')} ${(s.article_numbers||[]).map(n=>`<span class="tag" style="background:#F1F5F9;color:#64748B;">#${n}条</span>`).join('')}</div>
      <button class="ai-btn-bottom" onclick="mobile.navigate('ai');document.getElementById('aiInput').value='${s.title.replace(/'/g,"\\'")}';setTimeout(()=>mobile.askAI(),300)">💬 还有疑问？问AI</button>`;
  },

  // AI
  quickAsk(q) { this.navigate('ai'); document.getElementById('aiInput').value=q; this.askAI(); },
  async askAI() {
    const q = document.getElementById('aiInput').value.trim(); if(!q) return;
    const container = document.getElementById('aiMessages');
    const wel = container.querySelector('div[style]'); if(wel) wel.remove();
    container.innerHTML += `<div class="ai-bubble user">${q}</div>`;
    document.getElementById('aiInput').value = '';
    const tid = Date.now(); container.innerHTML += `<div class="ai-bubble bot" id="t${tid}">分析中...</div>`;
    container.scrollTop = container.scrollHeight;
    const answer = await api.aiAsk(q);
    document.getElementById('t'+tid)?.remove();
    if(answer) container.innerHTML += `<div class="ai-bubble bot">${answer}</div>`;
    else container.innerHTML += `<div class="ai-bubble bot">服务暂不可用。<br><br>📞 法律援助热线：12348</div>`;
    container.scrollTop = container.scrollHeight;
  },

  // Values
  async loadValues() {
    const values = await api.getValues();
    const tiers = {national:[],social:[],personal:[]};
    values.forEach(v => tiers[v.tier].push(v));
    const labels = {national:'🇨🇳 国家',social:'🤝 社会',personal:'❤️ 个人'};
    document.getElementById('valuesList').innerHTML = Object.entries(tiers).map(([t,vv])=>`
      <div style="margin-bottom:16px;"><div style="font-size:11px;color:#94A3B8;margin-bottom:8px;">${labels[t]}</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">${vv.map(v=>`<div class="grid-item" onclick="mobile.showValueDetail('${v.id}')" style="text-align:center;"><span class="emoji" style="font-size:28px;">${v.icon}</span><div style="font-weight:600;font-size:12px;">${v.name}</div><div style="font-size:10px;color:#94A3B8;">${v.scenario_count||0}</div></div>`).join('')}</div></div>`).join('');
  },

  async showValueDetail(id) {
    const v = await api.getValue(id);
    const scenes = await api.getValueScenarios(v.name);
    this.navigate('value-detail');
    document.getElementById('valueDetailContent').innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;padding:16px;background:var(--blue-light);border-radius:var(--radius);margin-bottom:12px;">
        <span style="font-size:36px;">${v.icon}</span><div><div style="font-size:18px;font-weight:700;color:var(--blue);">${v.name}</div><div style="font-size:13px;color:#64748B;">${v.description}</div></div></div>
      <div class="section-title">📋 关联场景 (${scenes.length})</div>
      ${scenes.map(s=>`<div class="card" onclick="mobile.openScene('${s.id}')"><div style="font-weight:600;font-size:14px;">${s.title}</div><div class="conclusion ${s.conclusion_type}" style="font-size:12px;padding:5px 8px;margin-top:4px;">${s.conclusion}</div></div>`).join('')}
      <button class="btn-secondary" onclick="mobile.loadValues();mobile.navigate('values')" style="width:100%;margin-top:12px;">← 返回价值观</button>`;
  },

  // Code
  async loadCodeList() {
    const books = [
      {b:1,t:'第一编 总则',c:204},{b:2,t:'第二编 物权',c:258},{b:3,t:'第三编 合同',c:526},
      {b:4,t:'第四编 人格权',c:51},{b:5,t:'第五编 婚姻家庭',c:79},{b:6,t:'第六编 继承',c:45},{b:7,t:'第七编 侵权责任',c:95}
    ];
    document.getElementById('codeList').innerHTML = books.map(bk => `
      <div class="card" onclick="mobile.browseBook(${bk.b})"><div style="font-weight:700;font-size:15px;">${bk.t}</div><div style="font-size:12px;color:#64748B;">${bk.c}条</div></div>`).join('');
  },
  async browseBook(book) {
    const articles = await api.getArticles(50, book);
    this.navigate('code');
    document.getElementById('codeList').innerHTML = articles.map(a => `
      <div class="card" onclick="mobile.openArticle(${a.article_number})"><div style="font-weight:600;color:var(--blue);">第${a.article_number}条</div><div style="font-size:13px;color:#64748B;">${a.one_liner}</div></div>`).join('');
  },
  async searchCode(q) {
    if(!q) return;
    const num = parseInt(q);
    if(!isNaN(num)&&num>=1&&num<=1260) return this.openArticle(num);
    const articles = await api.searchArticles(q);
    this.navigate('code');
    document.getElementById('codeList').innerHTML = articles.map(a=>`<div class="card" onclick="mobile.openArticle(${a.article_number})"><div style="font-weight:600;color:var(--blue);">第${a.article_number}条</div><div style="font-size:13px;">${a.one_liner}</div></div>`).join('');
  },
  async openArticle(num) {
    this.navigate('article');
    const a = await api.getArticle(num);
    if(!a) return;
    document.getElementById('articleContent').innerHTML = `
      <div class="header-bar"><a class="back" onclick="mobile.loadCodeList();mobile.navigate('code')">← 返回</a></div>
      <div class="art-num">第${a.article_number}条</div>
      <div style="font-size:12px;color:#64748B;margin-bottom:10px;">${a.book_title} · ${a.chapter||''}</div>
      <div class="art-plain"><strong>💬 大白话：</strong>${a.content_plain}</div>
      <div class="art-original"><strong>📜 法条原文：</strong><br>${a.content_original}</div>`;
  },

  // Tools
  async showTemplates() {
    this.navigate('tools');
    const templates = await api.getTemplates();
    document.getElementById('toolsContent').innerHTML = `
      <div class="section-title">📄 法律文书参考</div>
      ${templates.map(t=>`<div class="card"><div style="font-weight:700;margin-bottom:6px;">${t.title}</div><div style="font-size:12px;color:#64748B;margin-bottom:8px;">${t.description}</div><div class="law-section"><div class="collapse-header" onclick="this.nextElementSibling.classList.toggle('open')"><span>📝 查看格式</span></div><div class="collapse-body"><pre style="white-space:pre-wrap;font-size:12px;">${t.content_format}</pre></div></div></div>`).join('')}
      <button class="btn-secondary" onclick="mobile.goHome()" style="width:100%;">← 返回首页</button>`;
  },
  showCalc() {
    this.navigate('tools');
    document.getElementById('toolsContent').innerHTML = `
      <div class="section-title">🧮 诉讼费计算器</div>
      <div class="card"><div style="margin-bottom:8px;">争议金额（元）：</div><input type="number" id="calcAmt" style="width:100%;padding:10px;border:1px solid var(--border);border-radius:8px;font-size:14px;" placeholder="输入标的额" oninput="mobile.doCalc()">
      <div style="font-size:18px;font-weight:700;color:var(--blue);margin-top:12px;">案件受理费：<span id="calcRes">--</span> 元</div></div>
      <button class="btn-secondary" onclick="mobile.goHome()" style="width:100%;margin-top:8px;">← 返回首页</button>`;
  },
  doCalc() {
    const amt = parseFloat(document.getElementById('calcAmt')?.value)||0; let fee=0;
    if(amt<=1e4) fee=50; else if(amt<=1e5) fee=amt*.025-200; else if(amt<=2e5) fee=amt*.02+300;
    else if(amt<=5e5) fee=amt*.015+1300; else if(amt<=1e6) fee=amt*.01+3800;
    else if(amt<=2e6) fee=amt*.009+4800; else if(amt<=5e6) fee=amt*.008+6800;
    else if(amt<=1e7) fee=amt*.007+11800; else fee=amt*.005+41800;
    document.getElementById('calcRes').textContent = Math.round(fee).toLocaleString();
  },

  // Quiz
  async loadQuiz() {
    const today = new Date().toISOString().split('T')[0];
    const quiz = await api.getQuiz(today);
    this.navigate('quiz');
    document.getElementById('quizContent').innerHTML = quiz ? `
      <div class="quiz-card card"><div style="font-size:11px;color:#64748B;margin-bottom:8px;">${today}</div>
      <div class="q-q">${quiz.question}</div>
      ${quiz.options.map(o=>`<div class="q-opt" onclick="mobile.answerQuiz('${o.label}','${quiz.correct_answer}',this)">${o.label}. ${o.text}</div>`).join('')}
      <div class="q-exp" id="qExp"><strong>📖 解析：</strong>${quiz.explanation}</div></div>` : `<div class="card" style="text-align:center;padding:40px;">📝 今日题目即将上线</div>`;
  },
  answerQuiz(label, correct, el) {
    const parent = el.parentElement;
    parent.querySelectorAll('.q-opt').forEach(o => o.style.pointerEvents='none');
    if(label===correct) el.classList.add('correct');
    else { el.classList.add('wrong'); [...parent.querySelectorAll('.q-opt')].find(o=>o.textContent.startsWith(correct+'.'))?.classList.add('correct'); }
    document.getElementById('qExp').classList.add('show');
  }
};
document.addEventListener('DOMContentLoaded', () => mobile.init());
