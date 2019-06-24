// nodemodule
const serialize = require('form-serialize');

// module app
const _conn = require('../core/connection');
const _session = require('../core/create_session');
const _auth_admin = require('../models/model_auth_admin');


const formData = document.getElementById("form-login");

boot_login()

function boot_login() {
       var user = JSON.parse(_session.this_user());
       console.log(user !== null);
       if (user !== null) {
             setTimeout(function () {
                $('#template-login-section').css("top","-200vh");     
             }, 1000)
       }
}

$("#btn-login").click(function () { 
       var data = serialize(formData, {hash : true});
       console.log(data)
       var credentials = {
              "username" : data.username,
              "password" : data.password,
              "user_login_role" :data.user_role_id,
             
       }
       _auth_admin.login(_conn, credentials, function (res) {
              console.log(res)
              if (res.success == true) {
                     if (res.status == 200) {
                            var thisUser = {
                                   "username" : res.data[0].username,
                                   "user_login_role" : res.data[0].user_login_role,
                                   "user_id" : res.data[0].user_id,
                                   "nama" : res.data[0].nama_pegawai,
                                   "nip" : res.data[0].nip_pegawai,
                                   "subagian" : res.data[0].nama,
                                   "subagian_id" : res.data[0].subag_pegawai
                            }
                            _session.create(thisUser); 
                            console.log(thisUser)
                            $('#template-login-section').css("top","-200vh");
                            setTimeout(function () {
                                   $('#template-content-section').load("../views/page/home.html", function (res, status, xhr) {});
                            }, 500)
                     }

              }else{
                     console.log('error login')
              }
       })
})

$("#btn-logout").click(function () {
       _session.destroy();
       setTimeout(function () {
              $('#template-login-section').css("top","0px")
       }, 1000)
})