var Main = function () { };

Main.chatHistoryMap = {};
Main.users = [];

Main.prototype.generalEvents = () => {
  $('body').find('span.signup_btn').on('click', () => {
    $('#signin_div').addClass('hidden');
    $('#signup_div').removeClass('hidden');
  });
  $('body').find('span.signin_btn').on('click', () => {
    $('#signin_div').removeClass('hidden');
    $('#signup_div').addClass('hidden');
  });
}

Main.prototype.signupController = () => {
  $('body').on('click', '.signup_save', (e) => {
    e.preventDefault();
    var full_name = $('#full_name').val().trim();
    var username = $('#username').val().trim();
    var email = $('#email').val().trim();
    var password = $('#password').val().trim();

    if (full_name == '' || username == '' || email == '' || password == '') {
      $('#signup_div').find('.help-block').html('All Fields are required');
      $('#signup_div').find('.help-block').removeClass('hidden');
      return false;
    }
    else {
      $('#signup_div').find('.help-block').addClass('hidden');
      var form_data = {
        'full_name': full_name,
        'username': username,
        'email': email,
        'password': password
      };
      $.post('/user/signup', form_data)
        .done((data) => {
          window.location = '/chatboard';
        })
        .fail(function (err, status) {
          var err_msg = err.responseJSON.error || 'Please try again later.';
          $('#signup_div').find('.help-block').html(err_msg);
          $('#signup_div').find('.help-block').removeClass('hidden');
        });
    }
  });
}

Main.prototype.loginController = () => {
  $('body').on('click', '.login_save', (e) => {
    e.preventDefault();
    var u_email = $('.u_email').val().trim();
    var password = $('.password').val().trim();
    if (u_email == '' || password == '') {
      $('#signin_div').find('.help-block').html('Email or password missing.');
      $('#signin_div').find('.help-block').removeClass('hidden');
      return false;
    }
    else {
      $('#signin_div').find('.help-block').addClass('hidden');
      var form_data = {
        'u_email': u_email,
        'password': password
      };
      $.post('/user/login', form_data)
        .done((data) => {
          window.location = '/chatboard';
        })
        .fail(function (err, status) {
          // console.log(err.responseJSON);
          var err_msg = err.responseJSON.error || 'Please try again later.';
          $('#signin_div').find('.help-block').html(err_msg);
          $('#signin_div').find('.help-block').removeClass('hidden');
        });
    }
  });
}

Main.prototype.logout = () => {
  $('body').on('click', '#logout', () => {
    $.post('/user/logout')
      .done((data) => {
        window.location = '/';
      })
      .fail(function (err, status) {
        var err_msg = err.responseJSON.error || 'Please try again later.';

        $('#signin_div').find('.help-block').html(err_msg);
        $('#signin_div').find('.help-block').removeClass('hidden');
      });
  });
}

function addUser(userData) {
  var userId = userData.id;

  if (Main.users.includes(userId)) {
    $('#user_' + userId).css('color', '#798e70');
    return
  }

  Main.users.push(userId);

  var displayName = userData.full_name + ' (' + userData.username + ')';

  $('.users').append('<div class="col-sm-12 active_users text-center pointer userlist" data-id="' + userId + '" id=user_' + userId + '><span>' + displayName + '</span><span class="pending_msg"></span></div>');

  $('.users').on('click', '#user_' + userId, () => {
    var user_id = $('#user_' + userId).data('id');
    $('.user_chat').html('<span class="head">' + displayName + '</span>');
    $('.user_chat, .chatboard_div, .chat_div').removeClass('hidden');
    $('.chatboard_div #send_msg').attr('data-id', userId);
    $('.chat_div').attr('id', 'chat_div_' + userId);
    $('.chat ul').html('');
    $('#user_' + user_id).find('span.pending_msg').html('');

    if (Main.chatHistoryMap[user_id]) {
      Main.chatHistoryMap[user_id].forEach(chat => {
        if (chat.self) {
          $('.chat ul').append($('<li class="self"> <div class="msg"> <p>' + chat.self + '</p> </div>'));
        } else {
          $('.chat ul').append($('<li class="other"> <div class="msg"> <p>' + chat.other + '</p> </div>'))
        }
      });
    }
  });
}

Main.prototype.socketEvents = () => {
  var socket = io.connect({ 'transports': ['websocket'] });
  $('#message').on('keyup', (event) => {
    if (event.keyCode == 13) {
      $('#send_msg').click();
    }
  })
  $('#send_msg').click((e) => {
    var message = $('#message').val().trim();
    var user_id = $('#send_msg').attr('data-id');
    if (message == '') return;

    if (!Main.chatHistoryMap[user_id]) Main.chatHistoryMap[user_id] = [];
    Main.chatHistoryMap[user_id].push({ self: message })

    $('.chat ul').append($('<li class="self"> <div class="msg"> <p>' + message + '</p> </div>'));
    var objDiv = $("#chat_ul")[0];
    objDiv.scrollTop = objDiv.scrollHeight;
    socket.emit('message', { 'message': message, to: user_id });
    $('#message').val('')
  });
  socket.on('userList', (userdata) => {
    $('.users').html('');
    Object.keys(userdata).forEach((userId) => {
      addUser(userdata[userId])
    });
  });
  socket.on('adduser', addUser);
  socket.on('removeuser', (user) => {
    $('#user_' + user).css('color', 'red');
  });
  socket.on('message', (msg_data) => {
    if (!Main.chatHistoryMap[msg_data.from]) Main.chatHistoryMap[msg_data.from] = [];
    Main.chatHistoryMap[msg_data.from].push({ other: msg_data.message })

    if ($('#chatboard').find('#chat_div_' + msg_data.from).length && !$('#chat_div_' + msg_data.from).hasClass('hidden')) {
      $('.chat ul').append($('<li class="other"> <div class="msg"> <p>' + msg_data.message + '</p> </div>'));
      var objDiv = $("#chat_ul")[0];
      objDiv.scrollTop = objDiv.scrollHeight;
    } else {
      $('#user_' + msg_data.from).find('span.pending_msg').html('<i class="fa fa-bell" style="font-size:15px;margin-left:5px;"></i>');
    }
  })
  return socket;
}

$(document).ready(() => {
  main_obj.generalEvents();
})

var main_obj = new Main;