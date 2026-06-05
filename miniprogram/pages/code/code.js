const app = getApp();
Page({
  data: { articles: [], query: '' },
  onLoad() {
    wx.request({
      url: `${app.globalData.supabaseUrl}/rest/v1/fz_articles?select=article_number,one_liner&order=article_number.asc&limit=50`,
      header: { apikey: app.globalData.supabaseKey, Authorization: `Bearer ${app.globalData.supabaseKey}` },
      success: res => { if (res.data) this.setData({ articles: res.data }); }
    });
  },
  onSearch(e) {
    const q = e.detail.value;
    this.setData({ query: q });
    if (q.length >= 2) {
      wx.request({
        url: `${app.globalData.supabaseUrl}/rest/v1/fz_articles?select=article_number,one_liner&or=(one_liner.ilike.*${q}*,content_plain.ilike.*${q}*)&limit=20`,
        header: { apikey: app.globalData.supabaseKey, Authorization: `Bearer ${app.globalData.supabaseKey}` },
        success: res => { if (res.data) this.setData({ articles: res.data }); }
      });
    }
  },
  goArticle(e) { wx.showModal({ title: `第${e.currentTarget.dataset.num}条`, content: '请使用Web版查看完整法条详情', showCancel: false }); }
});
