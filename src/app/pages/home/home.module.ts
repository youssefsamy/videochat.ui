/**
 * Created by ApolloYr on 2/3/2018.
 */
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {MessageComponent} from "./message/message.component";
import {VideoChatComponent} from "./video-chat/video-chat.component";
import {HomeComponent} from "./home.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import {SharedModule} from "../../shared/shared.module";
import {NgxCarouselModule} from "ngx-carousel";
import 'hammerjs';
import {FormsModule} from "@angular/forms";
import {MaterialModule} from "../../shared/material.module";

@NgModule({
    imports: [
        FlexLayoutModule,
        BrowserModule,
        SharedModule,
        NgxCarouselModule,
        FormsModule,
        MaterialModule
    ],
    entryComponents: [
        MessageComponent,
        VideoChatComponent,

    ],
    declarations: [
        MessageComponent,
        VideoChatComponent,
        HomeComponent,

    ],
    exports: [
        MessageComponent,
        VideoChatComponent,
        HomeComponent,

    ],
    providers: [],
})
export class HomeModule {

}
