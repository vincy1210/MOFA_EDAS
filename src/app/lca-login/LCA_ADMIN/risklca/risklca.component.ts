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
import { AuthService } from 'src/service/auth.service';

@Component({
  selector: 'app-risklca',
  templateUrl: './risklca.component.html',
  styleUrls: ['./risklca.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class RisklcaComponent
  extends LayoutModel
  implements OnInit
{
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
  selectedFilterOption: any = {
    id: 0,
    value: 'All',
  };
  currentDate: Date = new Date();
  responsiveLayout: 'scroll' | 'stack' = 'scroll';
  filterOptions: Array<any> = [];
uuid:any
lcauserprofile:any;
  constructor(
    public override router: Router,
    public override consts: ConstantsService,
    public override apiservice: ApiService,
    public override common: CommonService,
    public override translate: TranslateService,
    private route: ActivatedRoute,
    private modalPopupService: ModalPopupService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService, private auth:AuthService
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
    this.lcauserprofile=this.auth.getLCAuserprofile();
    let data11=this.common.getUserProfile();
    let uuid;
    if(data11!=null || data11!=undefined){
      data11=JSON.parse(data11)
      console.log(data11.Data)
      uuid=data11.Data.uuid;
      this.uuid=uuid;
    }
    else{
       this.common.setlogoutreason("session");
       console.log("from risklca")

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
        header: 'Channel Code',
        errorrs: [],
      },
      {
        field: 'RequestNo',
        header: 'Request No',
        errorrs: [],
      },
      {
        field: 'RequestDate',
        header: 'Request Date',
        errorrs: [],
      },
      {
        field: 'DeclarationNo',
        header: 'Declaration No',
        errorrs: [],
      },
      {
        field: 'DeclarationDate',
        header: 'Declaration Date',
        errorrs: [],
      },
      {
        field: 'TradelicenceNo',
        header: 'Trade Licence No',
        errorrs: [],
      },
      {
        field: 'DocType',
        header: 'Document Type',
        errorrs: [],
      },
      {
        field: 'ExpPortCode',
        header: 'Export Port Code',
        errorrs: [],
      },
      {
        field: 'ExpPortName',
        header: 'Export Port Name',
        errorrs: [],
      },
      {
        field: 'AttestationNo',
        header: 'Attestation No',
        errorrs: [],
      },
      {
        field: 'InvoiceDate',
        header: 'Invoice Date',
        errorrs: [],
      },
      {
        field: 'InvoiceAmount',
        header: 'Invoice Amount',
        errorrs: [],
      },
      {
        field: 'InvoiceNo',
        header: 'Invoice No',
        errorrs: [],
      },
      {
        field: 'InvoiceCurrency',
        header: 'Invoice Currency',
        errorrs: [],
      },
      {
        field: 'InvoiceId',
        header: 'Invoice ID',
        errorrs: [],
      },
      {
        field: 'CompanyName',
        header: 'Company Name',
        errorrs: [],
      },
      {
        field: 'Mode',
        header: 'Mode',
        errorrs: [],
      },
      {
        field: 'ConsigneeName',
        header: 'Consignee Name',
        errorrs: [],
      },
      {
        field: 'EmailAddress',
        header: 'Email Address',
        errorrs: [],
      },
      {
        field: 'ContactNo',
        header: 'Contact No',
        errorrs: [],
      },
      {
        field: 'Remarks',
        header: 'Remarks',
        errorrs: [],
      },
      // {
      //   field: 'Status',
      //   header: 'Status',
      //   errorrs: [],
      // },
      // {
      //   field: 'action',
      //   header: 'actions',
      //   errorrs: [],
      // },
    ];
    //
    this.selectedFilterOption.id = 0;
    this.selectedFilterOption.Enddate = this.currentDate;
    this.selectedFilterOption.Startdate = new Date(
      this.selectedFilterOption.Enddate
    );
    this.selectedFilterOption.Startdate.setDate(
      this.selectedFilterOption.Startdate.getDate() - 30
    );
    // this.onClickFilterOptionDate(false);
    // this.siteAnalyticsData({ action: ActionConstants.load });
    this.getCompanyList();
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
    // this.onClickFilterOptionCommon();
  }

  clickChips() {
    this.enableFilters = !this.enableFilters;
  }

  loadDatas(event: LazyLoadEvent) {
    const startnum = event?.first ? event?.first : 0;
    const rows = event?.rows ? event?.rows : 0;
    this.selectedFilterOption.startnum = startnum;
    this.selectedFilterOption.rows = rows;
    this.selectedFilterOption.uuid = this.uuid;
    // event.globalFilter = "";
    this.globalFilter = event.globalFilter;
    this.sortFilter = {
      sortOrder: event.sortOrder,
      sortField: event.sortField,
    };
    this.filters = event.filters;
    this.onClickFilterOptionCommon();
  }

  onClickFilterOptionCommon() {
    let payload = {
      useruno: this.lcauserprofile.useruno,
      lcauno: this.lcauserprofile.lcauno, // should change based on loggedinuser
      companyuno: this.selectedFilterOption.id,
      startnum: this.selectedFilterOption.startnum,
      limit: this.selectedFilterOption.rows,
      startdate: this.common.formatDateTime_API_payload(this.selectedFilterOption.Startdate),
      enddate: this.common.formatDateTime_API_payload(this.selectedFilterOption.Enddate),
      statusuno:2
    };
    this.getLcaDetailList(payload);
  }

  getLcaDetailList(data: any) {
    this.shouldShow = false;
    const getLists = this.consts.getInRiskReqforlcauser;
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

  getCompanyList() {
    let payload = {
      lcauno: this.lcauserprofile.lcauno,
    };
    this.getListOfValues(payload);
  }

  getListOfValues(data: any) {
    const getLists = this.consts.getCompanyListForLcaUser;
    this.apiservice.post(getLists, data).subscribe({
      next: (response: any) => {
        const dictionary = response;
        if (`${dictionary.responsecode}` === '1') {
          const dataLists: any[] = dictionary.data;
          if (dataLists && dataLists.length > 0) {
            dataLists.map((row) => {
              this.filterOptions.push({
                id: row?.companyuno,
                value: row?.companyname,
              });
            });
          }
        }
      },
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

  orgChartClick() {
    this.orgCharts = !this.orgCharts;
  }

  closeWorkflow() {
    this.shouldShow = !this.shouldShow;
    this.selectedRows = [];
  }

  exportExcel() {
    const jsonData = {
      LCACode: this.translate.instant('LCACode'),
      RequestNo: this.translate.instant('RequestNo'),
      RequestDate: this.translate.instant(
        'RequestDate'
      ),
      DeclarationNo: this.translate.instant(
        'DeclarationNo'
      ),
      DeclarationDate: this.translate.instant(
        'DeclarationDate'
      ),
      TradelicenceNo: this.translate.instant(
        'TradelicenceNo'
      ),
      DocType: this.translate.instant('DocType'),
      ExpPortCode: this.translate.instant(
        'ExpPortCode'
      ),
      ExpPortName: this.translate.instant(
        'ExpPortName'
      ),
      AttestationNo: this.translate.instant(
        'AttestationNo'
      ),
      InvoiceDate: this.translate.instant(
        'InvoiceDate'
      ),
      InvoiceAmount: this.translate.instant(
        'InvoiceAmount'
      ),
      InvoiceNo: this.translate.instant('InvoiceNo'),
      InvoiceCurrency: this.translate.instant(
        'InvoiceCurrency'
      ),
      InvoiceId: this.translate.instant('InvoiceId'),
      CompanyName: this.translate.instant(
        'CompanyName'
      ),
      Mode: this.translate.instant('Mode'),
      ConsigneeName: this.translate.instant(
        'ConsigneeName'
      ),
      EmailAddress: this.translate.instant(
        'EmailAddress'
      ),
      ContactNo: this.translate.instant('ContactNo'),
      Remarks: this.translate.instant('Remarks'),
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
      dataItem[jsonData.DocType] = item.DocType;
      dataItem[jsonData.ExpPortCode] = item.ExpPortCode;
      dataItem[jsonData.ExpPortName] = item.ExpPortName;
      dataItem[jsonData.AttestationNo] = item.AttestationNo;
      dataItem[jsonData.InvoiceDate] = item.InvoiceDate;
      dataItem[jsonData.InvoiceAmount] = item.InvoiceAmount;
      dataItem[jsonData.InvoiceNo] = item.InvoiceNo;
      dataItem[jsonData.InvoiceCurrency] = item.InvoiceCurrency;
      dataItem[jsonData.InvoiceId] = item.InvoiceId;
      dataItem[jsonData.CompanyName] = item.CompanyName;
      dataItem[jsonData.Mode] = item.Mode;
      dataItem[jsonData.ConsigneeName] = item.ConsigneeName;
      dataItem[jsonData.EmailAddress] = item.EmailAddress;
      dataItem[jsonData.ContactNo] = item.ContactNo;
      dataItem[jsonData.Remarks] = item.Remarks;
      dataList.push(dataItem);
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Risk Profile');
    XLSX.writeFile(wb,  this.common.givefilename('lca-details')+'.xlsx');
  }

  // splitdatetime1(date: any) {
  //   return this.common.splitdatetime(date);
  // }

  splitdatetime(date: any) {
    return this.common.splitdatetime(date);
  }
}
