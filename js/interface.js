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

    function showImg() {
        console.log("showImg()");
        $("#pano").animate({
            "width":"400px",
            "background-color": "#e5e5e3"
        }, 500);
        $("#controles-wrap").animate({
            "bottom": "0",
        }, 500);
    }
    
    $(document).ready(function () {
        /* Init for maps_init.js */
        init();

        $("#localizar").click(function() {
            var enderecoValue = $("#endereco").val();
            findAddress(enderecoValue);
        });

        $("#percorrer").click(function() {
            generate();    
        });

        $("#play").click(function() {
            playCanvasAnim();    
        });

        $("#pause").click(function() {
            pauseCanvasAnim();    
        });

        $("#prev").click(function() {
            prevCanvasAnim();    
        });

        $("#next").click(function() {
            nextCanvasAnim();    
        });

        $("#gerarImagens").click(function() {
            obterImagens();    
        });

        $("#anglepicker").anglepicker({
                value: 90,
                clockwise: true,
                change: function(e, ui) {
                    updateHeadingValue(ui.value);
                },
                start: function(e, ui) {
                    
                },
                stop: function(e, ui) {
 
                }
        });
            
        $("#fov").slider({
            orientation: "horizontal",
            range: "min",
            min: 1,
            max: 180,
            value: 90,
            slide: function( event, ui ) {
                updateFovValue(ui.value);
            }
        });
           
        $("#pos_y").slider({
            orientation: "vertical",
            range: "min",
            min: -90,
            max: 90,
            value: 0,
            slide: function( event, ui ) {
                updatePositionYValue(ui.value);
            }
        });

        $("#interval").slider({
            orientation: "horizontal",
            range: "min",
            min: 10,
            max: 250,
            value: 250,
            slide: function( event, ui ) {
                updateIntervalValue(ui.value);
            }
        });
        

        $("#endereco").keypress(function(event) {
            if ( event.which == 13 ) {
                event.preventDefault();
                $('#localizar').trigger('click');
            }
        });

        $('#endereco').focus();

    });