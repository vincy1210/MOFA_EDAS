import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { UserslistComponent } from './userslist/userslist.component';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { MatRadioModule } from '@angular/material/radio';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
// import { PhoneMaskDirective } from '../phone-mask.directive';
import { PhoneMaskDirective } from './userslist/phone-mask.directive';
import { EidFormatterPipe } from '../eid-formatter.pipe';
import { TooltipModule } from 'primeng/tooltip';

const routes: Routes = [
  {
    path: 'Dashboard',
    component: DashboardComponent,
  },
  {
    path: 'userslist',
    component: UserslistComponent,
  },
];

@NgModule({
  declarations: [
    DashboardComponent,
    UserslistComponent,
    PhoneMaskDirective,
    EidFormatterPipe,
  ],
  imports: [
    RouterModule,
    TableModule,
    ToolbarModule,
    MatDatepickerModule,
    FormsModule,
    DialogModule,
    ReactiveFormsModule,
    ButtonModule,
    TranslateModule,
    MatRadioModule,
    TooltipModule,
    CommonModule,
    ConfirmDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatListModule,
    MatIconModule,
    NgxEchartsModule,
    NgxEchartsModule.forRoot({
      echarts,
    }),
  ],
  exports: [PhoneMaskDirective],
})
export class DashboardModule {}
