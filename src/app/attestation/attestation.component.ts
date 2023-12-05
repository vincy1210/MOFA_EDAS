import { Component, OnInit, ViewChild, TemplateRef, VERSION, Inject } from '@angular/core';

import {LiveAnnouncer} from '@angular/cdk/a11y';
import { CdkDragStart, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
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
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {NgIf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
// import {MatDialog, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';


import {FormControl, Validators, FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';

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
  selector: 'app-attestation',
  templateUrl: './attestation.component.html',
  styleUrls: ['./attestation.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class AttestationComponent implements OnInit {
  @ViewChild('tableref', { static: true }) tableref: any;
  highlighted: any;
  payorpayall:string='pay';

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
  filteredRows:any;
  completedDate:any;
  completedTime:any;
  redirectselectedcompanyData:any
  src:any;
  noOfInvoicesSelected: any[]=[]
  totalFineAmount:number=0.0;
  totalAttestationFee:number=0.0;
totalFee:number=0.0;
AttestationList:any;
isPending:boolean=true;
base64PdfString: any;

uuid:string='';
user_mailID:string='';
contactno:string='';

enableFilters: boolean = false;
today: Date = new Date(); 
oneMonthAgo = new Date();
todayModel:Date=new Date();
ischecked:any;
invoiceunoresponse:number=0;
currentcompany:any;
payment_button_isdisabled:boolean=true;
timelineItems = [
  { status: '', title: 'IN DRAFT', icon: 'check', date: '', time: '' },
  { status: '', title: 'IN RISK', icon: 'check', date: '', time: '' },
  { status: '', title: 'PAYMENT', icon: 'check', date: '', time: '' },
  // { status: '', title: 'IN REVIEW', icon: 'check', date: '', time: '' },
  // { status: '', title: 'PENDING', icon: 'check', date: '', time: '' },
  // { status: '', title: 'APPROVED', icon: 'check', date: '', time: '' },
  // { status: '', title: 'RETURNED', icon: 'check', date: '', time: '' },
  // { status: '', title: 'ON HOLD', icon: 'check', date: '', time: '' },
  { status: '', title: 'ATTESTED', icon: 'check', date: '', time: '' },
  { status: '', title: 'COMPLETED', icon: 'check', date: '', time: '' },
];
statusess = [
  'IN DRAFT',
  'IN RISK',
  'PAYMENT',
  // 'IN REVIEW',
  // 'PENDING', 
  // 'APPROVED',
  // 'RETURNED',
  // 'ON HOLD',
  'ATTESTED',
  'COMPLETED'
];
form:FormGroup;

AddInvoiceDialog:boolean=false;

currentrow:any;
isfilenotfouund:boolean=false;
paymentcount=environment.appdetails.payment_count;
fields: { label: string, value: any }[] = [];
isButtonDisabled = false;
  constructor(private translate:TranslateService,private fb:FormBuilder,private confirmationService:ConfirmationService,private messageService:MessageService, public dialog: MatDialog, private router:Router, private apicall:ApiService, public common:CommonService, private consts:ConstantsService, public datepipe:DatePipe){
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
    this.currentcompany=this.common.getSelectedCompany().companyuno;
    if(this.currentcompany==null){
      this.router.navigateByUrl('/landingpage')
    }
    this.totalFineAmount=0.0;
    this.totalAttestationFee=0.0;
    this.totalFee=0.0;

   
    this.loading = true;
   

    let data11=this.common.getUserProfile();
    let uuid;
    if(data11!=null || data11!=undefined){
      data11=JSON.parse(data11)
      console.log(data11.Data)
      uuid=data11.Data.uuid;
      this.uuid=uuid;
      this.user_mailID=data11.Data.email;
      this.contactno=data11.Data.mobile;
      //mobile

    }
    else{
      console.log("Invalid Session")

     // this.common.logoutUser()
    }
    // width:'17%'
    this.cols = [
      { field: 'edasattestno', header: 'Attestation No', width:'20%' },
      { field: 'companyname', header: 'Company Name', width:'20%' },
      { field: 'invoiceamount', header: 'Invoice Amount', width:'20%' },
      { field: 'invoicenumber', header: 'Invoice ID', width:'20%' },
      { field: 'declarationumber', header: 'Declaration No' , width:'20%' },
      { field: 'declarationdate', header: 'Declaration Date' , width:'200px' },
      { field: 'attestreqdate', header: 'Created' , width:'200px' },
      { field: 'lcaname', header: 'LCA Name', width:'15%' },

      { field: 'canpay', header: 'Status', width:'20%' },
      { field: 'Noofdaysleft', header: 'Age',  width:'5%' }

      // src/app/attestation/attestation.component.html

  ];

  //this.InitTable();

  }

  filterField(row:any, filter:any) {
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

  compareField(rowA:any, rowB:any, field: string): any {
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
    console.log($event);
    let resp;
    // let data=this.redirectselectedcompanyData;
    // console.log(data);  companyuno   this.currentcompany
    let data={
      "Companyuno":this.currentcompany,
      "uuid":this.uuid,
      "startnum": $event.first,
      "limit": 200 + ($event.first ?? 0),
      "Startdate":this.common.formatDateTime_API_payload(this.oneMonthAgo.toDateString()),
      "Enddate":this.common.formatDateTime_API_payload(this.todayModel.toDateString())
        }
        this.loading=true;
        this.common.showLoading();
            this.apicall.post(this.consts.pendingattestation,data).subscribe({next:(success:any)=>{
              this.common.hideLoading();
              this.loading=false;
              resp=success;
              if(resp.dictionary.responsecode==1){
              this.list=resp.dictionary.data
                this.datasource=resp.dictionary.data;
                this.totalrecords=resp.dictionary.recordcount;
                this.loading = false;
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
                this.Reduce();
              }
              else{
                this.common.showErrorMessage('Something went wrong')
                this.loading=false;
              }
        
            }
          })

  }
  filterInittable(){
    let resp;
    let data={
      "Companyuno":this.currentcompany,
      "uuid":this.uuid,
      "startnum": 0,
      "limit": 200,
      "Startdate":this.common.formatDateTime_API_payload(this.oneMonthAgo.toDateString()),
      "Enddate":this.common.formatDateTime_API_payload(this.todayModel.toDateString())
        }
        this.loading=true;
        this.common.showLoading();

            this.apicall.post(this.consts.pendingattestation,data).subscribe({next:(success:any)=>{
        this.common.hideLoading();

              this.loading=false;
              resp=success;
              if(resp.dictionary.responsecode==1){
              this.list=resp.dictionary.data
                this.datasource=resp.dictionary.data;
                this.totalrecords=resp.dictionary.data.length;
                this.loading = false;
                this.Reduce();
               // this.common.showSuccessMessage('Data retrived'); // Show the verification alert
              }
              else{
                this.common.showErrorMessage('Something went wrong')
                this.loading=false;
              }
        
            }
          })
  }


// response:any

executeApi1(event:any){
   console.log(this.totalFineAmount)
 console.log(event)
 let mycondition="noload";
 let data;
 if(this.selectedAttestations.length==1){
  data={    
    "requstno":this.selectedAttestations[0].lcarequestno,
    "invoiceuno":0,
    "action":"ADD",
    "uuid":this.uuid
  }

  this.payorpayall='Pay';
 }
 else if(this.selectedAttestations.length>1){
  this.payorpayall='Pay All';


  const lcarequestnoArray = this.selectedAttestations.map((item:any) => item.lcarequestno).join(',');

console.log(lcarequestnoArray);
  data={    
    "requstno":lcarequestnoArray,
    "invoiceuno":this.invoiceunoresponse,
    "action":"ADD",
    "uuid":this.uuid
  }
  if(this.invoiceunoresponse==0){
    mycondition="loadagain";
  }
  else{
    mycondition="noload";
  }
 }
        let response;
        this.common.showLoading();
        this.apicall.post(this.consts.getLCAPaymentdetails,data).subscribe({next:(success:any)=>{
          this.common.hideLoading();
          response=success;
          if(response.status==="Success"){
            this.totalAttestationFee=response.invoiceamount
            this.totalFineAmount=response.fineamount
            this.totalFee=response.totalamount
            this.invoiceunoresponse=response.invoiceuno
            this.payment_button_isdisabled=false;

            if(mycondition=="loadagain"){
              this.executeApi1(event);
             }
          }
          else{
            this.payment_button_isdisabled=true;
            this.common.showErrorMessage("Something went wrong")
            return;
          }
          }})

          console.log(this.selectedAttestations);
  return
}
executeApi2(event:any){
  // this.common.showErrorMessage("checkbox unchecked"!)
  console.log("checkbox unchecked")
 console.log(event)

      let data={    
        "requstno":event.lcarequestno,
          "invoiceuno":this.invoiceunoresponse,
          "action":"DELETE",
          "uuid":this.uuid
      }
      let response;
      this.common.showLoading();

      this.apicall.post(this.consts.getLCAPaymentdetails,data).subscribe({next:(success:any)=>{
        response=success;
        this.common.hideLoading();

        if(response.status==="Success"){
          //this.totalAttestationFee=response.invoiceamount
          // These lines of code check if response.fineamount and response.totalamount are
          //  empty objects and set them to 0 in that case, otherwise, they assign the values from response.
          this.totalAttestationFee = typeof response.invoiceamount === 'object' && Object.keys(response.invoiceamount).length === 0 ? 0 : response.invoiceamount;
          // this.totalFineAmount=response.fineamount
          // this.totalFee=response.totalamount
          this.totalFineAmount = typeof response.fineamount === 'object' && Object.keys(response.fineamount).length === 0 ? 0 : response.fineamount;
          this.totalFee = typeof response.totalamount === 'object' && Object.keys(response.totalamount).length === 0 ? 0 : response.totalamount;
          this.payment_button_isdisabled=false;
        }
        else{
          this.payment_button_isdisabled=true;
          console.log("Something went wrong!!")
         // this.common.showErrorMessage("")
          return;
        }
        }})



  return;


}


loadsidepanel(event:any){
  let isRowSelected;

  if(event.length>0){



     isRowSelected = event.some((eventRow: any) => {
      return this.selectedAttestations.some((selectedRow: any) => {
          return selectedRow.edasattestno === eventRow.edasattestno;
      });
  });
  }
  else{
       isRowSelected = this.selectedAttestations.some((selectedRow: any) => {
    return selectedRow.edasattestno === event.edasattestno;
  });

  }
  console.log(event);
  console.log(this.selectedAttestations);

    if(this.selectedAttestations.length>this.paymentcount){
      this.common.showErrorMessage(this.translate.instant("Can't pay more than") + this.paymentcount +this.translate.instant("items at a time"));
      return;
    }
  if (isRowSelected) {
    // Row exists in selectedAttestations array, execute API call.
    this.executeApi1(event);
  } else {
    // Row doesn't exist in selectedAttestations array, execute another action.
    this.executeApi2(event);
  }

  this.noOfInvoicesSelected=this.selectedAttestations.length;

  this.shouldShow=true;
  this.Timelinevisible=true;
  this.previewvisible=true;
  if(this.selectedAttestations.length>1){
    this.previewvisible=false;
    this.Timelinevisible=false;
  }
  else if(this.selectedAttestations.length==0){
    this.shouldShow=false;
  }
  else{
    
if(this.selectedAttestations[0]?.attestfilelocation!='' || this.selectedAttestations[0]?.attestfilelocation != null){
 this.getimagebase64(this.selectedAttestations[0]?.attestfilelocation);
}

 let createddate=this.splitdatetime(this.selectedAttestations[0]?.enteredon);
    let approveddate=this.splitdatetime(this.selectedAttestations[0]?.approvedon);
    let paymentdate=this.splitdatetime(this.selectedAttestations[0]?.paidon);
    let attestationdate=this.splitdatetime(this.selectedAttestations[0]?.attestedon);
    let completedDate=this.splitdatetime(this.selectedAttestations[0]?.completedon);

console.log(this.timelineItems);
this.timelineItems.forEach(item => (item.status = ''));

const statusuno = this.selectedAttestations[0].statusuno;

if (statusuno >= 0 && statusuno <= 10) {
  for (let i = 0; i < statusuno; i++) {
    this.timelineItems[i].status = 'active';
    if(statusuno==1 && createddate!=null){
      this.timelineItems[i].date=createddate?.date ||'';
      this.timelineItems[i].time=createddate?.time || '';
    }
    else if(statusuno==6 && approveddate!=null){
      this.timelineItems[i].date=approveddate?.date ||'';
      this.timelineItems[i].time=approveddate?.time  ||'';
    }
    else if(statusuno==3 && paymentdate!=null){
      this.timelineItems[i].date=paymentdate?.date ||'';
      this.timelineItems[i].time=paymentdate?.time || '';
    }
    else if(statusuno==9 && attestationdate!=null){
      this.timelineItems[i].date=attestationdate?.date ||'';
      this.timelineItems[i].time=attestationdate?.time || '';
    }
    else if(statusuno==10 && completedDate!=null){
      this.timelineItems[i].date=completedDate?.date ||'';
      this.timelineItems[i].time=completedDate?.time || '';
    }
    else{
      this.timelineItems[i].date=''
      this.timelineItems[i].time=''
    }
  }
  this.timelineItems[statusuno-1].status = 'current';
} else {
  this.common.showErrorMessage("Something went wrong" + statusuno);
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
splitdatetime(datetimeString: any) {
  if (datetimeString && typeof datetimeString === 'string') {
    const dateTimeParts = datetimeString.split('T'); // Splitting the string at 'T'
    if (dateTimeParts.length === 2) {
      return {
        date: this.datepipe.transform(dateTimeParts[0], 'dd-MMM-yyyy'),
        time: dateTimeParts[1],
      };
    }
    else{
      return {
        date: this.datepipe.transform(dateTimeParts[0], 'dd-MMM-yyyy'),
        time: '',
      };

    }
  }
  return null; // Invalid or null datetime string
}


AttestationPay(){
  let data={
    "id": "",
    "password": "",
    "servicedata": [        
        {
            "noOfTransactions": "1",
            "merchantId": "",
            "serviceId": "",
            "amount": this.totalAttestationFee.toString()
        }
    ],
  "responseURL":"",
  "errorURL":"",
    "udf1": this.currentcompany.toString(),
    "udf2": this.user_mailID,
    "udf3": this.contactno,
    "udf4":"",
    "udf5":"",
    "udf6":"",
    "udf7":"",
    "udf8":"",
    "udf9":"",
    "udf10":"",
    "action": 1,
    "correlationid": this.invoiceunoresponse.toString(),
    "langid": "EN",
    "currencyCode": "",
    "version": "1.0.1"
}

let resp;

let header={
  "uuid":this.uuid,
  "processname":"LCA"
}
this.common.showLoading();
      this.apicall.postWH(this.consts.mpaypurchaseRequest,data,{header}).subscribe({next:(success:any)=>{
        this.common.hideLoading();
          
        resp=success;
        if(resp.status==="1"){

          let token=resp.tokenid;
          let parts = token.split(":");
          let code = parts[0];
          let site = parts[1]+":"+parts[2];
          let data={
            "invoiceID":this.invoiceunoresponse,
            "paymentID":code,
            "processname":"LCA"
          }
          this.common.setpaymentdetails(data);

          window.location.href = site+'?PaymentID='+code;
         // this.router.navigateByUrl(site);
       
        }
        else{
          this.common.showErrorMessage('Something went wrong. Please try again later.')
          return;
        }
      }
      })
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
    } else if (col.header === 'Age') {
      dataItem[col.header] = this.common.calculateDifference(item.attestreqdate);
    } else {
      dataItem[col.header] = item[col.field];
    }
  });

  return dataItem;
});

const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.translate.instant('Draft Attestation'));
    XLSX.writeFile(wb, 'Draft_Attestation.xlsx');

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

getimagebase64(attestfilelocation:any){
  let resp;
//"D:\\mofafile\\LCARequest\\PDF\\\\20161220423\\INV00000_New.PDF"
  //let attestfilelocation1=this.common.encryptWithPublicKey(attestfilelocation)
  let data={
    "attestfilelocation":attestfilelocation,
    "uuid":this.uuid 
  }
  this.common.showLoading();
  
  this.apicall.post(this.consts.getAttestationFileContent,data).subscribe({next:(success:any)=>{
    this.common.hideLoading();

    resp=success;
    if(resp.responsecode==1){
    this.base64PdfString=resp.data;
    var binary_string = this.base64PdfString.replace(/\\n/g, '');
    binary_string =  window.atob(this.base64PdfString);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    this.src= bytes.buffer;
    this.isfilenotfouund=false;
    }
    else{
      this.isfilenotfouund=true;
      this.common.showErrorMessage('Attachment load failed')
      this.loading=false;
    }
  }
})
}

clickChips() {
  this.enableFilters = !this.enableFilters;
}

convertBase64ToPdf(base64Data: string): void {
  this.common.convertBase64ToPdf(base64Data);
}

// openDialog(customer:any){
//   console.log(customer);

// }
// openDialog(customer:any) {
//   console.log(customer);
//   this.dialog.open(DialogDataExampleDialog, {
//     data: {
//       animal: 'panda',
//     },
//   });
// }

openOTPPopup(templateRef: TemplateRef<any>) {


          this.dialog.open(templateRef, {
            width: '280px',
            panelClass: ['my-dialog', 'animate__animated', 'animate__zoomIn'],
            backdropClass: 'normalpopupBackdropClass',
            hasBackdrop: false, // Prevents closing on clicking outside the dialog
          });
       
}

closesidetab(){
  this.confirmationService.confirm({
    message: this.translate.instant('Are you sure you want to clear the item(s) selected for payment?'),
    header: 'Confirm',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
        this.shouldShow=false;
  this.selectedAttestations=[]
      //  this.deleteuser(list)
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Removed Successfully', life: 3000 });
    }
});
}

openNew(data:any) {
  console.log(data);
  this.currentrow=data;
  this.AddInvoiceDialog=true
  const fieldMappings: { [key: string]: string } = {
    edasattestno: this.translate.instant('Attestation No'),
    reqappnumber:  this.translate.instant('Request Application Number'),
    attestreqdate:  this.translate.instant('Attestation Request Date'),
    declarationdate:  this.translate.instant('Declaration Date'),
    invoicenumber:  this.translate.instant('Invoice Number'),
    declarationumber:  this.translate.instant('Declaration Number'),
    invoicedate:  this.translate.instant('Invoice Date'),
    invoiceamount:  this.translate.instant('Invoice Amount'),
    currencycode:  this.translate.instant('Currency Code'),
    feesamount:  this.translate.instant('Fees Amount'),
    approvedon:  this.translate.instant('Approved On'),
    statusname:  this.translate.instant('Status'),
    enteredon:  this.translate.instant('Entered On'),
    importername:  this.translate.instant('Importer Name'),
    exportportname:  this.translate.instant('Export Port Name'),
    invoiceid:  this.translate.instant('Invoice ID'),
    companyname:  this.translate.instant('Company Name'),
    comments:  this.translate.instant('Comments'),
    lcaname:  this.translate.instant('LCA Name')
    // Add more fields as needed
  };

  if (data) {
    this.fields = Object.keys(fieldMappings).map(key => {
      let value = data[key];
      if (key=="attestreqdate" || key=="declarationdate" || key=="invoicedate" || key=="paidon" || key=="approvedon" || key=="enteredon") {
        const splitResult = this.common.splitdatetime(value);

        if (splitResult?.date === '01-Jan-1970' ){
          value=this.common.splitdatetime1(value)?.date;
        }
        else if(splitResult?.date === '01-Jan-0001') {
          value = ''; // Set value to an empty string
        } else {
          value = splitResult?.date;
        }
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

private capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

isRowSelectable(event:any) {
  return !this.isCOONotPaid(event.data);
}

isCOONotPaid(data:any) {
  return data.canpay === 0;
}
getSeverity(canpay: number) {
  switch (canpay) {
      case 1:
          return 'success';
      default :
          return 'danger';
  }

}


}

