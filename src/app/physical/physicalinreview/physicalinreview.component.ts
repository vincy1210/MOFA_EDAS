import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/service/api.service';
import { ConstantsService } from 'src/service/constants.service';
import * as XLSX from 'xlsx';
import { ModalPopupService } from 'src/service/modal-popup.service';
import { AttestationStatusEnum } from 'src/app/shared/models/attestation-status.model';
import { CommonService } from 'src/service/common.service';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-physicalinreview',
  templateUrl: './physicalinreview.component.html',
  styleUrls: ['./physicalinreview.component.css'],
})
export class PhysicalinreviewComponent implements OnInit {
  progress_val: number = 0;
  selectedAttestations: any;
  totalrecords: number = 0;
  invoiceRequestLists: [] = [];
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

  timelineItems = [
    { status: '', title: 'IN DRAFT', icon: 'check', date: '', time: '' },
    { status: '', title: 'PAYMENT', icon: 'check', date: '', time: '' },
    { status: '', title: 'IN REVIEW', icon: 'check', date: '', time: '' },
    { status: '', title: 'ATTESTED', icon: 'check', date: '', time: '' },
    { status: '', title: 'COMPLETED', icon: 'check', date: '', time: '' },
  ];
  ischecked:any;
  invoiceunoresponse:number=0;
  payment_button_isdisabled:boolean=true;
  base64PdfString: any;
  src:any;
  src1:any;

  isLoading=false;
  previewvisible:boolean=true;
  Timelinevisible:boolean=true;
  contactno:string='';

  AddInvoiceDialog:boolean=false;

currentrow:any;
isfilenotfouund:boolean=false;

attchemntisthere:boolean=false;
fields: { label: string, value: any }[] = [];
isButtonDisabled = false;
paymentcount=environment.appdetails.payment_count;
  constructor(
    private modalPopupService: ModalPopupService,
    public translate: TranslateService,
    public apiservice: ApiService,
    public consts: ConstantsService,
    public common: CommonService,private datePipe: DatePipe, private auth:AuthService, private router:Router
  ) {
    this.oneMonthAgo.setMonth(this.oneMonthAgo.getMonth() - 1);
  }

  ngOnInit(): void {
    // this.currentcompany=this.auth.getSelectedCompany().companyuno || '';
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
        width:'20%'
      },
      {
        field: 'entitycode',
        header: 'entitycode',
        width:'10%'
      }
      ,
      {
        field: 'status',
        header: 'status',
        width:'15%'
      },
      {
        field: 'invoiceno',
        header: 'Invoice ID',
        width:'15%'
      },
      {
        field: 'invoiceamount',
        header: 'invoiceamount',
        width:'15%'
      },
      {
        field: 'invoicecurrency',
        header:
          'invoicecurrency',
          width:'15%'
      },
      {
        field: 'invoicedate',
        header: 'invoicedate',
        width:'15%'
      }
    ];
    this.InitTable();
  }

  // InitTable(){
    
  // }

  

  clickChips() {
    this.enableFilters = !this.enableFilters;
  }

  InitTable() {
    //this.currentcompany
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
      .post(this.consts.getInReviewAttestReq, data)
      .subscribe((response: any) => {
        this.common.hideLoading();

        if (`${response.responsecode}` === '1') {
          const dataArray = response.data;
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
        }
      });
  }


  exportExcel() {
    const jsonData = {
      edasreqno: this.translate.instant(
        'edasreqno'
      ),
      entitycode: this.translate.instant(
        'entitycode'
      ),
      invoiceno: this.translate.instant(
        'invoiceno'
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
      ),
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
    XLSX.utils.book_append_sheet(wb, ws, 'Physical Attestation-InReview');
    XLSX.writeFile(wb, 'Physical_Attestation_InReview.xlsx');
  }

  splitdatetime1(date: any) {
    return this.common.splitdatetime1(date);
  }

  
  

  
  loadsidepanel(event:any){
    // this.common.showLoading();
     console.log(event);
     console.log(this.selectedAttestations);
   
   
     this.shouldShow=true;
   if(event.data.filepath!='' || event.data.filepath != null){
    this.getimagebase64(event.data.filepath);
   }
   
    let createddate=this.splitdatetime(event.data.enteredon);
       let approveddate=this.splitdatetime(event.data.approvedon);
       let paymentdate=this.splitdatetime(event.data.paidon);
       let attestationdate=this.splitdatetime(event.data.attestedon);
       let completedDate=this.splitdatetime(event.data.completedon);
   
   console.log(this.timelineItems);
   this.timelineItems.forEach(item => (item.status = ''));
   
   const statusuno = event.data[0].statusuno;
   
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
   
   console.log(event.data[0].statusuno);
   console.log(this.timelineItems);
   
     }
   
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
    this.src1= bytes.buffer;
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


openNew(data:any) {
  console.log(data);
  this.currentrow=data;

  if(this.currentrow.filepath!==undefined && this.currentrow.filepath!==null && this.currentrow.filepath!==''){
    this.attchemntisthere=true;
  }
  else{
    this.attchemntisthere=false;

  }


  let invnumber;
  if(this.currentrow?.invoiceuno!=0 || this.currentrow?.invoiceuno!=null || this.currentrow?.invoiceuno !=undefined){
    invnumber=parseInt(this.currentrow?.invoiceuno,10);
    this.common.getPaymentReceiptbase64(invnumber)
    .then((result) => {
      this.src = result;
      console.log(this.src);
  
    })
    .catch((error) => {
      console.error("Error fetching payment receipt:", error);
    });
  }
 
  this.AddInvoiceDialog=true
  const fieldMappings: { [key: string]: string } = {
      edasreqno: 'EDAS Request No',
    entitycode: 'Entity Code',
    invoiceno: 'Invoice No',
    invoiceamount: 'Invoice Amount',
    invoicecurrency: 'Currency',
    invoicedate: 'Invoice date',
    statusname: 'Status',
    enteredon:'Entered',

  };

  if (data) {
    this.fields = Object.keys(fieldMappings).map(key => {
      let value = data[key];

     
      if ( key=="enteredon" ||key=="attestreqdate" ) {
        const splitResult = this.common.splitdatetime(value);

        if (splitResult?.date === '01-Jan-1970' || splitResult?.date === '01-Jan-0001') {
          value = ''; // Set value to an empty string
        } else {
          value = splitResult?.date;
        }
      }
      else if(key=="invoiceamount" || key=="feesamount"){
        value =this.common.formatAmount(value);
      }
      else if(key=="invoicedate"){
        value=this.common.splitdatetime1(value)?.date;
      }

      return {
        label: fieldMappings[key],
        value: value
      };
    });
  }
  

}

FilterInitTable() {
  //this.currentcompany
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
    .post(this.consts.getInReviewAttestReq, data)
    .subscribe((response: any) => {
      this.common.hideLoading();

      if (`${response.responsecode}` === '1') {
        const dataArray = response.data;
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
      }
    });
}

closesidetab(){
  this.shouldShow=false;
  this.selectedAttestations=[]

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
}
