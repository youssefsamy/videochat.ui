/**
 * Created by ApolloYr on 2/5/2018.
 */
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from "@angular/flex-layout";
import {MaterialModule} from "./material.module";
import {AuthModalComponent} from "./modal/auth-modal/auth-modal.component"
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PaymentModalComponent} from "./modal/payment-modal/payment-modal.component";
import {GenderModalComponent} from "./modal/gender-modal/gender-modal.component";
import {SelectPaymentModalComponent} from "./modal/select-payment-modal/select-payment-modal.component";
import {GetPaidModalComponent} from "./modal/get-paid-modal/get-paid-modal.component";
import {SelectLanguageModalComponent} from "./modal/select-language/select-language.component";

@NgModule({
    imports: [
        FlexLayoutModule,
        BrowserModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule
    ],
    entryComponents: [
        AuthModalComponent,
        PaymentModalComponent,
        GenderModalComponent,
        SelectPaymentModalComponent,
        GetPaidModalComponent,
        SelectLanguageModalComponent
    ],
    declarations: [
        AuthModalComponent,
        PaymentModalComponent,
        GenderModalComponent,
        SelectPaymentModalComponent,
        GetPaidModalComponent,
        SelectLanguageModalComponent
    ],
    exports: [
        AuthModalComponent,
        PaymentModalComponent,
        GenderModalComponent,
        SelectPaymentModalComponent,
        GetPaidModalComponent,
        SelectLanguageModalComponent
    ],
    providers: [],
})
export class SharedModule {

}