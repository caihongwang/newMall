Component({
  // options: {
  //   multipleSlots: true // 在组件定义时的选项中启用多slot支持
  // },
    properties: {
        title: {
            type: String,
            value: '创建团队'
        },
        placeHolderText: {
            type: String,
            value: '请输入你的团队名称'
        },
        bottomText: {
            type: String,
            value: '*团队名称创建后不可修改'
        },
        cancelButtonText: {
            type: String,
            value: '取消'
        },
        okButtonText: {
            type: String,
            value: '确定'
        },
        centerText: {
            type: String,
            value: '创建团队后，团长本人将以团队身份参赛，是否确认创建？'
        },
        isRemind: {
            type: Boolean,
            value: false
        }

    },
    data: {
        isShow: false,
        teamName: null,
    },
    methods: {
        hideView() {
            this.setData({
                isShow: false,
                teamName:null,
                isRemind: false
            });
        },
        showView() {
            this.setData({
                isShow: true,
                teamName:null,
                isRemind: false
            });
        },
        /**
         * 内部私有方法建议以下划线开头
         * triggerEvent用于触发事件
         */
        _cancelShowEvent() {
            console.log("取消");
            this.triggerEvent('cancelShowEvent');
        },
        _confirmShowEvent() {
            console.log("确定");
            var obj = new Object();
            obj.teamName =  this.data.teamName;
            obj.isRemind = this.data.isRemind;
            this.triggerEvent('confirmShowEvent',obj);
        },
        inputAction: function (e) {
            this.setData({
                teamName: e.detail.value
            });
        },
    }
})


