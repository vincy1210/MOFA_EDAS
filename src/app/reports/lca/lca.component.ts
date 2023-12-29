import { Component, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-lca',
  templateUrl: './lca.component.html',
  styleUrls: ['./lca.component.css']
})
export class LCAComponent implements OnInit {
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
total_invoiceamount:any;
total_feesamount:any;


currentrow:any;
isfilenotfouund:boolean=false;

fields: { label: string, value: any }[] = [];
isButtonDisabled = false;
showfooter:boolean=false;
  constructor(private datePipe: DatePipe, private http:HttpClient,private _liveAnnouncer: LiveAnnouncer, private api:ApiService, public common:CommonService, 
    private consts:ConstantsService, private auth:AuthService, private router:Router) {
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
      this.auth.logout();

    }
    this.cols = [
      { field: 'edasattestno', header: 'edasattestno', width:'25%' },
      { field: 'statusname', header: 'Status', width:'20%' },

      { field: 'invoiceamount', header: 'Invoice Amount', width:'20%' },
      
      { field: 'feesamount', header: 'Fees', width:'20%' },
      { field: 'invoicenumber', header: 'Invoice ID' , width:'25%'},
      { field: 'declarationumber', header: 'Declaration No', width:'25%' },
      { field: 'declarationdate', header: 'Declaration Date', width:'15%' },
      { field: 'attestreqdate', header: 'Created' , width:'15%'},
      { field: 'lcaname', header: 'Channel', width:'20%' },
      
      { field: 'companyname', header: 'Company', width:'20%' },

  
  ];

  
  //this.getimagebase64();
  //this.InitTable()

  
   
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
      "Companyuno":this.currentcompany,
      "uuid":this.uuid,
      "startnum":$event.first,
      "limit":200 + ($event.first ?? 0),
      "status":0,
      "Startdate":this.common.formatDateTime_API_payload(this.oneMonthAgo.toDateString()),
      "Enddate":this.common.formatDateTime_API_payload(this.todayModel.toDateString())
  }
