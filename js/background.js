var RESCOMP = 'https://auth.berkeley.edu/cas/login?service=https%3a%2f%2fnet-auth-d.housing.berkeley.edu%2fcgi-bin%2fpub%2fwireless-auth%2frescomp.cgi%3fmode%3dcalnet';
var RESCOMP_FINISH = 'https://net-auth-d.housing.berkeley.edu/cgi-bin/pub/wireless-auth/rescomp.cgi?mode=calnet';
var BERKELEY = 'http://www.berkeley.edu/';
var CAS = 'https://auth.berkeley.edu/cas/login';


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message && message.method) {
    var method = window[message.method];
    if (message.args) {
      method(message.args, sendResponse);
    } else {
      method(sendResponse);
    }
    // Must return true to indicate an asynchronous response
    return true;
  }
});

var initiate = function(cred, callback) {
  save(cred, function() {
    login(function(data) {
      callback(data);
    });
  });
};

var encrypt = function(string) {
  return CryptoJS.AES.encrypt(string, "^.,-2obye", {format: JsonFormatter});
};

var decrypt = function(encrypted) {
  var decrypted = CryptoJS.AES.decrypt(encrypted, "^.,-2obye", {format: JsonFormatter});
  return decrypted.toString(CryptoJS.enc.Utf8);
};

var save = function(cred, callback) {
  chrome.storage.sync.set({user: encrypt(cred.user), pass: encrypt(cred.pass)}, function() {
    callback();
  });
};

