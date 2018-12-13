// pages/cardFile/query/query.js
var util = require('../../../utils/util.js');
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchList:[],
    // data: [ //搜索之后的结果列表

    // ],
    canSearch:false,//搜索按钮能不能点击
    searchValue:'',//搜索框内容
    ifHaveSearchCard: false,//搜索之后有数据
    ifNoSearchCard: false,// 搜索之后是没有数据
    cardList:[],
    haveSearch:[],//存放已经搜索的数据
    // haveSearchList: [],//存放已经搜索的数据
    ifLatelySearch:false,//搜索记录是否显示
    noLatelySearch:false,//暂无搜索记录的提示
    isFocus:true,//是否自动聚焦
    isShowDelete:false//是否展示输入框后面的清楚按钮
  },
  getSearchCard:function(id){
    var that = this;
    this.data.cardList = [];
    var params = new Object();
    params.receiveUid = id;
    console.log(this.data.searchValue);
    params.searchString = this.data.searchValue;
    console.log(params);
    network.POST({
      params: params,
      requestUrl: requestUrl.searchCardUrl,
      success: function (res) {
        wx.hideLoading();
        if(res.data.code == 0){
          if (res.data.data.length == 0){
            that.setData({
              noLatelySearch: false,
              ifNoSearchCard: true,
              ifHaveSearchCard:false,
              isFocus:false
              // searchValue: ''
            });
            return;
          }
          that.setData({
            ifHaveSearchCard: true,
            noLatelySearch: false,
            ifNoSearchCard: false,
          })
          for (var i in res.data.data) {
            that.data.cardList.push(res.data.data[i]);
          }
          that.setData({
            cardList: that.data.cardList
          })
          console.log(that.data.cardList);
        }else{
          util.toast(res.data.message);
        }
      },
      fail: function () {
        wx.hideLoading();
        util.toast('网络异常，请稍后再试');
      }
    })
  },
  sureSearch:function(){
    if (!this.data.searchValue || this.data.searchValue.length <=0) {
      util.toast("请输入要搜索的内容");
      return;
    }
    var search = {};
    search.name = this.data.searchValue
    var haveSearch = false;
    for (var i in this.data.haveSearch){
      if (this.data.haveSearch[i].name == search.name ){
        haveSearch = true;
       }
    }
    if (haveSearch == false){
      this.data.haveSearch.unshift(search);
    }
    console.log(this.data.haveSearch.length);
    var arr = [];
     arr = this.data.haveSearch.slice(0,6);
    if (this.data.haveSearch.length > 6){
      arr = this.data.haveSearch.slice(0,6);
    }else{
      arr = this.data.haveSearch;
    }
    this.setData({
      haveSearch: arr
    })
    var searchList = JSON.stringify(this.data.haveSearch)
    console.log(this.data.haveSearch);
    wx.setStorageSync("haveSearch", searchList);
    this.setData({
      noLatelySearch: false,
      ifLatelySearch: false,
    })
    wx.showLoading({
      title: "搜索中",
      mask: true
    })
    if (app.globalData.uid) {    //这里用来请求用户数据
      this.getSearchCard(app.globalData.uid);
    } else {   //这里用来处理异步请求数据过来后的处理
      app.userInfoReadyCallBack = res => {
        // console.log('callback执行');
        this.getSearchCard(res);
      }
    }
  },
  deleteSearch:function(e){
    console.log(e);
    this.setData({
      searchValue:'',
      isShowDelete:false,
      isFocus:true,
    })

  },
  trim: function (str) {  //过滤前后空格
    str = str.replace(/^(\s|\u00A0)+/, '');
    for (var i = str.length - 1; i >= 0; i--) {
      if (/\S/.test(str.charAt(i))) {
        str = str.substring(0, i + 1);
        break;
      }
    }
    return str;
  },
  focus: function (e) {  //键盘输入时的input
    // if (e.detail.value == ''){
    //   this.setData({
    //     ifLatelySearch: false,
    //     canSearch: false,
    //     noLatelySearch: false
    //     // noLatelySearch:true,
    //   })
    //   return;
    //  }else{
    //     this.setData({
    //       canSearch: true,
    //     });
    // };
    // this.setData({
    //   haveSearchList: [],
    //   haveSearch:[]
    // })
    var value = e.detail.value;
    console.log(value);
   value = this.trim(value);
    if (value == ''){
      this.setData({
          canSearch: false,
          isShowDelete:false
          // ifLatelySearch:true
      });
    }else{
      this.setData({
        canSearch: true,
        isShowDelete: true
        // ifLatelySearch: false
      });
    }
    this.setData({
      searchValue: e.detail.value//将input至与data中的inputValue绑定
    });
   
    // try {
    //   var value = wx.getStorageSync('haveSearch');
    //   console.log(value);
    //   if (value) {
    //     this.setData({
    //       noLatelySearch: false,
    //     })
    //     this.data.haveSearch = JSON.parse(value);
    //     console.log(this.data.haveSearch);
    //     var haveSeach = false;
    //     for (var i in this.data.haveSearch) {
    //       if (this.data.haveSearch[i].name.indexOf(this.data.searchValue) >= 0 ) {
    //         this.data.haveSearchList.push(this.data.haveSearch[i]);
    //         haveSeach = true;
    //     }
    //     }
    //     if (haveSeach == true){
    //        this.setData({
    //           ifLatelySearch: true,
    //           noLatelySearch: false
    //         })
    //     }else{
    //       this.setData({
    //         ifLatelySearch: false,
    //         noLatelySearch: true
    //       })
    //     }
    //     this.setData({
    //       haveSearchList: this.data.haveSearchList,
    //       haveSearch: this.data.haveSearch
    //     })
    //     console.log(this.data.haveSearchList);
    //   }else{
    //     this.setData({
    //       noLatelySearch: true,
    //     })
    //   }
    // } catch (e) {  
    //   // Do something when catch error
    // }
  },

  //选择之前的记录搜索

  chosseSearch:function(e){
    // console.log(e.currentTarget.dataset.value);
    this.setData({
      searchValue: e.currentTarget.dataset.value,
      canSearch:true,
      isFocus:true,
      isShowDelete:true,
    })

  },
