/**
 * Created by ApolloYr on 4/2/2018.
 */
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Component, Inject, OnInit} from "@angular/core";


@Component({
    selector   : 'gender-modal',
    templateUrl: 'gender-modal.component.html',
    styleUrls: ['./gender-modal.component.scss']
})
export class GenderModalComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<GenderModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {

    }

    ngOnInit() {}

    setGender(gender) {
        this.dialogRef.close({gender: gender});
    }
}