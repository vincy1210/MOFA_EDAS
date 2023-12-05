<<<<<<< HEAD
import { Component, OnInit, ViewChild } from '@angular/core';
=======
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
>>>>>>> c680799d3ff292b0cd1b35279b01705f3cfd99eb
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/service/api.service';
import { ConstantsService } from 'src/service/constants.service';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { ModalPopupService } from 'src/service/modal-popup.service';
<<<<<<< HEAD
import { CommonService } from 'src/service/common.service';
=======
>>>>>>> c680799d3ff292b0cd1b35279b01705f3cfd99eb

@Component({
  selector: 'app-completed-coo-requests',
  templateUrl: './completed-coo-requests.component.html',
  styleUrls: ['./completed-coo-requests.component.css'],
})
export class CompletedCooRequestsComponent implements OnInit {
<<<<<<< HEAD
  @ViewChild('tableref', { static: true }) tableref: any;
  public shouldShow = false;
=======
>>>>>>> c680799d3ff292b0cd1b35279b01705f3cfd99eb
  progress_val: number = 0;
  selectedAttestations: any;
  totalrecords: number = 0;
  cooAttestationLists: [] = [];
  cols: any;
  loading: boolean = false;
  enableFilters: boolean = false;
<<<<<<< HEAD
  today: Date = new Date(); 
oneMonthAgo = new Date();
todayModel:Date=new Date();
currentcompany:any;
uuid:string='';

AddInvoiceDialog:boolean=false;

currentrow:any;
isfilenotfouund:boolean=false;

fields: { label: string, value: any }[] = [];
 
isButtonDisabled = false;
=======

>>>>>>> c680799d3ff292b0cd1b35279b01705f3cfd99eb
  constructor(
    private modalPopupService: ModalPopupService,
    public translate: TranslateService,
    public apiservice: ApiService,
    public consts: ConstantsService,
<<<<<<< HEAD
    private datePipe: DatePipe, public common:CommonService
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
    this.currentcompany=this.common.getSelectedCompany().companyuno;
   
    let data11=this.common.getUserProfile();
    let uuid;
    if(data11!=null || data11!=undefined){
      data11=JSON.parse(data11)
      console.log(data11.Data)
      uuid=data11.Data.uuid;
      this.uuid=uuid;

    }
    else{
     
      // this.common.logoutUser()
      console.log("Invalid Session")

    }
   
    this.cols = [
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
        width:'20%'
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
=======
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.progress_val = 0;
    this.cols = [
      {
        field: 'declarationumber',
        header: 'label.completedCooRequests.completedCooList.declarationumber',
      },
      {
        field: 'edasattestno',
        header: 'label.completedCooRequests.completedCooList.edasattestno',
      },
      // { field: 'entityshareamount', header: 'label.completedCooRequests.completedCooList.entityshareamount' },
      {
        field: 'totalamount',
        header: 'label.completedCooRequests.completedCooList.totalamount',
      },
      {
        field: 'declarationdate',
        header: 'label.completedCooRequests.completedCooList.declarationdate',
      },
      {
        field: 'attestreqdate',
        header: 'label.completedCooRequests.completedCooList.attestreqdate',
      },
    ];
    this.getCooAttestations();
  }

  getCooAttestations() {
    this.loading = true;
    let data = {
      companyuno: '1',
      uuid: '1222',
      statusuno: 0,
      startnum: 0,
      endnum: 0,
    };
    this.apiservice
      .post(this.consts.getcompletedCOORequests, data)
      .subscribe((response: any) => {
        this.loading = false;
        let response1 = response?.dictionary;
        if (`${response1.responsecode}` === '1') {
          const dataArray = response1.data;
>>>>>>> c680799d3ff292b0cd1b35279b01705f3cfd99eb
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
          date: this.datePipe.transform(parsedDate, 'dd/MM/yyyy'),
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
      declarationumber: this.translate.instant(
<<<<<<< HEAD
        'label.cooAttestDetails.cooAttestList.declarationumber',
      ),
      edasattestno: this.translate.instant(
        'label.cooAttestDetails.cooAttestList.edasattestno'
      ),
      totalamount: this.translate.instant(
        'label.cooAttestDetails.cooAttestList.totalamount'
      ),
      declarationdate: this.translate.instant(
        'label.cooAttestDetails.cooAttestList.declarationdate'
      ),
      attestreqdate: this.translate.instant(
        'label.cooAttestDetails.cooAttestList.attestreqdate'
      ),
      status: this.translate.instant(
        'status'
      )
=======
        'label.completedCooRequests.completedCooList.declarationumber'
      ),
      edasattestno: this.translate.instant(
        'label.completedCooRequests.completedCooList.edasattestno'
      ),
      // entityshareamount: this.translate.instant(
      //   'label.completedCooRequests.completedCooList.entityshareamount'
      // ),
      totalamount: this.translate.instant(
        'label.completedCooRequests.completedCooList.totalamount'
      ),
      declarationdate: this.translate.instant(
        'label.completedCooRequests.completedCooList.declarationdate'
      ),
      attestreqdate: this.translate.instant(
        'label.completedCooRequests.completedCooList.attestreqdate'
      ),
>>>>>>> c680799d3ff292b0cd1b35279b01705f3cfd99eb
    };
    const dataList: any = [];
    this.cooAttestationLists.map((item: any) => {
      const dataItem: any = {};
      dataItem[jsonData.declarationumber] = item.declarationumber;
      dataItem[jsonData.edasattestno] = item.edasattestno;
      // dataItem[jsonData.entityshareamount] = item.entityshareamount;
      dataItem[jsonData.totalamount] = item.totalamount;
<<<<<<< HEAD
      dataItem[jsonData.declarationdate] = this.common.splitdatetime(item.declarationdate)?.date;
      dataItem[jsonData.attestreqdate] = this.common.splitdatetime(item.attestreqdate)?.date;
      dataItem[jsonData.status] = item.status;
=======
      dataItem[jsonData.declarationdate] = item.declarationdate;
      dataItem[jsonData.attestreqdate] = item.attestreqdate;
>>>>>>> c680799d3ff292b0cd1b35279b01705f3cfd99eb
      dataList.push(dataItem);
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
<<<<<<< HEAD
    XLSX.utils.book_append_sheet(wb, ws, 'COO Attestation-Completed');
    XLSX.writeFile(wb, 'COO-attestation-Completed.xlsx');
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
  
=======
    XLSX.utils.book_append_sheet(wb, ws, 'Coo Attestation');
    XLSX.writeFile(wb, 'completed-coo-attestation.xlsx');
  }
>>>>>>> c680799d3ff292b0cd1b35279b01705f3cfd99eb
}
