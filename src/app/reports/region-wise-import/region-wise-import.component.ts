import { Component, OnInit } from "@angular/core";
import { GoogleChartInterface, GoogleChartType } from "ng2-google-charts";
import { ApiService } from "src/service/api.service";
import { CommonService } from "src/service/common.service";
import { AuthService } from "src/service/auth.service";
import { ConstantsService, ActionConstants } from "src/service/constants.service";
import { LayoutModel } from "src/app/shared/models/layout-model";
import { FilterTypeAttestation, SortFilterType } from "src/app/shared/models/filetype-model";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { LazyLoadEvent } from "primeng/api";
import { FormControl } from "@angular/forms";
import * as moment from "moment";
import { MatDatepicker } from "@angular/material/datepicker";
import { HttpClient } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
import * as echarts from "echarts";



@Component({
  selector: 'app-region-wise-import',
  templateUrl: './region-wise-import.component.html',
  styleUrls: ['./region-wise-import.component.css'],
})
export class RegionWiseImportComponent extends LayoutModel implements OnInit {
  progress_val: number = 0;
  selectedRows: any[] = [];
  totalrecords: number = 0;
  importDataList: any[] = [];
  importDataListFilter: any[] = [];
  globalFilter: string = "";
  sortFilter: SortFilterType = {} as SortFilterType;
  filters: any = {};
  cols: any;
  loading: boolean = false;
  // for workflow
  public shouldShow = false;
  totalFineAmount: any;
  totalAttestationFee: any;
  totalFee: any;
  fileContentEncode: any;
  routesname: "region" | "embassy" = "region";
  routesurl: string = "";
  filterOptions: Array<FilterTypeAttestation> = [
    { id: 6, value: "Approved" },
    { id: 7, value: "Returned" },
  ];
  Quarter: string = "1";
  currentYear = new Date().getFullYear();
  year: number = this.currentYear;
  // date = new FormControl(moment(`01-Jan-${this.currentYear}`, "DD-MMM-YYYY"));
  date = new FormControl(moment());
  selectedFilterOption: any = {} as any;
  currentDate: Date = new Date();
  responsiveLayout: "scroll" | "stack" = "stack";
  companyLists: any[] = [];
  companyListsFilter: any[] = [];
  chartOptionUae: any;
  public map_ChartOptions = {};
  geoChart: GoogleChartInterface = {
    chartType: "GeoChart",
    
    
    dataTable: [["Country", "Counts"]],
    options: {
      title: "Counts",
      // colorAxis: {
      //   colors: [this.classRootColor],  //change
      // },
    },
  };
uuid:string='';
selectedStatus: string = "1";
currentcompany:string='0';
oneMonthAgo = new Date();
todayModel: Date = new Date();
today: Date = new Date();
  constructor(
    public override router: Router,
    public override consts: ConstantsService,
    public override apiservice: ApiService,
    public override common: CommonService,
    public override translate: TranslateService,
    private http: HttpClient, private auth: AuthService
  ) {

    
    super(router, consts, apiservice, common, translate);
    this.oneMonthAgo.setMonth(this.oneMonthAgo.getMonth() - 1);
    console.log("calling getselected company")
    let currcompany=this.auth.getSelectedCompany();
    if(currcompany){
      this.currentcompany=currcompany.companyuno || '';
      if(this.currentcompany==null || this.currentcompany==undefined || this.currentcompany===''){
        this.router.navigateByUrl('/landingpage')
      }
    }
    else{
      this.common.redirecttologin();
      return;
    }
     
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
       console.log("from region")

      this.auth.logout();
    }
  }

  ngOnInit(): void {
    this.progress_val = 0;
  
  
    this.onClickFilterOptionDate(false);
    // this.siteAnalyticsData({ action: ActionConstants.load });

    let rowList: any[] = [["Country", "Counts"]];
    this.refreshGeoChart(rowList);
  }

  refreshGeoChart(dataArr: any): void {
    this.geoChart.dataTable = dataArr;
    this.geoChart.component?.draw();
  }

  onClickFilterOption(
    option: { companyuno: number; nameofbusiness: string },
    values: "companyname"
  ) {
    if (values === "companyname") {
      this.selectedFilterOption.companyid = option.companyuno;
      this.selectedFilterOption.companyvalue = option.nameofbusiness;
    }
    this.getImportReports();
  }


 
  onClickFilterOptionDate(fromHtml: boolean) {
    this.selectedFilterOption.uuid = this.uuid;
    const { Startdate, Enddate } = this.selectedFilterOption;
    this.selectedFilterOption.StartdateStr = this.common
      .splitdatetime(Startdate)
      ?.date?.toString();
    this.selectedFilterOption.EnddateStr = this.common
      .splitdatetime(Enddate)   //, "dd-MMM-yyyy"
      ?.date?.toString();
    // if (fromHtml) {
    this.getImportReports();
    // }
  }

 
 
  getImportReports() {
    let payload1 = {};
    payload1 = {
      uuid: this.selectedFilterOption.uuid,
      companyuno: this.currentcompany,
      Startdate: this.common.formatDateTime_API_payload(this.oneMonthAgo.toDateString()),
      Enddate: this.common.formatDateTime_API_payload(this.todayModel.toDateString()),
    };
    
    this.shouldShow = false;
    const getLists = this.consts.getImportReportForLCA;
    this.loading = true;
    this.common.showLoading();
    this.apiservice.post(getLists, payload1).subscribe((response: any) => {
      this.loading = false;
      this.common.hideLoading();
      const dictionary = response;
      if (`${dictionary.status}` === "200") {
        const dataArray: any[] = dictionary.data;
        this.importDataList = dataArray;
        this.importDataListFilter = this.importDataList;
        this.totalrecords = dictionary?.recordcount
          ? dictionary?.recordcount
          : 0;
        // this.globalFilterApply();
        if (this.importDataListFilter) {
          const rowList: any[] = [["Country", "Counts"]];
          this.importDataListFilter.forEach((item) => {
            const requestcount1 = this.importDataListFilter
              .filter((m) => m.loadingportcountry === item.loadingportcountry)
              .reduce((total, current) => total + current.requestcount, 0);
            rowList.push([item?.loadingportcountry, requestcount1]);
          });
          // rowList.push(["In", "300"]);
          this.refreshGeoChart(rowList);
        }
      }
    });
  }

 



  loadChart() {
    this.chartOptionUae = {
      title: {
        text: "UAE Cities Imported Density",
        subtext: "Imported density data source",
        sublink: "https://yourpopulationdatasource.com",
      },
      tooltip: {
        trigger: "item",
        formatter: "{b}<br/>{c} (p / km2)",
      },
      toolbox: {
        show: true,
        orient: "vertical",
        left: "right",
        top: "center",
        feature: {
          dataView: { readOnly: false },
          restore: {},
          saveAsImage: {},
        },
      },
      visualMap: {
        min: 800,
        max: 50000,
        text: ["High", "Low"],
        realtime: false,
        calculable: true,
        inRange: {
          color: ["lightskyblue", "yellow", "orangered"],
        },
      },
      series: [
        {
          name: "UAE Cities Imported Density",
          type: "map",
          mapType: "UAE", // Use 'UAE' as the map type
          label: {
            show: true,
          },
          data: [
            { name: "Abu Dhabi", value: 20057.34 },
            { name: "Dubai", value: 15477.48 },
            { name: "Sharjah", value: 31686.1 },
            { name: "Ajman", value: 6992.6 },
            { name: "Fujairah", value: 44045.49 },
            { name: "Ras Al Khaimah", value: 40689.64 },
            { name: "Umm Al-Quwain", value: 37659.78 },
          ],
        },
      ],
    };
  }



  // splitdatetime1(date: any, dateformat: string, yearfirst: boolean) {
  //   return this.common.splitdatetime1(date, dateformat, yearfirst);
  // }

  splitdatetime(date: any) {
    return this.common.splitdatetime(date);
  }

  handleDateChange(event: any, dateType: string): void {
    const momentObject = event.value || moment();
    let date=new Date(momentObject.toDate())
console.log(date)
console.log(date.toISOString())

   if (dateType === 'from') {
     this.oneMonthAgo = date ;
     console.log("in from")
      localStorage.setItem('fromDate', date.toISOString());
    } 
    else if (dateType === 'to') {
      this.todayModel =date;
     console.log("in to")

      localStorage.setItem('toDate', date.toISOString());
    }

    console.log(this.oneMonthAgo)
    console.log(this.todayModel)


    this.getImportReports();


  }

}