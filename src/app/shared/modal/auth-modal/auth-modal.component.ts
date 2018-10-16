/**
 * Created by ApolloYr on 2/5/2018.
 */

import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Component, Inject, OnInit} from "@angular/core";
import {SettingsService} from "../../../services/setting.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Validate} from "../../../services/validate.service";
import {ClientApi} from "../../../services/clientapi.service";
import {NotifyService} from "../../../services/notify.service";
import {SocketService} from "../../../services/socket.service";

@Component({
    selector   : 'auth-modal',
    templateUrl: 'auth-modal.component.html',
    styleUrls: ['./auth-modal.component.scss']
})
export class AuthModalComponent implements OnInit
{

    state = 'signin';
    step = 1;

    signupForm: FormGroup;
    fullInfoForm: FormGroup;
    loginForm: FormGroup

    loginInfo = {
        email: '',
        password: ''
    }

    signupInfo = {
        email: '',
        password: ''
    }

    fullInfo = {
        name: '',
        age: '',
        gender: ''
    }

    constructor(
        public dialogRef: MatDialogRef<AuthModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public setting: SettingsService,
        public formBuilder: FormBuilder,
        public validate: Validate,
        public api: ClientApi,
        public notify: NotifyService,
        public socketService: SocketService
    )
    {

    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
            password: ['', Validators.required],
        })

        this.signupForm = this.formBuilder.group({
            email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
            password: ['', Validators.required],
        })

        this.fullInfoForm = this.formBuilder.group({
            name: [null, Validators.required],
            age: [null, Validators.required],
            gender: [null, Validators.required],
        })
    }

    close(): void
    {
        this.dialogRef.close();
    }

    register() {
        if (this.signupForm.valid) {
            this.api.register(this.signupInfo).subscribe(res => {
                if (res.success) {
                    this.step = 2;
                    this.setting.setUserSetting('email', res.email);

                    this.setting.setStorage('token', res.token);
                } else {
                    let type = 'error';
                    this.notify.showNotification(type, res.error);
                }
            })
        } else {
            this.validate.validateAllFormFields(this.signupForm);
        }
    }

    registerFullInfo() {
        if (this.fullInfoForm.valid) {
            this.api.registerInfo(this.fullInfo).subscribe(res => {
                if (res.success) {
                    this.setting.isLoggedIn = true;
                    this.setting.loginInfo = res;

                    this.setting.setUserSetting('gender', res.gender);
                    this.setting.setStorage('gender', res.gender);

                    this.socketService.sendLoginInfo();   //// send user info for the socket
                    this.uploadPhoto();

                    this.getFriendList();           //// get friends list
                    this.dialogRef.close({login: true});
                }
            })
        } else {
            this.validate.validateAllFormFields(this.fullInfoForm);
        }
    }

    login() {
        if (this.loginForm.valid) {
            this.api.login(this.loginInfo).subscribe(res => {
                if (res.success) {
                    this.setting.setUserSetting('email', res.email);
                    if (res.name == null) {
                        this.step = 2;
                    } else if(res.name) {
                        this.setting.loginInfo = res;
                        this.setting.isLoggedIn = true;
                        this.setting.setStorage('token', res.token);

                        this.setting.setUserSetting('gender', res.gender);
                        this.setting.setStorage('gender', res.gender);

                        this.socketService.sendLoginInfo();   //// send user info for the socket
                        this.uploadPhoto();

                        this.getFriendList();           /// get friends list
                        this.dialogRef.close({login: true});
                    }
                } else {
                    this.notify.showNotification('warn', 'login failed');
                }
            })
        } else {
            this.validate.validateAllFormFields(this.loginForm);
        }
    }

    loginWithGoogle() {
        let newWindow = window.open(this.setting.apiUrl + '/login/google', '', "width=600, height=600");
        console.log(newWindow);

    }

    loginWithFacebook() {
        let newWindow = window.open(this.setting.apiUrl + '/login/facebook', '', "width=600, height=600")
    }

    getFriendList() {
        this.api.get('/getFriendList', {
            email: this.setting.loginInfo.email
        }).subscribe(res => {
            if (res.success) {
                this.setting.friendList = res.friends
                console.log(this.setting.friendList);
            }
        })
    }

    uploadPhoto() {
        if (this.setting.loginInfo.photo == null || this.setting.loginInfo.photo == '') {
            this.api.uploadPhoto();
        }
    }

}