// pages/IntegralMall/IntegralDetail/IntegralDetail.js
var network = require('../../../utils/network.js');
var util = require('../../../utils/util.js');
var requestUrl = require('../../../config.js');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // MOCKDATA
    showModalStatus: false, //是否展示付款弹窗
    productId: "",
    productDetail: {},
    productDetail_describeImgUrlList: {},

    productNum: 1,
    minusStatus: 'disable',
    finalPrice: 0,
    finalIntegral: 0
  },
  //  点击立即购买
  nowBuy: function() {
    this.showModal();
  },
  // 点击关闭弹层
  closeModel: function() {
    this.hideModal();

  },
  showModal: function() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },

  /*点击减号*/
  bindMinus: function() {
    var productNum = this.data.productNum;
    if (productNum > 1) {
      productNum--;
    }
    var minusStatus = productNum > 1 ? 'normal' : 'disable';

    this.data.productDetail.finalPrice = this.data.productDetail.price * productNum;
    this.data.productDetail.finalPrice = this.data.productDetail.finalPrice.toFixed(2);
    this.data.productDetail.finalIntegral = this.data.productDetail.integral * productNum;
    this.data.productDetail.finalIntegral = this.data.productDetail.finalIntegral.toFixed(2);
    this.setData({
      productDetail: this.data.productDetail,
      productNum: productNum,
      minusStatus: minusStatus
    })
  },
  /*点击加号*/
  bindPlus: function() {
    var productNum = this.data.productNum;
    productNum++;
    var minusStatus = productNum > 1 ? 'normal' : 'disable';

    this.data.productDetail.finalPrice = this.data.productDetail.price * productNum;
    this.data.productDetail.finalPrice = this.data.productDetail.finalPrice.toFixed(2);
    this.data.productDetail.finalIntegral = this.data.productDetail.integral * productNum;
    console.log(this.data.productDetail);
    this.setData({
      productDetail: this.data.productDetail,
      productNum: productNum,
      minusStatus: minusStatus
    })
  },
  /*输入框事件*/
  bindManual: function(e) {
    var productNum = e.detail.value;
    var minusStatus = productNum > 1 ? 'normal' : 'disable';
    this.setData({
      productNum: productNum,
      minusStatus: minusStatus
    })
  },
  // 点击确定按钮
  sureBuy: function() {
    this.data.productDetail.productNum = this.data.productNum;
    wx.setStorageSync('productDetail', this.data.productDetail);
    wx.navigateTo({
      url: '/pages/commonPage/payProductOrder/payProductOrder'
    });
  },

  // 获取详情
  getProductDetail: function() {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.productId = this.data.productId;
    network.POST({
      params: params,
      requestUrl: requestUrl.getProductDetailUrl, 
      success: function(res) {
        if (res.data.code == 0) {
          console.log(res.data.data);
          console.log(JSON.parse(res.data.data.describeImgUrl));
          res.data.data.finalPrice = res.data.data.price;
          res.data.data.finalIntegral = res.data.data.price;
          that.setData({
            productDetail: res.data.data,
            productDetail_describeImgUrlList: JSON.parse(res.data.data.describeImgUrl)
          });
        } else {
          util.toast(res.data.message);
        }
      },
      fail: function(res) {
        util.toast("网络异常, 请稍后再试");
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var productId = options.productId;
    this.setData({
      productId: productId
    });
    console.log("productId = " + productId);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      showModalStatus:false
    })
    console.log(1122222222);
    this.getProductDetail();

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})