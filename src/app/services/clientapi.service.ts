/**
 * Created by ApolloYr on 2/5/2018.
 */
import {Injectable} from "@angular/core";
import {Api} from "./api.service";

@Injectable()
export class ClientApi extends Api {

    public login(info) {
        return this.post('/login', {
            email: info.email,
            password: info.password
        })
    }

    public register(info) {
        return this.post('/register', {
            email: info.email,
            password: info.password
        })
    }

    public registerInfo(info) {
        return this.post('/registerInfo', {
            email: this.settings.getUserSetting('email'),
            name: info.name,
            age: info.age,
            gender: info.gender
        })
    }

    public buyMins(mins) {
        return this.post('/buyMins', {
            email: this.settings.loginInfo.email,
            mins: mins
        })
    }

    public getLeftMins(email) {
        return this.post('/getLeftMins', {
            email: email
        });
    }

    public pastOneMin() {
        return this.post('/pastOneMin', {
            email: this.settings.loginInfo.email,
        });
    }

    public uploadPhoto() {

        if (this.settings.photo == '') return;
        this.post('/upload/imageContent', {
            image: this.settings.photo
        }).subscribe(res => {
            if (res.success) {
                this.settings.loginInfo.photo = res.url;
            }
        })
    }

    public payout(data) {
        return this.post('/payout', data);
    }

    public paidMin(min) {
        return this.post('/paidMin', {
            email: this.settings.loginInfo.email,
            min: min
        });
    }

}