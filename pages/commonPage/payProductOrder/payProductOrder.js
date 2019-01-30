// pages/commonPage/placeOrder/placeOrder.js
var network = require('../../../utils/network.js');
var util = require('../../../utils/util.js');
var requestUrl = require('../../../config.js');
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedAddress: {},
    productDetail: {}
  },

  /**
   * 确认支付
   */
  purchaseProductInMiniProgram: function() {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.productId = this.data.productDetail.id;
    params.productNum = this.data.productDetail.productNum;
    params.transactionProductDetail = JSON.stringify(this.data.productDetail);
    params.addressId = this.data.selectedAddress.id;
    params.useBalanceFlag = false;
    params.payBalance = 0.0;
    params.useIntegralFlag = true;
    params.payIntegral = this.data.productDetail.finalIntegral;
    network.POST({
      params: params,
      requestUrl: requestUrl.purchaseProductInMiniProgramUrl,
      success: function(res) {
        if (res.data.code == 0) {
          that.wxPayUnifiedOrder(res.data);
        } else {
          util.toast(res.data.message);
        }

      },
      fail: function(res) {
        util.toast("网络异常, 请稍后再试");
      }
    });

  },

  wxPayUnifiedOrder: function(param) { //点击付款/打赏，向微信服务器进行付款
    //使用小程序发起微信支付
    wx.requestPayment({
      timeStamp: param.data.timeStamp, //记住，这边的timeStamp一定要是字符串类型的，不然会报错，我这边在java后端包装成了字符串类型了
      nonceStr: param.data.nonceStr,
      package: param.data.package,
      signType: 'MD5', //小程序发起微信支付，暂时只支持“MD5”
      paySign: param.data.paySign,
      success: function(event) { //支付成功   进入待发货的订单页面
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000,
          complete: function() { //支付成功后跳转到订单页面
            wx.redirectTo({
              url: '../../my/intergralOrder/intergralOrder?chosseId=0'
            });
            return;
          }
        });
      },
      fail: function(error) { //支付成功   进入待付款的订单页面
        wx.showToast({
          title: '支付失败',
          icon: 'success',
          duration: 2000,
          complete: function() { //支付成功后跳转到订单页面
            wx.redirectTo({
              url: '../../my/intergralOrder/intergralOrder?chosseId=1'
            });
            return;
          }
        });
      },
      complete: function() { //不管支付成功或者失败之后都要处理的方法，类似与final
        console.log("支付完成");
      }
    });
  },
  // 点击跳转到地址管理页
  goAddress: function() {
    wx.navigateTo({
      url: '/pages/commonPage/addressManage/addressManage?isFromPayProductOrderPage=true',
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    //商品详情
    var productDetail = wx.getStorageSync('productDetail');
    if (productDetail) {
      productDetail.finalPrice = productDetail.price * productDetail.productNum;
      productDetail.finalIntegral = productDetail.integral * productDetail.productNum;
      console.log(productDetail);
    }

    //收货地址
    var selectedAddress = wx.getStorageSync('selectedAddress');
    if (selectedAddress) {
      var addressDeatailInfo = selectedAddress.provinceName + " " +
        selectedAddress.cityName + " " + selectedAddress.regionName + " " +
        selectedAddress.streetName + " " + selectedAddress.detailAddress;
      addressDeatailInfo = addressDeatailInfo.length > 55 ? addressDeatailInfo.substring(0, 55) + "..." : addressDeatailInfo;
      selectedAddress.addressDeatailInfo = addressDeatailInfo;
    }
    //更新数据
    this.setData({
      productDetail: productDetail,
      selectedAddress: selectedAddress
    });
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