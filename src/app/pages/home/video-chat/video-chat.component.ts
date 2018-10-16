/**
 * Created by ApolloYr on 2/3/2018.
 */

import {Component, EventEmitter, NgZone, OnInit, Output} from "@angular/core";
import {SocketService} from "../../../services/socket.service";
import {SettingsService} from "../../../services/setting.service";
import {EventsService} from "angular4-events";
import {Api} from "../../../services/api.service";
import {NotifyService} from "../../../services/notify.service";
import {ClientApi} from "../../../services/clientapi.service";
import {MatDialog} from "@angular/material";
import {SelectLanguageModalComponent} from "../../../shared/modal/select-language/select-language.component";

declare var $: any;
declare var OT: any;
@Component({
    selector: 'page-video-chat',
    templateUrl: './video-chat.component.html',
    styleUrls: ['./video-chat.component.scss']
})
export class VideoChatComponent implements OnInit {

    turnOn = false;
    public timer;

    status = 'unconnected';
    //status = 'connected';

    public carouselOne;
    public femaleSlideImages = [
        {url: 'assets/images/girls/demo1.png'},
        {url: 'assets/images/girls/demo2.png'},
        {url: 'assets/images/girls/demo3.png'},
        {url: 'assets/images/girls/demo4.png'},
        {url: 'assets/images/girls/demo5.png'},
        {url: 'assets/images/girls/demo6.png'},
    ];

    public maleSlideImages = [
        {url: 'assets/images/males/demo1.png'},
        {url: 'assets/images/males/demo2.png'},
        {url: 'assets/images/males/demo3.png'},
        {url: 'assets/images/males/demo4.png'},
        {url: 'assets/images/males/demo5.png'},
        {url: 'assets/images/males/demo6.png'},
    ]


    public apiKey = '46095642';

    public partner = {
        partnerId: '',
        name: '',
        email: ''
    }

    public session: any;
    public publisher: any;

    public message = '';
    public messages = [];

    public time: any = '';
    public clock: any = null;

    public enableNext = true;

    @Output() loginEvent: EventEmitter<any> = new EventEmitter();

    constructor(public socketService: SocketService,
                public setting: SettingsService,
                public event: EventsService,
                public zone: NgZone,
                public api: ClientApi,
                public notify: NotifyService,
                public dialog: MatDialog
    ) {

    }


    ngOnInit() {
        this.carouselOne = {
            grid: {xs: 3, sm: 3, md: 3, lg: 3, all: 0},
            slide: 1,
            speed: 800,
            interval: 4000,
            point: {
                visible: false
            },
            load: 3,
            touch: true,
            loop: true,
            custom: 'tile'
        }

        this.initSocket();

        this.event.subscribe('logout').subscribe(res => {
            // if (this.status == 'connected') {
            //     this.endChat();
            // }

            this.endChat();
        })
    }

    turnonWelcomeCamera() {
        let that = this;
        that.turnOn = true;
        navigator.mediaDevices.getUserMedia({audio: true, video: true}).then(
            function (stream) {

                //let video = document.getElementById('localVideo');
                let welcomeLocalVideo = <HTMLVideoElement> document.getElementById('welcomeLocalVideo');
                //let localVideo = document.getElementById('localVideo');
                console.log(welcomeLocalVideo);
                welcomeLocalVideo.setAttribute('src', window.URL.createObjectURL(stream));
                //localVideo.setAttribute('src', window.URL.createObjectURL(stream));

                setTimeout(() => {
                    let canvas = <HTMLCanvasElement> document.getElementById('canvas');
                    let context = canvas.getContext('2d');
                    context.drawImage(welcomeLocalVideo, 0, 0, 200, 200);

                    if (that.setting.isLoggedIn && that.setting.loginInfo.photo == null) {
                        that.setting.photo = canvas.toDataURL('image/png');
                        that.api.uploadPhoto();
                    } else if (!that.setting.isLoggedIn && that.setting.photo == '') {
                        that.setting.photo = canvas.toDataURL('image/png');
                    }

                }, 1000);
            },
            function (err) {
                that.turnOn = false;

                setTimeout(() => {
                    console.log("The following error occurred: " + err.name);

                    if (err.name == 'NotFoundError') {
                        alert("Camera not found");
                    }
                }, 100)
            }
        );
    }

