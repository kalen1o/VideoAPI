var server = 'https://www.googleapis.com';

/*var xhr = new XMLHttpRequest();
xhr.open('GET', `${server}/books/v1/volumes?q=harry+potter`, true);
xhr.send();

xhr.onreadystatechange = function() {
	console.log(xhr.readyState);
	if(xhr.readyState != 4) return;
	
	let response = JSON.parse(xhr.responseText);
	console.log('response', response)
};*/
'use strict';

let $searchFormElement = $('#search-form');

$searchFormElement.on('submit', function(event) {
	event.preventDefault();

	let value = $('[name="search-value"]', this).val();

	value = value.trim();

	if(!value) return;

	sendRequest(value);
});
let booksList = [],
	$bookInfoElement = $('#book-info');	;

function sendRequest(queryString) {
	var request = $.ajax(`${server}/books/v1/volumes?q=${queryString}&maxResults=20`);

	let $booksListElement = $('#books-list');

	request.done(response => {
		booksList = response.items;
		console.log('response', response);
		$booksListElement.empty();

		booksList.forEach(book => {
		// console.log(book)
			$('<a>')
				.attr({'href': '', 'data-id': book.id})
				.addClass('list-group-item')
				.text(book.volumeInfo.title)
				.appendTo($booksListElement);
		});
	}).fail(error => {
	console.log('error', error);
	alert(error.responseJSON.error.message);
	});
}; 

$('body').on('click', '[data-id]', function(event) {
	event.preventDefault();

	let id = $(this).data('id');
	console.log(id);
	let bookData = booksList.find(element => element.id === id);
	console.log(bookData);

	let $p = $('<p>').text(bookData.volumeInfo.description),
		$a = $('<a>').attr('href', bookData.volumeInfo.previewLink).text('Read more...').attr('target', '_blank');

	$bookInfoElement
		.hide()
		.fadeIn()
		.find('.book-heading')
			.text( `${bookData.volumeInfo.title} | ${bookData.volumeInfo.authors.join(', ')} (${bookData.volumeInfo.publishedDate})` )
			.end()
		.find('.book-body')
			.empty()
			.append('<img class="pull-left" src="' + bookData.volumeInfo.imageLinks.smallThumbnail + '">')
			.append($p)
			.append($a);
});