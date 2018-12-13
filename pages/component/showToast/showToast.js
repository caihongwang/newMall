Component({
  externalClasses: ['my-class'],

  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },

  /**
 * 组件的属性列表
 * 用于组件自定义设置
 */


  properties: {
    // 弹窗标题
    inputToast: { // 属性名
      type: String,
      // 类型（必填），目前接受的类型包括：String, Number, Boolean,                     Object, Array, null（表示任意类型）
      value: '' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    // 弹窗内容
    time: {
      type: String,
      value: ''
    },
  },
  /**
 * 私有数据,组件的初始数据
 * 可用于模版渲染
 */
  data: {
    // 弹窗显示控制
    inputToast: '', //头部错误提示存放的信息
    // 定时器
    time: '',
  },
  /**
 * 组件的方法列表
 * 更新属性和数据的方法与更新页面数据的方法类似
 */
  methods: {
    /*
 * 公有方法
 */
    showToast: function (value) { //提示添加错误信息
      var that = this;
      wx.getSystemInfo({
        success: function (res) {
          let model = res.model.indexOf('iPhone');
          console.log(model);
          if (model == -1) {
            that.setData({
              inputToast: value,
            })
            setTimeout(function () {
              that.setData({
                inputToast: '',
              })
            }, 3000)
            return;
          } else {
            clearTimeout(that.data.time);
            var animation = wx.createAnimation({
              duration: 400,  //动画时长  
              timingFunction: "linear", //线性  
              delay: 0  //0则不延迟  
            });
            that.animation = animation;
            animation.translateY(-60).step();
            that.setData({
              animationData: animation.export(),
              inputToast: value,
            })
            setTimeout(function () {
              animation.translateY(0).step();
              that.setData({
                animationData: animation.export()
              })
            }.bind(that), 400)
            that.data.time = setTimeout(function () {
              var animation = wx.createAnimation({
                duration: 400,
                timingFunction: "linear",
                delay: 0
              })
              that.animation = animation;
              animation.translateY(-60).step()
              that.setData({
                animationData: animation.export(),
              })
              setTimeout(function () {
                animation.translateY(0).step()
                that.setData({
                  animationData: animation.export(),
                  inputToast: ''
                })
              }.bind(that), 400)
              that.setData({
                inputToast: ''
              })
            }, 3000)
          }
        }
      })

    },
   
  
    /*
 * 内部私有方法建议以下划线开头
 * triggerEvent 用于触发事件
 */
  
  }
})



