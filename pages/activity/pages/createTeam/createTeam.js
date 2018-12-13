var uitl = require('../../../../utils/util.js');
var network = require('../../../../utils/network.js')
var netool = require('../../../../utils/netool.js')
const requestUrl = require('../../../../config.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // isAuthorization: true,//是否已经授权的遮罩
    isIpx: app.globalData.isIpx, //判断是否是iPhone X
    title: '创建团队',   //弹框的title
    isRemind: false,   //是否是温馨提示，默认是创建团队
    ifInTeam: false,   //是否在团队里面，名称不太合适，这里主要用来看用户是否创建团队，如果没有为false，如果有则为true
    score: 0,    //人脉分
    teamId: null,   //teamid
    teamInfo: null,   //team信息
    teamMemberList: [],   //团队成员列表
    teamIndex: [0, 1, 2, 3, 4],   //team index
    ifInByShare: false,   //是否是通过点击分享进入的页面
    activityId: '',    //分享页面传入的活动id
    joinButtonEnable: true,    //加入按钮是否可以点击
    showSingUp: false, //加入团队的弹窗
    isJoninOtherTeam: false,   //是否加入其它团队
    isJoinActivity: true,   //是否加入活动,分享页面操作
    ifShowJoinActiviy: false    //是否展示参加活动入口

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    netool.updateAgainUserInfo();
    console.log("wwww");
    wx.hideShareMenu();    //首页隐藏转发按钮
    if (options.teamId && options.teamId.length != 0) {
      console.log("已经创建team");
      this.setData({
        ifInTeam: true,
        teamId: options.teamId
      });
      return;
    }

    //分享进来的页面处理逻辑
    if (options.activityInfo) {
      
      var activityInfo = JSON.parse(options.activityInfo);
     
      console.log(5555);
      this.setData({
        teamId: activityInfo.teamId,
        ifInTeam: true,
        ifInByShare: true,
        activityId: activityInfo.activityId
      });
      console.log(this.data.ifInByShare);
      console.log("邀请页面进入的团队页面");
    } else {
      console.log("不是从分享进来的数据");
    }
  },
  onShow: function () {
    var that = this;
    this.toast = this.selectComponent("#toast");
    if (app.globalData.uid) {
      console.log(111);
      console.log(JSON.stringify(app.globalData.getActivityData));
      if (JSON.stringify(app.globalData.getActivityData) == "{}") {
        console.log(2222);
        app.userActivityReadyCallBack = (getActivityData) => {
          console.log(3333);
          if (getActivityData == 1) {
            console.log(6666666);
            uitl.toast("活动已经结束，请关注第二季");
            app.globalData.getActivityData = {};

            setTimeout(() => {
              wx.switchTab({
                url: '/pages/tabBar/index/index'
              });
            }, 2000);
            return;
          } else {
            console.log(444);
            this.checkIfInTeam();
            this.refreshCurrentView(true);
            return;
          }
        }
       
      }
      this.checkIfInTeam();
      this.refreshCurrentView(true);
    } else {
      app.userInfoReadyCallBack = (uid, session) => {
        app.userActivityReadyCallBack = (getActivityData) => {
          this.checkIfInTeam();
          this.refreshCurrentView(true);
        }
      }
    }   
  },
  //检测活动是否正在进行
  checkActivityDoing: function() {
    var params = new Object();
    wx.showLoading({
      mask: true
    });
    params.activityId = this.data.activityId;
    network.POST({
      params: params,
      requestUrl: requestUrl.checkActivityDoingUrl,
      success: function(res) {
        wx.hideLoading();
        if(res.data.code == 90008) {   //活动已失效
          uitl.toast("活动已经结束，请关注第二季"); 
          app.globalData.getActivityData = {};
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/tabBar/index/index'
            });
          }, 2000);
        }
      },
      fail: function(res) {
        wx.hideLoading();
        uitl.toast(res.msg);
      }
    });
  },
  //
  seeMoreAction: function () {
    wx.navigateTo({
      url: '../teamUser/teamUser?teamId=' + this.data.teamId
    });
    console.log('查看更多用户');
  },
  // 检测是否加入团队
  checkIfInTeam: function () {
    if (!this.data.teamId) {
      return;
    }
    var that = this;
    var params = new Object();
    params.activityId = app.globalData.getActivityData.id;
    params.joinUid = wx.getStorageSync('UIDKEY');
    params.teamId = this.data.teamId;
    network.POST({
      params: params,
      requestUrl: requestUrl.checkJoinTeamUrl,
      success: function (res) {
        if (res.data.code == 0) {  //没有参加团队
          console.log("没有加入团队");
          that.setData({
            joinButtonEnable: true
          });
          return;
        }
        if (res.data.code == 80013) {  //已经参加当前团队
          console.log("已经加入当前团队");
          that.setData({
            joinButtonEnable: false
          });
          return;
        }
        if (res.data.code == 80012) {  //已经参加其他团队
          console.log("已经加入团队，但是不是本团队");
          that.setData({
            isJoninOtherTeam: true
          });

          // uitl.toast(res.data.message);
        } else if (res.data.code == 90009) {   //尚未参加活动
          that.setData({
            isJoinActivity: false
          });
        } else {
          console.log("错误信息");
          console.log(res);
          console.log(res.data.message);
        }


      },
      fail: function (res) {
        uitl.toast(res.msg);
      }
    });
  },
  goGroupRuleDetail: function () {
    wx.navigateTo({
      url: '../grouprules/grouprules'
    });

  },
  goTeamRuleDetailAction: function () {
    var that = this;
    wx.navigateTo({
      // 跳转到一个选择列表的页
      url: '/pages/activity/pages/teamIntegralDetail/teamIntegralDetail?teamId=' + that.data.teamId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.createDialog = this.selectComponent("#createDailog");
  },
  _confirmShowEvent: function (e) {
    if (!e.detail.isRemind) {   //创建团队的action
      if (!e.detail.teamName) {
        // uitl.toast("请输入团队名称");
        this.toast.showToast('请输团队名称');
        return;
      }

      // console.log(温馨提示);
      //温馨提示的action
      this.setData({
        title: "温馨提示",
        isRemind: true
      });
      return;
    }
    //温馨提示确认    开始发送网络请求去创建团队
    console.log("去创建团队");
    var that = this;
    var params = new Object();
    params.activityId = app.globalData.getActivityData.id;
    params.establishUid = wx.getStorageSync("UIDKEY");
    params.teamName = e.detail.teamName;

    wx.showLoading({
      mask: true
    });
    network.POST({
      params: params,
      requestUrl: requestUrl.createTeamUrl,
      success: function (res) {
        wx.hideLoading();
        if (res.data.code != 0) {
          // that.toast.showToast(res.data.message);
          that.createDialog.hideView();
          uitl.toast(res.data.message);
          return;
        }
        that.toast.showToast("创建成功");
        that.createDialog.hideView();
        that.setData({
          teamId: res.data.data.id,
          ifInTeam: true
        });
        that.refreshCurrentView(true);
      },
      fail: function (res) {
        wx.hideLoading();
        that.toast.showToast(res.msg);
      }
    });
  },
  //创建成功后更新当前组队页面
  refreshCurrentView: function (boo) {
    this.checkActivityDoing();
    if (!this.data.teamId) {
      console.log("没有teamid");
      return;
    }
    var that = this;
    if (boo) {
      wx.showLoading({
        mask: true
      });
    }
    var params = new Object();
    params.teamId = this.data.teamId;
    network.POST({
      params: params,
      requestUrl: requestUrl.getTeamInfoUrl,
      success: function (res) {
        boo ? wx.hideLoading() : wx.stopPullDownRefresh();
        console.log(res);
        that.setData({
          teamInfo: res.data.data,
          teamMemberList: JSON.parse(res.data.data.teamMemberList)
        });

        console.log(that.data.teamMemberList);
      },
      fail: function (res) {
        boo ? wx.hideLoading() : wx.stopPullDownRefresh();
        uitl.toast(res.msg);
      }
    });

  },
  //点击参加报名弹窗取消
  cancelJoinActivityUp: function () {
    this.setData({
      ifShowJoinActiviy: false
    });
  },
  //点击确认加入活动
  sureJoinActivityUp: function () {
    var that = this;
    var params = new Object();
    params.activityId = this.data.activityId;
    params.joinUid = wx.getStorageSync("UIDKEY");
    wx.showLoading({
      mask: true
    });
    network.POST({
      params: params,
      requestUrl: requestUrl.joinActivityUrl,
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 0) {   //报名成功,报名成功之后隐藏报名页面,展示确认加入团队页面
          that.setData({
            ifShowJoinActiviy: false,
            showSingUp: true,
            isJoinActivity: true
          });
        } else if (res.data.code == 90003) {   //已经报名
          that.setData({
            ifShowJoinActiviy: false,
            showSingUp: true,
            isJoinActivity: true
          });
        }
        else {
          uitl.toast(res.data.message);
        }
      },
      fail: function (res) {
        wx.hideLoading();
        uitl.toast(res.msg);
      }
    });

  },
  getUserInfo: function(res) {
    if (res.detail.userInfo) {
      netool.updateUserInfo(res.detail);
      //判断是否加入了其他团队
    if (this.data.isJoninOtherTeam) {
      uitl.toast("您已加入其它团队");
      return;
    }

    if (!this.data.isJoinActivity) {   //未加入活动
      this.setData({
        ifShowJoinActiviy: true
      });
      return;
    }
    //展示报名弹窗
    this.setData({
      showSingUp: true
    });
    }else {
      uitl.toast("我们在活动中需要使用您的昵称头像，请允许后再试");
    }
    
  },
  //加入团队操作
  // joinUsAction: function () {
  //   // //判断是否加入了其他团队
  //   // if (this.data.isJoninOtherTeam) {
  //   //   uitl.toast("您已加入其它团队");
  //   //   return;
  //   // }

  //   // if (!this.data.isJoinActivity) {   //未加入活动
  //   //   this.setData({
  //   //     ifShowJoinActiviy: true
  //   //   });
  //   //   return;
  //   // }
  //   // //展示报名弹窗
  //   // this.setData({
  //   //   showSingUp: true
  //   // });
  // },
  //我要拿iPhone8按钮点击
  goActivityPageAction: function (res) {
    if (res.detail.userInfo) {
      console.log(11);
      app.globalData.isJoinTeamInActivityPage = true;
      wx.switchTab({
        url: '/pages/tabBar/index/index',
      })
      netool.updateUserInfo(res.detail);
    }else {
      uitl.toast("我们在活动中需要使用您的昵称头像，请允许后再试");
    }
  },
  _cancelShowEvent: function () {
    this.createDialog.hideView();
    this.setData({
      title: "创建团队",
      isRemind: false
    });
  },
  createTeamAction: function () {
    this.createDialog.showView();
  },

  // 点击取消加入团队的弹窗
  cancelSingUp: function () { //点击取消报名活动的弹窗
    this.setData({
      showSingUp: false
    })
  },
  sureSingUp: function () {
    var that = this;
    var params = new Object();
    params.activityId = this.data.activityId;
    params.joinUid = wx.getStorageSync("UIDKEY");
    params.teamId = this.data.teamId;
    wx.showLoading({
      mask: true
    });
    network.POST({
      params: params,
      requestUrl: requestUrl.joinTeamUrl,
      success: function (res) {
        wx.hideLoading();
        if (res.data.code != 0) {
          console.log(res.data.message);
          that.setData({
            showSingUp: false
          });
          uitl.toast(res.data.message);
          return;
        }
        //加入团队成功
        console.log("加入团队成功");
        that.setData({
          joinButtonEnable: false,
          showSingUp: false
        });
        uitl.toast('加入成功');
        that.refreshCurrentView(true);
      },
      fail: function (res) {
        wx.hideLoading();
        uitl.toast(res.msg);
      }
    });
    console.log('加入team');

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(res) {
    var that = this;
    let activityInfo = {};
    activityInfo.activityId = app.globalData.getActivityData.id;   //activity Id

    activityInfo.teamId = that.data.teamId;
    activityInfo.userId = wx.getStorageSync('UIDKEY');
    var activityStr = JSON.stringify(activityInfo);
    console.log(activityStr);
    var userInfo = wx.getStorageSync('USERINFO');
    var title = userInfo.nickName + '邀请你加入【'+ that.data.teamInfo.teamName +'】团队，点击参加免费拿iphone8活动！';
    var shareObj = {
      title: title,
      path: '/pages/activity/pages/createTeam/createTeam?activityInfo=' + activityStr,
      imageUrl: '/images/shareimage.png',
      success: function (res) {
      },
      fail: function (res) {
      }
    };
    if (res.from == 'button') {
      shareObj.path = '/pages/activity/pages/createTeam/createTeam?activityInfo=' + activityStr
    }

    return shareObj;

  },
  onPullDownRefresh: function () {
    this.refreshCurrentView(false);
  }
})