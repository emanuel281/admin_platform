$(document).ready(function(){

    var selected_products = {};

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

    function remove_product(product_name, res_map, $input) {

        if (res_map[product_name] !== undefined)
            delete res_map[product_name];
        
        var keys = Object.keys(res_map);        
        var str = res_map[keys[0]].product_name;

        for(var k = 1; k < keys.length; k++){            
            str += " ," + res_map[keys[k]].product_name;
        }

        return str;
    }

    function list_products($target_div, product_list) {
        
        for (var i = 0; i < product_list.length; i++) {
            // create the necessary elements
            var label= document.createElement("label");
            var description = document.createTextNode(product_list[i].product_name);
            var checkbox = document.createElement("input");

            checkbox.type = "checkbox";    // make the element a checkbox
            checkbox.name = "slct[]";      // give it a name we can check on the server side
            checkbox.value = product_list[i].product_name;         // make its value "pair"

            label.appendChild(checkbox);   // add the box to the element
            label.appendChild(description);// add the description to the element

            // add the label element to your div
            $target_div[0].appendChild(label);
        }

    }

    if($('#products').length){
        $.get('/api/products', function(options){

            list_products($("#product_list"), options);
                
            var curr_prods = [];
            $('#products').val(JSON.stringify(options));

            var returned = "";
            returned = add_product(options[0], selected_products, $('#products'));
            returned = add_product(options[1], selected_products, $('#products'));
            
            returned = remove_product(options[0].product_name, selected_products, $('#products'));
            returned = add_product(options[0], selected_products, $('#products'));

            $("#products").val(returned);

            list_products($("#list-here"), options);

        });
    };

    $("#products").click(function(){
        console.log("Nothing to see here...")
        $("#productsList").modal("show");
    });
});