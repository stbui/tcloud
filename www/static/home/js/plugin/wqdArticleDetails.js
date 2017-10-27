$(function() {
    $(".wqdelementEdit.articleDetails .artDetlFollow svg").one("click",function (e) {
        var $this = $(this),
            newsId = $(this).parents(".wqdelementEdit.articleDetails").attr("data-articledetailsid") || "";
        $.post("/fixed/news/review?newsId="+newsId+"&type=fav", function(data, textStatus, xhr) {
            var num = parseInt($this.next("span").text(),10);
            data.msg == "success" && $this.find("path").attr("fill",$this.parents(".artDetlFollow").attr("data-hover-color") || "red").end().next("span").text(++num);
        });
    })
});
