// pages/wx-cropper/index.js
var network = require('../../../utils/network.js');
var util = require('../../../utils/util.js');
var requestUrl = require('../../../config.js');
const app = getApp();
const appInfo = wx.getSystemInfoSync();
var Index = {
  data: {
    imageSrc: '',
    imageSrcShow:'',
    returnImage: '',
    isShowImg: true,
    windowWidth: appInfo.windowWidth,
    windowHeight: appInfo.windowHeight,
    isNewAdd:'',
    isOwnCard: 1,
    beforeEditData: '',
    userPhone: '',//不可更改的手机号
    modify: '',
    isIpx: app.globalData.isIpx, //是否是iPhoneX
    isGoWrite:true,
    isSowClip: true, //是否显示裁剪的框
    isClip:0,
    // isHandClip:''//如果选择手动裁剪
  },
  onLoad: function (options) {
    var that = this;
    app.globalData.clipImageMes = '';
    // 从上页拿来的数据
    let tempFilePath = {};
    if (options.tempFilePath){
      tempFilePath = JSON.parse(options.tempFilePath);
      this.setData({
        imageSrc: tempFilePath.tempFilePath,
        //是否是新创建的 如果为1是新增的，如果为0是编辑的
        isNewAdd: tempFilePath.number,
        isOwnCard: tempFilePath.isOwnCard,
        isGoWrite: tempFilePath.isGoWrite
      })
      // let params = new Object();
      // params.file = this.data.imageSrc;
      wx.showLoading({
        title: '图片裁剪中...',
        mask: true
      });
      var formData = {
        uid: app.globalData.uid,
        sessionKey: wx.getStorageSync("SESSIONKEY")
      };
      this.photoTrim = this.selectComponent("#photoTrim");
      network.UPLOADFILE(requestUrl.cutCardUrl, this.data.imageSrc, 'file', formData,
         function (res) {
          var result = JSON.parse(res)
          wx.hideLoading();
          // isClip = 0; //后台裁剪成功的标识
          if (result.code == 0){
            var rect_url = JSON.parse(result.data.rect_url);
            that.setData({
              imageSrcShow: rect_url[0],
              isClip : 1
              // isHandClip: tempFilePath.tempFilePath
            })
          }else{
            wx.hideLoading();
            that.setData({
              imageSrcShow: tempFilePath.tempFilePath,
              isSowClip: true,
            })
          } 
        
          that.photoTrim.init({
            canvasId: 'myCanvas',
            imageSrcShow: that.data.imageSrcShow,
            isClip: that.data.isClip
          }, that.onReadyCallback);
        },
       function (res) {
          wx.hideLoading();
          that.setData({
            imageSrcShow: tempFilePath.tempFilePath,
            isSowClip: true
          })
          that.photoTrim.init({
            canvasId: 'myCanvas',
            imageSrcShow: that.data.imageSrcShow
          }, that.onReadyCallback);
        })  
      if (tempFilePath.beforeEditData) {
        this.setData({
          beforeEditData: tempFilePath.beforeEditData
        })
      }
    }
    //
    wx.getSystemInfo({
      success: (res) => {
        // console.log(res);
        this.setData({
          pixelRatio: res.pixelRatio,
          // windowWidth: res.windowWidth,
          // windowHeight: res.windowHeight - 50
        })
        if (this.data.isIpx){
          this.setData({
            windowHeight: res.windowHeight - 84
          })
        }else{
          this.setData({
            windowHeight: res.windowHeight - 50
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    console.log(2222345);
    // console.log(this.data.isNewAdd);

  },

  onReadyCallback(res) {
    this.setData({
      isShowImg: true
    });
    this.fullCanvas(res);
  },

  //蛋疼的小程序，canvas放在模块里不生效;
  fullCanvas(data) {
    var ctx = wx.createContext();
    // console.log(data);
    // ctx.drawImage(data.path, 0, 0, 375, 200);
    ctx.drawImage(data.path, data.Left, data.Top, data.imageW, data.imageH);
    wx.drawCanvas({
      canvasId: data.canvasId,
      actions: ctx.getActions()
    });
  },

  fullTestBlock(data){
    // console.log(data);
    var ctx = wx.createContext();
    ctx.setFillStyle('rgba(255, 0, 0, 0.3)');
    ctx.fillRect(data.x, data.y, data.width, data.height)
    wx.drawCanvas({
      canvasId: data.canvasId,
      actions: ctx.getActions()
    });
  },

  // 获取图片
  getClipImage() {
    var that = this;
    var data = this.photoTrim.data;
    // 获取画布要裁剪的位置和宽度   均为百分比 * 画布中图片的宽度    保证了在微信小程序中裁剪的图片模糊  位置不对的问题
  
    var canvasData = this.photoTrim.getClippingRegion();
    // console.log(data);
    wx.showLoading({
      title: '图片生成中...',
      mask:true
    });
    canvasData.quality = 1;
    canvasData.fileType = 'jpg'; //生成图片类型;
    canvasData.success = (res) => {
      wx.hideLoading();
      // 成功获得地址的地方
      // app.globalData.clipImageMes = '';
      var clipImage = {};
      // wx.previewImage({
      //   current: res.tempFilePath, // 当前显示图片的http链接
      //   urls: [res.tempFilePath] // 需要预览的图片http链接列表
      // });
      clipImage.isNewAdd = this.data.isNewAdd;
      clipImage.imageSrc = res.tempFilePath;
      console.log(clipImage.imageSrc);
      clipImage.isOwnCard = this.data.isOwnCard;
      clipImage.beforeEditData = this.data.beforeEditData;
      clipImage.modify = this.data.modify;
      clipImage.cardPhone = this.data.userPhone;

      // console.log(clipImage);
      app.globalData.clipImageMes = JSON.stringify(clipImage);
      getApp().globalData.addMoreMes = [];
      getApp().globalData.arr2 = [];
      // console.log(clipImage);
      // console.log(this.data.isGoWrite);
      app.globalData.isClickBack = true;
      if (this.data.isGoWrite){
        wx.navigateBack({
          // url: '/pages/commonPage/handWrite/handWrite?clipImageMes=' + clipImageMes
        })
      }else{
        app.globalData.cardCustomMessage2 = [];
        wx.redirectTo({
          url: '/pages/commonPage/handWrite/handWrite'
        })
      }
    };
    canvasData.fail = (error) => {
      // console.error(error);
      wx.hideLoading();
    };
    // console.log(canvasData);
    setTimeout(function () {
      wx.canvasToTempFilePath(canvasData);
    }, 1000);
  },
  newClip(){
    var that = this;
    // if (this.data.isHandClip != ''){
      // this.setData({
        // imageSrc: this.data.isHandClip,
        // isSowClip:true
      // })
    // }
    this.setData({
      isSowClip: true
    })
    wx.getImageInfo({
      src: that.data.imageSrc,
      success: (res) => {
        res.isClip = 0;
        that.photoTrim.loadImageInfo(res, that.data.isSowClip);
      },
      fail: (error) => {
        // console.errot(error);
        wx.hideLoading();
      }
    });
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
}
// console.log(Index);
Page(Index);