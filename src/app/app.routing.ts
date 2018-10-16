import {Routes} from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {PolicyComponent} from "./pages/policy/policy.component";
import {AgreementComponent} from "./pages/agreement/agreement.component";

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'policy',
        component: PolicyComponent
    },
    {
        path: 'agreement',
        component: AgreementComponent
    },
    {path: '**', redirectTo: 'home',}
];