this.loading=true;
this.common.showLoading();

    this.api.post(this.consts.lcaCompletedAttestList,data).subscribe({next:(success:any)=>{
      this.common.hideLoading();

 this.loading=false;
      resp=success;
      if(resp.dictionary.responsecode==1){
        this.list=resp.dictionary.data
        this.datasource=resp.dictionary.data;
        this.totalrecords=resp.dictionary.recordcount;
        // this.showfooter=false;
    this.showfooter = true;

      

        const totalInvoiceAmount = resp.dictionary.data.reduce((total:any, item:any) => total + item.invoiceamount, 0);
console.log(totalInvoiceAmount)

const totalFeeAmount = resp.dictionary.data.reduce((total:any, item:any) => total + item.feesamount, 0);
console.log(totalFeeAmount)

        this.total_invoiceamount=totalInvoiceAmount;
        this.total_feesamount=totalFeeAmount;

        this.loading = false;
        // this.Reduce();

        if ($event.globalFilter) {
          this.datasource = this.datasource.filter((row: any) => this.globalFilter(row, $event.globalFilter));
          this.list=this.datasource;
          this.totalrecords=this.list.length;
        }
        if ($event.sortField) {
          let sortorder=$event.sortOrder || 1;
          this.datasource = this.sortData(this.datasource, $event.sortField, sortorder);
          this.list=this.list.length;
          this.totalrecords=this.list.length;
        }
        console.log(this.datasource);
        // if(this.totalrecords>0){
        //   this.showfooter=true;
        // }
       // this.common.showSuccessMessage('Data retrived'); // Show the verification alert

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

  
// Reduce(){
//   const selectedProperties: string[] = [
//     'edasattestno',
//     'invoicenumber',
//     'declarationumber',
//     'declarationdate',
//     'attestreqdate',
//     'Noofdaysleft', // Make sure this property name matches your actual data
//   ];

//   const selectedData = this.list.map((customer:any) => {
//     const selectedCustomer: Record<string, any> = {}; // Initialize as an empty object
  
//     // Iterate through the selected property names and copy them to the new object
//     selectedProperties.forEach((propertyName) => {
//       selectedCustomer[propertyName] = customer[propertyName];
//     });
  
//     return selectedCustomer;
//   });
//   this.AttestationList=selectedData;
  
//   // Now, 'selectedData' contains an array of objects with only the selected properties
//   console.log(selectedData);
// }


getimagebase64(attestfilelocation:any){
  let resp;
  let data={
    "attestfilelocation":attestfilelocation,
    "uuid":this.uuid
  }
  this.common.showLoading();

  this.api.post(this.consts.getAttestationFileContent,data).subscribe({next:(success:any)=>{
    this.common.hideLoading();

    resp=success;
    if(resp.responsecode==1){
    this.base64PdfString=resp.data;

        const base64 = this.base64PdfString.replace('data:application/pdf;base64,', '');

          // Convert base64 to a byte array
          const byteArray = new Uint8Array(atob(base64).split('').map(char => char.charCodeAt(0)));

          // Create a Blob and download the file
          const file = new Blob([byteArray], { type: 'application/pdf' });
          const fileUrl = URL.createObjectURL(file);

          const link = document.createElement('a');
          link.href = fileUrl;
          link.download = 'Attestation_.pdf'; // You can customize the file name here

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

    }
    else{
      this.common.showErrorMessage('Attachment load failed')
      this.loading=false;
    }
  }
})
return this.base64PdfString;

}

exportExcel() {
  const jsonData: { [key: string]: string } = {};
  this.cols.forEach((col:any) => {
    jsonData[col.field] = col.header;
  });
  
  // const dataList1: any = [];
  
  const dataList: any[] = this.list.map((item: any) => {
    const dataItem: any = {};
  
    this.cols.forEach((col:any) => {
      if (col.header === 'Declaration Date' || col.header === 'Created') {
        dataItem[col.header] = this.common.splitdatetime(item[col.field])?.date;
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
      XLSX.utils.book_append_sheet(wb, ws, 'Attestation-Completed');
      XLSX.writeFile(wb, 'Attestation_Completed.xlsx');
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
    if(this.selectedAttestations[0]?.attestfilelocation!='' || this.selectedAttestations[0]?.attestfilelocation != null){
      this.getimagebase64(this.selectedAttestations[0]?.attestfilelocation);
     }
  }

}
clickChips() {
  this.enableFilters = !this.enableFilters;
}
FilterInitTable(){
  
  this.common.showLoading();

  let resp;
  let data;
  data={
    "Companyuno":this.currentcompany,
    "uuid":this.uuid,
    "startnum":0,
    "limit":10,
    "status":0,
    "Startdate":this.common.formatDateTime_API_payload(this.oneMonthAgo.toDateString()),
    "Enddate":this.common.formatDateTime_API_payload(this.todayModel.toDateString())
}
this.common.showLoading();

  this.api.post(this.consts.lcaCompletedAttestList,data).subscribe({next:(success:any)=>{
    this.common.hideLoading();

    resp=success;
    if(resp.dictionary.responsecode==1){
      this.list=resp.dictionary.data
      this.datasource=resp.dictionary.data;
      this.totalrecords=resp.dictionary.data.length;
      this.loading = false;
      // this.Reduce();
      // if(this.totalrecords>0){
      //   this.showfooter=true;
      // }
      console.log('Data retrived'); // Show the verification alert

    }
    else{
      this.common.showErrorMessage('Something went wrong')
      this.loading=false;
    }
  }
})
setTimeout(() => {
  this.common.hideLoading(); // Assuming you have a hideLoading method to hide the loading indicator
}, 500);



}


openNew(data:any) {
  console.log(data);
  this.currentrow=data;
  this.AddInvoiceDialog=true

  this.common.getPaymentReceiptbase64(this.currentrow.invoiceuno)
  .then((result) => {
    this.src = result;
    console.log(this.src);

  })
  .catch((error) => {
    console.error("Error fetching payment receipt:", error);
  });
  const fieldMappings: { [key: string]: string } = {
    edasattestno: 'Attestation No',
    reqappnumber: 'Request Application Number',
    attestreqdate: 'Attestation Request Date',
    declarationdate: 'Declaration Date',
    invoicenumber: 'Invoice Number',
    declarationumber: 'Declaration Number',
    invoicedate: 'Invoice Date',
    invoiceamount: 'Invoice Amount',
    currencycode: 'Currency Code',
    feesamount: 'Fees Amount',
    paidon: 'Paid On',
    paidby: 'Paid By',
    approvedon: 'Approved On',
    statusname: 'Status',
    enteredon: 'Entered On',
    importername: 'Importer Name',
    exportportname: 'Export Port Name',
    invoiceid: 'Invoice ID',
    companyname: 'Company',
    comments: 'Comments',
    lcaname: 'Channel'
    // Add more fields as needed
  };

  if (data) {
    this.fields = Object.keys(fieldMappings).map(key => {
      let value = data[key];
      if (key=="attestreqdate" || key=="declarationdate" ||key=="invoicedate" || key=="paidon" || key=="approvedon" || key=="enteredon") {
        const splitResult = this.splitdatetime(value);
          value = splitResult?.date;
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

  this.getimagebase64(attestfilelocation);

 }

 onDropdownChange(event:any){
  console.log(event);

 }

}
