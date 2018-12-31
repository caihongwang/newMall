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
    let that = this;
    wx.navigateTo({  //  跳转到创建团队的页面
      // 跳转到一个选择列表的页
     
      url: '/pages/cardFile/payment/payment?shopId=' +that.data.shopId

    });

  },
  // 调用打开腾讯地图
  goMap: function(){
    let that = this;
    console.log(typeof that.data.shopInformation.shopLat);
    console.log(typeof parseFloat(that.data.shopInformation.shopLat));
    console.log(123123);
    wx.openLocation({
      latitude: parseFloat(that.data.shopInformation.shopLat),
      longitude: parseFloat(that.data.shopInformation.shopLon),
      name: that.data.shopInformation.shopTitle,
     address: that.data.shopInformation.shopAddress,
    })


        // wx.openLocation({     
        //   latitude:  parseFloat(that.data.shopInformation.shopLat),
        //   longitude: parseFloat(that.data.shopInformation.shopLon) ,
        //   name: that.data.shopInformation.shopAddress,
        //   address: that.data.shopInformation.shopAddress,
        //   scale: 18,
        //   success:function(res){
        //     console.log(res);
        //   },
        //   fail:function(res){
        //     console.log(res);

        //   }
        // })
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
          if (res.data.code == 0) {
           
            res.data.data.shopDescribeImgUrl = JSON.parse(res.data.data[0].shopDescribeImgUrl);
            that.setData({
              shopInformation: res.data.data[0],
              shopDescribeImgUrl: res.data.data.shopDescribeImgUrl
            })
            console.log(that.data.shopInformation);
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