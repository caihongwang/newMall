// 可以参考别人写的 裁剪组件https://github.com/we-plugin/we-cropper
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
const util = require('../../../utils/util.js')

var app = getApp();
//index.js
//获取应用实例

Page({
  data: {
    tableData: [{
      //   "id": "1",
      //   "name": "提现明细",
      //   "page": "my/cashDetails/cashDetails",
      //   "image": '/images/cashedList.png'
      // },
      // {
      //   "id": "2",
      //   "name": "收货地址",
      //   "page": "commonPage/addressManage/addressManage",
      //   "image": '/images/addressLogo.png'
      // },
      // {
      //   "id": "3",
      //   "name": "积分商城订单",
      //   "page": "my/intergralOrder/intergralOrder",
      //   "image": '/images/intergralOrderList.png'
      // },
      // {
      "id": "4",
      "name": "投诉/加盟电话",
      "page": "my/feedback/index",
      "image": '/images/complaintAndLeaguePhone.png',
      'phone': '010-2377455839'
    }],
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
    balance: 0, //余额 0

  },

  // 点击个人设置
  personalSetting: function() {
    wx.navigateTo({
      url: '/pages/my/personalSetting/personalSetting',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 提现
   */
  cashedToWx: function() {
    console.log(this.data.userBaseInfo.balance);
    let balance = this.data.userBaseInfo.balance;
    wx.navigateTo({
      url: '/pages/my/personalCash/personalCash?balance=' + balance,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 点击等待奖励
  waitWard: function() {
    let id = 1;
    wx.navigateTo({
      url: '/pages/my/myOrder/myOrder?id=' + id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 点击奖励列表
  waitList: function() {
    let id = 2;
    wx.navigateTo({
      url: '/pages/my/myOrder/myOrder?id=' + id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 点击我的积分
  integralRecord: function() {
    wx.navigateTo({
      url: '/pages/my/integralRecord/integralRecord?integral=' + this.data.userBaseInfo.integral,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  // 点击我的余额
  balanceRecord: function() {
    wx.navigateTo({
      url: '/pages/my/balanceRecord/balanceRecord?balance=' + this.data.userBaseInfo.balance,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  // 点击 商家订单
  shopOrderList: function () {
    wx.navigateTo({
      url: "/pages/my/shopOrder/shopOrder",
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    });
  },

  // 点击 商城订单
  intergralOrderList: function () {
    wx.navigateTo({
      url: "/pages/my/intergralOrder/intergralOrder",
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    });
  },

  // 点击 收货地址
  addressList: function() {
    wx.navigateTo({
      url: "/pages/commonPage/addressManage/addressManage",
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    });
  },

  // 点击 提现明细
  cashedList: function() {
    wx.navigateTo({
      url: "/pages/my/cashDetails/cashDetails",
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    });
  },

  // 点击我要加盟
  myJoin: function() {
    wx.navigateTo({
      url: '/pages/my/joinShop/joinShop',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },


  // 拨打电话
  contactPhone: function (e) {
    console.log(e);
    var phone = "17701359899";
    if (e.currentTarget.dataset.phone){
      phone = e.currentTarget.dataset.phone;
    }
    wx.makePhoneCall({
      phoneNumber: phone  // 仅为示例，并非真实的电话号码
    });
  },

  onLoad: function() {

  },
  /**
   * 获取用户基本信息
   */
  getUserBaseInfo: function() {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");

    network.POST({
      params: params,
      requestUrl: requestUrl.getUserBaseInfo,
      success: function(res) {
        console.log(res.data);
        console.log('获取用户的基本信息');
        if (res.data.code == 0) {
          console.log(res.data.data);
          that.setData({
            userBaseInfo: res.data.data
          })
        } else {

        }
      },
      fail: function(res) {
        util.toast("网络异常, 请稍后再试");
      }
    });
  },
  onShow: function () {
    if (wx.getStorageSync("USERINFO")) {
      this.setData({
        wxUserInfo: wx.getStorageSync("USERINFO"),
        hasUserInfo: true
      })
    }
    this.getUserBaseInfo();
  }
})