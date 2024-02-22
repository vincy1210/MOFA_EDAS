import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/service/api.service';
import { ConstantsService } from 'src/service/constants.service';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { ModalPopupService } from 'src/service/modal-popup.service';
import { CommonService } from 'src/service/common.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/service/auth.service';
import { LazyLoadEvent } from 'primeng/api';
import * as moment from 'moment';

@Component({
  selector: 'app-completed-attestation',
  templateUrl: './completed-attestation.component.html',
  styleUrls: ['./completed-attestation.component.css'],
})
export class CompletedAttestationComponent implements OnInit {
  @ViewChild('tableref', { static: true }) tableref: any;
  public shouldShow:boolean=false;

  progress_val: number = 0;
  selectedAttestations: any;
  totalrecords: number = 0;
  invoiceRequestLists: [] = [];
  cols: any;
  loading: boolean = false;
  enableFilters: boolean = false;
  today: Date = new Date(); 
oneMonthAgo = new Date();
todayModel:Date=new Date();
currentcompany:any;
src:any;
uuid:string='';

AddInvoiceDialog:boolean=false;

currentrow:any;
isfilenotfouund:boolean=false;
attchemntisthere:boolean=false;
fields: { label: string, value: any }[] = [];
isButtonDisabled = false;
datasource:any;
  constructor(
    private modalPopupService: ModalPopupService,
    public translate: TranslateService,
    public apiservice: ApiService,
    public consts: ConstantsService,
    private datePipe: DatePipe, public common:CommonService, private router:Router, private auth:AuthService
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

   // this.currentcompany=this.auth.getSelectedCompany().companyuno || '';




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
       console.log("from comple attest")

      this.auth.logout();
    }
    
