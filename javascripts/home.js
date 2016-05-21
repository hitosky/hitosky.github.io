//所有目录项
var categoryList=[
'Home',
'CSS',
'Javascript',
'Algorithm'
]

function Article(title,category,strDate,url){
	this.title=title;
	this.category=category;
	this.date=strDate;
	this.url=url
}
//所有文章,按日期存储
var articleList=[
new Article('闭合浮动',categoryList[1],'|2016.4.8','CSS/clearfix.html'),
new Article('ife_task3',categoryList[1],'|2016.5.10','CSS/ife_task/task3.html'),
new Article('ife_task4',categoryList[1],'|2016.5.10','CSS/ife_task/task4.html'),
new Article('ife_task6',categoryList[1],'|2016.5.10','CSS/ife_task/task6.html'),
new Article('ife_task8',categoryList[1],'|2016.5.10','CSS/ife_task/task8.html'),
new Article('ife_task10',categoryList[1],'|2016.5.10','CSS/ife_task/task10.html'),
new Article('ife_task12',categoryList[1],'|2016.5.10','CSS/ife_task/task12.html'),
new Article('ife_task13',categoryList[2],'|2016.5.21','JS/ife_task/task13.html'),
new Article('ife_task14',categoryList[2],'|2016.5.21','JS/ife_task/task14.html'),
new Article('ife_task15',categoryList[2],'|2016.5.21','JS/ife_task/task15.html'),
new Article('ife_task16',categoryList[2],'|2016.5.21','JS/ife_task/task16.html'),
new Article('ife_task17',categoryList[2],'|2016.5.21','JS/ife_task/task17.html'),
new Article('ife_task18',categoryList[2],'|2016.5.21','JS/ife_task/task18.html'),
new Article('ife_task22',categoryList[2],'|2016.5.21','JS/ife_task/task22.html'),
new Article('ife_task28',categoryList[2],'|2016.5.21','JS/ife_task/task28.html'),
new Article('BFC块级格式上下文',categoryList[1],'|2016.5.21','CSS/BFC.html'),
new Article('JS EC与VO',categoryList[2],'|2016.5.21','JS/JS EC+VO.html'),
new Article('JS this的指向',categoryList[2],'|2016.5.21','JS/JS this.html'),
new Article('JS 原型prototype',categoryList[2],'|2016.5.21','JS/JS prototype.html'),
];
var pageNum=0;
var startIndex=0;//在当前页码下,category在articleList中的起始位置
//找到某个category在articleList中的起始位置
function findIndex(category){
	if(category=='Home')
		return 0;
	var i;
	for(i=0;i<articleList.length;i++)
		if(articleList[i].category==category)
			return i;
}
function sortByCty(category){
	articleList.sort(function(a,b){
			if(a.category!=category&&b.category==category)
				return 1;
			else
				return -1;
		});
}
//对article的date进行处理，便于排序
function dateFormat(date){
	var d=date.replace(/\|/,' ');
	
	var dd=d.split('.');
	for(var i in dd){
		dd[i]=parseInt(dd[i]);
		
	}
	return dd;
}
//根据article的date进行排序
function sortByDate(){
	articleList.sort(function(a,b){
		var d1=dateFormat(a.date);
		var d2=dateFormat(b.date);
		for(var i=0;i<d1.length;i++ )
		{
			if(d1[i]<d2[i])
				return 1;
		}
		return -1;
	});
}
//生成某一页article list ,先hide原先的article,然后再fadeIn
function generatorArticleList(category,titleNum){
	var i;
	var articleId;
	//隐藏当前界面的articleList
	for(i=0;i<titleNum;i++)
	{
		articleId='#article'+(i+1).toString();
		$(articleId).hide();
	}
	//对于'Home'
	if(category=='Home')
	{
		for(i=0;i<titleNum;i++,startIndex++)
		{
			
			if(startIndex>=articleList.length)
				break;
			articleId='#article'+(i+1).toString();
			$(articleId+' .title').text(articleList[startIndex].title);
			$(articleId+' .title').attr('href',articleList[startIndex].url);
			$(articleId+' .date').text(articleList[startIndex].date);
			$(articleId+' .category').text(articleList[startIndex].category);
			$(articleId).fadeIn(1000);
		}
	}
	//对于其他category
	else{	
		for(i=0;i<titleNum;startIndex++)
		{
			if(startIndex>=articleList.length)
				break;
			if(articleList[startIndex].category==category)
			{
				articleId='#article'+(i+1).toString();
				$(articleId+' .title').text(articleList[startIndex].title);
				$(articleId+' .title').attr('href',articleList[startIndex].url);
				$(articleId+' .date').text(articleList[startIndex].date);
				$(articleId+' .category').text(articleList[startIndex].category);
				$(articleId).fadeIn(1000);
				i++;				
			}
		}
	}
	//页码加1
	pageNum++;
}
$(document).ready(function(){
	var titleNum=$('#article li').toArray().length;
	sortByDate();
	generatorArticleList('Home',titleNum);
	$('#article').fadeIn(2000);
	$('#Home').click(function(){
		$('#theme').text($('#Home').text());
		pageNum=0;
		startIndex=0;
		sortByDate();
		generatorArticleList('Home',titleNum);
	});
	$('#CSS').click(function(){
		$('#theme').text($('#CSS').text());
		pageNum=0;
		startIndex=0;
		sortByCty('CSS');
		generatorArticleList('CSS',titleNum);
		
	})
	$('#Javascript').click(function(){
		$('#theme').text($('#Javascript').text());
		var category=$('#theme').text();
		pageNum=0;	
		//startIndex=findIndex('Javascript');
		startIndex=0;
		sortByCty('Javascript');
		generatorArticleList('Javascript',titleNum);
		
	});
	$('#Algorithm').click(function(){
		$('#theme').text($('#Algorithm').text());
		pageNum=0;
		startIndex=0;
		sortByCty('Algorithm');
		generatorArticleList('Algorithm',titleNum);

	});
	$('#back').click(function(){
		if(pageNum==1)
			return;
		pageNum-=2;
		var category=$('#theme').text();
		startIndex=pageNum*titleNum;
		generatorArticleList(category,titleNum);
	});
	$('#next').click(function(){
		if(startIndex>=articleList.length)
			return;
		var category=$('#theme').text();	
		generatorArticleList(category,titleNum);
	});
	
});

