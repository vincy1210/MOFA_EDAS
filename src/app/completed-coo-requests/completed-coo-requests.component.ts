import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/service/api.service';
import { ConstantsService } from 'src/service/constants.service';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { ModalPopupService } from 'src/service/modal-popup.service';

@Component({
  selector: 'app-completed-coo-requests',
  templateUrl: './completed-coo-requests.component.html',
  styleUrls: ['./completed-coo-requests.component.css'],
})
export class CompletedCooRequestsComponent implements OnInit {
  progress_val: number = 0;
  selectedAttestations: any;
  totalrecords: number = 0;
  cooAttestationLists: [] = [];
  cols: any;
  loading: boolean = false;
  enableFilters: boolean = false;

  constructor(
    private modalPopupService: ModalPopupService,
    public translate: TranslateService,
    public apiservice: ApiService,
    public consts: ConstantsService,
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
    };
    const dataList: any = [];
    this.cooAttestationLists.map((item: any) => {
      const dataItem: any = {};
      dataItem[jsonData.declarationumber] = item.declarationumber;
      dataItem[jsonData.edasattestno] = item.edasattestno;
      // dataItem[jsonData.entityshareamount] = item.entityshareamount;
      dataItem[jsonData.totalamount] = item.totalamount;
      dataItem[jsonData.declarationdate] = item.declarationdate;
      dataItem[jsonData.attestreqdate] = item.attestreqdate;
      dataList.push(dataItem);
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Coo Attestation');
    XLSX.writeFile(wb, 'completed-coo-attestation.xlsx');
  }
}
