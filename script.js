$('input#pinyin').pinyin();

$('#main > div').hide()
$('#getPlugin').show();

$('header a').bind('click', function(e) {
    
    e.preventDefault();
    
    var pageToShow = $(this).attr('href');
    
    $('header a').addClass('inactive');
    $(this).removeClass('inactive');
    
    $('#main > div').hide()
    $(pageToShow).show();
    
})