const api = require('../../utils/api');
Page({
  data: { messages: [], input: '', loading: false, lastId: '' },
  onLoad(opts) { if(opts.q) { this.setData({input:opts.q}); this.doAsk(); }},
  onInput(e) { this.setData({input:e.detail.value}); },
  askPreset(e) { this.setData({input:e.currentTarget.dataset.q}); this.doAsk(); },
  async doAsk() {
    const q = this.data.input.trim(); if(!q) return;
    const msgs = [...this.data.messages, {id:Date.now(),role:'user',content:q}];
    this.setData({messages:msgs,input:'',loading:true,lastId:'msg-'+msgs[msgs.length-1].id});
    try {
      const answer = await api.aiAsk(q);
      const botMsg = {id:Date.now()+1,role:'bot',content:answer||'服务暂不可用，请重试。\n\n📞 12348'};
      this.setData({messages:[...msgs,botMsg],loading:false,lastId:'msg-'+botMsg.id});
    } catch(e) {
      this.setData({loading:false,messages:[...msgs,{id:Date.now()+1,role:'bot',content:'服务暂不可用。\n\n📞 法律援助热线：12348'}]});
    }
  }
});
