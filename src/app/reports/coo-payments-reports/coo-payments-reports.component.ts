import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { LazyLoadEvent } from "primeng/api";
import { ApiService } from "src/service/api.service";
import { CommonService } from "src/service/common.service";
import { ConstantsService } from "src/service/constants.service";
// import { ModalPopupService } from "src/app/services/modal-popup.service";
// import { AttestationStatusEnums } from "src/app/shared/constants/status-enum";
// import {
//   SortFilterType,
//   FilterTypeAttestation,
// } from "src/app/shared/models/filetype-model";
// import { LayoutModel } from "src/app/shared/models/layout-model";
// import { MoreDetailsListviewComponent } from "../../more-details-listview/more-details-listview.component";
import * as XLSX from "xlsx";

@Component({
  selector: "app-coo-payments-reports",
  templateUrl: "./coo-payments-reports.component.html",
  styleUrls: ["./coo-payments-reports.component.scss"],
  providers: [],
})
export class CooPaymentsReportsComponent  implements OnInit {
  public shouldShow = false;
  totalFineAmount: any;
  totalAttestationFee: any;
  totalFee: any;
  fileContentEncode: any;
  progress_val: number = 0;
  selectedRows: any[] = [];
  totalrecords: number = 0;
  invoiceRequestLists: any[] = [];
  invoiceRequestListsFilter: any[] = [];
  globalFilter: string = "";
  // sortFilter: SortFilterType = {} as SortFilterType;
  filters: any = {};
  cols: any;
  loading: boolean = false;
  enableFilters: boolean = false;
  routesname: "pending" | "approve" = "pending";
  routesurl: string = "";
  // filterOptions: Array<FilterTypeAttestation> = [
  //   { id: AttestationStatusEnums.Approved, value: "Approved" },
  //   { id: AttestationStatusEnums.Returned, value: "Returned" },
  // ];
  // selectedFilterOption: FilterTypeAttestation = {
  //   id: AttestationStatusEnums.Approved,
  //   value: "Approved",
  // };
  currentDate: Date = new Date();
  responsiveLayout: "scroll" | "stack" = "stack";
  totals: any = {};

  constructor(
    
    // private modalPopupService: ModalPopupService,
    private datePipe: DatePipe
  ) {
   
  }

  ngOnInit(): void {
   
    this.progress_val = 0;
    this.cols = [
      {
        field: "invoiceid",
        header: "label.reports.invoiceDetails.invoiceDetailsList.invoiceid",
      },
      {
        field: "companyname",
        header: "label.reports.invoiceDetails.invoiceDetailsList.companyname",
      },
      {
        field: "entityname",
        header: "label.reports.invoiceDetails.invoiceDetailsList.entityname",
      },
      {
        field: "noofattest",
        header: "label.reports.invoiceDetails.invoiceDetailsList.noofattest",
      },
      {
        field: "nooffines",
        header: "label.reports.invoiceDetails.invoiceDetailsList.nooffines",
      },
      {
        field: "invoiceamount",
        header: "label.reports.invoiceDetails.invoiceDetailsList.invoiceamount",
      },
      {
        field: "fineamount",
        header: "label.reports.invoiceDetails.invoiceDetailsList.fineamount",
      },
      {
        field: "totalamount",
        header: "label.reports.invoiceDetails.invoiceDetailsList.totalamount",
      },
      {
        field: "paymentstatus",
        header: "label.reports.invoiceDetails.invoiceDetailsList.paymentstatus",
      },
      // {
      //   field: "paymentconfirmed",
      //   header:
      //     "label.reports.invoiceDetails.invoiceDetailsList.paymentconfirmed",
      // },
      // {
      //   field: "paymentcancelled",
      //   header:
      //     "label.reports.invoiceDetails.invoiceDetailsList.paymentcancelled",
      // },
      {
        field: "action",
        header: "label.companydetails.companyList.action",
      },
    ];
    //

  }

  loadDatas(event: LazyLoadEvent) {
    const startnum = event?.first ? event?.first : 0;
    const rows = event?.rows ? event?.rows : 0;
    // event.globalFilter = "";
    this.globalFilter = event.globalFilter;
   
    this.filters = event.filters;
    this.onClickFilterOptionCommon();
  }

