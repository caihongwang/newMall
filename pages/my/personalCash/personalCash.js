// pages/my/personalCash/personalCash.js
var util = require('../../../utils/util.js');
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cashMoney: '', //提现金额
    canCashMoney: 0, //可提现金额
  },

  //  输入提现金额
  inputCash: function(e) {
    console.log(e.detail.value);
    if (this.data.canCashMoney <= e.detail.value) {
      this.setData({
        cashMoney: this.data.canCashMoney
      });
    } else {
      this.setData({
        cashMoney: e.detail.value
      });
    }
  },

  /**
   * 点击全部提现
   */
  allCash: function() {
    this.setData({
      cashMoney: this.data.canCashMoney
    });
  },

  /**
   * 点击提现按钮
   */
  cashBalanceToWx: function() {
    this.cashBalance();
  },

  /**
   * 提现余额
   */
  cashBalance: function() {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.cashToWxMoney = this.data.cashMoney;
    network.POST({
      params: params,
      requestUrl: requestUrl.cashBalanceUrl,
      success: function(res) {
        if (res.data.code == 0) {
          if (res.data.data){
            if (res.data.data.userBalance){
              that.setData({
                canCashMoney: res.data.data.userBalance
              });
            }
          }
          util.toast(res.data.message);
        } else {
          util.toast(res.data.message);
        }
      },
      fail: function(res) {
        util.toast("网络异常, 请稍后再试");
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var canCashMoney = 0.0;
    if (options.balance){
      canCashMoney = options.balance;
    }
    this.setData({
      canCashMoney: canCashMoney
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