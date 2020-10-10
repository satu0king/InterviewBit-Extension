chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === 'complete') {
      clearInterval(readyStateCheckInterval);

      const leetcodeDataUrl = chrome.runtime.getURL('data/leetcode.json');
      const leetcodeIconUrl = chrome.runtime.getURL('icons/lc.png');
      addUrls(leetcodeDataUrl, leetcodeIconUrl);

      const gfgDataUrl = chrome.runtime.getURL('data/gfg.json');
      const gfgIconUrl = chrome.runtime.getURL('icons/gfg.png');
      addUrls(gfgDataUrl, gfgIconUrl);
    }
  }, 10);
});

const request =
    async (url) => {
  const response = await fetch(url);
  const json = await response.json();
  return json;
}

const urlRe = /(https:\/\/www\.interviewbit\.com\/problems\/[^\/]*\/)/;
function santizeUrl(url) {
  // Hack
  if (url.includes('#')) return '';
  if (urlRe.test(url)) {
    return url.match(urlRe)[1];
  }
  return url;
}

async function addUrls(metadatUrl, iconUrl) {
  var currentUrl = santizeUrl(window.location.href);
  const metadata = await request(metadatUrl);

  function addLinkHelper() {
    var url = santizeUrl(this.href);
    if (url in metadata) {
      var platformUrl = metadata[url];
      var button = $('<a/>').attr(
          {style: 'margin-right:10px', target: '_blank', href: platformUrl});
      var img =
          $('<img id="dynamic" class="lc-icon-big">').attr({'src': iconUrl})
      button.append(img);
      button.appendTo(this.parentNode);
    }
  }

  // Problem Page
  if (currentUrl in metadata) {
    var platformUrl = metadata[currentUrl];
    var button = $('<a/>').attr({
      type: 'button',
      style: 'margin-right:10px',
      target: '_blank',
      href: platformUrl
    });
    button.addClass('pull-right');
    button.addClass('btn');
    button.addClass('btn-default');
    var img = $('<img id="dynamic" class="lc-icon">').attr({'src': iconUrl})
    button.append(img);
	$('.problem-action-wrapper').append(button);
    setTimeout(() => $('a').each(addLinkHelper), 3000);
  } else {
    $('a').each(addLinkHelper);
  }
}
