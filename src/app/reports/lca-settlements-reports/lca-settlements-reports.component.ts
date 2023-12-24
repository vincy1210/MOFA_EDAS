import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LazyLoadEvent } from 'primeng/api';
import {
  CompanyStatusEnums,
  CompanyAttestationEnums,
} from 'src/app/shared/constants/status-enum';
import { AttestationStatusEnum } from 'src/app/shared/models/attestation-status.model';
import {
  SortFilterType,
  FilterTypeCompany,
} from 'src/app/shared/models/filetype-model';
import { LayoutModel } from 'src/app/shared/models/layout-model';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import {
  MatDatepicker,
  MatDatepickerInputEvent,
} from '@angular/material/datepicker';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { ApiService } from 'src/service/api.service';
import { CommonService } from 'src/service/common.service';
import {
  ConstantsService,
  ActionConstants,
} from 'src/service/constants.service';
import { ModalPopupService } from 'src/service/modal-popup.service';

const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'MMM/YY',
  },
  display: {
    dateInput: 'MMM/YY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-lca-settlements-reports',
  templateUrl: './lca-settlements-reports.component.html',
  styleUrls: ['./lca-settlements-reports.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ],
})
export class LcaSettlementsReportsComponent
  extends LayoutModel
  implements OnInit
{
  lcaList: { itemno: number; itemname: string }[] = [];
  progress_val: number = 0;
  selectedRows: any[] = [];
  totalrecords: number = 0;
  settlementLists: any[] = [];
  settlementListsFilter: any[] = [];
  globalFilter: string = '';
  sortFilter: SortFilterType = {} as SortFilterType;
  filters: any = {};
  cols: any;
  loading: boolean = false;
  enableFilters: boolean = false;
  // for workflow
  public shouldShow = false;
  totalFineAmount: any;
  totalAttestationFee: any;
  totalFee: any;
  fileContentEncode: any;
  routesname: 'pending' | 'approve' = 'pending';
  routesurl: string = '';
  selectedFilterOption: FilterTypeCompany = {
    id: CompanyStatusEnums.Approved,
    value: 'Approved',
  };
  currentDate: Date = new Date();
  responsiveLayout: 'scroll' | 'stack' = 'stack';
  lcauno: number | undefined = 0;
  monthname: moment.Moment | null = moment().startOf('month');
  totals: any = {};

  constructor(
    public override router: Router,
    public override consts: ConstantsService,
    public override apiservice: ApiService,
    public override common: CommonService,
    public override translate: TranslateService,
    private route: ActivatedRoute,
    private modalPopupService: ModalPopupService
  ) {
    super(router, consts, apiservice, common, translate);
    const url = this.router.url;
    this.routesurl = url;
    this.routesname =
      this.routesurl === '/settlementpending' ? 'pending' : 'approve';
    if (this.routesname === 'pending') {
      // this.checkPermissionAllPage('settlementpending');
    } else if (this.routesname === 'approve') {
      // this.checkPermissionAllPage('settlementapprv');
    }
  }

  ngOnInit(): void {
    if (this.routesname === 'pending') {
      this.selectedFilterOption = {
        id: 1,
        value: 'Pending',
      };
    } else if (this.routesname === 'approve') {
      this.selectedFilterOption = {
        id: 2,
        value: 'Approved',
      };
    }
    this.progress_val = 0;
    this.cols = [
      {
        field: 'lcauno',
        header: 'settlementdetails.settlementList.lcauno',
      },
      {
        field: 'settlementuno',
        header: 'settlementdetails.settlementList.settlementuno',
      },
      {
        field: 'noofinvoices',
        header: 'settlementdetails.settlementList.noofinvoices',
      },
      {
        field: 'totalamount',
        header: 'settlementdetails.settlementList.totalamount',
      },
      {
        field: 'invoiceamount',
        header: 'settlementdetails.settlementList.invoiceamount',
      },
      {
        field: 'adjustmentamount',
        header: 'settlementdetails.settlementList.adjustmentamount',
      },
      {
        field: 'settlementamount',
        header: 'settlementdetails.settlementList.settlementamount',
      },
      {
        field: 'settlementcycle',
        header: 'settlementdetails.settlementList.settlementcycle',
      },
      {
        field: 'paymentref',
        header: 'settlementdetails.settlementList.paymentref',
      },
      // {
      //   field: "paymentremarks",
      //   header: "settlementdetails.settlementList.paymentremarks",
      // },
      // {
      //   field: "settlementremarks",
      //   header: "settlementdetails.settlementList.settlementremarks",
      // },
      // {
      //   field: "settlementstatus",
      //   header: "settlementdetails.settlementList.settlementstatus",
      // },
      {
        field: 'enteredon',
        header: 'settlementdetails.settlementList.enteredon',
      },
      {
        field: 'enteredby',
        header: 'settlementdetails.settlementList.enteredby',
      },
      {
        field: 'action',
        header: 'companydetails.companyList.action',
      },
    ];
    //
    this.selectedFilterOption.Enddate = this.currentDate;
    this.selectedFilterOption.Startdate = new Date(
      this.selectedFilterOption.Enddate
    );
    this.selectedFilterOption.Startdate.setDate(
      this.selectedFilterOption.Startdate.getDate() - 30
    );
    this.onClickFilterOptionDate(false);
    this.lcaDataList();
    this.siteAnalyticsData({ action: ActionConstants.load });
  }

  onClickFilterOptionDate(fromHtml: boolean) {
    const { Startdate, Enddate } = this.selectedFilterOption;
    this.selectedFilterOption.StartdateStr = this.common
      .splitdatetime(Startdate)
      ?.date?.toString();
    this.selectedFilterOption.EnddateStr = this.common
      .splitdatetime(Enddate)
      ?.date?.toString();
    if (fromHtml) {
      this.onClickFilterOptionCommon();
    }
  }

  onClickFilterOption(option: {
    id:
      | CompanyStatusEnums.Pending
      | CompanyStatusEnums.Approved
      | CompanyStatusEnums.Rejected;
    value: 'Pending' | 'Approved' | 'Rejected';
  }) {
    this.selectedFilterOption.id = option.id;
    this.selectedFilterOption.value = option.value;
    this.onClickFilterOptionCommon();
  }

  clickChips() {
    this.enableFilters = !this.enableFilters;
  }

  addEvent(type: string, event: MatDatepickerInputEvent<moment.Moment>): void {
    if (type === 'input') {
      // this.monthname = event.value;
    }
  }

  loadDatas(event: LazyLoadEvent) {
    const startnum = event?.first ? event?.first : 0;
    const rows = event?.rows ? event?.rows : 0;
    this.selectedFilterOption.startnum = startnum;
    this.selectedFilterOption.rows = rows;
    this.selectedFilterOption.uuid = '12223';
    // event.globalFilter = "";
    this.globalFilter = event.globalFilter;
    this.sortFilter = {
      sortOrder: event.sortOrder,
      sortField: event.sortField,
    };
    this.filters = event.filters;
    this.onClickFilterOptionCommon();
  }

  onDropdownChange(event: any, fieldValue: 'lcauno') {
    const selectedValue = event.value;
    if (fieldValue === 'lcauno') {
      // this.lcauno = selectedValue;
      this.onClickFilterOptionDate(true);
    }
  }

  onClickFilterOptionCommon() {
    let payload = {};
    if (this.routesname === 'pending') {
      payload = {
        uuid: this.selectedFilterOption.uuid,
        status: 0, // pending or complated
        lcauno: this.lcauno,
        monthname: `01-${this.monthname?.format(
          'MMM'
        )}-${this.monthname?.format('YY')}`,
      };
    } else {
      payload = {
        uuid: this.selectedFilterOption.uuid,
        status: 1, // pending or complated
        lcauno: this.lcauno,
        monthname: `01-${this.monthname?.format(
          'MMM'
        )}-${this.monthname?.format('YY')}`,
      };
    }
    this.getSettlementList(payload);
  }

  getSettlementList(data: any) {
    this.shouldShow = false;
    const getLists =
      this.routesname === 'pending'
        ? this.consts.getSettlementList
        : this.consts.getSettlementList;
    this.loading = true;
    this.apiservice.post(getLists, data).subscribe((response: any) => {
      this.loading = false;
      const dictionary = this.routesname === 'pending' ? response : response;
      if (`${dictionary.responsecode}` === '1') {
        const dataArray = dictionary.data;
        this.settlementLists = dataArray;
        this.settlementListsFilter = this.settlementLists;
        this.totalrecords = dataArray.length;
        this.totalsApply();
        this.globalFilterApply();
      }
    });
  }

  totalsApply() {
    const totaltotalamount = this.settlementListsFilter.reduce(
      (total: number, item: any) => total + Number(item.totalamount),
      0
    );
    const totalinvoiceamount = this.settlementListsFilter.reduce(
      (total: number, item: any) => total + Number(item.invoiceamount),
      0
    );
    const totaladjustmentamount = this.settlementListsFilter.reduce(
      (total: number, item: any) => total + Number(item.adjustmentamount),
      0
    );
    const totalsettlementamount = this.settlementListsFilter.reduce(
      (total: number, item: any) => total + Number(item.settlementamount),
      0
    );
    this.totals.totaltotalamount = totaltotalamount;
    this.totals.totalinvoiceamount = totalinvoiceamount;
    this.totals.totaladjustmentamount = totaladjustmentamount;
    this.totals.totalsettlementamount = totalsettlementamount;
  }

  globalFilterApply() {
    // Global filter
    this.settlementListsFilter = this.settlementLists;
    if (this.globalFilter) {
      this.settlementListsFilter = this.common.filterClientData(
        this.settlementLists,
        this.globalFilter
      );
    }
    if (this.sortFilter.sortField) {
      this.settlementListsFilter = this.common.sortClientData(
        this.settlementListsFilter,
        this.sortFilter.sortField,
        this.sortFilter.sortOrder === 1 ? true : false
      );
    }
    if (this.filters) {
      let filterList: any[] = this.common.filterColumnsClientDataTrim(
        this.filters
      );
      filterList.forEach((item) => {
        this.settlementListsFilter = this.common.filterColumnsClientData(
          this.settlementListsFilter,
          item
        );
      });
    }
  }

  lcaDataList() {
    this.selectedFilterOption.uuid = '1111';
    let data = {
      uuid: this.selectedFilterOption.uuid,
      languagecode: '1033',
      processname: 'LCAMASTER',
    };
    this.getListOfValues(data);
  }

  getListOfValues(data: any) {
    const getLists = this.consts.getListOfValues;
    this.apiservice.post(getLists, data).subscribe({
      next: (response: any) => {
        const dictionary = response;
        if (`${dictionary.responsecode}` === '1') {
          this.lcaList = dictionary.data;
          // if (this.routesname === 'pending') {
          this.lcauno = this.lcaList.at(0)?.itemno;
          this.onClickFilterOptionDate(true);
          // }

          let data2 = sessionStorage.getItem('lcauserdetails');
          if (data2 != undefined || data2 != null) {
            let lcauserdetails = JSON.parse(data2);
            this.lcauno = lcauserdetails?.lcauno;
            this.lcauno = 2;
          }
        }
      },
    });
  }

  // DeleteRow(row: any) {
  //   this.siteAnalyticsData({
  //     action: ActionConstants.deletecompany,
  //   });
  //   let rowData;
  //   if (row.length && row.length > 0) {
  //     rowData = row[0];
  //     this.selectedRows = row;
  //   } else {
  //     rowData = row;
  //     this.selectedRows = [row];
  //   }
  //   const data = { uno: rowData?.settlementuno };
  //   const dialogRef = this.modalPopupService.openPopup<WarningDialogComponent>(
  //     WarningDialogComponent,
  //     data,
  //     { width: '50vw' }
  //   );
  //   dialogRef.afterClosed().subscribe((result: any) => {
  //     if (result?.uno) {
  //       const data1 = {
  //         uuid: this.selectedFilterOption.uuid,
  //         settlementuno: result?.uno,
  //         paymentrefno: row.paymentrefno ? row.paymentrefno : '0',
  //         paymentremarks: row.paymentremarks, // result?.comments
  //         processname: 'DELETE',
  //       };
  //       this.deleteSettlement(data1);
  //     }
  //   });
  // }

  // deleteSettlement(data: any) {
  //   this.apiservice
  //     .post(this.consts.managesettlementlist, data)
  //     .subscribe((response: any) => {
  //       if (`${response.responsecode}` === '1') {
  //         this.common.showSuccessMessage(
  //           this.translate.instant('deleted')
  //         );
  //         this.onClickFilterOptionCommon();
  //       } else {
  //         this.common.showErrorMessage(this.translate.instant('error'));
  //       }
  //     });
  // }

  closeWorkflow() {
    this.shouldShow = !this.shouldShow;
    this.selectedRows = [];
  }

  exportExcel() {
    const jsonData = {
      lcauno: this.translate.instant('settlementdetails.settlementList.lcauno'),
      settlementuno: this.translate.instant(
        'settlementdetails.settlementList.settlementuno'
      ),
      noofinvoices: this.translate.instant(
        'settlementdetails.settlementList.noofinvoices'
      ),
      totalamount: this.translate.instant(
        'settlementdetails.settlementList.totalamount'
      ),
      invoiceamount: this.translate.instant(
        'settlementdetails.settlementList.invoiceamount'
      ),
      adjustmentamount: this.translate.instant(
        'settlementdetails.settlementList.adjustmentamount'
      ),
      settlementamount: this.translate.instant(
        'settlementdetails.settlementList.settlementamount'
      ),
      settlementcycle: this.translate.instant(
        'settlementdetails.settlementList.settlementcycle'
      ),
      paymentref: this.translate.instant(
        'settlementdetails.settlementList.paymentref'
      ),
      // paymentremarks: this.translate.instant(
      //   "settlementdetails.settlementList.paymentremarks"
      // ),
      // settlementremarks: this.translate.instant(
      //   "settlementdetails.settlementList.settlementremarks"
      // ),
      // settlementstatus: this.translate.instant(
      //   "settlementdetails.settlementList.settlementstatus"
      // ),
      enteredon: this.translate.instant(
        'settlementdetails.settlementList.enteredon'
      ),
      enteredby: this.translate.instant('companydetails.companyList.enteredby'),
    };
    const dataList: any = [];
    this.settlementListsFilter.map((item: any) => {
      const dataItem: any = {};
      dataItem[jsonData.lcauno] = item.lcauno;
      dataItem[jsonData.settlementuno] = item.settlementuno;
      dataItem[jsonData.noofinvoices] = item.noofinvoices;
      dataItem[jsonData.totalamount] = item.totalamount;
      dataItem[jsonData.invoiceamount] = item.invoiceamount;
      dataItem[jsonData.adjustmentamount] = item.adjustmentamount;
      dataItem[jsonData.settlementamount] = item.settlementamount;
      dataItem[jsonData.settlementcycle] = item.settlementcycle;
      dataItem[jsonData.paymentref] = item.paymentref;
      // dataItem[jsonData.paymentremarks] = item.paymentremarks;
      // dataItem[jsonData.settlementremarks] = item.settlementremarks;
      // dataItem[jsonData.settlementstatus] = item.settlementstatus;
      dataItem[jsonData.enteredon] = this.common.splitdatetime(
        item.enteredon
      )?.date;
      dataItem[jsonData.enteredby] = item.enteredby;
      dataList.push(dataItem);
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Company Details');
    XLSX.writeFile(wb, 'company-details.xlsx');
  }

  splitdatetime1(date: any) {
    return this.common.splitdatetime1(date);
  }

  splitdatetime(date: any) {
    return this.common.splitdatetime(date);
  }

  loadsidepanel(row: any, action: 'view' | 'download') {
    this.siteAnalyticsData({ action: ActionConstants.workflowview });
    this.fileContentEncode = undefined;
    row.companyattestationenums = CompanyAttestationEnums.Company;
    this.selectedRows = [row];
    const noOfInvoicesSelected: number = this.selectedRows.length;
    this.totalFineAmount = this.selectedRows.reduce(
      (total: any, item: any) => total + item.fineamount,
      0
    );
    this.totalAttestationFee = this.selectedRows.reduce(
      (total: any, item: any) => total + item.feesamount,
      0
    );
    this.totalFee = this.totalFineAmount + this.totalAttestationFee;
    if (action === 'view') {
      this.shouldShow = true;
    }

    let filepath = '';
    if (row.filepath) {
      filepath = row.filepath;
    } else if (row.attachment) {
      filepath = row.attachment;
    } else if (row.attestfilelocation) {
      filepath = row.attestfilelocation;
    }
    this.fileContentEncode = filepath;
  }

  chosenYearHandler(normalizedYear: moment.Moment) {
    const year = normalizedYear.year();
    const currentDate = this.currentDate.setFullYear(year);
    this.monthname = moment(currentDate).startOf('year');
  }

  chosenMonthHandler(
    normalizedMonth: moment.Moment,
    datepicker: MatDatepicker<moment.Moment>
  ) {
    const month = normalizedMonth.month();
    const currentDate = this.currentDate.setMonth(month);
    this.monthname = moment(currentDate).startOf('month');
    datepicker.close();
    this.onClickFilterOptionDate(true);
  }
}
