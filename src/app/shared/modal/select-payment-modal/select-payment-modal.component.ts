/**
 * Created by ApolloYr on 4/10/2018.
 */
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Component, Inject, OnInit} from "@angular/core";
import {SettingsService} from "../../../services/setting.service";
import {EventsService} from "angular4-events";

@Component({
    selector: 'select-payment-modal',
    templateUrl: 'select-payment-modal.component.html',
    styleUrls: ['./select-payment-modal.component.scss']
})
export class SelectPaymentModalComponent implements OnInit {
    constructor(public dialogRef: MatDialogRef<SelectPaymentModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                public setting: SettingsService,
                public event: EventsService,) {

    }

    ngOnInit() {

    }

    close() {
        this.dialogRef.close();
    }

    selectItem(i) {
        this.setting.selectedPayment = this.setting.paymentOptions[i];
        this.dialogRef.close();
    }
}