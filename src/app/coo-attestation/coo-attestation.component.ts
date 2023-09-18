import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CooAttestationCreateComponent } from './coo-attestation-create/coo-attestation-create.component';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/service/api.service';
import { ConstantsService } from 'src/service/constants.service';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { ModalPopupService } from 'src/service/modal-popup.service';

@Component({
  selector: 'app-coo-attestation',
  templateUrl: './coo-attestation.component.html',
  styleUrls: ['./coo-attestation.component.css']
})
export class CooAttestationComponent  implements OnInit {
  progress_val: number = 0;
  selectedAttestations: any;
  totalrecords: number = 0;
  cooAttestationLists: [] = [];
  cols: any;
  loading: boolean = false;
  enableFilters: boolean = false;
  chips: { name: string }[] = [{ name: 'Filter' }];

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
      // { field: 'attestationrequno', header: 'Attestation No.' },
      { field: 'declarationumber', header: 'label.cooAttestDetails.cooAttestList.declarationumber' },
      { field: 'edasreqno', header: 'label.cooAttestDetails.cooAttestList.edasreqno' },
      { field: 'edasattestno', header: 'label.cooAttestDetails.cooAttestList.edasattestno' },
      { field: 'entityshareamount', header: 'label.cooAttestDetails.cooAttestList.entityshareamount' },
      { field: 'totalamount', header: 'label.cooAttestDetails.cooAttestList.totalamount' },
      { field: 'declarationdate', header: 'label.cooAttestDetails.cooAttestList.declarationdate' },
      { field: 'attestreqdate', header: 'label.cooAttestDetails.cooAttestList.attestreqdate' },
      { field: 'actions', header: 'label.cooAttestDetails.cooAttestList.actions' },
    ];
    this.getCooAttestations();
  }

  getCooAttestations() {
    let data = {
      uuid: '12223',
      token: '12332',
    };
    this.apiservice
      .post(this.consts.getCooRequests, data)
      .subscribe((response: any) => {
        if (`${response.responseCode}` === '200') {
          const dataArray = response.data;
          if (dataArray?.dictionary) {
            this.cooAttestationLists = dataArray?.dictionary?.data;
          }
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
        'label.cooAttestDetails.cooAttestList.declarationumber'
      ),
      edasreqno: this.translate.instant(
        'label.cooAttestDetails.cooAttestList.edasreqno'
      ),
      edasattestno: this.translate.instant(
        'label.cooAttestDetails.cooAttestList.edasattestno'
      ),
      entityshareamount: this.translate.instant(
        'label.cooAttestDetails.cooAttestList.entityshareamount'
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
    };
    const dataList: any = [];
    this.cooAttestationLists.map((item: any) => {
      const dataItem: any = {};
      dataItem[jsonData.declarationumber] = item.declarationumber;
      dataItem[jsonData.edasreqno] = item.edasreqno;
      dataItem[jsonData.edasattestno] = item.edasattestno;
      dataItem[jsonData.entityshareamount] = item.entityshareamount;
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
}
