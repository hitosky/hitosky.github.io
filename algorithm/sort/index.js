function swap(a,i,j)
{
  a[i]=a[i]+a[j];
  a[j]=a[i]-a[j];
  a[i]=a[i]-a[j];

}
//直接插入
function insert(){
  var j;
  for(var i=1;i<barCounts;i++){
    for(j=i-1;j>-1;j--)
    {
        if(bars[j+1]<bars[j])
        {
          swap(bars,j+1,j);
          swap(ys,j+1,j);
          barState.push(JSON.parse(JSON.stringify(bars)));
          yState.push(JSON.parse(JSON.stringify(ys)));

        }
        else {
          break;
        }
   }
  }
}
//希尔
//步长相同的为一组，每组采用直接插入
function hill(){
var step=Math.floor(barCounts/2);
for(;step>=1;step=Math.floor(step/2)){
  for(var i=step;i<barCounts;i++){
    for(var j=i;j>step-1;j-=step)
      if(bars[j]<bars[j-step])
      {
        swap(bars,j,j-step);
        swap(ys,j,j-step);
        barState.push(JSON.parse(JSON.stringify(bars)));
        yState.push(JSON.parse(JSON.stringify(ys)));
      }
  }
}
}
//冒泡
function bubble(){
  for(var i=barCounts-1;i>0;i--)
  {
    for(var j=0;j<i;j++){
      if(bars[j]>bars[j+1]){
        swap(bars,j+1,j);
        swap(ys,j+1,j);
        barState.push(JSON.parse(JSON.stringify(bars)));
        yState.push(JSON.parse(JSON.stringify(ys)));
      }
    }
  }
}
//快排
function qk(dataArr,start,end){
  if(start>=end)
    return;
  var x=dataArr[start];
  var i=start;
  var j=end;
  while(i<j){
    while(i<j&&dataArr[j]>=x){
      j--;
    }
    if(dataArr[j]<x){
      swap(dataArr,i,j);
      swap(ys,i,j);
      barState.push(JSON.parse(JSON.stringify(bars)));
      yState.push(JSON.parse(JSON.stringify(ys)));
    }
    while(i<j&&dataArr[i]<=x){
      i++;
    }
    if(dataArr[i]>x)
      {
        swap(dataArr,i,j);
        swap(ys,i,j);
        barState.push(JSON.parse(JSON.stringify(bars)));
        yState.push(JSON.parse(JSON.stringify(ys)));
      }
  }
  qk(dataArr,start,i-1);
  qk(dataArr,i+1,end);
}
function quick(){
  qk(bars,0,barCounts-1);
}
//直接选择
function choose(){
  for(var i=0;i<barCounts;i++){
    for(var j=i+1;j<barCounts;j++){
      if(bars[j]<bars[i])
      {
          swap(bars,j,i);
          swap(ys,j,i);
          barState.push(JSON.parse(JSON.stringify(bars)));
          yState.push(JSON.parse(JSON.stringify(ys)));
      }
    }
  }
}
//堆排序
function heapInsert(index){
  while(index>0){
    var parent=Math.floor((index-1)/2);
    if(bars[parent]<bars[index])
    {
      swap(bars,parent,index);
      swap(ys,parent,index);
      barState.push(JSON.parse(JSON.stringify(bars)));
      yState.push(JSON.parse(JSON.stringify(ys)));
    }
    else
      break;
    index=parent;
  }
}
function heap(){
  for(var k=barCounts-1;k>0;k--)
  {
    for(var i=1;i<=k;i++)
      heapInsert(i);
    swap(bars,0,k);
    swap(ys,0,k);
    barState.push(JSON.parse(JSON.stringify(bars)));
    yState.push(JSON.parse(JSON.stringify(ys)));
  }

}
//归并
function mg(first,mid,last){
  if(last-first<=0)
    return;
  var leftmid=Math.floor((mid+first)/2);
  var rightmid=Math.floor((mid+last+1)/2);
  mg(first,leftmid,mid);
  mg(mid+1,rightmid,last);
  var i=first;
  var j=mid+1;
  var k=0;
  var barTemp=new Array(last-first+1);
  var yTemp=new Array(last-first+1);
  while(i<=mid&&j<=last){
    if(bars[i]<bars[j]){
      barTemp[k]=bars[i];
      yTemp[k]=ys[i];
      i++;
      k++;
    }
    if(bars[i]>=bars[j]){
      barTemp[k]=bars[j];
      yTemp[k]=ys[j];
      j++;
      k++;
    }
  }
  while(i<=mid)
  {
    barTemp[k]=bars[i];
    yTemp[k]=ys[i];
    k++;
    i++;
  }
  while(j<=last){
    barTemp[k]=bars[j];
    yTemp[k]=ys[j];
    k++;
    j++;
  }
for(var m=0;m<k;m++)
  {
    bars[m+first]=barTemp[m];
    ys[m+first]=yTemp[m];
    barState.push(JSON.parse(JSON.stringify(bars)));
    yState.push(JSON.parse(JSON.stringify(ys)));
  }
}
function merge(){
  mg(0,Math.floor(barCounts/2),barCounts-1);
}
//基数
function getMax(dataArr){
  var size=dataArr.length;
  var max=dataArr[0];
  for(var i=1;i<size;i++)
    if(dataArr[i]>max)
      max=dataArr[i];
  return max;
}
function arrIni(dataArr){
  var size=dataArr.length;
  for(var i=0;i<size;i++){
    dataArr[i]=0;
  }
}
function radix(){
  var max=getMax(bars);
  var numArr=new Array(max+1);
  var size=numArr.length;
  var barArr=JSON.parse(JSON.stringify(bars));
  var yArr=JSON.parse(JSON.stringify(ys));
  arrIni(numArr);
  var k=0;
  for(var i=0;i<barCounts;i++)
  {
    numArr[bars[i]]++;
    k++;
  }
  for(i=0;i<size;i++)
    k+=numArr[i];
  for(var j=1;j<size;j++)
    numArr[j]+=numArr[j-1];

  for(i=barCounts-1;i>-1;i--){
    barArr[numArr[bars[i]]-1]=bars[i];
    yArr[numArr[bars[i]]-1]=ys[i];
    numArr[bars[i]]--;
    barState.push(JSON.parse(JSON.stringify(barArr)));
    yState.push(JSON.parse(JSON.stringify(yArr)));
  }
}
//开始事件
function start(){
  if(lock!==0)
    return ;
  if(sort===undefined)
  {
    alert('please choose a sort alogrithm');
    return;
  }
  sort();
  stateNum=0;
  id=setInterval(function(){canvasDraw();},500);
  lock=1;
}
//绑定开始事件
function bindStart(){
  var startBtn=document.getElementById('start-btn');
  startBtn.addEventListener('click',start);
}
//暂停事件
function pause(){
  if(lock!=1)
    return;
  clearInterval(id);
  lock=2;
}
//绑定暂停事件
function bindPause(){
  var pauseBtn=document.getElementById('pause-btn');
  pauseBtn.addEventListener('click',pause);
}
//继续事件
function conti(){
  if(lock!=2)
    return;
  id=setInterval(function(){canvasDraw();},500);
  lock=1;
}
//绑定继续事件
function bindContinue(){
  var conBtn=document.getElementById('continue-btn');
  conBtn.addEventListener('click',conti);
}
//刷新事件
function flush() {
  clearInterval(id);
  ctx.clearRect(0,0,cvWidth,cvHeight);
  canvasIni();
  stateNum=0;
  lock=0;
  yState.splice(0);
  barState.splice(0);
}
//绑定刷新事件
function bindFlush(){
  var btn=document.getElementById('flush-btn');
  btn.addEventListener('click',flush);
}
//radio改变事件
function choiceChange(e){
  var value=e.target.value;
  switch (value) {
    case 'insert':
      sort=insert;
      break;
    case 'hill':
      sort=hill;
      break;
    case 'bubble':
      sort=bubble;
      break;
    case 'quick':
      sort=quick;
      break;
    case 'choose':
      sort=choose;
      break;
    case 'heap':
      sort=heap;
      break;
    case 'merge':
      sort=merge;
      break;
    case 'radix':
      sort=radix;
      break;
  }
}
//绑定radio选择改变事件
function bindChoiceChange(){
  var choice=document.getElementById('sort-choice');
  choice.addEventListener('change',choiceChange);
}
//初始化canvas以及数组
function canvasIni(){
  ctx.fillStyle='greenyellow';
  var sx=startX;
  for(var i=1;i<=barCounts;i++)
  {
    var x=(i-1)*barWidth+sx;
    var j=Math.floor(Math.random()*(barCounts+1));
    if(j===0)
      j=1;
    var y=cvHeight-(j*barHeight+i);
    ctx.fillRect(x,y,barWidth,j*barHeight+i);

    xs[i-1]=x;
    ys[i-1]=y;
    bars[i-1]=j*barHeight+i;
    sx=sx+2;
  }
}
//画每个状态的canvas
function canvasDraw(){
  ctx.clearRect(0,0,cvWidth,cvHeight);
  //console.log(barState[0],barState[1]);
  for(var i=0;i<barCounts;i++)
    ctx.fillRect(xs[i],yState[stateNum][i],barWidth,barState[stateNum][i]);
  stateNum++;
  if(stateNum==yState.length)
    clearInterval(id);
}
//sort初始函数
function sortIni(){
  var choice=document.getElementById('sort-choice');
  var label=choice.getElementsByTagName('input');
  var size=label.length;
  for(var i=0;i<size;i++){
    if(label[i].checked){

      choiceChange({target:{value:(label[i].value)}});
      //console.log(sort);
      break;
    }
  }
}
//主函数
function main(){
  bindChoiceChange();
  bindStart();
  bindPause();
  bindContinue();
  bindFlush();

  canvasIni();
  sortIni();
  console.log("before sort:",bars);
}
var sortCv=document.getElementById('sort-canvas');
var ctx=sortCv.getContext('2d');
var cvHeight=sortCv.height;
var cvWidth=sortCv.width;
var barHeight=10;      //柱子基本高度
var barWidth=21;      //柱子宽度
var barCounts=26;    //柱子数量
var startX=2;          //第一个柱子起始x位置
var xs=new Array(barCounts);      //每个柱子当前x位置
var ys=new Array(barCounts);       //每个柱子当前y位置
var bars=new Array(barCounts);    //存放每个柱子代表的数值

var yState=[];     //各个阶段的ys状态
var barState=[];  //各个阶段bars的状态
var stateNum=0;       //当前barState内部数据已经在画布上画过的数量
var id;     //interval id
var lock=0;   //每个按钮有个锁，防止逻辑混乱
var sort;     //具体的排序方式
main();