  onClickFilterOptionDate(fromHtml: boolean) {
    const { Startdate, Enddate } = this.selectedFilterOption;
    this.selectedFilterOption.StartdateStr = this.common
      .splitdatetime(Startdate, "dd-MMM-yyyy")
      ?.date?.toString();
    this.selectedFilterOption.EnddateStr = this.common
      .splitdatetime(Enddate, "dd-MMM-yyyy")
      ?.date?.toString();
    if (fromHtml) {
      this.onClickFilterOptionCommon();
    }
  }

  onClickFilterOptionCommon() {
    let payload = {};
    // if (this.routesname === "pending") {
    payload = {
      companyuno: 301,
      // startnum: this.selectedFilterOption.startnum,
      // limit: this.selectedFilterOption.rows,
      entityuno: 2,
      Startdate: this.selectedFilterOption.StartdateStr,
      Enddate: this.selectedFilterOption.EnddateStr,
    };
    // }
    this.getInvoiceDetails(payload);
  }

  getInvoiceDetails(data: any) {
    this.shouldShow = false;
    const getLists =
      this.routesname === "pending"
        ? this.consts.getInvoiceDetails
        : this.consts.getInvoiceDetails;
    this.loading = true;
    this.apiservice.post(getLists, data).subscribe((response: any) => {
      this.loading = false;
      const dictionary = response;
      if (`${dictionary.responsecode}` === "1") {
        const dataArray = dictionary.data;
        this.invoiceRequestLists = dataArray;
        this.invoiceRequestLists.map((item: any) => {
          item["paymentstatus"] = item.paymentconfirmed
            ? "Success"
            : item.paymentcancelled
            ? "Cancelled"
            : "";
        });
        this.invoiceRequestListsFilter = this.invoiceRequestLists;
        this.totalrecords = dictionary?.recordcount
          ? dictionary?.recordcount
          : 0;
        this.totalsApply();
        this.globalFilterApply();
      }
    });
  }

  totalsApply() {
    const totalinvoiceamount = this.invoiceRequestListsFilter.reduce(
      (total: number, item: any) => total + Number(item.invoiceamount),
      0
    );
    const totalfineamount = this.invoiceRequestListsFilter.reduce(
      (total: number, item: any) => total + Number(item.fineamount),
      0
    );
    const totaltotalamount = this.invoiceRequestListsFilter.reduce(
      (total: number, item: any) => total + Number(item.totalamount),
      0
    );
    this.totals.totaltotalamount = totaltotalamount;
    this.totals.totalfineamount = totalfineamount;
    this.totals.totalinvoiceamount = totalinvoiceamount;
  }

  globalFilterApply() {
    // Global filter
    this.invoiceRequestListsFilter = this.invoiceRequestLists;
    if (this.globalFilter) {
      this.invoiceRequestListsFilter = this.common.filterClientData(
        this.invoiceRequestLists,
        this.globalFilter
      );
    }
    if (this.sortFilter.sortField) {
      this.invoiceRequestListsFilter = this.common.sortClientData(
        this.invoiceRequestListsFilter,
        this.sortFilter.sortField,
        this.sortFilter.sortOrder === 1 ? true : false
      );
    }
    if (this.filters) {
      let filterList: any[] = this.common.filterColumnsClientDataTrim(
        this.filters
      );
      filterList.forEach((item) => {
        this.invoiceRequestListsFilter = this.common.filterColumnsClientData(
          this.invoiceRequestListsFilter,
          item
        );
      });
    }
  }

  splitdatetime1(date: any) {
    return this.common.splitdatetime1(date);
  }

  splitdatetime(date: any) {
    return this.common.splitdatetime(date);
  }

  clickChips() {
    this.enableFilters = !this.enableFilters;
  }

  onClickFilterOption(option: {
    id:
      | AttestationStatusEnums.InDraft
      | AttestationStatusEnums.InRisk
      | AttestationStatusEnums.Payment
      | AttestationStatusEnums.InReview
      | AttestationStatusEnums.Pending
      | AttestationStatusEnums.Approved
      | AttestationStatusEnums.Returned
      | AttestationStatusEnums.OnHold
      | AttestationStatusEnums.Attested
      | AttestationStatusEnums.Completed;
    value:
      | "InDraft"
      | "InRisk"
      | "Payment"
      | "InReview"
      | "Pending"
      | "Approved"
      | "Returned"
      | "Returned"
      | "OnHold"
      | "Attested"
      | "Completed";
  }) {
    this.selectedFilterOption.id = option.id;
    this.selectedFilterOption.value = option.value;
    this.onClickFilterOptionCommon();
  }

