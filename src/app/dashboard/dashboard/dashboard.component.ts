import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  isButtonDisabled = false;
  constructor() { }


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
  }

}
