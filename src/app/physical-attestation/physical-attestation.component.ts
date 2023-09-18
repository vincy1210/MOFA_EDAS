import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PhysicalAttestationCreateComponent } from './physical-attestation-create/physical-attestation-create.component';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/service/api.service';
import { ConstantsService } from 'src/service/constants.service';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { ModalPopupService } from 'src/service/modal-popup.service';

@Component({
  selector: 'app-physical-attestation',
  templateUrl: './physical-attestation.component.html',
  styleUrls: ['./physical-attestation.component.css'],
})
export class PhysicalAttestationComponent implements OnInit {
  progress_val: number = 0;
  selectedAttestations: any;
  totalrecords: number = 0;
  invoiceRequestLists: [] = [];
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
      { field: 'edasreqno', header: 'label.physicalAttestDetails.physicalAttestList.edasreqno' },
      { field: 'entitycode', header: 'label.physicalAttestDetails.physicalAttestList.entitycode' },
      { field: 'invoiceno', header: 'label.physicalAttestDetails.physicalAttestList.invoiceno' },
      { field: 'invoiceamount', header: 'label.physicalAttestDetails.physicalAttestList.invoiceamount' },
      { field: 'invoicecurrency', header: 'label.physicalAttestDetails.physicalAttestList.invoicecurrency' },
      { field: 'invoicedate', header: 'label.physicalAttestDetails.physicalAttestList.invoicedate' },
    ];
    this.getInvoiceAttestations();
  }

  getInvoiceAttestations() {
    let data = {
      uuid: '12223',
      token: '12332',
    };
    this.apiservice
      .post(this.consts.getInvoiceAttestations, data)
      .subscribe((response: any) => {
        if (`${response.responseCode}` === '200') {
          const dataArray = response.data;
          this.invoiceRequestLists = dataArray;
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
      this.getInvoiceAttestations();
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
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.invoiceRequestLists);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Physical Attestation');
    XLSX.writeFile(wb, 'physical-attestation.xlsx');
  }
}
