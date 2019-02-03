//logs.js
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
const util = require('../../../utils/util.js')

var app = getApp();
Page({
  data: {
    isShowAuthorizationView: false, //判断授权弹窗是否展示

    isShowMore: false, //是的显示上拉加载更多提示，为true显示
    isNoShowMore: false, //显示加载更多
    loading: false, //加载中。。。false为隐藏      底部的分页加载

    havePageAll: 0, //已经加载的页数
    pageindexAll: 10, //总共加载的总条数

    orderSortType:"",
    selectSortTypeItem:0,
    isShowFilter: false, //是否展示筛选弹窗
    howShops: 0, //共多少家店铺
    filterList: {
      type: ['2', '3', '4', '5'],
      distance: ['1000', '200', '3000'],
      hot: ['100', '100', '100', '100']
    },
    // MOCKDATA
    sortTypeList: [{
      "dicCode": "shopDistance",
      "createTime": "2018-12-14 17:08:40",
      "orderSortTypeCode": "shopDistance",
      "updateTime": "2018-12-14 17:08:40",
      "orderSortTypeName": "最近距离",
      "id": "659004539",
      "dicName": "最近距离",
      "dicType": "orderSortType"
    }, {
      "dicCode": "shopOrderAmount",
      "createTime": "2018-12-14 17:08:40",
      "orderSortTypeCode": "shopOrderAmount",
      "updateTime": "2018-12-14 17:08:40",
        "orderSortTypeName": "销量优先",
      "id": "659004540",
        "dicName": "销量优先",
      "dicType": "orderSortType"
    }],
    shopList: [
    ]
  },
  onLoad: function(options) {
    
  },
  onShow: function (options) {
    var that = this;
    // 是否已经授权
    var authorization = wx.getStorageSync('USERINFO');
    console.log("authorization = " + authorization);
    console.log("isShowAuthorizationView = " + that.isShowAuthorizationView); 
    console.log("that.isNull(authorization) = " + that.isNull(authorization));
    if (that.isNull(authorization)) {
      wx.hideTabBar();
      that.setData({
        isShowAuthorizationView: true
      });
    } else {
      wx.showTabBar();
      that.getLocaltionAndData();
      that.setData({
        isShowAuthorizationView: false
      });
    }
  },

  onHide: function() {},
  // 点击返回地图
  backMap: function() {
    wx.switchTab({
      url: '/pages/cardFile/index/index'
    });
  },


  onReady: function() {
    //获得dialog组件
  },

  onPullDownRefresh: function() {},
  /**
   * 滑动触底时刷新
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
 * 获取位置信息和数据
 */
  getLocaltionAndData: function(){
    var that = this;
    //获取商家排序类型
    that.getSortTypeList();
    // 调用获取地理位置的api
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
        app.globalData.latitude = res.latitude;
        app.globalData.longitude = res.longitude;
        console.log('获取地理位置成功');
        //获取商家列表
        that.getShopList(false);
      },
      fail(res) {
        wx.showModal({
          title: '温馨提示',
          content: '小程序需要获取地理位置权限，点击确认前往设置或者退出程序？',
          showCancel: false,
          success: function () {
            that.openSetting();
          }
        });
      }
    });
  },
  /**
   * 获取排序类型
   */
  getSortTypeList: function() {
    var that = this;
    var params = new Object();
    params.dicType = "orderSortType";
    network.POST({
      params: params,
      requestUrl: requestUrl.getOrderSortTypeList,
      success: function(res) {
        console.log(res.data);
        if (res.data.code == 0) {
          console.log(res.data.data);
          that.setData({
            sortTypeList: res.data.data
          });
        } else {
          wx.hideLoading();
          util.toast("网络异常, 请稍后再试");
        }
      },
      fail: function(res) {
        wx.hideLoading();
        util.toast("网络异常, 请稍后再试");
      }
    });
  },
  /**
   * 排序商家列表
   */
  sortShopList: function(e) {
    var orderSortType = e.currentTarget.dataset.type;
    var selectSortTypeItem = e.currentTarget.dataset.selectsorttypeitem;
    this.setData({
      selectSortTypeItem: selectSortTypeItem,
      orderSortType: orderSortType,
      havePageAll: 0,
      pageindexAll: 10,
      shopList: []
    });
    this.getShopList(false);
  },
  /**
   * 获取商家列表
   */
  getShopList: function(boo) {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.shopStatus = 1;
    params.currentLon = app.globalData.longitude;
    params.currentLat = app.globalData.latitude;
    if (!that.isNull(that.data.orderSortType)) {
      params.orderSortType = that.data.orderSortType;
    } else { //默认按照距离进行排序
      params.orderSortType = "shopDistance";
    }
    params.dis = 1000;
    params.start = this.data.havePageAll;
    params.size = this.data.pageindexAll;
    if (!boo) {
      wx.showLoading({
        title: '加载中',
        mask: true
      });
    }
    network.POST({
      params: params,
      requestUrl: requestUrl.getShopByCondition,
      success: function(res) {
        console.log(res.data);
        boo ? wx.stopPullDownRefresh() : wx.hideLoading();
        if (res.data.code == 0) {
          for (var i in res.data.data) {
            var item = res.data.data[i];
            var shopTitle_bak = item.shopTitle.length > 11 ? item.shopTitle.substring(0, 11) + "..." : item.shopTitle;
            item.shopTitle_bak = shopTitle_bak;
            var shopDegist_bak = item.shopDegist.length > 53 ? item.shopDegist.substring(0, 53) + "..." : item.shopDegist;
            item.shopDegist_bak = shopDegist_bak;
            that.data.shopList.push(item);
          }
          console.log(res.data.data);
          that.setData({
            shopList: that.data.shopList,
            howShops: res.data.recordsFiltered
          })

          that.data.havePageAll += res.data.data.length;
          console.log("that.data.havePageAll = " + that.data.havePageAll);
          if (that.data.havePageAll < res.data.recordsFiltered) {
            that.setData({
              isShowMore: true,
              loading: false,
              isNoShowMore: false,
            });
          } else {
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
        boo ? wx.stopPullDownRefresh() : wx.hideLoading();
        util.toast("网络异常, 请稍后再试");
      }
    });
  },
  // 点击跳转商户详情
  goToShopDetail: function(e) {
    let index = e.currentTarget.dataset.index;
    let shopId = this.data.shopList[index].shopId;
    wx.navigateTo({
      url: '../../cardFile/shopInformation/shopInformation?shopId=' + shopId 
    });
  },
  bindMore: function() {
    if (this.data.pageindexAll < this.data.howShops) {
      this.setData({
        isShowMore: false,
        loading: true,
        isNoShowMore: false
      })
      this.getShopList(true);
    }
  },
  isNull: function(str) {
    return !str && str !== 0 && typeof str !== "boolean" ? true : false;
  },
  openSetting: function() { //打开设置
    var that = this;
    wx.openSetting({
      success: function(res) {
        console.log(res);
        if (res.authSetting["scope.userLocation"]) { //用户打开了用户信息授权
          wx.getLocation({
            type: 'wgs84',
            success(res) {
              that.setData({
                latitude: res.latitude,
                longitude: res.longitude
              })
              console.log('获取地理位置成功')
              // const speed = res.speed
              // const accuracy = res.accuracy
            }
          })

        } else { //用户没有打开用户信息授权
          that.showForceToast();
        }
      }
    })
  },

  getUpdateUser: function (userInfo) { //更新用户信息
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.userInfo = userInfo;
    network.POST({
      params: params,
      requestUrl: requestUrl.updateUserUrl,
      success: function (res) {
        console.log(res.data);
        if (res.data.code == 0) {
        } else {
        }
      },
      fail: function (res) {
  
      }
    });
  },
  // 点击确认授权,并将用户信息上传到服务器
  onGotUserInfo: function (e) {
    var that = this;
    var userInfo = e.detail.userInfo;
    console.log(e.detail.userInfo);
    // updateUser 更新用户信息
    this.getUpdateUser(JSON.stringify(e.detail.userInfo));



    wx.setStorageSync("USERINFO", userInfo);
    app.globalData.userInfo = userInfo;
    if (!that.isNull(userInfo)){
      //显示 下面 bar
      wx.showTabBar();
      that.setData({
        isShowAuthorizationView: false
      });
      that.getLocaltionAndData();
    } else {
      //显示 下面 bar
      wx.hideTabBar();
      that.setData({
        isShowAuthorizationView: true
      });
    }
  }
})