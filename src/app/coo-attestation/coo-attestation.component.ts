import { Component, OnInit, ViewChild } from '@angular/core';
import { CooAttestationCreateComponent } from './coo-attestation-create/coo-attestation-create.component';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/service/api.service';
import { ConstantsService } from 'src/service/constants.service';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { ModalPopupService } from 'src/service/modal-popup.service';
import { AttestationStatusEnum } from 'src/app/shared/models/attestation-status.model';
import { CommonService } from 'src/service/common.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { ConfirmationService, MessageService } from 'primeng/api';

import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-coo-attestation',
  templateUrl: './coo-attestation.component.html',
  styleUrls: ['./coo-attestation.component.css'],
  providers: [MessageService, ConfirmationService],
  
})
export class CooAttestationComponent implements OnInit {
  @ViewChild('tableref', { static: true }) tableref: any;

  progress_val: number = 0;
  selectedAttestations: any;
  selectedAttestations_LCA: any;

  totalrecords: number = 0;
  totalrecords_LCA:number=0;
  cooAttestationLists: any;
  cooAttestationLists_LCA:any;
  cols: any;
  cols_: any;

  loading: boolean = false;
  enableFilters: boolean = false;
  // for workflow
  public shouldShow = false;
 previewvisible:boolean=true;
  Timelinevisible:boolean=true;
 createddate:any;
  approveddate:any;
  paymentdate:any;
  attestationdate:any;
  payorpayall:string='pay';
  completedDate:any;

  noOfInvoicesSelected: any[] = [];
  totalFineAmount: any;
  totalAttestationFee: any;
  totalFee: any;
  today: Date = new Date(); 
oneMonthAgo = new Date();
todayModel:Date=new Date();
uuid:string='';
user_mailID:string='';
currentcompany:any;
contactno:string='';
timelineItems = [
  { status: '', title: 'IN DRAFT', icon: 'check', date: '', time: '' },
  { status: '', title: 'IN RISK', icon: 'check', date: '', time: '' },
  { status: '', title: 'PAYMENT', icon: 'check', date: '', time: '' },
  { status: '', title: 'IN REVIEW', icon: 'check', date: '', time: '' },
  { status: '', title: 'APPROVED', icon: 'check', date: '', time: '' },
  { status: '', title: 'ATTESTED', icon: 'check', date: '', time: '' },
  { status: '', title: 'COMPLETED', icon: 'check', date: '', time: '' },
];
ischecked:any;
invoiceunoresponse:number=0;
payment_button_isdisabled:boolean=true;
base64PdfString: any;
src:any;
isLoading=false;
AddInvoiceDialog:boolean=false;
AddInvoiceDialog_:boolean=false;

form:FormGroup;
datasource:any;



currentrow:any;
isfilenotfouund:boolean=false;

fields: { label: string, value: any }[] = [];
paymentcount=environment.appdetails.payment_count;
 

  constructor(
    private confirmationService:ConfirmationService,private messageService:MessageService,
    public dialog: MatDialog,
    private modalPopupService: ModalPopupService,
    public translate: TranslateService,
    public apiservice: ApiService,
    public consts: ConstantsService,
    private datePipe: DatePipe, public common:CommonService, private fb:FormBuilder
  ) {

    this.isRowSelectable = this.isRowSelectable.bind(this);
    console.log(this.isRowSelectable)
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
    this.currentcompany=this.common.getSelectedCompany().companyuno;
   
    let data11=this.common.getUserProfile();
    let uuid;
    if(data11!=null || data11!=undefined){
      data11=JSON.parse(data11)
      console.log(data11.Data)
      uuid=data11.Data.uuid;
      this.uuid=uuid;
      this.user_mailID=data11.Data.email;
      this.contactno=data11.Data.mobile;

    }
    else{
      console.log("Invalid Session")
     
    //  this.common.logoutUser()
    }
   
    this.cols = [
      // { field: 'coorequestno', header: 'Request No.' },
      {
        field: 'declarationumber',
        header: 'declarationumber',
        width:'20%'
      },
      {
        field: 'edasattestno',
        header: 'edasattestno',
        width:'20%'
      },
      // { field: 'entityshareamount', header: 'entityshareamount' },
      {
        field: 'totalamount',
        header: 'totalamount',
        width:'15%'
      },
      {
        field: 'declarationdate',
        header: 'declarationdate',
        width:'15%'
      },
      {
        field: 'attestreqdate',
        header: 'attestreqdate',
        width:'15%'
      },
      {
        field: 'feespaid',
        header: 'status',
        width:'10%'
      }
    ];

    this.cols_ = [
      { field: 'edasattestno', header: 'Attestation No', width:'20%' },
      { field: 'companyname', header: 'Company Name', width:'20%' },
      { field: 'invoiceamount', header: 'Invoice Amount', width:'20%' },
      { field: 'feesamount', header: 'Fees Amount', width:'20%' },

      { field: 'invoicenumber', header: 'Invoice ID', width:'20%' },
      { field: 'declarationumber', header: 'Declaration No' , width:'20%' },
      { field: 'declarationdate', header: 'Declaration Date' , width:'200px' },
      { field: 'attestreqdate', header: 'Created' , width:'200px' },
      { field: 'lcaname', header: 'LCA', width:'15%' },

      { field: 'canpay', header: 'Status', width:'20%' },
      { field: 'Noofdaysleft', header: 'Age',  width:'5%' }

  ];
  }

