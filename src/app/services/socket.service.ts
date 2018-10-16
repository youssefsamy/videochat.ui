/**
 * Created by ApolloYr on 2/13/2018.
 */
import {Injectable} from "@angular/core";
import {SettingsService} from "./setting.service";
import {EventsService} from "angular4-events";
@Injectable()
export class SocketService {

    public socket: any;
    public messageSocket: any;

    constructor(
        public setting: SettingsService,
        public event: EventsService
    ) {

    }

    initSocket() {
        let that = this;

        if (this.socket) {
            this.socket.close()
        }
        this.socket = new WebSocket(this.setting.socketUrl);
        this.socket.onopen = function(e) {
            console.log('socket established');

            that.sendLoginInfo();
        };

        this.socket.onmessage = function (e) {

            let data = JSON.parse(e.data);
            console.log(data);

            if (data.role == 'video') {
                that.event.publish('videoSocket', data);
            } else if (data.role == 'chat') {
                that.event.publish('chatSocket', data);
            } else if (data.role == 'both') {
                that.event.publish('videoSocket', data);
                that.event.publish('chatSocket', data);
            }
        };

        this.socket.onclose = function(e) {
            setTimeout(() => {
                that.initSocket();
            }, 1000)
        }
    }

    sendSocketData(data) {
        this.socket.send(JSON.stringify(data));
    }

    closeSocket() {
        this.socket.close();
    }

    sendLoginInfo() {

        if (!this.setting.isLoggedIn) return;

        this.sendSocketData({
            role: 'other',
            type: 'login',
            email: this.setting.loginInfo.email
        })
    }

    sendLogout() {
        this.sendSocketData({
            role: 'other',
            type: 'logout',
        })
    }
}