$(function(){
	$(document).on("mouseenter",".un-category-list li>a",function(){
		var $obj = $(this);
		var $wcol = $obj.parent().attr("editcatecheckcolor");
		$obj.css("color",$wcol);
		$obj.find("i").css("color",$wcol);
	});
	$(document).on("mouseleave",".un-category-list li>a",function(){
		var $obj = $(this);
		var $wcol = $obj.attr("editcateiconcolor");
		$obj.css("color",$obj.attr("editcatenamecolor"));
		$obj.find("i").css("color",$wcol);
	});
	$(document).on("mouseenter",".ulist-model a",function(){
		var $obj = $(this);
		var $wcol = $obj.parent().attr("editcontitcheckcolor");
		$obj.css("color",$wcol);
	});
	$(document).on("mouseleave",".ulist-model a",function(){
		var $obj = $(this);
		$obj.css("color",$obj.parent().attr("editcontitcolor"));
	});
})
