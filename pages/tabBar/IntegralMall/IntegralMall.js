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

    havePageAll: 0, //已经加载的页数
    pageindexAll: 10, //总共加载的总条数
    howProducts: 0, //共多少商品

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
    params.start = this.data.havePageAll;
    params.size = this.data.pageindexAll;
    network.POST({
      params: params,
      requestUrl: requestUrl.getProductListUrl,
      success: function(res) {
        console.log(res.data);
        if (res.data.code == 0) {
          for (var i in res.data.data){
            var item = res.data.data[i];
            var descript_bak = item.descript.length > 13 ? item.descript.substring(0, 13) + "..." : item.descript;
            item.descript_bak = descript_bak;
            that.data.productList.push(item);
          }
          that.setData({
            productList: that.data.productList,
            howProducts: res.data.recordsFiltered
          });
          that.data.havePageAll += res.data.data.length;
          console.log("that.data.havePageAll = " + that.data.havePageAll);
          if (that.data.havePageAll < res.data.recordsFiltered) {
            that.setData({
              isShowMore: true,
              loading: false,
              isNoShowMore: false,
            });
          } else {
            util.toast(res.data.message);
            that.setData({
              isShowMore: false,
              loading: false,
              isNoShowMore: true,
            });
          }
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
    console.log("e.currentTarget.dataset.producttypeitem = " + e.currentTarget.dataset.producttypeitem);
    this.setData({
      productTypeItem: e.currentTarget.dataset.producttypeitem,
      productTitle: "",
      productList: [],
      havePageAll: 0
    });
    // this.getProductTypeList();
    this.getProductList();
  },

  //点击跳转到详情页
  getProductDetail: function (e) {
    var productId = e.currentTarget.dataset.productid;
    console.log("productId = " + productId);
    wx.navigateTo({
      url: '../../IntegralMall/IntegralDetail/IntegralDetail?productId=' + productId
    });
  },

  //加载更多
  bindMore: function () {
    if (this.data.pageindexAll < this.data.howProducts) {
      this.setData({
        isShowMore: false,
        loading: true,
        isNoShowMore: false
      });
      this.getProductList();
    }
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
  onShow: function () {
    this.screenAD(); //插屏广告
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
    wx.showLoading({
      title: "客官请稍后...",
      mask: true
    });
    this.bindMore();
    wx.hideLoading(); //关闭进度条
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  screenAD: function () {
    // 在页面中定义插屏广告
    let interstitialAd = null;

    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-394246734e290c27'
      });
      interstitialAd.onLoad(() => { });
      interstitialAd.onError((err) => { });
      interstitialAd.onClose(() => { });
    }

    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      });
    }
  }
})