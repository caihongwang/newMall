var util = require('../../../utils/util.js');
var requestUrl = require('../../../config.js');
var app = getApp()
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
 * 组件的属性列表
 * 用于组件自定义设置
 */
data:{
  isOwnCard:'',
  userPhone:'',
  isIpx: app.globalData.isIpx,
},
  properties: {
    isOwnCard: { // 属性名
      type: String,
      value: '',// 属性初始值（可选），如果未指定则会根据类型选择一个
      // observer: function (newVal, oldVal) {
      //   console.log(oldVal);
      //   this.setData({
      //     isOwnCard: oldVal
      //   })
      // }
    }
    // 弹窗标题
  },
  /**
 * 私有数据,组件的初始数据
 */
  data: {
    // 弹窗显示控制
    isShow: false,
    isIpx: app.globalData.isIpx 

  },
  /**
 * 组件的方法列表
 * 更新属性和数据的方法与更新页面数据的方法类似
 */
  methods: {
    /*
 * 公有方法
 */
    //隐藏弹框
    hideDialog() {
      // if(!this.data.isShow) {
      //   return;
      // }
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation;
      animation.translateY(252).step()
      this.setData({
        animationData: animation.export(),
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export(),
          isShow: false
        })
        wx.showTabBar({});

      }.bind(this), 200)
  
    },
    //展示弹框
    showDialog(userPhone) {
      if (userPhone){
        this.setData({
          userPhone: userPhone
        });
      }
  
      var animation = wx.createAnimation({
        duration: 200,  //动画时长  
        timingFunction: "linear", //线性  
        delay: 0  //0则不延迟  
      });  
      this.animation = animation;  
      animation.translateY(252).step()  
      this.setData({
        animationData: animation.export(),
        isShow: true
      })  
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 200)  
    },
    /*
 * 内部私有方法建议以下划线开头
 * triggerEvent 用于触发事件
 */
    _cancelEvent() {
      //触发取消回调
      this.triggerEvent("cancelEvent")
    },
    photoUp: function () {
      var that = this;  
      // 新增
      util.chooseWxImage('camera',0, 1, that.data.isOwnCard, that.data.userPhone,false);
      this.hideDialog();
    },
    handWriting: function () {
      var testData = {};
      app.globalData.addMoreMes = [];
      app.globalData.arr2 = [];

      testData.isOwnCard = this.data.isOwnCard;
      // console.log(this.data.isOwnCard);
      testData.cardSource = 'manually';
      testData.cardPhone = this.data.userPhone;
      app.globalData.cardCustomMessage2 = [];
      wx.showTabBar({});
      wx.navigateTo({
        url: '/pages/commonPage/handWrite/handWrite?testData=' + JSON.stringify(testData)
      })
      this.hideDialog();
    },
    closePhotograph: function () {
      wx.showTabBar({});
      this.setData({
        isCreatCard: false
      })
    },
   
    albumSletion: function () {
      var that = this;
      util.chooseWxImage('album', 0, 1, that.data.isOwnCard, that.data.userPhone, false);
      this.hideDialog();
      // wx.getSetting({
      //   success: res => {
      //     console.log(res);
      //     if (!res.authSetting['scope.camera']) {
      //       wx.authorize({
      //         scope: 'scope.camera',
      //         success() {
      //           util.chooseWxImage('album');
      //           // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
      //         }
      //       })
      //     } else {
      //       util.chooseWxImage('album');
      //     }
      //   }
      // })
      // 调用相机
    }
  }
})



