var util = require('../../../utils/util.js');
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderTitelList: [{
        titel: '全部订单',
        id: 0
      },
      {
        titel: '待付款',
        id: 1
      },
      {
        titel: '已完成',
        id: 2
      },
    ],
    chosseId: 0,

    pageindexAll: 10, //总共加载的总条数

    showOrderList: [], //用来展示的订单
    allFoodsOrderList: [], //所有订单
    waitPayGoodsOrderList: [], //待付款
    alreadyPayFoodsOrderList: [], //已付款

  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 点击切换列表
  chooseList: function(e) {
    var that = this;
    let index = e.currentTarget.dataset.index;
    if (index != this.data.chosseId) {
      this.setData({
        chosseId: index,
        pageindexAll: 10, //总共加载的总条数
      });
      if (index == 0) {
        if (that.data.allFoodsOrderList.length > 0) {
          that.setData({
            showOrderList: that.data.allFoodsOrderList
          });
        } else {
          this.getAllFoodsOrder(false);
        }
      } else if (index == 1) {
        if (that.data.waitPayGoodsOrderList.length > 0) {
          that.setData({
            showOrderList: that.data.waitPayGoodsOrderList
          });
        } else {
          this.getWaitPayFoods(false);
        }
      } else if (index == 2) {
        console.log("that.data.alreadyPayFoodsOrderList.length = " + that.data.alreadyPayFoodsOrderList.length);
        if (that.data.alreadyPayFoodsOrderList.length > 0) {
          that.setData({
            showOrderList: that.data.alreadyPayFoodsOrderList
          });
        } else {
          this.getAlreadyPayFoods(false);
        }
      }
    }
  },
  //全部订单
  getAllFoodsOrder: function(boo) {
    console.log("boo  ---->>>  " + boo);
    var that = this;
    that.data.showOrderList = []; //  清空展示的列表数据
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.start = this.data.allFoodsOrderList.length;
    params.size = this.data.pageindexAll;
    if (!boo) {
      wx.showLoading({
        title: '客官请稍后...',
        mask: true
      });
    }
    network.POST({
      params: params,
      requestUrl: requestUrl.getAllFoodsOrderUrl,
      success: function(res) {
        boo ? wx.stopPullDownRefresh() : wx.hideLoading();
        if (res.data.code == 0) {
          for (var i in res.data.data) {
            if (res.data.data[i].transactionFoodsDetail) {
              var transactionFoodsDetail = JSON.parse(res.data.data[i].transactionFoodsDetail);
              res.data.data[i].transactionFoodsDetail = transactionFoodsDetail;
              res.data.data[i].foodPrice = transactionFoodsDetail.foodPrice;
              var allNumber = 0;
              for (var j in transactionFoodsDetail) {
                allNumber = allNumber + transactionFoodsDetail[j].foodNum;
              }
              res.data.data[i].allNumber = allNumber;
            }
            that.data.allFoodsOrderList.push(res.data.data[i]);
          }
          if (that.data.allFoodsOrderList.length < res.data.recordsFiltered) {
            that.setData({
              isShowMore: true,
              loading: false,
              isNoShowMore: false
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
        that.setData({
          showOrderList: that.data.allFoodsOrderList,
          allFoodsOrderList: that.data.allFoodsOrderList
        });
      },
      fail: function(res) {
        boo ? wx.stopPullDownRefresh() : wx.hideLoading();
        util.toast("网络异常, 请稍后再试");
      }
    });
  },
  //待付款
  getWaitPayFoods: function(boo) {
    var that = this;
    that.data.showOrderList = []; //  清空展示的列表数据
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.start = this.data.waitPayGoodsOrderList.length;
    params.size = this.data.pageindexAll;
    if (!boo) {
      wx.showLoading({
        title: '客官请稍后...',
        mask: true
      });
    }
    network.POST({
      params: params,
      requestUrl: requestUrl.getWaitPayFoodsUrl,
      success: function(res) {
        boo ? wx.stopPullDownRefresh() : wx.hideLoading();
        console.log(res.data.data);
        if (res.data.code == 0) {
          for (var i in res.data.data) {
            if (res.data.data[i].transactionFoodsDetail) {
              var transactionFoodsDetail = JSON.parse(res.data.data[i].transactionFoodsDetail);
              res.data.data[i].transactionFoodsDetail = transactionFoodsDetail;
              res.data.data[i].foodPrice = transactionFoodsDetail.foodPrice;
              var allNumber = 0;
              for (var j in transactionFoodsDetail) {
                allNumber = allNumber + transactionFoodsDetail[j].foodNum;
              }
              res.data.data[i].allNumber = allNumber;
            }
            that.data.waitPayGoodsOrderList.push(res.data.data[i]);
          }
          if (that.data.waitPayGoodsOrderList.length < res.data.recordsFiltered) {
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
        that.setData({
          showOrderList: that.data.waitPayGoodsOrderList,
          waitPayGoodsOrderList: that.data.waitPayGoodsOrderList
        });
      },
      fail: function(res) {
        boo ? wx.stopPullDownRefresh() : wx.hideLoading();
        util.toast("网络异常, 请稍后再试");
      }
    });
  },
  //已完成
  getAlreadyPayFoods: function(boo) {
    var that = this;
    that.data.showOrderList = []; //  清空展示的列表数据
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.start = this.data.alreadyPayFoodsOrderList.length;
    params.size = this.data.pageindexAll;
    if (!boo) {
      wx.showLoading({
        title: '客官请稍后...',
        mask: true
      });
    }
    network.POST({
      params: params,
      requestUrl: requestUrl.getAlreadyPayFoodsUrl,
      success: function(res) {
        boo ? wx.stopPullDownRefresh() : wx.hideLoading();
        console.log(res.data.data);
        if (res.data.code == 0) {
          for (var i in res.data.data) {
            if (res.data.data[i].transactionFoodsDetail) {
              var transactionFoodsDetail = JSON.parse(res.data.data[i].transactionFoodsDetail);
              res.data.data[i].transactionFoodsDetail = transactionFoodsDetail;
              res.data.data[i].foodPrice = transactionFoodsDetail.foodPrice;
              var allNumber = 0;
              for (var j in transactionFoodsDetail) {
                allNumber = allNumber + transactionFoodsDetail[j].foodNum;
              }
              res.data.data[i].allNumber = allNumber;
            }
            that.data.alreadyPayFoodsOrderList.push(res.data.data[i]);
          }
          if (that.data.allFoodsOrderList.length < res.data.recordsFiltered) {
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
          console.log(that.data.alreadyPayFoodsOrderList);
        } else {
          util.toast(res.data.message);
        }
        that.setData({
          showOrderList: that.data.alreadyPayFoodsOrderList,
          alreadyPayFoodsOrderList: that.data.alreadyPayFoodsOrderList
        });
      },
      fail: function(res) {
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
      url: "../shopOrderDetail/shopOrderDetail?orderId=" + orderId
    });
  },
  onLoad: function(options) {
    if (options.chosseId) {
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.data.chosseId == 0) {
      this.getAllFoodsOrder(false);
    } else if (this.data.chosseId == 1) {
      this.getWaitPayFoods(false);
    } else if (this.data.chosseId == 2) {
      this.getAlreadyPayFoods(false);
    }
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
    if (!this.data.isNoShowMore) {
      if (this.data.chosseId == 0) {
        this.getAllFoodsOrder(false);
      } else if (this.data.chosseId == 1) {
        this.getWaitPayFoods(false);
      } else if (this.data.chosseId == 2) {
        this.getAlreadyPayFoods(false);
      }
    } else {
      util.toast("没有更多订单了...");
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})