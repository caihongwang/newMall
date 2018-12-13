var uitl = require('../../../../utils/util.js');
var network = require('../../../../utils/network.js')
const requestUrl = require('../../../../config.js')
var app = getApp();
Page({
  data: {
    size: 32,
    teamId:null,   //team Id
    teamUserList:[],   //团队成员列表
    teamName:'',    //团队名称
    isShowMore: false,//是的显示上拉加载更多提示，为true显示
    isNoShowMore: false,//显示加载更多
    loading: false,//加载中。。。false为隐藏
    // pageindex: 0, //加载页数
    callbackcount: 10, //每页加载个数
    top: [],
    topList: [],
    pageindexAll: 0,//总共加载的总条数
    teamMemberNum: 0,
    index: 0,
    userIntegralNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    this.setData({
      teamId: options.teamId
    });
    this.getUserList(true);
  },
 
  getUserList: function(boo,startNumber) {
    var that = this;
    var params = new Object();
    params.size = this.data.size;
    params.start = this.data.pageindexAll;
    params.teamId = this.data.teamId;
    if (boo) {
      wx.showLoading({
        mask: true
      });
    }
    network.POST({
      params: params,
      requestUrl: requestUrl.getTeamInfoUrl,
      success: function(res) {
        boo? wx.hideLoading() : wx.stopPullDownRefresh();
        if (res.data.code !=0) {
          uitl.toast(res.data.message);
          return;
        }
        that.setData({
          teamName: res.data.data.teamName,
          teamMemberNum: res.data.data.teamMemberNum
        });
        var resList = JSON.parse(res.data.data.teamMemberList);
        if (resList && resList.length !=0) {
         for (let index = 0; index < resList.length; index++) {
           var tempUser = resList[index];
           if (!tempUser.nickName || !(tempUser.nickName != undefined)){
             tempUser.nickname = '暂无昵称'
           }else if (tempUser.nickName.length<6) {
            tempUser.nickname = tempUser.nickName;
           }else {
            tempUser.nickname = tempUser.nickName.substr(0,4) + '..';  
           }
           that.data.teamUserList.push(tempUser);
         }
         that.data.pageindexAll += 32;
         that.setData({
           pageindexAll: that.data.pageindexAll,
           teamUserList: that.data.teamUserList
         });
         //TODO 去改userIntegralNum
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
        }else {
          uitl.toast('没有更多数据了');
        }
      },
      fail: function(res) {
        boo? wx.hideLoading() : wx.stopPullDownRefresh();
        uitl.toast(res.msg);
      }
    });
  },
  bindMore: function () {
    if (this.data.pageindexAll < this.data.teamMemberNum) {
      this.setData({
        loading: true,
        isShowMore: false,
        isNoShowMore: false
      })
      this.getUserList(true);
    }
  },
  onReachBottom: function () {
    this.bindMore();
  },
})