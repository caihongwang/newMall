// pages/cardFile/payment/payment.js
var network = require('../../../utils/network.js');
var util = require('../../../utils/util.js');
var requestUrl = require('../../../config.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseWechat: true, //是否选中了微信支付
    payingBill: false, //是否选中了买单支付
    isAgreement: false, //是否同意协议
    useIntegralFlag: false, //是否积分抵现
    useBalanceFlag: false, //是否余额抵现
    integralOfDeduction: 0,
    balanceOfDeduction: 0,
    payMoney: "",
    finalPayment: 0
  },
  isAgree: function() {
    // 点击是否选中图片
    this.data.isAgreement = !this.data.isAgreement
    this.setData({
      isAgreement: this.data.isAgreement
    })

  },
  weChatPay: function() {
    if (!this.data.chooseWechat) {
      this.setData({
        chooseWechat: true,
        payingBill: false,
        useIntegralFlag: false,
        useBalanceFlag: false
      })
    }
  },
  selectLoan: function() {
    if (!this.data.payingBill) {
      this.setData({
        chooseWechat: false,
        payingBill: true,
        useIntegralFlag: false,
        useBalanceFlag: false
      })
    }
  },

  /**
   * 打开积分switch
   */
  switchIntegralChange: function(e) {
    var useIntegralFlag = false;
    if (e.detail.value) {
      useIntegralFlag = e.detail.value;
    }
    var finalPayment = 0;
    var integralOfDeduction = this.data.integralOfDeduction;
    if (useIntegralFlag) {
      finalPayment = this.data.payMoney - this.data.integralOfDeduction;
      if (finalPayment < 0) {
        finalPayment = 0;
        integralOfDeduction = this.data.payMoney;
      }
    } else {
      finalPayment = this.data.payMoney;
    }
    this.setData({
      integralOfDeduction: integralOfDeduction,
      useIntegralFlag: useIntegralFlag,
      finalPayment: finalPayment
    });
  },

  /**
   * 打开余额switch
   */
  switchBanlanceChange1: function(e) {
    var useBalanceFlag = false;
    if (e.detail.value) {
      useBalanceFlag = e.detail.value;
    }
    var finalPayment = 0;
    var balanceOfDeduction = this.data.balanceOfDeduction;
    if (useBalanceFlag) {
      finalPayment = this.data.payMoney - this.data.balanceOfDeduction;
      if (finalPayment < 0){
        finalPayment = 0;
        balanceOfDeduction = this.data.payMoney;
      }
    } else {
      finalPayment = this.data.payMoney;
    }
    this.setData({
      balanceOfDeduction: balanceOfDeduction,
      useBalanceFlag: useBalanceFlag,
      finalPayment: finalPayment
    });
  },

  /**
   * 付款金额-输入框监听
   */
  payMoneyInputFunc: function(e) {
    var payMoney = 0;
    if (e.detail.value + "") {
      payMoney = e.detail.value;
      var finalPayment = 0;
      if (this.data.useIntegralFlag) {
        finalPayment = payMoney - this.data.integralOfDeduction;
      } else if (this.data.useIntegralFlag) {
        finalPayment = payMoney - this.data.balanceOfDeduction;
      } else {
        finalPayment = payMoney;
      }
      this.setData({
        payMoney: payMoney,
        finalPayment: finalPayment
      });
    } else {
      payMoney = 0;
    }
  },

  /**
   * 抵扣积分-输入框监听
   */
  integralInputFunc: function(e) {
    var integralOfDeduction = 0;
    if (e.detail.value + "") {
      if (Number(e.detail.value) >= Number(this.data.integral)) {
        integralOfDeduction = this.data.integral;
      } else {
        integralOfDeduction = e.detail.value;
      }
      var finalPayment = 0;
      var payMoney = 0;
      if (this.data.payMoney){
        payMoney = this.data.payMoney;
      }
      if (this.data.useIntegralFlag) {
        finalPayment = payMoney - integralOfDeduction;
        if (finalPayment < 0) {
          finalPayment = 0;
          integralOfDeduction = this.data.payMoney;
        }
      } else {
        finalPayment = payMoney;
      }
      this.setData({
        integralOfDeduction: integralOfDeduction,
        finalPayment: finalPayment
      });
    } else {
      integralOfDeduction = 0;
    }
  },

  /**
   * 抵扣余额-输入框监听
   */
  balanceInputFunc: function(e) {
    var balanceOfDeduction = 0;
    if (e.detail.value + "") {
      if (Number(e.detail.value) >= Number(this.data.balance)) {
        balanceOfDeduction = this.data.balance;
      } else {
        balanceOfDeduction = e.detail.value;
      }
      var finalPayment = 0;
      var payMoney = 0;
      if (this.data.payMoney) {
        payMoney = this.data.payMoney;
      }
      if (this.data.useBalanceFlag) {
        finalPayment = payMoney - balanceOfDeduction;
        if (finalPayment < 0) {
          finalPayment = 0;
          balanceOfDeduction = this.data.payMoney;
        }
      } else {
        finalPayment = payMoney;
      }
      this.setData({
        balanceOfDeduction: balanceOfDeduction,
        finalPayment: finalPayment
      });
    } else {
      balanceOfDeduction = 0;
    }
  },

  getUserBaseInfo: function() {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    network.POST({
      params: params,
      requestUrl: requestUrl.getUserBaseInfoUrl,
      success: function(res) {
        if (res.data.code == 0) {
          that.setData({
            balance: res.data.data.balance,
            integral: res.data.data.integral,
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

  payTheBillInMiniUrl: function() {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.payMoney = this.data.payMoney;
    params.shopTitle = this.data.shopTitle;
    params.shopId = this.data.shopId;
    params.useBalanceFlag = this.data.useBalanceFlag;
    params.useIntegralFlag = this.data.useIntegralFlag;
    params.payIntegral = this.data.integralOfDeduction;
    params.balanceOfDeduction = this.data.balanceOfDeduction;
    network.POST({
      params: params,
      requestUrl: requestUrl.payTheBillInMiniUrl,
      success: function(res) {
        if (res.data.code == 0) {
          that.wxPayUnifiedOrder(res.data);
        } else {
          util.toast(res.data.message);
        }
      },
      fail: function(res) {
        util.toast("网络异常, 请稍后再试");
      }
    });
  },

  wxPayUnifiedOrder: function(param) { //点击付款/打赏，向微信服务器进行付款
    //使用小程序发起微信支付
    wx.requestPayment({
      timeStamp: param.data.timeStamp, //记住，这边的timeStamp一定要是字符串类型的，不然会报错，我这边在java后端包装成了字符串类型了
      nonceStr: param.data.nonceStr,
      package: param.data.package,
      signType: 'MD5', //小程序发起微信支付，暂时只支持“MD5”
      paySign: param.data.paySign,
      success: function(event) {
        wx.showToast({ //支付成功
          title: '支付成功',
          icon: 'success',
          duration: 2000,
          complete: function() { //支付成功后发送模板消息
            console.log("模板消息已发送");
            let wxOrderId = param.data.wxOrderId;
            wx.navigateTo({
              url: '/pages/my/lucky-draw/lucky-draw?wxOrderId=' + wxOrderId
            })
          }
        });
      },
      fail: function(error) { //支付失败
        console.log("支付失败");
        console.log(error);
        wx.showModal({
          title: '提示',
          content: '支付被取消.',
          showCancel: false
        });
      },
      complete: function() { //不管支付成功或者失败之后都要处理的方法，类似与final
        console.log("支付完成");
      }
    });
  },

  surePay: function() {
    this.payTheBillInMiniUrl();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var shopId = "";
    var shopTitle = "";
    if (options.shopId) {
      shopId = options.shopId;
    }
    if (options.shopTitle) {
      shopTitle = options.shopTitle;
      wx.setNavigationBarTitle({
        title: "向 " + shopTitle + " 商家付款买单"
      });
    }
    console.log("shopTitle = " + shopTitle);
    console.log("shopId = " + shopId);
    this.setData({
      shopId: shopId,
      shopTitle: shopTitle
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getUserBaseInfo();

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})