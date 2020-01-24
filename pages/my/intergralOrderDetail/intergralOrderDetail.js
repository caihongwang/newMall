var util = require('../../../utils/util.js');
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: "",  //订单ID
    orderDetail: {}//用来展示的订单
  },
  // 拨打电话
  contactPhone: function () {
    wx.makePhoneCall({
      phoneNumber: '13636574416' // 仅为示例，并非真实的电话号码
    });
  },

  /**
   * 获取订单详情
   */
  getGoodsOrderDetail: function () {
    var that = this;
    var params = new Object();
    params.orderId = that.data.orderId;
    wx.showLoading({
      title: '客官请稍后...',
      mask: true
    });
    network.POST({
      params: params,
      requestUrl: requestUrl.getGoodsOrderDetailByIdUrl,
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 0) {
          var orderDetail = res.data.data;
          if (orderDetail.transactionProductDetail) {
            var transactionProductDetail = JSON.parse(orderDetail.transactionProductDetail);
            console.log(transactionProductDetail);
            orderDetail.productPrice = transactionProductDetail.price;
          }
          that.setData({
            orderDetail: orderDetail
          });
          console.log(that.data.orderDetail);
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

    /**
     * 确认支付
     */
    surePay: function() {
      var that = this;
      var params = new Object();
      params.uid = wx.getStorageSync("UIDKEY");
      params.wxOrderId = this.data.orderDetail.wxOrderId;
      params.productId = this.data.orderDetail.productId;
      params.productNum = this.data.orderDetail.productNum;
      params.addressId = this.data.orderDetail.addressId;
      if (this.data.orderDetail.transactionProductDetail){
        var transactionProductDetail = JSON.parse(this.data.orderDetail.transactionProductDetail);
        params.transactionProductDetail = JSON.stringify(transactionProductDetail);
        params.productPrice = transactionProductDetail.price;
        params.productIntegral = transactionProductDetail.integral;
      }
      params.useBalanceFlag = false;
      params.payBalance = 0.0;
      params.useIntegralFlag = true;
      params.payIntegral = this.data.orderDetail.useIntegralNum;
      console.log("params");
      console.log(params);
      network.POST({
        params: params,
        requestUrl: requestUrl.purchaseProductInMiniProgramUrl,
        success: function (res) {
          if (res.data.code == 0) {
            that.wxPayUnifiedOrder(res.data);
          } else {
            util.toast(res.data.message);
          }
        },
        fail: function (res) {
          util.toast("网络异常, 请稍后再试");
        }
      });

    },

    wxPayUnifiedOrder: function(param) { //点击付款/打赏，向微信服务器进行付款
      var that = this;
      //使用小程序发起微信支付
      wx.requestPayment({
        timeStamp: param.data.timeStamp, //记住，这边的timeStamp一定要是字符串类型的，不然会报错，我这边在java后端包装成了字符串类型了
        nonceStr: param.data.nonceStr,
        package: param.data.package,
        signType: 'MD5', //小程序发起微信支付，暂时只支持“MD5”
        paySign: param.data.paySign,
        success: function (event) { //支付成功   进入待发货的订单页面
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 2000,
            complete: function () { //支付成功后跳转到订单页面
              that.getGoodsOrderDetail();
            }
          });
        },
        fail: function (error) { //支付成功   进入待付款的订单页面
          wx.showToast({
            title: '支付失败',
            icon: 'success',
            duration: 2000,
            complete: function () { //支付成功后跳转到订单页面
              wx.redirectTo({
                url: '../../my/intergralOrder/intergralOrder?chosseId=1'
              });
              return;
            }
          });
        },
        complete: function () { //不管支付成功或者失败之后都要处理的方法，类似与final
          console.log("支付完成");
        }
      });
    },

  onLoad: function (options) {
    var orderId = options.orderId;
    this.setData({
      orderId: orderId
    });
    console.log("orderId = " + orderId);
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
    console.log("orderId = " + this.data.orderId);
    // this.data.orderId = 5;
    if (this.data.orderId) {
      this.getGoodsOrderDetail();
    }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

})