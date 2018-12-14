// pages/IntegralMall/IntegralDetail/IntegralDetail.js
var network = require('../../../utils/network.js');
var util = require('../../../utils/util.js');
var requestUrl = require('../../../config.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // MOCKDATA
    detail:{
      images:'/images/home.png',
      describe: '面部护理',
      price: '3000',
      integral: ' 3020',
      stock: 99,
      imageList: ['/images/home.png', '/images/home.png', '/images/home.png', '/images/home.png', '/images/home.png', '/images/home.png', '/images/home.png',]
    }

  },
//  点击立即购买
  nowBuy:function(){
    wx.navigateTo({
      // url: '../../IntegralMall/IntegralDetail/IntegralDetail?id=' + id
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
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