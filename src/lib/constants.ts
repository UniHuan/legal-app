export const DB_URL = 'https://xtvktvafjjrneldzenug.supabase.co';
export const DB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0dmt0dmFmampybmVsZHplbnVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNTQ1MjQsImV4cCI6MjA5NTYzMDUyNH0.c7GqP3j-vaJIzjNd13krexYyvCshMkq1UHj5l50k-lI';
export const AI_URL = 'https://xtvktvafjjrneldzenug.supabase.co/functions/v1/legal-ai-ask';
export const CATEGORIES: Record<string,{label:string;icon:string}> = {
  family:{label:'我的家',icon:'🏠'},money:{label:'我的钱',icon:'💰'},
  rights:{label:'我的权',icon:'🛡️'},affairs:{label:'我的事',icon:'📋'},
  housing:{label:'我的房',icon:'🏘️'},car:{label:'我的车',icon:'🚗'},
  work:{label:'我的工作',icon:'💼'},online:{label:'网上生活',icon:'🌐'}
};
export const VALUE_TIERS: Record<string,string> = {'富强':'national','民主':'national','文明':'national','和谐':'national','自由':'social','平等':'social','公正':'social','法治':'social','爱国':'personal','敬业':'personal','诚信':'personal','友善':'personal'};
export const BOOKS = [{b:1,t:'总则',c:204},{b:2,t:'物权',c:258},{b:3,t:'合同',c:526},{b:4,t:'人格权',c:51},{b:5,t:'婚姻家庭',c:79},{b:6,t:'继承',c:45},{b:7,t:'侵权责任',c:95}];
