const api = require('../../utils/api');
const CATS = [{key:'family',icon:'🏠',label:'我的家'},{key:'money',icon:'💰',label:'我的钱'},{key:'rights',icon:'🛡️',label:'我的权'},{key:'affairs',icon:'📋',label:'我的事'},{key:'housing',icon:'🏘️',label:'我的房'},{key:'car',icon:'🚗',label:'我的车'},{key:'work',icon:'💼',label:'我的工作'},{key:'online',icon:'🌐',label:'网上生活'}];
Page({
  data: { scenes: [], categories: CATS, searchText: '' },
  onLoad() { api.getScenarios(10).then(d => this.setData({ scenes: d || [] })); },
  onSearchInput(e) { this.setData({ searchText: e.detail.value }); },
  doSearch() { if(this.data.searchText) wx.navigateTo({ url: `/pages/ai/ai?q=${this.data.searchText}` }); },
  goAI() { wx.switchTab({ url: '/pages/ai/ai' }); },
  goScene(e) { wx.navigateTo({ url: `/pages/scene/scene?id=${e.currentTarget.dataset.id}` }); },
  goCategory(e) { wx.navigateTo({ url: `/pages/scene/scene?cat=${e.currentTarget.dataset.cat}` }); }
});
