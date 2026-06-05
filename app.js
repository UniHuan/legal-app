// ============================================================
// 法治同行 (LegalMate) - Main Application
// ============================================================

const SUPABASE_URL = 'https://xtvktvafjjrneldzenug.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0dmt0dmFmampybmVsZHplbnVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNTQ1MjQsImV4cCI6MjA5NTYzMDUyNH0.c7GqP3j-vaJIzjNd13krexYyvCshMkq1UHj5l50k-lI';
const EDGE_FUNCTION_URL = 'https://xtvktvafjjrneldzenug.supabase.co/functions/v1/legal-ai-ask';

const CATEGORIES = {
  family: { label: '我的家', icon: '🏠' },
  money: { label: '我的钱', icon: '💰' },
  rights: { label: '我的权', icon: '🛡️' },
  affairs: { label: '我的事', icon: '📋' },
  housing: { label: '我的房', icon: '🏘️' },
  car: { label: '我的车', icon: '🚗' },
  work: { label: '我的工作', icon: '💼' },
  online: { label: '网上生活', icon: '🌐' },
};

const VALUE_COLORS = {
  national: { border: '#DC2626', bg: '#FEE2E2', text: '#DC2626' },
  social: { border: '#2563EB', bg: '#DBEAFE', text: '#2563EB' },
  personal: { border: '#16A34A', bg: '#DCFCE7', text: '#16A34A' },
};

