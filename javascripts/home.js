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
	this.url='##'
}
//所有文章,按日期存储
var articleList=[
new Article('css1',categoryList[1],'|2016.4.30'),
new Article('css2',categoryList[1],'|2016.4.29'),
new Article('js1',categoryList[2],'|2016.4.28'),
new Article('js2',categoryList[2],'|2016.4.27'),
new Article('css3',categoryList[1],'|2016.4.27'),
new Article('css4',categoryList[1],'|2016.4.26'),
new Article('js5',categoryList[2],'|2016.4.26'),
new Article('js6',categoryList[2],'|2015.4.25'),
new Article('js7',categoryList[2],'|2016.4.24'),
new Article('js8',categoryList[2],'|2016.3.24'),
new Article('js9',categoryList[2],'|2016.4.23'),
new Article('js9',categoryList[2],'|2016.4.22'),
new Article('js9',categoryList[2],'|2016.4.21'),
new Article('js9',categoryList[2],'|2016.4.13'),
new Article('js9',categoryList[2],'|2016.4.8'),
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
			$(articleId+' .title').attr('href','123');
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
		alert(startIndex);
		generatorArticleList(category,titleNum);
	});
	$('#next').click(function(){
		if(startIndex>=articleList.length)
			return;
		var category=$('#theme').text();	
		generatorArticleList(category,titleNum);
	});
	
});

