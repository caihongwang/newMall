var network = require('../../../utils/network.js');
var util = require('../../../utils/util.js');
var requestUrl = require('../../../config.js');
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    shopMenuList: [],
    activeIndex: 0,
    toView: 'a0',
    scrollTop: 100,
    screenWidth: 667,
    showModalStatus: false,
    currentType: 0,
    currentIndex: 0,
    sizeIndex: 0,
    sugarIndex: 0,
    temIndex: 0,
    sugar: ['常规糖', '无糖', '微糖', '半糖', '多糖'],
    tem: ['常规冰', '多冰', '少冰', '去冰', '温', '热'],
    size: ['常规', '珍珠', '西米露'],
    cartList: [],
    sumMonney: 0,
    cupNumber: 0,
    showCart: false,
    loading: false,

    shopId: 1,
    shopTitle: "",
    windowHeight: 800
  },

  /**
   * 获取菜单列表
   */
  getMenuList: function() {
    var that = this;
    wx.showLoading({
      title: '客官请稍后',
    });
    var params = {};
    params.shopId = this.data.shopId;
    network.POST({
      params: params,
      requestUrl: requestUrl.getMenuByConditionUrl,
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == 0) {
          var shopMenuList = [];
          var scrollBottom = 0;
          for (var i in res.data.data) {
            var item = res.data.data[i];
            var menuList = item.menuList;
            for (var j in menuList) {
              var menu = menuList[j];
              //食物名称
              var foodTitle_bak = menu.foodTitle.length > 13 ? menu.foodTitle.substring(0, 13) + "..." : menu.foodTitle;
              menuList[j].foodTitle_bak = foodTitle_bak;
              //食物简介
              if (menu.foodDegist) {
                var foodDegist_bak = menu.foodDegist.length > 42 ? menu.foodDegist.substring(0, 42) + "..." : menu.foodDegist;
                menuList[j].foodDegist_bak = foodDegist_bak;
              } else {
                menuList[j].foodDegist = "商家很懒，暂无描述信息.";
                menuList[j].foodDegist_bak = "商家很懒，暂无描述信息.";
              }
              //食物选项
              var foodOptions = [];
              if (menuList[j].foodOptions) {
                foodOptions = JSON.parse(menuList[j].foodOptions)
              }
              menuList[j].foodOptions = foodOptions;
            }
            if(i == 0){
              scrollBottom = 20 + (90 - 4) * menuList.length;
            } else {
              scrollBottom = scrollBottom + 20 + (90 - 4) * menuList.length;
            }
            item.scrollBottom = scrollBottom;
            shopMenuList.push(item);
          }
          if (shopMenuList.length == 0){
            wx.navigateBack({
              complete: function () {
                util.toast("商家很懒，尚未录入菜单，请选择直接付款吧.");
              }
            });
          } else {
            that.setData({
              shopMenuList: shopMenuList,
              loading: true
            });
          }
          
          console.log(shopMenuList);
        } else {
          util.toast(res.data.message);
        }
      },
      fail: function(res) {
        wx.hideLoading();
        util.toast("网络异常, 请稍后再试");
      }
    });
  },

  /**
   * 选择菜单类型
   */
  selectMenu: function(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      activeIndex: index,
      toView: 'a' + index
    });
    console.log("index = " + index + " , activeIndex = " + this.data.activeIndex + " , toView = " + this.data.toView);
  },

  /**
   * 滚动菜单列表
   */
  scroll: function(e) {
    console.log(e);
    var scrollTop = e.optionsDetail.scrollTop;
    console.log("scrollTop = " + scrollTop);
    var activeIndex = 0;
    for (var i in this.data.shopMenuList) {
      var item = this.data.shopMenuList[i];
      var menuScrollBottom = item.scrollBottom;
      if (scrollTop < menuScrollBottom) {
        activeIndex = i;
        console.log("scrollTop = " + scrollTop + " , menuScrollBottom = " + menuScrollBottom + " , item.foodTypeTitle = " + item.foodTypeTitle);
        break;
      }
    }
    if (activeIndex < 0){
      activeIndex = 0;
    }
    this.setData({
      activeIndex: activeIndex
    });

  },

  /**
   * 选择食物
   */
  selectFood: function (e) {
    console.log(e);
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    this.setData({
      currentType: type,      //食物类型坐标
      currentIndex: index,    //菜单坐标
      showModalStatus: !this.data.showModalStatus,
      sizeIndex: 0,
      sugarIndex: 0,
      temIndex: 0
    });
  },

  /**
   * 选择服务选项，比如口味，规格等
   */
  chooseOptions: function(e) {
    console.log(e);
    var typeIndex = e.currentTarget.dataset.typeindex;
    var menuIndex = e.currentTarget.dataset.menuindex; 
    var optionsIndex = e.currentTarget.dataset.optionsindex;
    var optionsListIndex = e.currentTarget.dataset.optionslistindex;
    for (var i in this.data.shopMenuList[typeIndex].menuList[menuIndex].foodOptions[optionsIndex].optionsList){
      var item = this.data.shopMenuList[typeIndex].menuList[menuIndex].foodOptions[optionsIndex].optionsList[i];
      item.selectedFlag = "false";
    }
    this.data.shopMenuList[typeIndex].menuList[menuIndex].foodOptions[optionsIndex].optionsList[optionsListIndex].selectedFlag = "true";
    console.log(this.data.shopMenuList[typeIndex].menuList[menuIndex].foodOptions);
    this.setData({
      shopMenuList: this.data.shopMenuList
    });
  },

  /**
   * 加入购物车
   */
  addToCart: function() {
    var a = this.data;
    //食物名称
    var foodTitle = a.shopMenuList[a.currentType].menuList[a.currentIndex].foodTitle;
    var foodTitle_bak = a.shopMenuList[a.currentType].menuList[a.currentIndex].foodTitle_bak;
    foodTitle = foodTitle.length > 13 ? foodTitle_bak : foodTitle;      //最多15个
    //食物价格
    var foodPrice = a.shopMenuList[a.currentType].menuList[a.currentIndex].foodPrice;
    //食物选项
    var optionsDetail = "无";
    var listLength = a.shopMenuList[a.currentType].menuList[a.currentIndex].foodOptions.length;
    console.log("listLength = " + listLength);
    if (listLength > 0){
      optionsDetail = "";
      for (var i in a.shopMenuList[a.currentType].menuList[a.currentIndex].foodOptions) {
        var optionsName = a.shopMenuList[a.currentType].menuList[a.currentIndex].foodOptions[i].optionsName;
        var optionsList = a.shopMenuList[a.currentType].menuList[a.currentIndex].foodOptions[i].optionsList;
        for (var j in optionsList) {
          var optionItem = optionsList[j];
          if (i == (listLength - 1)) {
            if (optionItem.selectedFlag == "true") {
              optionsDetail = optionsDetail + optionsName + ":" + optionItem.option;
            }
          } else {
            if (optionItem.selectedFlag == "true") {
              optionsDetail = optionsDetail + optionsName + ":" + optionItem.option + " + ";
            }
          }
        }
      }
    }
    var addItem = a.shopMenuList[a.currentType].menuList[a.currentIndex];
    addItem.number = 1;
    addItem.optionsDetail = optionsDetail;
    addItem.foodPriceSum = addItem.foodPrice;
    var sumMonney = (a.sumMonney - 0) + (foodPrice - 0);
    var cartList = this.data.cartList;
    cartList.push(addItem);
    this.setData({
      cartList: cartList,
      showModalStatus: false,
      sumMonney: sumMonney,
      cupNumber: a.cupNumber + 1
    });
  },

  /**
   * 展示购物车
   */
  showCartList: function() {
    console.log(this.data.showCart)
    if (this.data.cartList.length != 0) {
      this.setData({
        showCart: !this.data.showCart,
      });
    }
  },
  
  /**
   * 清空购物车
   */
  clearCartList: function() {
    this.setData({
      cartList: [],
      showCart: false,
      sumMonney: 0
    });
  },

  /**
   * 添加数量
   */
  addNumber: function(e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var cartList = this.data.cartList;
    cartList[index].number++;
    var sumMonney = (this.data.sumMonney - 0) + (cartList[index].foodPrice - 0);
    cartList[index].foodPriceSum = (cartList[index].foodPriceSum - 0) + (cartList[index].foodPrice - 0);
    this.setData({
      cartList: cartList,
      sumMonney: sumMonney,
      cupNumber: this.data.cupNumber + 1
    });
  },

  /**
   * 减少数量
   */
  decNumber: function(e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var cartList = this.data.cartList;
    var sumMonney = (this.data.sumMonney - 0) - (cartList[index].foodPrice - 0);
    cartList[index].foodPriceSum = (cartList[index].foodPriceSum - 0) - (cartList[index].foodPrice - 0);
    cartList[index].number == 1 ? cartList.splice(index, 1) : cartList[index].number--;
    this.setData({
      cartList: cartList,
      sumMonney: sumMonney,
      showCart: cartList.length == 0 ? false : true,
      cupNumber: this.data.cupNumber - 1
    });
  },

  /**
   * 进入订单详情
   */
  goShopOrderDetail: function() {
    if (this.data.sumMonney != 0) {
      wx.setStorageSync('cartList', this.data.cartList); 
      wx.setStorageSync('shopId', this.data.shopId);
      wx.setStorageSync('shopTitle', this.data.shopTitle);
      wx.setStorageSync('sumMonney', this.data.sumMonney);
      wx.setStorageSync('cupNumber', this.data.cupNumber);
      wx.navigateTo({
        url: '../shopOrderDetail/shopOrderDetail'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载 
   */
  onLoad: function (options) {
    var shopId = 1;
    var shopTitle = "测试";
    if (options.shopId) {
      shopId = options.shopId;
    }
    if (options.shopTitle) {
      shopTitle = options.shopTitle;
    }
    var windowHeight = wx.getSystemInfoSync().windowHeight;
    windowHeight = windowHeight - 55;
    console.log("windowHeight = " + windowHeight);
    this.setData({
      shopId: shopId, 
      shopTitle: shopTitle, 
      windowHeight: windowHeight
    });
    this.getMenuList();
  },

  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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