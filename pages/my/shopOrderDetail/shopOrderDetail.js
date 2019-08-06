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
      phoneNumber: '17701359899' // 仅为示例，并非真实的电话号码
    });
  },

  /**
   * 获取订单详情
   */
  getFoodsOrderDetail: function () {
    var that = this;
    var params = new Object();
    params.orderId = that.data.orderId;
    wx.showLoading({
      title: '客官请稍后...',
      mask: true
    });
    network.POST({
      params: params,
      requestUrl: requestUrl.getFoodsOrderDetailByIdUrl,
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 0) {
          var orderDetail = res.data.data;
          if (orderDetail.transactionFoodsDetail) {
            var transactionFoodsDetail = JSON.parse(orderDetail.transactionFoodsDetail);
            orderDetail.transactionFoodsDetail = transactionFoodsDetail;
          }
          if (orderDetail.remark) {
            var remark = JSON.parse(orderDetail.remark);
            orderDetail.remark = remark;
          }
          // orderDetail.orderStatusCode = "1";
          var windowHeight = wx.getSystemInfoSync().windowHeight;
          if (orderDetail.orderStatusCode == "0"){
            windowHeight = windowHeight - 130;
          } else {
            windowHeight = windowHeight - 70;
          }
          that.setData({
            orderDetail: orderDetail,
            windowHeight: windowHeight
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
      params.foodsId = this.data.orderDetail.foodsId;
      params.wxOrderId = this.data.orderDetail.wxOrderId;
      params.payMoney = this.data.orderDetail.allPayAmount;
      params.shopTitle = this.data.orderDetail.shopTitle;
      params.shopId = this.data.orderDetail.shopId;
      if (this.data.orderDetail.useIntegralNum > 0) {
        params.useIntegralFlag = true;
      } 
      if (this.data.orderDetail.useBalanceMonney > 0) {
        params.useBalanceFlag = true;
      }
      params.payIntegral = this.data.orderDetail.useIntegralNum;
      params.payBalance = this.data.orderDetail.useBalanceMonney;
      //合并 点餐订单的参数
      params = Object.assign(params, this.data.shopOrderParams);
      network.POST({
        params: params,
        requestUrl: requestUrl.payTheBillInMiniUrl,
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
              // that.getFoodsOrderDetail();
              console.log("模板消息已发送");
              let wxOrderId = param.data.wxOrderId;
              wx.navigateTo({
                url: '/pages/shop/luckyDraw/luckyDraw?wxOrderId=' + wxOrderId
              });
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
                url: '../../my/shopOrder/shopOrder?chosseId=1'
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
    var orderId = 140;
    if (options.orderId){
      orderId = options.orderId;
    }
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
    this.getFoodsOrderDetail();
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