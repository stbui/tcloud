define(function() {
	var pageCatch = function() {
		if(window.website_Catch != void 0){
			return window.website_Catch;
		}
		window.website_Catch = this;
	};

	function userAction(htmlHeader ,htmlData ,htmlFooter){
		this.htmlHeader = htmlHeader || '';
		this.htmlCenter = htmlData || '';
		this.htmlFooter = htmlFooter || '';
	}

	pageCatch.prototype = {
		userActionCatchCancel : [],
		userActionCatchBack : [],
		catchPush : function(){
			var htmlHeader = $('#HTMLDATAHEADER .wqdView').html();
			var htmlData = $('#HTMLDATACENTER .wqdView').html();
			var htmlFooter = $('#HTMLDATAFOOTER .wqdView').html();
			var action = new userAction(htmlHeader, htmlData, htmlFooter);
			this.userActionCatchCancel.push(action);
		},
		clear : function(){
			this.userActionCatchCancel = [];
			this.userActionCatchBack = [];
		},
		Cancel : function(){
			if(this.userActionCatchCancel.length>1){
				var now = this.userActionCatchCancel.pop(),	last = this.userActionCatchCancel[this.userActionCatchCancel.length-1];
				this.userActionCatchBack.push(now);
				return [last,this.userActionCatchCancel.length];
			}
		},
		Back : function(){
			if(this.userActionCatchBack.length>0){
				var now = this.userActionCatchBack.pop();
				this.userActionCatchCancel.push(now);
				return now;
			}
		},
		getCancel : function(){
			return this.userActionCatchCancel[this.userActionCatchCancel.length-1];
		},
		getCancelLength : function(){
			return this.userActionCatchCancel.length;
		}
	}
	return new pageCatch();
});
