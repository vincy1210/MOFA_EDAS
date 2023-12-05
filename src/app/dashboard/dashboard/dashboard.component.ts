import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { CommonService } from 'src/service/common.service';
import { ConstantsService } from 'src/service/constants.service';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  isButtonDisabled = false;

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
  selectedFilterOption: any = {
    id: 0,
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
  constructor(private common:CommonService, private consts:ConstantsService, private apicall:ApiService) { }


  //Attestation Requests
  chartOptionattestationrequest: EChartsOption = {
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
    color: ['#b68a35', '#1b1d21' ],
    
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Email',
        type: 'line',
        smooth: true,
        stack: 'Total',
        data: [1200, 1320, 1010, 1340, 900, 2300, 5100]
      },
      {
        name: 'Union Ads',
        type: 'line',
        smooth: true,
        stack: 'Total',
        data: [2200, 1820, 1910, 2340, 2900, 3300, 4100]
      },
    
    ]
    
  
  };


   //Attestation By Status
   chartOptionattestationbystatus: EChartsOption = {
    grid: {
      left: '0%',
      right: '0%',
      bottom: '0%',
      top: '0%',
      //containLabel: true,
      //height: '90%'
  },
    tooltip: {
      trigger: 'item'
    },
    color: ['#000' ,'#e2d0ae', '#a4a5a6', '#b68a35' ],
    
    legend: {
      show: false,
      // top: '5%',
      // left: 'center',
      right: 10,
      top: 30,
      type: 'scroll',
      orient: 'vertical',
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        //center: ["30%", "50%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: [30, 0, 30, 0],
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: false,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
        ]
      }
    ]
    
  
  };


    //Top Agents
    chartOptiontopagents: EChartsOption = {
      xAxis: {
        type: 'category',
        data: ['ABCD', 'ABCD', 'ABCD', 'ABCD', 'ABCD'],
        axisLine: {
          show:false
        },
        axisTick: {
          show:false
        },
      },
      yAxis: {
        type: 'value'
      },
      //color: ['#000' ,'#e2d0ae', '#a4a5a6', '#b68a35' ],
      series: [
        {
          barWidth: '30%', 
          data: [
            {
              value: 120,
              
              itemStyle: {
                color: '#b68a35',
                borderRadius: [6, 6, 0, 0],
                
              }
              
            },
            {
              value: 200,
              itemStyle: {
                color: '#a4a5a6',
                borderRadius: [6, 6, 0, 0],
              }
            },
            {
              value: 150,
              itemStyle: {
                color: '#1b1d21',
                borderRadius: [6, 6, 0, 0],
              }
            },
            {
              value: 80,
              itemStyle: {
                color: '#e9dcc2',
                borderRadius: [6, 6, 0, 0],
              }
            },
            {
              value: 70,
              itemStyle: {
                color: '#5f6164',
                borderRadius: [6, 6, 0, 0],
              }
            }
           
          ],
          type: 'bar'
        }
      ]
      
    
    };

  ngOnInit(): void {

    this.selectedFilterOption.uuid = "11122";
    this.onClickFilterOptionDate("daily");
    this.onClickFilterOptionDate("weekly");
    this.onClickFilterOptionDate("monthly");
  }

  onClickFilterOptionDate(type: "daily" | "weekly" | "monthly") {
    const { Startdate, Enddate } = this.selectedFilterOption;
    this.selectedFilterOption.StartdateStr = this.common.splitdatetime(Startdate)?.date?.toString();
    this.selectedFilterOption.EnddateStr = this.common.splitdatetime(Enddate)?.date?.toString();
    this.onClickFilterOptionDailyMonthlyWeekly(type);
  }

  onClickFilterOptionDailyMonthlyWeekly(
    filterType: "daily" | "weekly" | "monthly"
  ) {
    let payload = {};
    if (filterType === "daily") {
      payload = {
        date: this.common.splitdatetime(this.currentDate)?.date,
        uuid: this.selectedFilterOption.uuid,
      };
    } else if (filterType === "weekly") {
      payload = {
        week: 43,
        year: this.common.splitdatetime(this.currentDate)?.date,
        uuid: this.selectedFilterOption.uuid,
      };
    } else if (filterType === "monthly") {
      payload = {
        Month: this.common.splitdatetime(this.currentDate)?.date,
        year: this.common.splitdatetime(this.currentDate)?.date,
        uuid: this.selectedFilterOption.uuid,
      };
    }
    this.getStatistics(filterType, payload);
  }

  getStatistics(filterType: "daily" | "weekly" | "monthly", data: any) {
    const getLists =
      filterType === "daily"? this.consts.getDailyStatistics: filterType === "weekly"? this.consts.getWeeklyStatistics: this.consts.getMonthlyStatistics;
    this.loading = true;
    this.apicall.post(getLists, data).subscribe((response: any) => {
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

  bindDataToDaily() {
    this.onClickFilterOption("lca", "01");
    this.onClickFilterOption("coo", "01");
    this.onClickFilterOption("physical", "01");
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

}
