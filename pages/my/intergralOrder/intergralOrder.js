// pages/my/intergralOrder/intergralOrder.js

var util = require('../../../utils/util.js');
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        name: '所有订单',
        id: 0
      },
      {
        name: '待付款',
        id: 1
      },
      {
        name: '配送中',
        id: 2
      },
      {
        name: '已完成',
        id: 2
      },
    ],
    chosseId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
// 点击切换列表
  chooseList: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      chosseId: index
    })

  },
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