//点击删除某一条搜索记录
  deleteList:function(e){
    var index = e.currentTarget.dataset.index;
    this.data.haveSearch.splice(index,1);
    this.setData({
      haveSearch: this.data.haveSearch,
      isFocus:false
    })
    console.log(this.data.haveSearch.length);
    if (this.data.haveSearch.length == 0){
      this.setData({
        ifLatelySearch:false,
        noLatelySearch:true,
      })
    }
    var searchList = JSON.stringify(this.data.haveSearch);
    wx.setStorageSync("haveSearch", searchList);

    // try {
    //   var value = wx.getStorageSync('haveSearch');
    //   if (value) {
    //     this.data.haveSearch = JSON.parse(value);
    //     for (var i in this.data.haveSearch) {
    //       if (this.data.haveSearch[i].name == this.data.haveSearchList[index].name) {
    //         console.log(111);
    //         console.log(this.data.haveSearchList);
    //         this.data.haveSearch.splice(i,1);
    //         this.data.haveSearchList.splice(index,1);
    //         console.log(this.data.haveSearchList);
    //         this.setData({
    //           haveSearch: this.data.haveSearch,
    //           haveSearchList: this.data.haveSearchList,
    //         })
    //         if (this.data.haveSearchList.length == 0){
    //           this.setData({
    //             ifLatelySearch: false,
    //             noLatelySearch:true,
    //           })        
    //         }
    //       }
    //     }    
    //     console.log(this.data.haveSearchList);
    //   } 
    // } catch (e) {
    //   // Do something when catch error
    // }
    // var searchList = JSON.stringify(this.data.haveSearch);
    // wx.setStorageSync("haveSearch", searchList);
  },

  //清空所有搜索记录
  deleteAllSearch:function(){
    var searchList = '';
    wx.setStorageSync("haveSearch", searchList);
    this.setData({
      ifLatelySearch:false,
      noLatelySearch:true,
      haveSearch:[],
      isFocus: false
    })
    // if (this.data.searchValue != ''){
    //   this.setData({
    //     isFocus:true
    //   })
    // }
  },
  // search:function(){
  //   var len = 0;
  //   var arr = [];
  //   for (var i in this.data.cardList) {
  //     len += this.data.cardList[i].length;
  //     console.log(this.data.cardList[i]);
  //     for (var j in this.data.cardList[i].values) {
  //       console.log(this.data.cardList[i].values[j]);
  //       //如果字符串中不包含目标字符会返回-1
  //       if (this.data.cardList[i].values[j].cardName.indexOf(this.data.searchValue) >= 0 || this.data.cardList[i].values[j].cardCompany.indexOf(this.data.searchValue) >= 0 ) {
  //         arr.push(this.data.cardList[i].values[j]);
  //       }
  //     }
  //   }
  //   var haveSearch = JSON.stringify(arr);
  //   wx.setStorageSync("haveSearch", haveSearch);
  // },
  goToDetail: function (e) {   //点击进入详情页
    console.log(e.currentTarget.dataset.cardinfo);
    var cardInfo = encodeURIComponent(JSON.stringify(e.currentTarget.dataset.cardinfo));
    wx.navigateTo({
      url: '../../cardFile/cardDetail/cardDetail?cardInfo=' + cardInfo
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   try {
     console.log(111);
      var value = JSON.parse(wx.getStorageSync('haveSearch'));
      console.log(value.length);
      if (value.length != 0) {
        this.data.haveSearch = value;
        this.setData({
          haveSearch: this.data.haveSearch,
          ifLatelySearch:true,
        })
      }else{
        this.setData({
          ifLatelySearch:false,
          noLatelySearch:true
        })
      } 
    } catch (e) {
     this.setData({
       ifLatelySearch: false,
       noLatelySearch: true
     })
    }
    console.log('onload');
    var searchList = JSON.stringify(this.data.haveSearch);
    wx.setStorageSync("haveSearch", searchList);
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