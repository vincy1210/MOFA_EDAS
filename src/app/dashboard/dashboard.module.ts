import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Routes } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';


const routes: Routes = [
  {
    path: 'Dashboard',
    component: DashboardComponent,
  }
]



@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,MatListModule, MatIconModule, NgxEchartsModule,  NgxEchartsModule.forRoot({
      echarts,
    }),

  ]
})
export class DashboardModule { }
