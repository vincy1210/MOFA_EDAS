import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import * as XLSX from 'xlsx';
import { LayoutModel } from 'src/app/shared/models/layout-model';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {
  CompanyStatusEnums,
  PermissionEnums,
} from 'src/app/shared/constants/status-enum';
import {
  ConfirmationService,
  FilterMetadata,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import {
  FilterTypeCompany,
  SortFilterType,
} from 'src/app/shared/models/filetype-model';
import { ApiService } from 'src/service/api.service';
import { CommonService } from 'src/service/common.service';
import {
  ConstantsService,
  ActionConstants,
} from 'src/service/constants.service';
import { ModalPopupService } from 'src/service/modal-popup.service';
import { ImportAttestationsCreateComponent } from './import-attestations-create/import-attestations-create.component';
import { AuthService } from 'src/service/auth.service';
@Component({
  selector: 'app-import-attestations',
  templateUrl: './import-attestations.component.html',
  styleUrls: ['./import-attestations.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class ImportAttestationsComponent extends LayoutModel implements OnInit {
  orgCharts: boolean = false;
  progress_val: number = 0;
  selectedRows: any[] = [];
  totalrecords: number = 0;
  excelLists: any[] = [];
  excelListsFilter: any[] = [];
  globalFilter: string = '';
  sortFilter: SortFilterType = {} as SortFilterType;
  filters: any = {};
  cols: { field: string; header: string; errorrs: string[] }[] = [];
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
  responsiveLayout: 'scroll' | 'stack' = 'scroll';
  issubmitvalid: boolean = false;

  constructor(
    public override router: Router,
    public override consts: ConstantsService,
    public override apiservice: ApiService,
    public override common: CommonService,
    public override translate: TranslateService,
    private route: ActivatedRoute,
    private modalPopupService: ModalPopupService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private auth: AuthService
  ) {
    super(router, consts, apiservice, common, translate);
    const url = this.router.url;
    this.routesurl = url;
    this.routesname =
      this.routesurl === '/companydetailspending' ? 'pending' : 'approve';
    if (this.routesname === 'pending' || this.routesname === 'approve') {
      // this.checkPermissionAllPage("excel-import");
    }
  }

  ngOnInit(): void {
    let data11 = this.common.getUserProfile();
    let uuid;
    if (data11 != null || data11 != undefined) {
      data11 = JSON.parse(data11);
      console.log(data11.Data);
      uuid = data11.Data.uuid;
    } else {
      this.common.setlogoutreason('session');
      this.auth.logout();
    }

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
        field: 'LCACode',
        header: 'lcadetails.lcadetailList.LCACode',
        errorrs: [],
      },
      {
        field: 'RequestNo',
        header: 'lcadetails.lcadetailList.RequestNo',
        errorrs: [],
      },
      {
        field: 'RequestDate',
        header: 'lcadetails.lcadetailList.RequestDate',
        errorrs: [],
      },
      {
        field: 'DeclarationNo',
        header: 'lcadetails.lcadetailList.DeclarationNo',
        errorrs: [],
      },
      {
        field: 'DeclarationDate',
        header: 'lcadetails.lcadetailList.DeclarationDate',
        errorrs: [],
      },
      {
        field: 'TradelicenceNo',
        header: 'lcadetails.lcadetailList.TradelicenceNo',
        errorrs: [],
      },
      {
        field: 'ConsigneeName',
        header: 'lcadetails.lcadetailList.ConsigneeName',
        errorrs: [],
      },
      {
        field: 'EmailAddress',
        header: 'lcadetails.lcadetailList.EmailAddress',
        errorrs: [],
      },
      {
        field: 'ContactNo',
        header: 'lcadetails.lcadetailList.ContactNo',
        errorrs: [],
      },
      {
        field: 'DocType',
        header: 'lcadetails.lcadetailList.DocType',
        errorrs: [],
      },
      {
        field: 'ExpPortCode',
        header: 'lcadetails.lcadetailList.ExpPortCode',
        errorrs: [],
      },
      {
        field: 'ExpPortName',
        header: 'lcadetails.lcadetailList.ExpPortName',
        errorrs: [],
      },
      {
        field: 'Mode',
        header: 'lcadetails.lcadetailList.Mode',
        errorrs: [],
      },
      {
        field: 'AttestationNo',
        header: 'lcadetails.lcadetailList.AttestationNo',
        errorrs: [],
      },
      {
        field: 'InvoiceDate',
        header: 'lcadetails.lcadetailList.InvoiceDate',
        errorrs: [],
      },
      {
        field: 'InvoiceAmount',
        header: 'lcadetails.lcadetailList.InvoiceAmount',
        errorrs: [],
      },
      {
        field: 'InvoiceNo',
        header: 'lcadetails.lcadetailList.InvoiceNo',
        errorrs: [],
      },
      {
        field: 'InvoiceCurrency',
        header: 'lcadetails.lcadetailList.InvoiceCurrency',
        errorrs: [],
      },
      {
        field: 'InvoiceId',
        header: 'lcadetails.lcadetailList.InvoiceId',
        errorrs: [],
      },
      {
        field: 'CompanyName',
        header: 'lcadetails.lcadetailList.CompanyName',
        errorrs: [],
      },
      {
        field: 'Remarks',
        header: 'lcadetails.lcadetailList.Remarks',
        errorrs: [],
      },
      {
        field: 'Status',
        header: 'lcadetails.lcadetailList.Status',
        errorrs: [],
      },
      {
        field: 'action',
        header: 'actions',
        errorrs: [],
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
    // this.onClickFilterOptionDate(false);
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
    // this.onClickFilterOptionCommon();
  }

  onClickFilterOptionCommon() {
    let payload = {
      uuid: this.selectedFilterOption.uuid,
    };
    this.getLcaDetailList(payload);
  }

  getDataFromExcels(dataList: any[]) {
    this.excelLists = [];
    if (dataList && dataList.length > 0) {
      this.common.showSuccessMessage(this.translate.instant('datareadsuccess'));
      dataList.map((row, index) => {
        const [
          LCACode,
          RequestNo,
          RequestDate,
          DeclarationNo,
          DeclarationDate,
          TradelicenceNo,
          ConsigneeName,
          EmailAddress,
          ContactNo,
          DocType,
          ExpPortCode,
          ExpPortName,
          Mode,
          AttestationNo,
          InvoiceDate,
          InvoiceAmount,
          InvoiceNo,
          InvoiceCurrency,
          InvoiceId,
          CompanyName,
          Remarks,
        ] = row;
        if (
          index != 0 &&
          typeof LCACode === 'string' &&
          LCACode.trim().length > 0
        ) {
          const error = {
            LCACode: LCACode,
            TradelicenceNo: TradelicenceNo,
            ConsigneeName: ConsigneeName,
            DeclarationNo: DeclarationNo,
            RequestNo: RequestNo,
            RequestDate: RequestDate,
            DeclarationDate: DeclarationDate,
            AttestationNo: AttestationNo,
            InvoiceDate: InvoiceDate,
            InvoiceAmount: InvoiceAmount,
            InvoiceNo: InvoiceNo,
            InvoiceCurrency: InvoiceCurrency,
            CompanyName: CompanyName,
          };
          const Status: string = this.errorsChecker(error);
          this.excelLists.push({
            rowNum: index + 1,
            LCACode: typeof LCACode === 'string' ? LCACode.trim() : '',
            RequestNo: typeof RequestNo === 'string' ? RequestNo.trim() : '',
            RequestDate:
              typeof RequestDate === 'string' ? RequestDate.trim() : '',
            DeclarationNo:
              typeof DeclarationNo === 'string' ? DeclarationNo.trim() : '',
            DeclarationDate:
              typeof DeclarationDate === 'string' ? DeclarationDate.trim() : '',
            TradelicenceNo:
              typeof TradelicenceNo === 'string' ? TradelicenceNo.trim() : '',
            ConsigneeName:
              typeof ConsigneeName === 'string' ? ConsigneeName.trim() : '',
            EmailAddress:
              typeof EmailAddress === 'string' ? EmailAddress.trim() : '',
            ContactNo: typeof ContactNo === 'string' ? ContactNo.trim() : '',
            DocType: typeof DocType === 'string' ? DocType.trim() : '',
            ExpPortCode:
              typeof ExpPortCode === 'string' ? ExpPortCode.trim() : '',
            ExpPortName:
              typeof ExpPortName === 'string' ? ExpPortName.trim() : '',
            Mode: typeof Mode === 'string' ? Mode.trim() : '',
            AttestationNo:
              typeof AttestationNo === 'string' ? AttestationNo.trim() : '',
            InvoiceDate:
              typeof InvoiceDate === 'string' ? InvoiceDate.trim() : '',
            InvoiceAmount:
              typeof InvoiceAmount === 'string' ? InvoiceAmount.trim() : '',
            InvoiceNo: typeof InvoiceNo === 'string' ? InvoiceNo.trim() : '',
            InvoiceCurrency:
              typeof InvoiceCurrency === 'string' ? InvoiceCurrency.trim() : '',
            InvoiceId: typeof InvoiceId === 'string' ? InvoiceId.trim() : '',
            CompanyName:
              typeof CompanyName === 'string' ? CompanyName.trim() : '',
            Remarks: typeof Remarks === 'string' ? Remarks.trim() : '',
            Status: typeof Status === 'string' ? Status.trim() : '',
          });
        }
      });
    }
    this.excelListsFilter = this.excelLists;
  }

  errorsChecker(error: any) {
    let Status = 'Not valid';
    if (
      (error.LCACode === 'AUH' ||
        (error.LCACode !== 'AUH' && error.TradelicenceNo)) &&
      error.ConsigneeName &&
      error.DeclarationNo &&
      error.RequestNo &&
      error.RequestDate &&
      error.DeclarationDate &&
      error.AttestationNo &&
      error.InvoiceDate &&
      error.InvoiceAmount &&
      error.InvoiceNo &&
      error.InvoiceCurrency &&
      error.CompanyName
    ) {
      Status = 'Valid';
    } else {
      Status = 'Not valid';
    }
    return Status;
  }

  getErrorAvailable(data: any, field: string) {
    let result: { valid: boolean; text: string } = { valid: true, text: '' };
    if (!data.LCACode && field === 'LCACode') {
      result = { valid: false, text: 'Not valid' };
    } else if (
      data.LCACode !== 'AUH' &&
      !data.TradelicenceNo &&
      field === 'TradelicenceNo'
    ) {
      result = { valid: false, text: 'Not valid' };
    } else if (!data.ConsigneeName && field === 'ConsigneeName') {
      result = { valid: false, text: 'Not valid' };
    } else if (!data.DeclarationNo && field === 'DeclarationNo') {
      result = { valid: false, text: 'Not valid' };
    } else if (!data.RequestNo && field === 'RequestNo') {
      result = { valid: false, text: 'Not valid' };
    } else if (!data.RequestDate && field === 'RequestDate') {
      result = { valid: false, text: 'Not valid' };
    } else if (!data.DeclarationDate && field === 'DeclarationDate') {
      result = { valid: false, text: 'Not valid' };
    } else if (!data.AttestationNo && field === 'AttestationNo') {
      result = { valid: false, text: 'Not valid' };
    } else if (!data.InvoiceDate && field === 'InvoiceDate') {
      result = { valid: false, text: 'Not valid' };
    } else if (!data.InvoiceAmount && field === 'InvoiceAmount') {
      result = { valid: false, text: 'Not valid' };
    } else if (!data.InvoiceNo && field === 'InvoiceNo') {
      result = { valid: false, text: 'Not valid' };
    } else if (!data.InvoiceCurrency && field === 'InvoiceCurrency') {
      result = { valid: false, text: 'Not valid' };
    } else if (!data.CompanyName && field === 'CompanyName') {
      result = { valid: false, text: 'Not valid' };
    }
    // else if (!data.EmailAddress && field === 'EmailAddress') {
    //   result = { valid: false, text: 'Not valid' };
    // } else if (!data.ContactNo && field === 'ContactNo') {
    //   result = { valid: false, text: 'Not valid' };
    // } else if (!data.DocType && field === 'DocType') {
    //   result = { valid: false, text: 'Not valid' };
    // } else if (!data.ExpPortCode && field === 'ExpPortCode') {
    //   result = { valid: false, text: 'Not valid' };
    // } else if (!data.ExpPortName && field === 'ExpPortName') {
    //   result = { valid: false, text: 'Not valid' };
    // } else if (!data.Mode && field === 'Mode') {
    //   result = { valid: false, text: 'Not valid' };
    // } else if (!data.InvoiceId && field === 'InvoiceId') {
    //   result = { valid: false, text: 'Not valid' };
    // } else if (!data.Remarks && field === 'Remarks') {
    //   result = { valid: false, text: 'Not valid' };
    // }
    return result;
  }

  getLcaDetailList(data: any) {
    this.shouldShow = false;
    const getLists = ''; // this.consts.getRiskProfile;
    this.loading = true;
    this.apiservice.post(getLists, data).subscribe((response: any) => {
      this.loading = false;
      const dictionary = response;
      if (`${dictionary.responsecode}` === '1') {
        const dataArray = dictionary.data;
        this.excelLists = dataArray;
        this.excelListsFilter = this.excelLists;
        this.totalrecords = dataArray.length;
        this.globalFilterApply();
      }
    });
  }

  globalFilterApply() {
    // Global filter
    this.excelListsFilter = this.excelLists;
    if (this.globalFilter) {
      this.excelListsFilter = this.common.filterClientData(
        this.excelLists,
        this.globalFilter
      );
    }
    if (this.sortFilter.sortField) {
      this.excelListsFilter = this.common.sortClientData(
        this.excelListsFilter,
        this.sortFilter.sortField,
        this.sortFilter.sortOrder === 1 ? true : false
      );
    }
    if (this.filters) {
      let filterList: any[] = this.common.filterColumnsClientDataTrim(
        this.filters
      );
      filterList.forEach((item) => {
        this.excelListsFilter = this.common.filterColumnsClientData(
          this.excelListsFilter,
          item
        );
      });
    }
  }

  openDialogAdd() {
    this.siteAnalyticsData({ action: ActionConstants.addcompany });
    const dialogRef =
      this.modalPopupService.openPopup<ImportAttestationsCreateComponent>(
        ImportAttestationsCreateComponent,
        null
        // { width: "50vw" }
      );
    dialogRef.afterClosed().subscribe((value) => {
      if (value?.result === 'success') {
        // this.onClickFilterOptionCommon();
        this.getDataFromExcels(value?.dataList);
      }
    });
  }

  editrowclicked(row: any) {
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
    const dialogRef =
      this.modalPopupService.openPopup<ImportAttestationsCreateComponent>(
        ImportAttestationsCreateComponent,
        rowData
        // { width: "50vw" }
      );
    dialogRef.afterClosed().subscribe((result?: 'success') => {
      if (result === 'success') {
        // this.onClickFilterOptionCommon();
      }
    });
  }

  DeleteRow(row: any) {
    row.uno = row.rowNum;
    this.confirmationService.confirm({
      message: this.translate.instant('deleterecord'),
      header: this.translate.instant('Confirm'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (row?.uno) {
          const excelListsFilter: any[] = this.excelListsFilter;
          const dataList: any[] = excelListsFilter.filter((row) => {
            return row.rowNum !== row?.uno;
          });
          this.excelLists = dataList;
          this.excelListsFilter = this.excelLists;
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: this.translate.instant('Item_Deleted_Successfully'),
          life: 3000,
        });
      },
    });
  }

  postDataValid() {
    const dataList1 = this.excelLists;
    this.submitDataJson(dataList1);
  }

  postData() {
    const dataList1 = this.excelLists;
    const NotValidDatas = dataList1.filter((row) => {
      return row.Status !== 'Valid';
    });
    if (NotValidDatas && NotValidDatas.length > 0) {
      this.common.showErrorMessage(this.translate.instant('couldnotsubmit'));
      this.issubmitvalid = true;
      return;
    }
    if (dataList1.length === 0) {
      this.common.showErrorMessage(this.translate.instant('nothingtosubmit'));
      return;
    }
    this.submitDataJson(dataList1);
  }

  submitDataJson(dataList1: any[]) {
    const allRequestData = [] as any[];
    // all unique requests
    dataList1.forEach((row1) => {
      const RequestNo = row1.RequestNo;
      const allDataRequests = allRequestData.filter(
        (m) => m.requestNo === RequestNo
      );
      if (allDataRequests.length > 0) {
        return;
      }
      allRequestData.push({
        requestNo: RequestNo,
        requestDate: row1.RequestDate,
        lcaCode: row1.LCACode,
        requestDetails: {}, //[]
      });
    });
    // all unique declarations
    allRequestData.forEach((rowReq) => {
      const allRequestByNo = dataList1.filter(
        (m) => m.RequestNo === rowReq.requestNo
      );
      allRequestByNo.forEach((rowReq1) => {
        const DeclarationNo = rowReq1.DeclarationNo;
        const requestDetailsList: any[] = [rowReq.requestDetails]; //rowReq.requestDetails;
        const allDataDeclaration = requestDetailsList.filter(
          (m: any) => m.decNo === DeclarationNo
        );
        if (allDataDeclaration.length > 0) {
          return;
        }
        const allDataInvoices = dataList1.filter(
          (m) => m.DeclarationNo === DeclarationNo
        );
        const invoiceList: any[] = [];
        allDataInvoices.forEach((rowInv) => {
          invoiceList.push({
            attestationNo: rowInv.AttestationNo,
            invoiceDate: rowInv.InvoiceDate,
            invAmount: rowInv.InvoiceAmount,
            invoiceNum: rowInv.InvoiceNo,
            invCurrency: rowInv.InvoiceCurrency,
            companyName: rowInv.CompanyName,
            invoiceID: rowInv.InvoiceId,
            remarks1: rowInv.Remarks,
          });
        });
        const dataInvoices =
          allDataInvoices && allDataInvoices.length > 0
            ? allDataInvoices[0]
            : {};
        // rowReq.requestDetails.push
        rowReq.requestDetails = {
          decNo: DeclarationNo,
          decDate: dataInvoices.DeclarationDate,
          tradeLicNo: dataInvoices.TradelicenceNo,
          emailAddr: dataInvoices.EmailAddress,
          contactNo: dataInvoices.ContactNo,
          docType: dataInvoices.DocType,
          exportPortCode: dataInvoices.ExpPortCode,
          exportPortName: dataInvoices.ExpPortName,
          mode: dataInvoices.Mode,
          invoices: invoiceList,
        };
      });
    });
    this.submitLcaDatas(allRequestData);
  }

  submitLcaDatas(allRequestData: any[]) {
    // console.log('allRequestData: ', allRequestData);
    // this.common.showSuccessMessage('Submit data Inprogress');
    let resp;
    const payload = {
      uuid: '111',
      requestjson: allRequestData,
    };
    this.loading = true;
    this.common.showLoading();
    this.apiservice
      .post(this.consts.requestAttestationFromExcelImport, payload)
      .subscribe({
        next: (success: any) => {
          this.common.hideLoading();
          this.loading = false;
          resp = success;
          if (resp.responsecode == 1) {
            this.common.showSuccessMessage(
              this.translate.instant('Item_Created_Successfully')
            );
            this.excelLists = [];
            this.loading = false;
          } else {
            this.common.showErrorMessage(
              this.translate.instant('something went wrong')
            );
            this.loading = false;
          }
        },
      });
  }

  deleteProfile(data: any) {
    // this.apiservice
    //   .post(this.consts.saveRiskProfile, data)
    //   .subscribe((response: any) => {
    //     if (`${response.responsecode}` === "1") {
    //       this.common.showSuccessMessage(
    //         this.translate.instant("label.deleted")
    //       );
    //       // this.onClickFilterOptionCommon();
    //     } else {
    //       this.common.showErrorMessage(this.translate.instant("label.error"));
    //     }
    //   });
  }

  orgChartClick() {
    this.orgCharts = !this.orgCharts;
  }

  closeWorkflow() {
    this.shouldShow = !this.shouldShow;
    this.selectedRows = [];
  }

  exportExcel() {
    const jsonData = {
      LCACode: this.translate.instant('lcadetails.lcadetailList.LCACode'),
      RequestNo: this.translate.instant('lcadetails.lcadetailList.RequestNo'),
      RequestDate: this.translate.instant(
        'lcadetails.lcadetailList.RequestDate'
      ),
      DeclarationNo: this.translate.instant(
        'lcadetails.lcadetailList.DeclarationNo'
      ),
      DeclarationDate: this.translate.instant(
        'lcadetails.lcadetailList.DeclarationDate'
      ),
      TradelicenceNo: this.translate.instant(
        'lcadetails.lcadetailList.TradelicenceNo'
      ),
      ConsigneeName: this.translate.instant(
        'lcadetails.lcadetailList.ConsigneeName'
      ),
      EmailAddress: this.translate.instant(
        'lcadetails.lcadetailList.EmailAddress'
      ),
      ContactNo: this.translate.instant('lcadetails.lcadetailList.ContactNo'),
      DocType: this.translate.instant('lcadetails.lcadetailList.DocType'),
      ExpPortCode: this.translate.instant(
        'lcadetails.lcadetailList.ExpPortCode'
      ),
      ExpPortName: this.translate.instant(
        'lcadetails.lcadetailList.ExpPortName'
      ),
      Mode: this.translate.instant('lcadetails.lcadetailList.Mode'),
      AttestationNo: this.translate.instant(
        'lcadetails.lcadetailList.AttestationNo'
      ),
      InvoiceDate: this.translate.instant(
        'lcadetails.lcadetailList.InvoiceDate'
      ),
      InvoiceAmount: this.translate.instant(
        'lcadetails.lcadetailList.InvoiceAmount'
      ),
      InvoiceNo: this.translate.instant('lcadetails.lcadetailList.InvoiceNo'),
      InvoiceCurrency: this.translate.instant(
        'lcadetails.lcadetailList.InvoiceCurrency'
      ),
      InvoiceId: this.translate.instant('lcadetails.lcadetailList.InvoiceId'),
      CompanyName: this.translate.instant(
        'lcadetails.lcadetailList.CompanyName'
      ),
      Remarks: this.translate.instant('lcadetails.lcadetailList.Remarks'),
    };
    const dataList: any = [];
    this.excelListsFilter.map((item: any) => {
      const dataItem: any = {};
      dataItem[jsonData.LCACode] = item.LCACode;
      dataItem[jsonData.RequestNo] = item.RequestNo;
      dataItem[jsonData.RequestDate] = item.RequestDate;
      dataItem[jsonData.DeclarationNo] = item.DeclarationNo;
      dataItem[jsonData.DeclarationDate] = item.DeclarationDate;
      dataItem[jsonData.TradelicenceNo] = item.TradelicenceNo;
      dataItem[jsonData.ConsigneeName] = item.ConsigneeName;
      dataItem[jsonData.EmailAddress] = item.EmailAddress;
      dataItem[jsonData.ContactNo] = item.ContactNo;
      dataItem[jsonData.DocType] = item.DocType;
      dataItem[jsonData.ExpPortCode] = item.ExpPortCode;
      dataItem[jsonData.ExpPortName] = item.ExpPortName;
      dataItem[jsonData.Mode] = item.Mode;
      dataItem[jsonData.AttestationNo] = item.AttestationNo;
      dataItem[jsonData.InvoiceDate] = item.InvoiceDate;
      dataItem[jsonData.InvoiceAmount] = item.InvoiceAmount;
      dataItem[jsonData.InvoiceNo] = item.InvoiceNo;
      dataItem[jsonData.InvoiceCurrency] = item.InvoiceCurrency;
      dataItem[jsonData.InvoiceId] = item.InvoiceId;
      dataItem[jsonData.CompanyName] = item.CompanyName;
      dataItem[jsonData.Remarks] = item.Remarks;
      dataList.push(dataItem);
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Risk Profile');
    XLSX.writeFile(wb, 'lca-details.xlsx');
  }

  splitdatetime1(date: any) {
    return this.common.splitdatetime1(date);
  }

  splitdatetime(date: any) {
    return this.common.splitdatetime(date);
  }
}
