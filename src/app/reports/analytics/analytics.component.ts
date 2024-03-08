import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/service/common.service';
import { Router } from '@angular/router';
import { ConstantsService } from 'src/service/constants.service';
import { ApiService } from 'src/service/api.service';
import { EChartsOption } from 'echarts';
import { AuthService } from 'src/service/auth.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  isLoading: boolean = false;
  charts: { [key: string]: EChartsOption } = {};
  oneMonthAgo = new Date();
  todayModel: Date = new Date();
  today: Date = new Date();
  uuid: string = '';
  currentcompany: any;
  allSeriesDataValues: { [key: string]: number } = {};
  constructor(
    private translate:TranslateService,
    private common: CommonService,
    private router: Router,
    private auth: AuthService,
    private consts: ConstantsService,
    private apicall: ApiService
  ) {
    let data11 = this.common.getUserProfile();

    console.log(data11)
    if(data11)
    {
      data11=JSON.parse(data11);
      console.log(data11)
      let uuid = data11.Data.uuid;
      this.uuid = uuid || '';
      console.log(this.uuid)
    }   

    let currcompany = this.auth.getSelectedCompany();
    if (!currcompany || !currcompany.companyuno) {
      console.log('to landing page from attestation page line 195');
      this.router.navigateByUrl('/landingpage');
      return;
    }
    this.currentcompany = currcompany.companyuno;
    this.oneMonthAgo.setMonth(this.oneMonthAgo.getMonth() - 1);
    let onemonthagaodate=this.oneMonthAgo
    

    //setting from and to date start---

    const storedFromDate = localStorage.getItem('fromDate');
    const storedToDate = localStorage.getItem('toDate');

    console.log(storedFromDate)
    console.log(storedToDate)


    this.oneMonthAgo = storedFromDate ? new Date(storedFromDate) as Date : onemonthagaodate;
    this.todayModel = storedToDate ? new Date(storedToDate) as Date :  new Date();
 

    //end
  }

  ngOnInit(): void {
    this.apicallfunc('lca');
    this.apicallfunc('coo');
    this.apicallfunc('physical');
    // this.apicallfunc('all');  

  }

  statuschartload(legendData: string[], seriesData: { value: number; name: string }[], chartType: string) {
    console.log(seriesData.length)
    const commonObject: EChartsOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        show: false,
        orient: 'vertical',
        left: 10,
        data: legendData
      },
      grid: {
        top: '0',
        left: '0',
        right: '0',
        bottom:'0'
      },
      title: {
        show: seriesData.length === 0,
        textStyle: {
            color: "grey",
            fontSize: 20
        },
        text: this.translate.instant("No data"),
        left: "center",
        top: "center"
    },

      //[7:51 PM] Regis (Guest)
