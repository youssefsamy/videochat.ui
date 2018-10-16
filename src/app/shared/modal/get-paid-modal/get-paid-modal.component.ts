/**
 * Created by ApolloYr on 4/11/2018.
 */
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Component, Inject, OnInit} from "@angular/core";
import {SettingsService} from "../../../services/setting.service";
import {EventsService} from "angular4-events";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Validate} from "../../../services/validate.service";
import {ClientApi} from "../../../services/clientapi.service";
import {NotifyService} from "../../../services/notify.service";

@Component({
    selector: 'get-paid-modal',
    templateUrl: 'get-paid-modal.component.html',
    styleUrls: ['./get-paid-modal.component.scss']
})
export class GetPaidModalComponent implements OnInit {

    public total_amount = 0;

    public loading = false;

    form: FormGroup
    email = '';

    constructor(public dialogRef: MatDialogRef<GetPaidModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                public setting: SettingsService,
                public event: EventsService,
                public formBuilder: FormBuilder,
                public validate: Validate,
                public api: ClientApi,
                public notify: NotifyService
    ) {
    }

    ngOnInit() {

        this.form = this.formBuilder.group({
            email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
        })

        this.total_amount = this.data.mins*5/55;

        this.event.subscribe('get_paid').subscribe(() => {
            this.dialogRef.close({paid: true, mins: this.total_amount*55/5});
        })
    }

    close() {
        this.dialogRef.close();
    }

    selectItem(i) {
        this.setting.selectedPayment = this.setting.paymentOptions[i];
    }

    confirm() {
        if (!this.form.valid) {
            this.validate.validateAllFormFields(this.form);
            return;
        }

        this.loading = true;
        this.api.payout({
            email: this.email,
            amount: this.total_amount
        }).subscribe(res => {
            this.loading = false;
            console.log(res);

            if (res.success) {
                this.notify.showNotification('success', "Successfully paid, please check your paypal");
                this.dialogRef.close({success: true});
            }
        }, err => {
            this.loading = false;
        })
    }


}