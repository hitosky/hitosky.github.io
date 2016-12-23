'use strict';

let $btn = $('.c-btn');
let $code = $('.code');
let $line = $('.line');
let $textarea = $('.code>textarea');
let $wrap = $(".m-wrap");
let $codeArea=$(".m-code-area");
// 不同代码区域对应的行号
var lineNum = {
    'html-code':'<li></li>',
    'css-code':'<li></li>',
    'js-code': '<li></li>'
};

// line与m-code-area区域宽度之和等于m-wrap的宽度
let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
let recalc = function(){
    $codeArea.css("width",parseFloat($wrap.css("width"))-parseFloat($line.css("width"))
    );    
}
window.addEventListener(resizeEvt, recalc, false);
document.addEventListener('DOMContentLoaded', recalc, false);

// 监听按钮click事件
$btn.on('click',function(){
    // 设置原来选中的button为未选中状态
    $('.c-btn').each(function(index,btn){
        if($(btn).hasClass('choose')){
            $(btn).removeClass('choose');
            return false;
        }
    });
    $code.each(function(index,code){
        if($(code).hasClass('choose')){
            $(code).removeClass('choose');
            return false;
        }
    });
    $(this).addClass('choose');

    // 显示对应的代码编辑区并设置相应的行数
    var selector = $(this).val().toLowerCase()+'-code';
    $('#'+selector).addClass('choose');
    $('#'+selector+'>textarea').trigger('focus');
    $line.html(lineNum[selector]);

    // 如果是选中result区域，默认不显示左侧的行号
    if(/result/i.test(selector)){
        $line.addClass('hide');
    }
    else {
        $line.removeClass('hide');
    }
});

// 监听代码输入事件
$textarea.on('input',function(){
    // 防止line向左移动

    let lineHtml = '';
    let inputCode = $(this).val().split('\n');

    let len = inputCode.length;
    for(let i = 0 ;i<len; i++){
        lineHtml += '<li></li>';
    }

    $line.html(lineHtml);
    lineNum[$(this).attr('class')] = lineHtml;
    // 每当输入行数达到100的整数倍，自动增加line区域与textarea区域的高度
    if(len%100 == 0 ){
        let height = parseFloat($line.height());
        let lineHeight = parseFloat($(this).css('line-height'));
        height = height+100*lineHeight+'px';
        $line.height(height);
        $(this).height(height);
    }
});

// tab事件替代为space事件
$textarea.keydown(function(e){
    if(e.keyCode !== 9){
        return true;
    }
    
    e.stopPropagation || e.stopPropagation();
    e.preventDefault || e.preventDefault();  
    let space = $(this).val();
    $(this).val(space+"    ");
    return false;
});


// 显示的html头部
var header = '<head><meta charset="utf-8">\n<style type="text/css">\n{css}\n</style>\n</head>';
// 显示的html body部分
var body = '<body>\n{body}\n<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>\n</body>';
var script = '<script>{script}</script>';
var resultDom = document.getElementById('code-result').contentDocument;//$('#code-result');
resultDom = resultDom.document ? resultDom.document : resultDom;

var $htmlCode = $('.html-code');
var $cssCode = $('.css-code');
var $jsCode = $('.js-code');
var $btnResult = $('.c-btn-result');
var $btnDom = $('.c-btn-dom');

// 点击‘显示结果’按钮在result区域生成效果
$btnResult.on('click',function(){
    let iframeHeadHtml = header.replace('{css}',$cssCode.val());
    let iframeBodyHtml = $htmlCode.val() + script.replace('{script}',$jsCode.val());
    iframeBodyHtml = body.replace('{body}',iframeBodyHtml);

    // 打开result区域的dom对象并注入html，css，js代码
    resultDom.open();
    resultDom.write(iframeHeadHtml+iframeBodyHtml);
    resultDom.close();
});

