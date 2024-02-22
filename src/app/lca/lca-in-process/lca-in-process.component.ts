import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CdkDragStart, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ApiService } from 'src/service/api.service';
import { CommonService } from 'src/service/common.service';
import { ConstantsService } from 'src/service/constants.service';
import { LazyLoadEvent } from 'primeng/api';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { saveAs } from 'file-saver';
import { AuthService } from 'src/service/auth.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { TranslateService } from '@ngx-translate/core';
// import { PdfExportComponent } from 'src/app/shared/components/pdf-export/pdf-export.component';
// import 

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
    selector: 'app-lca-in-process',
  templateUrl: './lca-in-process.component.html',
  styleUrls: ['./lca-in-process.component.css']
})
export class LcaInProcessComponent implements OnInit {
  @ViewChild('tableref', { static: true }) tableref: any;
  today: Date = new Date(); 
oneMonthAgo = new Date();
todayModel:Date=new Date();
enableFilters: boolean = false;


  
  loading: boolean = true;
  list:any;
  representatives:any;
  statuses:any;
  products: any;
datasource:any;
    cols: any;
    cols_xl:any;
    _selectedColumns: any;
    totalrecords:number=0;
    isLoading=false;

  activityValues: number[] = [0, 100];
  selectedAttestations:any;
  public shouldShow = false;
  previewvisible:boolean=true;
  Timelinevisible:boolean=true;
  status0:string='';
  status1:string='';
  status2:string='';
  status3:string='';
  status4:string='';

  createddate:any;
  createdTime:any;

  approveddate:any;
  approvedTime:any;

  paymentdate:any;
  paymentTime:any;

  attestationdate:any;
  attestationTime:any;

  completedDate:any;
  completedTime:any;
  redirectselectedcompanyData:any
  src:any;
  noOfInvoicesSelected: any[]=[]
  totalFineAmount:any;
  totalAttestationFee:any;
totalFee:any;
AttestationList:any;
isPending:boolean=true;
base64PdfString: any;
uuid:any;
currentcompany:any;

AddInvoiceDialog:boolean=false;

currentrow:any;
isfilenotfouund:boolean=false;

fields: { label: string, value: any }[] = [];
isButtonDisabled = false;
AddInvoiceDialog_: boolean = false;
selectedTabIndex:number=0;
fields_coo:{ label: string; value: any }[] = [];
noOfInvoicesSelected_coo: any;
          totalFineAmount_coo:any;
          invoicefeesamount:any;
          totalFee_coo:any;
          invoiceunoresponse:any;
          cooamount:any;
          noofcoo:any;
          nooffines:any;

  constructor(private datePipe: DatePipe, private http:HttpClient,private _liveAnnouncer: LiveAnnouncer, private api:ApiService,
     public common:CommonService, private consts:ConstantsService, private auth:AuthService, private router:Router,
     private translate: TranslateService,) {
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

    
    this.loading = true;
   

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
       console.log("from lcainprocess")

      this.auth.logout();

    }
    this.cols = [
      // { field: 'lcaname', header: 'Channel', width:'15%' },
      // { field: 'companyname', header: 'Company', width:'20%' },
      { field: 'companyname', header: this.translate.instant('Company'), width: '20%' },
  ];

    this.cols_xl = [
     { field: 'edasattestno', header: 'EDAS Attest No', width:'20%' },
     { field: 'statusname', header: 'Status', width:'20%' },
     { field: 'currencycode', header: 'Currency', width:'20%' },
     { field: 'invoiceamount', header: 'Invoice Amount', width:'20%' },
     { field: 'feesamount', header: 'Fees Amount', width:'20%' },
     { field: 'invoicenumber', header: 'Invoice ID', width:'20%' },
     { field: 'declarationumber', header: 'Declaration No' , width:'20%' },
     { field: 'declarationdate', header: 'Declaration Date' , width:'200px' },
     { field: 'attestreqdate', header: 'Created' , width:'200px' },
     { field: 'lcaname', header: 'Channel', width:'15%' },
  
  ];

  this._selectedColumns = this.cols.filter((c:any,index:any) => index < 0);
  //this.getimagebase64();
  //this.InitTable()

  
   
  }

  
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
}

