import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/service/api.service';
import { ConstantsService } from 'src/service/constants.service';
import * as XLSX from 'xlsx';
import { ModalPopupService } from 'src/service/modal-popup.service';
import { AttestationStatusEnum } from 'src/app/shared/models/attestation-status.model';
import { CommonService } from 'src/service/common.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/service/auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-physical-pending',
  templateUrl: './physical-pending.component.html',
  styleUrls: ['./physical-pending.component.css']
})
export class PhysicalPendingComponent implements OnInit {
  progress_val: number = 0;
  selectedAttestations: any;
  totalrecords: number = 0;
  invoiceRequestLists: any;
  cols: any;
  loading: boolean = false;
  enableFilters: boolean = false;
  // for workflow
  public shouldShow = false;
  noOfInvoicesSelected: any[] = [];
  totalFineAmount: any;
  totalAttestationFee: any;
  totalFee: any;
  uuid:any;
  user_mailID:string='';
  today: Date = new Date(); 
  oneMonthAgo = new Date();
  todayModel:Date=new Date();
  currentcompany:any;
AddInvoiceDialog:boolean=false;
attchemntisthere:boolean=false;
payorpayall:string='Pay';
  timelineItems = [
    { status: '', title: this.translate.instant('IN DRAFT'), icon: 'check', date: '', time: '' },
    { status: '', title: this.translate.instant('Payment'), icon: 'check', date: '', time: '' },
    { status: '', title: this.translate.instant('IN REVIEW'), icon: 'check', date: '', time: '' },
    { status: '', title: this.translate.instant('COMPLETED'), icon: 'check', date: '', time: '' },
  ];
  ischecked:any;
  invoiceunoresponse:number=0;
  payment_button_isdisabled:boolean=true;
  base64PdfString: any;
  src:any;
  isLoading=false;
  previewvisible:boolean=true;
  Timelinevisible:boolean=true;
  contactno:string='';
  datasource:any;

  form:FormGroup;



currentrow:any;
isfilenotfouund:boolean=false;
selectedStatus: string = '0'; 
fields: { label: string, value: any }[] = [];
isButtonDisabled = false;
paymentcount=environment.appdetails.payment_count;


total_invoiceamount:any;
totalfeesamount:any;

