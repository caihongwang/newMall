// pages/lucky-draw/lucky-draw.js
var util = require('../../../utils/util.js');
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    redEnvelopeList0: [{
        text: "一"
      },
      {
        text: "二"
      }, {
        text: "三"
      }, {
        text: "一"
      }, {
        text: "五"
      }, {
        text: "六"
      }, {
        text: "七"
      }, {
        text: "八"
      },
      {
        text: "九"
      }, {
        text: '十',
        prize: true,
      },
    ],
    redEnvelopeList1: [{
        text: "一"
      },
      {
        text: "二"
      }, {
        text: "三"
      }, {
        text: "二"
      }, {
        text: "五"
      }, {
        text: "六"
      }, {
        text: "七"
      }, {
        text: "八"
      },
      {
        text: "九"
      }, {
        text: '十',
        prize: true,
      },
    ],
    redEnvelopeList2: [{
        text: "一"
      },
      {
        text: "二"
      }, {
        text: "三"
      }, {
        text: "三"
      }, {
        text: "五"
      }, {
        text: "六"
      }, {
        text: "七"
      }, {
        text: "八"
      },
      {
        text: "九"
      }, {
        text: '十',
        prize: true,
      },
    ],
    animation0: -30,
    animation1: -30,
    animation2: -30,
    time0: 5,
    time1: 6.2,
    time2: 7.2,
    show: true,
    flashing: true,
    winInfo: [
    
    ],
    prizeShow: false,
    prizeList: new Array(30),
    QR: ''
  },
// 获取红包
  getLuckDrawUrl: function () { //点击抽奖按钮获取列表
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.wxOrderId = this.data.wxOrderId;
    network.POST({
      params: params,
      requestUrl: requestUrl.getLuckDrawUrl,
      success: function (res) {
        console.log(res.data);
        if (res.data.code == 0) {
            wx.showModal({
              title: '提示',
              content: '',//要展示的奖品的说明
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.redirectTo( 
                    {
                      url: '/pages/my/myOrder/myOrder?id=' + '1',
                    }
                  )

                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
        } else if (res.data.code == 200008) {      //您已抽过奖。如想再次抽奖，请再交易一笔订单.
          wx.showModal({
            title: '提示',
            content: '您已抽过奖。如想再次抽奖，请再交易一笔订单',
            showCancel: false
          })
       
    
        } else {
          util.toast(res.data.message);
        }
      },
      fail: function (res) {
        util.toast("网络异常, 请稍后再试");
      }
    });
  },

// 获取奖品列表
  getLuckDrawProductListUrl: function () { //点击抽奖按钮获取列表
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.dicType = 'luckDraw';
    network.POST({
      params: params,
      requestUrl: requestUrl.getLuckDrawProductListUrl,
      success: function (res) {
        console.log(res.data);
        if (res.data.code == 0) {
          that.setData({
            winInfo: res.data.data
          })
     

        } else {
          util.toast(res.message);
        }
      },
      fail: function (res) {
        util.toast("网络异常, 请稍后再试");
      }
    });
  },

 
  /**
   * @params sort 随机事件
   */
  sort(data) {
    //随机数组
    return data.sort((a, b) => {
      if (a.prize || b.prize) {

      } else {
        return a.text.charCodeAt() + parseInt(Math.random() * 1000) > b.text.charCodeAt() + parseInt(Math.random() * 1000)
      }
    })
  },
  /**
   * @params start 抽奖事件
   */
  start() {
    const that = this;

    //  重置数组顺序后转动两圈
    this.setData({
      redEnvelopeList0: that.sort(this.data.redEnvelopeList0),
      redEnvelopeList1: that.sort(this.data.redEnvelopeList1),
      redEnvelopeList2: that.sort(this.data.redEnvelopeList2)
    }, () => {
      that.setData({
        animation0: this.data.animation0 + 720
      })
    })
    setTimeout(() => {
      this.getLuckDrawUrl();
    }, 7000);   

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  showPrize() {
    this.setData({
      prizeShow: true
    });
  },
  closePrize() {
    this.setData({
      prizeShow: false
    });
  },
  /**
   * @params lamp 跑马灯封装
   */
  lamp() {
    let flashing = !this.data.flashing;
    this.setData({
      flashing: flashing
    }, () => {
      setTimeout(() => {
        this.lamp();
      }, 250);
    });
  },
  onReady: function () {
    this.lamp();
  },
 

  onLoad: function (options) {
    if (options.wxOrderId) {
      this.setData({
        wxOrderId: options.wxOrderId
      })
    }
    this.getLuckDrawProductListUrl();
  }
});