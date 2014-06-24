/**
* formatDate
*
* Formats a datetime object into day with suffix and calendar month
*/
function formatDate(date) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var prettyDate = new Date(date);
    var month = months[prettyDate.getMonth()];
    var day = prettyDate.getDate();
    switch((day + '').slice(-1)) {
    case '1':
        day = day + 'st';
        break;
    case '2':
        day = day + 'nd';
        break;
    case '3':
        day = day + 'rd';
        break;
    default:
        day = day + 'th';
        break;
    }

    return { day: day, month: month };
}

$(document).ready(function() {

    $.get('/api/count')
    .done(function(data) {

        var pollen = data.count;
        $('.mega').text(pollen);
        pollen = pollen.toLowerCase().replace(' ', '');
        $('html, body').addClass(pollen);

        var date = formatDate(data.date);

        $('.date').text(date.day + ' ' + date.month);
    })
    .fail(function() {
        $('.mega').text('Unknown');
        $('.main').append('<p>Refresh to try again.</p>');
    });
});