// ============================================================
// App State
// ============================================================
const app = {
  supabase: null,
  currentPage: 'home',
  currentSceneId: null,
  currentArticleNumber: null,

  async init() {
    // Initialize Supabase
    this.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Bind navigation
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        const page = link.dataset.page;
        this.navigate(page);
      });
    });

    // Bind keyboard shortcut
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('globalSearch')?.focus();
      }
    });

    // Load home page
    await this.loadHome();
  },

  navigate(page, extra) {
    this.currentPage = page;

    // Update sidebar
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const navLink = document.querySelector(`.nav-link[data-page="${page}"]`);
    if (navLink) navLink.classList.add('active');

    // Update pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const pageEl = document.getElementById('page-' + page);
    if (pageEl) pageEl.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Load page content
    switch (page) {
      case 'home': this.loadHome(); break;
      case 'values': this.loadValues(); break;
      case 'code': this.loadCodeBooks(); break;
      case 'value-detail': break; // loaded by showValueDetail
      case 'category': break; // loaded by searchByCategory
      case 'ai':
        if (extra) {
          document.getElementById('aiInput').value = extra;
          setTimeout(() => this.askAI(), 300);
        }
        break;
      case 'tools': break;
      case 'quiz': this.loadQuiz(); break;
    }
  },

  // ============================================================
  // Home Page
  // ============================================================
  async loadHome() {
    // Load categories
    const catGrid = document.getElementById('homeCategories');
    catGrid.innerHTML = Object.entries(CATEGORIES).map(([key, val]) =>
      `<div class="cat-item" onclick="app.searchByCategory('${key}')">${val.icon}<br>${val.label}</div>`
    ).join('');

    // Load hot scenarios
    const { data: scenarios, error } = await this.supabase
      .from('fz_scenarios')
      .select('*')
      .order('view_count', { ascending: false })
      .limit(6);

    if (error) {
      document.getElementById('hotScenarios').innerHTML = '<div class="loading">加载失败，请刷新重试</div>';
      return;
    }

    document.getElementById('statScenarios').textContent = scenarios.length + '+';
    // Show real article count
    const { count: articleCount } = await this.supabase.from('fz_articles').select('*', { count: 'exact', head: true });
    if (articleCount) document.getElementById('statArticles').textContent = articleCount.toLocaleString();

    const hotHtml = scenarios.map(s => {
      const vals = (s.value_tags || []).map(v => {
        const tier = this.getValueTier(v);
        const cls = tier === 'national' ? 'tag-red' : tier === 'social' ? 'tag-blue' : 'tag-green';
        return `<span class="tag ${cls}">${v}</span>`;
      }).join('');

      return `
        <div class="scene-card" onclick="app.openScene('${s.id}')">
          <div class="s-title">${s.title}</div>
          <div class="s-conclusion ${s.conclusion_type}">${s.conclusion}</div>
          <div class="s-desc">${(s.legal_analysis || '').substring(0, 80)}...</div>
          <div style="margin-top:8px;">${vals}</div>
        </div>`;
    }).join('');
    document.getElementById('hotScenarios').innerHTML = hotHtml;
  },

  async searchByCategory(cat) {
    this.currentCategory = cat;
    this.navigate('category');

    const catInfo = CATEGORIES[cat] || { label: cat, icon: '📂' };
    const { data } = await this.supabase
      .from('fz_scenarios')
      .select('*')
      .eq('category', cat)
      .order('view_count', { ascending: false })
      .limit(50);

    const gridHtml = (data && data.length > 0) ? data.map(s => {
      const vals = (s.value_tags || []).map(v => {
        const tier = this.getValueTier(v);
        const cls = tier === 'national' ? 'tag-red' : tier === 'social' ? 'tag-blue' : 'tag-green';
        return `<span class="tag ${cls}">${v}</span>`;
      }).join('');
      return `
        <div class="scene-card" onclick="app.openScene('${s.id}')">
          <div class="s-title">${s.title}</div>
          <div class="s-conclusion ${s.conclusion_type}">${s.conclusion}</div>
          <div class="s-desc">${(s.legal_analysis || '').substring(0, 120)}</div>
          <div style="margin-top:8px;">${vals}</div>
        </div>`;
    }).join('') : `
      <div class="loading" style="grid-column:1/-1;padding:40px;">
        <div style="font-size:48px;">📭</div>
        <div style="margin:12px 0;">该分类暂无场景</div>
        <div style="font-size:13px;color:var(--text-secondary);">正在持续补充中，敬请期待</div>
      </div>`;

    document.getElementById('categoryContent').innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;padding:20px;background:var(--blue-light);border-radius:var(--radius);">
        <span style="font-size:40px;">${catInfo.icon}</span>
        <div>
          <h2 style="font-size:22px;margin:0;">${catInfo.label}</h2>
          <p style="color:var(--text-secondary);margin:4px 0 0;">共 ${data ? data.length : 0} 个场景 · 点击卡片查看法律分析和行动建议</p>
        </div>
      </div>
      <div class="grid-2">${gridHtml}</div>
      <div style="text-align:center;margin-top:24px;">
        <a href="javascript:app.navigate('home')" style="color:var(--blue);text-decoration:none;font-size:14px;">← 返回首页浏览全部场景</a>
      </div>`;
  },

  async searchGlobal(query) {
    if (!query || query.length < 2) return;
    const { data } = await this.supabase
      .from('fz_scenarios')
      .select('*')
      .or(`title.ilike.%${query}%,legal_analysis.ilike.%${query}%`)
      .limit(10);

    if (data && data.length > 0) {
      this.openScene(data[0].id);
    } else {
      this.navigate('ai', query);
    }
  },

  // ============================================================
  // Scene Detail
  // ============================================================
  async openScene(id) {
    this.currentSceneId = id;
    this.navigate('scene-detail');
    const { data: s } = await this.supabase.from('fz_scenarios').select('*').eq('id', id).single();
    if (!s) { document.getElementById('sceneDetail').innerHTML = '<div class="loading">场景未找到</div>'; return; }

    // Get related articles
    let articles = [];
    if (s.article_numbers && s.article_numbers.length > 0) {
      const { data: arts } = await this.supabase.from('fz_articles')
        .select('article_number, content_plain, one_liner')
        .in('article_number', s.article_numbers);
      articles = arts || [];
    }

    const vals = (s.value_tags || []).map(v => {
      const tier = this.getValueTier(v);
      const cls = tier === 'national' ? 'tag-red' : tier === 'social' ? 'tag-blue' : 'tag-green';
      return `<span class="tag ${cls}">${v}</span>`;
    }).join('');

    const steps = (s.steps || []).map((step, i) =>
      `<li><span class="step-num">${i+1}</span><span>${step}</span></li>`
    ).join('');

    const warnings = (s.warnings || []).map(w =>
      `<div>· ${w}</div>`
    ).join('');

    const articlesHtml = articles.map(a =>
      `<div class="collapse-trigger" onclick="this.nextElementSibling.classList.toggle('show');this.querySelector('.arrow').textContent=this.nextElementSibling.classList.contains('show')?'▼':'▶'">
        <span>📜 第${a.article_number}条 · ${a.one_liner}</span><span class="arrow">▶</span>
      </div>
      <div class="collapse-content" style="font-size:15px;color:var(--text);">${a.content_plain}</div>`
    ).join('');

    document.getElementById('sceneDetail').innerHTML = `
      <div class="scene-header">
        <h1>${s.title}</h1>
        <div class="scene-meta">${vals}
          ${(s.article_numbers||[]).map(n => `<span class="tag tag-gray" onclick="app.openArticle(${n})" style="cursor:pointer;">#民法典${n}条</span>`).join('')}
          <span class="tag tag-gray">#${CATEGORIES[s.category]?.label||s.category_label}</span>
        </div>
      </div>
      <div class="detail-grid">
        <div class="detail-main">
          <div class="conclusion-box ${s.conclusion_type}">${s.conclusion}</div>
          <div class="section"><h3>📋 你可以这样做</h3>
            <div class="card"><ol class="step-list">${steps}</ol></div>
          </div>
          <div class="section"><h3>📜 法律怎么说</h3>
            <div class="card">
              <div class="collapse-trigger" onclick="this.nextElementSibling.classList.toggle('show');this.querySelector('.arrow').textContent=this.nextElementSibling.classList.contains('show')?'▼':'▶'">
                <span>💬 大白话版</span><span class="arrow">▼</span>
              </div>
              <div class="collapse-content show" style="font-size:15px;color:var(--text);">${s.legal_analysis}</div>
              ${articlesHtml}
            </div>
          </div>
          ${warnings ? `<div class="warning-box"><strong>⚠️ 容易踩的坑：</strong>${warnings}</div>` : ''}
          <button class="card" style="width:100%;text-align:center;font-weight:600;font-size:16px;color:var(--blue);padding:16px;" onclick="app.navigate('ai','${s.title.replace(/'/g,"\\'")}')">💬 我还有疑问 → 问问 AI</button>
        </div>
        <div class="detail-sidebar">
          <div class="side-card"><h4>⚖️ 价值观体现</h4>
            ${(s.value_tags||[]).map(v => `<div style="font-size:13px;padding:4px 0;">${v}</div>`).join('')}
          </div>
          <div class="side-card"><h4>📞 法律援助</h4>
            <div class="hotline-banner" style="margin:0;">
              <div class="hl-label">全国法律援助热线</div>
              <div class="hl-number">12348</div>
            </div>
          </div>
        </div>
      </div>`;
  },

  // ============================================================
  // Article Detail
  // ============================================================
  async openArticle(number) {
    this.currentArticleNumber = number;
    this.navigate('article-detail');
    const { data: a } = await this.supabase.from('fz_articles').select('*').eq('article_number', number).single();
    if (!a) { document.getElementById('articleDetail').innerHTML = '<div class="loading">法条未找到</div>'; return; }

    const vals = (a.value_tags || []).map(v => {
      const tier = this.getValueTier(v);
      const cls = tier === 'national' ? 'tag-red' : tier === 'social' ? 'tag-blue' : 'tag-green';
      return `<span class="tag ${cls}">${v}</span>`;
    }).join('');

    document.getElementById('articleDetail').innerHTML = `
      <div class="article-card">
        <div class="article-number">第${a.article_number}条</div>
        <div style="font-size:14px;color:var(--text-secondary);margin-bottom:12px;">${a.book_title} · ${a.chapter||''}</div>
        <div class="article-plain"><strong>💬 大白话：</strong>${a.content_plain}</div>
        <div class="article-original"><strong>📜 法条原文：</strong><br>${a.content_original}</div>
        <div style="margin-top:8px;">${vals}</div>
      </div>`;
  },

  // ============================================================
  // Values Map
  // ============================================================
  async loadValues() {
    const { data: values } = await this.supabase.from('fz_values').select('*').order('sort_order');
    if (!values) return;

    const groups = { national: [], social: [], personal: [] };
    values.forEach(v => groups[v.tier].push(v));

    const labels = { national: '🇨🇳 国家层面 · 富强 民主 文明 和谐', social: '🤝 社会层面 · 自由 平等 公正 法治', personal: '❤️ 个人层面 · 爱国 敬业 诚信 友善' };
    const tiers = ['national', 'social', 'personal'];

    let html = '';
    tiers.forEach(tier => {
      html += `<div class="values-section"><h3>${labels[tier]}</h3><div class="value-cards">`;
      groups[tier].forEach(v => {
        html += `
          <div class="value-card ${tier}" onclick="app.showValueDetail('${v.id}')">
            <div class="v-icon">${v.icon}</div>
            <div class="v-name">${v.name}</div>
            <div class="v-count">${v.scenario_count||0}个场景</div>
          </div>`;
      });
      html += '</div></div>';
    });

    document.getElementById('valuesContent').innerHTML = html;
  },

  async showValueDetail(valueId) {
    const { data: v } = await this.supabase.from('fz_values').select('*').eq('id', valueId).single();
    if (!v) return;

    this.currentValueId = valueId;
    this.navigate('value-detail');

    const { data: scenarios } = await this.supabase
      .from('fz_scenarios')
      .select('id, title, conclusion, conclusion_type, value_tags, category')
      .contains('value_tags', [v.name])
      .order('view_count', { ascending: false })
      .limit(20);

    const tier = this.getValueTier(v.name);
    const colorMap = { national: '#DC2626', social: '#2563EB', personal: '#16A34A' };
    const bgMap = { national: '#FEE2E2', social: '#DBEAFE', personal: '#DCFCE7' };
    const color = colorMap[tier];

    const scenariosHtml = (scenarios && scenarios.length > 0) ? scenarios.map(s => {
      const cls = s.conclusion_type === 'good' ? 'good' : s.conclusion_type === 'warn' ? 'warn' : 'bad';
      return `
        <div class="scene-card" onclick="app.openScene('${s.id}')" style="margin-bottom:10px;">
          <div class="s-title">${s.title}</div>
          <div class="s-conclusion ${cls}">${s.conclusion}</div>
          <div style="margin-top:6px;">${(s.value_tags||[]).map(t => `<span class="tag tag-gray">${t}</span>`).join('')}</div>
        </div>`;
    }).join('') : '<div class="loading">暂无关联场景，正在持续补充中...</div>';

    document.getElementById('valueDetail').innerHTML = `
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;padding:24px;background:${bgMap[tier]};border-radius:var(--radius);border:2px solid ${color};">
        <span style="font-size:56px;">${v.icon}</span>
        <div>
          <h1 style="font-size:28px;color:${color};">${v.name}</h1>
          <p style="color:var(--text-secondary);margin:4px 0;">${v.description}</p>
        </div>
      </div>

      <div class="grid-2">
        <div class="card" style="border-left:4px solid ${color};">
          <div class="card-title">📜 民法典中的「${v.name}」</div>
          <div class="card-desc" style="white-space:pre-line;line-height:1.8;">${v.legal_basis}</div>
        </div>
        <div class="card">
          <div class="card-title">🔗 关联场景 (${v.scenario_count||0}个)</div>
          <div class="card-desc">点击下方场景卡片查看详细的法律分析和行动建议。</div>
        </div>
      </div>

      <h3 style="margin:24px 0 12px;">📋 体现「${v.name}」的生活场景</h3>
      <div class="grid-2">${scenariosHtml}</div>
    `;
  },

  getValueTier(name) {
    const national = ['富强','民主','文明','和谐'];
    const social = ['自由','平等','公正','法治'];
    if (national.includes(name)) return 'national';
    if (social.includes(name)) return 'social';
    return 'personal';
  },

  // ============================================================
  // Code Books
  // ============================================================
  async loadCodeBooks() {
    const books = [
      { book: 1, title: '第一编 总则', count: 204, desc: '基本规定·自然人·法人·民事法律行为·代理·诉讼时效', vals: ['富强','民主','文明','和谐','法治'] },
      { book: 2, title: '第二编 物权', count: 258, desc: '所有权·用益物权·担保物权·占有·居住权·业主权利', vals: ['富强','民主','公正','法治'] },
      { book: 3, title: '第三编 合同', count: 526, desc: '通则·典型合同19种·准合同·电子合同·物业服务合同', vals: ['诚信','公正','自由','富强'] },
      { book: 4, title: '第四编 人格权', count: 51, desc: '生命权·肖像权·名誉权·隐私权·个人信息·AI换脸规制', vals: ['平等','文明','法治','自由'] },
      { book: 5, title: '第五编 婚姻家庭', count: 79, desc: '结婚·家庭关系·离婚·收养·离婚冷静期·家务补偿', vals: ['和谐','平等','自由'] },
      { book: 6, title: '第六编 继承', count: 45, desc: '法定继承·遗嘱继承·遗产处理·打印遗嘱·遗产管理人', vals: ['自由','平等','文明','和谐'] },
      { book: 7, title: '第七编 侵权责任', count: 95, desc: '损害赔偿·高空抛物·网络侵权·生态赔偿·自甘风险', vals: ['公正','法治','文明','友善'] },
    ];

    document.getElementById('bookList').innerHTML = books.map(b => {
      const vals = b.vals.map(v => {
        const tier = this.getValueTier(v);
        const cls = tier === 'national' ? 'tag-red' : tier === 'social' ? 'tag-blue' : 'tag-green';
        return `<span class="tag ${cls}">${v}</span>`;
      }).join('');
      return `
        <div class="card" onclick="app.browseBook(${b.book})">
          <div class="card-title"><span style="font-size:24px;">${['','①','②','③','④','⑤','⑥','⑦'][b.book]}</span> ${b.title}</div>
          <div class="card-desc">${b.count}条 · ${b.desc}</div>
          <div style="margin-top:8px;">${vals}</div>
        </div>`;
    }).join('');
  },

  async browseBook(book) {
    const { data: articles } = await this.supabase
      .from('fz_articles')
      .select('article_number, one_liner, content_plain')
      .eq('book', book)
      .order('article_number')
      .limit(50);

    if (!articles) return;
    const html = articles.map(a =>
      `<div class="rel-item" onclick="app.openArticle(${a.article_number})" style="font-size:14px;padding:10px 0;">
        <strong>第${a.article_number}条</strong> · ${a.one_liner}
      </div>`
    ).join('');

    document.getElementById('bookList').innerHTML = `
      <div class="card" style="grid-column:1/-1;">
        <div class="card-title">📜 本编法条列表（前50条）</div>
        ${html}
      </div>`;
  },

  async searchArticles(query) {
    if (!query) return;
    // Check if it's a number
    const num = parseInt(query);
    if (!isNaN(num) && num >= 1 && num <= 1260) {
      return this.openArticle(num);
    }

    const { data } = await this.supabase
      .from('fz_articles')
      .select('article_number, one_liner')
      .or(`content_plain.ilike.%${query}%,one_liner.ilike.%${query}%,keyword.ilike.%${query}%`)
      .limit(20);

    if (data && data.length > 0) {
      document.getElementById('bookList').innerHTML = `
        <div class="card" style="grid-column:1/-1;">
          <div class="card-title">🔍 搜索结果 (${data.length}条)</div>
          ${data.map(a => `<div class="rel-item" onclick="app.openArticle(${a.article_number})"><strong>第${a.article_number}条</strong> · ${a.one_liner}</div>`).join('')}
        </div>`;
    }
  },

  // ============================================================
  // AI Q&A
  // ============================================================
  async askAI() {
    const input = document.getElementById('aiInput');
    const question = input.value.trim();
    if (!question) return;
    this.renderAIMessage(question, 'user');
    input.value = '';

    // Show thinking
    const thinkId = this.renderAIMessage('正在分析您的问题，检索相关法条...', 'bot', true);

    try {
      // Try Edge Function first (DeepSeek-powered)
      const edgeRes = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      if (edgeRes.ok) {
        const { answer } = await edgeRes.json();
        document.getElementById(thinkId)?.remove();
        if (answer) {
          this.renderAIMessage(answer, 'bot');
          return;
        }
      }

      // Fallback: local search via Supabase
      const { data: articles } = await this.supabase
        .from('fz_articles')
        .select('article_number, content_original, content_plain, one_liner, value_tags')
        .or(`content_plain.ilike.%${question.substring(0,20)}%,keyword.ilike.%${question.substring(0,20)}%`)
        .limit(5);

      const { data: scenarios } = await this.supabase
        .from('fz_scenarios')
        .select('title, conclusion, legal_analysis')
        .or(`title.ilike.%${question.substring(0,20)}%,legal_analysis.ilike.%${question.substring(0,20)}%`)
        .limit(3);

      document.getElementById(thinkId)?.remove();
      this.buildAIAnswer(question, articles || [], scenarios || []);

    } catch (e) {
      document.getElementById(thinkId)?.remove();
      this.renderAIMessage('抱歉，AI服务暂时不可用。请稍后重试或拨打12348法律援助热线。<br><br>📞 <strong style="color:var(--red);">12348</strong>（免费·24小时）', 'bot');
    }
  },

  buildAIAnswer(question, articles, scenarios) {
    let answer = '';

    if (articles.length > 0) {
      const mainArticle = articles[0];
      answer += `<strong>📜 根据《民法典》第${mainArticle.article_number}条</strong><br><br>`;
      answer += `<strong>结论：</strong>${mainArticle.one_liner}<br><br>`;
      answer += `<strong>法律分析：</strong><br>${mainArticle.content_plain}<br><br>`;

      if (articles.length > 1) {
        answer += `<strong>📚 关联法条：</strong><br>`;
        articles.slice(1).forEach(a => {
          answer += `· 第${a.article_number}条：${a.one_liner}<br>`;
        });
        answer += '<br>';
      }
    } else {
      answer += `<strong>📜 根据《民法典》相关规定</strong><br><br>`;
      answer += `您的问题涉及民事法律关系。${this.getGeneralGuidance(question)}<br><br>`;
    }

    if (scenarios.length > 0) {
      answer += `<strong>📋 相关场景：</strong><br>`;
      scenarios.forEach(s => {
        answer += `· <strong>${s.title}</strong>：${s.conclusion}<br>`;
      });
      answer += '<br>';
    }

    // Value tags
    if (articles.length > 0 && articles[0].value_tags) {
      const vals = articles[0].value_tags.join(' · ');
      answer += `<span style="font-size:12px;">⚖️ 体现价值观：${vals}</span><br>`;
    }

    answer += `<br><strong>📞 需要进一步帮助？</strong><br>`;
    answer += `拨打全国法律援助热线 <strong style="color:var(--red);">12348</strong>（免费·24小时）`;

    // Disclaimer
    answer += `<div style="font-size:10px;color:#94A3B8;margin-top:8px;padding-top:8px;border-top:1px solid var(--border);">⚠️ 本回答仅供参考，不构成正式法律意见。重大法律事务请咨询持证律师。</div>`;

    this.renderAIMessage(answer, 'bot');
  },

  getGeneralGuidance(question) {
    if (question.includes('婚姻') || question.includes('离婚') || question.includes('夫妻') || question.includes('结婚'))
      return '婚姻家庭关系主要由《民法典》第五编（婚姻家庭）规范，涉及结婚条件、夫妻权利义务、离婚程序和财产分割等。';
    if (question.includes('继承') || question.includes('遗产') || question.includes('遗嘱'))
      return '继承关系由《民法典》第六编（继承）规范，包括法定继承、遗嘱继承、遗产处理等制度。';
    if (question.includes('合同') || question.includes('签') || question.includes('借条') || question.includes('买卖'))
      return '合同关系由《民法典》第三编（合同）规范，涉及合同的订立、履行、违约责任等。';
    if (question.includes('侵权') || question.includes('赔偿') || question.includes('受伤') || question.includes('事故'))
      return '侵权责任由《民法典》第七编规范，规定了损害赔偿、各类特殊侵权责任等。';
    if (question.includes('隐私') || question.includes('名誉') || question.includes('肖像') || question.includes('个人信息'))
      return '人格权由《民法典》第四编规范，保护生命权、健康权、肖像权、名誉权、隐私权、个人信息等。';
    return '民法典1260条构建了完整的民事权利保护体系。建议具体描述您的情况，以便更准确地匹配相关法条。';
  },

  askPreset(question) {
    document.getElementById('aiInput').value = question;
    this.askAI();
  },

  renderAIMessage(content, role, isTemp = false) {
    const container = document.getElementById('aiMessages');
    // Remove welcome
    const welcome = container.querySelector('.ai-welcome');
    if (welcome) welcome.remove();

    const bubble = document.createElement('div');
    bubble.className = `ai-bubble ${role}`;
    if (isTemp) bubble.id = 'temp-' + Date.now();
    bubble.innerHTML = content;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
    return bubble.id;
  },

  // ============================================================
  // Tools
  // ============================================================
  async showTemplates() {
    const { data: templates } = await this.supabase.from('fz_templates').select('*');
    if (!templates) return;

    const tc = document.getElementById('toolsContent');
    tc.innerHTML = '<h2 style="margin-top:24px;">📄 法律文书参考</h2>' + templates.map(t => `
      <div class="card" style="margin-top:12px;">
        <div class="card-title">${t.title}</div>
        <div class="card-desc">${t.description}</div>
        <div class="collapse-trigger" onclick="this.nextElementSibling.classList.toggle('show');this.querySelector('.arrow').textContent=this.nextElementSibling.classList.contains('show')?'▼':'▶'" style="margin-top:12px;">
          <span>📝 查看模板格式</span><span class="arrow">▶</span>
        </div>
        <div class="collapse-content"><pre style="white-space:pre-wrap;font-family:inherit;">${t.content_format}</pre></div>
        <div class="collapse-trigger" onclick="this.nextElementSibling.classList.toggle('show');this.querySelector('.arrow').textContent=this.nextElementSibling.classList.contains('show')?'▼':'▶'">
          <span>✏️ 填写说明</span><span class="arrow">▶</span>
        </div>
        <div class="collapse-content">${t.fill_guide}</div>
        ${(t.warnings||[]).map(w => `<div style="font-size:12px;color:var(--red);margin-top:4px;">⚠️ ${w}</div>`).join('')}
      </div>
    `).join('');
    document.getElementById('toolsContent').scrollIntoView({ behavior: 'smooth' });
  },

  showCalculator() {
    document.getElementById('toolsContent').innerHTML = `
      <h2 style="margin-top:24px;">🧮 诉讼费计算器</h2>
      <div class="card" style="margin-top:12px;">
        <div class="card-title">财产案件受理费计算</div>
        <div style="margin:12px 0;">
          <label>争议金额（元）：</label>
          <input type="number" id="calcAmount" style="padding:8px;border:1px solid var(--border);border-radius:6px;width:200px;font-size:14px;" placeholder="输入标的额" oninput="app.calcFee()">
        </div>
        <div style="font-weight:600;font-size:16px;color:var(--blue);">案件受理费：<span id="calcResult">--</span> 元</div>
        <div style="font-size:12px;color:var(--text-secondary);margin-top:8px;">
          财产案件根据诉讼请求金额按比例分段累计交纳。<br>
          · 不超过1万元：每件50元<br>
          · 1万-10万：×2.5%-200<br>
          · 10万-20万：×2%+300<br>
          · 20万-50万：×1.5%+1300<br>
          · 50万-100万：×1%+3800<br>
          · 100万-200万：×0.9%+4800<br>
          · 200万-500万：×0.8%+6800<br>
          · 500万-1000万：×0.7%+11800<br>
          · 1000万-2000万：×0.6%+21800<br>
          · 超过2000万：×0.5%+41800
        </div>
      </div>`;
    document.getElementById('toolsContent').scrollIntoView({ behavior: 'smooth' });
  },

  calcFee() {
    const amount = parseFloat(document.getElementById('calcAmount')?.value) || 0;
    let fee = 0;
    if (amount <= 10000) fee = 50;
    else if (amount <= 100000) fee = amount * 0.025 - 200;
    else if (amount <= 200000) fee = amount * 0.02 + 300;
    else if (amount <= 500000) fee = amount * 0.015 + 1300;
    else if (amount <= 1000000) fee = amount * 0.01 + 3800;
    else if (amount <= 2000000) fee = amount * 0.009 + 4800;
    else if (amount <= 5000000) fee = amount * 0.008 + 6800;
    else if (amount <= 10000000) fee = amount * 0.007 + 11800;
    else if (amount <= 20000000) fee = amount * 0.006 + 21800;
    else fee = amount * 0.005 + 41800;
    document.getElementById('calcResult').textContent = Math.round(fee).toLocaleString();
  },

  showLocations() {
    document.getElementById('toolsContent').innerHTML = `
      <h2 style="margin-top:24px;">📞 法律援助地图</h2>
      <div class="card" style="margin-top:12px;text-align:center;">
        <div style="font-size:48px;margin-bottom:12px;">📞</div>
        <div style="font-size:18px;font-weight:700;">全国法律援助热线</div>
        <div style="font-size:36px;font-weight:800;color:var(--red);letter-spacing:4px;margin:8px 0;">12348</div>
        <div style="font-size:14px;color:var(--text-secondary);">免费 · 24小时 · 专业律师接听 · 全国通用</div>
        <button class="card" onclick="window.location.href='tel:12348'" style="margin-top:16px;width:100%;font-weight:600;color:var(--red);border:2px solid var(--red);">📞 一键拨打 12348</button>
      </div>
      <div class="card" style="margin-top:12px;">
        <div class="card-title">📍 查找附近的法援机构</div>
        <div class="card-desc">功能介绍：基于您的位置，查找附近的法律援助中心、公证处、人民调解委员会。此功能需要您授权位置信息。</div>
        <p style="font-size:12px;color:var(--text-secondary);margin-top:8px;">（位置授权功能即将上线）</p>
      </div>`;
    document.getElementById('toolsContent').scrollIntoView({ behavior: 'smooth' });
  },

  showEvidenceGuide() {
    document.getElementById('toolsContent').innerHTML = `
      <h2 style="margin-top:24px;">📸 取证指引</h2>
      ${['交通事故','家庭暴力','劳动纠纷','消费维权','邻里纠纷','网络侵权'].map(type => `
        <div class="card" style="margin-top:12px;">
          <div class="card-title">🚨 ${type}取证要点</div>
          <div class="card-desc">
            ${type==='交通事故' ? '· 现场照片（全景+细节+车牌）<br>· 行车记录仪录像<br>· 交警事故认定书<br>· 医院诊断证明+费用清单<br>· 目击证人联系方式' : ''}
            ${type==='家庭暴力' ? '· 伤情照片（含日期水印）<br>· 报警记录+出警回执<br>· 医院验伤报告<br>· 施暴者承认的录音/聊天记录<br>· 证人证言（邻居/亲友）' : ''}
            ${type==='劳动纠纷' ? '· 劳动合同+工资条+考勤记录<br>· 解除劳动关系通知书<br>· 工作证/工牌/工作服<br>· 与HR/老板的聊天记录<br>· 工资银行流水' : ''}
            ${type==='消费维权' ? '· 订单截图+支付记录<br>· 商品实物照片+包装<br>· 与商家的聊天记录<br>· 平台投诉记录<br>· 商品宣传页截图' : ''}
            ${type==='邻里纠纷' ? '· 现场照片/录像<br>· 物业报修/投诉记录<br>· 与邻居的沟通记录<br>· 损失评估（维修报价单）<br>· 社区调解记录' : ''}
            ${type==='网络侵权' ? '· 侵权内容截图+URL<br>· 网页公证（重要）<br>· 平台举报记录<br>· 侵权者身份信息<br>· 律师函/起诉状草稿' : ''}
          </div>
        </div>
      `).join('')}`;
    document.getElementById('toolsContent').scrollIntoView({ behavior: 'smooth' });
  },

  // ============================================================
  // Quiz
  // ============================================================
  async loadQuiz() {
    const today = new Date().toISOString().split('T')[0];
    const { data: quiz } = await this.supabase.from('fz_quiz').select('*').eq('publish_date', today).single();

    if (!quiz) {
      document.getElementById('quizContent').innerHTML = `
        <div class="card" style="text-align:center;padding:40px;">
          <div style="font-size:48px;">📝</div>
          <div style="font-size:18px;font-weight:600;margin:12px 0;">今日题目即将上线</div>
          <div style="color:var(--text-secondary);">每日一题功能正在准备中，敬请期待！</div>
        </div>`;
      return;
    }

    const options = quiz.options.map(opt => `
      <div class="quiz-option" onclick="app.submitQuizAnswer('${opt.label}', '${quiz.correct_answer}', this, '${quiz.id}')">
        <strong>${opt.label}.</strong> ${opt.text}
      </div>
    `).join('');

    document.getElementById('quizContent').innerHTML = `
      <div class="grid-2">
        <div class="card" style="padding:32px;">
          <div style="font-size:11px;color:var(--text-secondary);margin-bottom:8px;">${today} · 今日题目</div>
          <div style="font-size:18px;font-weight:700;margin-bottom:16px;">${quiz.question}</div>
          ${options}
          <div id="quizExplanation" style="display:none;margin-top:16px;padding:16px;background:var(--blue-light);border-radius:var(--radius-sm);font-size:14px;">
            <strong>📖 解析：</strong>${quiz.explanation}
            <div style="margin-top:8px;font-size:12px;color:var(--text-secondary);">
              全国 <span id="correctRate">${quiz.correct_rate||0}%</span> 的人答对了这道题
            </div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:16px;">
          <div class="card" style="text-align:center;padding:24px;">
            <div style="font-size:13px;color:var(--text-secondary);">🏆 我的法治段位</div>
            <div style="font-size:48px;margin:8px 0;">📝</div>
            <div style="font-weight:600;">本地记录</div>
            <div style="font-size:12px;color:var(--text-secondary);">答题数据存储在本地</div>
          </div>
        </div>
      </div>`;
  },

  submitQuizAnswer(label, correct, el, quizId) {
    const parent = el.parentElement;
    parent.querySelectorAll('.quiz-option').forEach(o => o.style.pointerEvents = 'none');
    if (label === correct) {
      el.classList.add('correct');
    } else {
      el.classList.add('wrong');
      parent.querySelector(`.quiz-option.correct`) || [...parent.querySelectorAll('.quiz-option')].find(o => o.textContent.startsWith(correct+'.'))?.classList.add('correct');
    }
    document.getElementById('quizExplanation').style.display = 'block';
  },

  // ============================================================
  // Elders Mode
  // ============================================================
  toggleElders() {
    document.body.classList.toggle('elders-mode');
    document.getElementById('btnElders').classList.toggle('active');
  },
};

// Boot
document.addEventListener('DOMContentLoaded', () => app.init());
