import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanydetailsComponent } from './companydetails/companydetails.component';
import { RegistrationComponent } from './registration/registration.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AttestationComponent } from './attestation/attestation.component';
import { AttestationWorkflowComponent } from './shared/components/attestation-workflow/attestation-workflow.component';

import { CompletedCooRequestsComponent } from './completed-coo-requests/completed-coo-requests.component';

import { LcaCompletedAttestationsComponent } from './lca-completed-attestations/lca-completed-attestations.component';
import { PhysicalAttestationComponent } from './physical-attestation/physical-attestation.component';
import { CooAttestationComponent } from './coo-attestation/coo-attestation.component';
import { CompletedAttestationComponent } from './completed-attestation/completed-attestation.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';

// const routes: Routes = [

//   {
//     path: "home/:param1/:param2/:param3", component: RegistrationComponent 
//   },
//   {
//     path: "login/:param1/:param2/:param3", component: RegistrationComponent 
//   },
//   {
//     path: 'landing',
//     component: LandingPageComponent,
//   },
//   {
//     path:'Attestation',
//     component:AttestationComponent
//   }
// ];

const routes: Routes = [
  {
    path: '',
    redirectTo: '/registration',
    pathMatch: 'full',
  },

  { path: 'registration', component: RegistrationComponent },
  { path: 'companydetails', component: CompanydetailsComponent },
  { path: 'physicalattestation', component: PhysicalAttestationComponent },
  { path: 'cooattestation', component: CooAttestationComponent },
    { path: 'completedattestation', component: CompletedAttestationComponent },
  {path:'landingpage',component:LandingPageComponent},
  {path:'attestationworkflow',component:AttestationWorkflowComponent},
  {path:'CompletedCooRequests',component:CompletedCooRequestsComponent},
  {path:'attestation',component:AttestationComponent},
  {path:'lcacompletedattestation',component:LcaCompletedAttestationsComponent},
  {path:'dashboard',component:DashboardComponent},

  


];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule {

  
 }
