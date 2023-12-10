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
  {path:'CompletedCooRequest',component:CompletedCooRequestsComponent},
  {path:'attestation',component:AttestationComponent},
  {path:'lcacompletedattestation',component:LcaCompletedAttestationsComponent},
  {path:'dashboard',component:DashboardComponent},
  {path:'ESealTest', component:ESealTestComponent},
  {path:'login', component:LoginComponent},
  {path:'paymentdetails', component:PaymentinfoComponent},
  {path:'userslist', component:UserslistComponent},
  {path:'cooinreview', component:CooinreviewComponent},
  {path:'physicalinreview', component:PhysicalinreviewComponent},
  {path:'logout', component:ErrorComponent},

  {path:'lca', component:LCAComponent},
  {path:'coo', component:COOComponent},
  {path:'physical', component:PhysicalComponent},
  {path:'fines', component:FinesComponent},

  {path:'attestationslca', component:FinesComponent},
  {path:'importslca', component:FinesComponent},
  {path:'pendinglca', component:FinesComponent},
  {path:'completedlca', component:FinesComponent},

  


];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule {

  
 }
