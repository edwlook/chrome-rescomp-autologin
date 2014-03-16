'use strict';

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message && message.method) {
    var method = window[message.method];
    sendResponse(method.call(this, message.args));
  }
});

var foo = function(x) {
  return x;
};
