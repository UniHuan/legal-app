const app = getApp();
const CATS = [
  {key:'family',icon:'🏠',label:'我的家'},{key:'money',icon:'💰',label:'我的钱'},
  {key:'rights',icon:'🛡️',label:'我的权'},{key:'affairs',icon:'📋',label:'我的事'},
  {key:'housing',icon:'🏘️',label:'我的房'},{key:'car',icon:'🚗',label:'我的车'},
  {key:'work',icon:'💼',label:'我的工作'},{key:'online',icon:'🌐',label:'网上生活'}
];
Page({
  data: { scenes: [], categories: CATS, input: '' },
  onLoad() { this.loadScenes(); },
  onShow() { this.loadScenes(); },
  loadScenes() {
    wx.request({
      url: `${app.globalData.supabaseUrl}/rest/v1/fz_scenarios?select=*&order=view_count.desc&limit=10`,
      header: { apikey: app.globalData.supabaseKey, Authorization: `Bearer ${app.globalData.supabaseKey}` },
      success: res => { if (res.data) this.setData({ scenes: res.data }); }
    });
  },
  onInput(e) { this.setData({ input: e.detail.value }); },
  doSearch() { if(this.data.input) wx.switchTab({ url: '/pages/ai/ai?q=' + this.data.input }); },
  goAI() { wx.switchTab({ url: '/pages/ai/ai' }); },
  goScene(e) { wx.navigateTo({ url: '/pages/scene/scene?id=' + e.currentTarget.dataset.id }); },
  goCategory(e) {
    const cat = e.currentTarget.dataset.cat;
    const label = CATS.find(c => c.key === cat)?.label || cat;
    wx.request({
      url: `${app.globalData.supabaseUrl}/rest/v1/fz_scenarios?select=*&category=eq.${cat}&order=view_count.desc&limit=50`,
      header: { apikey: app.globalData.supabaseKey, Authorization: `Bearer ${app.globalData.supabaseKey}` },
      success: res => {
        if (res.data && res.data.length > 0) {
          this.setData({ scenes: res.data });
          wx.showToast({ title: label+' · '+res.data.length+'个场景', icon: 'none' });
        } else {
          wx.showToast({ title: '该分类暂无场景', icon: 'none' });
        }
      }
    });
  },
  callHotline() { wx.makePhoneCall({ phoneNumber: '12348' }); }
});
