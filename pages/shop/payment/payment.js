// pages/shop/payment/payment.js
var network = require('../../../utils/network.js');
var util = require('../../../utils/util.js');
var requestUrl = require('../../../config.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseWechat: true, //是否选中了微信支付
    payingBill: false, //是否选中了买单支付
    isAgreement: true, //是否同意协议,默认同意
    useIntegralFlag: false, //是否积分抵现
    useBalanceFlag: false, //是否余额抵现
    integralOfDeduction: 0,
    balanceOfDeduction: 0,
    payMoney: "",
    finalPayment: 0,
    balance: 0,
    integral: 0,
    integralDeductionNum: "",
    balanceDeductionNum: "",
    integralDeductionNumPercent: "",
    balanceDeductionNumPercent: "",

    isDisabledPayMoney: false,
    shopOrderParams: {}
  },

  /**
   * 判断对象是否为空
   */
  isEmptyObject: function(obj) {　　
    for (var key in obj) {　　　　
      return false; //返回false，不为空对象
    }　　
    return true; //返回true，为空对象
  },

  /**
   * 是否同意用户协议
   */
  isAgree: function() {
    // 点击是否选中图片
    this.data.isAgreement = !this.data.isAgreement
    this.setData({
      isAgreement: this.data.isAgreement
    });
  },

  /**
   * 选择微信支付
   */
  selectWxChatPay: function() {
    if (!this.data.chooseWechat) {
      this.setData({
        chooseWechat: true,
        payingBill: false,
        useIntegralFlag: false,
        useBalanceFlag: false
      })
    }
  },

  /**
   * 选择余额支付
   */
  selectBalance: function() {
    if (!this.data.payingBill) {
      this.setData({
        chooseWechat: false,
        payingBill: true,
        useIntegralFlag: false,
        useBalanceFlag: false
      })
    }
  },

  /**
   * 转换百分数
   */
  toPercent: function(point) {
    var str = Number(point * 100).toFixed(0);
    str += "%";
    console.log("str = " + str);
    return str;
  },

  /**
   * 打开积分switch
   */
  switchIntegralChange: function(e) {
    var useIntegralFlag = false;
    if (e.detail.value) {
      useIntegralFlag = e.detail.value;
    }
    var finalPayment = 0;
    var integralOfDeduction = this.data.integralOfDeduction;
    var payMoney = this.data.payMoney;
    if (useIntegralFlag) {
      var integralDeductionMoney = this.data.payMoney * this.data.integralDeductionNum; //最高可抵扣积分
      integralDeductionMoney = integralDeductionMoney.toFixed(2);
      if (integralOfDeduction > integralDeductionMoney) {
        integralOfDeduction = integralDeductionMoney;
        util.toast("最多可使用付款金额的" + this.data.integralDeductionNumPercent + "进行积分抵扣");
      }
      finalPayment = payMoney - integralOfDeduction;
      if (finalPayment < 0) {
        finalPayment = 0;
        integralOfDeduction = payMoney;
      }
    } else {
      finalPayment = payMoney;
    }
    this.setData({
      integralOfDeduction: integralOfDeduction,
      useIntegralFlag: useIntegralFlag,
      finalPayment: finalPayment
    });
  },

  /**
   * 打开余额switch
   */
  switchBanlanceChange1: function(e) {
    var useBalanceFlag = false;
    if (e.detail.value) {
      useBalanceFlag = e.detail.value;
    }
    var finalPayment = 0;
    var balanceOfDeduction = this.data.balanceOfDeduction;
    var payMoney = this.data.payMoney;
    if (useBalanceFlag) {
      var balanceDeductionMoney = this.data.payMoney * this.data.balanceDeductionNum; //最高可抵扣积分
      balanceDeductionMoney = balanceDeductionMoney.toFixed(2);
      if (balanceOfDeduction > balanceDeductionMoney) {
        balanceOfDeduction = balanceDeductionMoney;
        util.toast("最多可使用付款金额的" + this.data.balanceDeductionNumPercent + "进行余额抵扣");
      }
      finalPayment = payMoney - balanceOfDeduction;
      if (finalPayment < 0) {
        finalPayment = 0;
        balanceOfDeduction = payMoney;
      }
    } else {
      finalPayment = payMoney;
    }
    this.setData({
      balanceOfDeduction: balanceOfDeduction,
      useBalanceFlag: useBalanceFlag,
      finalPayment: finalPayment
    });
  },

  /**
   * 付款金额-输入框监听
   */
  payMoneyInputFunc: function(e) {
    var payMoney = 0;
    if (e.detail.value + "") {
      payMoney = e.detail.value;
      var finalPayment = 0;
      var integralOfDeduction = this.data.integralOfDeduction;
      var balanceOfDeduction = this.data.balanceOfDeduction;
      if (this.data.useIntegralFlag) {
        var integralDeductionMoney = payMoney * this.data.integralDeductionNum; //最高可抵扣积分
        integralDeductionMoney = integralDeductionMoney.toFixed(2);
        if (integralOfDeduction > integralDeductionMoney) {
          integralOfDeduction = integralDeductionMoney;
          util.toast("最多可使用付款金额的" + this.data.integralDeductionNumPercent + "进行积分抵扣");
        }
        console.log("integralOfDeduction = " + integralOfDeduction);
        console.log("integralDeductionMoney = " + integralDeductionMoney);
        finalPayment = payMoney - integralOfDeduction;
      } else if (this.data.useBalanceFlag) {
        var balanceDeductionMoney = payMoney * this.data.balanceDeductionNum; //最高可抵扣余额
        balanceDeductionMoney = balanceDeductionMoney.toFixed(2);
        if (balanceOfDeduction > balanceDeductionMoney) {
          balanceOfDeduction = balanceDeductionMoney;
          util.toast("最多可使用付款金额的" + this.data.balanceDeductionNumPercent + "进行余额抵扣");
        }
        finalPayment = payMoney - balanceOfDeduction;
      } else {
        finalPayment = payMoney;
      }
      this.setData({
        payMoney: payMoney,
        finalPayment: finalPayment,
        integralOfDeduction: integralOfDeduction,
        balanceOfDeduction: balanceOfDeduction
      });
    } else {
      payMoney = 0;
    }
  },

  /**
   * 积分抵扣-输入框监听
   */
  integralInputFunc: function(e) {
    var integralOfDeduction = 0;
    if (e.detail.value + "") {
      if (Number(e.detail.value) >= Number(this.data.integral)) {
        integralOfDeduction = this.data.integral;
      } else {
        integralOfDeduction = e.detail.value;
      }
      var finalPayment = 0;
      var payMoney = 0;
      if (this.data.payMoney) {
        payMoney = this.data.payMoney;
      }
      if (this.data.useIntegralFlag) {
        var integralDeductionMoney = payMoney * this.data.integralDeductionNum; //最高可抵扣积分
        integralDeductionMoney = integralDeductionMoney.toFixed(2);
        if (integralOfDeduction > integralDeductionMoney) {
          integralOfDeduction = integralDeductionMoney;
          util.toast("最多可使用付款金额的" + this.data.integralDeductionNumPercent + "进行积分抵扣");
        }
        finalPayment = payMoney - integralOfDeduction;
        if (finalPayment < 0) {
          finalPayment = 0;
          integralOfDeduction = this.data.payMoney;
        }
      } else {
        finalPayment = payMoney;
      }
      this.setData({
        integralOfDeduction: integralOfDeduction,
        finalPayment: finalPayment
      });
    } else {
      integralOfDeduction = 0;
    }
  },

  /**
   * 余额抵扣-输入框监听
   */
  balanceInputFunc: function(e) {
    var balanceOfDeduction = 0;
    if (e.detail.value + "") {
      if (Number(e.detail.value) >= Number(this.data.balance)) {
        balanceOfDeduction = this.data.balance;
      } else {
        balanceOfDeduction = e.detail.value;
      }
      var finalPayment = 0;
      var payMoney = 0;
      if (this.data.payMoney) {
        payMoney = this.data.payMoney;
      }
      if (this.data.useBalanceFlag) {
        var balanceDeductionMoney = payMoney * this.data.balanceDeductionNum; //最高可抵扣余额
        balanceDeductionMoney = balanceDeductionMoney.toFixed(2);
        if (balanceOfDeduction > balanceDeductionMoney) {
          balanceOfDeduction = balanceDeductionMoney;
          util.toast("最多可使用付款金额的" + this.data.balanceDeductionNumPercent + "进行余额抵扣");
        }
        finalPayment = payMoney - balanceOfDeduction;
        if (finalPayment < 0) {
          finalPayment = 0;
          balanceOfDeduction = this.data.payMoney;
        }
      } else {
        finalPayment = payMoney;
      }
      this.setData({
        balanceOfDeduction: balanceOfDeduction,
        finalPayment: finalPayment
      });
    } else {
      balanceOfDeduction = 0;
    }
  },

  /**
   * 获取用户基本信息
   */
  getUserBaseInfo: function() {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    network.POST({
      params: params,
      requestUrl: requestUrl.getUserBaseInfoUrl,
      success: function(res) {
        if (res.data.code == 0) {
          var integralDeductionNumPercent = that.toPercent(res.data.data.integralDeductionNum);
          var balanceDeductionNumPercent = that.toPercent(res.data.data.balanceDeductionNum);
          that.setData({
            balance: res.data.data.balance,
            integral: res.data.data.integral,
            integralDeductionNum: res.data.data.integralDeductionNum,
            balanceDeductionNum: res.data.data.balanceDeductionNum,
            integralDeductionNumPercent: integralDeductionNumPercent,
            balanceDeductionNumPercent: balanceDeductionNumPercent
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
   * 确认支付
   */
  surePay: function(e) {
    var formId = e.detail.formId;
    if (this.data.isAgreement) {
      this.payTheBillInMiniUrl(formId);
    } else {
      util.toast("支付前，请同意并阅读左下角的用户协议");
    }
  },

  /**
   * 在小程序内进店商家支付：
   *    1.直接付款
   *    2.点餐付款【‘’】
   */
  payTheBillInMiniUrl: function (formId) {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.payMoney = this.data.payMoney;
    params.shopTitle = this.data.shopTitle;
    params.shopId = this.data.shopId;
    params.useBalanceFlag = this.data.useBalanceFlag;
    params.useIntegralFlag = this.data.useIntegralFlag;
    params.payIntegral = this.data.integralOfDeduction;
    params.payBalance = this.data.balanceOfDeduction;
    params.formId = formId;
    //合并 点餐订单的参数
    params = Object.assign(params, this.data.shopOrderParams);
    network.POST({
      params: params,
      requestUrl: requestUrl.payTheBillInMiniUrl,
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
      success: function(event) {
        wx.showToast({ //支付成功
          title: '支付成功',
          icon: 'success',
          duration: 2000,
          complete: function() { //支付成功后发送模板消息
            console.log("模板消息已发送");
            console.log("====================param.data===================");
            console.log(param.data);
            console.log("====================param.data.isLuckDrawFlag===================");
            console.log(param.data.isLuckDrawFlag);
            if (param.data.isLuckDrawFlag && param.data.isLuckDrawFlag=="true") {
              let wxOrderId = param.data.wxOrderId;
              wx.navigateTo({
                url: '/pages/shop/luckyDraw/luckyDraw?wxOrderId=' + wxOrderId
              });
            } else {
              wx.redirectTo({
                url: '../../my/shopOrder/shopOrder?chosseId=0'
              });
            }
          }
        });
      },
      fail: function(error) { //支付失败
        console.log("支付失败");
        console.log(error);
        wx.showModal({
          title: '提示',
          content: '支付被取消.',
          showCancel: false,
          complete: function () { //支付失败后发送模板消息
            console.log("模板消息已发送");
            wx.redirectTo({
              url: '../../my/shopOrder/shopOrder?chosseId=1'
            });
          }
        });
      },
      complete: function() { //不管支付成功或者失败之后都要处理的方法，类似与final
        wx.removeStorageSync('shopOrderParams');
        console.log("支付完成");
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var shopId = "";
    var shopTitle = "";
    var shopOrderParams = "";
    var payMoney = ""; 
    var finalPayment = ""; 
    var isDisabledPayMoney = false;
    //商家ID
    if (options.shopId) {
      shopId = options.shopId;
    }
    //商家名称
    if (options.shopTitle) {
      shopTitle = options.shopTitle;
      wx.setNavigationBarTitle({
        title: "向 " + shopTitle + " 商家付款买单"
      });
    }
    //商家点餐订单参数
    if (options.shopOrderParams) {
      shopOrderParams = options.shopOrderParams;
    } else {
      shopOrderParams = wx.getStorageSync('shopOrderParams');
    }
    //是否禁用 付款金额 输入框
    if (shopOrderParams) {
      shopOrderParams = JSON.parse(shopOrderParams);
      if (shopOrderParams) {
        isDisabledPayMoney = true;
      }
    }
    //在存在 商家点餐订单 的前提下，初始化 付款金额
    if (shopOrderParams) {
      var payMoney = shopOrderParams.allPayAmount;
      var finalPayment = payMoney;
    }
    this.setData({
      shopId: shopId,
      shopTitle: shopTitle,
      payMoney: payMoney,
      finalPayment: finalPayment,
      isDisabledPayMoney: isDisabledPayMoney,
      shopOrderParams: shopOrderParams
    });
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
    this.getUserBaseInfo();

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