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
import { ESealTestComponent } from './e-seal-test/e-seal-test.component';
import { LoginComponent } from './login/login.component';
import { PaymentinfoComponent } from './paymentinfo/paymentinfo.component';
import { UserslistComponent } from './dashboard/userslist/userslist.component';
import { CooinreviewComponent } from './coo-attestation/cooinreview/cooinreview.component';
import { PhysicalinreviewComponent } from './physical-attestation/physicalinreview/physicalinreview.component';
import { ErrorComponent } from './error/error.component';
import { LCAComponent } from './reports/lca/lca.component';
import { COOComponent } from './reports/coo/coo.component';
import { PhysicalComponent } from './reports/physical/physical.component';
import { FinesComponent } from './reports/fines/fines.component';
import { AttestationsComponent } from './LCA_USERS/LCA_ADMIN/attestations/attestations.component';
import { ImportAttestationsComponent } from './LCA_USERS/LCA_ADMIN/import-attestations/import-attestations.component';
import { PendingAttestationsComponent } from './LCA_USERS/LCA_ADMIN/pending-attestations/pending-attestations.component';
import { CompletedAttestationsComponent } from './LCA_USERS/LCA_ADMIN/completed-attestations/completed-attestations.component';
import { RisklcaComponent } from './LCA_USERS/LCA_ADMIN/risklca/risklca.component';
import { AuthGuard } from './auth.guard';
import { RoleGuard } from './role.guard';
import { UnauthorizedComponent } from './error/unauthorized/unauthorized.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/registration',
    pathMatch: 'full',
  },

  { path: 'registration', component: RegistrationComponent },
  { path: 'companydetails', component: CompanydetailsComponent },
  { path: 'physicalattestation', component: PhysicalAttestationComponent, canActivate: [AuthGuard] , data: { role: [['Admin', 'User']] }},
  { path: 'cooattestation', component: CooAttestationComponent, canActivate: [AuthGuard], data: { role: ['Admin', 'User'] } },
    { path: 'completedattestation', component: CompletedAttestationComponent , data: { role: ['Admin', 'User'] }},
  {path:'landingpage',component:LandingPageComponent,  canActivate: [AuthGuard], data: { role: ['Admin', 'User'] }},
  {path:'attestationworkflow',component:AttestationWorkflowComponent, data: { role: ['Admin', 'User'] }},
  {path:'CompletedCooRequest',component:CompletedCooRequestsComponent, canActivate: [AuthGuard], data: { role: ['Admin', 'User'] }},
  {path:'attestation',component:AttestationComponent, canActivate: [AuthGuard], data: { role: ['Admin', 'User'] }},
  {path:'lcacompletedattestation',component:LcaCompletedAttestationsComponent, canActivate: [AuthGuard], data: { role: ['Admin', 'User'] }},
  {path:'dashboard',component:DashboardComponent, canActivate: [AuthGuard], data: { role: ['Admin', 'User'] }},
  {path:'ESealTest', component:ESealTestComponent},
  {path:'login', component:LoginComponent},
  {path:'paymentdetails', component:PaymentinfoComponent, canActivate: [AuthGuard]},
  {path:'userslist', component:UserslistComponent, canActivate: [AuthGuard], data: { role: ['Admin', 'User'] }},
  {path:'cooinreview', component:CooinreviewComponent, canActivate: [AuthGuard], data: { role: ['Admin', 'User'] }},
  {path:'physicalinreview', component:PhysicalinreviewComponent, canActivate: [AuthGuard], data: { role: ['Admin', 'User'] }},
  {path:'logout', component:ErrorComponent},

  {path:'lca', component:LCAComponent, canActivate: [AuthGuard], data: { role: ['Admin', 'User'] }},
  {path:'coo', component:COOComponent, canActivate: [AuthGuard], data: { role: ['Admin', 'User'] }},
  {path:'physical', component:PhysicalComponent, canActivate: [AuthGuard], data: { role: ['Admin', 'User'] }},
  {path:'fines', component:FinesComponent, canActivate: [AuthGuard], data: { role: ['Admin', 'User'] }},

  {path:'lcadashboard', component:AttestationsComponent, data: { role: [11,12] }},
  {path:'importslca', component:ImportAttestationsComponent, data: { role: [11,12] }},
  {path:'pendinglca', component:PendingAttestationsComponent, data: { role: [11,12] }},
  {path:'completedlca', component:CompletedAttestationsComponent, data: { role: [11,12] }},
  {path:'risklca', component:RisklcaComponent, data: { role: [11,12] }},
  {path:'unauthorized', component:UnauthorizedComponent},

  


  

  


];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule {

  
 }