  InitTable($event:LazyLoadEvent) {
    //this.currentcompany
    let data = {
      "Companyuno":this.currentcompany,
      "uuid":this.uuid,
      "startnum":$event.first,
      "limit":200 + ($event.first ?? 0),
      "Startdate":this.common.formatDateTime_API_payload(this.oneMonthAgo.toDateString()),
      "Enddate":this.common.formatDateTime_API_payload(this.todayModel.toDateString())
    };
    this.loading=true;
    this.common.showLoading();

    this.apiservice
      .post(this.consts.getCooRequests, data)
      .subscribe((response: any) => {
        this.common.hideLoading();

        this.loading=false;
        if (`${response.dictionary.responsecode}` === '1') {
          let dataArray = response.dictionary.data;
          
	  this.totalrecords=response.dictionary.recordcount;
          this.cooAttestationLists = dataArray;
          this.cooAttestationLists.map((row: any) => {
            if (row.statusuno === AttestationStatusEnum.Status0) {
              row.status = 'Created';
            } else if (row.statusuno === AttestationStatusEnum.Status1) {
              row.status = 'Approved';
            } else if (row.statusuno === AttestationStatusEnum.Status2) {
              row.status = 'Payment';
            } else if (row.statusuno === AttestationStatusEnum.Status3) {
              row.status = 'Attestation';
            } else if (row.statusuno === AttestationStatusEnum.Status4) {
              row.status = 'Completed';
            } else {
              row.status = '';
            }
          });
          this.datasource=this.cooAttestationLists;


          if ($event.globalFilter) {
            this.datasource = this.datasource.filter((row: any) => this.globalFilter(row, $event.globalFilter));
            this.cooAttestationLists=this.datasource;
            this.totalrecords=this.cooAttestationLists.length;
          }
          if ($event.sortField) {
            let sortorder=$event.sortOrder || 1;
            this.datasource = this.sortData(this.datasource, $event.sortField, sortorder);
            this.cooAttestationLists=this.datasource;
            this.totalrecords=this.cooAttestationLists.length;
          }
          console.log(this.datasource);

          this.cooAttestationLists = this.cooAttestationLists.map((item:any) => ({ ...item, selected: false }));

        }
      });
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

  uploadDeclaration(data: any) {
    const dialogRef =
      this.modalPopupService.openPopup<CooAttestationCreateComponent>(
        CooAttestationCreateComponent,
        data
      );
    dialogRef.afterClosed().subscribe((result) => {
      this.FilterInittable();
    });
  }

  // splitdatetime(datetimeString: any) {
  //   if (datetimeString && typeof datetimeString === 'string') {
  //     const dateTimeParts = datetimeString.split('T'); // Splitting the string at 'T'
  //     if (dateTimeParts.length === 2) {
  //       return {
  //         date: this.datePipe.transform(dateTimeParts[0], 'dd-MMM-yyyy'),
  //         time: dateTimeParts[1],
  //       };
  //     }
  //   }
  //   return null; // Invalid or null datetime string
  // }

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
  //         date: this.datePipe.transform(parsedDate, 'dd-MMM-yyyy'),
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
      declarationumber: this.translate.instant(
        'declarationumber'
      ),
      edasattestno: this.translate.instant(
        'edasattestno'
      ),
      totalamount: this.translate.instant(
        'totalamount'
      ),
      declarationdate: this.translate.instant(
        'declarationdate'
      ),
      attestreqdate: this.translate.instant(
        'attestreqdate'
      ),
      status: this.translate.instant(
        'status'
      )
    };
    const dataList: any = [];
    this.cooAttestationLists.map((item: any) => {
      const dataItem: any = {};
      dataItem[jsonData.declarationumber] = item.declarationumber;
      dataItem[jsonData.edasattestno] = item.edasattestno;
      // dataItem[jsonData.entityshareamount] = item.entityshareamount;
      dataItem[jsonData.totalamount] = item.totalamount;
      dataItem[jsonData.declarationdate] = this.common.splitdatetime(item.declarationdate)?.date;
      dataItem[jsonData.attestreqdate] = this.common.splitdatetime(item.attestreqdate)?.date;
      dataItem[jsonData.status] = item.status;
      dataList.push(dataItem);
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Coo Attestation');
    XLSX.writeFile(wb, 'coo-attestation.xlsx');
  }


  
loadsidepanel(event:any){
  // this.common.showLoading();

  this.settingbackgroundcolors(event)
   console.log(event);
   console.log(this.selectedAttestations);

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

  if(this.selectedAttestations.length>this.paymentcount){
    this.common.showErrorMessage("Can't pay more than "+ this.paymentcount +" items at a time");
    return;
  }
 
   if (isRowSelected) {
    // if()
     // Row exists in selectedAttestations array, execute API call.
     this.executeApi1(event);
   } else {
     // Row doesn't exist in selectedAttestations array, execute another action.
     this.executeApi2(event);
   }
 
   this.noOfInvoicesSelected=this.selectedAttestations.length;
 
   this.shouldShow=true;
   if(this.selectedAttestations.length>1){
     this.previewvisible=false;
     this.Timelinevisible=false;
   }
   else if(this.selectedAttestations.length==0){
     this.shouldShow=false;
   }
   else{
 if(this.selectedAttestations[0]?.attachment!='' || this.selectedAttestations[0]?.attachment != null){
  this.getimagebase64(this.selectedAttestations[0]?.attachment);
 }
 
  let createddate=this.common.splitdatetime(this.selectedAttestations[0]?.enteredon);
     let approveddate=this.common.splitdatetime(this.selectedAttestations[0]?.approvedon);
     let paymentdate=this.common.splitdatetime(this.selectedAttestations[0]?.paidon);
     let attestationdate=this.common.splitdatetime(this.selectedAttestations[0]?.attestedon);
     let completedDate=this.common.splitdatetime(this.selectedAttestations[0]?.completedon);
 
 console.log(this.timelineItems);
 this.timelineItems.forEach(item => (item.status = ''));
 
 const statusuno = this.selectedAttestations[0].statusuno;
 
 if (statusuno >= 0 && statusuno <= 10) {
   for (let i = 0; i < statusuno; i++) {
     this.timelineItems[i].status = 'active';
     if(statusuno==1 && createddate!=null){
       this.timelineItems[i].date=createddate?.date || '';
       this.timelineItems[i].time=createddate.time;
     }
     else if(statusuno==6 && approveddate!=null){
       this.timelineItems[i].date=approveddate.date || '';
       this.timelineItems[i].time=approveddate.time;
     }
     else if(statusuno==3 && paymentdate!=null){
       this.timelineItems[i].date=paymentdate.date || '';
       this.timelineItems[i].time=paymentdate.time;
     }
     else if(statusuno==9 && attestationdate!=null){
       this.timelineItems[i].date=attestationdate.date || '';
       this.timelineItems[i].time=attestationdate.time;
     }
     else if(statusuno==10 && completedDate!=null){
       this.timelineItems[i].date=completedDate.date || '';
       this.timelineItems[i].time=completedDate.time;
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
  executeApi1(event:any){
    console.log(this.totalFineAmount)
  console.log(event)
  let mycondition="noload";
  let data;
  if(this.selectedAttestations.length==1){
   data={    
     "requstno":this.selectedAttestations[0].coorequestno,
     "invoiceuno":0,
     "action":"ADD",
     "uuid":this.uuid
   }
   this.payorpayall='Pay';
  }
  else if(this.selectedAttestations.length>1){
    this.payorpayall='Pay All';

    const coorequestnoArray = this.selectedAttestations.map((item:any) => item.coorequestno).join(',');

   data={    
     "requstno":coorequestnoArray,
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
         this.apiservice.post(this.consts.getCOOAttestpaymentdetails,data).subscribe({next:(success:any)=>{
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
             console.log("Something went wrong!!")
            // this.common.showErrorMessage("Something went wrong")
             return;
           }
           }})
   return
 }
 executeApi2(event:any){
   // this.common.showErrorMessage("checkbox unchecked"!)
   console.log("checkbox unchecked")
  console.log(event)
 
       let data={    
         "requstno":event.coorequestno,
           "invoiceuno":this.invoiceunoresponse,
           "action":"DELETE",
           "uuid":this.uuid
       }
       let response;
       this.common.showLoading();
 
       this.apiservice.post(this.consts.getCOOAttestpaymentdetails,data).subscribe({next:(success:any)=>{
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
           console.log("Something went wrong!!!")

           //this.common.showErrorMessage("Something went wrong")
           return;
         }
         }})
 
 
 
   return;
 
 
 }
 
getimagebase64(attachment:any){
  let resp;
//"D:\\mofafile\\LCARequest\\PDF\\\\20161220423\\INV00000_New.PDF"
  //let attestfilelocation1=this.common.encryptWithPublicKey(attestfilelocation)
  let data={
    "attachment":attachment,
    "uuid":this.uuid 
  }
  this.common.showLoading();

  this.apiservice.post(this.consts.getAttestationFileContent,data).subscribe({next:(success:any)=>{
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
    }
    else{
      this.common.showErrorMessage('')
      this.loading=false;
    }
  }
})
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
  "udf2": this.contactno,
  "udf3": this.uuid,
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
  "currencyCode": "784",
  "version": "1.0.1"
}

let resp;

let header={
  "uuid":this.uuid,
  "processname":"COO"
}
this.common.showLoading();
      this.apiservice.postWH(this.consts.mpaypurchaseRequest,data,{header}).subscribe({next:(success:any)=>{
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
            "processname":"COO"
          }
          this.common.setpaymentdetails(data);

          window.location.href = site+'?PaymentID='+code;
         // this.router.navigateByUrl(site);
       
        }
        else{
          this.common.showErrorMessage('Something went wrong. Please try again later')
          return;
        }
      }
      })
}

openDialog(customer:any) {
  console.log(customer);
  // this.dialog.open(DialogDataExampleDialog, {
  //   data: {
  //     animal: 'panda',
  //   },
  // });
}

// openNew(data:any) {
//   // this.LInvoice_c={};
//   this.AddInvoiceDialog=true
//   // this.submitted = false;

//   this.form.patchValue({
//     coorequestno: data.coorequestno,
//     lcarequestno: data.lcarequestno,
//     declarationumber: data.declarationumber,
//     declarationdate: data.declarationdate,
//     enteredon: data.enteredon,
//     edasattestno: data.edasattestno,
//     attestreqdate: data.attestreqdate,
//     feesamount: data.feesamount,
//     totalamount: data.totalamount,
//     comments: data.comments,
//     feespaid: data.feespaid,
//     statusname: data.statusname
//   });
// }

isCOONotPaid(data:any) {
  return data.canpay === 0;
}
getSeverity_(canpay: number) {
  switch (canpay) {
      case 1:
          return 'success';
      default :
          return 'danger';
  }

}

openNew_(data:any){
  this.getLCAInvoicesForMyCooDec(data);
  this.AddInvoiceDialog_=true

}

openNew(data:any) {
  console.log(data);
  this.currentrow=data;

  
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
    totalamount: 'Total Amount',
    comments: 'Comments',
    feespaid: 'Fees Paid',
    statusname: 'Status'
  };

  if (data) {
    this.fields = Object.keys(fieldMappings).map(key => {
      let value = data[key];
      if (key=="declarationdate" || key=="enteredon" ||key=="attestreqdate" ) {
        const splitResult = this.common.splitdatetime(value);

        if (splitResult?.date === '01-Jan-1970' || splitResult?.date === '01-Jan-0001') {
          value = ''; // Set value to an empty string
        } else {
          value = splitResult?.date;
        }
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

FilterInittable(){
  let data = {
    "Companyuno":this.currentcompany,
    "uuid":this.uuid,
    "startnum":0,
    "limit":10,
    "Startdate":this.common.formatDateTime_API_payload(this.oneMonthAgo.toDateString()),
    "Enddate":this.common.formatDateTime_API_payload(this.todayModel.toDateString())
  };
  this.common.showLoading();

  this.apiservice
    .post(this.consts.getCooRequests, data)
    .subscribe((response: any) => {
      this.common.hideLoading();

      if (`${response.dictionary.responsecode}` === '1') {
        const dataArray = response.dictionary.data;
        this.cooAttestationLists = dataArray;
        this.cooAttestationLists.map((row: any) => {
          if (row.statusuno === AttestationStatusEnum.Status0) {
            row.status = 'Created';
          } else if (row.statusuno === AttestationStatusEnum.Status1) {
            row.status = 'Pending';
          } else if (row.statusuno === AttestationStatusEnum.Status2) {
            row.status = 'Payment';
          } else if (row.statusuno === AttestationStatusEnum.Status3) {
            row.status = 'Attestation';
          } else if (row.statusuno === AttestationStatusEnum.Status4) {
            row.status = 'Approved';
          } else {
            row.status = '';
          }
        });
      }
    });
}

closesidetab(){
  this.confirmationService.confirm({
    message: 'Are you sure you want to clear the item(s) selected for payment?',
    header: 'Confirm',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
        this.shouldShow=false;
  this.selectedAttestations=[]
  this.cooAttestationLists.forEach((row: any) => {
    row.isSelected = false;
  });
      //  this.deleteuser(list)
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Removed Successfully', life: 3000 });
    }
});
}


getSeverity(status: string) {
  switch (status) {
      case 'Paid':
          return 'success';
      case 'Not Paid':
          return 'danger';
      default :
          return 'warning';
  }

}
isPaid(data:any) {
  // switch (status) {
  //     case 'Paid':
  //         return true;
    
  //     default :
  //         return false;
  // }
  return data.feespaid === 'Paid';

}

isRowSelectable(event:any) {
  return !this.isPaid(event.data);
}


// Add this to your component class
isSelected(customer: any): string {
  let abc=this.selectedAttestations.includes(customer);
  if(abc){
    return 'active';

  }
  else{
    return 'inactive'
  }
}

settingbackgroundcolors(event:any){
  
  this.cooAttestationLists.forEach((row: any) => {
    row.isSelected = false;
  });
  
  if (this.selectedAttestations.length > 0) {
    // If multiple rows are selected
    this.selectedAttestations.forEach((eventRow: any) => {
      const selectedRow = this.cooAttestationLists.find((row: any) => row.edasattestno === eventRow.edasattestno);
      if (selectedRow) {
        selectedRow.isSelected = true;
      }
    });
  } else {
    // If a single row is selected
    // const selectedRow = this.cooAttestationLists.find((row: any) => row.edasattestno === this.selectedAttestations[0].edasattestno);
    // if (selectedRow) {
    //   selectedRow.isSelected = true;
    // }
  }
  console.log(this.cooAttestationLists)
}

getLCAInvoicesForMyCooDec(currentrow:any){

  let resp;
  let data={
    "uuid":this.uuid,
    "decNo":currentrow.declarationumber
}
      this.loading=true;
      this.common.showLoading();
          this.apiservice.post(this.consts.getlcalistforcoodeclaration,data).subscribe({next:(success:any)=>{
            this.common.hideLoading();
            this.loading=false;
            resp=success;
            if(resp.dictionary.responsecode==1){
            this.cooAttestationLists_LCA=resp.dictionary.data
            this.cooAttestationLists_LCA = this.cooAttestationLists_LCA.map((item:any) => ({ ...item, selected: false }));
            console.log(this.cooAttestationLists_LCA)
              // this.datasource=resp.dictionary.data;
              this.totalrecords_LCA=resp.dictionary.recordcount;
              this.loading = false;
      
      // console.log(this.datasource);
            }
            else{
              this.common.showErrorMessage('Something went wrong')
              this.loading=false;
            }
      
          }
        })
}

}


