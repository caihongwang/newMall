// pages/my/myOrder/myOrder.js
var util = require('../../../utils/util.js');
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
     list:[
       {
         name:'全部订单',
         id:0
       },
       {
         name: '等待奖励订单',
         id: 1
       },
       {
         name: '已奖励订单',
         id: 2
       },
     ],
    chosseId: 0,
    listLuck:[],//需要展示的数组列表

    havePageAll: 0, //已经加载的页数
    pageindexAll: 10,//总共加载的总条数
    howShops: 0,//共多少家店铺

  },
  chooseList:function(e){
    let index = e.currentTarget.dataset.index;
    if (this.data.chosseId != index){
        this.setData({
          chosseId: index,
          listLuck:[]
        })
        if (this.data.chosseId == 1) {
          this.getWaitLuckDrawList(false);
        } else if (this.data.chosseId == 2) {
          this.getRecevicedLuckDrawList(false);
        } else {

        }
    }
    
  

  },
// 点击某一项跳转
  goOrder:function(){
    wx.navigateTo({
      url: '/pages/my/orderQueue/orderQueue',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  

  },

  getWaitLuckDrawList: function (boo) {
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
        requestUrl: requestUrl.getWaitLuckDrawUrl,
        success: function (res) {
          boo ? wx.stopPullDownRefresh() : wx.hideLoading();
          console.log(res.data.data);
          if (res.data.code == 0) {
            for (var i in res.data.data) {
              that.data.listLuck.push(res.data.data[i]);
            }
            that.setData({
              listLuck: res.data.data,
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

  getRecevicedLuckDrawList: function (boo) {
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
        requestUrl: requestUrl.getRecevicedLuckDrawUrl,
        success: function (res) {
          boo ? wx.stopPullDownRefresh() : wx.hideLoading();
          console.log(res.data.data);
          if (res.data.code == 0) {
            for (var i in res.data.data) {
              that.data.listLuck.push(res.data.data[i]);
            }
            that.setData({
              listLuck: res.data.data,
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
      this.getWaitLuckDrawList(true);
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id);
    this.setData({
      chosseId:options.id
    })
    if (this.data.chosseId == 1){
      this.getWaitLuckDrawList(false);
    } else if (this.data.chosseId == 2){
      this.getRecevicedLuckDrawList(false);
    }else{

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