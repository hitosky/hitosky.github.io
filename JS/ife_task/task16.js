function input_filter(city,aqi){
  var d=null;
  if(city===''||aqi==='')
    {
      alert('please input city name and aqi value');
      return d;
    }
  city=city.replace(/\s/g,"");

  if(city.search(/[^a-zA-z\u4e00-\u9fa5]/)>-1)
    {
      alert('city only contains chinense and english characters');
      return d;
    }
  aqi=aqi.replace(' ','');
  if(aqi.search(/\./)>-1||aqi.search(/\D/)>-1)
    {
      alert('aqi value requires integer and digital only');
      return d;
    }
  d=[];
  d.push(city);
  d.push(aqi);
  return d;
}
function addBtnHandler(){
  var city=document.getElementById('aqi-city-input');
  var aqi=document.getElementById('aqi-value-input');
  var table=document.getElementById('aqi-table');
  var data=input_filter(city.value,aqi.value);
  if(data!==null)
    {
      var trNode=document.createElement('tr');
      var tdCity=document.createElement('td');
      var cityTxt=document.createTextNode(data[0]);
      tdCity.appendChild(cityTxt);
      trNode.appendChild(tdCity);
      var tdAqi=document.createElement('td');
      var aqiTxt=document.createTextNode(data[1]);
      tdAqi.appendChild(aqiTxt);
      trNode.appendChild(tdAqi);
      var tdOp=document.createElement('td');
      var delBtn=document.createElement('button');
      var delTxt=document.createTextNode('删除');
      delBtn.appendChild(delTxt);
      tdOp.appendChild(delBtn);
      trNode.appendChild(tdOp);
      table.appendChild(trNode);
      delBtn.onclick=function(){
        this.parentNode.parentNode.parentNode.removeChild(this.
        parentNode.parentNode);
      };
    }
}

function main()
{
  var aqiData=[];
  var add=document.getElementById('add-btn');
  add.onclick=function (){
    addBtnHandler();
};

}
main();
