import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EChartsOption } from 'echarts';
import { LayoutModel } from 'src/app/shared/models/layout-model';
import { CompanyStatusEnums } from 'src/app/shared/constants/status-enum';
import { FilterTypeCompany } from 'src/app/shared/models/filetype-model';
import { MatSelect } from '@angular/material/select';
import { ApiService } from 'src/service/api.service';
import { CommonService } from 'src/service/common.service';
import {
  ConstantsService,
  ActionConstants,
} from 'src/service/constants.service';
import { ModalPopupService } from 'src/service/modal-popup.service';
import { AuthService } from 'src/service/auth.service';

@Component({
  selector: 'app-attestations',
  templateUrl: './attestations.component.html',
  styleUrls: ['./attestations.component.css'],
})
export class AttestationsComponent extends LayoutModel implements OnInit {
  progress_val: number = 0;
  totalrecords: number = 0;
  statisticsLists: any = {};
  statisticsDailyListsFilter: any[] = [];
  statisticsWeeklyListsFilter: any[] = [];
  statisticsMonthlyListsFilter: any[] = [];
  statisticsData: any = {};
  currentDate: Date = new Date();
  currentDateStr: string = '2023-10-02T00:00:00'; // (new Date()).toDateString();
  routesname: 'pending' | 'approve' = 'pending';
  routesurl: string = '';
  loading: boolean = false;
  selectedFilterOption: FilterTypeCompany = {
    id: CompanyStatusEnums.Approved,
    value: 'Approved',
  };
  totalTile = {
    noofrequestsubmitted: 0,
    noofrequestpending: 0,
    noofrequestcompleted: 0,
    noofrequestinrisk: 0,
  };
  lcaChartOptionattestation: EChartsOption = {};
  // cooChartOptionattestation: EChartsOption = {};
  // physicalChartOptionattestation: EChartsOption = {};
uuid:any;
lcauserprofile:any;
  constructor(
    public override router: Router,
    public override consts: ConstantsService,
    public override apiservice: ApiService,
    public override common: CommonService,
    public override translate: TranslateService,
    private modalPopupService: ModalPopupService,
    private auth: AuthService
  ) {
    super(router, consts, apiservice, common, translate);
    this.progress_val = 0;
    const url = this.router.url;
    this.routesurl = url;
    this.routesname =
      this.routesurl === '/landingpagepending' ? 'pending' : 'approve';
  }

