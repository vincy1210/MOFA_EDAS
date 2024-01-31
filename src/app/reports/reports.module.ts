import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { COOComponent } from './coo/coo.component';
import { FinesComponent } from './fines/fines.component';
// import { PhysicalComponent } from './physical/physical.component';
import { ReportsComponent } from './reports.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TabViewModule } from 'primeng/tabview';
import { AuthGuard } from '../auth.guard';
import { LcaSettlementsReportsComponent } from './lca-settlements-reports/lca-settlements-reports.component';
import { CustomCurrencyPipe } from 'src/service/custom.pipe';
import { MatSelectModule } from '@angular/material/select';
import { LcaPendingComponent } from './lca/lca-pending/lca-pending.component';
import { CooPendingComponent } from './coo/coo-pending/coo-pending.component';
import { PhysicalPendingComponent } from './physical/physical-pending/physical-pending.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { RegionWiseImportComponent } from './region-wise-import/region-wise-import.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { MatMenuModule } from '@angular/material/menu';

import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { PdfExportComponent } from './pdf-export/pdf-export.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { MatListModule } from '@angular/material/list';
import { ReactiveFormsModule } from '@angular/forms';
 
// import { PdfExportComponent } from '../lca/pdf-export/pdf-export.component';
// import {pdf}



const routes: Routes = [
  {
    path: 'rptpendinglca',
    component: LcaPendingComponent,
    data: { role: ['Admin', 'User'], name: 'rptpendinglca' },
    // canActivate: [AuthGuard],
  },
  {
    path: 'rptregionwiseimport',
    component: RegionWiseImportComponent,
    data: { role: ['Admin', 'User'], name: 'rptregionwiseimport' },
    // canActivate: [AuthGuard],
  },
  {
    path: 'rptpendingcoo',
    component: CooPendingComponent,
    data: { role: ['Admin', 'User'], name: 'rptpendingcoo' },
    // canActivate: [AuthGuard],
  },
  // {
  //   path: 'rptcoo',
  //   component: COOComponent,
  //   data: { role: ['Admin', 'User'], name: 'rptcoo' },
  //   // canActivate: [AuthGuard],
  // },
  {
    path: 'rptpendingphysical',
    component: PhysicalPendingComponent,
    data: { role: ['Admin', 'User'], name: 'rptpendingphysical' },
    // canActivate: [AuthGuard],
  },
  // {
  //   path: 'rptphysical',
  //   component: PhysicalComponent,
  //   data: { role: ['Admin', 'User'], name: 'rptphysical' },
  //   // canActivate: [AuthGuard],
  // },
  {
    path: 'rptfines',
    component: FinesComponent,
    data: { role: ['Admin', 'User'], name: 'rptfines' },
    // canActivate: [AuthGuard],
  },
  {
    path: 'lcasettlementsreport',
    component: LcaSettlementsReportsComponent,
    // canActivate: [AuthGuard],
    data: { name: 'lcasettlementsreport' },
  }, {
    path: 'rptanalytics',
    component: AnalyticsComponent,
    // canActivate: [AuthGuard],
    data: { name: 'analytics' },
  },
];

@NgModule({
  declarations: [
    PdfExportComponent,
    CustomCurrencyPipe,
    FinesComponent,
    // LCAComponent,
    ReportsComponent,
    LcaSettlementsReportsComponent,
    LcaPendingComponent,
    CooPendingComponent,
    PhysicalPendingComponent,
    RegionWiseImportComponent,
    AnalyticsComponent,
  ],
  imports: [
    
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    ButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    TableModule,
    TooltipModule,
    DialogModule,
    TagModule,
    ToolbarModule,
    PdfViewerModule,
    TabViewModule,
    MatSelectModule,MatTabsModule, MatChipsModule, MatButtonModule, NgxEchartsModule, MatMenuModule, Ng2GoogleChartsModule,
    MatListModule, ReactiveFormsModule
  ],
})
export class ReportsModule {}
