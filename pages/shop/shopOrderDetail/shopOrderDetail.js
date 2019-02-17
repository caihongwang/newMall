// pages/order/balance/balance.js
var network = require('../../../utils/network.js');
var util = require('../../../utils/util.js');
var requestUrl = require('../../../config.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cartList: [],
    shopId: 0,
    shopTitle: "",
    sumMonney: 0,
    cutMonney: 0,
    cupNumber:0,

    //日期
    isSelectDateFlag: false,
    currentDate: "",
    startDate: "",
    endDate: "",
    //时间
    isSelectTimeFlag: false,
    currentTime: "",
    startTime: "",
    endTime: "",

    //备注
    note:""
  },

  /**
   * 确认支付
   */
  surePay:function(){
    if (this.data.isSelectDateFlag && this.data.isSelectTimeFlag){
      //整合参数
      var cartList = this.data.cartList;
      var foodsId = "";           //食物ID
      var foodsNum = "{";        //食物数量
      for (var i in cartList) {
        var item = cartList[i];
        var cartListLength = cartList.length;
        if (i == (cartListLength - 1)) {
          foodsId = foodsId + item.id;
          foodsNum = foodsNum + "\"foodId_is_" + item.id + "\":{\"foodNum\":\"" + item.foodNum + "\"}}";
        } else {
          foodsId = foodsId + item.id + ",";
          foodsNum = foodsNum + "\"foodId_is_" + item.id + "\":{\"foodNum\":\"" + item.foodNum + "\"}" + ",";
        }
      }
      var foodsNum = JSON.parse(foodsNum);
      //备注
      var foodsTime = this.data.currentDate + " " + this.data.currentTime;
      var note = this.data.note;
      if (!this.data.note){
        note = "无";
      }
      var remark = "{\"foodsTime\":\"" + foodsTime + "\",\"note\":\"" + note + "\"}";
      var remark = JSON.parse(remark);

      var params = {};
      params.transactionFoodsDetail = JSON.stringify(this.data.cartList);
      params.foodsNum = JSON.stringify(foodsNum);
      params.remark = JSON.stringify(remark);
      params.foodsId = foodsId;
      params.allPayAmount = this.data.sumMonney;
      params.shopId = this.data.shopId;
      params.shopTitle = this.data.shopTitle;
      wx.setStorageSync('shopOrderParams', JSON.stringify(params)), 
      wx.navigateTo({
        url: "../payment/payment?"
              + "shopId=" + this.data.shopId + "&"
                  + "shopTitle=" + this.data.shopTitle + "&"
                      + "shopOrderParams=" + JSON.stringify(params)
      });
    } else {
      if (!this.data.isSelectDateFlag && !this.data.isSelectTimeFlag){
        util.toast("请选择确切用餐日期以及用餐时间，店家会根据此时间为您准备新鲜热乎的餐食.");
      } else if (!this.data.isSelectDateFlag) {
        util.toast("请选择确切用餐日期，店家会根据此日期为您准备新鲜热乎的餐食.");
      } else if (!this.data.isSelectTimeFlag) {
        util.toast("请选择确切用餐时间，店家会根据此时间为您准备新鲜热乎的餐食.");
      }
    }
  },

  /**
   * 日期监听
   */
  bindDateChange(e) {
    this.setData({
      isSelectDateFlag: true,
      currentDate: e.detail.value
    });
  },

  /**
   * 时间监听
   */
  bindTimeChange(e) {
    this.setData({
      isSelectTimeFlag: true,
      currentTime: e.detail.value
    });
  },

  /**
   * '备注监听
   */
  noteBindinput: function(e){
    var noteText = e.detail.value;
    this.setData({
      note: noteText
    });
  },

  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    var dateObj = new Date();
    var year = dateObj.getFullYear();
    var month = dateObj.getMonth() + 1;
    var day = dateObj.getDate();
    var hour = dateObj.getHours();
    var minute = dateObj.getMinutes();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    if (hour < 10) {
      hour = "0" + hour;
    }
    if (minute < 10) {
      minute = "0" + minute;
    }
    //获取日期
    var currentDate = year + "-" + month + "-" + day;
    var startDate = year + "-" + month + "-" + day;
    var endDate = (year + 1) + "-" + month + "-" + day;
    //获取时间
    var currentTime = hour + " : " + minute;
    var startTime = hour + " : " + minute;
    var endTime = "23 : 59";
    this.setData({
      cartList: wx.getStorageSync('cartList'), 
      shopId: wx.getStorageSync('shopId'),
      shopTitle: wx.getStorageSync('shopTitle'),
      sumMonney: wx.getStorageSync('sumMonney'),
      cutMonney: wx.getStorageSync('sumMonney') > 19 ? 3 : 0,
      cupNumber: wx.getStorageSync('cupNumber'),
      currentDate: currentDate,
      startDate: startDate,
      endDate: endDate,
      currentTime: currentTime,
      startTime: startTime,
      endTime: endTime
    });
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