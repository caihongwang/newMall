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
        "name": "提现明细",
        "page": "my/presenDetails/presenDetails",
        "image": '/images/cashedList.png'
      },
      {
        "id": "2",
        "name": "收货地址",
        "page": "commonPage/addressManage/addressManage",
        "image":'/images/receivingAddressList.png'
      },
      {
        "id": "3",
        "name": "积分订单",
        "page": "my/intergralOrder/intergralOrder",
        "image": '/images/intergralOrderList.png'
      },
      {
        "id": "4",
        "name": "投诉/加盟电话",
        "page": "my/feedback/index",
        "image": '/images/complaintAndLeaguePhone.png',
        'phone': '010-2377455839' 
      }
    ], 
    wxUserInfo: {},
    userBaseInfo: {
      "avatarUrl": "https://www.91caihongwang.com/resourceOfNewMall/user/default.png",
      "nickName": "默认",
      "balance": "0.00",
      "integral": "0.00",
      "allLeagueTotal": "200",
      "userType": "个人用户",
      "allLuckDrawTotal": "0",
      "recevicedLuckDrawTotal": "0",
      "waitLuckDrawTotal": "0"
    },
    balance: 0 ,//余额 0

  }, 

  // 点击个人设置
  personalSetting:function(){
    wx.navigateTo({
       url: '/pages/my/personalSetting/personalSetting',
       success: function(res) {},
       fail: function(res) {},
       complete: function(res) {},
     })
  },

  

  // 点击领取
  receive:function(){
   wx.navigateTo({
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
    if (wx.getStorageSync("USERINFO")){
      this.setData({
        wxUserInfo: wx.getStorageSync("USERINFO"),
        hasUserInfo: true
      })
    }
    this.getUserBaseInfo();
  },
  /**
   * 获取用户基本信息
   */
  getUserBaseInfo: function () {
    var that = this;
    var params = new Object();
    network.POST({
        params: params,
        requestUrl: requestUrl.getUserBaseInfo,
        success: function (res) {
          console.log(res.data);
          if (res.data.code == 0) {
            console.log(res.data.data)
            that.setData({
              userBaseInfo: res.data.data
            })
          } else {

          }
        },
        fail: function (res) {
          util.toast("网络异常, 请稍后再试");
        }
      });
  },
  onShow:function() {
  }
})