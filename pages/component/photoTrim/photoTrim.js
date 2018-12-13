
// 拖动时候的 pageX
var pageX = 0;
// 拖动时候的 pageY
var pageY = 0;

var pixelRatio = wx.getSystemInfoSync().pixelRatio / 2;

// 调整大小时候的 pageX
var sizeConfPageX = 0;
// 调整大小时候的 pageY
var sizeConfPageY = 0;

var initDragCutW = 0;
var initDragCutL = 0;
var initDragCutH = 0;
var initDragCutT = 0;

//出血
var PaddingBlank = 10;
var minCut = 50;

// 移动时 手势位移与 实际元素位移的比
var dragScaleP = 2;

Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    properties: {
      imageSrcShow:{
            type: String,
            value: ''
        },
        isShowImg:{
            type: Boolean,
            value: false
        },
        windowWidth:{
            type: Number,
            value: 375
        },
        windowHeight:{
            type: Number,
            value: 480
        }
    },
    data :{
        isShowImg: true,
        imageSrcShow:'',
        returnImage: '',
        // 初始化的宽高
        cropperInitW: 375,
        cropperInitH: 480,
        // 动态的宽高
        cropperW: 375,
        cropperH: 480,
        // 动态的left top值
        Left: 0,
        Top: 0,

        // 图片缩放值
        scaleP: 0,
        imageW: 0,
        imageH: 0,

        // 裁剪框 宽高
        // cutW: 400 / pixelRatio,
        // cutH: 600 / pixelRatio,
        cutW: 0,
        cutH: 0,
        cutL: PaddingBlank,
        cutT: PaddingBlank,
        isGoWrite: true,
        isSowClip: true //是否显示裁剪的框

    },
    methods: {
        init(data, callback, onChange) {
            this.onChange = onChange || function(){};
            this.getImageInfo(data, callback);
        },
        canvasIdErrorCallback: function (e) {
            console.error(e.detail.errMsg)
        },

        getImageInfo(data, callback){
            wx.showLoading({
                title: '图片加载中...',
                mask: true
            });
            console.log(data.imageSrcShow);
            wx.getImageInfo({
              src: data.imageSrcShow,
                success: (res) => {
                  console.log(data.imageSrcShow);

                    var _data = this.loadImageInfo(Object.assign(this.data, data, res));
                    callback(Object.assign(this.data, data, res));
                    wx.hideLoading();
                },
                fail: (error) => {
                    console.errot(error);
                    wx.hideLoading();
                }
            });
        },

        //初始化
        loadImageInfo(res, isSowClip) {
          if (isSowClip && isSowClip != undefined){
            this.setData({
              isSowClip: isSowClip
            })
          }
          console.log(res);
          console.log(this.data.windowWidth);
          var top = 0;
          var left = 0;
          if (res.isClip == 1){
            if (res.width >= this.data.windowWidth) {
              console.log(1);
              var carW = this.data.windowWidth;
              var carH = this.data.windowWidth / res.width * res.height;
              var top = (this.data.windowHeight - carH) / 2
              var left = 0;
            }
            if (res.height >= this.data.windowHeight) {
              console.log(2);

              var carH = this.data.windowHeight;
              var carW = this.data.windowHeight / res.height * res.width;
              var top = 0
              var left = (this.data.windowWidth - carW) / 2
            }
            if (res.height >= this.data.windowHeight && res.width >= this.data.windowWidth) {
              console.log(3);

              console.log(res.height / this.data.windowHeight)
              console.log(res.width / this.data.windowWidth)

              if (res.height / this.data.windowHeight > res.width / this.data.windowWidth) {
                console.log(4);

                var carH = this.data.windowHeight;
                var carW = this.data.windowHeight / res.height * res.width;
                var top = 0;
                var left = (this.data.windowWidth - carW) / 2;
              } else {
                console.log(5);
                var carW = this.data.windowHeight;
                var carH = this.data.windowWidth / res.width * res.Height;
                var top = (this.data.windowHeight - carH) / 2;
                var left = 0;
                console.log(carH);
                console.log(carW);
                console.log(top);
                console.log(left);
              }
            }
            if (res.height <= this.data.windowHeight && res.width <= this.data.windowWidth) {
              console.log(6);
             
              var carW = res.width;
              var carH = res.height
              var top = (this.data.windowHeight - res.height) / 2;
              var left = (this.data.windowWidth - res.width) / 2;
            } 
            this.setData({
              cutL: left,
              cutT: top,
              cutW: carW,
              cutH: carH
            })
            console.log(this.data.cutL);
            console.log(this.data.cutT);
            console.log(this.data.cutW);
            console.log(this.data.cutH);
        }else{
        
        }
         
      
         
          console.log(res);
            var innerAspectRadio = res.width / res.height;
            var _config = {};
  
            _config = {
                windowWidth : this.data.windowWidth,
                windowHeight: this.data.windowHeight,
                cropperInitW: res.width,
                cropperInitH: res.height,
                cropperW: this.data.windowWidth,
                cropperH: this.data.windowHeight,
                // 裁剪框宽高
                // cutW: (this.data.windowWidth - PaddingBlank * 2 - 100) / pixelRatio,
                // cutH: (this.data.windowHeight - PaddingBlank * 2 - 100) / pixelRatio,
                // cutW: (this.data.windowWidth - PaddingBlank * 2 ) / pixelRatio,
                // cutH: (this.data.windowHeight - PaddingBlank * 2 - 10) / pixelRatio,
                cutW: res.isClip == 1 ? carW :(this.data.windowWidth - PaddingBlank * 2 ) ,
                cutH: res.isClip == 1 ? carH : 205*pixelRatio,
                // 裁剪框初始位置
                cutT1: res.isClip == 1 ? top : 0,
                cutL1: res.isClip == 1 ? left : 0,
                cutL: res.isClip == 1 ? left :PaddingBlank, 
                cutT: res.isClip == 1 ? top :(this.data.windowHeight-205)/2,
                // 图片缩放值
                scaleP: this.data.windowWidth / res.width,
                // 图片原始宽度 rpx
                imageW: res.isClip == 1 ? carW :(res.width >= this.data.windowWidth ? this.data.windowWidth : res.width),
                imageH: res.isClip == 1 ? carH : (res.height >= this.data.windowHeight ? this.data.windowHeight : res.height),
            };
            // console.log(res.path);
            if (res.isClip == 0){
              _config.imageSrcShow = res.path;
            }else{
              _config.imageSrcShow = res.imageSrcShow;

            }
            console.log(_config.imageSrcShow);
            this.setData(_config);
            // this.fullCanvas(_config);
        },
        // 无用，待查
        fullCanvas(data){
            this.ctx = wx.createContext();
            this.ctx.drawImage(data.path, 0, 0, 100, 200);
            // this.ctx.drawImage(data.path, data.Left, data.Top, data.cropperW, data.cropperH);
            wx.drawCanvas({
                canvasId: data.canvasId,
                actions: this.ctx.getActions()
            });
        },
        
        /* 
            返回裁剪区域数据
        */
        getClippingRegion(){
          console.log(this.data.cutL);
          console.log(this.data.cutT);
          console.log(this.data.cutW);
          console.log(this.data.cutH);
            return {
                canvasId: 'myCanvas',
                x: parseInt(this.data.cutL),
                y: parseInt(this.data.cutT),
                width: parseInt(this.data.cutW),
                height: parseInt(this.data.cutH),
                destWidth: parseInt(this.data.cutW),
                destHeight: parseInt(this.data.cutH)
            }
        },

        // 拖动时候触发的touchStart事件
        contentStartMove(e) {
            pageX = e.touches[0].pageX
            pageY = e.touches[0].pageY
        },

        // 拖动时候触发的touchMove事件
        contentMoveing(e) {
            var dragLengthX = (pageX - e.touches[0].pageX) * dragScaleP;
            var dragLengthY = (pageY - e.touches[0].pageY) * dragScaleP;
            var minX = Math.max(this.data.cutL - (dragLengthX), PaddingBlank);
            var minY = Math.max(this.data.cutT - (dragLengthY), PaddingBlank);
            var maxX = this.data.cropperW - this.data.cutW - PaddingBlank;
            var maxY = this.data.cropperH - this.data.cutH - PaddingBlank;
            this.setData({
                cutL: Math.min(maxX, minX),
                cutT: Math.min(maxY, minY),
            })
            pageX = e.touches[0].pageX;
            pageY = e.touches[0].pageY;
        },

        // 设置大小的时候触发的touchStart事件
        dragStart(e) {
            sizeConfPageX = e.touches[0].pageX
            sizeConfPageY = e.touches[0].pageY
            initDragCutW = this.data.cutW
            initDragCutL = this.data.cutL
            initDragCutT = this.data.cutT
            initDragCutH = this.data.cutH
        },

        // 设置大小的时候触发的touchMove事件
        dragMove(e) {
            var dragType = e.target.dataset.drag;
            switch (dragType) {
                case 'right':
                    this._dragMoveRight(e);
                    break;
                case 'left':
                    this._dragMoveLeft(e);
                    break;
                case 'top':
                    this._dragMoveTop(e);
                    break;
                case 'bottom':
                    this._dragMoveBottom(e);
                    break;
                case 'rightBottom':
                    this._dragMoveRightBottom(e);
                    break;
                default:
                    break;
            }
        },

        dragEnd(e) {
            var data = this.getClippingRegion();
            this.onChange(data);
        },

        /* 顶部拖动 */
        _dragMoveTop(e) {
            var dragLength = (sizeConfPageY - e.touches[0].pageY) * dragScaleP;
            
            if (initDragCutH >= dragLength && initDragCutT > dragLength) {
                // bottom 方向的变化
                let _cutT = initDragCutT - dragLength;
                let _cutH = initDragCutH + dragLength;
                if (dragLength < 0 && Math.abs(dragLength) >= initDragCutH || _cutH < minCut) return
                this.setData({
                    cutT: _cutT,
                    cutH: _cutH
                })
            } else {
                return;
            }
        },

        /* 右边拖动 */
        _dragMoveRight(e) {
            var dragLength = (sizeConfPageX - e.touches[0].pageX) * dragScaleP
            if (initDragCutW >= dragLength) {
                // 如果 移动小于0 说明是在往下啦  放大裁剪的高度  这样一来 图片的高度  最大 等于 图片的top值加 当前图片的高度  否则就说明超出界限
                let _cutW = initDragCutW - dragLength;
                if (_cutW < minCut) {
                    _cutW = minCut;
                } else if (_cutW + this.data.cutL >= this.data.cropperW - PaddingBlank * 2) {
                    _cutW = this.data.cropperW - this.data.cutL - PaddingBlank * 2;
                }
                this.setData({
                    cutW: _cutW
                });
            } else {
                return
            }
        },

        /* 左边拖动 */
        _dragMoveLeft(e) {
            var dragLength = (sizeConfPageX - e.touches[0].pageX) * dragScaleP;
            if (initDragCutW >= dragLength && initDragCutL > dragLength) {
                let _cutL = initDragCutL - dragLength;
                let _cutW = initDragCutW + dragLength;
                if (dragLength < 0 && Math.abs(dragLength) >= initDragCutW || _cutW < 50) return
                this.setData({
                    cutL: _cutL,
                    cutW: _cutW
                })
            } else {
                return;
            }
        },

        /* 右边拖动 */
        _dragMoveBottom(e) {
            var dragLength = (sizeConfPageY - e.touches[0].pageY) * dragScaleP;
            // 必须是 dragLength 向上缩小的时候必须小于原本的高度
            if (initDragCutH >= dragLength) {

                let _cutH = initDragCutH - dragLength;
                if (_cutH < minCut) {
                    _cutH = minCut;
                } else if (_cutH + this.data.cutT >= this.data.cropperH - PaddingBlank * 2) {
                    _cutH = this.data.cropperH - this.data.cutT - PaddingBlank * 2;
                }
                this.setData({
                    cutH: _cutH
                });
            } else {
                return
            }
        },
 
        
        /* 右下角拖动 */
        _dragMoveRightBottom(e) {
            var dragLengthX = (sizeConfPageX - e.touches[0].pageX) * dragScaleP
            var dragLengthY = (sizeConfPageY - e.touches[0].pageY) * dragScaleP
            if (initDragCutH >= dragLengthY && initDragCutW >= dragLengthX) {
                // bottom 方向的变化
                let _cutH = initDragCutH - dragLengthY;
                if (_cutH < minCut){
                    _cutH = minCut;
                } else if (_cutH + this.data.cutT >= this.data.cropperH - PaddingBlank * 2) {
                    _cutH = this.data.cropperH - this.data.cutT - PaddingBlank * 2;
                }

                // right 方向的变化
                let _cutW = initDragCutW - dragLengthX;
                if (_cutW < minCut ){
                    _cutW = minCut;
                }else if (_cutW + this.data.cutL >= this.data.cropperW - PaddingBlank*2 ){
                    _cutW = this.data.cropperW - this.data.cutL - PaddingBlank * 2;
                }
                this.setData({
                    cutH: _cutH,
                    cutW: _cutW
                });
                return
            } else {
                return
            }
        }

    }
})
