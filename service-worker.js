chrome.bookmarks.onCreated.addListener(
  onBookmarkCreated
);

chrome.webRequest.onErrorOccurred.addListener(
  onErrorOccurred,
  {urls: ["http://*/*", "https://*/*"]}
);

/***
 * Function code below 
 * 
 **/

function onBookmarkCreated(bookmark_id, bookmark) {
  console.log('Bookmark created: ' + bookmark_id);

  var url = bookmark.url;
  var url_lower = url.toLowerCase();

  if (!url_lower.startsWith('http://') && !url_lower.startsWith('https://')) {
    console.log('Bookmark is not HTTP or HTTPS, skipping');
    return;
  }

  console.log(url);
  doArchiveRequest(url);
};

function onErrorOccurred(details) {
  //console.log('Page loading error');

  // Only catch load errors when the initial request fails (server not available, site no longer exists, etc.)
  // frameId != 0 request is not from the main/initial frame in the HTML document
  // tabId == -1 the request is not related to an open tab (for an extension, background process)
  if (details.frameId != 0 || details.tabId == -1 || details.type != 'main_frame' || details.error == 'net::ERR_ABORTED') {
    //console.log('Would not catch this error');
    return;
  }

  console.log(JSON.stringify(details, null, 4));

  var redirect_url = chrome.runtime.getURL('html/unavailable.html') + '?url=' + details.url;
  chrome.tabs.update(details.tabId, {url: redirect_url});
};

function doArchiveRequest(url) {
  fetch('https://web.archive.org/save/' + url).then(r => {
    console.log(r.status);
    return r.text();
  }).then(result => {
    console.log(result);
  });
}
