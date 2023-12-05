import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './registration/registration.component';

import { RouterModule, Routes } from '@angular/router';
import { A11yModule } from '@angular/cdk/a11y';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MAT_CHIPS_DEFAULT_OPTIONS,
  MatChipsModule,
} from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
// import { NgxEchartsModule } from 'ngx-echarts';
// import * as echarts from 'echarts';
import {
  DateAdapter,
  MatNativeDateModule,
  MatRippleModule,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CompanydetailsComponent } from './companydetails/companydetails.component';
import { NgxOtpInputModule } from 'ngx-otp-input';
import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './login/login.component';
import { ToolbarModule } from 'primeng/toolbar';

import {
  RecaptchaModule,
  RECAPTCHA_SETTINGS,
  RecaptchaSettings,
  RecaptchaFormsModule,
  RECAPTCHA_V3_SITE_KEY,
  RecaptchaV3Module,
  
  
} from 'ng-recaptcha';

import { LandingPageComponent } from './landing-page/landing-page.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { AttestationComponent } from './attestation/attestation.component';
import { PaginatorModule } from 'primeng/paginator';
// import { DataViewModule, DataViewLayoutOptions } from 'primeng/dataview';

// //added for grid
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ErrorComponent } from './error/error.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PhysicalAttestationComponent } from './physical-attestation/physical-attestation.component';
import { PhysicalAttestationCreateComponent } from './physical-attestation/physical-attestation-create/physical-attestation-create.component';
import { CooAttestationComponent } from './coo-attestation/coo-attestation.component';
import { CooAttestationCreateComponent } from './coo-attestation/coo-attestation-create/coo-attestation-create.component';
import { CompletedAttestationComponent } from './completed-attestation/completed-attestation.component';
import { ModalPopupService } from 'src/service/modal-popup.service';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment.prod';
import { LeftMenuDrawerComponent } from './shared/components/left-menu-drawer/left-menu-drawer.component';
import { AttestationWorkflowComponent } from './shared/components/attestation-workflow/attestation-workflow.component';
import { CompletedCooRequestsComponent } from './completed-coo-requests/completed-coo-requests.component';
import { LcaCompletedAttestationsComponent } from './lca-completed-attestations/lca-completed-attestations.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { ESealTestComponent } from './e-seal-test/e-seal-test.component';
import { PaymentinfoComponent } from './paymentinfo/paymentinfo.component';
import { CooinreviewComponent } from './coo-attestation/cooinreview/cooinreview.component';
import { PhysicalinreviewComponent } from './physical-attestation/physicalinreview/physicalinreview.component';
import { TagModule } from 'primeng/tag';
import {NgIdleKeepaliveModule} from '@ng-idle/keepalive'

// import { EidFormatterPipe } from './eid-formatter.pipe';
//import { PhoneMaskDirective } from './phone-mask.directive';
// import { TwoWayBindDirective } from './two-way-bind.directive';
// import { AttestationDetailsModalComponent } from './attestation/attestation-details-modal/attestation-details-modal.component';
// // import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
// import {MatDialog, MatDialogModule} from '@angular/material/dialog';
// import {MatButtonModule} from '@angular/material/button';


// import { PrimeIcons } from 'primeng/api';

/// 6LeA5fcnAAAAAEIP7UI5750gbJxgKqgrkHQ-YXXM  site key--   6LcVQRwoAAAAAB6scwIvG78wLgpk516pJJ-IB-qQ secret key-  6LcVQRwoAAAAAE3-tm9pf3erpqk2hyE6EGPs01hU

const RECAPTCHA_V3_STACKBLITZ_KEY = environment.recaptcha.siteKey;
const RECAPTCHA_V2_DUMMY_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
// import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ReportsComponent } from './reports/reports.component';
import { LCAComponent } from './reports/lca/lca.component';
import { COOComponent } from './reports/coo/coo.component';
import { PhysicalComponent } from './reports/physical/physical.component';
import { FinesComponent } from './reports/fines/fines.component';





@NgModule({
  declarations: [
    
    AppComponent,
    RegistrationComponent,
    CompanydetailsComponent,
    LandingPageComponent,
    AttestationComponent,
    ErrorComponent,
    PhysicalAttestationComponent,
    PhysicalAttestationCreateComponent,
    CooAttestationComponent,
    CooAttestationCreateComponent,
    CompletedAttestationComponent,LeftMenuDrawerComponent, AttestationWorkflowComponent, CompletedCooRequestsComponent,
    LcaCompletedAttestationsComponent,
    ESealTestComponent, LoginComponent, PaymentinfoComponent, CooinreviewComponent, PhysicalinreviewComponent, ReportsComponent, LCAComponent, COOComponent, PhysicalComponent, FinesComponent, 
    //PhoneMaskDirective, 

    
      ],

  imports: [
    NgIdleKeepaliveModule.forRoot() ,//vincy
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    RecaptchaModule,
    NgxOtpInputModule,
    BrowserModule,
    AppRoutingModule,
    // RouterModule.forRoot(routes),
    BrowserModule,
    ReactiveFormsModule,
    // RouterModule.forRoot(routes),
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatButtonToggleModule,
    MatMenuModule,
    LayoutModule,
    MatSidenavModule,
    MatGridListModule,
    MatListModule,
    FormsModule,
    HttpClientModule,
    A11yModule,
    ClipboardModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    PortalModule,
    ScrollingModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    DashboardModule,
    PaginatorModule,
    //grid view
    TableModule,
    CalendarModule,
    SliderModule,
    MultiSelectModule,
    ContextMenuModule,
    DropdownModule,
    ButtonModule,
    DropdownModule,
    ProgressBarModule,
    InputTextModule,
    ToastModule,
    PdfViewerModule,   RecaptchaFormsModule,
    RecaptchaV3Module, ToolbarModule, DialogModule, ConfirmDialogModule, TagModule, NgIdleKeepaliveModule
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    
        {
          provide: RECAPTCHA_SETTINGS,
          useValue: {
            siteKey: RECAPTCHA_V2_DUMMY_KEY
          } as RecaptchaSettings
        },
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: RECAPTCHA_V3_STACKBLITZ_KEY,
    },
    
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    ModalPopupService,
    DatePipe,
  ],
  bootstrap: [AppComponent],
  // exports: [
  //   PhoneMaskDirective
  // ],
})
export class AppModule {}
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}