set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.cols.filter((col:any) => val.includes(col));
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
  
  InitTable($event:LazyLoadEvent){

    this.common.showLoading();
    let resp;
    let data;
    data={
      "companyuno":this.currentcompany,
      "uuid":this.uuid,
      "startnum":$event.first,
      "limit":200 + ($event.first ?? 0),
      "Startdate":this.common.formatDateTime_API_payload(this.oneMonthAgo.toDateString()),
      "Enddate":this.common.formatDateTime_API_payload(this.todayModel.toDateString())
  }
this.loading=true;
this.common.showLoading();

    this.api.post(this.consts.getPreprocessLCARequests,data).subscribe({next:(success:any)=>{
      this.common.hideLoading();

 this.loading=false;
      resp=success;
      if(resp.responsecode==1){
        this.list=resp.data
        this.datasource=resp.data;
        this.totalrecords=resp.recordcount;
        this.loading = false;
        this.Reduce();

        if ($event.globalFilter) {
          this.datasource = this.datasource.filter((row: any) => this.globalFilter(row, $event.globalFilter));
          this.list=this.datasource;
          this.totalrecords=this.list.length;
        }
        if ($event.sortField) {
          let sortorder=$event.sortOrder || 1;
          this.datasource = this.sortData(this.datasource, $event.sortField, sortorder);
          this.list=this.datasource;
          this.totalrecords=this.list.length;
        }
        console.log(this.datasource);

      }
      else{
        this.common.showErrorMessage('Something went wrong')
        this.loading=false;
      }
    }
  })
  setTimeout(() => {
    this.common.hideLoading(); // Assuming you have a hideLoading method to hide the loading indicator
  }, 100);


  }

  
Reduce(){
  const selectedProperties: string[] = [
    'edasattestno',
    'invoicenumber',
    'declarationumber',
    'declarationdate',
    'attestreqdate',
    'Noofdaysleft', // Make sure this property name matches your actual data
  ];

  const selectedData = this.list.map((customer:any) => {
    const selectedCustomer: Record<string, any> = {}; // Initialize as an empty object
  
    // Iterate through the selected property names and copy them to the new object
    selectedProperties.forEach((propertyName) => {
      selectedCustomer[propertyName] = customer[propertyName];
    });
  
    return selectedCustomer;
  });
  this.AttestationList=selectedData;
  
  // Now, 'selectedData' contains an array of objects with only the selected properties
  console.log(selectedData);
}




exportExcel() {
  const jsonData: { [key: string]: string } = {};
  this.cols_xl.forEach((col:any) => {
    jsonData[col.field] = col.header;
  });
  
  // const dataList1: any = [];
  
  const dataList: any[] = this.list.map((item: any) => {
    const dataItem: any = {};
  
    this.cols_xl.forEach((col:any) => {
      if (col.header === 'Declaration Date' || col.header === 'Created') {
        dataItem[col.header] = this.common.splitdatetime(item[col.field])?.date;
      } 

      // else if(col.header === 'Status'){
      //   dataItem[col.header] = item[col.field] === 1 ? 'COO paid' : 'COO unpaid ';
      //   //customer.canpay === 1 ? 'COO paid' : '  &nbsp; COO unpaid '
      // }
    
       else {
        dataItem[col.header] = item[col.field];
      }
    });
  
    return dataItem;
  });
  
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataList);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, this.common.givefilename('LCACompleted'));
      XLSX.writeFile(wb, this.common.givefilename('LCACompleted')+'.xlsx');
}

saveAsExcelFile(buffer: any, fileName: string): void {
  let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  let EXCEL_EXTENSION = '.xlsx';
  const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
  });
  FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
}

saveFile() {
  const fileContent = 'This is the content of the file.';
  const blob = new Blob([fileContent], { type: 'text/plain' });
  saveAs(blob, 'example.txt');
}

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
splitdatetime(datetimeString: any) {
  if (datetimeString && typeof datetimeString === 'string') {
    const dateTimeParts = datetimeString.split('T'); // Splitting the string at 'T'
    if (dateTimeParts.length === 2) {
      return {
        date: this.datePipe.transform(dateTimeParts[0], 'dd-MMM-yyyy'),
        time: dateTimeParts[1],
      };
    }
    else{
      return {
        date: this.datePipe.transform(dateTimeParts[0], 'dd-MMM-yyyy'),
        time: '',
      };

    }
  }
  return null; // Invalid or null datetime string
}


