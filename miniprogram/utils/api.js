const app = getApp();
module.exports = {
  getScenarios: (limit = 10) => app.request(`fz_scenarios?select=*&order=view_count.desc&limit=${limit}`),
  getScenario: (id) => app.request(`fz_scenarios?id=eq.${id}`),
  getArticles: (limit = 20) => app.request(`fz_articles?select=*&order=article_number.asc&limit=${limit}`),
  getArticleByNum: (num) => app.request(`fz_articles?article_number=eq.${num}`),
  getValues: () => app.request('fz_values?select=*&order=sort_order.asc'),
  getQuizByDate: (date) => app.request(`fz_quiz?publish_date=eq.${date}`),
  getTemplates: () => app.request('fz_templates?select=*'),
  searchScenes: (q) => app.search('fz_scenarios', q, 'title'),
  searchArticles: (q) => app.search('fz_articles', q, 'content_plain'),
  aiAsk: (q) => app.aiAsk(q)
};
