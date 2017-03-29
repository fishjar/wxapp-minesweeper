// pages/game/game.js
const app = getApp();
Page({
  data:{
    config: null,
    cards: [],
    grids: [],
    start: false,
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
      height: 750/x,
      config: config
    });
  },
  handleClick(e){
    const that = this;
    const cards = this.data.cards;
    const n = this.data.config.n;
    const i = parseInt(e.currentTarget.id);
    const touchTime = this.data.touchEnd-this.data.touchStart;
    console.log(i);

    if(cards[i].open){
      return;
    }

    if(touchTime>350){
      cards[i].flag = !cards[i].flag;
      this.setData({cards:cards});
      return;
    }

    function openCard(i){
      if(!cards[i].open){
        cards[i].open = true;
        if(cards[i].num==0){
          that.getNeighbor(i).map(function(item){
            return openCard(item);
          });
        }
      }
    }

    !this.data.start && this.setBoom(i,cards,n,(cards)=>this.setData({cards:cards,start:true}));

    if(cards[i].boom){
      wx.showModal({
        title: 'GAME OVER',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            that.setData({
              cards: cards.map(function(item){
                item.open = true;
                return item;
              })
            });
          }
        }
      });
      return;
    }

    openCard(i);

    if(cards.length == cards.filter((item)=>item.open).length+this.data.config.n){
      wx.showModal({
        title: 'YOU WIN!!!!!',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            that.setData({
              cards: cards.map(function(item){
                item.open = true;
                return item;
              })
            });
          }
        }
      });
      return;
    }

    this.setData({cards:cards});

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
  setBoom:function(j,cards,n,cb){
    const newArr = this.getNeighbor(j).concat(j); //排除的+雷
    const arr = []; //空余池

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
      item.num = this.getNeighbor(i).filter((neighbor)=>cards[neighbor].boom).length;
      return item;
    }.bind(this));

    typeof cb == "function" && cb(newCards);
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