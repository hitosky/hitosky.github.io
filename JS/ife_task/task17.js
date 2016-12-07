

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = '';
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}
/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/
var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: '北京',
  nowGraTime: "day"
};
//图表矩形颜色
function randomColor(){
  var r=Math.floor(Math.random()*255).toString();
  var g=Math.floor(Math.random()*255).toString();
  var b=Math.floor(Math.random()*255).toString();
  return 'rgb('+r+','+g+','+b+')';
}
/**
 * 渲染图表
 */
function renderChart() {
  var chart_wrap = document.getElementById('aqi-chart-wrap'); //获取表格区的内容

      var now_select_city = pageState["nowSelectCity"]; //当前选择城市
      var now_gra_time = pageState["nowGraTime"]; //当前选择的粒度,默认是day
      var graData = chartData[now_gra_time][now_select_city];


      //设置HTML样式模板
      var style = "style='float:left;width:{width};height:{height};background-color:{color}'";
      var title = "title = {title}的空气质量数值为：{data}";
      var module = "<div " + style + title + " ></div>";

      var html = "";
      for (var x in graData) {
          html += module.replace('{width}', graData[x]['width']).replace('{height}', graData[x]['height']).replace('{color}', graData[x]['color']).replace('{title}', graData[x]['title']).replace('{data}', graData[x]['data']); //调用5次replace()方法动态设置浏览器元素为数据组里的数据
      }
      chart_wrap.innerHTML = html;

}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(e) {
  // 确定是否选项发生了变化
  if(pageState.nowGraTime==e.target.value)
    return false;
  // 设置对应数据
  pageState.nowGraTime=e.target.value;
  // 调用图表渲染函数
  renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange(e) {
  // 确定是否选项发生了变化
  if(pageState.nowSelectCity==e.target.value)
    return false;
  // 设置对应数据
  pageState.nowSelectCity=e.target.value;
  // 调用图表渲染函数
  renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var time=document.getElementById("form-gra-time");
  time.addEventListener('change',graTimeChange,false);
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var html='';
  for(var city in aqiSourceData)
  {
    html+='<option>'+city+'</option>';
  }
  var select=document.getElementById('city-select');
  select.innerHTML=html;
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  select.addEventListener('change',citySelectChange,false);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中

  var day = {}; //创建天为单位的数组

      var week = {}; //创建周为单位的数组
      var weekNum = 1; //计数多少周
      var weekTotal = 0;
      var weekDays = 0; //满7为一个自然周

      var month = {}; //创建月为单位的数组
      var monthNum = 1;
      var monthTotal = 0; //一个月的总的空气指数

      for (var city in aqiSourceData) { //city是城市
          //先遍历声明日、周、月的数组
          day[city] = {};
          week[city] = {};
          month[city] = {};
          for (var date in aqiSourceData[city]) { //再次遍历，把每个城市对应的数据挑出来,data是每一天的日期
              var sourceData = aqiSourceData[city][date]; //aqiSourceData[city][date]是每个城市的每天空气质量的数据

              /*每日数据*/
              var dayGet = {}; //声明一个数组暂时存放需要的数据
              dayGet['data'] = sourceData; //把数据赋给date属性
              dayGet['height'] = sourceData * 0.75 + "px"; //把数据值乘以0.75赋给height，给以后动态调用
              dayGet['width'] = '10px'; //每日数据的宽度设为10px
              dayGet['color'] = randomColor();
              dayGet['title'] = city + date; //传入当前的城市和日期


              day[city][date] = dayGet; //把dayGet所获得的动态数组赋给day数组的当前值

              /*每周数据*/
              weekTotal += sourceData;
              if (weekDays == 7 || date == '2016-03-31') {
                  var weekData = (weekTotal / 7).toFixed(2);

                  var key = "第" + weekNum + "周";
                  var weekGet = {}; //声明一个数组暂时存放需要的数据
                  weekGet['data'] = weekData; //把数据赋给date属性
                  weekGet['height'] = weekData * 0.75 + "px"; //把数据值乘以0.75赋给height，给以后动态调用
                  weekGet['width'] = '50px'; //每日数据的宽度设为10px
                  weekGet['color'] = randomColor();
                  weekGet['title'] = city + key; //传入当前的城市和日期

                  week[city][key] = weekGet; //把dayGet所获得的动态数组赋给day数组的当前值
                  weekTotal = 0;
                  weekDays = 0;
                  weekNum++;
              }
              weekDays++;
              /*每月数据*/
              monthTotal += sourceData;
              if (date == '2016-01-31' || date == '2016-03-31' || date == '2016-02-29') {
                  if (date == '2016-02-29') {
                      var monthData = (monthTotal / 29).toFixed(2);
                  } else {
                      var monthData = (monthTotal / 31).toFixed(2);
                  }
                  var key = "第" + monthNum + "月";
                  var monthGet = {}; //声明一个数组暂时存放需要的数据
                  monthGet['data'] = monthData; //把数据赋给date属性
                  monthGet['height'] = monthData * 0.75 + "px"; //把数据值乘以0.75赋给height，给以后动态调用
                  monthGet['width'] = '50px'; //每日数据的宽度设为10px
                  monthGet['color'] = randomColor();
                  monthGet['title'] = city + key; //传入当前的城市和日期

                  month[city][key] = monthGet;
                  monthTotal = 0;
                  monthNum++;
              }
          }
          //周数和月数初始化，否则轮到上海周数据的时候第一周就显示成10多周了
          monthNum = 1;
          weekNum = 1;
      }
      chartData.day = day;
      chartData.week = week;
      chartData.month = month;

}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm();
  initCitySelector();
  initAqiChartData();
}

init();
