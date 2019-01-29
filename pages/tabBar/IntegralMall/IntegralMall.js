// pages/tabBar/IntegralMall/IntegralMall.js
//logs.js
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
const util = require('../../../utils/util.js')

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productTitle: "",
    productList: [],
    productTypeList: [],
    productTypeItem: 0 //当前选中商品类型的索引
  },

  //获取商品列表
  getProductList: function() {
    var that = this;
    console.log("this.data.productTypeItem = " + this.data.productTypeItem);
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    if (this.data.productTypeItem + "") {  //商品类型
      params.category = this.data.productTypeList[this.data.productTypeItem].categoryCode;
    }
    // params.category = this.data.productTypeList[this.data.productTypeItem].categoryCode;
    if (this.data.productTitle){    //商品名称
      params.title = this.data.productTitle;
    }
    network.POST({
      params: params,
      requestUrl: requestUrl.getProductListUrl,
      success: function(res) {
        console.log(res.data);
        if (res.data.code == 0) {
          for (var i in res.data.data){
            var item = res.data.data[i];
            var descript_bak = res.data.data[i].descript.length > 13 ? res.data.data[i].descript.substring(0, 13) + "..." : item.descript;
            res.data.data[i].descript_bak = descript_bak;
          }
          that.setData({
            productList: res.data.data
          });
        } else {

        }
      },
      fail: function(res) {
        util.toast("网络异常, 请稍后再试");
      }
    });
  },


  // 获取商品类型列表
  getProductTypeList: function(boo) {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.dicType = 'category';
    if (!boo) {
      wx.showLoading({
        title: '加载中',
        mask: true
      });
    }
    network.POST({
      params: params,
      requestUrl: requestUrl.getProductTypeListUrl,
      success: function(res) {
        console.log(res.data);
        boo ? wx.stopPullDownRefresh() : wx.hideLoading();
        if (res.data.code == 0) {
          that.setData({
            productTypeList: res.data.data
          });
          that.getProductList();
        } else {
          util.toast(res.data.message);
        }
      },
      fail: function(res) {
        boo ? wx.stopPullDownRefresh() : wx.hideLoading();
        util.toast("网络异常, 请稍后再试");
      }
    });
  },

  //绑定商品标题
  bindProductTitleFunc: function (e) {
    if (e.detail.value) {
      this.setData({
        productTitle: e.detail.value
      });
    }
  },

  //搜索商品
  searchProduct: function (e) {
    console.log("this.data.productTitle = " + this.data.productTitle);
    if (this.data.productTitle) {
      this.setData({
        productTypeItem: ""
      });
      this.getProductList();
    } else {
      util.toast("请您输入要搜索商品标题.");
    }
  },

  //选择点击商品类型查询商品
  selectProductType: function (e) {
    this.setData({
      productTypeItem: e.currentTarget.dataset.producttypeitem,
      productTitle: ""
    });
    this.getProductTypeList();
  },

  //点击跳转到详情页
  getProductDetail: function (e) {
    var productId = e.currentTarget.dataset.productid;
    console.log("productId = " + productId);
    wx.navigateTo({
      url: '../../IntegralMall/IntegralDetail/IntegralDetail?productId=' + productId
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
    this.getProductTypeList(false);
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