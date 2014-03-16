'use strict';

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message && message.call && message.call.name) {
    var method = window[message.call.name];
    sendResponse(method.call(this, message.call.args));
  }
});
