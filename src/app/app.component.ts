import {Component, OnInit} from '@angular/core';
import {EventsService} from "angular4-events";
import {SettingsService} from "./services/setting.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
    title = 'app';

    constructor(public event: EventsService, public setting: SettingsService) {

    }

    ngOnInit() {

        var _parent = this;
        window.addEventListener('message',function(event) {
            //if(event.origin !== 'http://scriptandstyle.com') return;
            let data = event.data;

            if (data.type && data.type == 'buy_mins') {
                _parent.event.publish('buy_mins');
            }
        }, false);

        this.setting.init();
    }
}
