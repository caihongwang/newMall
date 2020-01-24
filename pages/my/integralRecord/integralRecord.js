// pages/my/integralRecord/integralRecord.js
var util = require('../../../utils/util.js');
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      isShowMore: false, //是的显示上拉加载更多提示，为true显示
      isNoShowMore: true, //显示加载更多
      loading: false, //加载中。。。false为隐藏      底部的分页加载

      havePageAll: 0, //已经加载的页数
      pageindexAll: 10, //总共加载的总条数

      integral:0.0,
      integralList: []
  },
  
/**
 * 获取积分记录列表
 */
  getSimpleIntegralLogByCondition: function () {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.start = that.data.havePageAll;
    params.size = that.data.pageindexAll;
    network.POST({
      params: params,
      requestUrl: requestUrl.getSimpleIntegralLogByConditionUrl,
      success: function (res) {
        if (res.data.code == 0) {
          for (var i in res.data.data) {
            that.data.integralList.push(res.data.data[i]);
          }
          that.setData({
            integralList: that.data.integralList
          });
          that.data.havePageAll += res.data.data.length;
          console.log("that.data.havePageAll = " + that.data.havePageAll);
          if (that.data.havePageAll < res.data.recordsFiltered) {
            that.setData({
              isShowMore: true,
              loading: false,
              isNoShowMore: false,
            });
          } else {
            that.setData({
              isShowMore: false,
              loading: false,
              isNoShowMore: true,
            });
          }
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
    var integral = options.integral;
    this.setData({
      integral: integral
    });
    console.log("integral = " + integral);
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
    this.getSimpleIntegralLogByCondition();
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
    wx.showLoading({
      title: "客官请稍后...",
      mask: true
    });
    this.getSimpleIntegralLogByCondition();
    wx.hideLoading(); //关闭进度条
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})