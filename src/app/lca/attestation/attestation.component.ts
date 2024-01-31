import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  VERSION,
  Inject,
  Input,
} from '@angular/core';

import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  CdkDragStart,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { ApiService } from 'src/service/api.service';
import { CommonService } from 'src/service/common.service';
import { ConstantsService } from 'src/service/constants.service';
import { LazyLoadEvent } from 'primeng/api';
// import * as FileSaver from 'file-saver';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { HttpClient } from '@angular/common/http';
import { MatToolbar } from '@angular/material/toolbar';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
// import {MatDialog, MatDialogModule} from '@angular/material/dialog';
// import {MatButtonModule} from '@angular/material/button';
// import { MatDialog } from '@angular/material/dialog';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
// import {MatDialog, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/service/auth.service';

import { FormControl, Validators, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import { formatDate } from '@angular/common';

import { saveAs } from 'file-saver';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';

// import { PdfExportComponent } from 'src/app/shared/components/pdf-export/pdf-export.component';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-attestation',
  templateUrl: './attestation.component.html',
  styleUrls: ['./attestation.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class AttestationComponent implements OnInit {
  @ViewChild('tableref', { static: true }) tableref: any;
  highlighted: any;
  payorpayall: string = 'pay';

  loading: boolean = true;
  list: any;
  representatives: any;
  statuses: any;
  products: any;
  datasource: any;
  datasource_: any;

  cols: any;
  cols_: any;
  cols_xl: any;
  totalrecords: number = 0;
  totalrecords_coo: number = 0;
  pdfPayload:any;

  isLoading = false;

  activityValues: number[] = [0, 100];
  // selectedAttestations:any;
  // Initialize selectedAttestations as an empty array
  selectedAttestations: any[] = [];
  selectedAttestations_coo: any[] = [];

  highlightedrow: any;
  public shouldShow = false;
  previewvisible: boolean = true;
  Timelinevisible: boolean = true;
  status0: string = '';
  status1: string = '';
  status2: string = '';
  status3: string = '';
  status4: string = '';

  createddate: any;
  createdTime: any;

  approveddate: any;
  approvedTime: any;

  paymentdate: any;
  paymentTime: any;

  attestationdate: any;
  attestationTime: any;
  filteredRows: any;
  completedDate: any;
  completedTime: any;
  redirectselectedcompanyData: any;
  src: any;
  noOfInvoicesSelected: any;
  noOfInvoicesSelected_coo: any;

  totalFineAmount: number = 0.0;
  totalFineAmount_coo:number=0.0;
  cooamount:number=0.0;
  totalAttestationFee: number = 0.0;
  totalAttestationFee_coo:number=0.0;
  invoicefeesamount:number=0.0;
  totalFee: number = 0.0;
  totalFee_coo:number=0.0;
  noofcoo:number=0.0;
  nooffines:number=0.0;
  AttestationList: any;
  isPending: boolean = true;
  base64PdfString: any;

  uuid: string = '';
  user_mailID: string = '';
  contactno: string = '';

  enableFilters: boolean = false;
  today: Date = new Date();
  oneMonthAgo = new Date();
  todayModel: Date = new Date();
  ischecked: any;
  invoiceunoresponse: number = 0;
  currentcompany: any;
  payment_button_isdisabled: boolean = true;
  timelineItems = [
    { status: '', title: this.translate.instant('IN DRAFT'), icon: 'check', date: '', time: '' },
    { status: '', title: this.translate.instant('PAYMENT'), icon: 'check', date: '', time: '' },
    { status: '', title: this.translate.instant('ATTESTED'), icon: 'check', date: '', time: '' },
    { status: '', title: this.translate.instant('COMPLETED'), icon: 'check', date: '', time: '' },
  ];
  statusess = [
    'IN DRAFT',
    'PAYMENT',
    'ATTESTED',
    'COMPLETED',
  ];
  form: FormGroup;

  AddInvoiceDialog: boolean = false;
  AddInvoiceDialog_: boolean = false;

  currentrow: any;
  currentrow_coo:any;
  isfilenotfouund: boolean = false;
  paymentcount = environment.appdetails.payment_count;
  fields: { label: string; value: any }[] = [];
  fields_coo:{ label: string; value: any }[] = [];
  // popupDownloadfilename:string='Attestation';
  isButtonDisabled = false;

  highlightColor: string = 'red';

  cooAttestationLists: any;
  overdue: number = 0;
  _selectedColumns: any;
  processname:string='LCA';
  processname_set:string='LCA'
  showcoopaybutton:boolean=false;
  overdue_filter:boolean=false;
  nearingoverdue_filter:boolean=false;
  isPaymentTabVisible:boolean=false;
  header:string='';
  selectedTabIndex:number=0;
  popup_iscooOnlyPayment:boolean=false

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public dialog: MatDialog,
    private router: Router,
    private apicall: ApiService,
    public common: CommonService,
    private consts: ConstantsService,
    public datepipe: DatePipe,
    private auth: AuthService
  ) {
    this.oneMonthAgo.setMonth(this.oneMonthAgo.getMonth() - 1);

    this.form = this.fb.group({
      coorequestno: '',
      lcarequestno: '',
      declarationumber: '',
      declarationdate: '',
      enteredon: '',
      edasattestno: '',
      attestreqdate: '',
      feesamount: '',
      totalamount: 0,
      comments: '',
      feespaid: '',
      statusname: '',
    });

    this.isRowSelectable = this.isRowSelectable.bind(this);
  }

  ngOnInit() {
    console.log('calling getselected company');
    let currcompany = this.auth.getSelectedCompany();
    if (currcompany) {
      this.currentcompany = currcompany.companyuno || '';

      if (
        this.currentcompany == null ||
        this.currentcompany == undefined ||
        this.currentcompany === ''
      ) {
        console.log('to landing page from attestation page line 195');
        this.router.navigateByUrl('/landingpage');
      }
    } else {
      this.common.redirecttologin();
      return;
    }
    this.totalFineAmount = 0.0;
    this.totalAttestationFee = 0.0;
    this.totalFee = 0.0;
    this.loading = true;
    let data11 = this.common.getUserProfile();
    let uuid;
    if (data11 != null || data11 != undefined) {
      data11 = JSON.parse(data11);
      console.log(data11.Data);
      uuid = data11.Data.uuid;
      this.uuid = uuid;
      this.user_mailID = data11.Data.email;
      this.contactno = data11.Data.mobile;
      this.getLCAoverdueCount();

    }
    this.cols_xl = [
      { field: 'edasattestno', header: 'EDAS Attestation No', width: '20%' },
      { field: 'currencycode', header: 'Currency', width: '20%' },
      { field: 'canpay', header: 'Status', width: '20%' },
      { field: 'noofdaysoverdue', header: 'Day(s)', width: '5%' },
      { field: 'invoiceamount', header: 'Invoice Amount', width: '20%' },
      { field: 'feesamount', header: 'Fees', width: '20%' },
      { field: 'invoicenumber', header: 'Invoice ID', width: '20%' },
      { field: 'declarationumber', header: 'Declaration No', width: '20%' },
      { field: 'declarationdate', header: 'Declaration Date', width: '200px' },
      { field: 'attestreqdate', header: 'Created', width: '200px' },
      { field: 'lcaname', header: 'Channel', width: '15%' },
    ];
    this.cols = [
      { field: 'companyname', header: this.translate.instant('Company'), width: '20%' },
    ];

    this.cols_ = [
      // { field: 'coorequestno', header: 'Request No.' },
      {
        field: 'declarationumber',
        header: 'declarationumber',
        width: '20%',
      },
      {
        field: 'edasattestno',
        header: 'edasattestno',
        width: '20%',
      },
      {
        field: 'feespaid',
        header: 'status',
        width: '10%',
      },
      // { field: 'entityshareamount', header: 'entityshareamount' },
      {
        field: 'totalamount',
        header: 'totalamount',
        width: '15%',
      },
      {
        field: 'declarationdate',
        header: 'declarationdate',
        width: '15%',
      },
      {
        field: 'attestreqdate',
        header: 'attestreqdate',
        width: '15%',
      },
      
      // { field: 'lcaname', header: 'Channel', width: '15%' },
    ];

    this._selectedColumns = this.cols.filter((c:any,index:any) => index < 0);
    //this.cols;
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.cols.filter((col: any, index:any) => val.includes(col));
  }

  filterField(row: any, filter: any) {
    //   let isInFilter = false;
    //   let noFilter = true;
    //   for (var columnName in filter) {
    //     if (row[columnName] == null) {
    //       return;
    //     }
    //     noFilter = false;
    //     let rowValue: String = row[columnName].toString().toLowerCase();
    //     let filterMatchMode: String = filter.global.matchMode;
    //     if (filterMatchMode.includes("contains") && rowValue.includes(filter.global.value.toLowerCase())) {
    //       isInFilter = true;
    //     } else if (filterMatchMode.includes("startsWith") && rowValue.startsWith(filter.global.value.toLowerCase())) {
    //       isInFilter = true;
    //     } else if (filterMatchMode.includes("in") && filter.global.value.includes(rowValue)) {
    //       isInFilter = true;
    //     }
    //     else
    //     return false;
    //  }
    //   if (noFilter) { isInFilter = true; }
    //   console.log(isInFilter);
    //   return isInFilter;
  }

  compareField(rowA: any, rowB: any, field: string): any {
    if (rowA[field] == null) return 1; // on considère les éléments null les plus petits
    if (typeof rowA[field] === 'string') {
      return rowA[field].localeCompare(rowB[field]);
    }
    if (typeof rowA[field] === 'number') {
      if (rowA[field] > rowB[field]) return 1;
      else return -1;
    }
  }

  globalFilter(row: any, globalFilterValue: string): boolean {
    for (const key in row) {
      if (
        row[key] &&
        row[key]
          .toString()
          .toLowerCase()
          .includes(globalFilterValue.toLowerCase())
      ) {
        return true;
      }
    }
    return false;
  }

  sortData(data: any[], field: string, order: number): any[] {
    return data.sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];
      if (valueA < valueB) {
        return order === 1 ? -1 : 1;
      } else if (valueA > valueB) {
        return order === 1 ? 1 : -1;
      }
      return 0;
    });
  }

 

  InitTable($event: LazyLoadEvent) {
    console.log($event);
    let resp;
    // let data=this.redirectselectedcompanyData;
    // console.log(data);  companyuno   this.currentcompany
    let data = {
      Companyuno: this.currentcompany,
      uuid: this.uuid,
      startnum: $event.first,
      limit: 200 + ($event.first ?? 0),
      Startdate: this.common.formatDateTime_API_payload(
        this.oneMonthAgo.toDateString()
      ),
      Enddate: this.common.formatDateTime_API_payload(
        this.todayModel.toDateString()
      ),
      overdue: this.overdue,
    };
    this.loading = true;
    this.common.showLoading();
    this.apicall.post(this.consts.pendingattestation, data).subscribe({
      next: (success: any) => {
        this.common.hideLoading();
        this.loading = false;
        resp = success;
        if (resp.dictionary.responsecode == 1) {
          this.list = resp.dictionary.data;
          this.list = this.list.map((item: any) => ({
            ...item,
            selected: false,
          }));
          console.log(this.list);
          this.datasource = resp.dictionary.data;
          this.totalrecords = resp.dictionary.recordcount;
          this.loading = false;
          if ($event.globalFilter) {
            this.datasource = this.datasource.filter((row: any) =>
              this.globalFilter(row, $event.globalFilter)
            );
            this.list = this.datasource;
            this.totalrecords = this.list.length;
          }
          if ($event.sortField) {
            let sortorder = $event.sortOrder || 1;
            this.datasource = this.sortData(
              this.datasource,
              $event.sortField,
              sortorder
            );
            this.list = this.datasource;
            this.totalrecords = this.list.length;
          }
          console.log(this.datasource);
          this.Reduce();
        } else {
          this.common.showErrorMessage('Something went wrong');
          this.loading = false;
        }
      },
    });
  }
 
  //   let resp;
  //   let data = {
  //     Companyuno: this.currentcompany,
  //     uuid: this.uuid,
  //     startnum: 0,
  //     limit: 200,
  //     Startdate: this.common.formatDateTime_API_payload(
  //       this.oneMonthAgo.toDateString()
  //     ),
  //     Enddate: this.common.formatDateTime_API_payload(
  //       this.todayModel.toDateString()
  //     ),
  //   };
  //   this.loading = true;
  //   this.common.showLoading();

  //   this.apicall.post(this.consts.pendingattestation, data).subscribe({
  //     next: (success: any) => {
  //       this.common.hideLoading();

  //       this.loading = false;
  //       resp = success;
  //       if (resp.dictionary.responsecode == 1) {
  //         this.list = resp.dictionary.data;
  //         this.datasource = resp.dictionary.data;
  //         this.totalrecords = resp.dictionary.data.length;
  //         this.loading = false;
  //         this.Reduce();
  //         // this.common.showSuccessMessage('Data retrived'); // Show the verification alert
  //       } else {
  //         this.common.showErrorMessage('Something went wrong');
  //         this.loading = false;
  //       }
  //     },
  //   });
  // }

  // response:any

  executeApi1(event: any) {
    console.log(this.totalFineAmount);
    console.log(event);
    let mycondition = 'noload';
    let data;
    if (this.selectedAttestations.length == 1) {
      data = {
        requstno: this.selectedAttestations[0].lcarequestno,
        invoiceuno: 0,
        action: 'ADD',
        uuid: this.uuid,
      };

      this.payorpayall = 'Pay';
    } else if (this.selectedAttestations.length > 1) {
      this.payorpayall = 'Pay All';

      const lcarequestnoArray = this.selectedAttestations
        .map((item: any) => item.lcarequestno)
        .join(',');

      console.log(lcarequestnoArray);
      data = {
        requstno: lcarequestnoArray,
        invoiceuno: this.invoiceunoresponse,
        action: 'ADD',
        uuid: this.uuid,
      };
      if (this.invoiceunoresponse == 0) {
        mycondition = 'loadagain';
      } else {
        mycondition = 'noload';
      }
    }
    let response;
    this.common.showLoading();
    this.apicall.post(this.consts.getLCAPaymentdetails, data).subscribe({
      next: (success: any) => {
        this.common.hideLoading();
        response = success;
        if (response.status === 'Success') {
          this.totalAttestationFee = response.invoiceamount;
          this.totalFineAmount = response.fineamount;
          this.totalFee = response.totalamount;
          this.invoiceunoresponse = response.invoiceuno;
          this.payment_button_isdisabled = false;

          if (mycondition == 'loadagain') {
            this.executeApi1(event);
          }
        } else {
          this.payment_button_isdisabled = true;
          this.common.showErrorMessage('Something went wrong');
          return;
        }
      },
    });

    console.log(this.selectedAttestations);
    return;
  }
  executeApi2(event: any) {
    // this.common.showErrorMessage("checkbox unchecked"!)
    console.log('checkbox unchecked');
    console.log(event);

    let data = {
      requstno: event.lcarequestno,
      invoiceuno: this.invoiceunoresponse,
      action: 'DELETE',
      uuid: this.uuid,
    };
    let response;
    this.common.showLoading();

    this.apicall.post(this.consts.getLCAPaymentdetails, data).subscribe({
      next: (success: any) => {
        response = success;
        this.common.hideLoading();

        if (response.status === 'Success') {
          //this.totalAttestationFee=response.invoiceamount
          // These lines of code check if response.fineamount and response.totalamount are
          //  empty objects and set them to 0 in that case, otherwise, they assign the values from response.
          this.totalAttestationFee =
            typeof response.invoiceamount === 'object' &&
            Object.keys(response.invoiceamount).length === 0
              ? 0
              : response.invoiceamount;
          // this.totalFineAmount=response.fineamount
          // this.totalFee=response.totalamount
          this.totalFineAmount =
            typeof response.fineamount === 'object' &&
            Object.keys(response.fineamount).length === 0
              ? 0
              : response.fineamount;
          this.totalFee =
            typeof response.totalamount === 'object' &&
            Object.keys(response.totalamount).length === 0
              ? 0
              : response.totalamount;
          this.payment_button_isdisabled = false;
        } else {
          this.payment_button_isdisabled = true;
          console.log('Something went wrong!!');
          // this.common.showErrorMessage("")
          return;
        }
      },
    });

    return;
  }

  // Add this to your component class
  isSelected(customer: any): string {
    let abc = this.selectedAttestations.includes(customer);
    if (abc) {
      return 'active';
    } else {
      return 'inactive';
    }
  }

  settingbackgroundcolors(event: any) {
    this.list.forEach((row: any) => {
      row.isSelected = false;
    });

    if (this.selectedAttestations.length > 0) {
      // If multiple rows are selected
      this.selectedAttestations.forEach((eventRow: any) => {
        const selectedRow = this.list.find(
          (row: any) => row.edasattestno === eventRow.edasattestno
        );
        if (selectedRow) {
          selectedRow.isSelected = true;
        }
      });
    } else {
      // const selectedRow = this.list.find((row: any) => row.edasattestno === this.selectedAttestations[0].edasattestno);
      // if (selectedRow) {
      //   selectedRow.isSelected = true;
      // }
    }
    console.log(this.list);
  }

  loadsidepanel(event: any) {
    this.settingbackgroundcolors(event);

    let isRowSelected;

    if (event.length > 0) {
      isRowSelected = event.some((eventRow: any) => {
        return this.selectedAttestations.some((selectedRow: any) => {
          return selectedRow.edasattestno === eventRow.edasattestno;
        });
      });
    } else {
      isRowSelected = this.selectedAttestations.some((selectedRow: any) => {
        return selectedRow.edasattestno === event.edasattestno;
      });
    }
    console.log(event);
    console.log(this.selectedAttestations);

    if (this.selectedAttestations.length > this.paymentcount) {
      this.common.showErrorMessage(
        this.translate.instant("Can't pay more than") +
          this.paymentcount +
          this.translate.instant('items at a time')
      );
      return;
    }
    if (isRowSelected) {
      // Row exists in selectedAttestations array, execute API call.
      this.executeApi1(event);
    } else {
      // Row doesn't exist in selectedAttestations array, execute another action.
      this.executeApi2(event);
    }

    this.noOfInvoicesSelected = this.selectedAttestations.length || null;

    this.shouldShow = true;
    this.Timelinevisible = true;
    this.previewvisible = true;
    if (this.selectedAttestations.length > 1) {
      this.previewvisible = false;
      this.Timelinevisible = false;
    } else if (this.selectedAttestations.length == 0) {
      this.shouldShow = false;
    } else {
      if (
        this.selectedAttestations[0]?.attestfilelocation != '' ||
        this.selectedAttestations[0]?.attestfilelocation != null
      ) {
        this.getimagebase64(this.selectedAttestations[0]?.attestfilelocation);
      }

      let createddate = this.common.splitdatetime(
        this.selectedAttestations[0]?.enteredon
      );
      let approveddate = this.common.splitdatetime(
        this.selectedAttestations[0]?.approvedon
      );
      let paymentdate = this.common.splitdatetime(
        this.selectedAttestations[0]?.paidon
      );
      let attestationdate = this.common.splitdatetime(
        this.selectedAttestations[0]?.attestedon
      );
      let completedDate = this.common.splitdatetime(
        this.selectedAttestations[0]?.completedon
      );

      console.log(this.timelineItems);
      this.timelineItems.forEach((item) => (item.status = ''));

      const statusuno = this.selectedAttestations[0].statusuno;

      if (statusuno >= 0 && statusuno <= 10) {
        for (let i = 0; i < statusuno; i++) {
          if (statusuno == 8 || statusuno == 1 && createddate != null) {
            this.timelineItems[0].date = createddate?.date || '';
            this.timelineItems[0].time = createddate?.time || '';
          this.timelineItems[0].status = 'active';
        this.timelineItems[1].status = 'current';


          } 
        
          else {
            this.timelineItems[i].date = '';
            this.timelineItems[i].time = '';
          }
        }
      } else {
        this.common.showErrorMessage('Something went wrong' + statusuno);
      }
      console.log(this.selectedAttestations[0].statusuno);
      console.log(this.timelineItems);
    }
  }
  //intended for side panel
  // splitdatetime(datetimeString:any) {
  //   if (datetimeString && typeof datetimeString === 'string') {
  //       const dateTimeParts = datetimeString.split('T'); // Splitting the string at 'T'
  //       if (dateTimeParts.length === 2) {
  //           return {
  //               date: dateTimeParts[0],
  //               time: dateTimeParts[1]
  //           };
  //       }
  //   }
  //   return null; // Invalid or null datetime string
  // }

  AttestationPay() {
    let data = {
      servicedata: [
        {
          noOfTransactions: '1',
          merchantId: '',
          serviceId: '',
          amount: this.totalAttestationFee.toString(),
        },
      ],
      responseURL: '',
      errorURL: '',
      udf1: this.currentcompany.toString(),
      udf2: this.user_mailID,
      udf3: this.contactno,
      udf4: '',
      udf5: '',
      udf6: '',
      udf7: '',
      udf8: '',
      udf9: this.uuid,
      udf10: this.processname,
      action: 1,
      correlationid: this.invoiceunoresponse.toString(),
      langid: 'EN',
      currencyCode: '784',
      version: '1.0.1',
    };

    let resp;

    let header = {
      uuid: this.uuid,
      processname: this.processname,
    };
    this.common.showLoading();
    this.apicall
      .postWH(this.consts.mpaypurchaseRequest, data, { header })
      .subscribe({
        next: (success: any) => {
          this.common.hideLoading();

          resp = success;
          if (resp.status === '1') {
            let token = resp.tokenid;
            let parts = token.split(':');
            let code = parts[0];
            let site = parts[1] + ':' + parts[2];
            let data = {
              invoiceID: this.invoiceunoresponse,
              paymentID: code,
              processname: this.processname_set,
              ispayall:0
            };
            this.common.setpaymentdetails(data);

            window.location.href = site + '?PaymentID=' + code;
            // this.router.navigateByUrl(site);
          } else {
            this.common.showErrorMessage(
              'Something went wrong. Please try again later.'
            );
            return;
          }
        },
      });
  }

  exportExcel() {
    const jsonData: { [key: string]: string } = {};
    this.cols_xl.forEach((col: any) => {
      jsonData[col.field] = col.header;
    });

    const dataList: any[] = this.list.map((item: any) => {
      const dataItem: any = {};
      this.cols_xl.forEach((col: any) => {
        if (col.header === 'Declaration Date' || col.header === 'Created') {
          dataItem[col.header] = this.common.splitdatetime(
            item[col.field])?.date;
        }
        else if(col.header === 'Status'){
          dataItem[col.header] = item[col.field] === 1 ? 'COO paid' : 'COO unpaid ';
          //customer.canpay === 1 ? 'COO paid' : '  &nbsp; COO unpaid '
        }
        else {
          dataItem[col.header] = item[col.field];
        }
      });
      return dataItem;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      ws,
      (this.common.givefilename('Draft'))
    );
    XLSX.writeFile(wb, this.common.givefilename('Draft')+'.xlsx');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  saveFile() {
    const fileContent = 'This is the content of the file.';
    const blob = new Blob([fileContent], { type: 'text/plain' });
    saveAs(blob, 'example.txt');
  }

  Reduce() {
    const selectedProperties: string[] = [
      'edasattestno',
      'invoicenumber',
      'declarationumber',
      'declarationdate',
      'attestreqdate',
      'noofdaysoverdue', // Make sure this property name matches your actual data
    ];

    const selectedData = this.list.map((customer: any) => {
      const selectedCustomer: Record<string, any> = {}; // Initialize as an empty object

      // Iterate through the selected property names and copy them to the new object
      selectedProperties.forEach((propertyName) => {
        selectedCustomer[propertyName] = customer[propertyName];
      });

      return selectedCustomer;
    });
    this.AttestationList = selectedData;

    // Now, 'selectedData' contains an array of objects with only the selected properties
    console.log(selectedData);
  }

  getimagebase64(attestfilelocation: any) {
    let resp;
    //"D:\\mofafile\\LCARequest\\PDF\\\\20161220423\\INV00000_New.PDF"
    //let attestfilelocation1=this.common.encryptWithPublicKey(attestfilelocation)
    let data = {
      attestfilelocation: attestfilelocation,
      uuid: this.uuid,
    };
    this.common.showLoading();

    this.apicall.post(this.consts.getAttestationFileContent, data).subscribe({
      next: (success: any) => {
        this.common.hideLoading();

        resp = success;
        if (resp.responsecode == 1) {
          this.base64PdfString = resp.data;
          var binary_string = this.base64PdfString.replace(/\\n/g, '');
          binary_string = window.atob(this.base64PdfString);
          var len = binary_string.length;
          var bytes = new Uint8Array(len);
          for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
          }
          this.src = bytes.buffer;
          this.isfilenotfouund = false;
        } else {
          this.isfilenotfouund = true;
          this.common.showErrorMessage('Attachment load failed');
          this.loading = false;
        }
      },
    });
  }

  clickChips() {
    this.enableFilters = !this.enableFilters;
  }

  convertBase64ToPdf(base64Data: string): void {
    this.common.convertBase64ToPdf(base64Data);
  }

  openOTPPopup(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef, {
      width: '280px',
      panelClass: ['my-dialog', 'animate__animated', 'animate__zoomIn'],
      backdropClass: 'normalpopupBackdropClass',
      hasBackdrop: false, // Prevents closing on clicking outside the dialog
    });
  }

  closesidetab() {
    this.confirmationService.confirm({
      message: this.translate.instant(
       this.translate.instant('Are you sure you want to clear the item(s) selected for payment?')
      ),
      header: this.translate.instant('Confirm'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // this.settingbackgroundcolors(this.selectedAttestations)
        this.list.forEach((row: any) => {
          row.isSelected = false;
        });

        this.shouldShow = false;
        this.selectedAttestations = [];

        //  this.deleteuser(list)
        // this.list = this.list.map((item:any) => ({ ...item, selected: false }));
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Removed Successfully',
          life: 3000,
        });
      },
    });
  }
  openNew_(data: any) {
this.onTabChange(0);
    if(data.canpay==0){
      this.showcoopaybutton=true;
    }
    else{
      this.showcoopaybutton=false;
    }
    let resp;
    let data_ = {
      uuid: this.uuid,
      lcaattestno: data.coorequestno.toString(),
    };
    this.loading = true;
    this.common.showLoading();
    this.apicall.post(this.consts.getcoolistforlcaattestno, data_).subscribe({
      next: (success: any) => {
        this.common.hideLoading();
        this.loading = false;
        resp = success;
        if (resp.responsecode == 1) {
          this.cooAttestationLists = resp.data;
          console.log(this.cooAttestationLists);
          this.datasource_ = resp.data;
		     this.openNew_COO(resp.data[0]);
          this.totalrecords_coo = resp.data.length;
          this.loading = false;
          console.log(this.datasource_);
          this.Reduce();
        } else {
          this.common.showErrorMessage('Something went wrong');
          this.loading = false;
        }
      },
    });

    
  }

  openNew_COO(data: any) {
    this.isPaymentTabVisible=false
    this.header='COO Details';
    console.log(data);
    this.currentrow_coo = data;
    const fieldMappings: { [key: string]: string } = {
      declarationumber: this.translate.instant('Declaration No'),
      declarationdate: this.translate.instant('Declaration Date'),
      edasattestno: this.translate.instant('edasattestno'),
      attestreqdate: this.translate.instant('Attestation Request Date'),
      enteredon: this.translate.instant('Created'),
      feespaid: this.translate.instant('Status'),
      invoicecount:this.translate.instant('No. of Invoice(s)'),
      totalamount:this.translate.instant('COO Attestation Fees'),
    };
    // this.popupDownloadfilename='Attest_'+this.currentrow_coo.edasattestno;
    if (data) {
      this.fields_coo = Object.keys(fieldMappings).map((key) => {
        let value = data[key];
        if (
          key == 'attestreqdate' ||
          key == 'invoicedate' ||
          key == 'paidon' ||
          key == 'approvedon' ||
          key == 'enteredon'
        ) {
            value = this.common.splitdatetime(value)?.date;
        }
        else if(  key == 'declarationdate'){
          value= this.common.splitdatetime(value)?.date
        }
        
        
        else if (key == 'invoiceamount' || key == 'feesamount') {
          value = this.common.formatAmount(value);
        }

        return {
          label: fieldMappings[key],
          value: value,
        };
      });
console.log(this.fields_coo);
this.AddInvoiceDialog_ = true;

    }
  }


  openNew(data: any) {
    console.log(data);
    this.currentrow = data;
    //api call for getting the declaration number
    this.AddInvoiceDialog = true;
    const fieldMappings: { [key: string]: string } = {
      edasattestno: this.translate.instant('edasattestno'),
      reqappnumber: this.translate.instant('Request Application Number'),
      attestreqdate: this.translate.instant('Attestation Request Date'),
      declarationdate: this.translate.instant('Declaration Date'),
      invoicenumber: this.translate.instant('Invoice No'),
      declarationumber: this.translate.instant('Declaration No'),
      invoicedate: this.translate.instant('Invoice Date'),
      invoiceamount: this.translate.instant('Invoice Amount'),
      currencycode: this.translate.instant('Currency'),
      feesamount: this.translate.instant('Fees Amount'),
      approvedon: this.translate.instant('Approved On'),
      statusname: this.translate.instant('Status'),
      enteredon: this.translate.instant('Entered On'),
      importername: this.translate.instant('Importer Name'),
      exportportname: this.translate.instant('Export Port Name'),
      invoiceid: this.translate.instant('Invoice ID'),
      companyname: this.translate.instant('Company'),
      comments: this.translate.instant('Comments'),
      lcaname: this.translate.instant('Channel'),
      // lcaname:  this.translate.instant('Channel')
      // Add more fields as needed
    };

    // this.popupDownloadfilename='Attest_'+this.currentrow.edasattestno;

    if (data) {
      this.fields = Object.keys(fieldMappings).map((key) => {
        let value = data[key];
        if (
          key == 'attestreqdate' ||
        
          key == 'invoicedate' ||
          key == 'paidon' ||
          key == 'approvedon' ||
          key == 'enteredon'
        ) {
          value = this.common.splitdatetime(value)?.date;

          // if (splitResult?.date === '01-Jan-1970') {
          //   value = this.common.splitdatetime1(value)?.date;
          // } else if (splitResult?.date === '01-Jan-0001') {
          //   value = ''; // Set value to an empty string
          // } else {
          //   value = splitResult?.date;
          // }
        }
        else if(  key == 'declarationdate'){
          value= this.common.splitdatetime(value)?.date
        }
        
        
        else if (key == 'invoiceamount' || key == 'feesamount') {
          value = this.common.formatAmount(value);
        }

        return {
          label: fieldMappings[key],
          value: value,
        };
      });
    }
  }

  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  isRowSelectable(event: any) {
    return !this.isCOONotPaid(event.data);
  }

  isCOONotPaid(data: any) {
    return data.canpay === 0;
  }
  getSeverity(canpay: number) {
    switch (canpay) {
      case 1:
        return 'success';
      default:
        return 'danger';
    }
  }
  getSeverity1(canpay: string) {
    switch (canpay) {
      case 'Paid':
        return 'success';
      default:
        return 'danger';
    }
  }

  

  showInfo() {
    let message='<p>Invoice Attestation Pending Request are shown in this list.</p><p>You have 14 days to pay for the Invoice Attestation request fees.</p>';
    message=message+'<p>COO payment is mandatory to pay for the Invoice Attestation request</p><p>If Invoice Attestation request is not paid within 14 days additional fine of AED 150 is added to the Invoice Attestation request.</p>';
    message=message+'<p>Fine amount has to be paid along with the Invoice Attestation fees amount<p>'
    // this.common.showSweetAlert('Info', 'Policy sample message');
    this.common.showSweetAlert('Info', 'Policy sample message', message,'top-end');
  }

  // downloadattachment(filelocation:any){
  //   this.common.getimagebase64(filelocation)

  // }

  //  formatDate(dateString: string): string {
  //   const date = new Date(
  //     parseInt(dateString.substring(0, 4)),
  //     parseInt(dateString.substring(4, 6)) - 1,
  //     parseInt(dateString.substring(6, 8))
  //   );

  //   return this.datepipe.transform(date, 'yyyy-MM-dd') || 'Invalid Date'; // Handle invalid date format
  // }

  async paycoo(event:any){
    let data;
  if (event.length === 1) {
    data = {
      requstno: event[0].coorequestno,
      invoiceuno: 0,
      action: 'ADD',
      uuid: this.uuid,
    };
  }
  try {
    // Use await to wait for the API call to complete
    const response: any = await this.apicall.post(this.consts.getCOOAttestpaymentdetails, data).toPromise();

    this.common.hideLoading();

    if (response.status === 'Success') {
      this.totalAttestationFee = response.invoiceamount;
      this.totalFineAmount = response.fineamount;
      this.totalFee = response.totalamount;
      this.invoiceunoresponse = response.invoiceuno;
      // Now, you can call the AttestationPay function
      this.processname='COO'
      this.processname_set='COO';
      this.AttestationPay();
    } else {
      console.log('Something went wrong!!');
      this.common.showErrorMessage('Something went wrong');
      return;
    }
  } catch (error) {
    console.error('Error:', error);
    this.common.showErrorMessage('An error occurred while fetching data');
  }
  }


  
