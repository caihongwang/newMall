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
    payingBill: false,//是否选中了买单支付
    isAgreement: false,//是否同意协议
    useIntegralFlag:false,//是否积分抵现
    useBalanceFlag: false,//是否余额抵现
    integralInput:0,
    payBalance:0,
  },
  switchChange:function(e){
    this.setData({
      useIntegralFlag: e.detail.value
    })
  },
  switchChange1: function (e) {
    this.setData({
      useBalanceFlag: e.detail.value
    })
  },

  weChatPay:function(){
    if (!this.data.chooseWechat){
      this.setData({
        chooseWechat: true,
        payingBill: false,
        useIntegralFlag:false,
        useBalanceFlag:false
      })
    }

 
  },
  selectLoan: function () {
    if (!this.data.payingBill) {
      this.setData({
        chooseWechat: false,
        payingBill: true,
        useIntegralFlag: false,
        useBalanceFlag: false
      })
    }
   

    
  },

inputMoney:function(e){
  this.setData({
    payMoney: e.detail.value
  })


  },
  interInput:function(e){
    if (e.detail.value >= this.data.integral){
      this.setData({
        integralInput: this.data.integral
      })
    }else{
      this.setData({
        integralInput: e.detail.value
      })
    }
  

  },
  balanceInput:function(e){
    if (e.detail.value >= this.data.balance) {
      this.setData({
        payBalance: this.data.balance
      })
    } else {
      this.setData({
        payBalance: e.detail.value
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */

  getUserBaseInfo: function () {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.getUserBaseInfoUrl,
        success: function (res) {
          if (res.data.code == 0) {
            that.setData({
              balance: res.data.data.balance,
              integral: res.data.data.integral,
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








  
  payTheBillInMiniUrl: function () {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.payMoney = this.data.payMoney ;
    params.shopId = this.data.shopId;
    params.useBalanceFlag = this.data.useBalanceFlag;
    params.useIntegralFlag = this.data.useIntegralFlag;
    params.payIntegral = this.data.integralInput;
    params.payBalance = this.data.payBalance;
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.payTheBillInMiniUrl,
        success: function (res) {
          if (res.data.code == 0) {
            that.wxPayUnifiedOrder(res.data);
          } else {
            util.toast(res.data.message);
          }
        },
        fail: function (res) {
          util.toast("网络异常, 请稍后再试");
        }
      });
  },


  wxPayUnifiedOrder: function (param) {        //点击付款/打赏，向微信服务器进行付款
    //使用小程序发起微信支付
    wx.requestPayment({
      timeStamp: param.data.timeStamp,//记住，这边的timeStamp一定要是字符串类型的，不然会报错，我这边在java后端包装成了字符串类型了
      nonceStr: param.data.nonceStr,
      package: param.data.package,
      signType: 'MD5',      //小程序发起微信支付，暂时只支持“MD5”
      paySign: param.data.paySign,
      success: function (event) {
        wx.showToast({              //支付成功
          title: '支付成功',
          icon: 'success',
          duration: 2000,
          complete: function () {   //支付成功后发送模板消息
            console.log("模板消息已发送");
            return;
            var templateMessageParam = new Object();
            // 整理模板消息需要的参数
            // 整理模板消息需要的参数
            // 整理模板消息需要的参数
            // 整理模板消息需要的参数
            // 整理模板消息需要的参数
            // 整理模板消息需要的参数
            templateMessageParam.data = JSON.stringify(that.data.data);
            //发送模板消息，如果失败了也不给用户提示
            network.POST({
              params: templateMessageParam,
              requestUrl: requestUrl.sendTemplateMessageUrl,
              success: function (res) {

              },
              fail: function (res) {

              }
            });
          }
        });
      },
      fail: function (error) {      //支付失败
        console.log("支付失败");
        console.log(error);
        wx.showModal({
          title: '提示',
          content: '支付被取消.',
          showCancel: false
        });
      },
      complete: function () {       //不管支付成功或者失败之后都要处理的方法，类似与final
        console.log("支付完成");
      }
    });
  },



  surePay:function(){
   this. payTheBillInMiniUrl();
  },

  onLoad: function (options) {
    this.setData({
      shopId: options.shopId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserBaseInfo();

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})



