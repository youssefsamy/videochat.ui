/**
 * Created by ApolloYr on 4/17/2018.
 */
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Component, Inject, OnInit} from "@angular/core";
import {SettingsService} from "../../../services/setting.service";
import {EventsService} from "angular4-events";

@Component({
    selector: 'select-language',
    templateUrl: 'select-language.component.html',
    styleUrls: ['./select-language.component.scss']
})
export class SelectLanguageModalComponent implements OnInit {

    public translate: any;

    constructor(public dialogRef: MatDialogRef<SelectLanguageModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                public setting: SettingsService,
                public event: EventsService,) {
        this.translate = this.data.translate;

        console.log(this.translate);
    }

    ngOnInit() {

    }

    close() {
        this.dialogRef.close();
    }
}