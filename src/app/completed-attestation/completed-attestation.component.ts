import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/service/api.service';
import { ConstantsService } from 'src/service/constants.service';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { ModalPopupService } from 'src/service/modal-popup.service';

@Component({
  selector: 'app-completed-attestation',
  templateUrl: './completed-attestation.component.html',
  styleUrls: ['./completed-attestation.component.css']
})
export class CompletedAttestationComponent implements OnInit {
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
      { field: 'edasreqno', header: 'label.completedAttestDetails.completedAttestList.edasreqno' },
      { field: 'entitycode', header: 'label.completedAttestDetails.completedAttestList.entitycode' },
      { field: 'invoiceno', header: 'label.completedAttestDetails.completedAttestList.invoiceno' },
      { field: 'invoiceamount', header: 'label.completedAttestDetails.completedAttestList.invoiceamount' },
      { field: 'invoicecurrency', header: 'label.completedAttestDetails.completedAttestList.invoicecurrency' },
      { field: 'invoicedate', header: 'label.completedAttestDetails.completedAttestList.invoicedate' },
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
    const jsonData = {
      edasreqno: this.translate.instant(
        'label.completedAttestDetails.completedAttestList.edasreqno'
      ),
      entitycode: this.translate.instant(
        'label.completedAttestDetails.completedAttestList.entitycode'
      ),
      invoiceno: this.translate.instant(
        'label.completedAttestDetails.completedAttestList.invoiceno'
      ),
      invoiceamount: this.translate.instant(
        'label.completedAttestDetails.completedAttestList.invoiceamount'
      ),
      invoicecurrency: this.translate.instant(
        'label.completedAttestDetails.completedAttestList.invoicecurrency'
      ),
      invoicedate: this.translate.instant(
        'label.completedAttestDetails.completedAttestList.invoicedate'
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
      dataItem[jsonData.invoicedate] = item.invoicedate;
      dataList.push(dataItem);
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Completed Attestation');
    XLSX.writeFile(wb, 'completed-attestation.xlsx');
  }
}