getLCAoverdueCount(){
let resp;
  let data={
    "companyuno":this.currentcompany,
    "uuid":this.uuid,
    "startdate":this.common.formatDateTime_API_payload(this.oneMonthAgo.toDateString()),
    "enddate":this.common.formatDateTime_API_payload(this.todayModel.toDateString())
};
  this.apicall
  .post(this.consts.getLCAOverdueCount, data)
  .subscribe((response: any) => {
     resp=response;
    if(resp.overdue && resp.overdue>0){
     this.overdue_filter=true;
    }
    else{
     this.overdue_filter=false;
    }
    if(resp.nearoverdue && resp.nearoverdue>0){
     this.nearingoverdue_filter=true;
    }
    else{
     this.overdue_filter=false;
    }

    this.common.hideLoading();
    console.log(response);
   
  });
}

openpaymenttab(){
  this.showcoopaybutton=true;
  this.isPaymentTabVisible=true
  this.selectedTabIndex = 1;
  this.header='Payment Details';
}

onTabChange(event:any): void {
  this.selectedTabIndex = event;
  console.log(event);
  console.log('Selected Tab Index:', this.selectedTabIndex);
}

cooAndInvoicetogether(cooAttestationLists:any){
  this.openpaymenttab();
  this.popup_iscooOnlyPayment=false;
  if(!cooAttestationLists){
    return;
  }
  console.log(cooAttestationLists[0]);
  this.getCooForMyLCAInvoice(cooAttestationLists[0].coorequestno)

}