var login = function(callback) {
  console.log('trying to login');
  getCred(function(cred) {
    if (!cred || !cred.user || !cred.pass) return;
    var postData = {
      username: cred.user,
      password: cred.pass,
      lt: '_cNoOpConversation id_krO0ABXNyAGFvcmcuc3ByaW5nZnJhbWV3b3JrLndlYmZsb3cuZXhlY3V0aW9uLnJlcG9zaXRvcnkuY29udGludWF0aW9uLlNlcmlhbGl6ZWRGbG93RXhlY3V0aW9uQ29udGludWF0aW9uPMZQHZQEyycMAAB4cgBXb3JnLnNwcmluZ2ZyYW1ld29yay53ZWJmbG93LmV4ZWN1dGlvbi5yZXBvc2l0b3J5LmNvbnRpbnVhdGlvbi5GbG93RXhlY3V0aW9uQ29udGludWF0aW9ujvgpwtO1430CAAB4cHoAAAQAAAAKVR-LCAAAAAAAAAClWX1sFMcVH_swYIPDGWNjQ6CUQvjMGYev0KNQ-2zDoTOhmJC0Dgnj3fHd4r2dZXbOPlIlIX8QVWpImxRaETUiVVRSVUhNK7WNyB-UpjR_UGiLSpWmipp_WjVKW6mtqkhV0_a92c-7W3xGscSw82bm9968r5l5d_GvpMkRZAcX-ZRjC8PKjwtaZFNcTKSm2Ni4yadSzMobFksZRdtMDQFhsMy0kjS4lQVK1_1tzgcXrpyeT0jZlqTV5DD5Xm8pIC86RidpCqabqZxhTTA9Zzhy_rqRI_uOfmllAhdNzSKENMDU7XcixAhzHE-E_MqLN_XHNtxQIhwnT5JGkGPSYFM5lGWIi2JdcH9HUegRSWXJGbv6uak_vfLepkYAF2RTHIrGBQP5SkUnhWsMLUfHmMn0QSBd_kHr-X3p_M1G0pAjszSuM0nacqiTHpNa-Z6RAhcyDcj31UHuG3OkoJqMYD-rH9rzyEuvfYii2bDFBUrVCJtSsIXh7e1bjr5zEHiPkKZJapYYMEqGs_aXimNMPHPx7LJ5Z977soIhCQD6zHS6UjJp3DSZpjSW4xo1-6QUxlhJsmFqr91VeDz58PGnErjlFuqPOJIscDeOztADE9NK6rbQQfZSpwD0pjnvXHmz8-ivE6RxiLSYnOpDsHEusqRZFgRzCtzUy_buzxL8mz81F9ok_GuSZI7DxKShMXDEeZpgOrOkQU0HuPTjlo5Rx8inNOqkaEkWcFCjag-4Vc2wqZl6EBAs2PIB6jiwbT0Tojy75ZWmFetP_6iRNObIXNubIMnCqDklKi0N4yUPCP2xq2zbIFKbVhICwNAjHxg7BvrDwW7QyxQVVobzCYMdRisFWlFW6ufcZNS6vkKcvPXNf_8NrPkF35o2kaQTdjHB5B5BQUwrf0j1srpdLjsIn1Rte422IEZ2xZkZgA3d1Uq_YemDZdQm9mqEByk33gnC3dffvnCp-7UNKhRax2AIlh1kTsmUkoAbiXxPFVRPCNXTH52PAdMeaihg8auPPrFrSfrun7nBGplxqCD4FB0z2a2fb12zY-r1awkyK0eaNApmkqQjYsFgJhixFaKVGuYw5AOady05SlocSbWJQxCLsHL5aIXx_YFBkxVBVwCxyCnZNvisw0JFQCQkI5GACTHtJq51dkn4mF4g12A2Dq3fufOjlTvccCVkJ9hh6TQLaPPVF-_Z9u6pRjIrC9EESdQN-xy5S2eaSVHjGRO8We0PPHfcMNl-33MhgotMFri-P_RlyNatkqyrY_sBKikajQlw8LCTQlElac4zOSgEFy7fjeCQT0py73SJh7r5Bh2wT30CbtjxcO8yLEP5aBX4Gfy4D5vNknoAAAQALGaWUxIsnDZYtjlYyJ_d8Mfo7GZwkZKtjhE1_j_4k2S1U7JSgo1jGkztYRYTVDJ9WOmqT9PA4lxs2Q5RP9uwJvkE87HJBknWRtcOQDrPUwzdysV4sknyyemG1Z4RNx3s81FJukJn8Hm4SyEpuh-164gmybbplK_y84Dh2FRqBRclq_YF1l0SS49hcgrifAYWHoYIN3wTJyM933d07l5BQqX-RJLeGSD7h6gP3l5J8PDnsCr0F2T88Vx1N-mzLC7RC3z4RVWUQCW5ADpdR3AfWq13dw0nOwheQYgBPlcnmiqAMQVBNIWdGEDwrNh0XwV4GO5deAuC5HhX8O0rFgxnSSYCzMsQCzPA9PBaolhNrALpNzPbLiRGyzG85BF2Yra7TcZf9qoAB5hm-JdFEHFhRT-A_Xy4Y_wYxeYRbI6EG8CPx7A5WiUIfoxho31cqIk6QV6jJDwHvZ11xVB9s4IjToI5giTUKcmaGfDBuzZEM_4XaMoMhL0uSd9MHwQH2XG4NckMmFVwE_9jZekm0OW3HfOknwd3QouaFTsg36qTqSqix9NQMtK7A8s3NuOHhQ0Ht4bbhQjluIIfx7ER2JwIBr4vP8abDS6NNbRA4pDHG5Jsrf9qguwTgvnHVkc1yVP2bJOWLK0QsHhCkt0zYoHXKEh8ipVn0b3U0k08fxbXEj12bQXVjYwHnL8tZ_IkBM7FSU1x9RxIcWyvJHjcOlxuHqcs5idwrGhGvl30pfDdYjKpmPlnUpTh4lqix7S1gmnAbJN0nzz1mI2gh7AQ1dNfn05tiYw_Nf0E36yuED73xMTtT7WAu39pYGLEpYBX1tA8_Bad-0MBjzX48TVszqgrwYj79AvCKn37BB7IMORTAxE6qkn-vdIWHC9eVXpu-Bd-nMPmRQhene9hYRo0IPvg6nLAryClndoLTcAvGekFIdgRQFzHj_PYvFwxQBzvNA6ftLgvvPymRug4i1Huklh6Lc-GlZL0IDS1KUwEbAmXeou6D_8-2za9V_OQYYIHZArUgMN0afyAp72k4QXDAHcHg33cwI8L2LwqyVy9ehjceDPKYliOzSakACGKRTivcbMZ04CUnbXGObzZGNVVIcJdL8mKaUZ9oXxuNZGa87jGuc64C_GApbEDTHju4HPtjiMHKv5uwOCDcNfYfCdOHZUr3vfuN7FGgSPH0qnQHxLUtpk4TM1JOI-648gxt_LLM4H2zs1q6Cg55jWy2VNkNXSk_AIZti_a66f4Iu-socUI_pQk6-sKvpc7vtSdNbQY0LwkG-JAJ3G-k1LvxYMMzyIPtaOaFKOHvPdcvg2o-6bL8bwH2V5JiJGy6IX_tFsfVHcAD7MrhloL3LD6NtvXuGUxLHoAAAJawqUy_ASXLDggFlb0a9NJ4oh3x_cR1XSVCXt7VS7s7T3g5lZ82CyqovhXTC_9Rt-5u-ujSq5xc5Xbzbg7gPwUXBzaKycGwv8yUEdV2EleBI24j2ELkue-LDxodJtDelv1EGQIBE1GiJ70CVGyAsn_LKMlWDc5wS3U_QhE-K0jyD1hZTQT1FudVQ9aRa4b4wZew_Gt9p8Fq3t_-Jfnkm6J2QQKAqwtC7KxPkBI7-4nJ689-uFyBdOgQbhEalThNLdo2x4i9wlBT6Ac5advLjv3Fn0pQRqyZJZjPM5UfYqo-j4po1B_KMPa--sVDRm1wCSQseSJiqrfq8-fXfrc2mu_UBLOhntyHs-1aPnVLUxidXBnHSb-fSqWkday7K1LQ-u_6JYRt8wQqgJCXv3K22teePdWI9YZZzNVZVJmyZFFRbeemOE6g_uEwyESwW-21quADscsS-dIC1ebjlTskmHNcchgpl5VeR9hSkOxz-WYbbkVskPPz3657R-tZ1Txu8WCw43pB6gseCwXhBRVgAx-5HA5IimNPw-R4GcK5TtqIPnf9T99o_mZZa62k-HoYZVwfveNJ0ZPpr_XkCCJLGnTMBINeSJraUKVN7NkPnMLnRlesuQomed1seQIIT4a4x7KLfGvJPwJbjR6E7564-HzSWed6ZdYW-zgzy2qJzyfht18ul4ZlI1T8Ic447We_P0_3zyd-bvrz2CxcUNFSZdbDH4fm87aX0jAfpcGTp39-us_3uL-fjYfZfEK_G6cdcv6UVZZ3A9_5sD168plu1wu_x-UOEXbHRwAAAF4',
      _eventId: 'submit'
    };
    $.post(RESCOMP, postData)
      .done(function(data) {
        console.log('POST complete');
        // callback(data);
        callback('Saved and auto-login enabled!');
        $.get(BERKELEY, function(data) {
          console.log('finish');
        });
      });
  });
};

var getCred = function(callback) {
  chrome.storage.sync.get(['user', 'pass'], function(data) {
    if (!data || !data.user || !data.pass) return;
    return callback({
      user: decrypt(data.user),
      pass: decrypt(data.pass)
    });
  });
};

window.addEventListener("offline", function(e) {
  console.log('offline');
}, false);

window.addEventListener("online", function(e) {
  console.log('online');
  setTimeout(function() {
    login(function(data) {
      console.log('logged in');
    });
  }, 3000);
}, false);
