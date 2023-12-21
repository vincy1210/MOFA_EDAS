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

@Component({
  selector: 'app-physical',
  templateUrl: './physical.component.html',
  styleUrls: ['./physical.component.css']
})
export class PhysicalComponent implements OnInit {
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

fields: { label: string, value: any }[] = [];
isButtonDisabled = false;
total_invoiceamount:any;

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

    this.currentcompany=this.auth.getSelectedCompany().companyuno || '';
   
    
    
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
      // { field: 'attestationrequno', header: 'Attestation No.' },
      { field: 'edasreqno', header: 'edasreqno', width:'20%' },
      { field: 'wfstatus', header: 'Status', width:'15%' },

      { field: 'entitycode', header: 'entitycode' , width:'10%'},
      { field: 'invoiceno', header: 'Invoice ID', width:'20%' },
      { field: 'invoiceamount', header: 'invoiceamount', width:'15%' },
      { field: 'invoicecurrency', header: 'invoicecurrency', width:'10%' },
      { field: 'invoicedate', header: 'invoicedate', width:'15%' },


      //statusname
    ];
    this.InitTable();
  }

  InitTable() {
    let data = {
      "Companyuno":this.currentcompany,
      "uuid":this.uuid,
      "status":0, 
      "startnum":0,
      "limit":10,
      "Startdate":this.common.formatDateTime_API_payload(this.oneMonthAgo.toDateString()),
      "Enddate":this.common.formatDateTime_API_payload(this.todayModel.toDateString())
    };
    this.common.showLoading();

    this.apiservice
      .post(this.consts.getcompletedInvoiceAttestList, data)
      .subscribe((resp: any) => {
        this.common.hideLoading();

        if (`${resp.responsecode}` === '1') {
          const dataArray = resp.data;
          this.invoiceRequestLists = dataArray;

          const totalInvoiceAmount = resp.data.reduce((total:any, item:any) => total + item.invoiceamount, 0);
          console.log(totalInvoiceAmount)

          
          
                  this.total_invoiceamount=totalInvoiceAmount;
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
      dataList.push(dataItem);
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Physical Attestations-Completed');
    XLSX.writeFile(wb, 'Physical_Attestations_Completed.xlsx');
  }


  

openNew(data:any) {
  console.log(data);
  this.currentrow=data;
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
}
