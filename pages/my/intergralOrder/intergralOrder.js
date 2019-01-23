var util = require('../../../utils/util.js');
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    orderTitelList: [
      {
        titel: '所有订单',
        id: 0
      },
      {
        titel: '待付款',
        id: 1
      },
      {
        titel: '待收货',
        id: 2
      },
      {
        titel: '已完成',
        id: 2
      },
    ],
    chosseId: 0,

    havePageAll: 0, //已经加载的页数
    pageindexAll: 10,//总共加载的总条数
    howShops: 0,//共多少条数据

    showOrderList: [],//用来展示的订单
    allPayGoodsOrderList: [],//所有订单
    waitPayGoodsOrderList: [],//待付款
    alreadyDeliverGoodsOrderList:[],//待收货
    completedGoodsOrderList:[],//已完成

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
      });
      if (index == 0) {
        this.getAllPayGoodsOrder(false);
      } else if(index == 1){
        this.getWaitPayGoods(false);
      }else if(index == 2){
        this.getAlreadyDeliverGoods(false);
      }else if(index == 3){
        this.getCompletedGoods(false);
      }
    }
  },
  //所有订单
  getAllPayGoodsOrder: function (boo) {
    var that = this;
    that.data.showOrderList = [];     //  清空展示的列表数据
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.start = this.data.havePageAll;
    params.size = this.data.pageindexAll;
    if (!boo) {
      wx.showLoading({
        title: '客官请稍后...',
        mask: true
      });
    }
    network.POST({
        params: params,
        requestUrl: requestUrl.getAllPayGoodsOrderUrl,
        success: function (res) {
          boo ? wx.stopPullDownRefresh() : wx.hideLoading();
          if (res.data.code == 0) {
            for (var i in res.data.data) {
              that.data.allPayGoodsOrderList.push(res.data.data[i]);
            }
            that.setData({
              showOrderList: that.data.allPayGoodsOrderList,
              allPayGoodsOrderList: that.data.allPayGoodsOrderList,
              howShops: res.data.recordsFiltered
            });
            that.data.havePageAll += res.data.data.length;
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
            console.log(that.data.allPayGoodsOrderList);
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
  //待支付
  getWaitPayGoods: function (boo) {
    var that = this;
    that.data.showOrderList = [];     //  清空展示的列表数据
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.start = this.data.havePageAll;
    params.size = this.data.pageindexAll;
    if (!boo) {
      wx.showLoading({
        title: '客官请稍后...',
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
              that.data.waitPayGoodsOrderList.push(res.data.data[i]);
            }
            that.setData({
              showOrderList: that.data.waitPayGoodsOrderList,
              waitPayGoodsOrderList: that.data.waitPayGoodsOrderList,
              howShops: res.data.recordsFiltered
            });
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
            console.log(that.data.waitPayGoodsOrderList);
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
  getAlreadyDeliverGoods: function (boo) {
    var that = this;
    that.data.showOrderList = [];     //  清空展示的列表数据
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.start = this.data.havePageAll;
    params.size = this.data.pageindexAll;
    if (!boo) {
      wx.showLoading({
        title: '客官请稍后...',
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
              that.data.alreadyDeliverGoodsOrderList.push(res.data.data[i]);
            }
            that.setData({
              showOrderList: that.data.alreadyDeliverGoodsOrderList,
              alreadyDeliverGoodsOrderList: that.data.alreadyDeliverGoodsOrderList,
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
            console.log(that.data.alreadyDeliverGoodsOrderList);
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
  //已完成
  getCompletedGoods: function (boo) {
    var that = this;
    that.data.showOrderList = [];     //  清空展示的列表数据
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.start = this.data.havePageAll;
    params.size = this.data.pageindexAll;
    if (!boo) {
      wx.showLoading({
        title: '客官请稍后...',
        mask: true
      });
    }
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.getCompletedGoodsUrl,
        success: function (res) {
          boo ? wx.stopPullDownRefresh() : wx.hideLoading();
          console.log(res.data.data);
          if (res.data.code == 0) {
            for (var i in res.data.data) {
              that.data.completedGoodsOrderList.push(res.data.data[i]);
            }
            that.setData({
              showOrderList: that.data.completedGoodsOrderList,
              completedGoodsOrderList: that.data.completedGoodsOrderList,
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
            console.log(that.data.completedGoodsOrderList);
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
  //查看详情
  checkDetail: function(option) {
    console.log(option);
    var orderId = option.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: "../intergralOrderDetail/intergralOrderDetail?orderId=" +  orderId
    });
  },
  onLoad: function (options) {
    if (options.chosseId){
      this.setData({
        chosseId: options.chosseId
      });
    } else {
      this.setData({
        chosseId: 0
      });
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
    if (this.data.chosseId == 0) {
      this.getAllPayGoodsOrder(false);
    } else if (this.data.chosseId == 1) {
      this.getWaitPayGoods(false);
    } else if (this.data.chosseId == 2) {
      this.getAlreadyDeliverGoods(false);
    } else if (this.data.chosseId == 3) {
      this.getCompletedGoods(false);
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
    if (this.data.chosseId == 0) {
      this.getAllPayGoodsOrder(false);
    } else if (this.data.chosseId == 1) {
      this.getWaitPayGoods(false);
    } else if (this.data.chosseId == 2) {
      this.getAlreadyDeliverGoods(false);
    } else if (this.data.chosseId== 3) {
      this.getCompletedGoods(false);
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})