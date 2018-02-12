jQuery.extend(jQuery.expr[':'], {
    attrStartsWith: function (el, _, b) {
        for (var i = 0, atts = el.attributes, n = atts.length; i < n; i++) {
            if(atts[i].nodeName.toLowerCase().indexOf(b[3].toLowerCase()) === 0) {
                return true; 
            }
        }
        
        return false;
    }
});
$(function(){
	
	$.ajaxSetup({async: false});
	var vars = {};
	$("newjs").each(function(){
		var url = $(this).attr("url");
		var method = $(this).attr("method");
		var object = $(this).attr("object");
		
		$.ajax({
				url: url,
 				method : method,
				success:function(response){
					//We add result to the vars array
					//var r =response;
					eval("window."+object+"=response");
					//For each element having 
					
				}
  		  });
		

		
	});
	$(":attrStartsWith('nj-')").each(function() {
		var $element = $(this);
		$.each(this.attributes, function() {
	  	if(this.specified) {
	    	if(this.name.match("^nj-")){
	    		evaluateExpression($element, this.name, this.value);
	   					
	    	}
	    }
	  });
	});
});
function evaluateExpression(element,attribute, expression){
	switch (attribute) {
		case "nj-text":
			evaluateText(element, expression);
			break;
		case "nj-if":
			evaluateIf(element, expression);
			break;
		case "nj-class":
			evaluateClass(element, expression);
			break;
		case "nj-each":
			evaluateEach(element,expression);
			break;

	}
}
function evaluateText(element,expression){
	var text ;
	try{
		text = eval(expression);
		element.text(text);
	}
	catch(e){
		alert("Error occured");
	}
	
}
function evaluateIf(element,expression){
	try{
		var result = eval(expression);
		if(!result){
			element.remove();
		}
	}
	catch(e){
		alert("Error occured");
	}

}
function evaluateClass(element,expression){
	try{
		var result = eval(expression);
		element.attr("class",result);
	}
	catch(e){
		alert("Error occured");
	}

}
function evaluateEach(__element, expression){
	var variable = expression.split(":")[0].trim();
	var listName = expression.split(":")[1].trim();
	var __list = eval(listName);
	var $__parent = __element.parent();
	$__parent.html("");
	__element.removeAttr("nj-each");
	for(var i=0; i<__list.length;i++){
		$__newElement = __element.clone();
		eval("window."+variable+"=__list["+i+"]");
		$__parent.append($__newElement);
		$__newElement.each(function() {
		$.each(this.attributes, function() {
	  	if(this.specified) {
	    	if(this.name.match("^nj-")){
	    		evaluateExpression($__newElement, this.name, this.value);
	   					
	    	}
	    }
	  });
	});
		
		
	}
	//alert(listName);
	//alert(eval(variable));

}