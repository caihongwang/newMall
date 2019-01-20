// pages/my/intergralOrder/intergralOrder.js
var util = require('../../../utils/util.js');
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: "",  //订单ID
    orderDetail: {}//用来展示的订单
  },

  /**
   * 获取订单详情
   */
  getGoodsOrderDetail: function () {
    var that = this;
    var params = new Object();
    params.orderId = that.data.orderId;
    wx.showLoading({
      title: '客官请稍后...',
      mask: true
    });
    network.POST({
      params: params,
      requestUrl: requestUrl.getGoodsOrderDetailByIdUrl,
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 0) {
          that.data.orderDetail = res.data.data;
          that.setData({
            orderDetail: res.data.data
          });
          console.log(that.data.orderDetail);
        } else {
          util.toast(res.data.message);
        }
      },
      fail: function (res) {
        wx.hideLoading();
        util.toast("网络异常, 请稍后再试");
      }
    });
  },
  
  onLoad: function (options) {
    var orderId = options.orderId;
    this.setData({
      orderId: orderId
    });
    console.log("orderId = " + orderId);
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
    console.log("orderId = " + this.data.orderId);
    this.data.orderId = 5;
    if (this.data.orderId) {
      this.getGoodsOrderDetail();
    }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

})