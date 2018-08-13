var app = {
  server: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
  username: 'anonymous',
  roomname: 'lobby',
  messages: [],
  friends: {},
  lastMessageID: 0,

  init: function() {
    //Get username
    app.username = window.location.search.substr(10);

    //Cache jQuery selectors
    app.$message = $('#message');
    app.$chats = $('#chats');
    app.$roomSelect = $('#roomSelect');
    app.$send = $('#send');

    //triggers
    app.$send.on('submit', app.handleSubmit);
    app.$roomSelect.on('change', app.switchOrAddRoom);
    app.$chats.on('click', '.username', app.handleUsernameClick);

    //fetch previous messages
    app.fetch(false);

    //need to set interval
    setInterval(function() {
      app.fetch(true);
    }, 3000);
  },

  fetch: function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      data: {order: '-createdAt'},
      success: function (data) {
        console.log('chatterbox: Returned messages');
        //if (!data.result || !data.results.length) { return; }
        app.messages = data.results;
        var mostRecentMessage = app.messages[app.messages.length - 1];
        if (mostRecentMessage.objectID !== app.lastMessageID) {
          app.renderMessages(app.messages);
          app.renderRoomList(app.messages);
        }
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to return messages', data);
      }
    });
  },

  renderMessages: function(messages) {
    app.clearMessages();
    messages.forEach(function (message) {
      app.renderMessage(message);
    });
  },

  clearMessages: function() {
    app.$chats.html('');
  },

  renderMessage: function(message) {
    var $chat = $('<div class="chat"/>');

    var $username = $('<span class="username"></span>');
    $username.text(message.username).appendTo($chat);
    var $message = $('<br><span></span>');

    if (app.friends[message.username] === true) {
      $username.addClass('friend');
    }

    $message.text(message.text).appendTo($chat);
    app.$chats.append($chat);
  },

  handleSubmit: function(event) {
    var message = {
      username: app.username,
      text: app.$message.val(),
      roomname: app.roomname // || 'lobby'
    };
    app.send(message);
    event.preventDefault();
  },

  send: function(message) {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        app.fetch();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  renderRoomList: function(messages) {
    app.$roomSelect.html('<option value="newRoom">New room...</option>');
    if (messages) {
      var storage = {};
      messages.forEach(function(message) {
        var roomname = message.roomname;
        if (roomname && !storage[roomname]) {
          app.renderRoom(roomname);
          storage[roomname] = true;
        }
      });
    }
  },

  renderRoom: function(roomname) {
    //Prevents cross-site scripting by escaping with DOM
    var $option = $('<option/>').val(roomname).text(roomname);
    app.$roomSelect.append($option);
  },

  switchOrAddRoom: function(event) {
    var selectIndex = app.$roomSelect.prop('selectedIndex');
    if (selectIndex === 0) { //if selected New Room
      var roomname = prompt('Enter room name');
      if (roomname) {
        // set as the current room
        app.roomname = roomname;
        //add the room to the menu
        app.renderRoom(roomname);
        //select menu option
        app.$roomSelect.val(roomname);
      }
    } else {
      app.roomname = app.$roomSelect.val();

      var roomMessages = app.messages.filter(function(message) {
        return message.roomname === app.roomname ||
               app.roomname === 'lobby' && !message.roomname;
      });
      app.renderMessages(roomMessages);
    }
  },

  handleUsernameClick: function(event) {
    // Get username from data attribute
    var username = $(event.target).data('username');
    if (username !== undefined) {
      // Toggle friend
      app.friends[username] = !app.friends[username];
      // Escape the username in case it contains a quote
      var selector = '[data-username="' + username.replace(/"/g, '\\\"') + '"]';
      // Add 'friend' CSS class to all of that user's messages
      var $usernames = $(selector).toggleClass('friend');
    }
  },

};











