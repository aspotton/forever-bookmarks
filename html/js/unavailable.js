var query_string = window.location.search;
var url_params = new URLSearchParams(query_string);
var original_url = url_params.get('url');

document.getElementById('URL').innerHTML = original_url;
document.getElementById('IAButton').addEventListener('click', checkIA);

function checkIA() {
	document.body.style.cursor = 'wait';
	document.getElementById('IAButton').disabled = true;
	location.href = 'https://web.archive.org/web/2/' + original_url;
}