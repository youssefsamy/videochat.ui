/**
 * Created by ApolloYr on 3/5/2018.
 */
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {Component, Inject, OnInit} from "@angular/core";
import {SettingsService} from "../../../services/setting.service";
import {EventsService} from "angular4-events";
import {SelectPaymentModalComponent} from "../select-payment-modal/select-payment-modal.component";

@Component({
    selector   : 'payment-modal',
    templateUrl: 'payment-modal.component.html',
    styleUrls: ['./payment-modal.component.scss']
})
export class PaymentModalComponent implements OnInit
{

    public newWindow;
    public mins;
    public price;

    constructor(
        public dialogRef: MatDialogRef<PaymentModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public setting: SettingsService,
        public event: EventsService,
        public dialog: MatDialog,
    )
    {

    }

    ngOnInit() {
        this.event.subscribe('buy_mins').subscribe(() => {
            this.dialogRef.close({buy: true, mins: this.mins, price: this.price});
        })
    }

    buy(mins, price) {

        this.mins = mins;
        this.price = price;

        this.newWindow = window.open(this.setting.apiUrl + '/getCheckout?pay=' + price, "paypal", "width=600, height=600");
    }

    close() {
        if (this.newWindow) {
            this.newWindow.close();
        }
        this.dialogRef.close();
    }

    selectPaymentOption() {
        let selectDialog = this.dialog.open(SelectPaymentModalComponent, {
            width: '400px',
            disableClose: true
        });
    }
}
