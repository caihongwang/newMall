// pages/howFind/index.js
var network = require('../../../utils/network.js');
var util = require('../../../utils/util.js');
var requestUrl = require('../../../config.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardList: [],       //名片列表
    noReceive:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadUnReceive(false);
  },
  // 加载待接收名片列表
  loadUnReceive: function (boo) {
    this.data.cardList = [];
    var that = this;
    var params = new Object();
    params.receiveUid = app.globalData.uid;
    params.status = '0';
    if (!boo) {
      wx.showLoading({
        title: '加载中',
        mask: true
      });
    }
    network.POST({
      params: params,
      requestUrl: requestUrl.getCardListUrl,
      success: function (res) {
        boo ? wx.stopPullDownRefresh() : wx.hideLoading();
        // wx.hideLoading();
        if (res.data.code != 0) {
          util.toast(res.data.message);
          return;
        }

        if (res.data.data && res.data.data.length == 0) {    //如果数据没有了返回名片夹就刷新名片夹数据
          app.globalData.isRefreshTagForCardFile = true;
          that.setData({
            noReceive:true
          });
          return;
        }else{
          app.globalData.isRefreshTagForCardFile = true;
          that.setData({
            noReceive:false
          })
        }

        for (var item in res.data.data) {
          if (res.data.data[item].cardCompany.length > 18) {
            res.data.data[item].tempCardCompany = res.data.data[item].cardCompany.slice(0, 18) + "...";
          } else {
            res.data.data[item].tempCardCompany = res.data.data[item].cardCompany;
          }
          that.data.cardList.push(res.data.data[item]);
        }
        that.setData({
          cardList: that.data.cardList
        })
      },
      fail: function (res) {
        boo ? wx.stopPullDownRefresh() : wx.hideLoading();
        util.toast("网络异常，请稍后再试");
      }
    })
  },
  //接收名片
  receiveCardAction: function (e) {
    wx.showLoading({
      mask: true
    })
    var that = this;
    var params = new Object();
    params.cardId = e.currentTarget.dataset.cardid;
    params.receiveUid = app.globalData.uid;
    params.sendUid = e.currentTarget.dataset.senduid;
    params.id = e.currentTarget.dataset.mappingid;
    if (app.globalData.getActivityData && JSON.stringify(app.globalData.getActivityData != '{}')
    ) {
      params.activityId = app.globalData.getActivityData.id;
    } else {
      app.userActivityReadyCallBack = (getActivityData) => {
        params.activityId = getActivityData;
      }
    }
    network.POST({
      params: params,
      requestUrl: requestUrl.receiveuserMappingUrl,
      success: function (res) {
        wx.hideLoading();
        if (res.data.code != 0) {
          util.toast(res.data.message);
          return;
        }
        app.globalData.isRefreshTagForCardFile = true;   //每次接收了名片，就要设置刷新为true
        util.toast('名片已接收，请在名片夹中查看！');
        that.loadUnReceive(true);
      },
      fail: function (res) {
        wx.hideLoading();
        util.toast('网络异常，请稍后再试');
      }
    })
  },

  onPullDownRefresh: function () {
    this.loadUnReceive(true);
  }
})