  constructor(
    private modalPopupService: ModalPopupService,
    public translate: TranslateService,
    public apiservice: ApiService,
    public consts: ConstantsService,
    public common: CommonService,private datePipe: DatePipe, private fb:FormBuilder, private auth:AuthService, private router:Router
 
  ) {
    this.oneMonthAgo.setMonth(this.oneMonthAgo.getMonth() - 1);

    this.form = this.fb.group({
      edasreqno: '',
      entitycode: '',
      invoiceno: '',
      invoiceamount: '',
      invoicecurrency: '',
      invoicedate: '',
      wfstatus: '',
      companyname: ''
    });
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
      this.user_mailID=data11.Data.email;
      this.contactno=data11.Data.mobile;

    }
    else{
       this.common.setlogoutreason("session");
      this.auth.logout();

    }
    this.cols = [
      {
        field: 'edasreqno',
        header: 'edasreqno',
        width:'17%'
      },
      {
        field: 'entitycode',
        header: 'Channel',
        width:'13%'
      },
      {
        field: 'status',
        header: 'status',
        width:'10%'
      },
      {
        field: 'invoiceno',
        header: 'Invoice ID',
        width:'13%'
      },
      {
        field: 'invoiceamount',
        header: 'invoiceamount',
        width:'13%'
      },
      {
        field: 'feesamount',
        header: 'Fees',
        width:'13%'
      },
      {
        field: 'invoicecurrency',
        header:
          'invoicecurrency',
        width:'7%'
      },
      {
        field: 'enteredon',
        header: 'Entered On',
        width:'10%'
      },
      {
        field: 'invoicedate',
        header: 'invoicedate',
        width:'10%'
      },
   
    ];
   // this.InitTable();
  }

  // InitTable(){
    
  // }

  

  clickChips() {
    this.enableFilters = !this.enableFilters;
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

  InitTable($event:LazyLoadEvent) {
    //this.currentcompany
    let data = {
      "companyuno":this.currentcompany,
      "uuid":this.uuid,
      "startnum":$event.first,
      "limit":200 + ($event.first ?? 0),
      "startdate":this.common.formatDateTime_API_payload(this.oneMonthAgo.toDateString()),
      "enddate":this.common.formatDateTime_API_payload(this.todayModel.toDateString()),
      "statusuno":this.selectedStatus
    };
    this.loading=true;
    this.common.showLoading();

    this.apiservice
      .post(this.consts.getMyInvoiceAttestationsForAllS, data)
      .subscribe((response: any) => {
        this.common.hideLoading();

       this.loading=false;
        if (`${response.responsecode}` === '1') {
          let dataArray = response.data;
          
          // dataArray = dataArray.map((item:any) => ({ ...item, selected: false }));
	   this.totalrecords=response.recordcount;
          this.invoiceRequestLists = dataArray;

          const totalInvoiceAmount = response.data.reduce((total:any, item:any) => total + item.invoiceamount, 0);
          console.log(totalInvoiceAmount)
                  this.total_invoiceamount=totalInvoiceAmount;

                  const totalfessamount = response.data.reduce((total:any, item:any) => total + item.feesamount, 0);
                  console.log(totalfessamount)
                          this.totalfeesamount=totalfessamount;


          this.invoiceRequestLists.map((row: any) => {
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

          this.invoiceRequestLists= this.invoiceRequestLists.map((item:any) => ({ ...item, selected: false }));
         // dataArray = dataArray.map((item:any) => ({ ...item, selected: false }));
          //
        }
      });

  }

  // openDialogAttest() {
  //   const dialogRef =
  //     this.modalPopupService.openPopup<PhysicalAttestationCreateComponent>(
  //       PhysicalAttestationCreateComponent,
  //       null
  //     );
  //   dialogRef.afterClosed().subscribe((result) => {
  //     this.FilterInitTable();
  //   });
  // }

  exportExcel() {
    const jsonData = {
      edasreqno: this.translate.instant(
        'edasreqno'
      ),
      entitycode: this.translate.instant(
        'Channel'
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
      status: this.translate.instant(
        'status'
      )
    };
    const dataList: any = [];
    this.invoiceRequestLists.map((item: any) => {
      const dataItem: any = {};
      dataItem[jsonData.edasreqno] = item.edasreqno;
      dataItem[jsonData.entitycode] = item.entitycode;
      dataItem[jsonData.invoiceno] = item.invoiceno;
      dataItem[jsonData.invoiceamount] = item.invoiceamount;
      dataItem[jsonData.invoicecurrency] = item.invoicecurrency;
      dataItem[jsonData.invoicedate] = this.splitdatetime1(item.invoicedate)?.date;
      dataItem[jsonData.status] = item.status;
      dataList.push(dataItem);
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Physical Attestation-Pending');
    XLSX.writeFile(wb, 'Physical_Attestation_Pending.xlsx');
  }

  splitdatetime1(date: any) {
    return this.common.splitdatetime1(date);
  }
loadsidepanel(event:any){

  this.settingbackgroundcolors(event)

  // this.common.showLoading();
   console.log(event);
   console.log(this.selectedAttestations);

   let isRowSelected;

   if(event.length>0){
      isRowSelected = event.some((eventRow: any) => {
       return this.selectedAttestations.some((selectedRow: any) => {
           return selectedRow.edasreqno === eventRow.edasreqno;
       });
   });
   }
   else{
        isRowSelected = this.selectedAttestations.some((selectedRow: any) => {
     return selectedRow.edasreqno === event.edasreqno;
   });
  }
 
 
  //  const isRowSelected = this.selectedAttestations.some((selectedRow: any) => {
  //    return selectedRow.edasreqno === event.edasreqno;
  //  });
  if(this.selectedAttestations.length>this.paymentcount){
    this.common.showErrorMessage("Can't pay more than "+ this.paymentcount +" items at a time");
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
   if(this.selectedAttestations.length>1){
     this.previewvisible=false;
     this.Timelinevisible=false;
   }
   else if(this.selectedAttestations.length==0){
     this.shouldShow=false;
   }
   else{
 if(this.selectedAttestations[0]?.filepath!='' || this.selectedAttestations[0]?.filepath != null){
  this.getimagebase64(this.selectedAttestations[0]?.filepath);
 }
 
  let createddate=this.splitdatetime(this.selectedAttestations[0]?.attestreqdate);
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
     "requstno":this.selectedAttestations[0].attestationrequno,
     "invoiceuno":0,
     "action":"ADD",
     "uuid":this.uuid
   }
   this.payorpayall='Pay';
  }
  else if(this.selectedAttestations.length>1){
    this.payorpayall='Pay All';
    const physicalrequestnoArray = this.selectedAttestations.map((item:any) => item.attestationrequno).join(',');
      if(this.invoiceunoresponse==0){
        mycondition="loadagain";
      }
      else{
        mycondition="noload";
      }

   data={    
     "requstno":physicalrequestnoArray,
     "invoiceuno":this.invoiceunoresponse,
     "action":"ADD",
     "uuid":this.uuid
   }
  }
         let response;
         this.common.showLoading();
         this.apiservice.post(this.consts.getPhysicalAttestpaymentdetails,data).subscribe({next:(success:any)=>{
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
           //  this.common.showErrorMessage("Something went wrong")
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
         "requstno":event.attestationrequno,
           "invoiceuno":this.invoiceunoresponse,
           "action":"DELETE",
           "uuid":this.uuid
       }
       let response;
       this.common.showLoading();
 
       this.apiservice.post(this.consts.getPhysicalAttestpaymentdetails,data).subscribe({next:(success:any)=>{
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
          //
          console.log("Something went wrong!!")
           return;
         }
         },
         error: (error) => {
          // Handle the error here
          this.payment_button_isdisabled = true;
          this.common.showErrorMessage("An error occurred while processing your request.");
          console.error("Error:", error);
          return;
        }
        
        
        })
 
 
 
   return;
 
 
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
      this.common.showErrorMessage('Attachment load failed')
      this.loading=false;
    }
  }
})
}
AttestationPay(){
//   let data={
//     "id": "00331953",
//     "password": "",
//     "udf6": "905550",
//     "udf10": "",
//     "udf9": "",
//     "servicedata": [        
//         {
//             "noOfTransactions": "1",
//             "merchantId": "111792000",
//             "serviceId": "1054109963",
//             "amount": this.totalAttestationFee.toString()
//         }
//     ],
//   "responseURL":"",
//   "errorURL":"",
//     "udf3": "UDF3",
//     "udf4": "RRNTEST123",
//     "udf1": "udf1",
//     "udf2": "kuzhanthai.packiam@bankfab.com",
//     "udf7": "MagnatiPay",
//     "udf8": "",
//     "action": 1,
//     "correlationid": this.invoiceunoresponse,
//     "udf5": "03022020",
//     "langid": "EN",
//     "currencyCode": "784",
//     "version": "1.0.1"
// }
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
  "currencyCode": "784",
  "version": "1.0.1"
}

let resp;

let header={
  "uuid":this.uuid,
  "processname":"PHYSICAL"
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
            "processname":"PHYSICAL"
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



FilterInitTable(){
  let data = {
    "companyuno":this.currentcompany,
    "uuid":this.uuid,
    "startnum":0,
    "limit":20,
    "startdate":this.common.formatDateTime_API_payload(this.oneMonthAgo.toDateString()),
    "enddate":this.common.formatDateTime_API_payload(this.todayModel.toDateString()),
    "statusuno":10
  };
  this.common.showLoading();

  this.apiservice
    .post(this.consts.getMyInvoiceAttestationsForAllS, data)
    .subscribe((response: any) => {
      this.common.hideLoading();

      if (`${response.responsecode}` === '1') {
        const dataArray = response.data;
        this.invoiceRequestLists = dataArray;
        this.totalrecords=response.recordcount;
        this.invoiceRequestLists.map((row: any) => {
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
      }
    });

}

// closesidetab(){
//   this.confirmationService.confirm({
//     message:this.translate.instant('Are you sure you want to clear the item(s) selected for payment?'),
//     header: this.translate.instant('Confirm'),
//     icon: 'pi pi-exclamation-triangle',
//     accept: () => {

//       this.invoiceRequestLists.forEach((row: any) => {
//         row.isSelected = false;
//       });

//         this.shouldShow=false;
//   this.selectedAttestations=[]
//       //  this.deleteuser(list)
//         this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Removed Successfully', life: 3000 });
//     }
// });
// }

// openNew(data:any){

//   this.AddInvoiceDialog=true
//   // this.submitted = false;

//   this.form.patchValue({

//     edasreqno: data.edasreqno,
//     entitycode: data.entitycode,
//     invoiceno: data.invoiceno,
//     invoiceamount: data.invoiceamount,
//     invoicecurrency: data.invoicecurrency,
//     invoicedate: data.invoicedate,
//     statusname: data.statusname,
//     wfstatus: data.wfstatus,
//     companyname: data.companyname
//   });
// }




openNew(data:any) {
  console.log(data);
  this.currentrow=data;

  if(this.currentrow.filepath!==undefined && this.currentrow.filepath!==null && this.currentrow.filepath!==''){
    this.attchemntisthere=true;
  }
  else{
    this.attchemntisthere=false;

  }
		


  this.AddInvoiceDialog=true
  const fieldMappings: { [key: string]: string } = {
      edasreqno: 'edasreqno',
    entitycode: 'Channel',
    invoiceno: 'Invoice No',
    invoiceamount: 'Invoice Amount',
    invoicecurrency: 'Currency',
    invoicedate: 'Invoice date',
    statusname: 'Status',
    companyname: 'Company'
  };

  if (data) {
    this.fields = Object.keys(fieldMappings).map(key => {
      let value = data[key];
      if (key=="invoicedate" || key=="enteredon" ||key=="attestreqdate" ) {
        const splitResult = this.common.splitdatetime(value);

        // if (splitResult?.date === '01-Jan-1970' || splitResult?.date === '01-Jan-0001') {
        //   value = ''; // Set value to an empty string
        // } else {
          value = splitResult?.date;
        // }
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
  
  this.invoiceRequestLists.forEach((row: any) => {
    row.isSelected = false;
  });
  
  if (this.selectedAttestations.length > 0) {
    // If multiple rows are selected
    this.selectedAttestations.forEach((eventRow: any) => {
      const selectedRow = this.invoiceRequestLists.find((row: any) => row.edasreqno === eventRow.edasreqno);
      if (selectedRow) {
        selectedRow.isSelected = true;
      }
    });
  } else {
    // If a no row is selected
    // const selectedRow = this.invoiceRequestLists.find((row: any) => row.edasreqno === this.selectedAttestations[0].edasreqno);
    // if (selectedRow) {
    //   selectedRow.isSelected = true;
    // }
  }
  console.log(this.invoiceRequestLists)
}


getSeverity_(status: string) {
  switch (status) {
    case 'IN REVIEW':
      return 'warning';
    default:
      return 'danger';
  }
}

onDropdownChange(event:any){
  console.log(event)

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
