$(document).ready(function () {

        const { ipcRenderer } = require('electron');


        var _conn = require('../core/connection');
        var _session = require('../core/create_session');

        var _notif = require('../models/model_notif');

        var notif_are = document.getElementById("notif-area");
        var notif_badge = document.getElementById("notif-badge");

        var current_user = JSON.parse(_session.this_user());

        var current_user_nitif_count = 0;

        boot_notification();

        function boot_notification() {
                setInterval(function () {
                        cek_notif();
                },500)
        }

        function cek_notif() {
                if (notif_are == undefined || notif_are == null) {
                        notif_are = document.getElementById("notif-area");
                        notif_badge = document.getElementById("notif-badge");
                }
                if (current_user.user_login_role) {
                        _notif.get_all_unread_admin(_conn, function(res) {
                                if (res.success) {
                                        if (res.data.length !== current_user_nitif_count) {
                                                current_user_nitif_count = res.data.length;
                                                notif_are.innerHTML = ``;
                                                notif_badge.textContent = (current_user_nitif_count > 9) ? "9+" : current_user_nitif_count;
                                                // emit event to server
                                                ipcRenderer.send("asynchronous-notif", "ada pesan belum terbaca")
                                                
                                                if (res.status == 200) {
                                                        res.data.forEach(function (el, i) {
                                                                generate_notif_list(el);
                                                        })
                                                }
                                        }
                                }
                        })
                }else{
                        var cred = {
                                "notif_user_role" : current_user.user_login_role,
                                "notif_user_destiny" : current_user.user_id 
                        }
                        _notif.get_all_unread_by_user(_conn, cred, function (res) {
                                if (res.success) {
                                        if (res.data.length !== current_user_nitif_count) {
                                                current_user_nitif_count = res.data.length;
                                                notif_are.innerHTML = ``;
                                                notif_badge.textContent = (current_user_nitif_count > 9) ? "9+" : current_user_nitif_count;
                                                ipcRenderer.send("asynchronous-notif", "ada pesan belum terbaca")
                                                if (res.status == 200) {
                                                        res.data.forEach(function (el, i) {
                                                                generate_notif_list(el);
                                                        })
                                                }
                                        }
                                }
                        })
                }
        }

        function generate_notif_list(el) {
                var div = document.createElement("div");
                var d = new Date(el.notif_created_at);
                var day = ["minggu", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"];
                div.setAttribute("class", "dropdown-item d-flex align-items-center");
                div.innerHTML = `
                        <div class="mr-3">
                                <div class="icon-circle bg-primary">
                                        <i class="fas fa-file-alt text-white"></i>
                                </div>
                        </div>
                        <div>
                                <div class="small text-gray-500">${day[d.getDay()]}, ${d.getDate()}-${d.getMonth()}-${d.getFullYear()}  ${d.getHours()}:${d.getMinutes()}</div>
                                <span class="font-weight-bold">${el.notif_msg}</span>
                        </div>
                `;

                notif_are.appendChild(div);

        }
})