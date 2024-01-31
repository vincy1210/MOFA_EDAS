import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/service/api.service';
import { ConstantsService } from 'src/service/constants.service';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { ModalPopupService } from 'src/service/modal-popup.service';
import { CommonService } from 'src/service/common.service';
import { AuthService } from 'src/service/auth.service';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import * as moment from 'moment';

@Component({
  selector: 'app-completed-coo-requests',
  templateUrl: './completed-coo-requests.component.html',
  styleUrls: ['./completed-coo-requests.component.css'],
})
export class CompletedCooRequestsComponent implements OnInit {
  @ViewChild('tableref', { static: true }) tableref: any;
  public shouldShow = false;
  progress_val: number = 0;
  selectedAttestations: any;
  totalrecords: number = 0;
  cooAttestationLists: [] = [];
  cols: any;
  loading: boolean = false;
  enableFilters: boolean = false;
  today: Date = new Date(); 
oneMonthAgo = new Date();
todayModel:Date=new Date();
currentcompany:any;
uuid:string='';
src:any;

AddInvoiceDialog:boolean=false;

currentrow:any;
isfilenotfouund:boolean=false;
attchemntisthere:boolean=false;
fields: { label: string, value: any }[] = [];
cooAttestationLists_LCA: any;
datasource:any;
isButtonDisabled = false;
totalrecords_LCA: number = 0;
AddInvoiceDialog_:boolean=false;
cols_: any;
  constructor(
    private modalPopupService: ModalPopupService,
    public translate: TranslateService,
    public apiservice: ApiService,
    public consts: ConstantsService,
    private datePipe: DatePipe, public common:CommonService, private auth:AuthService, private router:Router
  ) {
this.oneMonthAgo.setMonth(this.oneMonthAgo.getMonth() - 1);

  }
  filterTableByDate() {
    // Convert dates to string format
    const fromDateStr = this.datePipe.transform(this.oneMonthAgo, 'yyyy-MM-dd');
    const toDateStr = this.datePipe.transform(this.today, 'yyyy-MM-dd');

    // Apply filtering to the table
    this.tableref.filter([
      { field: 'createdatefrom', value: fromDateStr, matchMode: 'gte' },
      { field: 'createdateto', value: toDateStr, matchMode: 'lte' },
    ]);
  }

  ngOnInit(): void {
    console.log("calling getselected company")
    let currcompany=this.auth.getSelectedCompany();
    if(currcompany){
      this.currentcompany=currcompany.companyuno || '';
      if(this.currentcompany==null || this.currentcompany==undefined || this.currentcompany===''){
        this.router.navigateByUrl('/landingpage')
      }
    }
    else{
      this.common.redirecttologin();
      return;
    }
   
    let data11=this.common.getUserProfile();
    let uuid;
    if(data11!=null || data11!=undefined){
      data11=JSON.parse(data11)
      console.log(data11.Data)
      uuid=data11.Data.uuid;
      this.uuid=uuid;

    }
    else{
     
       this.common.setlogoutreason("session");
      this.auth.logout();

    }
   
    this.cols = [
      { field: 'declarationumber', header: 'Declaration No', width: '20%' },
      { field: 'edasattestno', header: 'edasattestno', width: '15%' },
      { field: 'statusname', header: 'Status', width: '10%' },
      { field: 'totalamount', header: 'totalamount', width: '15%' },
      { field: 'declarationdate', header: 'Declaration Date', width: '13%' },
      { field: 'attestreqdate', header: 'Created', width: '13%' }
    ];
    

    
  this.cols_ = [
    { field: 'edasattestno', header: 'edasattestno', width: '20%' },
    { field: 'canpay', header: 'Status', width: '20%' },
    { field: 'Noofdaysleft', header: 'Day(s)', width: '5%' },
    { field: 'invoiceamount', header: 'Invoice Amount', width: '20%' },
    { field: 'feesamount', header: 'Fees Amount', width: '20%' },
    { field: 'invoicenumber', header: 'Invoice ID', width: '20%' },
    { field: 'declarationumber', header: 'Declaration No', width: '20%' },
    { field: 'declarationdate', header: 'Declaration Date', width: '200px' },
    { field: 'attestreqdate', header: 'Created', width: '200px' },
    { field: 'lcaname', header: 'Channel', width: '15%' },
    { field: 'companyname', header: 'Company', width: '20%' },
  ];

    // this.InitTable();
  }