    back() {
        this.turnOn = false;
    }

    startSearch() {

        this.time = 0;
        this.upDataProgress();
        this.stopTimer();          //// stop 60s tracker
        this.stopTrackMins();    ////   stop mins tracker

        this.enableNext = true;
        this.messages = [];
        this.turnOn = false;

        // if (!this.setting.isLoggedIn) {
        //     this.loginEvent.emit();
        //     return;
        // }

        this.status = 'finding';
        this.socketService.sendSocketData({
            role: 'video',
            type: 'videoChatRequest',
            gender: this.setting.getUserSetting('gender'),
            email: this.setting.isLoggedIn ? this.setting.loginInfo.email : 'unknown',
            name: this.setting.isLoggedIn ? this.setting.loginInfo.name : 'unknown'
        })

    }

    initSocket() {
        this.event.subscribe('videoSocket').subscribe(data => {
            switch (data.type) {
                case 'connected':
                    this.setPartner(data);
                    this.status = 'connected';
                    console.log('connected')
                    this.turnOnLocalVideo();
                    this.initializeSession(data.sessionId, data.token);
                    break;
                case 'disconnect':
                    if (data.user == this.partner.partnerId && this.status == 'connected') {
                        this.deleteSession();
                        this.startSearch();
                    }
                    break;
                case 'endChat':
                    if (this.status == 'connected') {
                        this.deleteSession();
                        this.startSearch();
                    }
                    break;
                case 'message':
                    this.receiveMessage(data);
                    break;
            }
        })
    }

    setPartner(data) {
        this.partner.partnerId = data.partner;
        this.partner.email = data.email;
        this.partner.name = data.name;
    }

    turnOnLocalVideo() {
        navigator.mediaDevices.getUserMedia({audio: true, video: true}).then(function (stream) {
            //let video = document.getElementById('localVideo');
            let localVideo = $('#localVideo');
            localVideo[0].src = window.URL.createObjectURL(stream);
        }, function (error) {

        });
    }

    deleteSession() {
        if (typeof this.session !== 'undefined' && typeof this.publisher !== 'undefined') {
            this.session.unpublish(this.publisher);
            this.publisher.destroy()
        }
    }

    initializeSession(sessionId, token) {

        let that = this;

        this.deleteSession();

        this.session = OT.initSession(this.apiKey, sessionId);

        this.publisher = OT.initPublisher('publisherContainer', {
            width: '100%',
            height: '100%'
        }, function (error) {
            if (error) {
                alert(error.message);
            }
        });

        this.session.connect(token, function (error) {
            // If the connection is successful, publish to the session
            if (error) {
                if (error) {
                    alert(error.message);
                }
            } else {
                that.session.publish(that.publisher, function (error) {
                    if (error) {
                        alert(error.message);
                    }
                });
            }
        });

        this.session.on('streamCreated', function (event) {
            that.startTimer(60);     //// count 60s
            that.session.subscribe(event.stream, 'subscriber', {
                insertMode: 'append',
                width: '100%',
                height: '100%'
            }, function (error) {
                if (error) {
                    alert(error.message);
                }
            });
        });
    }

    sendMessage() {
        if (this.message == '') return;
        this.socketService.sendSocketData({
            role: 'video',
            type: 'message',
            to: this.partner.partnerId,
            message: this.message
        });
        this.messages.push({
            type: 'send',
            message: this.message
        })

        this.message = '';

        setTimeout(() => {
            $('.message').stop().animate({
                'scrollTop': $('.message-inner').height() + 100
            }, 0, 'swing', function () {

            });
        }, 10);

    }

