var network = require('../../utils/network.js');
var util = require('../../utils/util.js');
var requestUrl = require('../../config.js');
var netool = require('../../utils/netool.js');

var app = getApp()
Page({
  data: {
    isIpx: app.globalData.isIpx, //判断是否是iPhone X
    currentTab: 0, //当前tab所在的位置
    isHaveSingUp: true, //是否已经报名参加的按钮展示 为true已经报名
    isSignUpSuccess: false, //报名成功的弹窗，为true的时候弹出
    isHaveCreatTeam: false,//是否已经创建团队，false没有创建显示创建团队按钮
    canNotFreeGet: false,//不能够免费领取名片的弹窗
    isStartActivity: true,//判断活动是否开始，true为活动已经开始
    isEndActivity: false,//判断活动是isAgainShowSingisAgainShowSing否结束，true为活动已经结束
    isEndSingUp: true,//活动已结束，报名参加不可点击
    showSingUp: false,//提示报名参加的弹窗，为false不弹出
    integralRule: [], //积分获取方式列表
    startTime: '',//活动开始事假
    endTime: '',//活动结束时间
    prize: [],//奖品展示列表
    isShowFreeGet: true,//免费领取的状态，为true可点击
    isHaveCreatTeamButton: true,//创建团队按钮是否可点击 为true可点击
    distanceStart: false, //距离结束和距离开始的时间的展示与隐藏 为true距离开始显示为false距离结束显示
    isSignActivity: true,//点击报名后活动是否开始的弹窗，为true，报名成功活动已开始
    teamId: null,//加入团队的teamId
    teamName: '',//团队明细

    isHaveTop: false, // 是否有人脉排行榜前三名   初始值应该为false
    isNotTop: false, //没有排行的展示 初始值应该为false  
    isHaveUp: false, //没有5000分且没到前三名一下排行的展示  //初始应该为false

    clickSeeMore: false, //点击查看更多的按钮
    integralPerson: 0,//我的人脉影响力积分
    integralBaiRong: 0,//百融创和团队人脉分
    setTime: '',//倒计时的定时器
    day: 0,  //倒计时时间
    hour: 0,
    min: 0,
    ms: 0,
    top: [
    ],
    topList: [],

    startM: 0,//活动开始的月份
    startD: 0,//活动开始的天
    endM: 0,//活动结束的月份
    endD: 0,//活动结束的天
    activityId: ''
  },
  clickTab: function (e) {   //点击tab切换
    var that = this;
    if (e.currentTarget.dataset.index == 'first') {
      that.setData({
        currentTab: 0
      })
    } else if (e.currentTarget.dataset.index == 'second') {
      that.setData({
        currentTab: 1
      })
      if (this.data.isStartActivity == true) {
        this.getTeamTop(); //获取人脉排行榜积分排名
      }
    } else if (e.currentTarget.dataset.index == 'three') {
      that.setData({
        currentTab: 2
      })
      if (this.data.isStartActivity == true) {
        this.getUserDetailIntegral();//获取我的人脉影响力积分        //TODO 添加一个调用团队积分的接口~记得判断活动是否开始的状态，未开始置未0
      }
    }
  },
  getTeamTop: function () { // 获取人脉排行榜积分排名
    var that = this;
    var params = new Object();
    params.activityId = that.data.activityId;
    params.size = 10;
    params.start = 0;
    wx.showLoading({
      mask: true
    });
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.getContactsIntegralTopUrl,
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == 0) {
            var top1 = [];
            var topList1 = [];
            if (!res.data.data.contactsIntegralTopTotal || res.data.data.contactsIntegralTopTotal == 0) {
              that.setData({
                isNotTop: true,
                isHaveUp: true
              })
            } else {
              var contactsIntegralTopList = JSON.parse(res.data.data.contactsIntegralTopList);
             console.log(222222);
              console.log(contactsIntegralTopList);
              for (var i in contactsIntegralTopList) {
                var n = Number(i) + 1;
                contactsIntegralTopList[i].index = n;
                contactsIntegralTopList[i].topAvatarAll = [];
                if (contactsIntegralTopList[i].topAvatar && contactsIntegralTopList[i].topAvatar.length != 4 ) {
                  contactsIntegralTopList[i].topAvatarAll = JSON.parse(contactsIntegralTopList[i].topAvatar);
                  console.log(contactsIntegralTopList[i].topAvatarAll.length);

                  contactsIntegralTopList[i].topAvatarLength = contactsIntegralTopList[i].topAvatarAll.length;
                }
                if (i < 3) {
                  if (contactsIntegralTopList[i].topIntegral >= 5000) {
                    top1.push(contactsIntegralTopList[i]);
                  } else {
                    topList1.push(contactsIntegralTopList[i]);
                  }
                } else {
                  topList1.push(contactsIntegralTopList[i]);
                }
              }
            }
            that.setData({
              top: top1,
              topList: topList1
            });
            if (that.data.top.length == 0 && that.data.topList.length == 0) {
              that.setData({
                isNotTop: true,
                isHaveUp: true,
                clickSeeMore: false
              })
            } else if (that.data.top.length == 0) {
              that.setData({
                isNotTop: true,
                isHaveUp: false,
                // clickSeeMore: true,
              })
            } else {
              that.setData({
                isHaveTop: false,
                isNotTop: false,
                isHaveUp: false,
                // clickSeeMore: true,
              })
            }
            if (res.data.data.contactsIntegralTopTotal > 10) {
              that.setData({
                clickSeeMore: true,
              })
            } else {
              that.setData({
                clickSeeMore: false,
              })
            }
          } else if (res.data.code == 90007) { //活动已结束
          } else {
            
            util.toast(res.data.message);
          }
        },
        fail: function (res) {
         wx.hideLoading();
          util.toast("网络异常, 请稍后再试");
        }
      });
  },
  seeMoreRanking: function () {  //点击查看更多排行
    wx.navigateTo({
      // 跳转到一个选择列表的页
      url: '/pages/activity/pages/ranking/ranking'
    })
  },
  getUserDetailIntegral: function () { //获取我的人脉影响力积分
    var that = this;
    var params = new Object();
    params.activityId = that.data.activityId;
    params.establishUid = app.globalData.uid;
    params.isGetAll = true;
    wx.showLoading({
      mask: true
    });
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.getUserDetailIntegralUrl,
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == 0) {
            if (res.data.data.userIntegralTotal) {
              that.setData({
                integralPerson: res.data.data.userIntegralTotal,
              });
            }
            if (res.data.data.teamIntegralTotal) {
              that.setData({
                integralBaiRong: res.data.data.teamIntegralTotal,
              });
            }
            if (res.data.data.teamId) {
              that.setData({
                teamId: res.data.data.teamId,
                teamName: res.data.data.teamName
              });
            }
            if (res.data.data.isJoinTeamFlag == 'true') { //已经入团
              that.setData({
                isHaveCreatTeam: true
              })
            } else {
              that.setData({
                isHaveCreatTeam: false
              })
            }
          } else if (res.data.code == 90005) {  //90005代表活动未开始 加一个code码判断活动未开始 给integralPerson赋值为0 
            that.setData({
              integralPerson: 0
            })
          } else if (res.data.code == 90009) {
          } else {
            util.toast(res.data.message);
          }
        },
        fail: function (res) {
          wx.hideLoading();
          util.toast("网络异常, 请稍后再试");
        }
      });
  },

  checkJoinTeam: function () { // 检测当前用户是否是已经加入一个团队
    var that = this;
    var params = new Object();
    params.activityId = app.globalData.getActivityData.id;
    params.joinUid = app.globalData.uid;
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.checkJoinTeamUrl,
        success: function (res) {
          if (res.data.code == 0) {  //未参团  0是未参加团队,80012是已参加团队
            that.setData({
              isHaveCreatTeam: false,
            })
          } else if (res.data.code == 80012) {  //已参团
            that.setData({
              isHaveCreatTeam: true,
            })
          } else {
            util.toast(res.data.message);

          }
        },
        fail: function (res) {
          util.toast("网络异常, 请稍后再试");
        }
      });
  },
  sureSingUp: function () {
    var that = this;
    var params = new Object();
    params.activityId = app.globalData.getActivityData.id;
    params.joinUid = app.globalData.uid;
    wx.showLoading({
      mask: true
    });
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.joinActivityUrl,
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == 0) {  //未报名
            that.setData({
              showSingUp: false
            });
            util.toast("你已报名成功！即将进入创建团队页面");
            setTimeout(function () {
              wx.navigateTo({  //  跳转到创建团队的页面
                // 跳转到一个选择列表的页
                url: '/pages/activity/pages/createTeam/createTeam? teamId=' + that.data.teamId
              });
            }, 2000);
          } else {
            that.setData({
              showSingUp: false
            })
            util.toast(res.data.message);
          }
        },
        fail: function (res) {
          wx.hideLoading();
          util.toast(res.msg);
        }
      });
  },
  singUp: function (boo) {  //点击报名参加按钮
    var that = this;
    if (this.data.isHaveSingUp == true && this.data.isEndSingUp) {
      return;
    } else {
      var params = new Object();
      params.activityId = app.globalData.getActivityData.id;
      params.joinUid = app.globalData.uid;
      wx.showLoading({
        mask: true
      });
      network.POST(
        {
          params: params,
          requestUrl: requestUrl.joinActivityUrl,
          success: function (res) {
            wx.hideLoading();
            if (res.data.code == 0) {  //报名成功
              wx.setStorageSync('isAgainShowSing', true);
              that.setData({
                isHaveSingUp: true,
                isSignUpSuccess: true,
                isOverhidden: true,
                showSingUp: false
              })
              if (that.data.isStartActivity) { //活动已经开始
                that.setData({
                  isSignActivity: true
                })
              } else {  //活动未开始
                that.setData({
                  isSignActivity: false
                })
              }
            } else if (res.data.code == 60001) {  //已经报名
              that.setData({
                isHaveSingUp: true
              })
            } else {
              util.toast(res.data.message);
            }
          },
          fail: function (res) {
            wx.hideLoading();
            util.toast(res.msg);
          }
        });
    }
  },

  sendCall: function () {  //点击召集好友
    var that = this;
    if (that.data.isEndActivity) {
      return;
    }
    wx.navigateTo({  //  TODO  是否需要跳转传参  跳转到创建团队的页面
      // 跳转到一个选择列表的页
      url: '/pages/activity/pages/createTeam/createTeam?teamId=' + that.data.teamId
    });
  },

  cancelSingUp: function () { //点击取消报名活动的弹窗
    this.setData({
      showSingUp: false
    })
  },
  creatTeam: function () {  //点击创建团队按钮
    var that = this;
    if (this.data.isEndActivity) {
      return;
    }
    if (this.data.isHaveCreatTeamButton) {
      if (!this.data.isHaveSingUp) { //未报名活动给一个弹窗提示
        this.setData({
          showSingUp: true
        })
      } else {  //已经报名活动
        wx.navigateTo({  //  跳转到创建团队的页面
          // 跳转到一个选择列表的页
          url: '/pages/activity/pages/createTeam/createTeam? teamId=' + that.data.teamId
        });
      }
    }
  },
  // 调用是否已经报名参加的接口
  isSingUp: function (joinUid, activityId, boo) {
    var that = this;
    var params = new Object();
    params.activityId = that.data.activityId;
    params.joinUid = joinUid;
    var dateStart = util.timestampToTime(activityId.startTime);
    var dateEnd = util.timestampToTime(activityId.endTime);
    var start = dateStart.split('&');
    var end = dateEnd.split('&');
    that.setData({
      startM: start[0],
      startD: start[1],
      endM: end[0],
      endD: end[1]
    })

    if (!boo) {
      wx.showLoading({
        title: '加载中',
        mask: true
      });
    }
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.checkJoinActivityUrl,
        success: function (res) {
          boo ? wx.stopPullDownRefresh() : wx.hideLoading();
          that.getTeamTop(); //获取人脉排行榜积分排名
          that.getUserDetailIntegral();
          if (res.data.code == 0) {  //未报名
            if (that.data.isEndActivity) {  //活动已结束
              that.setData({
                isHaveSingUp: false,
                isHaveCreatTeamButton: false,
                isEndSingUp: true
              })
            } else {
              //TODO判断是否添加
              that.setData({
                isHaveSingUp: false,
                isEndSingUp: false
              })
            }
          } else if (res.data.code == 90003) {  //已经报名
            that.setData({
              isHaveSingUp: true
            })
          } else {
            that.setData({
              isHaveSingUp: false,
              isEndSingUp: false
            })
            util.toast(res.data.message);
          }
        },
        fail: function (res) {
          boo ? wx.stopPullDownRefresh() : wx.hideLoading();
          util.toast("网络异常, 请稍后再试");
        }
      });

  },
  // 关闭报名成功的弹窗
  closeSignUp: function () {
    this.setData({
      isSignUpSuccess: false,
      isOverhidden: false,
    })
  },
  goTeamIntegral: function () {
    var that = this;
    var teamId = that.data.teamId;
    wx.navigateTo({
      // 跳转到一个选择列表的页
      url: '/pages/activity/pages/teamIntegralDetail/teamIntegralDetail?teamId=' + that.data.teamId
    })
  },
  countTime: function (uid, getActivityData) {
    var that = this;
    that.setData({
      endTime: getActivityData.endTime,
      startTime: getActivityData.startTime,
    })
    //TODO 解决手机获取不到时间戳的问题
    var date = new Date();
    var now = date.getTime();
    if ((that.data.startTime - now) > 0) { //代表活动未开始
      that.setData({
        isNotTop: true,
        clickSeeMore: false,
        isHaveCreatTeam: false,
        isStartActivity: false,
        isHaveCreatTeamButton: false,
        distanceStart: true,
      })
      var leftTime = that.data.startTime - now;
    } else if (that.data.endTime <= now) {  //活动已经结束
      this.setData({
        day: 0,
        hour: 0,
        min: 0,
        ms: 0,
        isEndActivity: true,
        isHaveCreatTeamButton: false,
        distanceStart: false,
        isStartActivity: true
      });
      var leftTime = -1;
      return;
    } else {  //活动进行中...
      that.setData({
        isStartActivity: true,
        distanceStart: false,

      });
      var leftTime = that.data.endTime - now;
    }
    //时间差  
    //定义变量 d,h,m,s保存倒计时的时间  
    var d, h, m, s;
    if (leftTime && leftTime >= 0) {
      d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
      h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
      m = Math.floor(leftTime / 1000 / 60 % 60);
      s = Math.floor(leftTime / 1000 % 60);
      if (d < 10) {
        d = "0" + d;
      }
      if (h < 10) {
        h = "0" + h;
      }
      if (m < 10) {
        m = "0" + m;
      }
      if (s < 10) {
        s = "0" + s;
      }
      this.setData({
        day: d,
        hour: h,
        min: m,
        ms: s
      })
    }
    // var setTime =  setTimeout(that.countTime(str1), 1000);
    clearInterval(that.data.setTime);
    that.setData({
      setTime: setInterval(function () {
        that.countTime(uid, getActivityData);
      }, 1000)
    })
  },
  cancelFree: function () { //点击取消提示创建名片的弹窗
    this.setData({
      canNotFreeGet: false,
      isOverhidden: false,
    })
  },
  goCreatCard: function () { //点击去创建名片，跳转到首页
    this.setData({
      isOverhidden: true,
    })
    wx.switchTab({
      url: '/pages/tabBar/index/index'
    })
  },
  freeGet: function () { //点击免费领取的时候判断是否已经创建了名片
    if (!this.data.isShowFreeGet || this.data.isEndActivity) {
      return;
    }
    if (!this.data.isStartActivity) {
      util.toast('活动开始后才可领取');
      return;
    }
    if (!this.data.isHaveSingUp) {
      util.toast('你还没用报名，请在报名后领取');
      return;
    }
    var that = this;
    var paramsPrint = new Object();
    paramsPrint.uid = app.globalData.uid;
    paramsPrint.activityId = app.globalData.getActivityData.id;
    network.POST(
      {
        params: paramsPrint,
        requestUrl: requestUrl.checkPrintCardUrl,
        success: function (res) {

          if (res.data.code == 0) {
            let params1 = new Object();
            params1.uid = app.globalData.uid;
            network.POST(
              {
                params: params1,
                requestUrl: requestUrl.getSimpleCardByConditionUrl,
                success: function (res) {
                  if (res.data.code == 0) {
                    if (res.data.data.length != 0) {
                      wx.navigateTo({
                        // 跳转到一个选择列表的页
                        url: '/pages/activity/pages/applyPrintCard/applyPrintCard'
                      })
                    } else {
                      // 显示区创建名片弹窗
                      that.setData({
                        canNotFreeGet: true,
                        isOverhidden: true,
                      })
                    }
                  } else {
                    util.toast(res.data.message);
                  }
                },
                fail: function (res) {
                  util.toast("网络异常, 请稍后再试");
                }
              })
          } else if (res.data.code == 110002) {  //100张为已领完 
            that.setData({
              isShowFreeGet: false
            })
            util.toast(res.data.message);

          } else {
            util.toast(res.data.message);
          }
        },
        fail: function (res) {
          util.toast("网络异常, 请稍后再试");
        }
      })
  },
  getMoreDicByCondition: function (uid, boo) {
    var that = this;
    var params = new Object();
    params.dicTypes = 'prize,integralRule';
    params.uid = uid;
    if (!boo) {
      wx.showLoading({
        title: '加载中',
        mask: true
      });
    }
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.getMoreDicByConditionUrl,//奖品展示列表和积分获取方式列表
        success: function (res) {
          if (res.data.code == 0) {
            var integralRule = JSON.parse(res.data.data.integralRule);
            var prize = JSON.parse(res.data.data.prize);
            prize[3].getSunShinePrizeFlag = JSON.parse(prize[3].getSunShinePrizeFlag)
            that.setData({
              integralRule: integralRule,
              prize: prize
            })
            if (that.data.isStartActivity == false) {
              that.setData({
                isShowFreeGet: false,
              })
            }
            boo ? wx.stopPullDownRefresh() : wx.hideLoading();
          } else {
            boo ? wx.stopPullDownRefresh() : wx.hideLoading();
            util.toast(that.data.message);
          }

        },
        fail: function (res) {
          boo ? wx.stopPullDownRefresh() : wx.hideLoading();
          util.toast("网络异常, 请稍后再试");
        }
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    console.log(2222);
    if (options.activityInfo) {
      var activityInfo = JSON.parse(options.activityInfo);
      this.setData({
        activityId: activityInfo.activityId
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */

  onShow: function () {
    var that = this;
    if (app.globalData.uid) {
      if (JSON.stringify(app.globalData.getActivityData) == "{}") {
        app.userActivityReadyCallBack = (getActivityData) => {
          if (getActivityData == 1) {
            util.toast("活动已经结束，请关注第二季");
            app.globalData.getActivityData = {};
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/tabBar/index/index'
              });
            }, 2000);
            return;
          } else {
            that.checkActivityDoing();
            if (app.globalData.getActivityData.endTime && app.globalData.getActivityData.startTime) {
              var getActivityData = {};
              getActivityData.endTime = app.globalData.getActivityData.endTime;
              getActivityData.startTime = app.globalData.getActivityData.startTime;
              that.countTime(app.globalData.uid, getActivityData);
              that.isSingUp(app.globalData.uid, getActivityData, false);
              that.getMoreDicByCondition(app.globalData.uid, false);
            }
          }
        }
      }
      that.checkActivityDoing();
      if (app.globalData.getActivityData.endTime && app.globalData.getActivityData.startTime) {
        var getActivityData = {};
        getActivityData.endTime = app.globalData.getActivityData.endTime;
        getActivityData.startTime = app.globalData.getActivityData.startTime;
        that.countTime(app.globalData.uid, getActivityData);
        that.isSingUp(app.globalData.uid, getActivityData, false);
        that.getMoreDicByCondition(app.globalData.uid, false);
      }
    } else {
      app.userInfoReadyCallBack = (uid, session) => {
        that.checkActivityDoing();
        app.userActivityReadyCallBack = (getActivityData) => {
          this.countTime(uid, getActivityData);
          this.isSingUp(uid, getActivityData, false);
          this.getMoreDicByCondition(uid, false);
        }
      }
    }
  },

  //检测活动是否正在进行
  checkActivityDoing: function () {
    var params = new Object();
    wx.showLoading({
      mask: true
    });
    params.activityId = this.data.activityId;
    network.POST({
      params: params,
      requestUrl: requestUrl.checkActivityDoingUrl,
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 90008) {   //活动已失效
          util.toast("活动已经结束，请关注第二季");
          app.globalData.getActivityData = {};
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/tabBar/index/index'
            });
          }, 2000);
        }
      },
      fail: function (res) {
        wx.hideLoading();
        uitl.toast(res.msg);
      }
    });
  },
  onPullDownRefresh: function () {
    this.countTime(app.globalData.uid, app.globalData.getActivityData);
    this.isSingUp(app.globalData.uid, app.globalData.getActivityData, true);
    this.getMoreDicByCondition(app.globalData.uid, true);
  },
  onHide: function () {
    clearInterval(this.data.setTime);
  },
  onShareAppMessage(res) {
    var that = this;
    let activityInfo = {};
    activityInfo.activityId = app.globalData.getActivityData.id;   //activity Id
    var activityStr = JSON.stringify(activityInfo);
    console.log(activityInfo);
    console.log(1111);

    var shareObj = {
      title: '免费拿iPhone8手机活动火热进行中，点击参加！',
      path: '/pages/activity/index?activityInfo=' + activityStr,
      imageUrl: '/images/popue.png',

      success: function (res) {
      },
      fail: function (res) {
      }
    };
    if (res.from == 'button') {
      shareObj.path = '/pages/activity/index?activityInfo=' + activityStr;
    }
    return shareObj;
  },
})