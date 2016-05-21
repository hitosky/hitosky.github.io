function extend(child,parent){
  function f(){}
  f.prototype=parent;
  child.prototype=new f();
  child.prototype.constructor=child;
}
//单例模式：根据fn生成单例
function singleton(fn){
  var result;
  return function(){
    return result||(result=fn.apply(this, arguments));
  };
}
//JSON指令构造器
function jsonCmd(shipId,cmd){
  return {id:shipId,command:cmd};
}
//JSON飞船应答指令
function jsonRsp(shipId,state,remain){
    return {id:shipId,
      curState:state,
      curRemain:remain
    };
}
//指令转换器
//JSON:{id:1,command:'stop'}
function Adapter(){
  //指令对应的二进制码
  this.cmdBits={run:'0001',
  stop:'0010',
  destroy:'1100'};
  //将json命令转换为二进制
  this.cmd2Bits=function(cmd){
    var bId=cmd.id.toString(2);
    while(bId.length<4){
      bId='0'+bId;
    }
    return bId+this.cmdBits[cmd.command];
  };
  //将二进制命令转换为JSON
  this.bits2Cmd=function(bits){
    var nId=parseInt(bits.slice(0,4),2);
    var cmd;
    for(var c in this.cmdBits){
      if(this.cmdBits[c]==bits.slice(4))
        cmd=c;
    }
    return jsonCmd(nId,cmd);
  };
  this.rsp2Bits=function(rsp){
    var bId=rsp.id.toString(2);
    while(bId.length<4){
      bId='0'+bId;
    }
    var bRemain=rsp.curRemain.toString(2);
    while(bRemain.length<8)
      bRemain='0'+bRemain;
    return bId+this.cmdBits[rsp.curState]+bRemain;
  };
  this.bits2Rsp=function(bits){
    var nId=parseInt(bits.slice(0,4),2);
    var state;
    for(var c in this.cmdBits)
      if(this.cmdBits[c]==bits.slice(4,8))
        state=c;
    return jsonRsp(nId,state,parseInt(bits.slice(8),2));
  };
}
//消息信道
function Bus(errRate,delay){
  this.errRate=errRate;   //信道出错率
  this.delay=delay;    //发送延时
  this.cmdInfo=[];     //指挥指令信息
  this.rspInfo=[];   //飞船应答信息
  this.cmdOperator='commander';    //bus cmdInfo当前操作者，指挥官(commander),飞船(airship)
  this.rspOperator='airship';   //bus rspInfo当前操作者
  this.shipNum=0;           //飞船个数 一个飞船占一个信道
  this.receiverNum=0;    //接收到消息的飞船个数
  this.senderNum=0;     //发送消息的飞船个数
  //每生产一个飞船,信道加一
  this.addShipNum=function(){
    this.shipNum++;
  };
  //每销毁一个飞船，信道减一
  this.subShipNum=function(){
    this.shipNum--;
  };
  //指挥向bus里面写入指令信息
  this.writeCmd=function(cmdArr){
        if(this.cmdOperator=='commander'&&cmdArr.length>0)
        {
            this.cmdInfo=this.cmdInfo.concat(cmdArr);
            this.cmdOperator='airship';
          }
  };
  //飞船从bus读取指令
  this.readCmd=function(){
    if(this.cmdOperator=='airship'&&Math.random()>this.errRate)
    {
      var cmdArr=JSON.parse(JSON.stringify(this.cmdInfo));
      this.receiverNum++;
      //当所有飞船均接收到信息后，删除命令信息
      if(this.shipNum<=this.receiverNum)
        {
          this.receiverNum=0;
          this.cmdInfo.splice(0);
          this.cmdOperator='commander';
        }
      return cmdArr;
    }
    return null;
  };
    //飞船向bus写入应答
    this.writeRsp=function(rspArr){
      if(this.rspOperator=='airship'&&rspArr.length>0)
      {
          this.rspInfo=this.rspInfo.concat(rspArr);
          this.senderNum++;
          if(this.senderNum>=this.shipNum)
            {
              this.senderNum=0;
              this.rspOperator='commander';
            }
        }
    };
    //指挥从bus中读取应答
    this.readRsp=function(){
      if(this.rspOperator=='commander'&&Math.random()>this.errRate)
      {
          var rspArr=JSON.parse(JSON.stringify(this.rspInfo));
          this.rspInfo.splice(0);
          this.rspOperator='airship';
          return rspArr;
      }
      return null;
    };

  //获取当前命令通道的操作者
  this.getCmdOperator=function(){return this.cmdOperator;};
  //获取当前应答通道的操作者
  this.getRspOperator=function(){return this.rspOperator;};
}
//指挥官
function Commander(cmdBoard,stateBoard){
  this.cmdBoard=cmdBoard;    //命令面板
  this.stateBoard=stateBoard;   //飞船状态面板
  this.shipId=[];    //控制的飞船id
  this.cmdInfo=[];    //指挥发给飞船的JSON指令
  this.adapter=new Adapter();    //指令转换器
  //this.sender=new Adapter();
  //this.receiver=new A
  //显示指令面板
  this.showCmdBoard=function (){
    var size=this.shipId.length;
    var html='<legend>指挥官命令</legend>';
    var cmdBtn="<button class='run'>开始飞行</button><button class='stop'>停止飞行</button><button class='destroy'>销毁</button>";
    for(var i=0;i<size;i++){
      html+="<label id=command"+this.shipId[i]+" style='display:block;'"+'>'+this.shipId[i]+'号飞船指令：'+cmdBtn+'</label>';
    }
    this.cmdBoard.innerHTML=html;
  };
  //增加飞船状态信息
  this.addStateNode=function(id,energySys){
    var html='<tr>'+'<th>'+id+'</th>'+'<th>'+
    energySys.dynamic.name+'</th>'+'<th>'+
    energySys.power.name+'</th>'+'<th>stop</th>'+'<th>'+'100%'+'</th></tr>';
    var tb=this.stateBoard.getElementsByTagName('tbody');
    tb[0].innerHTML+=html;
  };
  //修改飞船状态信息
  this.changeShipState=function(rsp){
    var th=this.stateBoard.getElementsByTagName('th');
    var size=th.length;
    for(var i=0;i<size;i++)
    {
      if(th[i].innerHTML==rsp.id.toString())
      {
        th[i+3].innerHTML=rsp.curState;
        th[i+4].innerHTML=rsp.curRemain+'%';
        break;
      }
    }
    this.showComInfo('ship'+rsp.id+" state: "+
    rsp.curState+'  energy remain: '+rsp.curRemain);

  };
  //删除飞船在表中信息
  this.delStateNode=function(id){
    var tr=this.stateBoard.getElementsByTagName('tr');
    var tbody=this.stateBoard.getElementsByTagName('tbody');
    var label=this.cmdBoard.getElementsByTagName('label');
    var size=tr.length;
    for(var i=0;i<size;i++)
    {
      if(tr[i].innerHTML.slice(0,6).search(id.toString())>-1)
      {
        tbody[0].removeChild(tr[i]);
        break;
      }
    }
    size=label.length;
    for(var j=0;j<size;j++)
    {
      if(label[j].innerHTML.search(id.toString())>-1)
      {
        this.cmdBoard.removeChild(label[j]);
        break;
      }
    }
  };

  //指挥与飞船的通信信息显示
  this.showComInfo=function(info){
    var html='<p>'+info+'</p>';
    this.stateBoard.innerHTML+=html;
  };
  //每隔2秒清理同信信息
  this.clearComInfo=function(){
    (function(_this){
      setTimeout(function(){
        var p=_this.stateBoard.getElementsByTagName('p');
        if(p.length>2)
        _this.stateBoard.removeChild(p[2]);

      },1000);
    })(this);
  };
  //设置指令按钮的触发事件
   this.setCmdBtnHandler=function(bus){
    var size=this.shipId.length;
    var idArr=JSON.parse(JSON.stringify(this.shipId));
    for(var i=0;i<size;i++){
      var cmd=document.getElementById('command'+this.shipId[i]);
      var btn=cmd.getElementsByTagName('button');
      var s=btn.length;
      for(var j=0;j<s;j++){
        if(btn[j].className=='run'){
          //飞行指令
          (function(_this,_i,_idArr){
            btn[j].onclick=function(){
              _this.cmdInfo.push(jsonCmd(_idArr[_i],'run'));
              _this.showComInfo('Commander:ship'+_idArr[_i]+'-->run');
            };
          })(this,i,idArr);

        }
        else if(btn[j].className=='stop'){
          //停飞指令
          (function(_this,_i,_idArr){
            btn[j].onclick=function(){
              _this.cmdInfo.push(jsonCmd(_idArr[_i],'stop'));
                _this.showComInfo('Commander:ship'+_idArr[_i]+'-->stop');

            };
          })(this,i,idArr);

        }
        else{
          //销毁指令
          (function(_this,_i,_bus,_idArr){
            btn[j].onclick=function(){
              _this.cmdInfo.push(jsonCmd(_idArr[_i],'destroy'));
                _this.showComInfo('Commander:ship'+_idArr[_i]+'-->destroy');
                _this.delStateNode(_idArr[_i]);
                console.log('ship'+_idArr[_i]+'destroy');
              _this.destroyShip(_idArr[_i]);
                //_bus.subShipNum();

            };
          })(this,i,bus,idArr);

        }
      }
    }
  };
  //获得新飞船编号并在状态面板生成飞船初始状态信息
  this.getNewShip= function (newship,bus) {
    this.shipId.push(newship.id);
    this.showCmdBoard();
    this.addStateNode(newship.id,newship.energySys);
    this.setCmdBtnHandler(bus);
  };
  //根据shipid摧毁ship
  this.destroyShip=function (shipId){
    var size=this.shipId.length;
    for(var i=0;i<size;i++){
      if(this.shipId[i]==shipId)
      {
        this.shipId.splice(i,1);
        break;
      }
    }
    console.log('after destroy',this.shipId);
  };
  //命令发送器
  this.sendCmd=function(bus){
    //定时向bus里面写入命令
    (function(_this,_bus){
      setInterval(function(){
        if(_bus.getCmdOperator()!='commander')
          return null;
        var cmd=JSON.parse(JSON.stringify(_this.cmdInfo));
        _this.cmdInfo.splice(0);   //清空命令信息
        var size=cmd.length;
        //转换消息格式
        for(var i=0;i<size;i++)
          cmd[i]=_this.adapter.cmd2Bits(cmd[i]);
        _bus.writeCmd(cmd);
      },10);
    })(this,bus);
  };
  //应答接收器
  this.receiveRsp=function(bus){
    (function(_this,_bus){
      setInterval(function(){
      if(_bus.getRspOperator()!='commander')
        return;
      var rspArr=_bus.readRsp();
      if(rspArr===null)
        return;
      _this.clearComInfo();
      var size=rspArr.length;
      for(var i=0;i<size;i++){
        var rsp=_this.adapter.bits2Rsp(rspArr[i]);
        _this.changeShipState(rsp);
      }
    },1000);
    })(this,bus);
  };
  return this;
}
//备选的动力系统
var dynamicSys={
  advance:{
    name:'前进号',     //型号
    speed:30,       //运行速度
    consume:5,    //能源消耗速率
    rad:80,         //轨道半径
    style:{          //样式
      top:'30%',
      transformOrigin:'50% 80px'

    }
  },
  pentium:{
    name:'奔腾号',
    speed:50,
    consume:7,
    rad:120,
    style:{
      top:'20%',
      transformOrigin:'50% 120px'
    }
  },
  super:{
    name:'超越号',
    speed:80,
    consume:9,
    rad:160,
    style:{
      top:'10%',
      transformOrigin:'50% 160px'
    }
  }
};
//备选的能源系统
var powerSys={
  strong:{
    name:'劲量型',
    supple:2
  },
  luminous:{
    name:'光能型',
    supple:3
  },
  perpetual:{
    name:'永久型',
    supple:4
  },
};
//动力及能源系统
function EnergySys(dynamic,power){
  this.dynamic=dynamic;  //动力系统
  this.power=power;   //能耗系统
  this.remain=100;     //剩余能量
}