    receiveMessage(data) {
        console.log(data);

        if (this.setting.translate.auto) {
            this.api.translate({
                text: data.message,
                lang: this.setting.translate.lang
            }).subscribe(res => {
                res = JSON.parse(res);
                console.log(res);

                this.messages.push({
                    type: 'received',
                    original: data.message,
                    message: res.translatedText,
                    translate: true,
                })

                setTimeout(() => {
                    $('.message').stop().animate({
                        'scrollTop': $('.message-inner').height() + 100
                    }, 0, 'swing', function () {

                    });
                }, 10);
            })
        } else {
            this.messages.push({
                type: 'received',
                original: data.message,
                message: data.message,
                translate: false,
            })

            setTimeout(() => {
                $('.message').stop().animate({
                    'scrollTop': $('.message-inner').height() + 100
                }, 0, 'swing', function () {

                });
            }, 10);
        }
    }

    sendMessageByEnter($event) {
        if ($event.keyCode == '13') {
            this.sendMessage();
        }
    }

    findNext() {

        this.stopTimer();      ////////  stop 60s timer
        this.stopTrackMins();    ///////////  stop mins tracker

        this.socketService.sendSocketData({
            role: 'video',
            type: 'endChat',
            to: this.partner.partnerId,
        });
        this.deleteSession();
        this.startSearch();


    }

    endChat() {

        this.stopTimer();      ////////  stop 60s timer
        this.stopTrackMins();    ///////////  stop mins tracker

        this.deleteSession();
        this.socketService.sendSocketData({
            role: 'video',
            type: 'endChat',
            to: this.partner.partnerId,
        });

        this.status = 'unconnected';
        this.turnOn = false;
    }

    startTimer(secs) {

        this.stopTimer();
        this.time = 0;

        this.clock = setInterval(() => {
            this.zone.run(() => {
                this.time++;
                this.upDataProgress();
                if (this.time >= 60) {       ////   after 60s;

                    if (!this.setting.isLoggedIn) {
                        console.log('end');
                        this.loginEvent.emit();
                        this.endChat();
                        this.stopTimer();
                    } else {
                        this.stopTimer();
                        this.disbleFindNext();

                        this.trackMins();
                    }
                }
            });

        }, 1000);
    }

    upDataProgress() {
        $('.progress-bar').css('width', this.getProgress(this.time));
    }

    getProgress(time) {
        let num = Math.floor((100 * time) / 60);
        return num.toString() + '%';
    }

    stopTimer() {
        clearInterval(this.clock);
        this.clock = null;
    }

    disbleFindNext() {
        this.enableNext = false;
    }

    addFriend() {
        this.api.post('/addFriend', {
            user1: this.setting.loginInfo.email,
            user1_name: this.setting.loginInfo.name,
            user2: this.partner.email,
            user2_name: this.partner.name
        }).subscribe(res => {
            if (res.success) {
                this.notify.showNotification('success', 'friend success added');
            } else {
                if (res.error === 'exist') {
                    this.notify.showNotification('warn', 'friend already added');
                }
            }
        })
    }

    trackMins() {
        this.timer = setInterval(() => {
            if (this.setting.loginInfo.left_mins == 0 && this.setting.loginInfo.gender == 'male') {
                this.endChat();
            } else {
                this.api.pastOneMin().subscribe(res => {
                    this.setting.loginInfo.left_mins = res.left_mins;
                });
            }
        }, 60000);
    }

    stopTrackMins() {
        clearInterval(this.timer);
        this.timer = null;
    }

    stopSearching() {
        this.socketService.sendSocketData({
            role: 'video',
            type: 'stopSearching',
        });

        this.status = 'unconnected';
    }

    selectLanguage() {
        let dialogRef = this.dialog.open(SelectLanguageModalComponent, {
            width: '250px',
            data: {
                translate: this.setting.translate
            }
        });
    }

}