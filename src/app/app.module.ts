import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {AppRoutes} from "./app.routing";
import {RouterModule} from "@angular/router";
import {HomeModule} from "./pages/home/home.module";
import {LayoutComponent} from "./layout/layout.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import {PolicyComponent} from "./pages/policy/policy.component";
import {AgreementComponent} from "./pages/agreement/agreement.component";
import {SharedModule} from "./shared/shared.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ServicesModule} from "./services/services.module";
import {HttpClientModule} from "@angular/common/http";
import {GrowlModule} from "primeng/growl";
import {EventsModule} from "angular4-events";


@NgModule({
    declarations: [
        AppComponent,
        LayoutComponent,
        PolicyComponent,
        AgreementComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(AppRoutes),
        HttpClientModule,
        FlexLayoutModule,
        HomeModule,
        SharedModule,
        ServicesModule,
        GrowlModule,
        EventsModule.forRoot()

    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
