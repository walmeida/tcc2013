    var urlBaseApi = "http://maps.googleapis.com/maps/api/streetview";
    var url = "";
    var contador = 0;
    
    function mostrarImagem(endereco){
        var size = "400x300";
        var enderecoValue = encodeURI(endereco);
        var headingValue = $("#sentido").val();
        var fovValue = $("#horizontal").val();
        var pitchValue = $("#vertical").val();
        contador++;
        $("#utilizacoes").html("Visualizações: " + contador);
        url = urlBaseApi + "?size=" +size+ "&location=" +enderecoValue+ "&heading=" +headingValue+ "&fov=" +fovValue+ "&pitch=" +pitchValue+ "&sensor=false";
        return url;
    }
    
    $(document).ready(function () {
        /* Init for maps_init.js */
        init();

        $("#enviar").click(function() {
            var enderecoValue = $("#endereco").val();
            findAddress(enderecoValue);
            url = mostrarImagem(enderecoValue);
            $("#imgResultado").attr("src", url);
        });

        $("#percorrer").click(function() {
            var passo = $("#passo").val();
            var numeroDeImagens = $("#numeroDeResultados").val();
            var sentido = $("#sentido").val();
            var str = $("#endereco").val();
            var padrao = /[0-9]+/i;
            var numero = parseInt(str.match(padrao));

            if(sentido <= 180){
                passo = passo * (-1);
            }

            $("#divImagens").empty();
            var enderecoValue = $("#endereco").val();
            
            for (var i = 0; i < numeroDeImagens; i++) {
                var numeroAntigo = numero;
                numero = numero + passo;
                enderecoValue = enderecoValue.replace(numeroAntigo, numero);
                url = mostrarImagem(enderecoValue);
                imgHtml = '<img id="resultado' +i+ '" class="imgResultados" src="' +url+ '" />';
                $("#divImagens").append(imgHtml);    
            }

            generate();    
        });

        $("#anglepicker").anglepicker({
                value: 90,
                clockwise: true,
                change: function(e, ui) {
                    
                },
                start: function(e, ui) {
                    
                },
                stop: function(e, ui) {
                    $("#sentido").val(ui.value);
                    $('#enviar').trigger('click');
                }
        });
        $("#sentido").val( $("#anglepicker").anglepicker("value") );
        
    
        $("#slider").slider({
            orientation: "horizontal",
            range: "min",
            min: 20,
            max: 120,
            value: 60,
            slide: function( event, ui ) {
                $("#horizontal").val( ui.value );
            }
        });
        $("#horizontal").val( $("#slider").slider("value") );

    
        $("#slider-vertical").slider({
            orientation: "vertical",
            range: "min",
            min: -90,
            max: 90,
            value: 0,
            slide: function( event, ui ) {
                $("#vertical").val( ui.value );
            }
        });
        $("#vertical").val( $("#slider-vertical").slider("value") );


        $("#endereco").keypress(function(event) {
            if ( event.which == 13 ) {
                event.preventDefault();
                $('#enviar').trigger('click');
            }
        });

        $("#numeroDeResultados").keypress(function(event) {
            if ( event.which == 13 ) {
                event.preventDefault();
                $('#percorrer').trigger('click');
            }
        });

        $('#endereco').focus();

    });