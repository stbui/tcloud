



define(["elementInfo"],function(_ei) {

	var elementDistribute = {
		/** 设置元素水平垂直居中
		 * @param  {[object]} $elm    [元素对象]
		 * @param  {[object]} $parent [父节点元素对象]
		 * @param  {[string]} $left   [元素left值]
		 * @param  {[object]} $top    [元素top值]
		 */
		setDistribute:function ($elm, $parent, $left, $top) {
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

		/** 选择分布方式--2种
		 * @param  {[string]} $str    [元素分布方式]
		 * @param  {[object]} $parent [父节点元素对象]
		 * @param  {[object]} $elmArr [对应的选中元素--可选]
		 */
		selectDistribute:function($parent, $str, $elmArr) {
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
				for(var i=0; i<tempArr.length; i++) {
					childArr.push(tempArr[i]);
				}*/
			}	
			switch($str) {
				case "distributeHorizontally": this.setDistributeHorizontally($parent, childArr);break;
				case "distributeVertically": this.setDistributeVertically($parent, childArr);break;
				default:break;
			}

			//调保存功能
			$(document).trigger("appSetCatch");
		},

		/** 水平分布方式
		 * @param  {[object]} $parent  [父节点元素对象]
		 * @param  {[array]}  childArr [子节点元素对象组]
		 */
		setDistributeHorizontally:function($parent, childArr) {
			//对象数组重新排序，并按照从左到右的顺序进行
			childArr = childArr.sort(function(a, b) {
				return parseFloat(a.style.left) - parseFloat(b.style.left);
			});
			//最左值，最右值，宽度总和，间距距离,最终传入的left变量值
			var leftMin = 0, leftMax = 0, widthSum = 0, widthSpace = 0, left = 0;

			leftMin = parseFloat(childArr[0].style.left)+parseFloat(childArr[0].style.width);
			leftMax = parseFloat(childArr[childArr.length-1].style.left);

			//排除两头，中间部分的全部元素
			for(var i=1; i<childArr.length-1; i++) {
				widthSum += parseFloat(childArr[i].style.width);
			}
			//宽度的间距距离值
			widthSpace = (leftMax - leftMin - widthSum) / (childArr.length-1);


			//元素重新添加--除两头的元素
			left = widthSpace + leftMin;
			for(var j=1; j<childArr.length-1; j++) {
				this.setDistribute(childArr[j], $parent, left, parseFloat(childArr[j].style.top));
				left += widthSpace + parseFloat(childArr[j].style.width);
			}
		},

		/** 垂直分布方式
		 * @param  {[object]} $parent  [父节点元素对象]
		 * @param  {[array]}  childArr [子节点元素对象组]
		 */
		setDistributeVertically:function($parent, childArr) {
			//对象数组重新排序，并按照从上到下的顺序进行
			childArr = childArr.sort(function(a, b) {
				return parseFloat(a.style.top) - parseFloat(b.style.top);
			});
			//最上值，最下值，高度总和，间距距离,最终传入的top变量值
			var topMin = 0, topMax = 0, heightSum = 0, heightSpace = 0, top = 0;

			topMin = parseFloat(childArr[0].style.top)+parseFloat(childArr[0].style.height);
			topMax = parseFloat(childArr[childArr.length-1].style.top);

			//排除两头，中间部分的全部元素
			for(var i=1; i<childArr.length-1; i++) {
				heightSum += parseFloat(childArr[i].style.height);
			}
			//高度的间距距离值
			heightSpace = (topMax - topMin - heightSum) / (childArr.length-1);
			//元素重新添加--除两头的元素
			top = heightSpace + topMin;
			for(var j=1; j<childArr.length-1; j++) {
				this.setDistribute(childArr[j], $parent, parseFloat(childArr[j].style.left), top);
				top += parseFloat(childArr[j].style.height)+heightSpace;
			}
		}

	}

	return elementDistribute;

});

