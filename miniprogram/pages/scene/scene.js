const app = getApp();
Page({
  data: { scene: null },
  onLoad(opts) {
    if (opts.id) {
      wx.request({
        url: `${app.globalData.supabaseUrl}/rest/v1/fz_scenarios?id=eq.${opts.id}&select=*`,
        header: { apikey: app.globalData.supabaseKey, Authorization: `Bearer ${app.globalData.supabaseKey}` },
        success: res => { if (res.data && res.data.length) this.setData({ scene: res.data[0] }); }
      });
    }
  },
  askAI() { wx.switchTab({ url: '/pages/ai/ai' }); }
});
