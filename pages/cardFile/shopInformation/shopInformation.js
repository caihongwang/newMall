// pages/cardFile/shopInformation/shopInformation.js
var network = require('../../../utils/network.js');
var util = require('../../../utils/util.js');
var requestUrl = require('../../../config.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopInformation: {},
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000
  },
 
// 点击付款
  payment:function(){
    wx.navigateTo({  //  跳转到创建团队的页面
      // 跳转到一个选择列表的页
     
      url: '/pages/cardFile/payment/payment'

    });

  },
  // 调用打开腾讯地图
  goMap: function(){

  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var shopInformation = decodeURIComponent(options.shopInformation);
    shopInformation = JSON.parse(shopInformation);
      this.setData({
        shopInformation: shopInformation,
      })
    console.log(shopInformation.wheelImages);
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