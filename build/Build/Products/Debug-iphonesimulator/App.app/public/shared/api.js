// ═══════════════════════════════════════════
//  法治同行 · 共享API层
//  移动端/桌面端共用
// ═══════════════════════════════════════════
const SUPABASE_URL = 'https://xtvktvafjjrneldzenug.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0dmt0dmFmampybmVsZHplbnVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNTQ1MjQsImV4cCI6MjA5NTYzMDUyNH0.c7GqP3j-vaJIzjNd13krexYyvCshMkq1UHj5l50k-lI';
const AI_URL = 'https://xtvktvafjjrneldzenug.supabase.co/functions/v1/legal-ai-ask';

const CATEGORIES = {
  family:{label:'我的家',icon:'🏠'}, money:{label:'我的钱',icon:'💰'},
  rights:{label:'我的权',icon:'🛡️'}, affairs:{label:'我的事',icon:'📋'},
  housing:{label:'我的房',icon:'🏘️'}, car:{label:'我的车',icon:'🚗'},
  work:{label:'我的工作',icon:'💼'}, online:{label:'网上生活',icon:'🌐'}
};

const VALUE_TIERS = {
  '富强':'national','民主':'national','文明':'national','和谐':'national',
  '自由':'social','平等':'social','公正':'social','法治':'social',
  '爱国':'personal','敬业':'personal','诚信':'personal','友善':'personal'
};

class LegalAPI {
  constructor() {
    this.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  async getArticles(limit=50, book=null) {
    let q = this.supabase.from('fz_articles').select('*').order('article_number').limit(limit);
    if(book) q = q.eq('book', book);
    const {data} = await q; return data||[];
  }
  async getArticleCount() {
    const {count} = await this.supabase.from('fz_articles').select('*',{count:'exact',head:true});
    return count||0;
  }
  async getArticle(num) {
    const {data} = await this.supabase.from('fz_articles').select('*').eq('article_number',num).single();
    return data;
  }
  async searchArticles(q) {
    const {data} = await this.supabase.from('fz_articles')
      .select('article_number,one_liner,content_plain').or(`content_plain.ilike.%${q}%,one_liner.ilike.%${q}%`).limit(20);
    return data||[];
  }
  async getScenarios(limit=10, cat=null) {
    let q = this.supabase.from('fz_scenarios').select('*').order('view_count',{ascending:false}).limit(limit);
    if(cat) q = q.eq('category', cat);
    const {data} = await q; return data||[];
  }
  async getScene(id) {
    const {data} = await this.supabase.from('fz_scenarios').select('*').eq('id',id).single();
    return data;
  }
  async searchScenes(q) {
    const {data} = await this.supabase.from('fz_scenarios')
      .select('*').or(`title.ilike.%${q}%,legal_analysis.ilike.%${q}%`).limit(10);
    return data||[];
  }
  async getValues() {
    const {data} = await this.supabase.from('fz_values').select('*').order('sort_order');
    return data||[];
  }
  async getValue(id) {
    const {data} = await this.supabase.from('fz_values').select('*').eq('id',id).single();
    return data;
  }
  async getValueScenarios(name) {
    const {data} = await this.supabase.from('fz_scenarios').select('*').contains('value_tags',[name]).limit(20);
    return data||[];
  }
  async getQuiz(today) {
    const {data} = await this.supabase.from('fz_quiz').select('*').eq('publish_date',today).single();
    return data;
  }
  async getTemplates() {
    const {data} = await this.supabase.from('fz_templates').select('*');
    return data||[];
  }
  async getLocations() {
    const {data} = await this.supabase.from('fz_locations').select('*').limit(20);
    return data||[];
  }
  async aiAsk(question) {
    try {
      const res = await fetch(AI_URL, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question})});
      const j = await res.json();
      return j.answer||'';
    } catch(e) {
      return null;
    }
  }
  getValueTier(name) { return VALUE_TIERS[name]||'personal'; }
}

const api = new LegalAPI();
