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
	var vars = {};
	$("newjs").each(function(){
		var url = $(this).attr("nj-url");
		var method = $(this).attr("nj-method");
		var object = $(this).attr("nj-object");
		
		$.ajax({
				url: url,
 				method : method,
				success:function(response){
					//alert(response["title"])
					$(":attrStartsWith('nj-')").each(function() {
						var $element = $(this);
					  $.each(this.attributes, function() {
					    // this.attributes is not a plain object, but an array
					    // of attribute nodes, which contain both the name and value
					    if(this.specified) {
					    	if(this.value.match("^"+object)){
					   			$element.text("attrStartsWith"); 		
					    	}
					    }
					  });
					});
					//$(":attrStartsWith('nj-')").find("[nj-text^="+object+"]").text("attrStartsWith");
					//$("[nj-text^="+object+"]").text("test");
				}
  		  });
		

		
	});
	
})