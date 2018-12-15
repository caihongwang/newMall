// pages/my/joinShop/joinShop.js
// pages/my/integralRecord/integralRecord.js
var util = require('../../../utils/util.js');
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    list: [
      {
        name: '我要开店',
        id: 0
      },
      {
        name: '成为服务商',
        id: 1
      },
      {
        name: '成为代理',
        id: 2
      }
    ],
    chosseId: 0

  },
  // 点击切换列表
  chooseList: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      chosseId: index
    })
  },
// 点击提交
  submit:function(){

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync("USERINFO")) {
      this.setData({
        userInfo: wx.getStorageSync("USERINFO"),
        hasUserInfo: true
      })
    }  
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