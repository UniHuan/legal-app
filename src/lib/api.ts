import { sb } from './supabase';
import { AI_URL } from './constants';
import { unstable_cache } from 'next/cache';

export const getScenarios = unstable_cache(
  async (limit=10, cat?:string) => {
    let q = sb.from('fz_scenarios').select('*').order('view_count',{ascending:false}).limit(limit);
    if(cat) q = q.eq('category',cat);
    const {data} = await q; return data||[];
  },
  ['scenarios-list'],
  {revalidate:60}
);

export async function getScene(id:string) {
  const {data} = await sb.from('fz_scenarios').select('*').eq('id',id).single();
  return data;
}

export async function searchScenes(q:string) {
  const {data} = await sb.from('fz_scenarios').select('*').or(`title.ilike.%${q}%,legal_analysis.ilike.%${q}%`).limit(10);
  return data||[];
}

export const getArticles = unstable_cache(
  async (limit=50, book?:number) => {
    let q = sb.from('fz_articles').select('*').order('article_number').limit(limit);
    if(book) q = q.eq('book',book);
    const {data} = await q; return data||[];
  },
  ['articles-list'],
  {revalidate:300}
);

export async function getArticle(num:number) {
  const {data} = await sb.from('fz_articles').select('*').eq('article_number',num).single();
  return data;
}

export async function searchArticles(q:string) {
  const {data} = await sb.from('fz_articles').select('article_number,one_liner').or(`one_liner.ilike.%${q}%,content_plain.ilike.%${q}%`).limit(20);
  return data||[];
}

export const getValues = unstable_cache(
  async () => {
    const {data} = await sb.from('fz_values').select('*').order('sort_order');
    return data||[];
  },
  ['values-list'],
  {revalidate:300}
);

export async function getValue(id:string) {
  const {data} = await sb.from('fz_values').select('*').eq('id',id).single();
  return data;
}

export async function getValueScenes(name:string) {
  const {data} = await sb.from('fz_scenarios').select('*').contains('value_tags',[name]).limit(20);
  return data||[];
}

export async function getQuiz(date:string) {
  const {data} = await sb.from('fz_quiz').select('*').eq('publish_date',date).single();
  return data;
}

export async function getTemplates() {
  const {data} = await sb.from('fz_templates').select('*');
  return data||[];
}

export async function aiAsk(q:string) {
  try {
    const r = await fetch(AI_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q})});
    const j = await r.json();
    return j.answer||'';
  } catch { return ''; }
}
