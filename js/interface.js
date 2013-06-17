    var urlBaseApi = "http://maps.googleapis.com/maps/api/streetview";
    var url = "";
    var contador = 0;
    
    $(document).ready(function () {
        $("#enviar").click(function() {
            var size = "400x300";
            var enderecoValue = encodeURI($("#endereco").val());
            var headingValue = $("#sentido").val();
            var fovValue = $("#horizontal").val();
            var pitchValue = $("#vertical").val();
            url = urlBaseApi + "?size=" +size+ "&location=" +enderecoValue+ "&heading=" +headingValue+ "&fov=" +fovValue+ "&pitch=" +pitchValue+ "&sensor=false";
            console.log = url;
            $("#imgResultado").attr("src", url);
            contador++;
            $("#utilizacoes").html("Visualizações: " + contador);
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

        $('#endereco').focus();

    });