getCooForMyLCAInvoice(coorequestno: any) {
  console.log(coorequestno)
      console.log(coorequestno)
      let resp;
      let data = {    
      "coorequestno":coorequestno,
      "invoiceuno":0,
      "action":"ADD",
      "uuid":this.uuid
  }
      this.common.showLoading();
      this.apicall.post(this.consts.getCOOgroupPaymentDetails, data).subscribe({
        next: (success: any) => {
          resp=success;
         console.log(success);
         this.common.hideLoading();
              this.noOfInvoicesSelected_coo=resp.invoicecount;
              this.totalFineAmount_coo = resp.fineamount;
              this.invoicefeesamount = resp.invoicefeesamount;
              this.totalFee_coo = resp.totalamount;
              this.invoiceunoresponse = resp.invoiceuno;
              this.cooamount=resp.coofeesamount;
              this.noofcoo=resp.coocount;
              this.nooffines=resp.nooffines;
  
              this.totalAttestationFee=resp.totalamount;
              return;
        },
      });
    }


cooonlypayment(cooAttestationLists:any){
  this.openpaymenttab();
  this.popup_iscooOnlyPayment=true;
  if(!cooAttestationLists){
    return;
  }
  console.log(cooAttestationLists[0]);
  this.cooonlyPaymentDetailsCall(cooAttestationLists[0].coorequestno)
}

