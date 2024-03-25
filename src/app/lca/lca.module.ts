import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttestationComponent } from './attestation/attestation.component';
import { LcaCompletedAttestationsComponent } from './lca-completed-attestations/lca-completed-attestations.component';

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
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AuthGuard } from '../auth.guard';
import { MatMenuModule } from '@angular/material/menu';
//  
// import { AppModule } from '../app.module';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppModule } from '../app.module';
import { PdfExportComponent } from './pdf-export/pdf-export.component';
import { LcaInProcessComponent } from './lca-in-process/lca-in-process.component';
// import { LcaInHoldComponent } from './lca-in-risk/lca-in-hold.component';

// import { TrimInputDirective } from '../trim-input.directive';
import { LcaInHoldComponent } from './lca-in-hold/lca-in-hold.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
const routes = [
  {
    path: 'attestation',
    component: AttestationComponent,
    data: { role: ['Admin', 'User'], name: 'attestation' },
    canActivate: [AuthGuard],
  },
  {
    path: 'lcacompletedattestation',
    component: LcaCompletedAttestationsComponent,
    data: { role: ['Admin', 'User'], name: 'lcacompletedattestation' },
    canActivate: [AuthGuard],
  },
  {
    path: 'PdfExportComponent',
    component: PdfExportComponent,
    data: { role: ['Admin', 'User'], name: 'PdfExportComponent' },
    canActivate: [AuthGuard],
  },
  {
    path: 'lcainprocess',
    component: LcaInProcessComponent,
    data: { role: ['Admin', 'User'], name: 'lcainprocess' },
    canActivate: [AuthGuard],
  },
  {
    path: 'lcainhold',
    component: LcaInHoldComponent,
    data: { role: ['Admin', 'User'], name: 'lcainhold' },
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [AttestationComponent, LcaCompletedAttestationsComponent, PdfExportComponent, LcaInProcessComponent, LcaInHoldComponent],
  // schemas: [NO_ERRORS_SCHEMA],
  imports: [
    // PdfExportComponent,
    // AppModule,
    // TrimInputDirective,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
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
    MatDialogModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatMenuModule
  ],
})
export class LcaModule {}
