(function () {
  window.SL_CW = (function () {
    function SL_CW() {}
    SL_CW.api_url = "https://callwidget.000webhostapp.com/CallWidget/";

    SL_CW.loadDiv = '<div class="talktext"><button class="call_btn">Call Now</button><button class="call_btn pull-right" id="request_btn">Request a Call</button></div><form class="form_div" style="display: none;"><div class="sl-form-control"><label class="sl-control-label">Name : </label><input type="text" id="user_name" /></div><div class="sl-form-control"><label class="sl-control-label">Email : </label><input type="email" id="user_email" name="user_email" /></div><div class="sl-form-control"><label class="sl-control-label">Phone Number : </label><input type="text" id="user_number" /></div><p class="sl_cwc_msg"></p><button type="button" class="call_btn" id="cancel_btn">Cancel</button><button type="button" class="call_btn pull-right" id="sl_submit_btn" data-id="">Submit</button></form></div>';

    SL_CW.addCallRequest = function (userName, userEmail, userNumber, mainUserId) {
      return SL_CW.$.ajax({
        url: SL_CW.api_url + "index.php?p=call_request_process",
        type: "POST",
        data: {user_name: userName, user_email: userEmail, user_number: userNumber, main_user_id: mainUserId},
        success: function (data) {
          if (data == 'success') {
            SL_CW.$('body').find("p.sl_cwc_msg").removeClass('sl_cwc_msg_danger').addClass("sl_cwc_msg_success");
            SL_CW.$(".sl_cwc_msg").html("Request successfully submitted.");
            SL_CW.$(".talk-div").fadeOut(2000);
          }
          else if(data == 'sww') {
            SL_CW.$('body').find("p.sl_cwc_msg").removeClass('sl_cwc_msg_success').addClass("sl_cwc_msg_danger");
            SL_CW.$(".sl_cwc_msg").html("Something bad happened, Please try again later.");
          }
        },
        error: function (error) {
          console.log(error);
        }
      });
    };

    SL_CW.isUserExists = function (userDomain) {
      return SL_CW.$.ajax({
        url: SL_CW.api_url + "index.php?p=user_process",
        type: "POST",
        data: {user_domain: userDomain, method: 1}, 
        success: function (data) {
          // console.log(typeof data, data);
          if(data == 'no')
            SL_CW.addUser(userDomain);
          else if(data == 'sww')
            console.log("Something went wrong");
          else if(data) {
            SL_CW.$('#sl_phone_btn, #sl_submit_btn').attr('data-id', data);
          }
        },
        error: function (error) {
          console.log(error);
        }
      });
    };

    SL_CW.addUser = function (userDomain) {
      return SL_CW.$.ajax({
        url: SL_CW.api_url + "index.php?p=user_process",
        type: "POST",
        data: {user_domain: userDomain, method: 2}, 
        success: function (data) {
          if(data == 'sww')
            console.log("Something went wrong");
          else if (data) {
            SL_CW.$('#sl_phone_btn, #sl_submit_btn').attr('data-id', data);
            console.log("User inserted");
          }
          return;
        },
        error: function (error) {
          console.log(error);
        }
      });
    };

    SL_CW.isEmail = function (email) {
      var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      return regex.test(email);
    }
    SL_CW.loadjQuery = function (afterLoad) {
      return SL_CW.loadScript("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js", function () {
        SL_CW.$ = jQuery.noConflict(true);
        return afterLoad();
      });
    };

    SL_CW.loadScript = function (url, callback) {
      var script; 
      script = document.createElement("script");
      script.type = "text/javascript";
      if (script.readyState) {
        script.onreadystatechange = function () {
          if (script.readyState === "loaded" || script.readyState === "complete") {
            script.onreadystatechange = null;
            return callback();
          }
        };
      } else {
          script.onload = function () {
          return callback();
        };
      }
      script.src = url;
      return document.getElementsByTagName("head")[0].appendChild(script);
    };

    SL_CW.loadjQuery(function () {
      SL_CW.$.ajaxSetup({
        cache: false
      });

      SL_CW.$(document).ready(function () {
        SL_CW.$('head').append('<link rel="stylesheet" type="text/css" href='+SL_CW.api_url+'css/style.css>');
        SL_CW.$('head').append('<link rel="stylesheet" type="text/css" href=https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css>');
        
        if(SL_CW.$('body').find('div.sl_call_widget_div').length) {
          SL_CW.$('div.sl_call_widget_div').append('<div class="relative-pos talk-div tri-right round btm-left" style="display: none;">'+SL_CW.loadDiv+'<a href="javascript:void(0)" id="sl_phone_btn" data-id="" class="sl_phone_btn" style="position: absolute !important; left: 10% !important" ><div style="width: 100px; height:100px;"><img style="width: 100%; height: 100%; border-radius: 100%;" src="'+SL_CW.api_url+'phone.jpg" alt="#"></div></a>');
        }
        else {
          SL_CW.$('body').append('<div class="talk-div tri-right round btm-left" style="display: none;">'+SL_CW.loadDiv+'<a href="javascript:void(0)" id="sl_phone_btn" data-id="" class="sl_phone_btn" style="bottom: 3% !important; left: 92%;"><div style="width: 100px; height:100px;"><img style="width: 100%; height: 100%; border-radius: 100%;" src="'+SL_CW.api_url+'phone.jpg" alt="#"></div></a>');
        }

        var user_domain = document.location.origin;
        SL_CW.isUserExists(user_domain); 

        SL_CW.$('body').on('click', '#sl_phone_btn', function () {
          SL_CW.$('body').find('.talk-div').slideToggle('fast');
        });

        SL_CW.$('body').on('click', '#request_btn', function () {
          SL_CW.$('body').find('.form_div').fadeIn(1000);
          SL_CW.$('body').find('.talktext').hide();
        });

        SL_CW.$('body').on('click', '#cancel_btn', function (e) {
          e.preventDefault();
          SL_CW.$('body').find('.form_div').hide();
          SL_CW.$('body').find('.talktext').fadeIn(1000);
        });

        SL_CW.$('body').on('click', '#sl_submit_btn', function (e) {
          e.preventDefault();
          var user_name = SL_CW.$('#user_name').val().trim();
          var user_email = SL_CW.$('#user_email').val().trim();
          var user_number = SL_CW.$('#user_number').val().trim();
          var main_user_id = SL_CW.$(this).attr('data-id');

          if(user_name == '' || user_email == '' || user_number == ''){
            SL_CW.$('body').find("p.sl_cwc_msg").removeClass('sl_cwc_msg_success').addClass("sl_cwc_msg_danger");
            SL_CW.$(".sl_cwc_msg").html("All Fields are required.");
          }
          else if(!SL_CW.isEmail(user_email)) {
            SL_CW.$('body').find("p.sl_cwc_msg").removeClass('sl_cwc_msg_success').addClass("sl_cwc_msg_danger");
            SL_CW.$(".sl_cwc_msg").html("Please Enter a valid Email Address");
          }
          else if(main_user_id == '' || main_user_id == undefined){
            SL_CW.$('body').find("p.sl_cwc_msg").removeClass('sl_cwc_msg_success').addClass("sl_cwc_msg_danger");
            SL_CW.$(".sl_cwc_msg").html("Something bad happened, Please try again later.");
          }
          else
            SL_CW.addCallRequest(user_name, user_email, user_number, main_user_id);
          setTimeout(function() {
            SL_CW.$(".sl_cwc_msg").html("");
          }, 3000);
        })
      });
    });
    return SL_CW;
  });
}).call(this);
SL_CW();