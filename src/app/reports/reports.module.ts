import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { COOComponent } from './coo/coo.component';
import { FinesComponent } from './fines/fines.component';
import { LCAComponent } from './lca/lca.component';
import { PhysicalComponent } from './physical/physical.component';
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

const routes: Routes = [
  {
    path: 'rptlca',
    component: LCAComponent,
    data: { role: ['Admin', 'User'], name: 'rptlca' },
    canActivate: [AuthGuard],
  },
  {
    path: 'rptcoo',
    component: COOComponent,
    data: { role: ['Admin', 'User'], name: 'rptcoo' },
    canActivate: [AuthGuard],
  },
  {
    path: 'rptphysical',
    component: PhysicalComponent,
    data: { role: ['Admin', 'User'], name: 'rptphysical' },
    canActivate: [AuthGuard],
  },
  {
    path: 'rptfines',
    component: FinesComponent,
    data: { role: ['Admin', 'User'], name: 'rptfines' },
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [
    COOComponent,
    FinesComponent,
    LCAComponent,
    PhysicalComponent,
    ReportsComponent,
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
  ],
})
export class ReportsModule {}
