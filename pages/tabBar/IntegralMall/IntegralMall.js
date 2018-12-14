// pages/tabBar/IntegralMall/IntegralMall.js
//logs.js
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
const util = require('../../../utils/util.js')

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // MOCKDATA
    screen: ['全部', '面部护理', '面部护理', '面部护理', '面部护理', '面部护理', '面部护理', '面部护理', '面部护理'],
    list: [
      {
        images:'/images/home.png',
        describe:'面部护理',
        price:'3000',
        integral:' 3020'
      },
      {
        images: '/images/home.png',
        describe: '面部护理',
        price: '3000',
        integral: ' 3020'
      },
      {
        images: '/images/home.png',
        describe: '面部护理',
        price: '3000',
        integral: ' 3020'
      },
      {
        images: '/images/home.png',
        describe: '面部护理',
        price: '3000',
        integral: ' 3020'
      },
      {
        images: '/images/home.png',
        describe: '面部护理',
        price: '3000',
        integral: ' 3020'
      },
      {
        images: '/images/home.png',
        describe: '面部护理',
        price: '3000',
        integral: ' 3020'
      },
      {
        images: '/images/home.png',
        describe: '面部护理',
        price: '3000',
        integral: ' 3020'
      },
      {
        images: '/images/home.png',
        describe: '面部护理',
        price: '3000',
        integral: ' 3020'
      }

    ],

    currentItem: 0,//当前选中的索引

  },

  filter:function(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      currentItem:index
    })

    //调用筛选接口


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