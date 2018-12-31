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
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    shopInformation:{},
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
    wx.getLocation({//获取当前经纬度
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息  
      success: function (res) {
        wx.openLocation({//​使用微信内置地图查看位置。
          latitude: 22.5542080000,//要去的纬度-地址
          longitude: 113.8878770000,//要去的经度-地址
          name: "宝安中心A地铁口",
          address: '宝安中心A地铁口'
        })
      }
    })
  },


  getShopCondition: function () {
    var that = this;
    var params = new Object();
    params.shopId = this.data.shopId;
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.getShopByCondition,
        success: function (res) {
          console.log(res.data);
          if (res.data.code == 0) {
            console.log(res.data.data)
            that.setData({
              shopInformation: res.data.data,
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
    console.log(options);
      this.setData({
        shopId: options.shopId,
      })
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
    this.getShopCondition();

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