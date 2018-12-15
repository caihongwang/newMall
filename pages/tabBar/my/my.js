// 可以参考别人写的 裁剪组件https://github.com/we-plugin/we-cropper
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
const util = require('../../../utils/util.js')

var app = getApp();
//index.js
//获取应用实例

Page({
  data: {
    tableData: [
      {
        "id": "1",
        "name": "收货地址管理",
        "page": "my/method/index",
        "image":'/images/logo.png'
      },
      {
        "id": "2",
        "name": "积分订单列表",
        "page": "my/intergralOrder/intergralOrder",
        "image": '/images/logo.png'

      },
      {
        "id": "3",
        "name": "提现明细",
        "page": "my/presenDetails/presenDetails",
        "image": '/images/logo.png'
      },
      {
        "id": "3",
        "name": "提现明细",
        "page": "my/feedback/index",
        "image": '/images/logo.png',
        'phone': '0102377455839' 
      }
    ],
    userInfo: {},

  }, 

  // 点击个人设置
  personalSetting:function(){
     wx:wx.navigateTo({
       url: '/pages/my/personalSetting/personalSetting',
       success: function(res) {},
       fail: function(res) {},
       complete: function(res) {},
     })
  },

  

  // 点击领取
  receive:function(){
    wx: wx.navigateTo({
      url: '/pages/my/personalCash/personalCash',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
// 点击等待奖励
  waitWard:function(){
    let id = 1;
    wx.navigateTo({
      url: '/pages/my/myOrder/myOrder?id='+id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
// 点击奖励列表
  waitList:function(){
    let id = 2;
    wx.navigateTo({ 
      url: '/pages/my/myOrder/myOrder?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 点击我的积分
  integralRecord:function(){
    wx.navigateTo({
      url: '/pages/my/integralRecord/integralRecord' ,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // 点击我的买单币
  myCion:function(){
    wx.navigateTo({
      url: '/pages/my/myCoin/myCoin',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // 点击我要加盟
  myJoin:function(){
    wx.navigateTo({
      url: '/pages/my/joinShop/joinShop',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  onLoad: function () {
    console.log('1111');

    if (wx.getStorageSync("USERINFO")){
      this.setData({
        userInfo: wx.getStorageSync("USERINFO"),
        hasUserInfo: true
      })
    }  
  },
  onShow:function() {
  }
})