// pages/shop/shopInformation/shopInformation.js
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
    shopId: "",
    shopTitle: "",
    shopInformation: {},
  },

  // 点击付款
  payment: function() {
    let that = this;
    wx.navigateTo({ //  跳转到创建团队的页面
      // 跳转到一个选择列表的页
      url: '/pages/shop/payment/payment?shopId=' + that.data.shopId + '&shopTitle=' + that.data.shopTitle
    });

  },
  // 调用打开腾讯地图
  goMap: function() {
    let that = this;
    wx.openLocation({
      latitude: parseFloat(that.data.shopInformation.shopLat),
      longitude: parseFloat(that.data.shopInformation.shopLon),
      name: that.data.shopInformation.shopTitle,
      address: that.data.shopInformation.shopAddress,
    });
  },

  // 拨打电话
  contactPhone: function (e) {
    var phone = "17701359899";
    console.log(e);
    if (e.currentTarget.dataset.shopphone){
      phone = e.currentTarget.dataset.shopphone;
    }
    wx.makePhoneCall({
      phoneNumber: phone
    });
  },


  getShopCondition: function() {
    var that = this;
    var params = new Object();
    params.shopId = this.data.shopId;
    params.currentLon = app.globalData.longitude;
    params.currentLat = app.globalData.latitude;
    network.POST({
      params: params,
      requestUrl: requestUrl.getShopByCondition,
      success: function(res) {
        if (res.data.code == 0) {
          res.data.data.shopDescribeImgUrl = JSON.parse(res.data.data[0].shopDescribeImgUrl);
          that.setData({
            shopTitle: res.data.data[0].shopTitle,
            shopInformation: res.data.data[0],
            shopDescribeImgUrl: res.data.data.shopDescribeImgUrl
          });
          //更改当前小程序的标题
          wx.setNavigationBarTitle({
            title: that.data.shopTitle
          });
          console.log(that.data.shopInformation);
        } else {
          util.toast(res.data.message);
        }
      },
      fail: function(res) {
        util.toast("网络异常, 请稍后再试");
      }
    });
  },

  getLocaltionAndShopCondition: function(){
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
        app.globalData.latitude = res.latitude;
        app.globalData.longitude = res.longitude;
        console.log('获取地理位置成功');
        //获取商家列表
        that.getShopCondition();
      },
      fail(res) {
        wx.showModal({
          title: '温馨提示',
          content: '小程序需要获取地理位置权限，点击确认前往设置或者退出程序？',
          showCancel: false,
          success: function () {
            that.openSetting();
          }
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    var shopId = "";
    if (options.shopId) {
      shopId = options.shopId;
    } else {
      shopId = 5;
    }
    this.setData({
      shopId: shopId
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getLocaltionAndShopCondition();
  },

  openSetting: function() { //打开设置
    var that = this;
    wx.openSetting({
      success: function(res) {
        console.log(res);
        if (res.authSetting["scope.userLocation"]) { //用户打开了用户信息授权
          wx.getLocation({
            type: 'wgs84',
            success(res) {
              that.setData({
                latitude: res.latitude,
                longitude: res.longitude
              });
              app.globalData.latitude = res.latitude;
              app.globalData.longitude = res.longitude;
              console.log('获取地理位置成功');
            }
          })
        } else { //用户没有打开用户信息授权
          that.showForceToast();
        }
      }
    })
  },

  showForceToast: function() { //弹出强制强制授权弹框
    var that = this;
    wx.showModal({
      title: '温馨提示',
      content: '小程序需要获取地理位置权限，点击确认前往设置或者退出程序？',
      showCancel: false,
      success: function() {
        that.openSetting();
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})