const app = getApp();
const today = new Date().toISOString().split('T')[0];
Page({
  data: { quiz: null, answered: false },
  onLoad() {
    wx.request({
      url: `${app.globalData.supabaseUrl}/rest/v1/fz_quiz?publish_date=eq.${today}&select=*`,
      header: { apikey: app.globalData.supabaseKey, Authorization: `Bearer ${app.globalData.supabaseKey}` },
      success: res => {
        if (res.data && res.data.length) {
          const quiz = res.data[0];
          quiz.options = quiz.options.map(o => ({ ...o, status: '' }));
          this.setData({ quiz });
        }
      }
    });
  },
  checkAnswer(e) {
    if (this.data.answered) return;
    const label = e.currentTarget.dataset.label;
    const quiz = this.data.quiz;
    quiz.options = quiz.options.map(o => ({
      ...o,
      status: o.label === quiz.correct_answer ? 'correct' : (o.label === label && label !== quiz.correct_answer ? 'wrong' : '')
    }));
    this.setData({ quiz, answered: true });
  }
});
