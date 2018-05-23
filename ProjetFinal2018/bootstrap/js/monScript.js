$('.zoom').hover(zoom, nozoom);

function zoom() {
    $(this).css('transform', 'scale(1.1)')
}
function nozoom() {
    $(this).css('transform', 'scale(1)')
}

$('#Imperial').hide();
$('#Gardien').hide();
$('#check4').change(function(){
    if(this.checked)
        $('#Imperial').show();
    else
        $('#Imperial').hide();
});
$('#check').change(function(){
    if(this.checked)
        $('#Gardien').show();
    else
        $('#Gardien').hide();
});

$('#racedomaine').hide();
$('#racepacte').hide();
$('#racelegion').hide();
$( "#alliance" ).change(function() {
    if ($('#alliance option:selected').val() == "Alliance de Daguefilante") {
        $('#racealliance').show();
        $('#racedomaine').hide();
        $('#racepacte').hide();
        $('#racelegion').hide();
        $('#covenant').change(function () {
            if ($('#covenant option:selected').val() == "Breton" ) {
                $('#image').attr('src','medias/motifbreton.jpg');
            }
            if ($('#covenant option:selected').val() == "Rougegarde" ) {
                $('#image').attr('src','medias/motifrougegarde.jpg');
            }
            if ($('#covenant option:selected').val() == "Orque (Orsimer)" ) {
                $('#image').attr('src','medias/motiforque.jpg');
            }
        });
    }
    if ($('#alliance option:selected').val() == "Domaine Aldmeri") {
        $('#racealliance').hide();
        $('#racedomaine').show();
        $('#racepacte').hide();
        $('#racelegion').hide();
        $('#dominion').change(function () {
            if ($('#dominion option:selected').val() == "Haut Elfe (Altmer)" ) {
                $('#image').attr('src','medias/motifaltmer.jpg');
            }
            if ($('#dominion option:selected').val() == "Elfe des bois (Bosmer)" ) {
                $('#image').attr('src','medias/motifbosmer.jpg');
            }
            if ($('#dominion option:selected').val() == "Khajiit" ) {
                $('#image').attr('src','medias/motifkhajiit.jpg');
            }
        });
    }
    if ($('#alliance option:selected').val() == "Pacte de Coeurébène") {
        $('#racealliance').hide();
        $('#racedomaine').hide();
        $('#racepacte').show();
        $('#racelegion').hide();
        $('#pact').change(function () {
            if ($('#pact option:selected').val() == "Argonien" ) {
                $('#image').attr('src','medias/motifargonien.jpg');
            }
            if ($('#pact option:selected').val() == "Nordique" ) {
                $('#image').attr('src','medias/motifnordique.jpg');
            }
            if ($('#pact option:selected').val() == "Elfe noir (Dunmer)" ) {
                $('#image').attr('src','medias/motifdunmer.jpg');
            }
        });
    }
    if ($('#alliance option:selected').val() == "Légion Impériale (DLC)") {
        $('#racealliance').hide();
        $('#racedomaine').hide();
        $('#racepacte').hide();
        $('#racelegion').show();
        $('#image').attr('src','medias/motifimperial.jpg');
    }
});