color: ['#e43b74', '#606060', '#5aaf76', '#543600', '#912211'],
      series: [
        {
          name: chartType.toUpperCase(),
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '30',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: seriesData
        }
      ]
    };

    this.charts[chartType] = { ...commonObject };
  }

  apicallfunc(processname: any) {
    let legendData: string[];

    if (processname === 'lca') {
      legendData = ['Draft',  'In Risk', 'Completed'];
    } else if (processname === 'coo' || processname === 'physical') {
      legendData = ['Pending', 'In Review', 'Completed'];
    }
    // } else if (processname === 'all') {
    let  legendDataall = ['LCA', 'COO', 'PHYSICAL'];
    // }

    let data = {
      uuid: this.uuid,
      companyuno: this.currentcompany,
      processname: processname.toUpperCase(),
      startdate:  this.common.formatDateTime_API_payload(this.oneMonthAgo.toDateString()),
      enddate: this.common.formatDateTime_API_payload(this.todayModel.toDateString())
    };

    // Inside the apicallfunc method
this.common.showLoading();
this.apicall.post(this.consts.getAttestStatisticsForCustomer, data).subscribe((response: any) => {
  this.common.hideLoading();
  console.log(response);

  const processName = processname.toLowerCase(); // Convert processname to lowercase for consistent handling

  // Extracting the noofrequestsubmitted based on the process name
  const noofrequestsubmitted = response.data[0]?.noofrequestsubmitted || 0;

  // Creating series data for 'all' case
  // const seriesDataAll = [{ value: noofrequestsubmitted, name: processName.toUpperCase() }];
  this.allSeriesDataValues[processName] = noofrequestsubmitted;

  // Creating series data for 'all' case
const seriesDataAll = Object.keys(this.allSeriesDataValues)
.filter(key => this.allSeriesDataValues[key] !== undefined) // Filter out items with undefined values
.map(key => ({
    value: this.allSeriesDataValues[key],
    name: key.toUpperCase()
}));

// Creating series data for specific cases
let seriesDataSpecific: any[];
switch (processName) {
case 'lca':
    seriesDataSpecific = [
        { value: response.data[0]?.noofrequestpending, name: 'Draft' },
        { value: response.data[0]?.noofrequestinrisk, name: 'In Risk' },
        { value: response.data[0]?.noofrequestcompleted, name: 'Completed' }
    ].filter(item => item.value !== undefined); // Filter out items with undefined values
    break;
case 'coo':
case 'physical':
    seriesDataSpecific = [
        { value: response.data[0]?.noofrequestpending, name: 'Pending' },
        { value: response.data[0]?.noofrequestinreview, name: 'In Review' },
        { value: response.data[0]?.noofrequestcompleted, name: 'Completed' }
    ].filter(item => item.value !== undefined); // Filter out items with undefined values
    break;
default:
    seriesDataSpecific = [];
    break;
}


  this.statuschartload(legendDataall, seriesDataAll, 'all');
  this.statuschartload(legendData, seriesDataSpecific, processname);
});

  }

 
  chartclick(event:any){

    console.log(this.oneMonthAgo)
    console.log(this.todayModel)

    // console.log(event)
    console.log(event.name)
    console.log(event.seriesName)

    let data={
      chartname:event.seriesName,
      selectedpiece:event.name,
      startdate:this.todayModel,
      enddate:this.oneMonthAgo
    }
    console.log(data);

      if(event.seriesName==='LCA'){
      this.common.setDefaultInputsforLCAReports(data);
      this.router.navigateByUrl('/reports/rptpendinglca')
      this.router.navigateByUrl('/reports/rptpendinglca', { state: { returnUrl: '/analytics' } });
      }
      else if(event.seriesName==='COO'){
        this.common.setDefaultInputsforCOOReports(data);
        this.router.navigateByUrl('/reports/rptpendingcoo', { state: { returnUrl: '/analytics' } })
      }
      else if(event.seriesName==='PHYSICAL'){
        this.common.setDefaultInputsforPHYSICALReports(data);
        this.router.navigateByUrl('/reports/rptpendingphysical', { state: { returnUrl: '/analytics' } })
      }
      else{
        if(event.name==='LCA'){
          this.common.setDefaultInputsforLCAReports(data);
          this.router.navigateByUrl('/reports/rptpendinglca', { state: { returnUrl: '/analytics' } })
        }
        else if(event.name==='COO'){
          this.common.setDefaultInputsforCOOReports(data);
          this.router.navigateByUrl('/reports/rptpendingcoo', { state: { returnUrl: '/analytics' } })
        }
        else if(event.name==='PHYSICAL'){
          this.common.setDefaultInputsforPHYSICALReports(data);
          this.router.navigateByUrl('/reports/rptpendingphysical', { state: { returnUrl: '/analytics' } })
        }
      }

    // console.log(event.value)

  }


  handleDateChange(event: any, dateType: string): void {
    // const selectedDate = event.value;

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


    this.apicallfunc('lca');
    this.apicallfunc('coo');
    this.apicallfunc('physical');
    this.apicallfunc('all');


  }


}
