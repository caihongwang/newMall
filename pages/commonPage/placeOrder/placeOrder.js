// pages/commonPage/placeOrder/placeOrder.js
var network = require('../../../utils/network.js');
var util = require('../../../utils/util.js');
var requestUrl = require('../../../config.js');
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'233333333333333',
    price:33
  },


  surePay:function(){
    var that = this;
    var params = new Object();
    params.bookingNo = bookingNo;
    params.total_fee = total_fee;
    params.openid = openid;
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.getContactsIntegralTopUrl,
        success: function (res) {
          　wx.requestPayment({
            　　'timeStamp': timeStamp, 
                'nonceStr': nonceStr,
            　　 'package': 'prepay_id=' + res.data.prepay_id,
            　　 'signType': 'MD5', 
            　　'paySign': res.data._paySignjs　,
            　 'success': function (res) {
            　　console.log(res);
            　　},
             'fail': function (res) {
            　　console.log('fail:' + JSON.stringify(res));
            　　}
            　　})
        },
        fail: function (res) {
          util.toast("网络异常, 请稍后再试");
        }
      });
   
  },
// 点击跳转到地址管理页
  goAddress:function(){
    wx.navigateTo({
      url: '/pages/commonPage/addressManage/addressManage',
    })

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