AttestationPay(){

}


loadsidepanel(event:any){
  console.log(event);
  console.log(this.selectedAttestations);
  this.noOfInvoicesSelected=this.selectedAttestations.length;

  this.totalFineAmount = this.selectedAttestations.reduce((total: any, item:any) => total + item.fineamount, 0);

  this.totalAttestationFee = this.selectedAttestations.reduce((total: any, item:any) => total + item.feesamount, 0);

  this.totalFee=this.totalFineAmount+this.totalAttestationFee;
  
  this.shouldShow = true;
  if (this.selectedAttestations.length > 1) {
    this.shouldShow = false;

  } else if (this.selectedAttestations.length == 0) {
    this.shouldShow = false;
  } else {
    // if(this.selectedAttestations[0]?.attestfilelocation!='' || this.selectedAttestations[0]?.attestfilelocation != null){
    //   this.getimagebase64(this.selectedAttestations[0]?.attestfilelocation);
    //  }
  }

}
clickChips() {
  this.enableFilters = !this.enableFilters;
}
// FilterInitTable(){
  
//   this.common.showLoading();

//   let resp;
//   let data;
//   data={
//     "companyuno":this.currentcompany,
//     "uuid":this.uuid,
//     "startnum":0,
//     "limit":10,
//     "Startdate":this.common.formatDateTime_API_payload(this.oneMonthAgo.toDateString()),
//     "Enddate":this.common.formatDateTime_API_payload(this.todayModel.toDateString())
// }
// this.common.showLoading();

//   this.api.post(this.consts.getPreprocessLCARequests,data).subscribe({next:(success:any)=>{
//     this.common.hideLoading();

//     resp=success;
//     if(resp.responsecode==1){
//       this.list=resp.data
//       this.datasource=resp.data;
//       this.totalrecords=resp.data.length;
//       this.loading = false;
//       this.Reduce();
//       console.log('Data retrived'); // Show the verification alert

//     }
//     else{
//       this.common.showErrorMessage('Something went wrong')
//       this.loading=false;
//     }
//   }
// })
// setTimeout(() => {
//   this.common.hideLoading(); // Assuming you have a hideLoading method to hide the loading indicator
// }, 500);



// }


 openNew(data:any) {
  console.log(data);
  this.currentrow=data;
  // this.src=  this.common.getPaymentReceiptbase64(this.currentrow.invoiceuno)

  // this.common.getPaymentReceiptbase64(this.currentrow.invoiceuno)
  // .then((result) => {
  //   this.src = result;
  //   console.log(this.src);

  // })
  // .catch((error) => {
  //   console.error("Error fetching payment receipt:", error);
  // });
  console.log(this.src)
  this.AddInvoiceDialog=true
  const fieldMappings: { [key: string]: string } = {
    "edasattestno": this.translate.instant('edasattestno'),
    "reqappnumber": this.translate.instant('Request Application Number'),
    "attestreqdate": this.translate.instant('Attestation Request Date'),
    "statusname": this.translate.instant('Status'),
    "declarationumber": this.translate.instant('Declaration No'),
    "declarationdate": this.translate.instant('Declaration Date'),
    "invoicenumber": this.translate.instant('Invoice Number'),
    "invoicedate": this.translate.instant('Invoice Date'),
    "invoiceid": this.translate.instant('Invoice ID'),
    "currencycode": this.translate.instant('Currency'),
    "invoiceamount": this.translate.instant('Invoice Amount'),
    "feesamount": this.translate.instant('Fees Amount'),
    "enteredon": this.translate.instant('Entered On'),
    "importername": this.translate.instant('Importer Name'),
    "exportportname": this.translate.instant('Export Port Name'),
    "companyname": this.translate.instant('Company'),
    "comments": this.translate.instant('Comments'),
    "lcaname": this.translate.instant('Channel')
    // Add more fields as needed
  };


  if (data) {
    this.fields = Object.keys(fieldMappings).map(key => {
      let value = data[key];
      if (key=="attestreqdate" || key=="invoicedate" || key=="paidon" || key=="approvedon" || key=="enteredon") {
        const splitResult = this.splitdatetime(value);

        // if (splitResult?.date === '01-Jan-1970' || splitResult?.date === '01-Jan-0001') {
        //   value = ''; // Set value to an empty string
        // } else {
          value = splitResult?.date;
        // }
      }
      else if(key=="declarationdate"){
        value=this.common.splitdatetime(value)?.date
      }
      else if(key=="invoiceamount" || key=="feesamount"){
        value =this.common.formatAmount(value);
      }

      return {
        label: fieldMappings[key],
        value: value
      };
    });
  }
  

}

