//深度遍历:前、中、后序
var DForder=['forward','middle','back'];
//树节点
function Node(data){
  this.data=data;
  this.parent=null;
  this.left=null;
  this.right=null;
}
//树对象Tree
function Tree(data){
  this._root=new Node(data);
}
//通过数组按照广度优先构造二叉树，
//若左子树为空，右子树不为空，则数组中需将左子节点标为null
Tree.prototype.createByArrayBF = function (arr) {
  var size=arr.length;
  if(size<1)
    throw new Error('input array is empty');
  this._root=new Node(arr[0]);
  //用于存储节点的队列
  var queue=[this._root];
  var i=1;
  while(queue.length>0){
    var node=queue.shift();
    if(i<size&&arr[i]!==null)
    {
      node.left=new Node(arr[i]);
      queue.push(node.left);
    }
    if(i+1<size&&arr[i+1]!==null)
    {
      node.right=new Node(arr[i+1]);
      queue.push(node.right);
    }
    i+=2;
  }
};
//如果某个数组的元素存放顺序是按照完全二叉树的前序
Tree.prototype.createByArrayDF = function (arr) {
  var size=arr.length;
  if(size<1)
    throw new Error('input array is empty');
  var N=Math.floor(Math.log(size)/Math.log(2));//完全二叉树的层数
  var n=0;   //当前层
  var s=1;   //统计当前遍历节点个数
  this._root=new Node(arr[0]);
  var nodeQueue=[this._root];
  var indexQueue=[0];     //与节点数据对应的数组下标队列
  while(s<size){
    if(n>N)
      break;
    //遍历每层所有节点
    for(var k=0;k<Math.pow(2,n);k++){
      if(s>=size)
        break;
      var index=indexQueue.shift();
      var node=nodeQueue.shift();
      var leftIndex=index+1;   //左孩子下标等于父节点的下标+1;
      var rightIndex=Math.pow(2,N-n)+index;    //右孩子节点等于index+2^(N-n)
      if(leftIndex<size)
      {
        node.left=new Node(arr[leftIndex]);
        nodeQueue.push(node.left);
        indexQueue.push(leftIndex);
        s++;
      }
      if(rightIndex<size)
      {
        node.right=new Node(arr[rightIndex]);
        nodeQueue.push(node.right);
        indexQueue.push(rightIndex);
        s++;
      }

    }
    n++;
  }
};
//定义Tree深度遍历
//callback为遍历时要执行的函数
Tree.prototype.traverseDF = function (callback,order) {
  //如果是前序
  if(order==DForder[0]){
    //立即执行函数，递归遍历子节点
    (function recurse(node){
      if(node===null)
        return;
      callback(node);
      recurse(node.left);
      recurse(node.right);
    })(this._root);
  }
  //中序遍历
  else if(order==DForder[1])
  {
    (function recurse(node){
      if(node===null)
        return;
      recurse(node.left);
      callback(node);
      recurse(node.right);
    })(this._root);
  }
  //后序遍历
  else if(order==DForder[2]){
    (function recurse(node){
      if(node===null)
        return;
      recurse(node.left);
      recurse(node.right);
      callback(node);
    })(this._root);
  }

};


//divNodes元素顺序是按前序排列的
var divNodes=document.getElementsByTagName('div');
var divTree=new Tree(null);    //div树
var curColor=[];         //遍历到某一节点时各个div的颜色信息
var colorState=[];     //存储所有的curColor状态
var index=[];           //div在divNodes的下标
var id=[];               //定时器id
var selectOrder='';
//清除旧的定时器id
function clearId(){
  while(id.length>0){
    clearTimeout(id.shift());
  }
}
//DF-order的事件
function dforderChange(e){
  if(selectOrder!=e.target.value)
    {
      selectOrder=e.target.value;
      setColorState();
      show_nodes();
    }
}
//绑定DF-order change事件
function initDForderChange(){
  var order=document.getElementById('DF-order');
  order.addEventListener('change',dforderChange,false);
}
//根据用户选择的遍历order生成colorState
function setColorState(){
  colorState=[];
  var k=0;
  divTree.createByArrayDF(index);
  divTree.traverseDF(function(node){
    curColor[node.data]='red';
    colorState.push(JSON.parse(JSON.stringify(curColor)));
    curColor[node.data]='white';
  },selectOrder);
  colorState.push(JSON.parse(JSON.stringify(curColor)));
}
//显示遍历到的节点
function show_nodes(){
  clearId();
  var stateSize=colorState.length;
  for(var i=1;i<=stateSize;i++){
    (function(_i)
    {
      id.push(setTimeout(function()
      {
        var colorSize=colorState[_i].length;
        for(var j=0;j<colorSize;j++)
        {
          divNodes[j].style.background=colorState[_i][j];
        }
      },800*(_i+1)));
    })(i-1);
}
}
function init(){
  for(var i=0;i<divNodes.length;i++){
    curColor.push('white');
    index.push(i);
  }
  var order=document.getElementById('DF-order');
  for(i=0;i<order.length;i++){
    if(order[i].checked)
        selectOrder=order[i].value;
  }

  setColorState();
  show_nodes();
  initDForderChange();
}
init();
/*var a=[
0,
  1,
  2,
  null,
  3,
  4
];
var a=[0,1,2,3,4];
var k=0;
var tree=new Tree(null);
tree.createByArrayDF(a);
tree.traverseDF(function(node){
  k++;
},DForder[0]);
console.log('k=',k);*/
