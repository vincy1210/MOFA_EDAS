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


import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

const routes=[
  {path:'attestation',component:AttestationComponent,  data: { role: ['Admin', 'User'] }},
  {path:'lcacompletedattestation',component:LcaCompletedAttestationsComponent,  data: { role: ['Admin', 'User'] }}]



@NgModule({
  declarations: [
    AttestationComponent,
    LcaCompletedAttestationsComponent

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,ButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    TableModule,
    TooltipModule,
    DialogModule,
    TagModule,ToolbarModule,
    PdfViewerModule, TabViewModule,
    MultiSelectModule, MatTabsModule, MatChipsModule, ConfirmDialogModule,
    MatDialogModule, MatButtonModule, MatButtonToggleModule
  ]
})
export class LcaModule { }
