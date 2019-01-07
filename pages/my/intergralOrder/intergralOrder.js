// pages/my/intergralOrder/intergralOrder.js

var util = require('../../../utils/util.js');
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        name: '所有订单',
        id: 0
      },
      {
        name: '待付款',
        id: 1
      },
      {
        name: '配送中',
        id: 2
      },
      {
        name: '已完成',
        id: 2
      },
    ],
    chosseId: 0,

    havePageAll: 0, //已经加载的页数
    pageindexAll: 10,//总共加载的总条数
    howShops: 0,//共多少条数据

    waitPay:[],//待支付数据列表
    alreadyPay:[],//已支付
    alreadyDeliver:[],//已发货

  },

  /**
   * 生命周期函数--监听页面加载
   */
// 点击切换列表
  chooseList: function (e) {
    let index = e.currentTarget.dataset.index;
    if (index != this.data.chosseId ){
      this.setData({
        chosseId: index,
        havePageAll: 0, //已经加载的页数
        pageindexAll: 10,//总共加载的总条数
      })
      if(index == 1){
        this.getWaitPayGoods(false);
      }else if(index == 2){
        this.getAlreadyPayGoods(false);
      }else if(index == 3){
        this.getAlreadyDeliverGoodsUrl(false);
      }
    }
 

  },
  //待支付
  getWaitPayGoods: function (boo) {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.start = this.data.havePageAll;
    params.size = this.data.pageindexAll;
    if (!boo) {
      wx.showLoading({
        title: '加载中',
        mask: true
      });
    }
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.getWaitPayGoodsUrl,
        success: function (res) {
          boo ? wx.stopPullDownRefresh() : wx.hideLoading();
          console.log(res.data.data);
          if (res.data.code == 0) {
            for (var i in res.data.data) {
              that.data.waitPay.push(res.data.data[i]);
            }
            that.setData({
              waitPay: that.data.waitPay,
              howShops: res.data.recordsFiltered
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
            console.log(that.data.waitPay);
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
  //已支付
  getAlreadyPayGoods: function (boo) {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.start = this.data.havePageAll;
    params.size = this.data.pageindexAll;
    if (!boo) {
      wx.showLoading({
        title: '加载中',
        mask: true
      });
    }
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.getAlreadyPayGoodsUrl,
        success: function (res) {
          boo ? wx.stopPullDownRefresh() : wx.hideLoading();
          console.log(res.data.data);
          if (res.data.code == 0) {
            for (var i in res.data.data) {
              that.data.alreadyPay.push(res.data.data[i]);
            }
            that.setData({
              alreadyPay: that.data.alreadyPay,
              howShops: res.data.recordsFiltered
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
            console.log(that.data.alreadyPay);
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

  //已发货
  getAlreadyDeliverGoodsUrl: function (boo) {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.start = this.data.havePageAll;
    params.size = this.data.pageindexAll;
    if (!boo) {
      wx.showLoading({
        title: '加载中',
        mask: true
      });
    }
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.getAlreadyDeliverGoodsUrl,
        success: function (res) {
          boo ? wx.stopPullDownRefresh() : wx.hideLoading();
          console.log(res.data.data);
          if (res.data.code == 0) {
            for (var i in res.data.data) {
              that.data.alreadyDeliver.push(res.data.data[i]);
            }
            that.setData({
              alreadyDeliver: that.data.alreadyDeliver,
              howShops: res.data.recordsFiltered
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
            console.log(that.data.alreadyPay);
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


  onLoad: function (options) {
    this.setData({
      chosseId: options.index
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
    if (this.data.chosseId == 1) {
      this.getWaitPayGoods(false);
    } else if (this.data.chosseId == 2) {
      this.getAlreadyPayGoods(false);
    } else if (this.data.chosseId == 3) {
      this.getAlreadyDeliverGoodsUrl(false);
    }
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
    if (this.data.chosseId == 1) {
      this.getWaitPayGoods(false);
    } else if (this.data.chosseId == 2) {
      this.getAlreadyPayGoods(false);
    } else if (this.data.chosseId== 3) {
      this.getAlreadyDeliverGoodsUrl(false);
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})