//index.js
//获取应用实例
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
const util = require('../../../utils/util.js')


const app = getApp()

//计数器
var interval = null;

//值越大旋转时间越长  即旋转速度
var intime = 50;

Page({
  data: {
    color: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    //9张奖品图片
    images: ['/images/item.png', '/images/item1.png', '/images/item.png', '/images/item1.png', '/images/item.png', '/images/item1.png', '/images/item.png', '/images/item1.png', '/images/item.png'],
    btnconfirm: '/images/dianjichoujiang.png',
    clickLuck:'clickLuck',
    luckPosition:0, //幸运的位置
  },

  onLoad:function(options){
    if (options.wxOrderId){
      this.setData({
        wxOrderId: options.wxOrderId
      })
    }
    this.loadAnimation();
  },

  // input:function(e){
  //   var data = e.detail.value;
  //     this.setData({
  //       luckPosition: data
  //     })
  // },


  getLuckDrawUrl: function () { //点击抽奖按钮获取列表
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.wxOrderId = this.data.wxOrderId;
    network.POST({
      params: params,
      requestUrl: requestUrl.getLuckDrawUrl,
      success: function (res) {
        console.log(res.data);
        if (res.data.code == 0) {
          util.toast(res.data.message);
          that.setData({
            luckDrawCode: res.data.data.luckDrawCode
          });
          return;
              //判断中奖位置格式
          if (that.data.luckPosition == null || isNaN(that.data.luckPosition) || that.data.luckPosition > 7) {
            wx.showModal({
              title: '提示',
              content: '请填写正确数值',
              showCancel: false,
            })
            return;
          }
          //设置按钮不可点击
          that.setData({
            btnconfirm: '/images/dianjichoujiangd.png',
            clickLuck: '',
          })
          //清空计时器
          clearInterval(interval);
          var index = 0;
          console.log(that.data.color[0]);
          //循环设置每一项的透明度
          interval = setInterval(function () {
            if (index > 7) {
              index = 0;
              that.data.color[7] = 0.5
            } else if (index != 0) {
              that.data.color[index - 1] = 0.5
            }
            that.data.color[index] = 1
            that.setData({
              color: that.data.color,
            })
            index++;
          }, intime);

          //模拟网络请求时间  设为两秒
          var stoptime = 2000;
          setTimeout(function () {
            that.stop(that.data.luckPosition);
          }, stoptime)

        } else if (res.data.code == 200008) {      //您已抽过奖。如想再次抽奖，请再交易一笔订单.
          that.setData({
            luckDrawCode: res.data.data.luckDrawCode
          });
          util.toast(res.data.message);
        } else {
          wx.hideLoading();
          util.toast(res.message);
        }
      },
      fail: function (res) {
        wx.hideLoading();
        util.toast("网络异常, 请稍后再试");
      }
    });
  },
  //点击抽奖按钮
  clickLuck:function(){
    var that= this;
    that.getLuckDrawUrl();
  },

  //也可以写成点击按钮停止抽奖
  // clickStop:function(){
  //   var stoptime = 2000;
  //   setTimeout(function () {
  //     e.stop(1);
  //   }, stoptime)
  // },

  stop: function (which){
    var e = this;
    //清空计数器
    clearInterval(interval);
    //初始化当前位置
    var current = -1;
    var color = e.data.color;
    for (var i = 0; i < color.length; i++) {
      if (color[i] == 1) {
        current = i;
      }
    }
    //下标从1开始
    var index = current + 1;

    e.stopLuck(which, index, intime, 10);
  },


/**
 * which:中奖位置
 * index:当前位置
 * time：时间标记
 * splittime：每次增加的时间 值越大减速越快
 */
  stopLuck: function (which, index,time,splittime){
    var e = this;
    //值越大出现中奖结果后减速时间越长
    var color = e.data.color;
    setTimeout(function () {
      //重置前一个位置
      if (index > 7) {
        index = 0;
        color[7] = 0.5
      } else if (index != 0) {
        color[index - 1] = 0.5
      }
      //当前位置为选中状态
      color[index] = 1
      e.setData({
        color: color,
      })
          //如果旋转时间过短或者当前位置不等于中奖位置则递归执行
          //直到旋转至中奖位置
        if (time < 400 || index != which){
          //越来越慢
          splittime++;
          time += splittime;
          //当前位置+1
          index++;
          e.stopLuck(which, index, time, splittime);
        }else{
        //1秒后显示弹窗
          setTimeout(function () {
        if (which == 1 || which == 3 || which == 5 || which == 7) {
            //中奖
            wx.showModal({
              title: '提示',
              content: '恭喜中奖',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  //设置按钮可以点击
                  e.setData({
                    btnconfirm: '/images/dianjichoujiang.png',
                    clickLuck: 'clickLuck',
                  })
                  e.loadAnimation();
                }
              }
            })
          } else {
            //中奖
            wx.showModal({
             title: '提示',
              content: '很遗憾未中奖',
              showCancel: false,
              success:function(res){
                if(res.confirm){
                  //设置按钮可以点击
                  e.setData({
                    btnconfirm: '/images/dianjichoujiang.png',
                    clickLuck: 'clickLuck',
                  })
                  e.loadAnimation();
                }
              }
            })
          }
          }, 1000);
        }
    }, time);
    console.log(time);
  },
  //进入页面时缓慢切换
 loadAnimation:function (){
  var e = this;
  var index = 0;
  // if (interval == null){
  interval = setInterval(function () {
    if (index > 7) {
      index = 0;
      e.data.color[7] = 0.5
    } else if (index != 0) {
      e.data.color[index - 1] = 0.5
    }
    e.data.color[index] = 1
    e.setData({
      color: e.data.color,
    })
    index++;
  }, 1000);
  // }  
}
})
