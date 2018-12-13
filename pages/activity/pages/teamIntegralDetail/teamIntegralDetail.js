// pages/activity/pages/teamIntegralDetail/teamIntegralDetail.js
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
    isShowMore: true,//是的显示上拉加载更多提示，为true显示
    isNoShowMore: false,//显示加载更多
    loading: false,//加载中。。。false为隐藏

    pageindex: 0, //加载条数
    callbackcount: 15, //每页加载个数
    top: [],
    topList: [],
    haveBackcount: 0, //已经加载的个数
    teamId: '',

    teamLeaderName: '',//团长名称
    teamIntegral: 0,//团队总积分
    teamMemberNum: 0,//团队人数
    teamName: '',//团队名称
    userIntegralTop: 0,//用户积分排名
    userIntegralTotal: 0,//用户总积分数
    userIntegralTopList: [],//所有数据列表  
    scoreIndex: 1,    //积分排名
    pageindexAll: 0,//总共加载的总条数
    userIntegralTopTotal: 0,
    index:0
  },
  getTeamDetailIntegral: function (boo) { //获取我的人脉影响力积分
    var that = this;
    var params = new Object();
    params.teamId = that.data.teamId;
    if (this.data.pageindexAll == 0){
      params.size = 7;
    }else{
      params.size = 15;
    }
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
        requestUrl: requestUrl.getIntegralTopInTeamUrl,
        success: function (res) {
          console.log(res.data);
          boo ? wx.stopPullDownRefresh() : wx.hideLoading();

          if (res.data.code == 0) {
            that.setData({
              teamIntegral: res.data.data.teamIntegral ? res.data.data.teamIntegral :'',
              teamLeaderName: res.data.data.teamLeaderName ? res.data.data.teamLeaderName:'',
              teamMemberNum: res.data.data.teamMemberNum ? res.data.data.teamMemberNum :'',
              teamName: res.data.data.teamName ? res.data.data.teamName :'',
              userIntegralTop: res.data.data.userIntegralTop ? res.data.data.userIntegralTop:'',
              userIntegralTotal: res.data.data.userIntegralTotal ? res.data.data.userIntegralTotal:''
            })
            var userList = JSON.parse(res.data.data.userIntegralTopList);
            for (let i = 0; i < userList.length; i++) {   //添加index
              that.data.index += 1;
              that.setData({
                index: that.data.index
              })
              userList[i].index = that.data.index;
              that.data.userIntegralTopList.push(userList[i]);
            }
            that.setData({
              userIntegralTopList: that.data.userIntegralTopList
            })
            if (that.data.pageindexAll == 0){
              that.data.pageindexAll += 7;
            }else{
              that.data.pageindexAll += 15;
            }
            that.setData({
              pageindexAll: that.data.pageindexAll,
              userIntegralTopTotal: res.data.data.userIntegralTopTotal
            })
            if (that.data.pageindexAll < res.data.data.userIntegralTopTotal) {
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
          } else {
            util.toast(res.data.message);
          }
        },
        fail: function (res) {
          boo ? wx.stopPullDownRefresh() : wx.hideLoading();
          util.toast(res.msg);
        }
      });
  },
  bindMore: function () {
    console.log(3333);
    if (this.data.pageindexAll < this.data.userIntegralTopTotal) {
      this.setData({
        loading: true,
        isShowMore: false,
        isNoShowMore: false
      })
      this.getTeamDetailIntegral();
    }
  },
  onReachBottom: function () {
    this.bindMore();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      teamId: options.teamId
    });
    this.getTeamDetailIntegral(false);
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
    // this.getTeamDetailIntegral(false);
  },
})