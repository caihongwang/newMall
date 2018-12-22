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
    screen: [],

    // screen: ['全部', '面部护理', '面部护理', '面部护理', '面部护理', '面部护理', '面部护理', '面部护理', '面部护理'],
    list: [
      // {
      //   id: 1,
      //   images:'/images/home.png',
      //   describe:'面部护理',
      //   price:'3000',
      //   integral:' 3020'
      // },
      // {
      //   id: 2,
      //   images: '/images/home.png',
      //   describe: '面部护理',
      //   price: '3000',
      //   integral: ' 3020'
      // },
      // {
      //   id: 2,
      //   images: '/images/home.png',
      //   describe: '面部护理',
      //   price: '3000',
      //   integral: ' 3020'
      // },
      // {
      //   id: 2,

      //   images: '/images/home.png',
      //   describe: '面部护理',
      //   price: '3000',
      //   integral: ' 3020'
      // },
      // {
      //   id: 2,

      //   images: '/images/home.png',
      //   describe: '面部护理',
      //   price: '3000',
      //   integral: ' 3020'
      // },
      // {
      //   id: 2,

      //   images: '/images/home.png',
      //   describe: '面部护理',
      //   price: '3000',
      //   integral: ' 3020'
      // },
      // {
      //   id: 2,

      //   images: '/images/home.png',
      //   describe: '面部护理',
      //   price: '3000',
      //   integral: ' 3020'
      // },
      // {
      //   id: 2,

      //   images: '/images/home.png',
      //   describe: '面部护理',
      //   price: '3000',
      //   integral: ' 3020'
      // }

    ],

    currentItem: 0,//当前选中的索引

  },


  filter:function(e){
    if(e){
      var index = e.currentTarget.dataset.index;
    }else{
      var index = 0;
    }
    this.setData({
      currentItem:index
    })
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.category = this.data.screen[index].categoryCode;
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.getSimpleProductByCondition,
        success: function (res) {
          console.log(res.data);
          if (res.data.code == 0) {
            console.log(res.data.data);
            console.log(123);
            console.log(res.data.data[0].describeImgUrl)
            that.setData({
              list: res.data.data
            })

          } else {

          }

        },
        fail: function (res) {
          util.toast("网络异常, 请稍后再试");
        }
      });

    //调用筛选接口


  },

  //点击跳转到详情页
  goDetail:function(e){
    var id = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../../IntegralMall/IntegralDetail/IntegralDetail?id=' + id
    })

  },


  // 获取积分类型
  getType:function(boo){
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.dicType = 'category';
    if (!boo) {
      wx.showLoading({
        title: '加载中',
        mask: true
      });
    }
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.getProductTypeList,
        success: function (res) {
          console.log(res.data);
          boo ? wx.stopPullDownRefresh() : wx.hideLoading();
          if (res.data.code == 0) {
             console.log(res.data.data)
             that.setData({
               screen:res.data.data
             })
            that.filter();
          } else {

          }

        },
        fail: function (res) {
          boo ? wx.stopPullDownRefresh() : wx.hideLoading();
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
    this.getType(false);

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