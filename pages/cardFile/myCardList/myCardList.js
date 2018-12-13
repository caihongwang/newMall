var network = require('../../../utils/network.js');
var util = require('../../../utils/util.js');
var requestUrl = require('../../../config.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    myCardCount: 0,    //我自己有的card的个数
    cardList: [],     //名片列表数组
    ifHaveCard: false,     //是否有card
    clickIndex: 0,
    receiveUid: null,    //接收人uid
    mId: null     //mappingid
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCardList();
    this.setData({
      receiveUid: options.receiveUid,
      mId: options.mappingId
    })
  },
  clickChosse: function (e) {    //选择某个
    this.data.clickIndex = e.currentTarget.dataset.index;
    for (var i in this.data.cardList) {
      if (i == this.data.clickIndex) {
        this.data.cardList[i].swiper = true;
      } else {
        this.data.cardList[i].swiper = false;
      }
    }
    this.setData({
      cardList: this.data.cardList
    })
  },
  // 得到我的名片列表
  getCardList: function () {
    var that = this;
    wx.showLoading({
      title: "加载中",
      mask: true
    })
    var params = new Object();
    params.uid = app.globalData.uid;
    network.POST({
      params: params,
      requestUrl: requestUrl.getSimpleCardByConditionUrl,
      success: function (res) {
        wx.hideLoading();
        if (res.data.code != 0) {
          util.toast(res.data.message);
          return;
        }
        if (res.data.data && res.data.data.length == 0) {
          that.setData({
            ifHaveCard: false
          })
          return;
        }
        for (var item in res.data.data) {
          if (item == 0) {
            res.data.data[item].swiper = true;
          } else {
            res.data.data[item].swiper = false;
          }
          res.data.data[item].index = item;
          that.data.cardList.push(res.data.data[item]);
        }

        that.setData({
          ifHaveCard: true,
          myCardCount: res.data.data.length,
          cardList: that.data.cardList
        })
      },
      fail: function () {
        wx.hideLoading();
        util.toast('网络异常，请稍后再试');

      }
    });

  },
  submitAction: function () {   //回递名片
    wx.showLoading({
      mask: true
    })
    var that = this;
    var params = new Object();
    var cardInfo = that.data.cardList[that.data.clickIndex];
    params.cardId = cardInfo.id;
    params.id = that.data.mId;    //这里应该填写映射表id  
    params.receiveUid = that.data.receiveUid;
    params.sendUid = cardInfo.uid;
    network.POST({
      params: params,
      requestUrl: requestUrl.returnCardUserMappingUrl,
      success: function (res) {
        wx.hideLoading();
        if (res.data.code != 0) {
          if (res.data.code == 50005) {
            util.toast(res.data.message);
            app.globalData.isRefreshTagForCardFile = true;
            wx.navigateBack();
            return;
          }
          util.toast(res.data.message);
          return;
        }
        app.globalData.isRefreshTagForCardFile = true;
        wx.showToast({
          title: '回递成功',
          icon: 'none',
          duration: 2000,
          mask: true,
          complete: function () {
            wx.switchTab({
              url: '/pages/tabBar/cardFile/cardFile'
            })
          }
        })


      },
      fail: function (res) {
        wx.hideLoading();
        util.toast("网络异常，请稍后再试");
      }
    })
  }
})