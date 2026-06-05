const app = getApp();
Page({
  data: { values: [] },
  onLoad() {
    wx.request({
      url: `${app.globalData.supabaseUrl}/rest/v1/fz_values?select=*&order=sort_order.asc`,
      header: { apikey: app.globalData.supabaseKey, Authorization: `Bearer ${app.globalData.supabaseKey}` },
      success: res => { if (res.data) this.setData({ values: res.data }); }
    });
  },
  goValueDetail(e) {
    const { id, name } = e.currentTarget.dataset;
    wx.showModal({ title: name, content: '请使用Web版查看完整价值观详情', showCancel: false });
  }
});
