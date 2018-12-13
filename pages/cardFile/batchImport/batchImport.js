// pages/batchImport/batchImport.js
var util = require('../../../utils/util.js');
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    importSuccess: false,
    importFile: false,
    howCard: 0,   //导入张数
    updateCardNum:0,//更新张数
    manufacturerList: [],
    isHaveManufacturer:false,    //是否有名片商，true表示有，false表示没有
    cName: null,
    dicCode:null,   //dic code
    ifHaveLoad:false    //是否已成功请求到数据
  },
  //请求可以导入的厂商列表
  getCardManufacturer: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var params = new Object();
    params.dicType = 'competitor';
    network.POST({
      params: params,
      requestUrl: requestUrl.getSimpleDicByConditionUrl,
      success: function (res) {
        that.setData({
          ifHaveLoad:true
        })
        wx.hideLoading();
        if (res.data.code != 0) {
          util.toast(res.data.message);
          return;
        }
        if(res.data.data && res.data.data.length == 0) {
          that.setData({
            isHaveManufacturer: false
          })
        }else {
          that.setData({
            isHaveManufacturer: true
          })
        }
        //成功获取到数据
        for (var item in res.data.data) {
          that.data.manufacturerList.push(res.data.data[item]);
        }
        that.setData({
          manufacturerList: that.data.manufacturerList
        })
      },
      fail: function (res) {
        wx.hideLoading();
        that.setData({
          ifHaveLoad:true
        })
      }
    })

  },
  onceImport: function (e) {   //一键导入方法

    this.setData({
      cName: e.currentTarget.dataset.cname,
      dicCode: e.currentTarget.dataset.cardsource
    })
    this.dialog.showDialog();
  },
  closeSuccess: function () {
    this.setData({
      importSuccess: false
    })
  },
  closeFile: function () {
    this.setData({
      importFile: false
    })
  },
  goSee: function () {   //名片导入成功，去查看
    if (this.data.howCard !=0) {   //如果导入名片数不为0则刷新名片夹列表
      app.globalData.isRefreshTagForCardFile = true; 
    }
    wx.switchTab({
      url: '/pages/tabBar/cardFile/cardFile'
    })

  },
  takePhoto: function () {
    var number =1;
    var that = this;
    util.chooseWxImage('camera',0, number,0,false)
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onLoad: function (options) {
    this.getCardManufacturer();
  },
  onReady: function () {
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog");
    this.thirdLoginViewDailog = this.selectComponent("#thirdLoginDialog");
  },
  onUnload:function() {
    if (this.data.howCard != 0 || this.data.updateCardNum != 0) {
      app.globalData.isRefreshTagForCardFile = true;
    }
  },


  // ————————————————dialog事件————————————————
  //取消事件
  _cancelEvent() {

    this.dialog.hideDialog();
  },
  //确认事件
  _confirmEvent() {     //点击下一步按钮触发的事件
    this.dialog.hideDialog();

    this.thirdLoginViewDailog.showView();
  },
  // 展示第三方登录页面
  _cancelShowEvent() {
    this.thirdLoginViewDailog.hideView();
  },
  _statementsayEvent() {   //跳转到免责声明
    wx.navigateTo({
      url:'../statement/statement'
    })
  },
  _confirmShowEvent(e) {
    var that = this;
    if (e.detail.confirmStatus && e.detail.confirmStatus1) {   //两个input都有值才会执行确认方法
      this.thirdLoginViewDailog.hideView();
      var params = new Object();
      params.userName = e.detail.account;
      params.userPassword = e.detail.password;
      params.uid = app.globalData.uid;
      params.cardSource  = this.data.dicCode;
      if (app.globalData.getActivityData && JSON.stringify(app.globalData.getActivityData != '{}')
      ) {
        params.activityId = app.globalData.getActivityData.id;
      } else {
        app.userActivityReadyCallBack = (getActivityData) => {
          params.activityId = getActivityData;
        }
      }
      wx.showLoading({
        title: "名片批量导入中",
        mask: true
      })
      network.POST({
        params: params,
        requestUrl: requestUrl.importCardUrl,
        success: function (res) {
          wx.hideLoading();
          if (res.data.code != 0) {
            util.toast(res.data.message);
            return;
          }
          that.thirdLoginViewDailog.hideView();
          //数据请求成功
          that.setData({
            importSuccess:true,
            howCard:res.data.data.addNum,
            updateCardNum:res.data.data.updateNum
          })

        },
        fail: function (res) {
          wx.hideLoading();
          util.toast("系统异常，请稍后再试");
        }
      })
    }

  }
})