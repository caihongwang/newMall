// pages/my/orderQueue/orderQueue.js
var util = require('../../../utils/util.js');
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {


    havePageAll: 0, //已经加载的页数
    pageindexAll: 10,//总共加载的总条数
    howShops: 0,//共多少条列表数据
    listLuck:[],//全部对列
    myList:[], //我的对列
    shopMap:{},

  },
// 点击我的对列里的列表
  goOrder:function(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    console.log(e.currentTarget.dataset.index);
    wx.showModal({
      title: '提示',
      content: '您确定把该订单换成积分吗？',
      success(res) {
        if (res.confirm) {
          that.convertIntegral(that.data.myList[index].wxOrderId, that.data.myList[index].wxAAppId);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },


  convertIntegral: function (wxOrderId,wxAAppId) {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.wxOrderId = wxOrderId;
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.convertIntegralUrl,
        success: function (res) {
          if (res.data.code == 0) {
            that.setData({
              havePageAll: 0,
              pageindexAll: 10
            })
            if(that.data.index == 0){
              that.getAllLuckDraw(false);
            }else if(that.data.index == 1){
              that.getWaitLuckDraw(false)
            }else{
              that.getRecevicedLuckDraw(false)
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



  getAllLuckDraw: function (boo) {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.start = this.data.havePageAll;
    params.size = this.data.pageindexAll;
    params.shopId = this.data.shopId;
    if (!boo) {
      wx.showLoading({
        title: '加载中',
        mask: true
      });
    }
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.getAllLuckDrawRankUrl,
        success: function (res) {
          boo ? wx.stopPullDownRefresh() : wx.hideLoading();
          if (res.data.code == 0) {
            res.data.data.all_allGetLuckDrawRankList = JSON.parse(res.data.data.all_allGetLuckDrawRankList);
            res.data.data.my_allGetLuckDrawRankList = JSON.parse(res.data.data.my_allGetLuckDrawRankList);
            res.data.data.shopMap = JSON.parse(res.data.data.shopMap);
            for (var i in res.data.data.all_allGetLuckDrawRankList) {
              that.data.listLuck.push(res.data.data.all_allGetLuckDrawRankList[i]);
            }
            that.setData({
              listLuck: that.data.listLuck,
              howShops: res.data.recordsFiltered,
              myList: res.data.data.my_allGetLuckDrawRankList,
              shopMap: res.data.data.shopMap
            })
            
            that.data.havePageAll += res.data.data.length;
            if (that.data.havePageAll < res.data.recordsFiltered) {
              that.setData({
                isShowMore: true,
                loading: false,
                isNoShowMore: false,
              })
            } else {
              that.setData({
                isShowMore: false,
                loading: false,
                isNoShowMore: true,
              })
            }
            console.log(that.data.listLuck);
          } else {
            util.toast(res.data.message);
          }

        },
        fail: function (res) {
          boo ? wx.stopPullDownRefresh() : wx.hideLoading();
          util.toast("网络异常, 请稍后再试");
        }
      });
  },
  getWaitLuckDraw: function (boo) {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.start = this.data.havePageAll;
    params.size = this.data.pageindexAll;
    params.shopId = this.data.shopId;
    if (!boo) {
      wx.showLoading({
        title: '加载中',
        mask: true
      });
    }
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.getWaitLuckDrawRankUrl,
        success: function (res) {
          boo ? wx.stopPullDownRefresh() : wx.hideLoading();
          if (res.data.code == 0) {
            
            res.data.data.all_waitGetLuckDrawRankList = JSON.parse(res.data.data.all_waitGetLuckDrawRankList);
            res.data.data.my_waitGetLuckDrawRankList = JSON.parse(res.data.data.my_waitGetLuckDrawRankList);
            res.data.data.shopMap = JSON.parse(res.data.data.shopMap);
            for (var i in res.data.data.all_waitGetLuckDrawRankList) {
              that.data.listLuck.push(res.data.data.all_waitGetLuckDrawRankList[i]);
            }
            that.setData({
              listLuck: that.data.listLuck,
              howShops: res.data.recordsFiltered,
              myList: res.data.data.my_waitGetLuckDrawRankList,
              shopMap: res.data.data.shopMap
            })

            that.data.havePageAll += res.data.data.length;
            if (that.data.havePageAll < res.data.recordsFiltered) {
              that.setData({
                isShowMore: true,
                loading: false,
                isNoShowMore: false,
              })
            } else {
              that.setData({
                isShowMore: false,
                loading: false,
                isNoShowMore: true,
              })
            }
            console.log(that.data.listLuck);
          } else {
            util.toast(res.data.message);
          }

        },
        fail: function (res) {
          boo ? wx.stopPullDownRefresh() : wx.hideLoading();
          util.toast("网络异常, 请稍后再试");
        }
      });
  },
  getRecevicedLuckDraw: function (boo) {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.start = this.data.havePageAll;
    params.size = this.data.pageindexAll;
    params.shopId = this.data.shopId;
    if (!boo) {
      wx.showLoading({
        title: '加载中',
        mask: true
      });
    }
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.getRecevicedLuckDrawRankUrl,
        success: function (res) {
          boo ? wx.stopPullDownRefresh() : wx.hideLoading();
          if (res.data.code == 0) {

            res.data.data.all_recevicedGetLuckDrawRankList = JSON.parse(res.data.data.all_recevicedGetLuckDrawRankList);
            res.data.data.my_recevicedGetLuckDrawRankList = JSON.parse(res.data.data.my_recevicedGetLuckDrawRankList);
            res.data.data.shopMap = JSON.parse(res.data.data.shopMap);
            for (var i in res.data.data.all_recevicedGetLuckDrawRankList) {
              that.data.listLuck.push(res.data.data.all_recevicedGetLuckDrawRankList[i]);
            }
            that.setData({
              listLuck: that.data.listLuck,
              howShops: res.data.recordsFiltered,
              myList: res.data.data.my_recevicedGetLuckDrawRankList,
              shopMap: res.data.data.shopMap
            })

            that.data.havePageAll += res.data.data.length;
            if (that.data.havePageAll < res.data.recordsFiltered) {
              that.setData({
                isShowMore: true,
                loading: false,
                isNoShowMore: false,
              })
            } else {
              that.setData({
                isShowMore: false,
                loading: false,
                isNoShowMore: true,
              })
            }
            console.log(that.data.listLuck);
          } else {
            util.toast(res.data.message);
          }

        },
        fail: function (res) {
          boo ? wx.stopPullDownRefresh() : wx.hideLoading();
          util.toast("网络异常, 请稍后再试");
        }
      });
  },

  bindMore: function () {
    console.log(123123);
    if (this.data.pageindexAll < this.data.howShops) {
      this.setData({
        loading: true,
        isShowMore: false,
        isNoShowMore: false
      })
      if (that.data.index == 0) {
        that.getAllLuckDraw(false);
      } else if (that.data.index == 1) {
        that.getWaitLuckDraw(false)
      } else {
        that.getRecevicedLuckDraw(false)
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      shopId: options.shopId,
      index: options.index
    })
    if (options.index == 0){
      this.getAllLuckDraw(false);
    } else if (options.index == 1){
      this.getWaitLuckDraw(false);
    }else{
      this.getRecevicedLuckDraw(false)
    }

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
    this.bindMore();

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})