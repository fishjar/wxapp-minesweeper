// pages/game/game.js
const app = getApp();
Page({
  data:{
    config: null,
    cards: [],
    grids: [],
    start: false,
    open: 0,
    touchStart:0,
    touchEnd:0,
    height: 0
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.newGame();
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
  newGame(){
    const config = app.globalData.config;
    const x = config.x;
    const y = config.y;
    const n = config.n;
    const cards = [];
    const grids = [];
    
    for(let i=0; i<y; i++){
      grids.push([]);
      for(let j=0; j<x; j++){
        const index = i*x+j;
        cards.push({
          index:index,
          boom:false,
          num:0,
          open:false,
          flag:false
        });
        grids[i].push(index);
      }
    }

    this.setData({
      cards: cards,
      grids: grids,
      start: false,
      open: x*y-n,
      height: 750/x,
      config: config
    });
  },
  handleClick(e){
    const i = parseInt(e.currentTarget.id);
    console.log(i);

    const touchTime = this.data.touchEnd-this.data.touchStart;

    if(touchTime>350){
      const cards = this.data.cards;
      cards[i].flag = !cards[i].flag;
      this.setData({cards:cards});
    }else{
      !this.data.start && this.setBoom(i);
      this.openCard(i);
    }
  },
  handleTouchStart(e){
    this.setData({
      touchStart:e.timeStamp
    });
  },
  handleTouchEnd(e){
    this.setData({
      touchEnd:e.timeStamp
    });
  },
  openCard:function(i){
    const cards = this.data.cards;

    if(cards[i].open){
      return;
    }

    cards[i].open = true;
    this.setData({
      cards:cards,
      open:--this.data.open
    });

    if(cards[i].boom){
      wx.showModal({
        title: 'GAME OVER',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            this.setData({
              cards: cards.map(function(item){
                item.open = true;
                return item;
              })
            });
          }
        }.bind(this)
      });
      return;
    }

    if(this.data.open==0){
      wx.showModal({
        title: 'YOU WIN!!!!!',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            this.setData({
              cards: cards.map(function(item){
                item.open = true;
                return item;
              })
            });
          }
        }.bind(this)
      });
      return;
    }

    if(cards[i].num==0){
      const ns = this.getNeighbor(i);
      ns.forEach(function(item){
        this.openCard(item);
      }.bind(this));
    }

  },
  setBoom:function(j){
    const cards = this.data.cards;
    const n = this.data.config.n;
    const newArr = this.getNeighbor(j).concat(j);

    const arr = [];
    for (let index of Array(cards.length).keys()) {
      newArr.indexOf(index)==-1 && arr.push(index);
    }

    for(let i=0; i<n; i++){
      const index = Math.floor(Math.random()*arr.length);
      cards[arr[index]].boom = true;
      newArr.push(arr[index]);
      arr.splice(index,1);
    }

    const newCards = cards.map(function(item,i){
      let num = 0;
      this.getNeighbor(i).forEach(function(neighbor){
        cards[neighbor].boom && num++;
      });
      item.num = num;
      return item;
    }.bind(this));

    this.setData({
      cards:newCards,
      start:true
    });
  },
  getNeighbor:function(i){
    const x = this.data.config.x;
    const y = this.data.config.y;
    const arr = [];

    !(i<x||i%x==0) && arr.push(i-x-1);
    !(i<x) && arr.push(i-x);
    !(i<x||i%x==(x-1)) && arr.push(i-x+1);
    !(i%x==0) && arr.push(i-1);
    // arr.push(i);
    !(i%x==(x-1)) && arr.push(i+1);
    !(i>=x*(y-1)||i%x==0) && arr.push(i+x-1);
    !(i>=x*(y-1)) && arr.push(i+x);
    !(i>=x*(y-1)||i%x==(x-1)) && arr.push(i+x+1);

    return arr
  }
})