// pages/setting/setting.js
const app = getApp();
Page({
  data:{
    x:0,
    y:0,
    n:0
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    this.setData({
      x:app.globalData.config.x,
      y:app.globalData.config.y,
      n:app.globalData.config.n
    })
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  handleInputX:function(e){
    this.setData({x:e.detail.value});
  },
  handleInputY:function(e){
    this.setData({y:e.detail.value});
  },
  handleInputN:function(e){
    this.setData({n:e.detail.value});
  },
  handleSave:function(){
    const x = parseInt(this.data.x);
    const y = parseInt(this.data.y);
    const n = parseInt(this.data.n);

    if(x<6||x>12){
      wx.showModal({
        title: '横向格子不得小于6或大于12！',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            // console.log('用户点击确定')
          }
        }.bind(this)
      });
      return;
    }

    if(y<6||y>12){
      wx.showModal({
        title: '纵向格子不得小于6或大于12！',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            // console.log('用户点击确定')
          }
        }.bind(this)
      });
      return;
    }

    if(n>(x*y-9)){
      wx.showModal({
        title: '埋雷数量过多！',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            // console.log('用户点击确定')
          }
        }.bind(this)
      });
      return;
    }

    app.globalData.config.x = x;
    app.globalData.config.y = y;
    app.globalData.config.n = n;
    
    wx.navigateBack({
      delta: 1
    })
  }
})