//app.js test
var network = require('utils/network.js')
const requestUrl = require('config')
const util = require('utils/util.js')
const netool = require('utils/netool.js')

App({
  data: {
    code: null,
    editCard: []
  },
  onLaunch: function () {
    console.log('判断当前用户是否已经授权~控制按钮是否可以点击');
    //判断当前用户是否已经授权~控制按钮是否可以点击
    if (wx.getStorageSync('isAuthorization')) {
    } else{
      wx.setStorageSync('isAuthorization', false);
    }
    this.handlSystemInfo();
    this.login();
  },
  handlSystemInfo: function () {
    let that = this;
    //  判断是否是iphonX型号
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res);
        let model = res.model.substring(0, res.model.indexOf("X")) + "X";
        // console.log(model);
        // console.log(model == 'iPhone X');
        if (model == 'iPhone X') {
          that.globalData.isIpx = true  //判断是否为iPhone X 默认为值false，iPhone X 值为true
        } else {
          that.globalData.isIpx = false
        }
      }
    })
  },
  onShow: function (options) {
    console.log('小程序进入前台啦小程序进入前台啦小程序进入前台啦小程序进入前台啦' + options.scene);
    var that = this;
    that.globalData.isRefreshTagForCardFile = true;   //每次不管小程序从哪里进入到前台，都会设置名片夹列表页刷新
  },
  //登录方法
  login: function () {
    var that = this;
    var session = wx.getStorageSync('SESSIONKEY');
    var uid = wx.getStorageSync('UIDKEY');
    // console.log("获取本地存储的session为：" + session);
    //判断是否有session，如果有session，判断此session是否过期，如果没有session，则登录
    if (session && uid) {
      // console.log("有Session");
      // that.firstInAuthorization();   //如果用户已经登录，还要进一步判断权限判断
      var params = new Object();
      params.sessionKey = session;
      params.sessionCheck = 1;
      network.POST(
        {
          params: params,
          requestUrl: requestUrl.checkSession,
          success: function (res) {
            if (res.data.code == 10002) {   //session过期
              that.clearInfo();
              that.login();
              return;
            }
            console.log(session, uid);
            that.initGlobalData(session, uid);    //如果session没有过期，则初始化 数据
            if (res.data.code != 0) {   //session检测异常
              util.toast(res.data.message);
              return;
            }
            // console.log("Session,未过期");

          },
          fail: function () {
            util.toast(res.data.message);
          }
        })
      return;
    }
    // console.log("没有session,需要去登录");
    wx.login({
      success: function (res) {
        //调用登录
        var params = new Object();
        params.code = res.code;
        network.POST({
          params: params,
          requestUrl: requestUrl.wxAppLoginUrl,
          success: function (res) {
            if (res.data.code != 0) {  //登录错误
              wx.showModal({
                title: '提示',
                content: res.data.message,
                showCancel: false
              })
              return;
            }
            console.log(res.data.data.sessionKey);
            console.log(res.data.data.uid);
            // var openid = res.data.openid;


            console.log("登录成功");
            //登录成功，将uid和session保存
            that.saveInfo(res.data.data.sessionKey, res.data.data.uid,res.data.openid);
            // console.log(res.data.data.sessionKey + "-----" + res.data.data.uid);
          }
        })
        //请求用户授权
        // that.authorization();
      }
    })
  },
  // 再次进入对权限进行校验
  // firstInAuthorization: function () {
  //   var that = this;
  //   wx.getUserInfo({   //原则上这边应该是直接走到fail的。但是为了防止刚开始没有昵称和头像权限，所有这里做了请求判断
  //     success: function (res) {
  //       wx.setStorageSync('isAuthorization', true);
  //       if (that.userAuthorizationReadyCallBack){
  //         that.userAuthorizationReadyCallBack(wx.setStorageSync('isAuthorization', true));
  //       }

  //       wx.setStorageSync("USERINFO", res.userInfo);
  //       netool.updateUserInfo(res);
  //       // console.log("用户允许了获取昵称和头像,并且保存了用户的信息：" + wx.getStorageSync("USERINFO"));
  //     },
  //     fail: function (res) {
  //       wx.getSetting({
  //         success: function (res) {
  //           // console.log(res);
  //           if (!res.authSetting['scope.userInfo']) {    //如果用户拒绝了权限，则再次弹框提醒
  //             that.showForceToast();
  //           } else {   //如果用户允许了权限，则将用户信息存储
  //             wx.setStorageSync("USERINFO", res.userInfo);
  //             netool.updateUserInfo(res);
  //             that.globalData.userInfo = res.userInfo;
  //           }
  //         },
  //         fail: function () {
  //         }
  //       })
  //     }
  //   })
  // },
  //授权
  // authorization: function () {
  //   var that = this;
  //   wx.getUserInfo({
  //     success: function (res) {
  //       wx.setStorageSync('isAuthorization', true);
  //       if (that.userAuthorizationReadyCallBack){
  //         that.userAuthorizationReadyCallBack(wx.setStorageSync('isAuthorization', true));
  //       }

  //       wx.setStorageSync("USERINFO", res.userInfo);
  //       // that.saveUserInfo(res);
  //       netool.updateUserInfo(res);

  //       // console.log("用户允许了获取昵称和头像,并且保存了用户的信息：" + wx.getStorageSync("USERINFO"));
  //     },
  //     fail: function () {   //用户拒绝了微信授权头像和昵称
  //       // console.log("用户拒绝了微信授权");
  //       that.openSetting();
  //     }
  //   })
  // },
  // openSetting: function () {   //打开设置
  //   var that = this;
  //   wx.openSetting({
  //     success: function (res) {
  //       if (res.authSetting["scope.userInfo"]) {   //用户打开了用户信息授权
  //         that.authorization();
  //       } else {    //用户没有打开用户信息授权
  //         that.showForceToast();
  //       }
  //     }
  //   })
  // },
  // showForceToast: function () {     //弹出强制强制授权弹框
  //   var that = this;
  //   wx.showModal({
  //     title: '温馨提示',
  //     content: '小程序需要获取用户信息权限，点击确认前往设置或者退出程序？',
  //     showCancel: false,
  //     success: function () {
  //       that.openSetting();
  //     }
  //   })
  // },
  saveInfo: function (session, uid, openId) {   //将登录获取的数据保存
    // console.log("开始保存用户信息");

    try {
      wx.setStorageSync("SESSIONKEY", session);
      wx.setStorageSync("UIDKEY", uid);
      wx.setStorageSync("OPENID", openId);
      // wx.setStorageSync("getActivityData", getActivityData);
    } catch (e) {
      // console.log("存储session失败");
    }
    this.globalData.session = session;
    this.globalData.uid = uid;
    this.globalData.openId = openId;

    // console.log("保存用户信息成功：保存的session为：" + wx.getStorageSync('SESSIONKEY'));
    if (this.userInfoReadyCallBack) {
      this.userInfoReadyCallBack(uid, session);
    }
  },
  clearInfo: function () {   //将缓存的数据清空,包含uid，sessionkey，userinfo
    this.globalData.session = null;
    this.globalData.uid = null;
    wx.removeStorageSync('SESSIONKEY');
    wx.removeStorageSync('UIDKEY');
    console.log("清空用户信息成功");
  },
  initGlobalData(session, uid) {    //初始化全局数据
    this.globalData.session = session;
    this.globalData.uid = uid;

    if (this.userInfoReadyCallBack) {
      this.userInfoReadyCallBack(uid, session);
    }
    // console.log("数据初始化完成,session:" + this.globalData.session + "uid:" + this.globalData.uid);
  },

  globalData: {
    userInfo: null,
    uid: null,
    session: null,
    isIpx: false,
    code: null,
    arr2: [],
    isChoosetoforgroundTag: 0,    // 如果为4，则不刷新名片夹数据，如果不为4则刷新名片夹数据
    addMoreMes: [],
    myCardCount: -1,  //       全局记录我的个人名片个数，如果为-1说明首页没有进入
    isRefreshTagForCardFile: true,      //全局记录刷新标记 主要在名片夹中使用
    isRefreshTagForIndex: true,       //全局记录刷新标记 主要在我的名片夹中使用
    swiperCurrent: 0,//分享人打开之后小圆点停留的位置
    // clipImageMes:'',//裁剪完传递过去的服务信息
    // isClickBack:false, //是否从裁剪返回
    cardCustomMessage2: [],//选择标签后新增的
    saveCardId: '',//被分享分打开的cardId
    getActivityData: {},//获取正在进行的活动信息
    isJoinTeamInActivityPage: false,    //是否是加入我们页面调起活动页，主要用在加团页面的我要拿iPhone8

  },
})