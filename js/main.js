$(document).ready(function() {
  chrome.runtime.sendMessage({method: 'getCred'}, function(response) {
    $('#user').val(response.user);
    $('#pass').val(response.pass);
  });
});

$('#save').click(function() {
  initiate();
});

// http://stackoverflow.com/questions/155188/trigger-a-button-click-with-javascript-on-the-enter-key-in-a-text-box
$('#user').keyup(function(event) {
  if (event.keyCode == 13) {
    $('#save').click();
  }
});

$('#pass').keyup(function(event) {
  if (event.keyCode == 13) {
    $('#save').click();
  }
});

var initiate = function() {
  var user = $('#user').val();
  var pass = $('#pass').val();
  if (!user || !pass) return;
  var opts = {
    method: 'initiate',
    args: {
      user: user,
      pass: pass
    }
  };
  chrome.runtime.sendMessage(opts, function(response) {
    console.log(response);
    $('#status').text(response);
  });
};
