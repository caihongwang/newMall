// 可以参考别人写的 裁剪组件https://github.com/we-plugin/we-cropper
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
const util = require('../../../utils/util.js')

var app = getApp();
//index.js
//获取应用实例

Page({
  data: {
   
    userInfo: {},

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