  ngOnInit(): void {
    this.lcauserprofile=this.auth.getLCAuserprofile();
    let data11 = this.common.getUserProfile();
    let uuid;
    if (data11 != null || data11 != undefined) {
      data11 = JSON.parse(data11);
      console.log(data11.Data);
      uuid = data11.Data.uuid;
      this.uuid=uuid;
    } else {
      this.common.setlogoutreason('session');
      console.log("from attestations")

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
    this.selectedFilterOption.Enddate = this.currentDate;
    this.selectedFilterOption.Startdate = new Date(
      this.selectedFilterOption.Enddate
    );
    this.selectedFilterOption.Startdate.setDate(
      this.selectedFilterOption.Startdate.getDate() - 30
    );
    this.selectedFilterOption.uuid = this.uuid;
    this.getThemes1();
    // this.siteAnalyticsData({ action: ActionConstants.load });
  }

  getThemes1() {
    this.onClickFilterOptionDate('daily');
    // this.onClickFilterOptionDate('weekly');
    // this.onClickFilterOptionDate('monthly');
  }

  bindDataToDaily() {
    this.onClickFilterOption('lca', '01');
    // this.onClickFilterOption('coo', '01');
    // this.onClickFilterOption('physical', '01');
  }

  onClickFilterOptionDate(type: 'daily' | 'weekly' | 'monthly') {
    const { Startdate, Enddate } = this.selectedFilterOption;
    this.selectedFilterOption.StartdateStr = this.common
      .splitdatetime(Startdate)
      ?.date?.toString();
    this.selectedFilterOption.EnddateStr = this.common
      .splitdatetime(Enddate)
      ?.date?.toString();
    this.onClickFilterOptionDailyMonthlyWeekly(type);
  }

  onClickFilterOptionDailyMonthlyWeekly(
    filterType: 'daily' | 'weekly' | 'monthly'
  ) {
    let payload = {};
    if (filterType === 'daily') {
      payload = {
        // date: this.common.splitdatetime(this.currentDate)?.date,
        uuid: this.uuid,
        lcauno: this.lcauserprofile.lcauno, // should change based on loggedinuser
      };
    } else if (filterType === 'weekly') {
      payload = {
        // week: 43,
        // year: this.common.splitdatetime(this.currentDate)?.date,
        uuid: this.uuid,
        lcauno: this.lcauserprofile.lcauno, // should change based on loggedinuser
      };
    } else if (filterType === 'monthly') {
      payload = {
        // Month: this.common.splitdatetime(this.currentDate)?.date,
        // year: this.common.splitdatetime(this.currentDate)?.date,
        uuid: this.uuid,
        lcauno: this.lcauserprofile.lcauno, // should change based on loggedinuser
      };
    }
    this.getStatistics(filterType, payload);
  }

  getStatistics(filterType: 'daily' | 'weekly' | 'monthly', data: any) {
    const getLists =
      filterType === 'daily'
        ? this.consts.getLCAStatistics
        : filterType === 'weekly'
        ? this.consts.getLCAStatistics
        : this.consts.getLCAStatistics;
    this.loading = true;
    this.apiservice.post(getLists, data).subscribe((response: any) => {
      this.loading = false;
      const dictionary = this.routesname === 'pending' ? response : response;
      if (`${dictionary.status}` === '200') {
        const dataArray = dictionary.data;
        this.statisticsLists = {
          ...this.statisticsLists,
          [filterType]: dataArray,
        };
        if (filterType === 'daily') {
          this.statisticsDailyListsFilter = this.statisticsLists?.daily;
          this.totalTile.noofrequestinrisk =
            this.statisticsDailyListsFilter.reduce(
              (total: any, item: any) => total + item.noofentityrequest,
              0
            );
          this.totalTile.noofrequestpending =
            this.statisticsDailyListsFilter.reduce(
              (total: any, item: any) => total + item.noofrequestpending,
              0
            );
          this.totalTile.noofrequestsubmitted =
            this.statisticsDailyListsFilter.reduce(
              (total: any, item: any) => total + item.noofrequestsubmitted,
              0
            );
          this.totalTile.noofrequestcompleted =
            this.statisticsDailyListsFilter.reduce(
              (total: any, item: any) => total + item.noofrequestcompleted,
              0
            );
          this.totalTile.noofrequestinrisk =
            this.statisticsDailyListsFilter.reduce(
              (total: any, item: any) => total + item.noofrequestinrisk,
              0
            );
          this.bindDataToDaily();
        } else if (filterType === 'weekly') {
          this.statisticsWeeklyListsFilter = this.statisticsLists?.weekly;
        } else if (filterType === 'monthly') {
          this.statisticsMonthlyListsFilter = this.statisticsLists?.monthly;
        }
      }
    });
  }

  onClickFilterOption(
    type: 'lca' | 'coo' | 'physical',
    dayweekmonth: '01' | '02' | '03'
  ) {
    this.refreshAttestChartAll(type);
    let xAxis: string[] = [];
    let seriesDataRequest: number[] = [];
    let seriesDataCompleted: number[] = [];
    let statisticsListsFilter: any[] = [];
    if (dayweekmonth) {
      if (dayweekmonth === '01') {
        statisticsListsFilter = this.statisticsDailyListsFilter;
        statisticsListsFilter.forEach((row) => {
          xAxis.push(row?.lcaname); // row?.statdate
        });
      } else if (dayweekmonth === '02') {
        statisticsListsFilter = this.statisticsWeeklyListsFilter;
        statisticsListsFilter.forEach((row) => {
          xAxis.push(`${row?.weekno}/${row?.yearuno}`);
        });
      } else if (dayweekmonth === '03') {
        statisticsListsFilter = this.statisticsMonthlyListsFilter;
        statisticsListsFilter.forEach((row) => {
          xAxis.push(`${row?.monthname}`);
        });
      }
    }
    if (type) {
      if (type === 'lca') {
        statisticsListsFilter.forEach((row) => {
          seriesDataRequest.push(row?.noofrequestsubmitted);
          seriesDataCompleted.push(row?.noofrequestcompleted);
        });
      } else if (type === 'coo') {
        statisticsListsFilter.forEach((row) => {
          seriesDataRequest.push(row?.noofcoorequest);
          seriesDataCompleted.push(row?.noofcoorequestapproved);
        });
      } else if (type === 'physical') {
        statisticsListsFilter.forEach((row) => {
          seriesDataRequest.push(row?.noofphysicalrequest);
          seriesDataCompleted.push(row?.noofphysicalrequestcompleted);
        });
      }
    }
    //
    this.refreshAttestationChart(
      type,
      xAxis,
      seriesDataRequest,
      seriesDataCompleted
    );
  }

  refreshAttestChartAll(type: 'lca' | 'coo' | 'physical' | '') {
    const commonObject: EChartsOption = {
      legend: {
        right: '5%',
        show: false,
        orient: 'vertical',
      },
      grid: {
        left: '6%',
        right: '6%',
        bottom: '10%',
        top: '10%',
        //containLabel: true,
        //height: '90%'
      },
      tooltip: {},
      color: ['#1b1d21', '#1b1d21'],
      toolbox: {
        feature: {
          saveAsImage: {
            show: true,
            name: 'Attestation Request',
          },
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Completed',
          type: 'line',
          smooth: true,
          stack: 'Total',
          data: [],
        },
        {
          name: 'Pending',
          type: 'line',
          smooth: true,
          stack: 'Total',
          data: [],
        },
      ],
    };
    if (type === 'lca') {
      this.lcaChartOptionattestation = { ...commonObject };
    } else if (type === 'coo') {
      // this.cooChartOptionattestation = { ...commonObject };
    } else if (type === 'physical') {
      // this.physicalChartOptionattestation = { ...commonObject };
    } else {
      this.lcaChartOptionattestation = { ...commonObject };
      // this.cooChartOptionattestation = { ...commonObject };
      // this.physicalChartOptionattestation = { ...commonObject };
    }
  }

  refreshAttestationChart(
    type: 'lca' | 'coo' | 'physical',
    xAxis: string[],
    seriesDataRequest: number[],
    seriesDataCompleted: number[]
  ) {
    if (type === 'lca') {
      this.lcaChartOptionattestation.xAxis = {
        type: 'category',
        boundaryGap: false,
        data: xAxis,
      };
      this.lcaChartOptionattestation.series = [
        {
          name: 'Completed',
          type: 'line',
          smooth: true,
          stack: 'Total',
          data: seriesDataCompleted,
        },
        {
          name: 'Pending',
          type: 'line',
          smooth: true,
          stack: 'Total',
          data: seriesDataRequest,
        },
      ];

      this.lcaChartOptionattestation.title= {
        show: xAxis.length === 0,
        textStyle: {
            color: "grey",
            fontSize: 20
        },
        text: this.translate.instant("No data"),
        left: "center",
        top: "center"
    }


    } else if (type === 'coo') {
     
    } else if (type === 'physical') {
    
    }
  }

 
}
