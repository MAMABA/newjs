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
	//$.ajaxSetup({async: false});
	
	var config = {

	};

	if($("nj-config") != undefined){
		var configFile = $("nj-config").attr("url");
		if(configFile != undefined){
			$.ajax({
					url: configFile,
					dataType: "json",
					async: false,
					success:function(data){
						$.each(data, function( key, val ) {
						 	config[""+key] = val;
						 })
					}
	  		  });
		}	
	}
	
	
	$("nj-object").each(function(){
		var url = $(this).attr("url");
		var method = $(this).attr("method");
		var object = $(this).attr("object");
		
		$.ajax({
				url: url,
 				method : method,
				async: false,
				success:function(response){
					eval("window."+object+"=response"); 
					
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
function evaluateExpression(__element,__attribute, __expression){
	
	switch (__attribute) {
		case "nj-text":
			evaluateText(__element, __expression);
			break;
		case "nj-if":
			evaluateIf(__element, __expression);
			break;
		case "nj-class":
			evaluateClass(__element, __expression);
			break;
		case "nj-each":
			evaluateEach(__element,__expression);
			break;
		case "nj-value":
			evaluateValue(__element,__expression);
			break;
		case "nj-attr":
			evaluateAttr(__element,__expression);
			break;
		case "nj-include":
			evaluateInclude(__element,__expression);
			break;
		case "nj-href":
			evaluateHref(__element,__expression);
			break;
		case "nj-id":
			evaluateId(__element,__expression);
			break;
		case "nj-name":
			evaluateName(__element,__expression);
			break;
		case "nj-placeholder":
			evaluatePlaceholder(__element,__expression);
			break;


	}

	
}
function evaluateElement(__element){
	__element.each(function() {
		$.each(this.attributes, function() {
	  	if(this.specified) {
	    	if(this.name.match("^nj-")){
	    		evaluateExpression(__element, this.name, this.value);
	   					
	    	}
	    }
	  });
	});
	__element.children().each(function() {
		evaluateElement($(this));
	});
}
//This function try to evaluate the expression and give the result
function getResultFromExpression(__expression){
	var result ;
	try{
		result = eval(__expression);
		return result;
	}
	catch(e){
		alert("Error occured");
	}

}

function evaluateText(__element,__expression){
	var text = getResultFromExpression(__expression);
	__element.text(text);
	
}
function evaluateIf(__element,__expression){
	var result = getResultFromExpression(__expression);
	if(!result){
		__element.remove();
	}

}
function evaluateClass(__element,__expression){
	var result =  getResultFromExpression(__expression);
	__element.attr("class",result);

}
function evaluateName(__element,__expression){
	var result =  getResultFromExpression(__expression);
	__element.attr("name",result);

}
function evaluatePlatceholder(__element,__expression){
	var result =  getResultFromExpression(__expression);
	__element.attr("placeholder",result);

}
function evaluateValue(__element,__expression){
	var result =  getResultFromExpression(__expression);
	__element.val(result);
}
function evaluateAttr(__element,__expression){
	var __attrName = __expression.split(":")[0].trim();
	var __attrValue = __expression.split(":")[1].trim();
	var result = getResultFromExpression(__attrValue);
	__element.attr(__attrName,result);
}
function evaluateInclude(__element,__expression){
	var __page = __expression.split(":")[0].trim();
	var __fragment = __expression.split(":")[1].trim();
	__element.load(__page + " [nj-fragment='"+__fragment+"']")
	
}
function evaluateHref(__element,__expression){
	var result =  getResultFromExpression(__expression);
	__element.attr("href",result);
}
function evaluateId(__element,__expression){
	var result =  getResultFromExpression(__expression);
	__element.attr("id",result);
}
function evaluateEach(__argElement, __expression){
	var __variable = __expression.split(":")[0].trim();
	var __listName = __expression.split(":")[1].trim();
	var __list = getResultFromExpression(__listName);
	var $__parent = __argElement.parent();
	var __element = __argElement;
	__argElement.remove();
	__element.removeAttr("nj-each");
	for(var i=0; i<__list.length;i++){
		$__newElement = __element.clone();
		eval("window."+__variable+"=__list["+i+"]");
		$__parent.append($__newElement);
		evaluateElement($__newElement);

		
		
	}

}