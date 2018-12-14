//获取应用实例
var network = require('../../../utils/network.js');
var util = require('../../../utils/util.js');
var requestUrl = require('../../../config.js');
var netool = require('../../../utils/netool.js')

const app = getApp();
Page({
  data: {
    // isAuthorization: true,//是否已经授权的遮罩
    isIpx: app.globalData.isIpx,
    isAuthorization: false, //判断授权弹窗是否展示
    latitude: 23.099994,  //经纬度
    longitude: 113.324520,
    markers: [{
      iconPath: '/images/logo.png',
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }],
  },
  onLoad: function (options) {
    // app.globalData.isRefreshTagForIndex = true;    //从分享页面过来刷新
    // wx.hideShareMenu();    //首页隐藏转发按钮
    // if (options.isHavePhone) {
    //   wx.hideTabBar({
    //     success: function (res) {
    //     },
    //     fail: function (res) {
    //     },
    //   });
    //   let editData = options.isHavePhone;
    // }

// 新增
   var that = this;
    // 是否已经授权
    var authorization = wx.getStorageSync('USERINFO');
    console.log(authorization);
    console.log('是否已经授权');

    if (!authorization) {
      this.setData({
        isAuthorization:true
      })    
      wx.hideTabBar({
        success: function (res) {
        },
        fail: function (res) {
        },
      });
      let editData = options.isHavePhone;
    }
  // 调用获取地理位置的api
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })  
        // const speed = res.speed
        // const accuracy = res.accuracy
      }
    })

  },
  onShow: function () {
    // app.globalData.saveCardId = '';
    // var that = this;
    // this.dialog = this.selectComponent("#dialog");
    // var userPhone = wx.getStorageSync('userPhone');
    // var isHaveUserPhone = wx.getStorageSync('isHaveUserPhone');
  
  },


// 点击确认授权
  onGotUserInfo: function(e){
    var that = this;
    wx.setStorageSync("USERINFO", e.detail.userInfo);
    app.globalData.userInfo = e.detail.userInfo;
    wx.showTabBar({
      success: function (res) {
        that.setData({
          isAuthorization: false
        })    
      },
      fail: function (res) {
      },
    });
  },

  // 拨打投诉电话
  callHotline:function(){
    console.log(22222);
    wx.makePhoneCall({
      phoneNumber: '111111111' // 仅为示例，并非真实的电话号码
    })

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(res) {
  }
})
