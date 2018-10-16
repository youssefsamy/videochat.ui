/**
 * Created by ApolloYr on 2/3/2018.
 */

import { AfterViewInit, Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { AuthModalComponent } from "../../shared/modal/auth-modal/auth-modal.component";
import { SettingsService } from "../../services/setting.service";
import { NotifyService } from "../../services/notify.service";
import { SocketService } from "../../services/socket.service";
import { EventsService } from "angular4-events";
import { ClientApi } from "../../services/clientapi.service";
import { PaymentModalComponent } from "../../shared/modal/payment-modal/payment-modal.component";
import { GenderModalComponent } from "../../shared/modal/gender-modal/gender-modal.component";
import { GetPaidModalComponent } from "../../shared/modal/get-paid-modal/get-paid-modal.component";

@Component({
    selector: 'page-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
    page: string;

    constructor(
        public dialog: MatDialog,
        public setting: SettingsService,
        public notify: NotifyService,
        public socketService: SocketService,
        public event: EventsService,
        public api: ClientApi
    ) {
        this.page = 'videochat';
    }

    ngOnInit() {
        this.socketService.initSocket();
    }

    ngAfterViewInit() {
        if (!this.setting.getUserSetting('gender')) {
            setTimeout(() => {
                this.showGenderModal()
            }, 500);
        }
    }

    signin() {
        let dialogRef = this.dialog.open(AuthModalComponent, {
            width: '550px'
        });
    }

    signout() {
        this.socketService.sendLogout();

        this.setting.isLoggedIn = false;
        this.setting.setUserSetting('email', null)
        this.setting.setStorage('token', false);
        this.event.publish('logout');

        this.setting.photo = '';

        this.setting.friendList = [];
    }

    showPaymentModal() {
        let dialogRef = this.dialog.open(PaymentModalComponent, {
            width: '750px',
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(res => {
            if (typeof res !== 'undefined' && res.buy) {
                console.log(res.mins);

                this.api.buyMins(res.mins).subscribe(res => {
                    if (res.success) {
                        this.setting.loginInfo.left_mins = res.left_mins;
                    }
                })
            }
        })
    }

    showGenderModal() {
        let dialogRef = this.dialog.open(GenderModalComponent, {
            width: '550px',
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(res => {
            if (typeof res !== 'undefined' && res.gender) {
                console.log(res.gender);
                this.setting.setUserSetting('gender', res.gender);
                this.setting.setStorage('gender', res.gender);
            }
        })
    }

    getPaid() {
        if (this.setting.loginInfo.left_mins < 55) {
            this.notify.showNotification('warn', "you need to have over 55min to get paid");
            return;
        }

        window.open('http://www.ladiespays.somee.com/Consulta');

        //location.href = "http://www.ladiespays.somee.com/Consulta";

        // let dialogRef = this.dialog.open(GetPaidModalComponent, {
        //     width: '400px',
        //     disableClose: true,
        //     data: {
        //         mins: this.getPayMins(this.setting.loginInfo.left_mins)
        //     }
        // });
        //
        // dialogRef.afterClosed().subscribe(res => {
        //     if (typeof res !== 'undefined' && res.success) {
        //         this.api.paidMin(this.getPayMins(this.setting.loginInfo.left_mins)).subscribe(res => {
        //             console.log(res);
        //             if (res.success) {
        //                 this.setting.loginInfo.left_mins = res.left_mins;
        //             }
        //         })
        //     }
        // })
    }

    getPayMins(mins) {
        let result = Math.floor(mins / 55) * 55;
        return result;
    }
}