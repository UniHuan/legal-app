const SUPABASE_URL = 'https://xtvktvafjjrneldzenug.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0dmt0dmFmampybmVsZHplbnVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNTQ1MjQsImV4cCI6MjA5NTYzMDUyNH0.c7GqP3j-vaJIzjNd13krexYyvCshMkq1UHj5l50k-lI';
const AI_URL = 'https://xtvktvafjjrneldzenug.supabase.co/functions/v1/legal-ai-ask';

App({
  globalData: { supabaseUrl: SUPABASE_URL, supabaseKey: SUPABASE_KEY, aiUrl: AI_URL },
  async request(path, params) {
    const url = `${SUPABASE_URL}/rest/v1/${path}`;
    const qs = params ? '?' + Object.entries(params).map(([k,v]) => `${k}=eq.${encodeURIComponent(v)}`).join('&') : '';
    const res = await wx.request({ url: url + qs, method: 'GET', header: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }});
    return res.data;
  },
  async search(path, query, field) {
    const url = `${SUPABASE_URL}/rest/v1/${path}?${field}=ilike.*${encodeURIComponent(query)}*&limit=10`;
    const res = await wx.request({ url, method: 'GET', header: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }});
    return res.data;
  },
  async aiAsk(question) {
    const res = await wx.request({ url: AI_URL, method: 'POST', header: { 'Content-Type': 'application/json' }, data: { question } });
    return res.data?.answer || '';
  }
});