//飞船
function Airship(id,energy){
  this.id=id;   //飞船编号
  this.energySys=energy;   //飞船动力能源系统
  this.remain=this.energySys.remain;  //当前飞船所剩的能耗
  this.state='stop';         //飞船当前状态
  this.curDeg=0;  //当前角度位置
  this.adapter=new Adapter();
  this.newCmd={};//接收到的最新指令
  this.runInt=[]; // 飞船运行周期id
  this.stopInt=[] ;  //飞船停飞周期id
}
//设置飞船状态
Airship.prototype.setState=function(state){
  this.state=state;
};
//获取飞船状态
Airship.prototype.getState=function(){
  return this.state;
};
//清楚周期id
Airship.prototype.clearInt=function(){
  var size,i;
  if(this.state=='stop')
  {
    size=this.stopInt.length;
    for(i=0;i<size;i++)
      clearTimeout(this.stopInt[i]);
  }
  if(this.state=='run')
  {
    size=this.runInt.length;
    for(i=0;i<size;i++)
      clearTimeout(this.runInt[i]);
  }
};
//补充能量
Airship.prototype.stop=function(){
  if(this.state!='stop')
    return;
  var ship=document.getElementById('ship'+this.id);
  //ship.style.transformOrigin=this.energySys.dynamic.style.transformOrigin;
  //ship.style.top=this.energySys.dynamic.style.top;
  this.energySys.remain=this.remain;
  for(var i=0;this.energySys.remain<=100;i++){
      this.stopInt.push((function(_this,_id,_e,_t){
        return setTimeout(function(){
        ship.innerHTML='<p>'+_id+'号: '+_e+'%</p>';
        _this.remain=_e;
      },_t);
    })(this,this.id,this.energySys.remain,i*1000));
    if(this.energySys.remain==100)
      break;
    this.energySys.remain+=this.energySys.power.supple;
    this.energySys.remain=parseFloat(this.energySys.remain.toFixed(2));
    if(this.energySys.remain>100)
      this.energySys.remain=100;
  }
};
//飞船运行函数
Airship.prototype.run=function(){
  if(this.state!='run')
    return;
  var ship=document.getElementById('ship'+this.id);
  //ship.style.transformOrigin=this.energySys.dynamic.style.transformOrigin;
  //ship.style.top=this.energySys.dynamic.style.top;
  this.energySys.remain=this.remain;
  var time=calTimeEachDeg(this.energySys.dynamic.speed,this.energySys.dynamic.rad);   //单位毫秒
  var deg=this.curDeg;
  for(var i=0;this.energySys.remain>=0;i++)
    {
    this.runInt.push((function(_this,_i,_t,_e,_deg){
        return setTimeout(
          function(){
        ship.style.transform='rotate('+(_i+_deg)+'deg)';
        _this.curDeg=(_i+_deg)%360;
        ship.innerHTML='<p>'+_this.id+'号: '+_e+'%</p>';
        _this.remain=_e;
        if(_e===0)
          {
            _this.clearInt();
             _this.state='stop';
          _this.stop();
        }
    },_i*_t);})(this,i,time,this.energySys.remain,deg));
    if(this.energySys.remain===0)
      break;
    this.energySys.remain-=this.energySys.dynamic.consume*time/1000;
      this.energySys.remain=parseFloat(this.energySys.remain.toFixed(2));
      if(this.energySys.remain<0)
        this.energySys.remain=0.00;
    }

};
//飞船自毁程序
Airship.prototype.destroy=function(){
  var ship=document.getElementById('ship'+this.id);
  console.log(ship.innerHTML);
  var space=document.getElementById('space');
  space.removeChild(ship);
  //停止运行，监听指令，发送应答
  clearInterval(this.moveInt);
  clearInterval(this.cmdInt);
  clearInterval(this.rspInt);
  this.clearInt('stop');
  this.clearInt('run');
};
//飞船下次运行状态
Airship.prototype.nextMove=function(){
  this.moveInt=(function(_this){
    return setInterval(function(){
      if(_this.newCmd.command===undefined||_this.state==_this.newCmd.command)
        return;
      _this.clearInt();
      _this.state=_this.newCmd.command;
      _this.newCmd={};
      if(_this.state=='run')
        _this.run();
      else if(_this.state=='stop')
        _this.stop();
      else
        _this.destroy();
    },100);
  })(this);
};
//命令接收器
Airship.prototype.receiveCmd=function(bus){
  this.cmdInt=(function(_this,_bus){
    return setInterval(function(){
      if(_bus.getCmdOperator()!='airship')
        return;
      var cmd=_bus.readCmd();
      if(cmd===null)
        return;
      var size=cmd.length;

      for(var i=0;i<size;i++){
        var json=_this.adapter.bits2Cmd(cmd[i]);

        if(json.id==_this.id)
        {
           _this.newCmd=json;
         }
      }
    },300);
  })(this,bus);
};
//应答发射器
Airship.prototype.sendRsp=function(bus){
  this.rspInt=(function(_this,_bus){
    return setInterval(function(){
      var jrsp=jsonRsp(_this.id,_this.state,_this.remain);
      var rsp=_this.adapter.rsp2Bits(jrsp);
      _bus.writeRsp(rsp);
    },1000);
  })(this,bus);
};
//根据速度计算每度角运行时间
function calTimeEachDeg (speed,rad){
  return Math.PI*rad/speed/0.18;
}
//造船厂
function ShipFactory(){
  this.shipNum=0;
}
//点击按钮生成ship
ShipFactory.prototype.createEenergySys=function(){
  var shipboard=document.getElementById('ship-board');
  var sys=shipboard.getElementsByTagName('input');
  var size=sys.length;
  var dynamic;
  var power;
  for(var i=0;i<size;i++){
    if(sys[i].name=='dynamic-sys'){
      if(sys[i].checked){
        dynamic=JSON.parse(JSON.stringify(dynamicSys[sys[i].value]));
      }
    }
    else{
      if(sys[i].checked){
        power=JSON.parse(JSON.stringify(powerSys[sys[i].value]));
      }
    }
  }
  if(!dynamic){
    alert('please choose a dynamic system');
    return null;
  }
  if(!power){
    alert('please choose a power system');
    return null;
  }
  return new EnergySys(dynamic,power);
};
//生成ship的div节点
ShipFactory.prototype.createShipNode=function(shipId,energySys){
  var space=document.getElementById('space');
  var node=document.createElement('div');
  node.id="ship"+shipId;
  node.innerHTML='<p>'+shipId+'号: 100%</p>';
  node.style.transformOrigin=energySys.dynamic.style.transformOrigin;
  node.style.top=energySys.dynamic.style.top;
  space.appendChild(node);
};
//生成新飞船
ShipFactory.prototype.createNewShip=function(){
  var energySys=this.createEenergySys();
  if(energySys===null)
    return null;
  this.shipNum++;
  this.createShipNode(this.shipNum,energySys);
  return new Airship(this.shipNum,energySys);
};
function init(){
  var addBtn=document.getElementById('add-ship');
  var createCmder=singleton(Commander);
  var cmder=createCmder(document.getElementById('command-board'),
  document.getElementById('state-board'));
  //var createShipFac=singleton(ShipFactory);
  var shipFac=new ShipFactory();
  var bus=new Bus(0.1,300);
  var shipArr=[];
  addBtn.onclick=function(){
    var newship=shipFac.createNewShip();
    if(newship!==null)
    {
       shipArr.push(newship);
       cmder.getNewShip(newship,bus);
       bus.addShipNum();
       newship.receiveCmd(bus);
       newship.nextMove();
       newship.sendRsp(bus);
    }
  };
  cmder.sendCmd(bus);
  cmder.receiveRsp(bus);
  //cmder.clearComInfo();
}
init();
