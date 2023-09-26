import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/service/common.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  CompanyListforAdmin: any;
selectedCompany:any;
setselcompany:any;

uuiddetails:any;
  constructor(private common:CommonService, private router:Router) { }

  ngOnInit(): void {

    // this.common.getUserIfoData().subscribe(data => {
    //   this.uuiddetails = data;
    //   console.log(this.uuiddetails)

      
    // });

    this.uuiddetails=this.common.getUserProfile();

    this.uuiddetails=JSON.parse(this.uuiddetails);
    this.uuiddetails=this.uuiddetails.Data;


    this.CompanyListforAdmin=this.common.getCompanyList();
    console.log(this.CompanyListforAdmin)

    // this.common.getRegisteredCompanyDetails().subscribe(data => {
    //   this.CompanyListforAdmin = data;
    //   console.log(this.CompanyListforAdmin)
    // });

    //comment it

//    this.CompanyListforAdmin=[
//     {
//       "companyname":"test1",
//       "tradelicensenumber":"123456789",
//       "companyuno": 0,
//     }
   
// ]


  }
  toggleSelected(selectedCompany: any) {
    // Reset selection for all companies
    this.CompanyListforAdmin.forEach((company: any) => {
      company.isSelected = false;
    });
    
    // Toggle selection for the clicked company
    selectedCompany.isSelected = true;
    this.selectedCompany=selectedCompany;
    console.log(selectedCompany)
  }

  RedirectRegistrationPage(){
     this.router.navigateByUrl('/registration')

     
    //  this.router.navigateByUrl('/companydetails')

  }
  selectedCompanyProceed(){
    console.log(this.selectedCompany)
    let companyuno=this.selectedCompany.companyuno;
    let uuid=this.uuiddetails.uuid;


    let data={
      "companyuno":companyuno,
      "uuid":uuid
  }

   this.setselcompany={
      "companyuno":companyuno,
      "uuid":uuid
    }

  this.common.setSelectedCompany(this.setselcompany)
    this.router.navigateByUrl('/attestation')

    this.common.setSidebarVisibility(true);
   

  }

}
