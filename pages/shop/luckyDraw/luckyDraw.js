var util = require('../../../utils/util.js');
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
Page({
  /**f
   * 页面的初始数据
   */
  data: {
    isPopup: false,
    prizeContent: '',
    redEnvelopeList0: [{
      text: "一"
    }, {
      text: "二"
    }, {
      text: "三"
    }, {
      text: "四"
    }, {
      text: "五"
    }, {
      text: "六"
    }, {
      text: "七"
    }, {
      text: "八",
      prize: true
    }],
    redEnvelopeList1: [{
      text: "一"
    }, {
      text: "二"
    }, {
      text: "三"
    }, {
      text: "四"
    }, {
      text: "五"
    }, {
      text: "六"
    }, {
      text: "七"
    }, {
      text: "八",
      prize: true
    }],
    redEnvelopeList2: [{
      text: "一"
    }, {
      text: "二"
    }, {
      text: "三"
    }, {
      text: "四"
    }, {
      text: "五"
    }, {
      text: "六"
    }, {
      text: "七"
    }, {
      text: "八",
      prize: true
    }],
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
    QR: '',
    number: 1,
    wxOrderId: ""
  },

  // 获取红包
  getLuckDrawUrl: function() { //点击抽奖按钮获取列表
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.wxOrderId = this.data.wxOrderId;
    console.log("params.wxOrderId = " + params.wxOrderId);
    network.POST({
      params: params,
      requestUrl: requestUrl.getLuckDrawUrl,
      success: function(res) {
        console.log(res.data);
        if (res.data.code == 0) {
          var content = "恭喜您，中了" + res.data.data.luckDrawLevelName + ",奖品：获得您刚才付款金额的 " + res.data.data.luckDrawName + "，快去我的奖品列表看看吧!";
          that.setData({
            prizeContent: content,
            isPopup: true,
          })
          // wx.showModal({
          //   title: '提示',
          //   content: content, //要展示的奖品的说明
          //   showCancel: false,
          //   complete: function () {
          //     that.setData({
          //       number: 0
          //     });
          //     wx.redirectTo({
          //       url: '/pages/my/myOrder/myOrder?id=' + '1',
          //     });
          //   }
          // });

        } else if (res.data.code == 200008) {
          //您已抽过奖。如想再次抽奖，请再交易一笔订单.
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false,
            complete: function() {
              that.setData({
                number: 0
              });
              wx.navigateBack();
            }
          });
        } else {
          util.toast(res.data.message);
        }
      },
      fail: function(res) {
        util.toast("网络异常, 请稍后再试");
      }
    });
  },
  // 点击取消
  popueCancel: function() {
    this.delete();
  },
  // 获取红包
  delete: function() { //点击抽奖按钮获取列表
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.wxOrderId = that.data.wxOrderId;
    params.status = 0;
    network.POST({
      params: params,
      requestUrl: requestUrl.deleteLuckDrawUrl, //删除接口名
      success: function(res) {
        console.log(res.data);
        if (res.data.code == 0) {
          that.setData({
            isPopup: false
          })
        } else {
          util.toast(res.data.message);
        }
      },
      fail: function(res) {
        util.toast("网络异常, 请稍后再试");
      }
    });
  },

  // 获取奖品列表
  getLuckDrawProductListUrl: function() { //点击抽奖按钮获取列表
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.dicType = 'luckDraw';
    network.POST({
      params: params,
      requestUrl: requestUrl.getLuckDrawProductListUrl,
      success: function(res) {
        console.log(res.data);
        if (res.data.code == 0) {
          that.setData({
            winInfo: res.data.data
          });
        } else {
          util.toast(res.message);
        }
      },
      fail: function(res) {
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
    });
  },
  /**
   * @params start 抽奖事件
   */
  start() {
    const that = this;
    if (this.data.number > 0) {
      //  重置数组顺序后转动两圈
      this.setData({
        redEnvelopeList0: that.sort(this.data.redEnvelopeList0),
        redEnvelopeList1: that.sort(this.data.redEnvelopeList1),
        redEnvelopeList2: that.sort(this.data.redEnvelopeList2)
      }, () => {
        that.setData({
          animation0: this.data.animation0 + 720
        });
      });
      setTimeout(() => {
        this.getLuckDrawUrl();
      }, 5000);
    } else {

      var content = "对不起，您的抽奖次数已用光，请重新去商家支付一笔订单再来抽奖吧";
      wx.showModal({
        title: '提示',
        content: content,
        showCancel: false,
      });
    }
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
  onReady: function() {
    this.lamp();
  },
  onShow: function(e) {
    // var isStartLuckDraw = this.data.isStartLuckDraw;
    // if (isStartLuckDraw) {
    //   this.start();
    // }
  },
  onLoad: function(options) {
    // var wxOrderId = "446ec37b9af340fd8769fc1116b55f1c";
    var wxOrderId = "";
    if (options.wxOrderId) {
      wxOrderId = options.wxOrderId;
    }
    this.setData({
      wxOrderId: wxOrderId
    });
    this.getLuckDrawProductListUrl();
  },
  onShareAppMessage: function(e) {
    var that = this;
    if (this.data.wxOrderId) {
      // this.setData({
      //   isStartLuckDraw: true
      // });
      var shareAppMessage = {
        title: '豪华大奖等你抢，精彩不停，等着你哦...', // 分享标题
        path: '/pages/shop/luckyDraw/luckyDraw',
        success: function() {
          that.setData({
            isPopup: false
          })
        }
      };
      return shareAppMessage;
    } else {
      wx.showModal({
        title: '提示',
        content: "请去商家交易一笔订单，再来抽奖吧.", //要展示的奖品的说明
        showCancel: false,
        complete: function() {
          console.log("1234567890");
          wx.reLaunch({
            url: '../../tabBar/shopList/shopList'
          });
        }
      });
    }
  }
});