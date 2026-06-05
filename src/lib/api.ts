import { sb } from './supabase'; import { AI_URL } from './constants';
export async function getScenarios(l=10,c?:string){let q=sb.from('fz_scenarios').select('*').order('view_count',{ascending:false}).limit(l);if(c)q=q.eq('category',c);const{data}=await q;return data||[]}
export async function getScene(id:string){const{data}=await sb.from('fz_scenarios').select('*').eq('id',id).single();return data}
export async function searchScenes(q:string){const{data}=await sb.from('fz_scenarios').select('*').or(`title.ilike.%${q}%,legal_analysis.ilike.%${q}%`).limit(10);return data||[]}
export async function getArticles(l=50,b?:number){let q=sb.from('fz_articles').select('*').order('article_number').limit(l);if(b)q=q.eq('book',b);const{data}=await q;return data||[]}
export async function getArticle(n:number){const{data}=await sb.from('fz_articles').select('*').eq('article_number',n).single();return data}
export async function searchArticles(q:string){const{data}=await sb.from('fz_articles').select('article_number,one_liner').or(`one_liner.ilike.%${q}%,content_plain.ilike.%${q}%`).limit(20);return data||[]}
export async function getValues(){const{data}=await sb.from('fz_values').select('*').order('sort_order');return data||[]}
export async function getValue(id:string){const{data}=await sb.from('fz_values').select('*').eq('id',id).single();return data}
export async function getValueScenes(n:string){const{data}=await sb.from('fz_scenarios').select('*').contains('value_tags',[n]).limit(20);return data||[]}
export async function getQuiz(d:string){const{data}=await sb.from('fz_quiz').select('*').eq('publish_date',d).single();return data}
export async function getTemplates(){const{data}=await sb.from('fz_templates').select('*');return data||[]}
export async function aiAsk(q:string){try{const r=await fetch(AI_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q})});const j=await r.json();return j.answer||''}catch{return''}}
