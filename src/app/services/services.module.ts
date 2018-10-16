/**
 * Created by ApolloYr on 2/5/2018.
 */
import {NgModule} from '@angular/core';
import {SettingsService} from "./setting.service";
import {Api} from "./api.service";
import {AuthGuard} from "./authguard.service";
import {NotifyService} from "./notify.service";
import {Validate} from "./validate.service";
import {ClientApi} from "./clientapi.service";
import {MessageService} from 'primeng/components/common/messageservice';
import {SocketService} from "./socket.service";




@NgModule({
    imports: [

    ],
    declarations: [],
    providers: [
        SettingsService,
        Api,
        AuthGuard,
        NotifyService,
        ClientApi,
        Validate,
        MessageService,
        SocketService
    ],
    exports: [

    ]
})
export class ServicesModule {

}
