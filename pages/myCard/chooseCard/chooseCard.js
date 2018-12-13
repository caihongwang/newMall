var network = require('../../../utils/network.js');
var util = require('../../../utils/util.js');
var requestUrl = require('../../../config.js');
const app = getApp()

Page({
  data: {
    info: [],
    clickIndex:0,
    isIpx: app.globalData.isIpx,
    isShowExpress:false //是否显示解释的弹窗
  },
  clickChosse:function(e){  //点击选择可能列表的一条数据
    for (var i in this.data.info) {
      if (i != e.currentTarget.dataset.index){
        // console.log(e.currentTarget.dataset.index);
        this.data.info[i].swiper = false;
      }else{
        this.data.info[e.currentTarget.dataset.index].swiper = true;
      }
    }
    this.setData({
      info: this.data.info,
      isSure: false
    })
  },
  creatNew:function (){ //点击左下创建新名片
    var that = this;
    let showDialog = true;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.data.isHavePhone = false;
    var isHavePhone = '1'; 
    wx.switchTab({
      url: '/pages/tabBar/index/index',  
      success:function(){
        wx.hideTabBar({
          success: function (res) {
          },
          fail: function (res) {
          },
        });
      }     
    })
    prevPage.showDialog(that.data.info[0].cardPhone);

  },
  sure: function () {  //点击右下角的确认按钮，选择了一个可能的数据跳转到手动输入修改的页面
    var addMayUserInfo = {};
    for (var i in this.data.info) {
      if (this.data.info[i].swiper == true) {
        addMayUserInfo = this.data.info[i];
      } 
    }
    // console.log(addMayUserInfo);
    app.globalData.addMoreMes = [];
    app.globalData.arr2 = [];
    wx.showTabBar({
      success: function (res) {
      },
      fail: function (res) {
      },
    });
    app.globalData.clipImageMes = '';
    app.globalData.cardCustomMessage2 = [];
    wx.navigateTo({
      url: '/pages/commonPage/handWrite/handWrite?addMayUserInfo=' + JSON.stringify(addMayUserInfo)
    })
  },
  clickExpress:function(){
    this.setData({
      isShowExpress: true
    })
  },
  closeExpress:function(){
    // 关闭解释弹窗
    this.setData({
      isShowExpress:false
    })
  },
  onLoad: function (options) {
    let userPhoneList = JSON.parse(options.userPhoneList);
    for (var i in userPhoneList) {
      if(i == 0){
        userPhoneList[0].swiper = true;
      }else{
        userPhoneList[i].swiper = false;
      }
      if (userPhoneList[i].cardCustomMessage){
        var other = [];
        other = JSON.parse(userPhoneList[i].cardCustomMessage);
        userPhoneList[i].cardCustomMessage = [];
        userPhoneList[i].cardCustomMessage = other;
      }
    }
    this.setData({
      info: userPhoneList
    });
    // console.log(this.data.info)
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
  
  }
})