DownloadFile(attestfilelocation:any){

  this.common.getimagebase64(attestfilelocation);

 }



 openNew_COO(data: any) {
  // this.isPaymentTabVisible=false
  // this.header='COO Details';
  console.log(data);
  // this.currentrow_coo = data;
  const fieldMappings: { [key: string]: string } = {
    declarationumber: this.translate.instant('Declaration No'),
    declarationdate: this.translate.instant('Declaration Date'),
    edasattestno: this.translate.instant('edasattestno'),
    attestreqdate: this.translate.instant('Attestation Request Date'),
    enteredon: this.translate.instant('Created'),
    feespaid: this.translate.instant('Status'),
 
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
        const splitResult = this.common.splitdatetime(value);

        // if (splitResult?.date === '01-Jan-1970') {
        //   value = this.common.splitdatetime(value)?.date;
        // } else if (splitResult?.date === '01-Jan-0001') {
        //   value = ''; // Set value to an empty string
        // } else {
          value = splitResult?.date;
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
console.log(this.fields_coo);
 this.AddInvoiceDialog_ = true;

  }
}


// getCooForMyLCAInvoice(currentrow: any) {
//   let resp;
//   let data = {    
//   "coorequestno":currentrow.coorequestno,
//   "invoiceuno":0,
//   "action":"ADD",
//   "uuid":this.uuid
// }
//   this.loading = true;
//   this.common.showLoading();
//   this.api.post(this.consts.getCOOgroupPaymentDetails, data).subscribe({
//     next: (success: any) => {
//       resp=success;
//      console.log(success);
    
//           // this.noOfInvoicesSelected_coo=resp.invoicecount;
//           this.totalFineAmount_coo = resp.fineamount;
//           this.invoicefeesamount = resp.invoicefeesamount;
//           this.totalFee_coo = resp.totalamount;
//           this.invoiceunoresponse = resp.invoiceuno;
//           // this.cooamount=resp.coofeesamount;
//           this.noofcoo=resp.coocount;
//           this.nooffines=resp.nooffines;

//           this.totalAttestationFee=resp.totalamount;
//     },
//   });
// }

openNew_(data: any) {
    
      let resp;
      let data_ = {
        uuid: this.uuid,
        lcaattestno: data.coorequestno,
      };             
      this.loading = true;
      this.common.showLoading();
      this.api.post(this.consts.getcoolistforlcaattestno, data_).subscribe({
        next: (success: any) => {
          this.common.hideLoading();
          this.loading = false;
          resp = success;
          console.log(resp.data[0])
          if (resp.responsecode == 1) {
            this.noOfInvoicesSelected_coo=resp.data[0].invoicecount;
            this.cooamount=resp.data[0].feesamount;
            // this.cooamount=resp.coofeesamount;
            // this.cooAttestationLists = resp.data;
            // console.log(this.cooAttestationLists);
            // this.datasource_ = resp.data;
           this.openNew_COO(resp.data[0]);
            // this.totalrecords_coo = resp.data.length;
            // this.loading = false;
            // console.log(this.datasource_);
           // this.Reduce();
          } else {
            this.common.showErrorMessage('Something went wrong');
            this.loading = false;
          }
        },
      });
      // this.getCooForMyLCAInvoice(data);
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
    this.list.map((item: any) => {
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
    const dataList2: any = [];
    this.list.map((item: any) => {
      const dataItem: any = {};
      dataItem[jsonData2.edasattestno] = item.edasattestno
        ? item.edasattestno
        : "";
      dataItem[jsonData2.noofdaysleft] = item.noofdaysleft
        ? item.noofdaysleft
        : "";
      dataItem[jsonData2.status] = item.statusname ? item.statusname : "";
      dataItem[jsonData2.invoiceamount] = item.invoiceamount
        ? item.invoiceamount
        : "";
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
