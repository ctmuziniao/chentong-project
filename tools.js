var tools = {
	/* 获取元素的样式
	 * @param  obj <DOM Object> 要获取样式的元素对象
	 * @param  attr <string>  要获取的属性名
	 * @return  <string>  样式的值
	 */
	getStyle : function (obj, attr) {
	// 	if(obj.currentStyle){
	// 		// IE
	// 		return obj.currentStyle[attr];
	// 	}else{
	// 		return getComputedStyle(obj, false)[attr];
	// 	}
		
		return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, false)[attr];
		
	// 	try{
	// 		return obj.currentStyle[attr];
	// 	}catch(){
	// 		return  getComputedStyle(obj, false)[attr];
	// 	}
	},
	
	/* 给元素设置样式
	 * obj <DOM Object> 要设置样式的元素
	 * attrObj <object> 设置的样式，如 {"width" : "200px", "height" : "300px"}
	 */
	setStyle : function(obj, attrObj){
		for(var key in attrObj){
			obj.style[key] = attrObj[key];
		}
	},
	
	/* 获取整个body的宽高
	 * @return <object> {width, height}
	 */
	getBody : function(){
		return {
			width : document.documentElement.clientWidth || document.body.clientWidth,
			height : document.documentElement.clientHeight || document.body.clientHeight
		}
	},
	
	/* 添加事件监听
	 * obj <DOM object>   添加监听的DOM对象
	 * type <string> 事件句柄（不带on）
	 * fn <function> 事件处理函数
	 * isCapture <boolean> 是否捕获，默认为false（IE8+有效）
	 */
	
	on: function (obj, type, fn, isCapture) {
		isCapture = isCapture || false;
		
		if(window.attachEvent){
			obj.attachEvent("on"+type, fn);
		}else{
			obj.addEventListener(type, fn, isCapture);
		}
		
	},
	
	/* 让元素匀速运动到指定终点
	 * obj  <DOM Object>  运动的DOM元素
	 * attr <string>  运动的属性名称
	 * end  <number>  运动的终点值
	 * time <number>  运动的耗时
	 */
	linearMove : function (obj, attr, end, time) {
		// 获取起点值
		var start = parseInt(this.getStyle(obj, attr));
		// 计算总距离
		var distance = end - start;
		// 计算速度
		// 计算运动的步数，以50ms为一步
		var steps = parseInt(time / 20);
		// 计算 px/步
		var speed = distance / steps;
		var timer = setInterval(function () {
			
			// 往前走一步
			start += speed;
			obj.style[attr] = start + "px";
			// 到终点的距离小于了一个速度的距离，那么就结束运动
			if(Math.abs(start - end) < Math.abs(speed)) {
				console.log(start , end);
				clearInterval(timer);
				// 有可能会超出一点，手动拉回来
				obj.style[attr] = end + "px";
			}
		},20);
		
	},
	
	/* 缓冲运动
	 * obj  <DOM Object>  运动的DOM元素
	 * attr <string>  运动的属性名称
	 * end  <number>  运动的终点值
	 */
	move : function (obj, attr, end) {
		//清除上一次的定时器
		clearInterval(obj.timer);
		//获取起点值
		var start = parseInt(this.getStyle(obj, attr));
		//开始运动
		obj.timer = setInterval(function(){
			//剩下的距离
			var distance = end - start;
			//速度（这一步走的距离）
			//正向靠近的时候速度0.9向上取值为1，负向靠近的时候速度-0.9向下取值为-1
			var speed = distance > 0 ? Math.ceil(distance / 10) : Math.floor(distance / 10);
			//修改start本身
			start += speed;
			obj.style[attr] = start + "px";
			//判断终点
			//由于最后10步是一像素的移动，所以一定相等
			if(start === end){
				clearInterval(obj.timer);
				
			}
		}, 20);
	},
	
	/* 让元素在窗口范围绝对居中
	 * obj  <DOM Object> 要居中的那个元素
	 */
	showCenter : function (obj){
		
		var _this = this;
		//计算坐标，让container绝对居中
		function center(){
			var _top = (_this.getBody().height - obj.offsetHeight) / 2;
			var _left = (_this.getBody().width - obj.offsetWidth) / 2;
			_this.setStyle(obj, {
				position : "absolute",
				top : _top + "px",
				left : _left + "px"
			})
		}
		center();
		// 窗口大小发生改变的时候重新计算坐标
		window.onresize = center;
	}
}
