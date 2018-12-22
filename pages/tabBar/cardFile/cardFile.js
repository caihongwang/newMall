//logs.js
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
const util = require('../../../utils/util.js')

var app = getApp();
Page({
  data: {
    isShowMore: false,//是的显示上拉加载更多提示，为true显示
    isNoShowMore: false,//显示加载更多
    loading: false,//加载中。。。false为隐藏      底部的分页加载
    
    havePageAllt: 0, //已经加载的页数
    pageindexAll: 10,//总共加载的总条数

    isShowFilter: false,//是否展示筛选弹窗
    howShops: 0,//共多少家店铺
    filterList:{
      type:['2','3','4','5'],
      distance:['1000','200','3000'],
      hot:['100','100','100','100']
  },
    // MOCKDATA
    sort:[
      {
        name: '分类',
        type: 1
      },
      {
        name: '距离',
        type: 2
      }, 
      {
        name: '热度',
        type: 3
      }
    ],
    list: [
      // {
      //   images: '/images/logo.png',
      //   imagesHead:'/images/home.png',
      //   name: '相约楼',
      //   hot:'521',
      //   distance: '1023.3km',
      //   wheelImages: ['/images/logo.png', '/images/logo.png', '/images/logo.png']
      // },
    ]
  },

getShopList:function(boo){
  var that = this;
  var params = new Object();
  params.uid = wx.getStorageSync("UIDKEY");
  params.shopStatus = 1;
  params.currentLon = app.globalData.latitude ;
  params.currentLat = app.globalData.longitude;
  params.dis = 1000;
  params.start = this.data.havePageAllt;
  params.size = this.data.pageindexAll;
  if (!boo) {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
  }
  network.POST(
    {
      params: params,
      requestUrl: requestUrl.getSimpleShopByCondition,
      success: function (res) {
        console.log(res.data);
        
        boo ? wx.stopPullDownRefresh() : wx.hideLoading();
        if (res.data.code == 0) {
          console.log(res.data.data)
          // that.data.list.push(res.data.data);
          for (var i in res.data.data) {
        
            that.data.list.push(res.data.data[i]);
          }
          that.setData({
            list: that.data.list,
            howShops:res.data.recordsFiltered
          })

          that.data.havePageAllt += res.data.data.length;
          if (that.data.havePageAllt < res.data.recordsFiltered ) {
            that.setData({
              isShowMore: true,
              loading: false,
              isNoShowMore: false,
            })
          } else {
            that.setData({
              isShowMore: false,
              loading: false,
              isNoShowMore: true,
            })
          }
          } else {
      
          }
      
      },
      fail: function (res) {
        boo ? wx.stopPullDownRefresh() : wx.hideLoading();
        util.toast("网络异常, 请稍后再试");
      }
    });

},

  onLoad: function (options) {
  },
  onShow: function (res) {
    this.getShopList(false);
  },

  onHide: function () {
  },
  // 点击返回地图
  backMap: function(){
    wx.switchTab({
      url: '/pages/tabBar/index/index'
    });
  },
//  调用排序列表接口
  clickSort:function(e){
    var type = e.currentTarget.dataset.type;

  },


  // 点击跳转商户详情
  goToDetail: function(e){
    var shopInformation = encodeURIComponent(JSON.stringify(e.currentTarget.dataset.cardinfo));
      wx.navigateTo({
        url: '../../cardFile/shopInformation/shopInformation?shopInformation=' + shopInformation
      });
    
  },
  

  bindMore: function () {
    console.log(123123);
    if (this.data.pageindexAll < this.data.howShops) {
      this.setData({
        loading: true,
        isShowMore: false,
        isNoShowMore: false
      })
      this.getShopList(true);
    }
  },
  onReady: function () {
    //获得dialog组件
  },

  onPullDownRefresh: function () {
  },

  onReachBottom: function () {
    this.bindMore();
  },

})