    this.cols = [
      // { field: 'attestationrequno', header: 'Attestation No.' },
      { field: 'edasreqno', header: 'edasreqno', width:'20%' },
      { field: 'entitycode', header: 'entitycode' , width:'10%'},
      { field: 'wfstatus', header: 'Status', width:'15%' },

      { field: 'invoiceno', header: 'Invoice ID', width:'20%' },
      { field: 'invoiceamount', header: 'invoiceamount', width:'15%' },
      { field: 'invoicecurrency', header: 'invoicecurrency', width:'10%' },
      { field: 'invoicedate', header: 'invoicedate', width:'15%' },


      //statusname
    ];
    // this.InitTable();
  }

  globalFilter(row: any, globalFilterValue: string): boolean {
    for (const key in row) {
      if (row[key] && row[key].toString().toLowerCase().includes(globalFilterValue.toLowerCase())) {
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
    let data = {
      "companyuno":this.currentcompany,
      "uuid":this.uuid,
      "status":0, 
      "startnum":$event.first,
      "limit":200 + ($event.first ?? 0),
      "startdate":this.common.formatDateTime_API_payload(this.oneMonthAgo.toDateString()),
      "enddate":this.common.formatDateTime_API_payload(this.todayModel.toDateString())
    };
    this.common.showLoading();

    this.apiservice
      .post(this.consts.getcompletedInvoiceAttestList, data)
      .subscribe((response: any) => {
        this.common.hideLoading();

        if (`${response.responsecode}` === '1') {
          const dataArray = response.data;
          this.invoiceRequestLists = dataArray;


          this.datasource=this.invoiceRequestLists;
          if ($event.globalFilter) {
            this.datasource = this.datasource.filter((row: any) => this.globalFilter(row, $event.globalFilter));
            this.invoiceRequestLists=this.datasource;
            this.totalrecords=this.invoiceRequestLists.length;
          }
          if ($event.sortField) {
            let sortorder=$event.sortOrder || 1;
            this.datasource = this.sortData(this.datasource, $event.sortField, sortorder);
            this.invoiceRequestLists=this.datasource;
            this.totalrecords=this.invoiceRequestLists .length;
          }
          console.log(this.datasource);


        }
      });
  }

  splitdatetime(datetimeString: any) {
    if (datetimeString && typeof datetimeString === 'string') {
      const dateTimeParts = datetimeString.split('T'); // Splitting the string at 'T'
      if (dateTimeParts.length === 2) {
        return {
          date: dateTimeParts[0],
          time: dateTimeParts[1],
        };
      }
    }
    return null; // Invalid or null datetime string
  }

  splitdatetime1(datetimeString: any) {
    if (datetimeString && typeof datetimeString === 'string') {
      const dateTimeParts = datetimeString;
      if (dateTimeParts.length === 8) {
        const parsedDate = new Date(
          Number(dateTimeParts.substr(4, 4)),
          Number(dateTimeParts.substr(2, 2)) - 1,
          Number(dateTimeParts.substr(0, 2))
        );
        return {
          date: this.datePipe.transform(parsedDate, 'dd-MMM-yyyy'),
        };
      }
    }
    return null; // Invalid or null datetime string
  }

  clickChips() {
    this.enableFilters = !this.enableFilters;
  }

  exportExcel() {
    const jsonData = {
      edasreqno: this.translate.instant(
        'edasreqno'
      ),
      entitycode: this.translate.instant(
        'entitycode'
      ),
      status: this.translate.instant(
        'status'
      ),
      invoiceno: this.translate.instant(
        'Invoice ID'
      ),
      invoiceamount: this.translate.instant(
        'invoiceamount'
      ),
      invoicecurrency: this.translate.instant(
        'invoicecurrency'
      ),
      invoicedate: this.translate.instant(
        'invoicedate'
      ),
    };
    const dataList: any = [];
    this.invoiceRequestLists.map((item: any) => {
      const dataItem: any = {};
      dataItem[jsonData.edasreqno] = item.edasreqno;
      dataItem[jsonData.entitycode] = item.entitycode;
      dataItem[jsonData.status] = item.statusname;

      dataItem[jsonData.invoiceno] = item.invoiceno;
      dataItem[jsonData.invoiceamount] = item.invoiceamount;
      dataItem[jsonData.invoicecurrency] = item.invoicecurrency;
      dataItem[jsonData.invoicedate] = this.common.splitdatetime(item.invoicedate)?.date;
      dataList.push(dataItem);
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.common.givefilename('Physical_Completed'));
    XLSX.writeFile(wb, this.common.givefilename('Physical_Completed')+'.xlsx');
  }


  

openNew(data:any) {
  console.log(data);
  this.currentrow=data;
  
  if(this.currentrow.filepath!==undefined && this.currentrow.filepath!==null && this.currentrow.filepath!==''){
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
    attestationrequno: 'Attestation Request No',
    edasreqno: 'Edas Ref No',
    invoiceno: 'Declaration No',
    invoicedate: 'Declaration Date',
    invoiceamount:'Invoice Amount',
    enteredon: 'Creation',
    feesamount: 'Fees Amount',
    wfstatus: 'Status'
  };

  if (data) {
    this.fields = Object.keys(fieldMappings).map(key => {
      let value = data[key];
      if (key=="declarationdate" || key=="enteredon" ||key=="attestreqdate" ) {
        const splitResult = this.common.splitdatetime(value);

        // if (splitResult?.date === '01-Jan-1970' || splitResult?.date === '01-Jan-0001') {
        //   value = ''; // Set value to an empty string
        // } else {
          value = splitResult?.date;
        // }
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
    this.invoiceRequestLists.map((item: any) => {
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
      edasreqno: this.translate.instant('edasreqno'),
      entitycode: this.translate.instant('Channel'),
      status: this.translate.instant('status'),
      invoiceno: this.translate.instant('Invoice ID'),
      invoiceamount: this.translate.instant('Invoice Amount'),
      invoicecurrency: this.translate.instant('Currency'),
      invoicedate: this.translate.instant('invoicedate'),
      enteredon: this.translate.instant('Entered On'),
    };
    
    const dataList2: any = [];
    this.invoiceRequestLists.map((item: any) => {
      const dataItem: any = {};
      dataItem[jsonData2.edasreqno] = item.edasreqno;
      dataItem[jsonData2.entitycode] = item.entitycode;
      dataItem[jsonData2.status] = item.status;
      dataItem[jsonData2.invoiceno] = item.invoiceno;
      dataItem[jsonData2.invoiceamount] = item.invoiceamount;
      dataItem[jsonData2.invoicecurrency] = item.invoicecurrency;
      dataItem[jsonData2.invoicedate] = item.invoicedate;
      dataItem[jsonData2.enteredon] = item.enteredon;
      dataList2.push(dataItem);
    });
    dataList2.forEach((dataItem: any) => {
      dataItem[jsonData2.enteredon] = this.splitdatetime(dataItem[jsonData2.enteredon])?.date;
      dataItem[jsonData2.invoicedate] = this.splitdatetime(dataItem[jsonData2.invoicedate])?.date;
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
