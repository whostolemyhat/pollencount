/* pollencount
*//* v0.0.1
*//* whostolemyhat
*//* Last updated: 24-06-2014 */
function formatDate(a){var b=["January","February","March","April","May","June","July","August","September","October","November","December"],c=new Date(a),d=b[c.getMonth()],e=c.getDate();switch((e+"").slice(-1)){case"1":e+="st";break;case"2":e+="nd";break;case"3":e+="rd";break;default:e+="th"}return{day:e,month:d}}$(document).ready(function(){$.get("/api/count").done(function(a){var b=a.count;$(".mega").text(b),b=b.toLowerCase().replace(" ",""),$("html, body").addClass(b);var c=formatDate(a.date);$(".date").text(c.day+" "+c.month)}).fail(function(){$(".mega").text("Unknown"),$(".main").append("<p>Refresh to try again.</p>")})});