import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttestationsComponent } from './LCA_ADMIN/attestations/attestations.component';
import { ImportAttestationsComponent } from './LCA_ADMIN/import-attestations/import-attestations.component';
import { PendingAttestationsComponent } from './LCA_ADMIN/pending-attestations/pending-attestations.component';
import { CompletedAttestationsComponent } from './LCA_ADMIN/completed-attestations/completed-attestations.component';
import { RisklcaComponent } from './LCA_ADMIN/risklca/risklca.component';
import { ImportAttestationsCreateComponent } from './LCA_ADMIN/import-attestations/import-attestations-create/import-attestations-create.component';

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
import { MultiSelectModule } from 'primeng/multiselect';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { AuthGuard } from '../auth.guard';

const routes = [
  {
    path: 'lcadashboard',
    component: AttestationsComponent,
    data: { role: [11, 12], name: 'lcadashboard' },
    canActivate: [AuthGuard],
  },
  {
    path: 'importslca',
    component: ImportAttestationsComponent,
    data: { role: [11, 12], name: 'importslca' },
    canActivate: [AuthGuard],
  },
  {
    path: 'pendinglca',
    component: PendingAttestationsComponent,
    data: { role: [11, 12], name: 'pendinglca' },
    canActivate: [AuthGuard],
  },
  {
    path: 'completedlca',
    component: CompletedAttestationsComponent,
    data: { role: [11, 12], name: 'completedlca' },
    canActivate: [AuthGuard],
  },
  {
    path: 'risklca',
    component: RisklcaComponent,
    data: { role: [11, 12], name: 'risklca' },
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [
    AttestationsComponent,
    ImportAttestationsComponent,
    PendingAttestationsComponent,
    CompletedAttestationsComponent,
    RisklcaComponent,
    ImportAttestationsCreateComponent,
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
    MultiSelectModule,
    MatTabsModule,
    MatChipsModule,
    ConfirmDialogModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatDividerModule,
    MatListModule,
    NgxEchartsModule,
    MatSelectModule,
  ],
})
export class LcaLoginModule {}
