Component({
  options: {
    multipleSlots:true
  },

  //自定义组件的属性
  properties: {
    title: {
      type:String,
      value:'帮您一键快速导入好友名片'
    },
    subTitle: {
      type: String,
      value:'请输入您在名片全能王的账号及密码'
    },
    firstInputHolder: {
      type: String,
      value:'请输入账号'
    },
    secondInputHolder: {
      type: String,
      value:'请输入密码'
    },
    sureStatement: {
      type: String,
      value:'确认即同意'
    },
    statement: {
      type: String,
      value:'《免责声明》'
    },
    cancelButtonText: {
      type: String,
      value:'取消'
    },
    okButtonText: {
      type: String,
      value:'取消'
    }
  },
  /**
   * 私有数据，组件的初始数据，可用于模板渲染
   */
  data: {
    isShow: false,     //弹窗显示控制
    confirmStatus:false,   //第一个input,当为true的时候可以点击，并且颜色为绿色，当为false时，颜色为灰色
    confirmStatus1:false, //第二个input,当为true的时候可以点击，并且颜色为绿色，当为false时，颜色为灰色
    accountValue:null,   //账户
    passwordValue:null     //密码
  },
  /**
   * 组件的方法列表
   * 更新属性和收的方法与更新页面数据的方法类似
   */
  methods: {
    hideView() {
      this.setData({
        isShow:false
      })
    },
    showView() {
      this.setData({
        isShow: true
      })
    },


    /**
     * 内部私有方法建议以下划线开头
     * triggerEvent用于触发事件
     * 
     */
    _cancelShowEvent() {
      //触发消息回调
      this.triggerEvent('cancelShowEvent')
    },
    _statementsayEvent() {
      this.triggerEvent('statementsayEvent');
    },
    _confirmShowEvent() {
      //触发成功回调
      var obj = new Object();
      obj.confirmStatus = this.data.confirmStatus;
      obj.confirmStatus1 = this.data.confirmStatus1;
      obj.account =  this.data.accountValue;
      obj.password = this.data.passwordValue;
      this.triggerEvent('confirmShowEvent',obj)
    },
    firstInputListener(e) {
      if (e.detail.cursor != 0) {
        this.data.confirmStatus = true;
      }else {
        this.data.confirmStatus = false;
      }
      this.setData({
        confirmStatus:this.data.confirmStatus,
        accountValue:e.detail.value
      })
    },
    secondInputListener(e) {
      if (e.detail.cursor != 0) {
        this.data.confirmStatus1 = true;
      }else {
        this.data.confirmStatus1 = false;
      }
      this.setData({
        confirmStatus1:this.data.confirmStatus1,
        passwordValue:e.detail.value
      })
    }
  }


})