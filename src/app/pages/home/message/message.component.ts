/**
 * Created by ApolloYr on 2/3/2018.
 */

import {Component, OnInit} from "@angular/core";
import {Api} from "../../../services/api.service";
import {SettingsService} from "../../../services/setting.service";
import {SocketService} from "../../../services/socket.service";
import {EventsService} from "angular4-events";

declare let $: any;
@Component({
    selector: 'page-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit{

    public selectedFriend;
    public selectedIndex = -1;

    public message = '';
    public messageList = [];

    constructor(
        public api: Api,
        public setting: SettingsService,
        public socketService: SocketService,
        public event: EventsService
    ) {

    }

    ngOnInit() {

        this.initSocket();

        this.event.subscribe('logout').subscribe(() => {
            this.setting.friendList = [];
            this.selectedIndex = -1;
            this.selectedFriend = null;
        })
    }

    initSocket() {
        this.event.subscribe('chatSocket').subscribe(data => {
            switch (data.type) {
                case 'message':
                    console.log('received');
                    this.receivedMessage(data);
                    break;
            }
        })
    }

    receivedMessage(data) {
        let from = data.from;
        if (this.selectedIndex == -1 || this.selectedFriend.email != from) {
            this.addBadge(from);
            return;
        }

        let message = {
            to: this.setting.loginInfo.email,
            from: data.from,
            type: 'text',
            read: 0,
            message: data.message,
            created_at: new Date().toTimeString().substr(0, 5)
        }

        this.messageList.push(message);
        this.scrollDown();

    }

    addBadge(from) {
        for (let i=0; i < this.setting.friendList.length; i++) {
            if (this.setting.friendList[i].email == from) {
                this.setting.friendList[i].badge++;
            }
        }
    }

    selectFriend(index) {
        this.setting.friendList[index].badge = 0;
        this.selectedFriend = this.setting.friendList[index];
        this.selectedIndex = index;
        this.loadMessages();
    }

    loadMessages() {
        this.api.get('/loadMessages', {
            user1: this.setting.loginInfo.email,
            user2: this.selectedFriend.email
        }).subscribe(res => {
            console.log(res);
            this.messageList = res.messages;
            this.convertLocalTime();

            this.scrollDown();
        })
    }

    sendMessageByEnter($event) {
        if ($event.keyCode == '13') {
            this.sendMessage();
        }
    }

    sendMessage() {
        if (this.message == '') return;

        let tmp = this.message

        this.api.post('/sendMessage', {
            from: this.setting.loginInfo.email,
            to: this.selectedFriend.email,
            message: this.message
        }).subscribe(res => {
            if (res.success) {
                let message = {
                    from: this.setting.loginInfo.email,
                    to: this.selectedFriend.email,
                    type: 'text',
                    read: 0,
                    message: tmp,
                    created_at: new Date().toTimeString().substr(0, 5)
                }

                this.messageList.push(message);

                this.scrollDown();

            }
        })

        this.socketService.sendSocketData({
            role: 'chat',
            type: 'message',
            to: this.selectedFriend.email,
            from: this.setting.loginInfo.email,
            message: this.message
        })

        this.message = '';
    }

    scrollDown() {
        setTimeout(() => {
            $('.message-content').stop().animate({
                'scrollTop': $('.message-content > div').height() + 100
            }, 0, 'swing', function () {

            });
        }, 10);
    }

    convertLocalTime() {
        for (let i = 0; i< this.messageList.length; i++) {
            let date = new Date(this.messageList[i].created_at);
            this.messageList[i].created_at = date.toTimeString().substr(0, 5);
        }
    }


}