cooonlyPaymentDetailsCall(coorequestno:any){
  console.log(coorequestno);
  if(!coorequestno){
    return;
  }
  let data = {
    requstno:coorequestno,
    invoiceuno: 0,
    action: 'ADD',
    uuid: this.uuid,
  };
  let response;
  this.apicall
  .post(this.consts.getCOOAttestpaymentdetails, data)
  .subscribe({
    next: (success: any) => {
      this.common.hideLoading();
      response = success;
      if (response.status === 'Success') {
        this.popup_iscooOnlyPayment=true;
        this.noofcoo=response.noofattest;
        this.cooamount=response.invoiceamount;

         this.totalAttestationFee = response.totalamount;
        // this.totalFineAmount = response.fineamount;
        // this.totalFee = response.totalamount;
         this.invoiceunoresponse = response.invoiceuno;
        // this.payment_button_isdisabled = false;
        
      } else {
        this.popup_iscooOnlyPayment=false;

        this.payment_button_isdisabled = true;
        console.log('Something went wrong!!');
        // this.common.showErrorMessage("Something went wrong")
        return;
      }
    },
  });
}
// invoiceRequestListsFilter:any;

exportTableToPDF() {
    const jsonData1: { [key: string]: string } = {};
    this.cols_xl.forEach((col: any) => {
      jsonData1[col.field] = col.header;
    });
    const dataList1: any[] = this.list.map((item: any) => {
      const dataItem: any = {};
      this.cols_xl.forEach((col: any) => {
        if (col.header === 'Declaration Date' || col.header === 'Created') {
          dataItem[col.header] = this.common.splitdatetime(
            item[col.field])?.date;
        }
        else if(col.header === 'Status'){
          dataItem[col.header] = item[col.field] === 1 ? 'COO paid' : 'COO unpaid ';
          //customer.canpay === 1 ? 'COO paid' : '  &nbsp; COO unpaid '
        }
        else {
          dataItem[col.header] = item[col.field];
        }
      });
      return dataItem;
    });
    // bodyData
    const jsonData2 = 
    {
      edasattestno: this.translate.instant("edasattestno"),
      currencycode: this.translate.instant("Currency"),
      canpay: this.translate.instant("Status"),
      noofdaysoverdue: this.translate.instant("Day(s)"),
      invoiceamount: this.translate.instant("Invoice Amount"),
      feesamount: this.translate.instant("Fees"),
      invoicenumber: this.translate.instant("Invoice ID"),
      declarationumber: this.translate.instant("Declaration No"),
      declarationdate: this.translate.instant("Declaration Date"),
      attestreqdate: this.translate.instant("Created"),
      lcaname: this.translate.instant("Channel"),
    };
    const dataList2: any = [];
    this.list.map((item: any) => {
      const dataItem: any = {};
      dataItem[jsonData2.edasattestno] = item.edasattestno? item.edasattestno : "";
      dataItem[jsonData2.currencycode] = item.currencycode ? item.currencycode : "";
      dataItem[jsonData2.canpay] = item.canpay === 1 ? 'COO paid' : 'COO unpaid ';
      dataItem[jsonData2.noofdaysoverdue] = item.noofdaysoverdue;
      dataItem[jsonData2.invoiceamount] = item.invoiceamount ? item.invoiceamount : "";
      dataItem[jsonData2.feesamount] = item.feesamount ? item.feesamount : "";
      dataItem[jsonData2.invoicenumber] = item.invoicenumber ? item.invoicenumber : "";
      dataItem[jsonData2.declarationumber] = item.declarationumber ? item.declarationumber : "";
      dataItem[jsonData2.declarationdate] = item.declarationdate ? item.declarationdate : "";
      dataItem[jsonData2.attestreqdate] = item.attestreqdate ? item.attestreqdate : "";
      dataItem[jsonData2.lcaname] = item.lcaname ? item.lcaname : "";

      dataList2.push(dataItem);
    });
    let header2DataList = this.bindVisibleMoreDatasCommon(dataList1);
    let bodyDataList: any[] = dataList2;
    this.pdfPayload = {
      header1Data: { header: "INVOICE", content: "Invoice ID# 1112024" },
      header2Data: header2DataList, // [],
      bodyHeaderData: "Invoice Details",
      bodyData: bodyDataList, // [],
      // footerData: {},
    };
}

viewcreateddatas:any;

bindVisibleMoreDatasCommon(dataItem: any) {
  this.viewcreateddatas = [];
  for (const key in dataItem) {
    if (dataItem.hasOwnProperty(key)) {
      const value = dataItem[key];
      this.viewcreateddatas.push({ label: key, value: value });
    }
  }
}


handleDateChange(event: any, dateType: string): void {
  const momentObject = event.value || moment();
  let date=new Date(momentObject.toDate())
console.log(date)
console.log(date.toISOString())

 if (dateType === 'from') {
   this.oneMonthAgo = date ;
  } 
  else if (dateType === 'to') {
    this.todayModel =date;
  }

  console.log(this.oneMonthAgo)
  console.log(this.todayModel)

  this.onfilterclick()

}

onfilterclick() {
  const updatedLazyLoadEvent: LazyLoadEvent = {
    // Modify properties as needed
    first: 0,
    rows: 10,
    // ... other properties
  };
  // this.overdue=1;
  this.InitTable(updatedLazyLoadEvent);
}

}
