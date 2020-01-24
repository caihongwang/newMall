// pages/shop/shopInformation/shopInformation.js
var network = require('../../../utils/network.js');
var util = require('../../../utils/util.js');
var requestUrl = require('../../../config.js');
const app = getApp();

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
    isShowMenuBtn: false,
    forceNum: 1
  },

  // 直接付款
  payment: function () {
    let that = this;
    wx.navigateTo({ //  跳转到创建团队的页面
      // 跳转到一个选择列表的页
      url: '/pages/shop/payment/payment?shopId=' + that.data.shopId + '&shopTitle=' + that.data.shopTitle
    });
  },
  
  // 预定点餐
  menuFood: function () {
    let that = this;
    wx.navigateTo({ //  跳转到创建团队的页面
      // 跳转到一个选择列表的页
      url: '/pages/shop/shopMenu/shopMenu?shopId=' + that.data.shopId + '&shopTitle=' + that.data.shopTitle
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
    var phone = "13636574416";
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
          //是否显示点餐按钮
          var isShowMenuBtn = false;
          var shopMenuTotal = res.data.data[0].shopMenuTotal;
          if ((shopMenuTotal-0) > 0) {
            isShowMenuBtn = true;
          }
          //店铺描述图片进行json对象化
          res.data.data.shopDescribeImgUrl = JSON.parse(res.data.data[0].shopDescribeImgUrl);
          that.setData({
            isShowMenuBtn: isShowMenuBtn,
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
        //获取商家详情
        that.getShopCondition();
      },
      fail(res) {
        console.log("获取用户位置信息失败....");
        that.showUserLocationForceToast("scope.userLocation", that.data.forceNum);
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
    } else if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      console.log("scene");
      console.log(scene);
      //先对&进行拆分
      var sceneArr = scene.split("&");
      for (var i in sceneArr) {
        var paramArr = sceneArr[i].split("=");
        var paramKey = paramArr[0];
        var paramValue = paramArr[1];
        console.log(paramKey + "---------->>>" + paramValue);
        if (paramKey == "shopId") {
          shopId = paramValue;
        }
      }
    } else {
      shopId = 1;
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
  //获取微信的位置权限失败，弹出强制强制授权弹框
  showUserLocationForceToast: function (authorize) {
    var that = this;
    console.log("第 forceNum = " + that.data.forceNum + " 次强制获取位置权限.");
    if (that.data.forceNum >= 3) {
      that.setData({
        latitude: 28.09072,
        longitude: 108.98077
      });
      app.globalData.latitude = 28.09072;
      app.globalData.longitude = 108.98077;
      console.log("that.data.latitude ----->>>> " + that.data.latitude);
      //获取商家详情
      that.getShopCondition();
      return;
    }
    wx.showModal({
      title: '温馨提示',
      content: '惠生活需要获取您的微信权限，点击确认前往设置或者退出程序？',
      showCancel: false,
      success: function () {
        wx.openSetting({
          success: function (res) {
            if (res.authSetting[authorize]) { //用户打开了用户信息授权
              wx.getLocation({ //原则上这边应该是直接走到fail的。但是为了防止刚开始没有昵称和头像权限，所有这里做了请求判断
                type: 'wgs84',
                success: function (res) {
                  that.setData({
                    latitude: res.latitude,
                    longitude: res.longitude
                  });
                  app.globalData.latitude = res.latitude;
                  app.globalData.longitude = res.longitude;
                  //获取商家详情
                  that.getShopCondition();
                }
              });
            } else { //用户没有打开用户信息授权
              that.data.forceNum = that.data.forceNum + 1;
              console.log("forceNum ----->>>" + that.data.forceNum);
              that.showUserLocationForceToast(authorize);
            }
          }
        });
      }
    });
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