$(document).ready(function(){

    $('#product-list').click(function(){
        $.get('/api/products', function(options){

            var docFrag = document.createDocumentFragment();

            for(var i = 0; i < options.length; i++){

                var newDiv = document.createElement('div');
                newDiv.className = 'col-lg-2';
                
                var input = document.createElement('input');
                input.type = 'checkbox';
                input.value = options[i].product_name;
                newDiv.appendChild(input);

                docFrag.appendChild(newDiv);

            }

            document.getElementsByTagName('body')[0].appendChild(docFrag);
            
        });
    });

});