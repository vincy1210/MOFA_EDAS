import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/service/common.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/service/api.service';
import { ConstantsService } from 'src/service/constants.service';
import { AuthService } from 'src/service/auth.service';
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  CompanyListforAdmin: any;
selectedCompany:any;
setselcompany:any;
uuid:any;
today: Date = new Date(); 
oneMonthAgo = new Date();

uuiddetails:any;
isanycompanyavailable:boolean=false;
isButtonDisabled = false;
initialCompanyList: any;
  constructor(private common:CommonService, private router:Router, private apicall:ApiService, private consts:ConstantsService, private auth:AuthService) { 
    this.oneMonthAgo.setMonth(this.oneMonthAgo.getMonth() - 1);
  }

  ngOnInit(): void {

   
    this.uuiddetails=this.common.getUserProfile();

    let uuid;
    if(this.uuiddetails!=null || this.uuiddetails!=undefined){
      this.uuiddetails=JSON.parse(this.uuiddetails)
      uuid=this.uuiddetails.Data.uuid;
      this.uuid=uuid;

    }
    else{
       this.common.setlogoutreason("session");
      this.auth.logout();

    }
   

    this.getcompanylist();
   
  }

  getcompanylist() {
    let data = {
      "uuid": this.uuid,
      "startnum": 0,
      "limit": 100,
      "status": 0,
      "startdate": this.common.formatDateTime_API_payload(this.oneMonthAgo.toDateString()),
      "enddate": this.common.formatDateTime_API_payload(this.today.toDateString())
    };
  
    let resp;
    this.common.showLoading();
    this.apicall.post(this.consts.getCompanyList, data).subscribe({
      next: (success: any) => {
        this.common.hideLoading();
  
        resp = success;
        if (resp.dictionary.responsecode == 1) {
          // Store the initial list when it is loaded
          if (!this.initialCompanyList) {
            this.initialCompanyList = [...resp.dictionary.data];
          }
  
          this.CompanyListforAdmin = resp.dictionary.data;
          if(this.CompanyListforAdmin.length==0){
            this.router.navigateByUrl('/registration');
          }
          this.common.favink1 = resp.dictionary.data.recentusedlink1;
          this.common.favink2 = resp.dictionary.data.recentusedlink2;

          if(this.CompanyListforAdmin.length==1){
            this.CompanyListforAdmin.forEach((company: any) => {
              company.isSelected = true;   // need to check a better solution
            });

          }
          

          this.CompanyListforAdmin.forEach((company: any) => {
            // Set isSelected to true for companies with favouritecompany equal to "1"
            company.isSelected = company.favouritecompany === "1";
            if(company.isSelected){
              this.selectedCompany=company

            }
          });
        } else {
          this.CompanyListforAdmin = null;
        }
  
        this.isanycompanyavailable = this.CompanyListforAdmin !== null;
      }
    });
  }
  

  toggleSelected(selectedCompany: any) {
    console.log(selectedCompany);
    // Reset selection for all companies
    this.CompanyListforAdmin.forEach((company: any) => {
      company.isSelected = false;
    });

  
    // Toggle selection for the clicked company
    // if (selectedCompany.favouritecompany === "1") {
      selectedCompany.isSelected = true;
      this.selectedCompany = selectedCompany;
      console.log(selectedCompany);
    // }
    // else{

    // }
  }

  RedirectRegistrationPage(){
     this.router.navigateByUrl('/registration')
    //  this.router.navigateByUrl('/companydetails')

  }
  selectedCompanyProceed(){
    console.log(this.selectedCompany)
    if(this.selectedCompany=='' ||this.selectedCompany==null ||this.selectedCompany==undefined){
      this.common.showErrorMessage("Select a company to proceed");
      return;
    }

    this.setfavourites(this.selectedCompany.companyuno);
    let companyuno=this.selectedCompany.companyuno;
    let business_name=this.selectedCompany.nameofbusiness;
    let role=this.selectedCompany.rolename;
    let uuid=this.uuiddetails.uuid;
    this.setselcompany={
    "companyuno":companyuno,
    "business_name":business_name,
    "role":role
    }
    this.auth.setSelectedCompany(this.setselcompany)
    console.log(this.auth.getSelectedCompany().companyuno)
    this.router.navigateByUrl('/lca/attestation')
    this.common.setSidebarVisibility(true);
  }

  // Add this property and method to your existing class
searchKeyword: string = '';

searchCompanies() {
  if (this.searchKeyword.trim() !== '') {
    // Filter the initialCompanyList based on the searchKeyword
    const filteredCompanies = this.initialCompanyList.filter((company: any) => {
      return company.nameofbusiness.toLowerCase().includes(this.searchKeyword.toLowerCase());
    });

    // Update the displayed company list
    this.CompanyListforAdmin = filteredCompanies;
  } else {
    // If the search box is empty, reset the list to the initial data
    this.CompanyListforAdmin = [...this.initialCompanyList];
  }
}

setfavourites(companyuno:any){

  let data={
    "uuid":this.uuid,
    "favouritecompany":companyuno,
    "relatedlink":"Dashboard"
}
let resp;
  this.apicall.post(this.consts.Updatecompanyuser, data).subscribe({
    next: (success: any) => {
      this.common.hideLoading();

      resp = success;
      if (resp.responsecode == 1) {
        // Store the initial list when it is loaded
        // if (!this.initialCompanyList) {
        //   this.initialCompanyList = [...resp.dictionary.data];
        // }
        // this.common.showSuccessMessage("set successfully");
        return;
      } 
      else {

        // this.CompanyListforAdmin = null;
      }

      // this.isanycompanyavailable = this.CompanyListforAdmin !== null;
    }
  });
}

}
