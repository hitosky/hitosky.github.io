var $wrap = $(".wrap");
var $resultWidth = $(".result.width");
var $resultClick = $(".result.click");
var $boxType = $(`input[name="box-type"]`);
var widthTag = [
	`css("width")`,
	`width()`,
	`clientWidth`,
	`offsetWidth`,
	`scrollWidth`
];

var clickTag = [
	`screenX`,
	`clientX`,
	`pageX`,
	`offsetX`,
	`screenY`,
	`clientY`,
	`pageY`,
	`offsetY`,
];
// 点击按钮设置wrap的box-sizing
$boxType.change(function(){
	
	if(this.checked){
		$wrap.css("box-sizing",$(this).val());
		$(window).trigger("resize");
	}
})

// resizeCalc
function resizeCalc(){
	var resultContent = 'wrap相关宽度';
	widthTag.forEach(function(tag,index){
		if(tag.search('width')>-1){
			var calc = "'"+tag+":'"+"+$wrap."+tag;
		}
		else {
		 	calc = "'"+tag+":'"+"+$wrap[0]."+tag;
		 }
		resultContent += "<li>"+eval(calc)+"</li>";
	});
	$resultWidth.html(resultContent);
}
// clickCalc
function clickCalc(e){
	var resultContent = 'window click相关坐标';
	clickTag.forEach(function(tag,index){
		var calc = "'"+tag+":'"+"+e."+tag;
		resultContent += "<li>"+eval(calc)+"</li>";
		
	});

	$resultClick.html(resultContent);	
}
// window窗口大小改变引起wrap的宽度改变
$(window).resize(function(){
	resizeCalc();	
});

// window上的鼠标点击事件
$(window).click(function(e){
	clickCalc(e);
})

$(document).ready(function(){
	resizeCalc();
	$(window).trigger("click");
})