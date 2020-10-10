chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === 'complete') {
      clearInterval(readyStateCheckInterval);
      setLeetcodeUrl();
    }
  }, 10);
});

const request =
    async (url) => {
  const response = await fetch(url);
  const json = await response.json();
  return json;
}

const url = chrome.runtime.getURL('data.json');
const iconUrl = chrome.runtime.getURL('icons/lc.png');

async function setLeetcodeUrl() {
  var currentUrl = window.location.href;
  const metadata = await request(url);

  // Problem Page
  if (currentUrl in metadata) {
    var leetcodeUrl = metadata[currentUrl];
    var button = $('<a/>', {text: 'Leetcode Problem'}).attr({
      type: 'button',
      style: 'margin-right:10px',
      target: '_blank',
      href: leetcodeUrl
    });
    button.addClass('pull-right');
    button.addClass('btn');
    button.addClass('btn-default');
    var img = $('<img id="dynamic" class="lc-icon">').attr({'src': iconUrl})
    button.append(img);
    $('.problem-action-wrapper').append(button);
  }

  function addLeetCodeLink() {
    if (this.href in metadata) {
      var leetcodeUrl = metadata[this.href];
      var button = $('<a/>').attr(
          {style: 'margin-right:10px', target: '_blank', href: leetcodeUrl});
      var img =
          $('<img id="dynamic" class="lc-icon-big">').attr({'src': iconUrl})
      button.append(img);
      button.appendTo(this.parentNode);
    }
  }

  $('a').each(addLeetCodeLink);
}