  closeWorkflow() {
    this.shouldShow = !this.shouldShow;
    this.selectedRows = [];
  }

  ViewEditRow(row: any, action: "view" | "edit" | "viewmore") {
    let rowData;
    if (row.length && row.length > 0) {
      rowData = row[0];
      this.selectedRows = row;
    } else {
      rowData = row;
      this.selectedRows = [row];
    }
    rowData.visibleview = action;
    rowData.routesname = this.routesname;
    rowData.routesurl = this.routesurl;
    const dialogRef =
      this.modalPopupService.openPopup<MoreDetailsListviewComponent>(
        MoreDetailsListviewComponent,
        rowData,
        { width: "100vw" }
      );
    dialogRef.afterClosed().subscribe((result) => {
      if (action === "edit") {
        this.onClickFilterOptionCommon();
      }
    });
  }

  invoicepaymenttransactionreport(row: any) {
    //InvoicePaymentTransactionReportsComponent
    // this.router.navigate(["/invoicepaymenttransactionreport"], {
    //   state: { data: data },
    // });
    let rowData;
    if (row.length && row.length > 0) {
      rowData = row[0];
      this.selectedRows = row;
    } else {
      rowData = row;
      this.selectedRows = [row];
    }
    rowData.routesname = this.routesname;
    rowData.routesurl = this.routesurl;
    // const dialogRef =
    //   this.modalPopupService.openPopup<InvoicePaymentTransactionReportsComponent>(
    //     InvoicePaymentTransactionReportsComponent,
    //     rowData,
    //     { width: "100vw" }
    //   );
    // dialogRef.afterClosed().subscribe((result) => {});
  }

  exportExcel() {
    const jsonData = {
      invoiceid: this.translate.instant(
        "label.reports.invoiceDetails.invoiceDetailsList.invoiceid"
      ),
      companyname: this.translate.instant(
        "label.reports.invoiceDetails.invoiceDetailsList.companyname"
      ),
      entityname: this.translate.instant(
        "label.reports.invoiceDetails.invoiceDetailsList.entityname"
      ),
      noofattest: this.translate.instant(
        "label.reports.invoiceDetails.invoiceDetailsList.noofattest"
      ),
      nooffines: this.translate.instant(
        "label.reports.invoiceDetails.invoiceDetailsList.nooffines"
      ),
      invoiceamount: this.translate.instant(
        "label.reports.invoiceDetails.invoiceDetailsList.invoiceamount"
      ),
      fineamount: this.translate.instant(
        "label.reports.invoiceDetails.invoiceDetailsList.fineamount"
      ),
      totalamount: this.translate.instant(
        "label.reports.invoiceDetails.invoiceDetailsList.totalamount"
      ),
      paymentstatus: this.translate.instant(
        "label.reports.invoiceDetails.invoiceDetailsList.paymentstatus"
      ),
      // paymentconfirmed: this.translate.instant(
      //   "label.reports.invoiceDetails.invoiceDetailsList.paymentconfirmed"
      // ),
      // paymentcancelled: this.translate.instant(
      //   "label.reports.invoiceDetails.invoiceDetailsList.paymentcancelled"
      // ),
    };
    const dataList: any = [];
    this.invoiceRequestListsFilter.map((item: any) => {
      const dataItem: any = {};
      dataItem[jsonData.invoiceid] = item.invoiceid;
      dataItem[jsonData.companyname] = item.companyname;
      dataItem[jsonData.entityname] = item.entityname;
      dataItem[jsonData.noofattest] = item.noofattest;
      dataItem[jsonData.nooffines] = item.nooffines;
      dataItem[jsonData.invoiceamount] = item.invoiceamount;
      dataItem[jsonData.fineamount] = item.fineamount;
      dataItem[jsonData.totalamount] = item.totalamount;
      dataItem[jsonData.paymentstatus] = item.paymentconfirmed
        ? "Success"
        : item.paymentcancelled
        ? "Cancelled"
        : "";
      // dataItem[jsonData.paymentconfirmed] = item.paymentconfirmed;
      // dataItem[jsonData.paymentcancelled] = item.paymentcancelled;
      // dataItem[jsonData.enteredon] = this.common.splitdatetime(
      //   item.enteredone
      // )?.date;
      dataList.push(dataItem);
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoice Details");
    XLSX.writeFile(wb, "invoice-details.xlsx");
  }
}
