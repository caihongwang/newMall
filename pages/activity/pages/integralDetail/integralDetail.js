var util = require('../../../../utils/util.js');
var network = require('../../../../utils/network.js')
const requestUrl = require('../../../../config.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx, //判断是否是iPhone X
    notGoGroup: false, //无积分未参团的状态
    haveIntegral: false,//有积分未参团的状态
    integralPerson:'', //个人总积分展示
    haveIntegralList:[],

    isShowMore: false,//是的显示上拉加载更多提示，为true显示
    isNoShowMore: false,//显示加载更多
    loading: false,//加载中。。。false为隐藏
    // pageindex: 0, //加载页数
    callbackcount: 9, //每页加载个数
    top: [],
    topList: [],
    pageindexAll: 0,//总共加载的总条数
    contactsIntegralTopTotal: 0,
    index: 0,
    userIntegralNum:0
  },
  // 获取我的人脉影响力积分
  getUserDetailIntegral: function (boo) { //获取我的人脉影响力积分
    var that = this;
    var params = new Object();
    params.activityId = app.globalData.getActivityData.id;
    params.establishUid = app.globalData.uid;
    params.size = 9;
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
        requestUrl: requestUrl.getUserDetailIntegralUrl,
        success: function (res) {
          console.log(res.data);
          boo ? wx.stopPullDownRefresh() : wx.hideLoading();

          if (res.data.code == 0) {
            if (!res.data.data.userIntegralTotal || res.data.data.userIntegralTotal == 0){
              that.setData({
                notGoGroup:true
              })
              return;
            }else{
              var userDetailIntegralList = JSON.parse(res.data.data.userDetailIntegralList);
              for (var i in userDetailIntegralList) {
                that.data.haveIntegralList.push(userDetailIntegralList[i]);
              }
              that.data.pageindexAll += userDetailIntegralList.length;
              that.setData({
                userIntegralNum: res.data.data.userIntegralNum,
                haveIntegral: true,
                haveIntegralList: that.data.haveIntegralList,
                integralPerson: res.data.data.userIntegralTotal,
                pageindexAll: that.data.pageindexAll 
              })
            }
            if (that.data.pageindexAll < res.data.data.userIntegralNum) {
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
          } else if (res.data.code == 90005) {  //90005代表活动未开始 加一个code码判断活动未开始 给integralPerson赋值为0 
            that.setData({
              integralPerson: 0,
              notGoGroup:true
            })
          } else if (res.data.code == 90009) {  //没有参加活动
            that.setData({
              integralPerson: 0,
              notGoGroup:true,

            })
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
    if (this.data.pageindexAll < this.data.userIntegralNum) {
      // this.data.pageindex += 1;
      // this.setData({
      //   pageindex: this.data.pageindex
      // })
      this.setData({
        loading: true,
        isShowMore: false,
        isNoShowMore: false
      })
      this.getUserDetailIntegral(true);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserDetailIntegral(false);
  },
 

 onReachBottom: function() {
   this.bindMore();
 }
})