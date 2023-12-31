import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanydetailsComponent } from './companydetails/companydetails.component';
import { RegistrationComponent } from './registration/registration.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AttestationWorkflowComponent } from './shared/components/attestation-workflow/attestation-workflow.component';
import { LoginComponent } from './login/login.component';
import { PaymentinfoComponent } from './paymentinfo/paymentinfo.component';
import { ErrorComponent } from './error/error.component';
import { AuthGuard } from './auth.guard';
import { RoleGuard } from './role.guard';
import { UnauthorizedComponent } from './error/unauthorized/unauthorized.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FinedetailsComponent } from './finedetails/finedetails.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/registration',
    pathMatch: 'full',
  },
  { path: 'registration', component: RegistrationComponent },
  {path:'Finedetails', component:FinedetailsComponent},
  {
    path: 'companydetails',
    component: CompanydetailsComponent,
    // canActivate: [AuthGuard],
    data: { name: 'companydetails' },
  },
  {
    path: 'landingpage',
    component: LandingPageComponent,
    // canActivate: [AuthGuard],
    data: { name: 'companydetails' },
  },
  {
    path: 'attestationworkflow',
    component: AttestationWorkflowComponent,
    data: { role: ['Admin', 'User'] },
  },
  
  // {
  //   path: 'payall',
  //   component: PayallComponent,
  //   // data: { role: ['Admin', 'User'], name: 'payall' },
  //   // canActivate: [AuthGuard],
  // },
  // {path:'ESealTest', component:ESealTestComponent},
  { path: 'login', component: LoginComponent },
  { path: 'paymentdetails', component: PaymentinfoComponent },
 
  { path: 'logout', component: ErrorComponent },

  {
    path: 'reports',
    loadChildren: () =>
      import('./reports/reports.module').then((m) => m.ReportsModule),
  },
  {
    path: 'lca',
    loadChildren: () => import('./lca/lca.module').then((m) => m.LcaModule),
  },
  {
    path: 'coo',
    loadChildren: () => import('./coo/coo.module').then((m) => m.CooModule),
  },
  {
    path: 'physical',
    loadChildren: () =>
      import('./physical/physical.module').then((m) => m.PhysicalModule),
  },
  {
    path: 'lca-login',
    loadChildren: () =>
      import('./lca-login/lca-login.module').then((m) => m.LcaLoginModule),
  }
  ,
  {
    path: 'shared',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  }
  ,
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
