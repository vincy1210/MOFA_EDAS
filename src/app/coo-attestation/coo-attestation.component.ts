import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CooAttestationCreateComponent } from './coo-attestation-create/coo-attestation-create.component';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/service/api.service';
import { ConstantsService } from 'src/service/constants.service';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { ModalPopupService } from 'src/service/modal-popup.service';
import { AttestationStatusEnum } from 'src/app/shared/models/attestation-status.model';

@Component({
  selector: 'app-coo-attestation',
  templateUrl: './coo-attestation.component.html',
  styleUrls: ['./coo-attestation.component.css'],
})
export class CooAttestationComponent implements OnInit {
  progress_val: number = 0;
  selectedAttestations: any;
  totalrecords: number = 0;
  cooAttestationLists: [] = [];
  cols: any;
  loading: boolean = false;
  enableFilters: boolean = false;
  // for workflow
  public shouldShow = false;
  noOfInvoicesSelected: any[] = [];
  totalFineAmount: any;
  totalAttestationFee: any;
  totalFee: any;

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
      // { field: 'coorequestno', header: 'Request No.' },
      {
        field: 'declarationumber',
        header: 'label.cooAttestDetails.cooAttestList.declarationumber',
      },
      {
        field: 'edasattestno',
        header: 'label.cooAttestDetails.cooAttestList.edasattestno',
      },
      // { field: 'entityshareamount', header: 'label.cooAttestDetails.cooAttestList.entityshareamount' },
      {
        field: 'totalamount',
        header: 'label.cooAttestDetails.cooAttestList.totalamount',
      },
      {
        field: 'declarationdate',
        header: 'label.cooAttestDetails.cooAttestList.declarationdate',
      },
      {
        field: 'attestreqdate',
        header: 'label.cooAttestDetails.cooAttestList.attestreqdate',
      },
      {
        field: 'status',
        header: 'label.cooAttestDetails.cooAttestList.status',
      },
      {
        field: 'actions',
        header: 'label.cooAttestDetails.cooAttestList.actions',
      },
    ];
    this.getCooAttestations();
  }

  getCooAttestations() {
    this.loading = true;
    let data = {
      companyuno: '1',
      uuid: '1222',
      startnum: 0,
      endnum: 0,
    };
    this.apiservice
      .post(this.consts.getCooRequests, data)
      .subscribe((response: any) => {
        this.loading = false;
        let response1 = response?.dictionary;
        if (`${response1.responsecode}` === '1') {
          const dataArray = response1.data;
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
        }
      });
  }

  uploadDeclaration(data: any) {
    const dialogRef =
      this.modalPopupService.openPopup<CooAttestationCreateComponent>(
        CooAttestationCreateComponent,
        data
      );
    dialogRef.afterClosed().subscribe((result) => {
      this.getCooAttestations();
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
      declarationumber: this.translate.instant(
        'label.cooAttestDetails.cooAttestList.declarationumber'
      ),
      edasattestno: this.translate.instant(
        'label.cooAttestDetails.cooAttestList.edasattestno'
      ),
      // entityshareamount: this.translate.instant(
      //   'label.cooAttestDetails.cooAttestList.entityshareamount'
      // ),
      totalamount: this.translate.instant(
        'label.cooAttestDetails.cooAttestList.totalamount'
      ),
      declarationdate: this.translate.instant(
        'label.cooAttestDetails.cooAttestList.declarationdate'
      ),
      attestreqdate: this.translate.instant(
        'label.cooAttestDetails.cooAttestList.attestreqdate'
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
    XLSX.writeFile(wb, 'coo-attestation.xlsx');
  }

  loadsidepanel(event: any) {
    this.noOfInvoicesSelected = this.selectedAttestations.length;
    this.totalFineAmount = this.selectedAttestations.reduce(
      (total: any, item: any) => total + item.fineamount,
      0
    );
    this.totalAttestationFee = this.selectedAttestations.reduce(
      (total: any, item: any) => total + item.feesamount,
      0
    );
    this.totalFee = this.totalFineAmount + this.totalAttestationFee;
    this.shouldShow = true;
    if (this.selectedAttestations.length > 1) {
      // this.previewvisible = false;
      // this.Timelinevisible = false;
    } else if (this.selectedAttestations.length == 0) {
      this.shouldShow = false;
    } else {
    }
  }
}
