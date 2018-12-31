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

  },
  switchChange:function(e){
    this.setData({
      useBalanceFlag: e.detail.value
    })
  },
  switchChange1: function (e) {
    this.setData({
      useIntegralFlag: e.detail.value
    })
  },

  weChatPay:function(){
    this.setData({
      chooseWechat:true,
      payingBill:false,
    })
  },
  selectLoan: function () {
    this.setData({
      chooseWechat: false,
      payingBill: true,
    })
  },
  
inputMoney:function(){

  },
  interInput:function(){

  },
  balanceInput:function(){

  },
  /**
   * 生命周期函数--监听页面加载
   */


  
  payTheBillInMiniUrl: function () {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.payMoney = this.data.payMoney ;
    params.shopId = this.data.shopId;
    params.useBalanceFlag = this.data.useBalanceFlag;
    params.useIntegralFlag = this.data.useIntegralFlag;
    params.payIntegral = this.data, payIntegral;
    params.payBalance = this.data.payBalance;
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.payTheBillInMiniUrl,
        success: function (res) {
          if (res.data.code == 0) {
         
          } else {
            util.toast(res.data.message);
          }
        },
        fail: function (res) {
          util.toast("网络异常, 请稍后再试");
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



