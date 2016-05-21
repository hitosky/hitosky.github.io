var queue=[];
var queueHtml=[];

function inputFilter(){
  var input=document.getElementById('input-digital');

  if(input.value===''){
    alert('please input number');
    return null;
  }

    var text=input.value.replace(/\s/g,'');
    if(text.search(/\D/)>-1)
    {
      alert('queue input requires integer  only');
      return null;
    }
    return text;
}
//计算n有几位
function getNum(n){
  var k=1;
  while(n>9){
    n/=10;
    k++;
  }
  return k;
}
function renderHtml(){
  var size=queue.length;
  queueHtml=[];
  for(var i=0;i<size;i++){
    var queueStyle={
      height:'20px',
      textalign:'center',
      fontsize:'20px',
      lineheight:'20px',
      color:'white',
      backcolor:'red'
    };
    queueStyle.width=getNum(queue[i])*15;
    queueStyle.width=queueStyle.width.toString()+'px';
    queueHtml.push(queueStyle);
  }
}
function showQueue(){
  var q=document.getElementById('queue');
  renderHtml();
  var size=queue.length;
  var html='';
  var style="style='float:left;margin-right:2px;width:{width};height:{height};background-color:{backcolor};color:{color};text-align:{textalign};font-size:{fontsize};line-height:{lineheight};'";
  for(var i=0;i<size;i++){
    var h=queueHtml[i];
    html+='<div '+style.replace('{backcolor}',h.backcolor).replace('{color}',h.color).replace('{width}',h.width).replace('{height}',h.height).
    replace('{textalign}',h.textalign).replace('{fontsize}',h.fontsize).replace('{lineheight}',h.lineheight)+'>'+queue[i]+'</div>'  ;
  }
  q.innerHTML=html;
  var div=q.getElementsByTagName('div');
  for(var i=0;i<div.length;i++){
    (function(_i)
    {
    div[_i].onclick=function(){
      queue.splice(_i,1);
      showQueue();

      };
    })(i);
  }
}
function leftInHandler(){
  var value=inputFilter();
  if(value===null)
    return;
  queue.unshift(value);
  showQueue();
}
function rightInHandler(){
  var value=inputFilter();
  if(value===null)
    return;
  queue.push(value);
  showQueue();
}
function leftOutHandler(){
  var value=inputFilter();
  if(value===null)
    return;
  queue.shift();
  showQueue();
}
function rightOutHandler(){
  var value=inputFilter();
  if(value===null)
    return;
  queue.pop();
  showQueue();
}
function delDivHandler(){
  var q=document.getElementById('queue');
  var div=q.getElementsByTagName('div');

  for(var i=0;i<div.length;i++){
    (function(_i)
    {
    div[_i].onclick=function(){

      queue.splice(_i,1);
      alert(queue);
      showQueue();
      };
    })(i);
  }


}
function init(){
  showQueue();
  var leftIn=document.getElementById('left-in');
  var rightIn=document.getElementById('right-in');
  var leftOut=document.getElementById('left-out');
  var rightOut=document.getElementById('right-out');

  leftIn.onclick=function (){
    leftInHandler();
  };
  rightIn.onclick=function(){
    rightInHandler();
  };
  leftOut.onclick=function(){
    leftOutHandler();
  };
  rightOut.onclick=function (){
    rightOutHandler();
  };


}
init();
