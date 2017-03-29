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
    this.setData({
      x:app.globalData.config.x,
      y:app.globalData.config.y,
      n:app.globalData.config.n
    });
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  handleInputX:function(e){
    this.setData({x:parseInt(e.detail.value)});
  },
  handleInputY:function(e){
    this.setData({y:parseInt(e.detail.value)});
  },
  handleInputN:function(e){
    this.setData({n:parseInt(e.detail.value)});
  },
  handleSave:function(){
    const x = this.data.x;
    const y = this.data.y;
    const n = this.data.n;

    if(x<6||x>12){
      wx.showModal({
        title: '横向格子不得小于6或大于12！',
        showCancel: false
      });
      return;
    }

    if(y<6||y>12){
      wx.showModal({
        title: '纵向格子不得小于6或大于12！',
        showCancel: false
      });
      return;
    }

    if(n>(x*y-9)){
      wx.showModal({
        title: '埋雷数量过多！',
        showCancel: false
      });
      return;
    }

    if(n<1){
      wx.showModal({
        title: '埋雷数量过少！',
        showCancel: false
      });
      return;
    }

    Object.assign(app.globalData.config,{
      x: x,
      y: y,
      n: n
    });
    
    wx.navigateBack({
      delta: 1
    });
  }
})