/**
 * Created by ApolloYr on 1/28/2018.
 */
import {Injectable} from '@angular/core';
import {Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {SettingsService} from './setting.service';
import {Api} from './api.service';

@Injectable()
export class AuthGuard implements Resolve<any> {

    constructor(private router: Router,
                private settings: SettingsService,
                private api: Api,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.settings.isLoggedIn) {
                console.log('isLoggedIn');
                resolve(true);
            }
            else if (this.settings.getStorage('token')) {
                console.log('Have Token');
                // this.api.checkLogin().subscribe(res => {
                //     console.log('checklogin Success');
                //     if (res['LoginResult'] && res['LoginResult'] == 'LoginCorrecto') {
                //         this.settings.isLoggedIn = true;
                //         resolve(true);
                //     } else {
                //         this.router.navigate(['auth/login']);
                //     }
                // }, err => {
                //     reject('information is invalid');
                //     this.settings.setStorage('token', false);
                //     this.router.navigate(['auth/login']);
                // });
            } else {
                // reject('not logged in');
                // this.router.navigate(['auth/login']);
            }
        });
    }
}
