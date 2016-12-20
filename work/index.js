$navTabsLi=$(".nav-tabs li");
$tagContainer=$(".tag-container");
containers = [
	"Algorithm",
	"Demo",
	"Tools",
];

$navTabsLi.on("click",function(e){
	if($navTabsLi.hasClass("active")){
		$navTabsLi.removeClass("active");
	}
	$(this).addClass("active");

	innerHtml = $(this).html();
	$tagContainer.removeClass("active");

	containers.forEach(function(item,index){
		if(innerHtml.search(item)>-1){
			$("#"+item.toLowerCase()).addClass("active");
		}
	})
});