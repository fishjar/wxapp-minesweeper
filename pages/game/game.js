// pages/game/game.js
const app = getApp();
Page({
  data:{
    config: {
      x: 0,
      y: 0,
      n: 0
    },
    cards: [],
    grids: [],
    // arr: [],
    start: false,
    open: 0,
    touchStart:0,
    touchEnd:0,
    height: 0
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
      config:{
        x:app.globalData.config.x,
        y:app.globalData.config.y,
        n:app.globalData.config.n
      },
      height: 750/app.globalData.config.x      
    });
    this.newGame();
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  newGame(){
    const x = this.data.config.x;
    const y = this.data.config.y;
    const n = this.data.config.n;
    const cards = [];
    const grids = [];
    // const arr = [];
    
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
        // arr.push(index);
      }
    }

    this.setData({
      cards: cards,
      grids: grids,
      // arr: arr,
      start: false,
      open: x*y-n
    });
  },
  handleClick(e){
    const i = parseInt(e.currentTarget.id);
    console.log(i);

    // console.log(this.data.touchEnd);
    // console.log(this.data.touchStart);
    const touchTime = this.data.touchEnd-this.data.touchStart;
    // console.log(touchTime);
    if(touchTime>350){
      const cards = this.data.cards;
      cards[i].flag = true;
      this.setData({cards:cards});
    }else{
      !this.data.start && this.setBoom(i);
      this.handleOpen(i);
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
  handleOpen:function(i){
    // const i = e.currentTarget.id;
    // console.log(i);

    // !this.data.start && this.setBoom(i);
    // this.getNeighbor(i);

    const cards = this.data.cards;

    if(cards[i].open){
      // console.log('OPENED!!!!!!!!!!!!!!!');
      return;
    }else{
      cards[i].open = true;
      this.setData({
        cards:cards,
        open:--this.data.open
      });
      console.log(this.data.open);
      if(this.data.open==0){
        wx.showModal({
          title: 'YOU WIN!!!!!',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              // console.log('用户点击确定')
              this.newGame();
            }
          }.bind(this)
        });
      }
    }

    if(cards[i].boom){
      // console.log('boom!!!!!!!!!!!!!!!');
      wx.showModal({
        title: 'GAME OVER',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            this.newGame();
          }
        }.bind(this)
      });
    }else if(cards[i].num==0){
      const ns = this.getNeighbor(i);
      ns.forEach(function(item){
        this.handleOpen(item);
      }.bind(this));
    }



  },
  setBoom:function(j){
    const cards = this.data.cards;
    // const arr = this.data.arr;
    const num = this.data.config.n;
    const newArr = this.getNeighbor(j).concat(j);
    // arr.splice(j,1);
    // const arr = [...Array(cards.length).keys()];
    const arr = [];
    for (let index of Array(cards.length).keys()) {
      newArr.indexOf(index)==-1 && arr.push(index);
    }
    // console.log(newArr);
    // console.log(arr);

    for(let i=0; i<num; i++){
      const index = Math.floor(Math.random()*arr.length);
      cards[arr[index]].boom = true;
      newArr.push(arr[index]);
      arr.splice(index,1);
    }

    const newCards = cards.map(function(card,i){
      let n = 0;
      this.getNeighbor(i).forEach(function(neighbor){
        cards[neighbor].boom && n++;
      });
      card.num = n;
      return card;
    }.bind(this));



    this.setData({
      arr:arr.concat(newArr),
      cards:newCards,
      start: true
    });
  },
  getNeighbor:function(i){
    const x = this.data.config.x;
    const y = this.data.config.y;
    // const arr = [i-x-1,i-x,i-x+1,i-1,i+1,i+x-1,i+x,i+x+1];
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

    // console.log(arr);
    return arr
  },
  handleSetting:function(){
    wx.navigateTo({
      url: '../setting/setting'
    })
  }
})