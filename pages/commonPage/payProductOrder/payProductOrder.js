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
    name:'233333333333333',
    price:33
  },


  surePay:function(){
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.shopId = this.data.shopId;
    params.payMoney = this.data.payMoney;
    params.useBalanceFlag = this.data.useBalanceFlag;
    params.spbillCreateIp = this.data.spbillCreateIp;
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.purchaseProductUrl,
        success: function (res) {
          if(res.data.code == 0){
            that.wxPayUnifiedOrder(res.data);
          }else{
            util.toast(res.data.message);
          }
          
        },
        fail: function (res) {
          util.toast("网络异常, 请稍后再试");
        }
      });
   
  },

  wxPayUnifiedOrder: function (param) {        //点击付款/打赏，向微信服务器进行付款
    //使用小程序发起微信支付
    wx.requestPayment({
      timeStamp: param.data.timeStamp,//记住，这边的timeStamp一定要是字符串类型的，不然会报错，我这边在java后端包装成了字符串类型了
      nonceStr: param.data.nonceStr,
      package: param.data.package,
      signType: 'MD5',      //小程序发起微信支付，暂时只支持“MD5”
      paySign: param.data.paySign,
      success: function (event) {
        wx.showToast({              //支付成功
          title: '支付成功',
          icon: 'success',
          duration: 2000,
          complete: function () {   //支付成功后发送模板消息
            console.log("模板消息已发送");
            return;
            var templateMessageParam = new Object();
            // 整理模板消息需要的参数
            // 整理模板消息需要的参数
            // 整理模板消息需要的参数
            // 整理模板消息需要的参数
            // 整理模板消息需要的参数
            // 整理模板消息需要的参数
            templateMessageParam.data = JSON.stringify(that.data.data);
            //发送模板消息，如果失败了也不给用户提示
            network.POST({
              params: templateMessageParam,
              requestUrl: requestUrl.sendTemplateMessageUrl,
              success: function (res) {

              },
              fail: function (res) {

              }
            });
          }
        });
      },
      fail: function (error) {      //支付失败
        console.log("支付失败");
        console.log(error);
        wx.showModal({
          title: '提示',
          content: '支付被取消.',
          showCancel: false
        });
      },
      complete: function () {       //不管支付成功或者失败之后都要处理的方法，类似与final
        console.log("支付完成");
      }
    });
  },
// 点击跳转到地址管理页
  goAddress:function(){
    wx.navigateTo({
      url: '/pages/commonPage/addressManage/addressManage',
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var headImgUrl = options.headImgUrl;
    var title = options.title;
    var degist = options.degist;
    var price = options.price;
    var integral = options.integral;
    var num = options.num;
    this.setData({
      headImgUrl: headImgUrl,
      title: title,
      degist: degist,
      price: price,
      integral: integral,
      num: num
    });
    console.log("headImgUrl = " + headImgUrl);
    console.log("title = " + title);
    console.log("degist = " + degist);
    console.log("price = " + price);
    console.log("integral = " + integral);
    console.log("num = " + num);
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
})