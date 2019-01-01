// pages/my/personalCash/personalCash.js
var util = require('../../../utils/util.js');
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
// 点击全部提现
  allGet:function(){

  },
  // 点击提现
  buttonCash:function(){
   this. cashBalance();
  },

  cashBalance: function () {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.dicType = 'cashFee';

    network.POST(
      {
        params: params,
        requestUrl: requestUrl.cashBalanceUrl,
        success: function (res) {
          if (res.data.code == 0) {
            that.setData({
              cashFeeList: res.data.data
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



  getCashFeeList: function () {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.dicType = 'cashFee';

    network.POST(
      {
        params: params,
        requestUrl: requestUrl.getCashFeeListUrl,
        success: function (res) {
          if (res.data.code == 0) {
            that.setData({
              cashFeeList:res.data.data
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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