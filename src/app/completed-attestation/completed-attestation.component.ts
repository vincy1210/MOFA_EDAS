import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalPopupService } from 'src/providers/modal-popup.service';
import { CompletedAttestationCreateComponent } from './completed-attestation-create/completed-attestation-create.component';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/service/api.service';
import { ConstantsService } from 'src/service/constants.service';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-completed-attestation',
  templateUrl: './completed-attestation.component.html',
  styleUrls: ['./completed-attestation.component.css']
})
export class CompletedAttestationComponent  implements OnInit {
  progress_val: number = 0;
  selectedAttestations: any;
  totalrecords: number = 0;
  completedAttestationLists: [] = [];
  cols: any;
  loading: boolean = false;

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
      { field: 'declarationumber', header: 'label.completedAttestDetails.completedAttestList.declarationumber' },
      { field: 'edasreqno', header: 'label.completedAttestDetails.completedAttestList.edasreqno' },
      { field: 'edasattestno', header: 'label.completedAttestDetails.completedAttestList.edasattestno' },
      { field: 'entityshareamount', header: 'label.completedAttestDetails.completedAttestList.entityshareamount' },
      { field: 'totalamount', header: 'label.completedAttestDetails.completedAttestList.totalamount' },
      { field: 'declarationdate', header: 'label.completedAttestDetails.completedAttestList.declarationdate' },
      { field: 'attestreqdate', header: 'label.completedAttestDetails.completedAttestList.attestreqdate' },
      { field: 'actions', header: 'label.completedAttestDetails.completedAttestList.actions' },
    ];
    this.getCompletedAttestations();
  }

  getCompletedAttestations() {
    let data = {
      uuid: '12223',
      token: '12332',
    };
    this.apiservice
      .post(this.consts.getCompletedAttestations, data)
      .subscribe((response: any) => {
        if (`${response.responseCode}` === '200') {
          const dataArray = response.data;
          if (dataArray?.dictionary) {
            this.completedAttestationLists = dataArray?.dictionary?.data;
          }
        }
      });
  }

  uploadDeclaration(data: any) {
    const dialogRef =
      this.modalPopupService.openPopup<CompletedAttestationCreateComponent>(
        CompletedAttestationCreateComponent,
        data
      );
    dialogRef.afterClosed().subscribe((result) => {
      this.getCompletedAttestations();
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

  exportExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.completedAttestationLists);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Completed Attestation');
    XLSX.writeFile(wb, 'completed-attestation.xlsx');
  }
}
