// 桌面端应用逻辑 (基于prototype_web.html)
const desktop = {
  currentPage: 'home',
  pageEls: {},

  init() {
    // 缓存所有页面元素
    ['home','values','code','ai','scene','article','tools','quiz','value-detail','category'].forEach(p => {
      this.pageEls[p] = document.getElementById('page-' + p);
    });
    // 缓存导航元素
    this.navLinks = document.querySelectorAll('.nav-link');

    // 绑定侧边栏点击
    this.navLinks.forEach(l => {
      l.onclick = (e) => {
        e.preventDefault();
        this.navigate(l.dataset.page);
      };
    });

    // 加载首页
    this.loadHome();
  },

  navigate(page) {
    this.currentPage = page;
    // 更新导航高亮
    this.navLinks.forEach(l => l.classList.remove('active'));
    const nl = document.querySelector(`.nav-link[data-page="${page}"]`);
    if (nl) nl.classList.add('active');
    // 切换页面
    Object.values(this.pageEls).forEach(p => { if(p) { p.classList.remove('active'); p.style.display = 'none'; } });
    const el = this.pageEls[page];
    if (el) { el.classList.add('active'); el.style.display = 'block'; }
    window.scrollTo(0, 0);
    // 加载内容
    switch (page) { case 'home': this.loadHome(); break; case 'values': this.loadValues(); break; case 'code': this.loadCode(); break; case 'tools': this.loadTools(); break; case 'quiz': this.loadQuiz(); break; }
  },

  async searchGlobal(q) {
    if (!q || q.length < 2) return;
    const scenes = await api.searchScenes(q);
    if (scenes.length > 0) return this.openScene(scenes[0].id);
    this.navigate('ai'); setTimeout(() => { const inp = document.getElementById('aiTextarea'); if (inp) { inp.value = q; desktop.askAI(); } }, 400);
  },

  // Home
  async loadHome() {
    const scenes = await api.getScenarios(8);
    const articleCount = await api.getArticleCount();
    document.getElementById('page-home').innerHTML = `
      <div class="hero"><h1>一本你真正能读懂的民法典</h1><p>${articleCount}条法条 → 100+生活场景 → 12个核心价值观<br>不用注册 · 完全免费 · 打开即用</p>
      <div class="hero-stats"><div class="hero-stat"><div class="num">${articleCount}</div><div class="label">法条全覆盖</div></div><div class="hero-stat"><div class="num">12</div><div class="label">核心价值观</div></div><div class="hero-stat"><div class="num">免费</div><div class="label">永久免费</div></div></div></div>
      <div class="grid-2 home-quick" style="margin-bottom:24px;">
        <div class="ai-card" onclick="desktop.navigate('ai')"><div class="ai-header"><span>💬</span><span class="ai-title">AI 智能问答</span></div><div class="ai-desc">基于民法典全量知识库，免费不限次</div><div class="ai-examples"><span class="ai-example">房东卖房我能不搬吗</span><span class="ai-example">收到假货退一赔三</span><span class="ai-example">没打借条要回钱</span></div></div>
        <div class="card category-card"><div class="card-title"><span>📂</span>场景分类浏览</div><div class="category-grid">${Object.entries(CATEGORIES).map(([k,v])=>`<div class="cat-item" onclick="desktop.goCategory('${k}')">${v.icon}<br>${v.label}</div>`).join('')}</div></div></div>
      <div class="section-header"><h2>🔥 大家都在看</h2></div>
      <div class="grid-2">${scenes.map(s=>`<div class="scene-card" onclick="desktop.openScene('${s.id}')"><div class="s-title">${s.title}</div><div class="s-conclusion ${s.conclusion_type}">${s.conclusion}</div><div style="margin-top:8px;">${(s.value_tags||[]).map(v=>`<span class="tag tag-blue">${v}</span>`).join('')}</div></div>`).join('')}</div>`;
  },

  async goCategory(cat) {
    const info = CATEGORIES[cat]; const scenes = await api.getScenarios(50, cat);
    this.navigate('category');
    document.getElementById('page-category').innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;padding:16px;background:var(--blue-light);border-radius:var(--radius);"><span style="font-size:36px;">${info.icon}</span><div><h2>${info.label}</h2><p style="color:var(--text-secondary);">共${scenes.length}个场景</p></div></div>
      <div class="grid-2">${scenes.map(s=>`<div class="scene-card" onclick="desktop.openScene('${s.id}')"><div class="s-title">${s.title}</div><div class="s-conclusion ${s.conclusion_type}">${s.conclusion}</div></div>`).join('')}</div>
      <a href="javascript:desktop.navigate('home')" style="color:var(--blue);margin-top:16px;display:block;">← 返回首页</a>`;
  },

  // Scene
  async openScene(id) {
    const s = await api.getScene(id);
    this.navigate('scene');
    document.getElementById('page-scene').innerHTML = `
      <div class="back-link"><a href="javascript:desktop.navigate('home')">← 返回首页</a></div>
      <div class="scene-header"><h1>${s.title}</h1><div class="scene-meta">${(s.value_tags||[]).map(v=>`<span class="tag tag-blue">${v}</span>`).join('')}</div></div>
      <div class="detail-grid"><div class="detail-main">
        <div class="conclusion-box ${s.conclusion_type}">${s.conclusion}</div>
        <div class="section"><h3>📋 你可以这样做</h3><div class="card"><ol class="step-list">${(s.steps||[]).map((st,i)=>`<li><span class="step-num">${i+1}</span><span>${st}</span></li>`).join('')}</ol></div></div>
        <div class="section"><h3>📜 法律怎么说</h3><div class="card">${s.legal_analysis}</div></div>
        ${(s.warnings||[]).length?`<div class="warning-box"><strong>⚠️ 容易踩的坑：</strong>${s.warnings.map(w=>`<div>· ${w}</div>`).join('')}</div>`:''}
        <button class="card" style="width:100%;text-align:center;font-weight:600;color:var(--blue);padding:14px;" onclick="desktop.navigate('ai');setTimeout(()=>{const inp=document.getElementById('aiTextarea');if(inp){inp.value='${s.title.replace(/'/g,"\\'")}';desktop.askAI();}},400)">💬 还有疑问？问AI</button>
      </div><div class="detail-sidebar"><div class="side-card"><h4>📞 法律援助</h4><div class="hotline-banner" style="margin:0;"><div class="hl-number">12348</div></div></div></div></div>`;
  },

  // AI
  quickAsk(q) { this.navigate('ai'); const ta=document.getElementById('aiTextarea'); if(ta){ta.value=q;setTimeout(()=>this.askAI(),300);} },
  async askAI() {
    const textarea = document.getElementById('aiTextarea');
    const q = textarea?.value?.trim(); if (!q) return;
    const container = document.querySelector('#page-ai .ai-messages');
    const wel = container.querySelector('.ai-welcome'); if (wel) wel.remove();
    container.innerHTML += `<div class="ai-bubble user">${q}</div>`; textarea.value = '';
    const tid = Date.now(); container.innerHTML += `<div class="ai-bubble bot" id="t${tid}">分析中...</div>`;
    container.scrollTop = container.scrollHeight;
    const answer = await api.aiAsk(q);
    document.getElementById('t'+tid)?.remove();
    container.innerHTML += answer ? `<div class="ai-bubble bot">${answer}</div>` : `<div class="ai-bubble bot">服务暂不可用。<br>📞 12348</div>`;
    container.scrollTop = container.scrollHeight;
  },

  // Values
  async loadValues() {
    const values = await api.getValues();
    const tiers = { national: [], social: [], personal: [] };
    values.forEach(v => tiers[v.tier].push(v));
    document.getElementById('page-values').innerHTML = `
      <div class="page-title-area"><h1>🌍 价值观地图</h1><p>12个社会主义核心价值观，每一个都在民法典中有制度支撑。</p></div>
      ${Object.entries({national:'🇨🇳 国家层面',social:'🤝 社会层面',personal:'❤️ 个人层面'}).map(([t,label])=>`
        <div class="values-section"><h3>${label}</h3><div class="value-cards">${tiers[t].map(v=>`<div class="value-card ${t}" onclick="desktop.showValueDetail('${v.id}')"><div class="v-icon">${v.icon}</div><div class="v-name">${v.name}</div><div class="v-count">${v.scenario_count||0}个场景</div></div>`).join('')}</div></div>`).join('')}`;
  },

  async showValueDetail(id) {
    const v = await api.getValue(id); const scenes = await api.getValueScenarios(v.name);
    this.navigate('value-detail');
    document.getElementById('page-value-detail').innerHTML = `
      <div class="back-link"><a href="javascript:desktop.navigate('values')">← 返回价值观</a></div>
      <div style="display:flex;align-items:center;gap:16px;padding:24px;background:var(--blue-light);border-radius:var(--radius);margin-bottom:20px;"><span style="font-size:56px;">${v.icon}</span><div><h1 style="font-size:28px;color:var(--blue);">${v.name}</h1><p>${v.description}</p></div></div>
      <div class="grid-2"><div class="card"><div class="card-title">📜 民法典依据</div><div class="card-desc">${v.legal_basis}</div></div><div class="card"><div class="card-title">🔗 关联场景(${scenes.length})</div></div></div>
      <h3 style="margin:20px 0 12px;">📋 场景列表</h3><div class="grid-2">${scenes.map(s=>`<div class="scene-card" onclick="desktop.openScene('${s.id}')"><div class="s-title">${s.title}</div><div class="s-conclusion ${s.conclusion_type}">${s.conclusion}</div></div>`).join('')}</div>`;
  },

  // Code
  async loadCode() {
    const books = [
      {b:1,n:'①',t:'第一编 总则',c:204,d:'基本规定·自然人·法人·民事法律行为·代理·诉讼时效',tags:['富强','民主','文明','法治']},
      {b:2,n:'②',t:'第二编 物权',c:258,d:'所有权·用益物权·担保物权·占有·业主权利·居住权',tags:['富强','民主','公正']},
      {b:3,n:'③',t:'第三编 合同',c:526,d:'通则·典型合同19种·准合同·电子合同·物业服务·合伙',tags:['诚信','公正','自由']},
      {b:4,n:'④',t:'第四编 人格权',c:51,d:'生命权·肖像权·名誉权·隐私权·个人信息·AI换脸规制',tags:['平等','文明','法治']},
      {b:5,n:'⑤',t:'第五编 婚姻家庭',c:79,d:'结婚·家庭关系·离婚·收养·离婚冷静期·家务补偿',tags:['和谐','平等','自由']},
      {b:6,n:'⑥',t:'第六编 继承',c:45,d:'法定继承·遗嘱继承·遗产处理·打印遗嘱·遗产管理人',tags:['自由','平等','文明']},
      {b:7,n:'⑦',t:'第七编 侵权责任',c:95,d:'损害赔偿·高空抛物·网络侵权·生态赔偿·自甘风险',tags:['公正','法治','文明']}
    ];
    this.navigate('code');
    document.getElementById('page-code').innerHTML = `
      <div class="page-title-area"><h1>📖 法典全文</h1><p>《中华人民共和国民法典》· 7编+附则 · 1260条 · 2021年1月1日施行</p></div>
      <div class="code-search-box"><span>🔍</span><input type="text" placeholder="输入法条编号直达(如725) 或 关键词搜索..." id="codeSearchInput" onkeydown="if(event.key==='Enter')desktop.searchCode(this.value)"><button class="search-btn" onclick="desktop.searchCode(document.getElementById('codeSearchInput').value)">搜索</button><span class="hint">共1260条</span></div>
      <div class="grid-2">${books.map(b=>`
        <div class="code-book-card" onclick="desktop.browseBook(${b.b})">
          <div class="book-num">${b.n}</div>
          <div class="book-info">
            <div class="book-title">${b.t}</div>
            <div class="book-count">${b.c}条</div>
            <div class="book-desc">${b.d}</div>
            <div class="book-tags">${b.tags.map(t=>`<span class="tag tag-blue">${t}</span>`).join('')}</div>
          </div>
        </div>`).join('')}</div>`;
  },

  async browseBook(book) {
    const articles = await api.getArticles(50, book);
    const names = ['','总则','物权','合同','人格权','婚姻家庭','继承','侵权责任'];
    this.navigate('code');
    document.getElementById('page-code').innerHTML = `
      <div class="code-breadcrumb"><a href="javascript:desktop.loadCode()">📖 法典全文</a><span>›</span><span>${names[book]}</span><span style="margin-left:auto;color:var(--text-secondary);">共${articles.length}条</span></div>
      <div class="card" style="padding:0;overflow:hidden;">
        ${articles.map((a,i)=>`<div class="article-list-item" style="padding:14px 20px;" onclick="desktop.openArticle(${a.article_number})"><span class="art-num-mini">第${a.article_number}条</span><span class="art-liner">${a.one_liner}</span><span class="art-arrow">→</span></div>`).join('')}
      </div>
      <div style="text-align:center;margin-top:16px;"><a href="javascript:desktop.loadCode()" style="color:var(--blue);text-decoration:none;">← 返回目录</a></div>`;
  },

  async searchCode(q) {
    if (!q) return; const num = parseInt(q);
    if (!isNaN(num) && num >= 1 && num <= 1260) return this.openArticle(num);
    const articles = await api.searchArticles(q);
    this.navigate('code');
    document.getElementById('page-code').innerHTML = `
      <div class="code-breadcrumb"><a href="javascript:desktop.loadCode()">📖 法典全文</a><span>›</span><span>搜索"${q}"</span><span style="margin-left:auto;">${articles.length}条结果</span></div>
      <div class="card" style="padding:0;overflow:hidden;">
        ${articles.length>0 ? articles.map(a=>`<div class="article-list-item" style="padding:14px 20px;" onclick="desktop.openArticle(${a.article_number})"><span class="art-num-mini">第${a.article_number}条</span><span class="art-liner">${a.one_liner}</span><span class="art-arrow">→</span></div>`).join('') : '<div style="padding:40px;text-align:center;color:var(--text-secondary);">未找到相关法条，请尝试其他关键词</div>'}
      </div>`;
  },

  async openArticle(num) {
    const a = await api.getArticle(num);
    this.navigate('article');
    if (!a) { document.getElementById('page-article').innerHTML = '<div class="loading">未找到该法条</div>'; return; }
    document.getElementById('page-article').innerHTML = `
      <div class="code-breadcrumb"><a href="javascript:desktop.loadCode();desktop.navigate('code')">📖 法典全文</a><span>›</span><span>${a.book_title}</span><span>›</span><span>第${a.article_number}条</span></div>
      <div class="article-detail-card">
        <div class="art-header"><div class="art-num-lg">第${a.article_number}条</div><div class="art-meta">${a.book_title}${a.chapter?' · '+a.chapter:''}</div></div>
        <div class="art-body"><div class="art-plain-lg"><strong>💬 大白话：</strong>${a.content_plain}</div><div class="art-original-lg"><strong>📜 法条原文：</strong><br>${a.content_original}</div></div>
        <div class="art-footer"><span class="art-label">价值观：</span>${(a.value_tags||[]).map(v=>`<span class="tag tag-blue">${v}</span>`).join('')}</div>
      </div>`;

  loadTools() {
    document.getElementById('page-tools').innerHTML = `
      <div class="page-title-area"><h1>🛠️ 便民工具</h1></div>
      <div class="tool-grid">
        <div class="tool-card-lg" onclick="desktop.showTemplates()"><span class="t-icon">📄</span><div><div class="t-title">法律文书参考</div><div class="t-desc">借条·租房合同·离婚协议·遗嘱</div></div></div>
        <div class="tool-card-lg" onclick="desktop.showCalc()"><span class="t-icon">🧮</span><div><div class="t-title">诉讼费计算器</div><div class="t-desc">财产案件·离婚·劳动争议</div></div></div>
        <div class="tool-card-lg"><a href="tel:12348" style="text-decoration:none;color:inherit;display:flex;gap:16px;align-items:flex-start"><span class="t-icon">📞</span><div><div class="t-title">法律援助热线</div><div class="t-desc">12348 · 免费24小时</div></div></a></div>
      </div>
      <div class="hotline-banner"><div class="hl-label">📞 全国法律援助热线</div><div class="hl-number">12348</div></div>
      <div id="toolsDynamic"></div>`;
  },

  async showTemplates() {
    const templates = await api.getTemplates();
    this.loadTools();
    document.getElementById('toolsDynamic').innerHTML = `
      <h2 style="margin-top:20px;">📄 法律文书参考</h2>
      ${templates.map(t=>`<div class="card" style="margin-top:10px;"><div class="card-title">${t.title}</div><div class="card-desc">${t.description}</div>
      <div class="collapse-trigger" onclick="this.nextElementSibling.classList.toggle('show');this.querySelector('.arrow').textContent=this.nextElementSibling.classList.contains('show')?'▼':'▶'"><span>📝 查看格式</span><span class="arrow">▶</span></div>
      <div class="collapse-content"><pre style="white-space:pre-wrap;font-family:inherit;font-size:12px;">${t.content_format}</pre></div></div>`).join('')}`;
  },

  showCalc() {
    this.loadTools();
    document.getElementById('toolsDynamic').innerHTML = `
      <h2 style="margin-top:20px;">🧮 诉讼费计算器</h2>
      <div class="card"><div>争议金额（元）</div><input type="number" id="deskCalcAmt" style="padding:10px;border:1px solid var(--border);border-radius:8px;width:200px;margin:8px 0;" placeholder="输入标的额" oninput="desktop.doCalc()">
      <div style="font-size:18px;font-weight:700;color:var(--blue);">案件受理费：<span id="deskCalcRes">--</span> 元</div></div>`;
  },

  doCalc() {
    const amt = parseFloat(document.getElementById('deskCalcAmt')?.value) || 0; let fee = 0;
    if (amt <= 1e4) fee = 50; else if (amt <= 1e5) fee = amt * .025 - 200; else if (amt <= 2e5) fee = amt * .02 + 300;
    else if (amt <= 5e5) fee = amt * .015 + 1300; else if (amt <= 1e6) fee = amt * .01 + 3800;
    else if (amt <= 2e6) fee = amt * .009 + 4800; else if (amt <= 5e6) fee = amt * .008 + 6800;
    else if (amt <= 1e7) fee = amt * .007 + 11800; else fee = amt * .005 + 41800;
    document.getElementById('deskCalcRes').textContent = Math.round(fee).toLocaleString();
  },

  async loadQuiz() {
    const today = new Date().toISOString().split('T')[0];
    const quiz = await api.getQuiz(today);
    this.navigate('quiz');
    document.getElementById('page-quiz').innerHTML = quiz ? `
      <div class="page-title-area"><h1>📝 每日一题</h1><p>${today}</p></div>
      <div class="grid-2"><div class="card" style="padding:24px;"><div style="font-size:17px;font-weight:700;margin-bottom:14px;">${quiz.question}</div>
      ${quiz.options.map(o => `<div class="quiz-option" onclick="desktop.answerDeskQuiz('${o.label}','${quiz.correct_answer}',this,event)">${o.label}. ${o.text}</div>`).join('')}
      <div id="deskQExp" style="display:none;margin-top:14px;padding:12px;background:var(--blue-light);border-radius:8px;font-size:13px;"><strong>📖 解析：</strong>${quiz.explanation}</div></div></div>` : `<div class="card" style="text-align:center;padding:40px;">📝 今日题目即将上线</div>`;
  },

  answerDeskQuiz(label, correct, el, ev) {
    const parent = el.parentElement;
    parent.querySelectorAll('.quiz-option').forEach(o => o.style.pointerEvents = 'none');
    if (label === correct) el.classList.add('correct');
    else { el.classList.add('wrong'); [...parent.querySelectorAll('.quiz-option')].find(o => o.textContent.startsWith(correct + '.'))?.classList.add('correct'); }
    document.getElementById('deskQExp').style.display = 'block';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // 默认显示首页，隐藏其他
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  const homeEl = document.getElementById('page-home');
  if (homeEl) { homeEl.classList.add('active'); homeEl.style.display = 'block'; }
  desktop.init();
});
