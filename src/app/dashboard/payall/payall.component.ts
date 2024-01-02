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
  selector: 'app-payall',
  templateUrl: './payall.component.html',
  styleUrls: ['./payall.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class PayallComponent implements OnInit {
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
 
  form: FormGroup;
  currentrow: any;
  currentrow_coo:any;
  isfilenotfouund: boolean = false;
  paymentcount = environment.appdetails.payment_count;
  fields: { label: string; value: any }[] = [];
  fields_coo:{ label: string; value: any }[] = [];
  popupDownloadfilename:string='Attestation';
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
  popup_iscooOnlyPayment:boolean=false;
data:any;


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

    }

this.callpayallmethod();
this.checkcounts();

    this.cols_xl = [
      { field: 'Noofdaysleft', header: 'Age', width: '5%' },
      { field: 'edasattestno', header: 'Attestation No', width: '20%' },
      { field: 'currencycode', header: 'Currency', width: '20%' },

      { field: 'canpay', header: 'Status', width: '20%' },

      { field: 'invoiceamount', header: 'Invoice Amount', width: '20%' },
      { field: 'feesamount', header: 'Fees', width: '20%' },

      { field: 'invoicenumber', header: 'Invoice ID', width: '20%' },
      { field: 'declarationumber', header: 'Declaration No', width: '20%' },

      { field: 'declarationdate', header: 'Declaration Date', width: '200px' },
      { field: 'attestreqdate', header: 'Created', width: '200px' },
      { field: 'lcaname', header: 'Channel', width: '15%' },
      { field: 'Company', header: 'Company', width: '20%' },
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
        } else {
          this.common.showErrorMessage('Something went wrong');
          this.loading = false;
        }
      },
    });
  }



  AttestationPay() {
    let data = {
      id: '',
      password: '',
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
      udf9: '',
      udf10: '',
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

    // const dataList1: any = [];

    const dataList: any[] = this.list.map((item: any) => {
      const dataItem: any = {};

      this.cols_xl.forEach((col: any) => {
        if (col.header === 'Declaration Date' || col.header === 'Created') {
          dataItem[col.header] = this.common.splitdatetime(
            item[col.field]
          )?.date;
        }
        // else if (col.header === 'Age') {
        //   dataItem[col.header] = this.common.calculateDifference(item.attestreqdate);
        // }
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
      this.translate.instant('Draft Attestation')
    );
    XLSX.writeFile(wb, 'Draft_Attestation.xlsx');
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


  

  clickChips() {
    this.enableFilters = !this.enableFilters;
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
 

  callpayallmethod(){
    let data={
      "companyuno": this.currentcompany,
      "uuid": this.uuid
  }
  let resp;
    this.apicall.post(this.consts.getCOOgroupPayallPaymentDetails, data).subscribe({
      next: (success: any) => {
        this.common.hideLoading();
        this.loading = false;
        resp = success;
        console.log(resp)
        if (resp.dictionary.responsecode == 1) {
          // this.list = resp.dictionary.data;
          // this.list = this.list.map((item: any) => ({
          //   ...item,
          //   selected: false,
          // }));
          // console.log(this.list);
          // this.datasource = resp.dictionary.data;
          // this.totalrecords = resp.dictionary.recordcount;
          // this.loading = false;
          // console.log(this.datasource);
        } else {
          this.common.showErrorMessage('Something went wrong');
          this.loading = false;
        }
      },
    });


  }

  checkcounts(){
    let data={
      "companyuno": this.currentcompany,
      "uuid": this.uuid
  }
  let resp;
    this.apicall.post(this.consts.getpendingcntlcaforcompany, data).subscribe({
      next: (success: any) => {
        this.common.hideLoading();
        this.loading = false;
        resp = success;
        console.log(resp)
        if (resp.dictionary.responsecode == 1) {
          // this.list = resp.dictionary.data;
          // this.list = this.list.map((item: any) => ({
          //   ...item,
          //   selected: false,
          // }));
          // console.log(this.list);
          // this.datasource = resp.dictionary.data;
          // this.totalrecords = resp.dictionary.recordcount;
          // this.loading = false;
          // console.log(this.datasource);
        } else {
          this.common.showErrorMessage('Something went wrong');
          this.loading = false;
        }
      },
    });


  }

}
