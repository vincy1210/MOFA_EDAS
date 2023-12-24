import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompletedCooRequestsComponent } from './completed-coo-requests/completed-coo-requests.component';
import { CooinreviewComponent } from './cooinreview/cooinreview.component';
import { CooAttestationComponent } from './coo-attestation.component';
import { CooAttestationCreateComponent } from './coo-attestation-create/coo-attestation-create.component';

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
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AuthGuard } from '../auth.guard';
// import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

const routes = [
  {
    path: 'CompletedCooRequest',
    component: CompletedCooRequestsComponent,
    data: { role: ['Admin', 'User'], name: 'CompletedCooRequest' },
    canActivate: [AuthGuard],
  },
  {
    path: 'cooinreview',
    component: CooinreviewComponent,
    data: { role: ['Admin', 'User'], name: 'cooinreview' },
    canActivate: [AuthGuard],
  },
  {
    path: 'cooattestation',
    component: CooAttestationComponent,
    data: { role: ['Admin', 'User'], name: 'cooattestation' },
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [
    CooAttestationCreateComponent,
    CompletedCooRequestsComponent,
    CooinreviewComponent,
    CooAttestationComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    // SweetAlert2Module.forRoot(),
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
    MatButtonModule,
    MatButtonToggleModule,
  ],
})
export class CooModule {}
