import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { PhysicalAttestationComponent } from './physical/physical-attestation.component';
// import { PhysicalAttestationCreateComponent } from './physical/physical-attestation-create/physical-attestation-create.component';
// import { PhysicalinreviewComponent } from './physical/physicalinreview/physicalinreview.component';
import { PhysicalAttestationComponent } from './physical-attestation.component';
import { PhysicalAttestationCreateComponent } from './physical-attestation-create/physical-attestation-create.component';
import { PhysicalinreviewComponent } from './physicalinreview/physicalinreview.component';
import { CompletedAttestationComponent } from './completed-attestation/completed-attestation.component';

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
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AuthGuard } from '../auth.guard';

const routes = [
  {
    path: 'physicalattestation',
    component: PhysicalAttestationComponent,
    data: { role: [['Admin', 'User']], name: 'physicalattestation' },
    canActivate: [AuthGuard],
  },
  {
    path: 'completedattestation',
    component: CompletedAttestationComponent,
    data: { role: ['Admin', 'User'], name: 'completedattestation' },
    canActivate: [AuthGuard],
  },
  {
    path: 'physicalinreview',
    component: PhysicalinreviewComponent,
    data: { role: ['Admin', 'User'], name: 'physicalinreview' },
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [
    PhysicalAttestationComponent,
    PhysicalAttestationCreateComponent,
    PhysicalinreviewComponent,
    CompletedAttestationComponent,
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
    MatSelectModule,
    MatButtonModule,
    MatButtonToggleModule,
  ],
})
export class PhysicalModule {}
