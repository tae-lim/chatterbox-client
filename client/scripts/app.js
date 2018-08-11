
$(document).ready(function(){
  getMessages();
});

  var getMessages = function() {
    $.ajax({
    url: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
    type: 'GET',
    success: function (data) {
      console.log('chatterbox: Returned messages');

      var roomnames = {};
      for(var i = 0; i < data.results.length; i++) {
        //append rooms
        var $room = data.results[i].roomname;
        if (!roomnames[$room]) {
          $('select').append('<option value="roomname">' + $room + '</option>');
          roomnames[$room] = $room;
        }

        //append messages
        var $username  = $('<div class="username">' + data.results[i].username + '</div>');
        var $text = $('<div class="text">' + data.results[i].text + '</div><br>');

        $("#chats").append($username).append($text);
      }
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to return messages', data);
    }
  });
};

let escape = (submission) => {
  //get input from user
  let input = submission.split('');
  let escapees = {
    '&' : '&amp;',
    '<' : '&lt;',
    '>' : '&gt;',
    '\"' : '&quot;',
    '\'' : '&#x27;',
    '/' : '&#x2F;',
    '$' : '&#36;'
  };
  //loop through each character
  for (let i = 0; i < input.length; i++) {
    for (let key in escapees) {
      if (input[i] === key) {
        input[i] = escapees[key];
      }
    }
  }
  return input.join('');
};

  $('form').submit(function(event) {
    //console.log('here?');
    //FORM FIELDS
    var message = {
      username: null,
      text: escape($('input[name=text]').val()),
      roomname: null
    };

    //POST
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        //add
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });


    getMessages();

  });







