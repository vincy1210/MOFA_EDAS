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
      { field: 'declarationumber', header: 'Declaration Number', width: '20%' },
      { field: 'edasattestno', header: 'EDAS Attestation Number', width: '20%' },
      { field: 'statusname', header: 'Status', width: '10%' },
      { field: 'totalamount', header: 'Total Amount', width: '15%' },
      { field: 'declarationdate', header: 'Declaration Date', width: '13%' },
      { field: 'attestreqdate', header: 'Attestation Request Date', width: '13%' }
    ];
    

    
  this.cols_ = [
    { field: 'edasattestno', header: 'edasattestno', width: '20%' },
    { field: 'canpay', header: 'Status', width: '20%' },
    { field: 'Noofdaysleft', header: 'Age', width: '5%' },
    { field: 'invoiceamount', header: 'Invoice Amount', width: '20%' },
    { field: 'feesamount', header: 'Fees Amount', width: '20%' },
    { field: 'invoicenumber', header: 'Invoice ID', width: '20%' },
    { field: 'declarationumber', header: 'Declaration No', width: '20%' },
    { field: 'declarationdate', header: 'Declaration Date', width: '200px' },
    { field: 'attestreqdate', header: 'Created', width: '200px' },
    { field: 'lcaname', header: 'Channel', width: '15%' },
    { field: 'companyname', header: 'Company', width: '20%' },
  ];

    this.InitTable();
  }

  InitTable() {
    let data = {
      "Companyuno":this.currentcompany,
      "uuid":this.uuid,
      "startnum":0,
      "status":0,
      "limit":10,
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
          }
        }
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
      declarationumber: this.translate.instant(
        'declarationumber',
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
    XLSX.utils.book_append_sheet(wb, ws, 'COO Attestation-Completed');
    XLSX.writeFile(wb, 'COO-attestation-Completed.xlsx');
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
  
}
