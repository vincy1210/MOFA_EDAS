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

  uuid:any;

  isButtonDisabled = false;

  statisticsLists: any = {};
  statisticsDailyListsFilter: any[] = [];
  statisticsWeeklyListsFilter: any[] = [];
  statisticsMonthlyListsFilter: any[] = [];

  totalTile = {
    noofpendingrequests:0,
    noofcompletedrequests:0
  };

  xAxisDataValues: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  lcaChartOptionattestation: EChartsOption = {};
  cooChartOptionattestation: EChartsOption = {};
  physicalChartOptionattestation: EChartsOption = {};


  constructor(private consts: ConstantsService ,private apicall: ApiService, private common: CommonService) { }


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
      data: this.xAxisDataValues
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Completed',
        type: 'line',
        smooth: true,
        stack: 'Total',
        data: [1200, 1320, 1010, 1340, 900, 2300, 5100]
      },
      {
        name: 'Pending',
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

    
    let data11=this.common.getUserProfile();
    let uuid;
    if(data11!=null || data11!=undefined){
      data11=JSON.parse(data11)
      console.log(data11.Data)
      uuid=data11.Data.uuid;
      this.uuid=uuid;

    }
    else{
      console.log("Invalid Session")
      // this.common.logoutUser()
    }
  }

  onAttestationRequestDropdownChange(event: any, type:any): void {
    // You can show an alert or perform any other action here

    this.refreshAttestChartAll(type)
    this.common.showSuccessMessage(event);
    let xAxis: string[] = [];
    let seriesDataRequest: number[] = [];
    let seriesDataCompleted: number[] = [];
    let statisticsListsFilter: any[] = [];

    let data;
    if(event=="01")
    {
      data={
        "date":"23-OCT-23",
        "uuid":this.uuid
      }
    }
    else if(event=="02")
    {
      this.xAxisDataValues=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
        data={"week":"43",
        "year":"2023",
        "uuid":this.uuid}
      
    }
    else
    {
      data={
        "Month":"Oct-2023",
        "year":"2023",    
        "uuid":this.uuid
        }
    }
    const getLists = event === "01"
        ? this.consts.getDailyStatistics
        : event === "02"
        ? this.consts.getWeeklyStatistics
        : this.consts.getMonthlyStatistics;

        this.apicall.post(getLists, data).subscribe((response: any) => {

          if (response.responsecode == 1) {

            let dataarray=response.data;

            console.log(dataarray);

            if (type === "LCA") {
              this.statisticsDailyListsFilter = dataarray;
              this.totalTile.noofpendingrequests = this.statisticsDailyListsFilter?.reduce(
                (total: any, item: any) => total + item.nooflcarequest,
                0
              );

              this.totalTile.noofcompletedrequests = this.statisticsDailyListsFilter?.reduce(
                (total: any, item: any) => total + item.nooflcarequestcompleted,
                0
              );
            }
            else if (type === "COO") {
              this.statisticsDailyListsFilter = dataarray;
              this.totalTile.noofpendingrequests = this.statisticsDailyListsFilter?.reduce(
                (total: any, item: any) => total + item.noofcoorequest,
                0
              );

              this.totalTile.noofcompletedrequests = this.statisticsDailyListsFilter?.reduce(
                (total: any, item: any) => total + item.nooflcarequestcompleted,
                0
              );
            }
            else{  //Physical
              this.statisticsDailyListsFilter = dataarray;
              this.totalTile.noofpendingrequests = this.statisticsDailyListsFilter?.reduce(
                (total: any, item: any) => total + item.nooflcarequest,
                0
              );

              this.totalTile.noofcompletedrequests = this.statisticsDailyListsFilter?.reduce(
                (total: any, item: any) => total + item.nooflcarequestcompleted,
                0
              );
            }


          }});

  }

  refreshAttestChartAll(type:any) {
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
    if (type === "01") {
      this.lcaChartOptionattestation = { ...commonObject };
    } else if (type === "02") {
      this.cooChartOptionattestation = { ...commonObject };
    } else if (type === "03") {
      this.physicalChartOptionattestation = { ...commonObject };
    } else {
      this.lcaChartOptionattestation = { ...commonObject };
      this.cooChartOptionattestation = { ...commonObject };
      this.physicalChartOptionattestation = { ...commonObject };
    }
  }

}
