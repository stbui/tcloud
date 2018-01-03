


define(["elementInfo"],function(_ei) {

	var elementAlign = {
		/** 设置元素水平垂直居中
		 * @param  {[object]} $elm    [元素对象]
		 * @param  {[object]} $parent [父节点元素对象]
		 * @param  {[string]} $left   [元素left值]
		 * @param  {[object]} $top    [元素top值]
		 */
		setAlign:function ($elm, $parent, $left, $top) {
			//传入的值---必须是带百分号的字符串或者是number类型（表示px）
			_ei.setNewPosition({
				element:$($elm),
				parent:$parent,
				width:$elm.style.width,
				height:$elm.style.height,
				left:$left || $elm.style.left,
				top:$top || $elm.style.top,
				isDrag:true
			});
		},

		/** 选择对齐方式--6种
		 * @param  {[string]} $str    [元素对齐方式]
		 * @param  {[object]} $parent [父节点元素对象]
		 * @param  {[object]} $elmArr [对应的选中元素--可选]
		 */
		selectAlign:function($parent, $str, $elmArr) {
			//判别是在组内还是非组内
			var childArr = [];		//对应的要进行对齐的元素组			
			if($elmArr == null) 
				childArr = $parent.children(".wqdelementEditBox").children(".wqdelementEdit");
			if($elmArr != null && $elmArr.length != 0) {
				$parent = $elmArr[0].elem.parent();
				
				//添加进群组的元素
				for(var j=0; j<$elmArr.length; j++) {
					childArr.push($elmArr[j].elem[0]);
				}
				//群组元素组
				/*var tempArr = $parent.children(".wqdGroupmove");
				console.log(tempArr.length);
				for(var i=0; i<tempArr.length; i++) {
					childArr.push(tempArr[i]);
				}*/
			}	
			switch($str) {
				case "alignLeft": this.setAlignLeft($parent, childArr);break;
				case "alignCenter": this.setAlignCenter($parent, childArr);break;
				case "alignRight": this.setAlignRight($parent, childArr);break;
				case "alignTop": this.setAlignTop($parent, childArr);break;
				case "alignMiddle": this.setAlignMiddle($parent, childArr);break;
				case "alignBottom": this.setAlignBottom($parent, childArr);break;
				default:break;
			}

			//调保存功能
			$(document).trigger("appSetCatch");
		},

		/** 左对齐方式
		 * @param  {[object]} $parent  [父节点元素对象]
		 * @param  {[array]}  childArr [子节点元素对象组]
		 */
		setAlignLeft:function($parent, childArr) {
			var left = childArr[0].style.left;
			for(var i=0; i<childArr.length; i++) {
				if(parseFloat(left) > parseFloat(childArr[i].style.left)) {
					left = childArr[i].style.left;
				}
			}
			//元素重新添加
			for(var j=0; j<childArr.length; j++) {
				this.setAlign(childArr[j], $parent, parseFloat(left), parseFloat(childArr[j].style.top));
			}
		},

		/** 水平对齐方式
		 * @param  {[object]} $parent  [父节点元素对象]
		 * @param  {[array]}  childArr [子节点元素对象组]
		 */
		setAlignCenter:function($parent, childArr) {
			var area = this.getAreaWH(childArr);
			var parentWidth = area.width;//$parent.width();

			//元素重新添加
			for(var j=0; j<childArr.length; j++) {
				this.setAlign(childArr[j], $parent, Math.round(area.left + (parentWidth - $(childArr[j]).width()) / 2), parseFloat(childArr[j].style.top));
			}
		},

		/** 右对齐方式
		 * @param  {[object]} $parent  [父节点元素对象]
		 * @param  {[array]}  childArr [子节点元素对象组]
		 */
		setAlignRight:function($parent, childArr) {
			var right = 0, temp = 0;
			for(var i=0; i<childArr.length; i++) {
				temp = parseFloat(childArr[i].style.left)+parseFloat(childArr[i].style.width);
				if(parseFloat(right) < temp) {
					right = temp;
				}
			}

			//元素重新添加
			for(var j=0; j<childArr.length; j++) {
				this.setAlign(childArr[j], $parent, (parseFloat(right) - parseFloat(childArr[j].style.width)), parseFloat(childArr[j].style.top));
			}
		},

		/** 上对齐方式
		 * @param  {[object]} $parent  [父节点元素对象]
		 * @param  {[array]}  childArr [子节点元素对象组]
		 */
		setAlignTop:function($parent, childArr) {

			var top = childArr[0].style.top;
			for(var i=0; i<childArr.length; i++) {
				if(parseFloat(top) > parseFloat(childArr[i].style.top)) {
					top = childArr[i].style.top;
				}
			}

			//元素重新添加
			for(var j=0; j<childArr.length; j++) {
				this.setAlign(childArr[j], $parent, parseFloat(childArr[j].style.left), parseFloat(top));
			}
		},

		/** 垂直对齐方式
		 * @param  {[object]} $parent  [父节点元素对象]
		 * @param  {[array]}  childArr [子节点元素对象组]
		 */
		setAlignMiddle:function($parent, childArr) {
			var area = this.getAreaWH(childArr);
			var parentHeight = area.height;//$parent.height();
			
			//元素重新添加
			for(var j=0; j<childArr.length; j++) {
				this.setAlign(childArr[j], $parent, parseFloat(childArr[j].style.left), Math.round(area.top + (parentHeight - $(childArr[j]).height()) / 2));
			}
		},

		/** 下对齐方式
		 * @param  {[object]} $parent  [父节点元素对象]
		 * @param  {[array]}  childArr [子节点元素对象组]
		 */
		setAlignBottom:function($parent, childArr) {
			var bottom = 0, temp = 0;
			for(var i=0; i<childArr.length; i++) {
				temp = Math.round(parseFloat(childArr[i].style.top)+parseFloat(childArr[i].style.height));
				if(parseFloat(bottom) < temp) {
					bottom = temp;
				}
			}
			//元素重新添加
			for(var j=0; j<childArr.length; j++) {
				this.setAlign(childArr[j], $parent, parseFloat(childArr[j].style.left), (parseFloat(bottom) - parseFloat(childArr[j].style.height)));
			}
		},

		/** 给出这些元素所在区域的宽高
		 * @param  {[array]}  $arr [子节点元素对象组]
		 * return  {[object]} area [区域的宽高值]
		 */
		getAreaWH:function($arr) {
			var area = {
				width:0,
				height:0,
				left:0,
				top:0
			};

			var tempLeft = parseFloat($arr[0].style.left),
				tempTop = parseFloat($arr[0].style.top),
				tempRight = parseFloat($arr[0].style.width)+parseFloat($arr[0].style.left),
				tempBottom = parseFloat($arr[0].style.height)+parseFloat($arr[0].style.top),
				tempL = 0, tempT = 0, tempR = 0, tempB = 0;

			for(var i=0; i<$arr.length; i++) {
				tempL = parseFloat($arr[i].style.left);
				tempT = parseFloat($arr[i].style.top);
				tempR = parseFloat($arr[i].style.width)+parseFloat($arr[i].style.left);
				tempB = parseFloat($arr[i].style.height)+parseFloat($arr[i].style.top);

				if(tempLeft > tempL) tempLeft = tempL;
				if(tempTop > tempT) tempTop = tempT;
				if(tempRight < tempR) tempRight = tempR;
				if(tempBottom < tempB) tempBottom = tempB;
			}

			area.width = tempRight - tempLeft;
			area.height = tempBottom - tempTop;
			area.left = tempLeft;
			area.top = tempTop;

			return area;
		}

	}

	return elementAlign;

});

