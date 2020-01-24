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
    //1.处理系统信息，因为iphonX是一个特殊的手机型号，设计有风险啊
    this.handlSystemInfo();
    //2.检测并登录：检测会话是否过期，过期则重登陆，否则正常使用
    this.checkAndLogin();
  },
  onShow: function (options) {
    console.log('小程序进入前台啦小程序进入前台啦小程序进入前台啦小程序进入前台啦' + options.scene);
    var that = this;
    that.globalData.isRefreshTagForCardFile = true;   //每次不管小程序从哪里进入到前台，都会设置名片夹列表页刷新
  },
  handlSystemInfo: function () {
    let that = this;                //使用严格模式
    wx.getSystemInfo({
      success: function (res) {
        let model = res.model.substring(0, res.model.indexOf("X")) + "X";
        if (model == 'iPhone X') {      //判断是否是iphonX型号
          that.globalData.isIpx = true;  //判断是否为iPhone X 默认为值false，iPhone X 值为true
        } else {
          that.globalData.isIpx = false;
        }
      }
    });
  },
  checkAndLogin: function () {              //预登录：检测是否登录
    var that = this;
    var isLogin = false;
    var session = wx.getStorageSync('SESSIONKEY');
    var uid = wx.getStorageSync('UIDKEY');
    console.log("开始准备预登陆....");
    console.log("uid = " + uid + " , seesion = " + session);
    //判断是否有session，如果有session，判断此session是否过期，如果没有session，则登录
    if (session && uid) {             //已经登录过
      // that.getPhotosAuthorization("scope.writePhotosAlbum");   //获取位置，如果用户已经登录，万一将授权取消了，所以还要获取授权
      var params = new Object();
      params.sessionKey = session;
      params.sessionCheck = 1;
      network.POST({
        params: params,
        requestUrl: requestUrl.checkSession,
        success: function (res) {
          console.log("检测 res.data.code = " + res.data.code);
          if (res.data.code == 10002) {   //session过期
            that.clearInfo();
            that.login();
            return;
          }
          that.initGlobalData(session, uid);    //如果session没有过期，则初始化 数据
          if (res.data.code != 0) {   //session检测异常
            util.toast(res.data.message);
            return;
          }
        },
        fail: function (res) {
          util.toast(res.data.message);
          isLogin = true;           //需要重新登录
        }
      });
    } else {
      that.login();
    }
  },
  //登录方法
  login: function () {
    network.goLogin();
    return;
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
    // 新的获取经纬度
    latitude: null,//经度
    longitude: null,//纬度
  },
})