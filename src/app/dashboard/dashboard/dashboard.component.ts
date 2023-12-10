import { Component, OnInit, ViewChild } from "@angular/core";
import { CommonService } from "src/service/common.service";
import { NavigationEnd, NavigationStart, Router } from "@angular/router";
import { ConstantsService, ActionConstants } from "src/service/constants.service";

// import {
//   ActionConstants,
//   ConstantsService,
// } from "src/app/services/constants.service";
import { ApiService } from "src/service/api.service";
// import { ModalPopupService } from "src/app/services/modal-popup.service";
import { TranslateService } from "@ngx-translate/core";
import { EChartsOption } from "echarts";
import { LayoutModel } from "src/app/shared/models/layout-model";
import { CompanyStatusEnums } from "src/app/shared/constants/status-enum";
import { FilterTypeCompany } from "src/app/shared/models/filetype-model";
import { MatSelect } from "@angular/material/select";
import { DatePipe } from "@angular/common";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends LayoutModel implements OnInit {
  progress_val: number = 0;
  totalrecords: number = 0;
  statisticsLists: any = {};
  statisticsDailyListsFilter: any[] = [];
  statisticsWeeklyListsFilter: any[] = [];
  statisticsMonthlyListsFilter: any[] = [];
  statisticsData: any = {};
  currentDate: Date = new Date();
  currentDateStr: string = "2023-10-02T00:00:00"; // (new Date()).toDateString();
  routesname: "pending" | "approve" = "pending";
  routesurl: string = "";
  loading: boolean = false;
  selectedFilterOption: FilterTypeCompany = {
    id: CompanyStatusEnums.Approved,
    value: "Approved",
  };
  totalTile = {
    noofentity: 0,
    noofcompanyregn: 0,
    noofcompanyregnrequestapproved: 0,
    noofcompletedattestation: 0,
    noofrequests: 0,
    nooflcarequestapproved: 0,
    noofcoorequestapproved: 0,
  };
  lcaChartOptionattestation: EChartsOption = {};
  cooChartOptionattestation: EChartsOption = {};
  physicalChartOptionattestation: EChartsOption = {};

  constructor(
    public override router: Router,
    public override consts: ConstantsService,
    public override apiservice: ApiService,
    public override common: CommonService,
    public override translate: TranslateService, public datePipe:DatePipe
    
  ) {
    super(router, consts, apiservice, common, translate);
    this.progress_val = 0;
    const url = this.router.url;
    this.routesurl = url;
    this.routesname =
      this.routesurl === "/landingpagepending" ? "pending" : "approve";
    // if (this.routesname === "pending" || this.routesname === "approve") {
    //   this.checkPermissionAllPage("landingpage");
    // }
  }

  ngOnInit(): void {
    if (this.routesname === "pending") {
      this.selectedFilterOption = {
        id: 1,
        value: "Pending",
      };
    } else if (this.routesname === "approve") {
      this.selectedFilterOption = {
        id: 2,
        value: "Approved",
      };
    }
    this.selectedFilterOption.Enddate = this.currentDate;
    this.selectedFilterOption.Startdate = new Date(
      this.selectedFilterOption.Enddate
    );
    this.selectedFilterOption.Startdate.setDate(
      this.selectedFilterOption.Startdate.getDate() - 30
    );
    this.selectedFilterOption.uuid = "11122";
    this.onClickFilterOptionDate("daily");
    this.onClickFilterOptionDate("weekly");
    this.onClickFilterOptionDate("monthly");
    this.siteAnalyticsData({ action: ActionConstants.load });
  }

  bindDataToDaily() {
    this.onClickFilterOption("lca", "01");
    this.onClickFilterOption("coo", "01");
    this.onClickFilterOption("physical", "01");
  }

  onClickFilterOptionDate(type: "daily" | "weekly" | "monthly") {
    const { Startdate, Enddate } = this.selectedFilterOption;
    this.selectedFilterOption.StartdateStr = this.splitdatetime(Startdate, "dd-MMM-yyyy")
      ?.date?.toString();  //, "dd-MMM-yyyy"
    this.selectedFilterOption.EnddateStr = this.splitdatetime(Enddate, "dd-MMM-yyyy")
      ?.date?.toString();  //, "dd-MMM-yyyy"
    this.onClickFilterOptionDailyMonthlyWeekly(type);
  }

  onClickFilterOptionDailyMonthlyWeekly(
    filterType: "daily" | "weekly" | "monthly"
  ) {
    let payload = {};
    if (filterType === "daily") {
      payload = {
        date: this.splitdatetime(this.currentDate)?.date,
        uuid: this.selectedFilterOption.uuid,
      };
    } else if (filterType === "weekly") {
      payload = {
        week: 43,
        year: this.splitdatetime(this.currentDate, "yyyy")?.date,  //, "yyyy"
        uuid: this.selectedFilterOption.uuid,
      };
    } else if (filterType === "monthly") {
      payload = {
        Month: this.splitdatetime(this.currentDate, "MMM-yyyy")?.date,   //, "MMM-yyyy"
        year: this.splitdatetime(this.currentDate, "yyyy")?.date,   //, "yyyy"
        uuid: this.selectedFilterOption.uuid,
      };
    }
    this.getStatistics(filterType, payload);
  }

  getStatistics(filterType: "daily" | "weekly" | "monthly", data: any) {
    const getLists =
      filterType === "daily"
        ? this.consts.getDailyStatistics
        : filterType === "weekly"
        ? this.consts.getWeeklyStatistics
        : this.consts.getMonthlyStatistics;
    this.loading = true;
    this.apiservice.post(getLists, data).subscribe((response: any) => {
      this.loading = false;
      const dictionary = this.routesname === "pending" ? response : response;
      if (`${dictionary.responsecode}` === "1") {
        const dataArray = dictionary.data;
        this.statisticsLists = {
          ...this.statisticsLists,
          [filterType]: dataArray,
        };
        if (filterType === "daily") {
          this.statisticsDailyListsFilter = this.statisticsLists?.daily;
          this.totalTile.noofentity = this.statisticsDailyListsFilter.reduce(
            (total: any, item: any) => total + item.noofentityrequest,
            0
          );
          this.totalTile.noofcompanyregn =
            this.statisticsDailyListsFilter.reduce(
              (total: any, item: any) => total + item.noofcompanyregnrequest,
              0
            );
          this.totalTile.noofcompanyregnrequestapproved =
            this.statisticsDailyListsFilter.reduce(
              (total: any, item: any) =>
                total + item.noofcompanyregnrequestapproved,
              0
            );
          this.totalTile.noofcompletedattestation =
            this.statisticsDailyListsFilter.reduce(
              (total: any, item: any) =>
                total +
                item.nooflcarequestcompleted +
                item.noofentityrequestcompleted +
                item.noofphysicalrequestcompleted,
              0
            );
          this.totalTile.noofrequests = this.statisticsDailyListsFilter.reduce(
            (total: any, item: any) =>
              total +
              item.nooflcarequest +
              item.noofentityrequest +
              item.noofphysicalrequest +
              item.noofcoorequest +
              item.noofcompanyregnrequest +
              item.noofuserrequest,
            0
          );
          this.totalTile.nooflcarequestapproved =
            this.statisticsDailyListsFilter.reduce(
              (total: any, item: any) => total + item.nooflcarequestapproved,
              0
            );
          this.totalTile.noofcoorequestapproved =
            this.statisticsDailyListsFilter.reduce(
              (total: any, item: any) => total + item.noofcoorequestapproved,
              0
            );
          this.bindDataToDaily();
        } else if (filterType === "weekly") {
          this.statisticsWeeklyListsFilter = this.statisticsLists?.weekly;
        } else if (filterType === "monthly") {
          this.statisticsMonthlyListsFilter = this.statisticsLists?.monthly;
        }
      }
    });
  }

  onClickFilterOption(
    type: "lca" | "coo" | "physical",
    dayweekmonth: "01" | "02" | "03"
  ) {
    this.refreshAttestChartAll(type);
    let xAxis: string[] = [];
    let seriesDataRequest: number[] = [];
    let seriesDataCompleted: number[] = [];
    let statisticsListsFilter: any[] = [];
    if (dayweekmonth) {
      if (dayweekmonth === "01") {
        statisticsListsFilter = this.statisticsDailyListsFilter;
        statisticsListsFilter.forEach((row) => {
          xAxis.push(row?.statdate);
        });
      } else if (dayweekmonth === "02") {
        statisticsListsFilter = this.statisticsWeeklyListsFilter;
        statisticsListsFilter.forEach((row) => {
          xAxis.push(`${row?.weekno}/${row?.yearuno}`);
        });
      } else if (dayweekmonth === "03") {
        statisticsListsFilter = this.statisticsMonthlyListsFilter;
        statisticsListsFilter.forEach((row) => {
          xAxis.push(`${row?.monthname}`);
        });
      }
    }
    if (type) {
      if (type === "lca") {
        statisticsListsFilter.forEach((row) => {
          seriesDataRequest.push(row?.nooflcarequest);
          seriesDataCompleted.push(row?.nooflcarequestcompleted);
        });
      } else if (type === "coo") {
        statisticsListsFilter.forEach((row) => {
          seriesDataRequest.push(row?.noofcoorequest);
          seriesDataCompleted.push(row?.noofcoorequestapproved);
        });
      } else if (type === "physical") {
        statisticsListsFilter.forEach((row) => {
          seriesDataRequest.push(row?.noofphysicalrequest);
          seriesDataCompleted.push(row?.noofphysicalrequestcompleted);
        });
      }
    }
    //
    // console.log("seriesDataRequest: ", seriesDataRequest);
    // console.log("seriesDataCompleted: ", seriesDataCompleted);
    this.refreshAttestationChart(
      type,
      xAxis,
      seriesDataRequest,
      seriesDataCompleted
    );
  }

  refreshAttestChartAll(type: "lca" | "coo" | "physical" | "") {
    const commonObject: EChartsOption = {
      legend: {
        right: "5%",
        show: false,
        orient: "vertical",
      },
      grid: {
        left: "6%",
        right: "6%",
        bottom: "10%",
        top: "10%",
        //containLabel: true,
        //height: '90%'
      },
      tooltip: {},
      color: ["#b68a35", "#1b1d21"],
      toolbox: {
        feature: {
          saveAsImage: {
            show: true,
            name: "Attestation Request",
          },
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: [],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Requests completed",
          type: "line",
          smooth: true,
          stack: "Total",
          data: [],
        },
        {
          name: "Number of requests",
          type: "line",
          smooth: true,
          stack: "Total",
          data: [],
        },
      ],
    };
    if (type === "lca") {
      this.lcaChartOptionattestation = { ...commonObject };
    } else if (type === "coo") {
      this.cooChartOptionattestation = { ...commonObject };
    } else if (type === "physical") {
      this.physicalChartOptionattestation = { ...commonObject };
    } else {
      this.lcaChartOptionattestation = { ...commonObject };
      this.cooChartOptionattestation = { ...commonObject };
      this.physicalChartOptionattestation = { ...commonObject };
    }
  }

  refreshAttestationChart(
    type: "lca" | "coo" | "physical",
    xAxis: string[],
    seriesDataRequest: number[],
    seriesDataCompleted: number[]
  ) {
    if (type === "lca") {
      this.lcaChartOptionattestation.xAxis = {
        type: "category",
        boundaryGap: false,
        data: xAxis,
      };
      this.lcaChartOptionattestation.series = [
        {
          name: "Requests completed",
          type: "line",
          smooth: true,
          stack: "Total",
          data: seriesDataCompleted,
        },
        {
          name: "Number of requests",
          type: "line",
          smooth: true,
          stack: "Total",
          data: seriesDataRequest,
        },
      ];
    } else if (type === "coo") {
      this.cooChartOptionattestation.xAxis = {
        type: "category",
        boundaryGap: false,
        data: xAxis,
      };
      this.cooChartOptionattestation.series = [
        {
          name: "Requests completed",
          type: "line",
          smooth: true,
          stack: "Total",
          data: seriesDataCompleted,
        },
        {
          name: "Number of requests",
          type: "line",
          smooth: true,
          stack: "Total",
          data: seriesDataRequest,
        },
      ];
    } else if (type === "physical") {
      this.physicalChartOptionattestation.xAxis = {
        type: "category",
        boundaryGap: false,
        data: xAxis,
      };
      this.physicalChartOptionattestation.series = [
        {
          name: "Requests completed",
          type: "line",
          smooth: true,
          stack: "Total",
          data: seriesDataCompleted,
        },
        {
          name: "Number of requests",
          type: "line",
          smooth: true,
          stack: "Total",
          data: seriesDataRequest,
        },
      ];
    }
  }

  // splitdatetime1(date: any) {
  //   return this.common.splitdatetime1(date);
  // }

  splitdatetime(datetimeString: any, dateFormat: string = "dd-MMM-yyyy") {
    if (datetimeString) {
      if (typeof datetimeString === "string") {
        const dateTimeParts = datetimeString.split("T");
        let date = dateTimeParts.length >= 1 ? dateTimeParts[0] : "";
        let time = dateTimeParts.length >= 2 ? dateTimeParts[1] : "";
        if (!date || (date && new Date(date) <= new Date("1900-01-01"))) {
          date = "";
        }
        if (!time || time == "00:00:00") {
          time = "";
        }
        return {
          date: this.datePipe.transform(date, dateFormat),
          time: time,
        };
      } else if (typeof datetimeString === "object") {
        return {
          date: this.datePipe.transform(datetimeString, dateFormat),
        };
      }
    }
    return null; // Invalid or null datetime string
  }
 
  splitdatetime1(
    datetimeString: any,
    dateFormat: string = "dd-MMM-yyyy",
    yearfirst = true
  ) {
    if (datetimeString && typeof datetimeString === "string") {
      const dateTimeParts = datetimeString;
      if (dateTimeParts.length === 8 || dateTimeParts.length === 11) {
        let parsedDate = null;
        if (yearfirst) {
          parsedDate = new Date(
            Number(dateTimeParts.substr(0, 4)),
            Number(dateTimeParts.substr(4, 2)) - 1,
            Number(dateTimeParts.substr(6, 2))
          );
        } else {
          parsedDate = new Date(
            Number(dateTimeParts.substr(4, 4)),
            Number(dateTimeParts.substr(2, 2)) - 1,
            Number(dateTimeParts.substr(0, 2))
          );
        }
        return {
          date: this.datePipe.transform(parsedDate, dateFormat),
        };
      }
    }
    return null; // Invalid or null datetime string
  }
 
  splitdatetime2(datetimeString: string) {
    let formattedDate: string = "";
    const monthMap = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };
    if (datetimeString && typeof datetimeString === "string") {
      let dateTimeParts: string = datetimeString;
      while (dateTimeParts.length < 11) {
        dateTimeParts = "0" + dateTimeParts;
      }
      if (dateTimeParts.length === 11) {
        const parts = dateTimeParts.split("-");
        const day = parts[0];
        const month = monthMap[parts[1] as keyof typeof monthMap];
        const year = parts[2];
 
        const dateObj = new Date(`${year}-${month}-${day}`);
        formattedDate = dateObj.toISOString().split("T")[0];
      }
    }
    return formattedDate;
  }
}