  InitTable($event: LazyLoadEvent) {
    let data = {
      "Companyuno":this.currentcompany,
      "uuid":this.uuid,
      "startnum":$event.first,
      "status":0,
      "limit":200 + ($event.first ?? 0),
      "Startdate":this.common.formatDateTime_API_payload(this.oneMonthAgo.toDateString()),
      "Enddate":this.common.formatDateTime_API_payload(this.todayModel.toDateString())
    };
    this.common.showLoading();

    this.apiservice
      .post(this.consts.getcompletedCOORequests, data)
      .subscribe((response: any) => {
        this.common.hideLoading();

        if (`${response.dictionary.responsecode}` === '1') {
          const dataArray = response.dictionary?.data;
          if (dataArray) {
            this.cooAttestationLists = dataArray;
            this.totalrecords = this.cooAttestationLists.length;
            this.datasource= this.cooAttestationLists;
          }
         

          if ($event.globalFilter) {
            this.datasource = this.datasource.filter((row: any) =>
              this.globalFilter(row, $event.globalFilter)
            );
            this.cooAttestationLists = this.datasource;
            this.totalrecords = this.cooAttestationLists.length;
          }
          if ($event.sortField) {
            let sortorder = $event.sortOrder || 1;
            this.datasource = this.sortData(
              this.datasource,
              $event.sortField,
              sortorder
            );
            this.cooAttestationLists = this.datasource;
            this.totalrecords = this.cooAttestationLists.length;
          }

        }
      });
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

  splitdatetime(datetimeString: any) {
    if (datetimeString && typeof datetimeString === 'string') {
      const dateTimeParts = datetimeString.split('T'); // Splitting the string at 'T'
      if (dateTimeParts.length === 2) {
        return {
          date: this.datePipe.transform(dateTimeParts[0], 'dd-MMM-yyyy'),
          time: dateTimeParts[1],
        };
      }
    }
    return null; // Invalid or null datetime string
  }

  // splitdatetime1(datetimeString: any) {
  //   if (datetimeString && typeof datetimeString === 'string') {
  //     const dateTimeParts = datetimeString;
  //     if (dateTimeParts.length === 8) {
  //       const parsedDate = new Date(
  //         Number(dateTimeParts.substr(4, 4)),
  //         Number(dateTimeParts.substr(2, 2)) - 1,
  //         Number(dateTimeParts.substr(0, 2))
  //       );
  //       return {
  //         date: this.datePipe.transform(parsedDate, 'dd/MM/yyyy'),
  //       };
  //     }
  //   }
  //   return null; // Invalid or null datetime string
  // }

  clickChips() {
    this.enableFilters = !this.enableFilters;
  }

  exportExcel() {
    const jsonData = {
      declarationumber: this.translate.instant('declarationumber'),
      edasattestno: this.translate.instant('edasattestno'),
      status: this.translate.instant('status'),
      totalamount: this.translate.instant('totalamount'),
      declarationdate: this.translate.instant('declarationdate'),
      attestreqdate: this.translate.instant('attestreqdate'),
    };
    const dataList: any = [];
    this.cooAttestationLists.map((item: any) => {
      const dataItem: any = {};
      dataItem[jsonData.declarationumber] = item.declarationumber;
      dataItem[jsonData.edasattestno] = item.edasattestno;
      dataItem[jsonData.status] = item.statusname;

      dataItem[jsonData.totalamount] = item.totalamount;
      dataItem[jsonData.declarationdate] = this.common.splitdatetime(item.declarationdate)?.date;
      dataItem[jsonData.attestreqdate] = this.common.splitdatetime(item.attestreqdate)?.date;
      dataList.push(dataItem);
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.common.givefilename('COOCompleted'));
    XLSX.writeFile(wb, this.common.givefilename('COOCompleted')+'.xlsx');
  }


  

openNew(data:any) {
  console.log(data);
  this.currentrow=data;
  
  if(this.currentrow.attachment!==undefined && this.currentrow.attachment!==null && this.currentrow.attachment!==''){
    this.attchemntisthere=true;
  }
  else{
    this.attchemntisthere=false;

  }

  this.common.getPaymentReceiptbase64(this.currentrow.invoiceuno)
  .then((result) => {
    this.src = result;
    console.log(this.src);

  })
  .catch((error) => {
    console.error("Error fetching payment receipt:", error);
  });
  
  this.AddInvoiceDialog=true
  const fieldMappings: { [key: string]: string } = {
    coorequestno: 'COO Request No',
    lcarequestno: 'LCA Request No',
    declarationumber: 'Declaration No',
    declarationdate: 'Declaration Date',
    enteredon: 'Creation',
    edasattestno: 'EDAS Attestation No',
    attestreqdate: 'Attestationn Request Date',
    feesamount: 'Fees Amount',
    totalamount: 'totalamount',
    comments: 'Comments',
    feespaid: 'Fees Paid',
    statusname: 'Status'
  };

  if (data) {
    this.fields = Object.keys(fieldMappings).map(key => {
      let value = data[key];
      if (key=="enteredon" ||key=="attestreqdate" ) {
        const splitResult = this.common.splitdatetime(value);

        // if (splitResult?.date === '01-Jan-1970' || splitResult?.date === '01-Jan-0001') {
        //   value = ''; // Set value to an empty string
        // } else {
          value = splitResult?.date;
        // }
      }
      else if(key=="declarationdate"){
value=this.common.splitdatetime(value)?.date;
      }
      else if(key=="totalamount" || key=="feesamount"){
        value =this.common.formatAmount(value);
      }

      return {
        label: fieldMappings[key],
        value: value
      };
    });
  }
  

}

openNew_(data: any) {
  this.getLCAInvoicesForMyCooDec(data);
 this.AddInvoiceDialog_ = true;
}



getLCAInvoicesForMyCooDec(currentrow: any) {
  let resp;
  let data = {
    uuid: this.uuid,
    decNo: currentrow.declarationumber,
  };
  this.loading = true;
  this.common.showLoading();
  this.apiservice
    .post(this.consts.getlcalistforcoodeclaration, data)
    .subscribe({
      next: (success: any) => {
        this.common.hideLoading();
        this.loading = false;
        resp = success;
        if (resp.responsecode == 1) {
          this.cooAttestationLists_LCA = resp.data;
          this.cooAttestationLists_LCA = this.cooAttestationLists_LCA.map(
            (item: any) => ({ ...item, selected: false })
          );
          console.log(this.cooAttestationLists_LCA);
          // this.datasource=resp.dictionary.data;
          this.totalrecords_LCA = resp.data.length;
          this.loading = false;

          // console.log(this.datasource);
        } else {
          this.common.showErrorMessage('Something went wrong');
          this.loading = false;
        }
      },
    });
}

getSeverity_(canpay: number) {
  switch (canpay) {
    case 1:
      return 'success';
    default:
      return 'danger';
  }
}

// invoiceRequestListsFilter:any;
pdfPayload:any;

exportTableToPDF() {
    // header2Data
    const jsonData1 = {
      edasattestno: this.translate.instant(
        "edasattestno"
      ),
      noofdaysleft: this.translate.instant(
        "noofdaysleft"
      ),
      status: this.translate.instant("status"),
      invoiceamount: this.translate.instant(
        "invoiceamount"
      ),
    };
    let dataList1: any = {};
    this.cooAttestationLists.map((item: any) => {
      const dataItem: any = {};
      dataItem[jsonData1.edasattestno] = item.edasattestno
        ? item.edasattestno
        : "";
      dataItem[jsonData1.noofdaysleft] = item.noofdaysleft
        ? item.noofdaysleft
        : "";
      dataItem[jsonData1.status] = item.statusname ? item.statusname : "";
      dataItem[jsonData1.invoiceamount] = item.invoiceamount
        ? item.invoiceamount
        : "";
      dataList1 = dataItem;
    });
    // bodyData
    const jsonData2 = {
      declarationumber: this.translate.instant('declarationumber'),
      edasattestno: this.translate.instant('edasattestno'),
      feespaid: this.translate.instant('Payment Status'),
      status: this.translate.instant('status'),
      totalamount: this.translate.instant('totalamount'),
      declarationdate: this.translate.instant('declarationdate'),
      attestreqdate: this.translate.instant('attestreqdate'),
    };
    const dataList2: any = [];
    this.cooAttestationLists.map((item: any) => {
      const dataItem: any = {};
      dataItem[jsonData2.declarationumber] = item.declarationumber;
      dataItem[jsonData2.edasattestno] = item.edasattestno;
      dataItem[jsonData2.feespaid] = item.feespaid;
      dataItem[jsonData2.status] = item.status;
      dataItem[jsonData2.totalamount] = item.totalamount;
      dataItem[jsonData2.declarationdate] = this.common.splitdatetime(item.declarationdate)?.date
      dataItem[jsonData2.attestreqdate] = this.common.splitdatetime( item.attestreqdate)?.date;
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
