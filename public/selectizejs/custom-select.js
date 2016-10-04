$(document).ready(function(){

    var selected_products = {};
    var selected_products_string = "";

    function add_product(product, res_map, $input){

        if (res_map[product.product_name] == undefined)
            res_map[product.product_name] = product;
        
        var keys = Object.keys(res_map);        
        var str = res_map[keys[0]].product_name;

        for(var k = 1; k < keys.length; k++){            
            str += " ," + res_map[keys[k]].product_name;
        }

        return str;
    }

    function remove_product(product, res_map, $input) {

        if (res_map[product.product_name] !== undefined)
            delete res_map[product.product_name];
        
        var keys = Object.keys(res_map);        
        var str = res_map[keys[0]].product_name;

        for(var k = 1; k < keys.length; k++){            
            str += " ," + res_map[keys[k]].product_name;
        }

        return str;
    }

    function list_products($target_div, product_list) {
        
        $target_div[0].innerHTML = "";

        for (var i = 0; i < product_list.length; i++) {

            if ((product_list[i].product_name).replace(/\s/g, '').length){
            
                // create the necessary elements
                var label= document.createElement("label");
                var description = document.createTextNode(product_list[i].product_name);
                var checkbox = document.createElement("input");
    
                checkbox.type = "checkbox";    // make the element a checkbox
                checkbox.name = "slct[]";      // give it a name we can check on the server side
                checkbox.value = JSON.stringify(product_list[i]);         // make its value "pair"
    
                label.appendChild(checkbox);   // add the box to the element
                label.appendChild(description);// add the description to the element
    
                // add the label element to your div
                $target_div[0].appendChild(label);
            }
        }

    }

    if($('#products').length){
        // $.get('/api/products', function(options){

                
        //     var curr_prods = [];
        //     // $('#products').val(JSON.stringify(options));

        //     var selected_products_string = "";
        //     list_products($("#list-here"), options);

        //     $('input:checkbox').change(
        //         function(){
        //             if ($(this).is(':checked')) {
        //                 selected_products_string = add_product(this.value, selected_products, $('#products'));
        //             }
        //             else if(!$(this).is(':checked')){
        //                 selected_products_string = remove_product(this.value, selected_products, $('#products'));
        //             }
        //         });

        //     $("#products").val(selected_products_string);

        // });
    };

    $("#products").click(function(){
        $.get('/api/products', function(options){

                
            var curr_prods = [];
            
            list_products($("#list-here"), options);


            console.log("Nothing to see here...")
            $("#productsList").modal("show");

            $('input:checkbox').change(
                function(){
                    if ($(this).is(':checked')) {
                        var this_value = JSON.parse(this.value);
                        console.log(this_value);
                        selected_products_string = add_product(this_value, selected_products, $('#products'));
                    }
                    else if(!$(this).is(':checked')){
                        var this_value = JSON.parse(this.value);
                        selected_products_string = remove_product(this_value, selected_products, $('#products'));
                    }

                    $("#save-products").click(function(){
                        $("#products").val(selected_products_string);
                    });
                });

        });
    });
});