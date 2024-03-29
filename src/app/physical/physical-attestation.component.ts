import { Component, OnInit } from '@angular/core';
import { PhysicalAttestationCreateComponent } from './physical-attestation-create/physical-attestation-create.component';
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
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/service/auth.service';
import { Router } from '@angular/router';
import * as moment from 'moment';



@Component({
  selector: 'app-physical-attestation',
  templateUrl: './physical-attestation.component.html',
  styleUrls: ['./physical-attestation.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class PhysicalAttestationComponent implements OnInit {
  progress_val: number = 0;
  selectedAttestations: any;
  totalrecords: number = 0;
  invoiceRequestLists: any;
  cols: any;
  loading: boolean = false;
  enableFilters: boolean = false;
  // for workflow
  public shouldShow = false;
  noOfInvoicesSelected: number=0;
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

fields: { label: string, value: any }[] = [];
isButtonDisabled = false;
paymentcount=environment.appdetails.payment_count;

  constructor(
    private confirmationService:ConfirmationService,private messageService:MessageService,
    private modalPopupService: ModalPopupService,
    public translate: TranslateService,
    public apiservice: ApiService,
    public consts: ConstantsService,
    public common: CommonService,private datePipe: DatePipe, private fb:FormBuilder, private auth:AuthService, private router:Router
 
  ) {
    this.isRowSelectable = this.isRowSelectable.bind(this);
    console.log(this.isRowSelectable);

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
       console.log("from phyattest")

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
      .post(this.consts.getInvoiceAttestations, data)
      .subscribe((response: any) => {
        this.common.hideLoading();

       this.loading=false;
        if (`${response.responsecode}` === '1') {
          let dataArray = response.data;
          
          // dataArray = dataArray.map((item:any) => ({ ...item, selected: false }));
	   this.totalrecords=response.recordcount;
          this.invoiceRequestLists = dataArray;
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

  openDialogAttest() {
    const dialogRef =
      this.modalPopupService.openPopup<PhysicalAttestationCreateComponent>(
        PhysicalAttestationCreateComponent,
        null
      );
    dialogRef.afterClosed().subscribe((result) => {
      // this.FilterInitTable();
      this.onfilterclick();
    });
  }

  exportExcel() {
    const jsonData = {
      edasreqno: this.translate.instant('edasreqno'),
      entitycode: this.translate.instant('Channel'),
      status: this.translate.instant('status'),
      invoiceno: this.translate.instant('Invoice ID'),
      invoiceamount: this.translate.instant('Invoice Amount'),
      invoicecurrency: this.translate.instant('Currency'),
      invoicedate: this.translate.instant('invoicedate'),
      enteredon: this.translate.instant('Entered On'),
    };
    
    const dataList: any = [];
    this.invoiceRequestLists.map((item: any) => {
      const dataItem: any = {};
      dataItem[jsonData.edasreqno] = item.edasreqno;
      dataItem[jsonData.entitycode] = item.entitycode;
      dataItem[jsonData.status] = item.status;
      dataItem[jsonData.invoiceno] = item.invoiceno;
      dataItem[jsonData.invoiceamount] = item.invoiceamount;
      dataItem[jsonData.invoicecurrency] = item.invoicecurrency;
      dataItem[jsonData.invoicedate] = item.invoicedate;
      dataItem[jsonData.enteredon] = item.enteredon;
      dataList.push(dataItem);
    });
    dataList.forEach((dataItem: any) => {
      dataItem[jsonData.enteredon] = this.splitdatetime(dataItem[jsonData.enteredon])?.date;
      dataItem[jsonData.invoicedate] = this.splitdatetime(dataItem[jsonData.invoicedate])?.date;
    });

    // /splitdatetime

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.common.givefilename('Physical_Pending'));
    XLSX.writeFile(wb,  this.common.givefilename('Physical_Pending')+'.xlsx');
  }

  splitdatetime1(date: any) {
    return this.common.splitdatetime(date);
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
 
  let createddate=this.splitdatetime(this.selectedAttestations[0]?.enteredon);
    //  let approveddate=this.splitdatetime(this.selectedAttestations[0]?.approvedon);
     let paymentdate=this.splitdatetime(this.selectedAttestations[0]?.paidon);
    //  let attestationdate=this.splitdatetime(this.selectedAttestations[0]?.attestedon);
    //  let completedDate=this.splitdatetime(this.selectedAttestations[0]?.completedon);
 
 console.log(this.timelineItems);
 this.timelineItems.forEach(item => (item.status = ''));
 
 const statusuno = this.selectedAttestations[0].statusuno;
 
 if (statusuno >= 0 && statusuno <= 10) {
   for (let i = 0; i < statusuno; i++) {
     if(statusuno==1 && createddate!=null){
       this.timelineItems[0].date=createddate?.date || '';
       this.timelineItems[0].time=createddate.time;
     this.timelineItems[0].status = 'active';
     this.timelineItems[1].date='';
     this.timelineItems[1].time='';
       this.timelineItems[1].status = 'current';

     }
     else if(statusuno==4 && paymentdate!=null && createddate!=null){
      this.timelineItems[0].date=createddate?.date || '';
      this.timelineItems[0].time=createddate.time;
      this.timelineItems[0].status = 'active';
      this.timelineItems[1].status = 'active';
       this.timelineItems[1].date=paymentdate.date || '';
       this.timelineItems[1].time=paymentdate.time;
       this.timelineItems[2].status = 'current';
     }
   
     else{
       this.timelineItems[i].date=''
       this.timelineItems[i].time=''
     }
   }
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

let data={
 
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
  "udf4":"edas2.0",
  "udf5":"",
  "udf6":"",
  "udf7":"",
  "udf8":"",
  "udf9":this.uuid,
  "udf10":"PHYSICAL",
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



// FilterInitTable(){
//   let data = {
//     "Companyuno":this.currentcompany,
//     "uuid":this.uuid,
//     "startnum":0,
//     "limit":20,
//     "Startdate":this.common.formatDateTime_API_payload(this.oneMonthAgo.toDateString()),
//     "Enddate":this.common.formatDateTime_API_payload(this.todayModel.toDateString())
//   };
//   this.common.showLoading();

//   this.apiservice
//     .post(this.consts.getInvoiceAttestations, data)
//     .subscribe((response: any) => {
//       this.common.hideLoading();

//       if (`${response.responsecode}` === '1') {
//         const dataArray = response.data;
//         this.invoiceRequestLists = dataArray;
//         this.totalrecords=response.recordcount;
//         this.invoiceRequestLists.map((row: any) => {
//           if (row.statusuno === AttestationStatusEnum.Status0) {
//             row.status = 'Created';
//           } else if (row.statusuno === AttestationStatusEnum.Status1) {
//             row.status = 'Approved';
//           } else if (row.statusuno === AttestationStatusEnum.Status2) {
//             row.status = 'Payment';
//           } else if (row.statusuno === AttestationStatusEnum.Status3) {
//             row.status = 'Attestation';
//           } else if (row.statusuno === AttestationStatusEnum.Status4) {
//             row.status = 'Completed';
//           } else {
//             row.status = '';
//           }
//         });
//       }
//     });

// }

closesidetab(){
  this.confirmationService.confirm({
    message:this.translate.instant('Are you sure you want to clear the item(s) selected for payment?'),
    header: this.translate.instant('Confirm'),
    icon: 'pi pi-exclamation-triangle',
    accept: () => {

      this.invoiceRequestLists.forEach((row: any) => {
        row.isSelected = false;
      });

        this.shouldShow=false;
  this.selectedAttestations=[]
      //  this.deleteuser(list)
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Removed Successfully', life: 3000 });
    }
});
}

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

isPaid(data: any) {
   
  return data.isfeespaid;
}

isRowSelectable(event: any) {
  return !this.isPaid(event.data);
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
