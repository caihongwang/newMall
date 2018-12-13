// pages/activity/pages/ranking/ranking.js
var network = require('../../../../utils/network.js');
var util = require('../../../../utils/util.js');
var requestUrl = require('../../../../config.js');
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx, //判断是否是iPhone X
    isShowMore:false,//是的显示上拉加载更多提示，为true显示
    isNoShowMore: false,//显示加载更多
    loading: false,//加载中。。。false为隐藏
    // pageindex:0, //加载页数
    callbackcount:15, //每页加载个数
    top: [],
    topList: [],
    haveBackcount:0, //已经加载的个数
    pageindexAll:0,//总共加载的总条数
    contactsIntegralTopTotal:0,
    index:0
  },

  getTeamTop: function (boo) { // 获取人脉排行榜积分排名
    var that = this;
    var params = new Object();
    params.activityId = app.globalData.getActivityData.id;
    params.size = 15;
    params.start = that.data.pageindexAll;
    if (!boo) {
        wx.showLoading({
          title: '加载中',
          mask: true
        });
      }
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.getContactsIntegralTopUrl,
        success: function (res) {
          boo ? '' : wx.hideLoading();

          if (res.data.code == 0) {
            var contactsIntegralTopTotal = JSON.parse(res.data.data.contactsIntegralTopTotal);
            if (res.data.data.contactsIntegralTopList){
              var contactsIntegralTopList = JSON.parse(res.data.data.contactsIntegralTopList);
              for (var i in contactsIntegralTopList) {
                console.log(Number(i));
                // var n = Number(i) + 1;
                that.data.index += 1;
                console.log(that.data.index);
                that.setData({
                  index: that.data.index
                })
                console.log(contactsIntegralTopList[i]);
                contactsIntegralTopList[i].index = that.data.index;
              }
            }
            if (contactsIntegralTopTotal == 0 || !contactsIntegralTopList ) {
              that.setData({
                isShowMore: false,
                loading: false,
                isNoShowMore: true,
              })
              return;
            } 

            for (var i in contactsIntegralTopList) {
              contactsIntegralTopList[i].topAvatarAll = [];
              if (contactsIntegralTopList[i].topAvatar && contactsIntegralTopList[i].topAvatar.length != 4){
                contactsIntegralTopList[i].topAvatarAll = JSON.parse(contactsIntegralTopList[i].topAvatar);
                contactsIntegralTopList[i].topAvatarLength = contactsIntegralTopList[i].topAvatarAll.length;
              }
              that.data.topList.push(contactsIntegralTopList[i]);
            }
            that.data.haveBackcount += contactsIntegralTopList.length;
            that.data.pageindexAll += 15;

            that.setData({
              topList: that.data.topList,
              haveBackcount: that.data.haveBackcount,
              contactsIntegralTopTotal: contactsIntegralTopTotal,
              pageindexAll: that.data.pageindexAll
            });
           
            if (that.data.haveBackcount < contactsIntegralTopTotal) {
              that.setData({
                isShowMore: true,
                loading:false,
                isNoShowMore:false,
              })
            }else{
              that.setData({
                isShowMore: false,
                loading: false,
                isNoShowMore: true,
              })
            }
          } else {
            util.toast(res.data.message);
          }
        },
        fail: function (res) {
          boo ? '' : wx.hideLoading();
          util.toast("网络异常, 请稍后再试");
        }
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    this.getTeamTop(false);
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
  bindMore:function(){
    console.log(123123);
    if (this.data.pageindexAll < this.data.contactsIntegralTopTotal) {
      // this.data.pageindex += 1;
      // this.setData({
      //   pageindex: this.data.pageindex
      // })
      this.setData({
        loading: true,
        isShowMore: false,
        isNoShowMore: false
      })
      this.getTeamTop(true);
    }
  },

  onReachBottom: function () {
    this.bindMore();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})