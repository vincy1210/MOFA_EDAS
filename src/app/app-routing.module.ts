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
// import {
//   Error400Component,
//   Error500Component,
//   PageErrorHandleComponent,
// } from "src/app/shared/components/page-error-handle/page-error-handle.component";
import { UnauthorizedComponent, Error400Component, Error500Component } from './error/unauthorized/unauthorized.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FinedetailsComponent } from './finedetails/finedetails.component';
// import { PdfExportComponent } from './shared/components/pdf-export/pdf-export.component';
import { PdfExportComponent } from './shared/components/pdf-export/pdf-export.component';

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
  {
    path: 'pdfexport',
    component: PdfExportComponent,
    data: { role: ['Admin', 'User'] },
  },

  //PdfExportComponent
  
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
  { path: 'PageNotFound', component: PageNotFoundComponent },
  
      {
        path: "error-400",
        component: Error400Component,
        data: { name: "error-400" },
      },
      {
        path: "error-500",
        component: Error500Component,
        data: { name: "error-500" },
      }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
