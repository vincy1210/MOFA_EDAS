import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanydetailsComponent } from './companydetails/companydetails.component';
import { RegistrationComponent } from './registration/registration.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AttestationComponent } from './attestation/attestation.component';

const routes: Routes = [

  {
    path: "home/:param1/:param2/:param3", component: RegistrationComponent 
  },
  {
    path: "login/:param1/:param2/:param3", component: RegistrationComponent 
  },
  {
    path: 'landing',
    component: LandingPageComponent,
  },
  {
    path:'Attestation',
    component:AttestationComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule {

  
 }
