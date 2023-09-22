import { Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ApiService } from 'src/service/api.service';
import { filter, takeWhile } from 'rxjs/operators';
import { CommonService } from 'src/service/common.service';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// import { RecaptchaComponent } from 'ng-recaptcha';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { ConstantsService } from 'src/service/constants.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],

})
export class RegistrationComponent {

  @ViewChild('invisible') invisibleRecaptcha: any;

  showSection03a: boolean = false;

  expressType: string='';
  typeExpress: string[] = ['Department of Economic Development (DED)', 'Freezone'];

 // radioOptions: FormGroup | undefined;
  registrationForm: FormGroup;
  issuing_auth:boolean=false;

  param1:any;
  param2: any;
  param3: any;
  alive: boolean = true
  today:Date=new Date()
  reg_form_data:any;
  captcha:string='';
  email:string='';

  //testvar vincy

  userinfo:any;
  captcha_token:any;
  user_info_taken_using_authtoken:any;
  freezone:any;
  freezone1:any;

  constructor(private consts:ConstantsService,private recaptchaV3Service: ReCaptchaV3Service,private http:HttpClient ,private common:CommonService,private FormBuilder:FormBuilder, private router:Router, private _activatedRoute:ActivatedRoute, private apiservice:ApiService){
    this.common.getData().subscribe(data => {
      this.reg_form_data = data;
      console.log(this.reg_form_data)
    });
    
    this.registrationForm = this.FormBuilder.group({
      tradeLicenseNumber: [this.reg_form_data.tradeLicenseNumber, Validators.required],
      chosenDate: [this.reg_form_data.chosenDate, Validators.required],
      issuingAuthority: [this.reg_form_data.issuingAuthority, Validators.required],
      expressType: [this.reg_form_data.expressType, Validators.required],
      dmccOption:[this.reg_form_data.dmccOption]
    });

  //  if(this.reg_form_data==="Freezone"){

      if(this.reg_form_data.expressType==="Freezone"){
        this.registrationForm.get('dmccOption')?.setValidators(Validators.required);
        this.registrationForm.get('dmccOption')?.updateValueAndValidity();
      }
      else{
        //this.registrationForm.removeValidators('dmccOption')
        this.registrationForm.get('dmccOption')?.clearValidators();
        this.registrationForm.get('dmccOption')?.updateValueAndValidity();
      }

    //}

  }

 
  proceed(){
    this.registrationForm.markAllAsTouched()
   
    console.log(this.registrationForm.get('tradeLicenseNumber'));
    //uncomment
    if(this.userinfo===""||this.userinfo==undefined)
    {
      this.common.showErrorMessage("Missing Data!")
      return;

    }
    console.log(this.userinfo.Data.uuid)


    if(this.registrationForm.valid){
      console.log("success");
      const formData = this.registrationForm.value;
      console.log('Form Data:', formData);
     // formData.captcha_token=this.captcha_token;
      this.common.setData(formData); 
      console.log(formData);

      this.common.getUserIfoData().subscribe(data => {
        this.user_info_taken_using_authtoken = data;
        console.log(this.user_info_taken_using_authtoken)
      });
      let data=
      {
        "tradelicensenumber": this.reg_form_data.tradeLicenseNumber,
         "uuid":this.userinfo.Data.uuid

     }
     let response;

     try{
      this.apiservice.post(this.consts.CheckCompanyRegStatus,data).subscribe({next:(success:any)=>{
        response=success;
        if(response.responseCode==200){
         if(response.data.dictionary.data.length>0){
           this.common.setRegisteredCompanyDetails(response.data.dictionary.data)
           this.router.navigateByUrl('/landing')
         }
         else{
           this.router.navigateByUrl('/companydetails')
         }
        }
        else if(response.responseCode==500){
          this.proceed();
          // vincy -- remove this condition while moving to production. this is just for packet error
        }
        else{
          console.log() 
        }
     }})

     }
     finally{
     }
      // set data in common service so that data can be pass from registration to company details component
    }
    else{
      
      console.log(this.expressType)
      if(this.expressType===""){
        this.issuing_auth=true;
      }
      else{
        this.issuing_auth=true;
      }
      const form={...this.registrationForm.value}
      console.log(form)
      console.log("invalid form")
      const formData = this.registrationForm.value;
      console.log('Form Data:', formData);
    }

  }
  ngOnInit() {
    //this.common.showLoading();


    console.log('---------');
    this._activatedRoute.queryParams.subscribe((params: Params) => {
      // Access and capture the parameters here
      this.param1 = params['AuthenticationCode'];
      this.param2 = params['lang'];
      this.param3 = params['email'];

      console.log(this.param1);
      console.log(this.param2);
      console.log(this.param3);
      
      // You can perform any actions or logic with these parameters
    });
let data={
  "useruno":"1"
}
    this.apiservice.post(this.consts.getFreezonetypes, data).subscribe((response: any) => {
      const dataArray = response.data; // Access the 'data' property from the response
      this.freezone1=dataArray.dictionary.data;
      this.common.setfreezone(this.freezone1)

      if(this.freezone1==undefined){
        this.common.showErrorMessage("Error in loading zone type");
        return;
      }
    });



    this.addItem();
   
  }
  radio(event:any){


    console.log(event.value);
    var issuing_auth=event.value
    this.expressType=issuing_auth;
    console.log(issuing_auth);
    console.log(this.expressType)
    
    if(this.expressType==="Freezone"){
      this.registrationForm.get('dmccOption')?.setValidators(Validators.required);
      this.registrationForm.get('dmccOption')?.updateValueAndValidity();
    }
    else{
      //this.registrationForm.removeValidators('dmccOption')
      this.registrationForm.get('dmccOption')?.clearValidators();
      this.registrationForm.get('dmccOption')?.updateValueAndValidity();
    }

  }

  
  //Redirection from MOFA start

  addItem() {
    
    const objTxData = {
      AuthenticationCode: this.param1,
      email: this.param3
    }
    this.sRetriveUserProfile();
   // this.getToken(objTxData);
  }
//commented for testing
  sRetriveUserProfile() {
    // Show the loader before making the API request
    this.apiservice.sPassAuthGetUserprofile(this.param1, this.param3)
      .toPromise()
      .then((response: any) => {

        if (typeof response === 'string' && !response.includes('/')) {
         // response = response.slice(1, -1);
          response = JSON.parse(response);
        }
        else{
          response = JSON.stringify(response).replace(/\\/g, '');
         // response = response.slice(1, -1);
          response = JSON.parse(response);
        }
        if (response.IsSucceeded === "True") {
          this.userinfo = response;
          console.log(response.IsSucceeded);
        } 
        else if (response.IsSucceeded === "False") {
          console.log(response.message)
          this.common.showErrorMessage("Auth Failed!!!");
        }
  
        if (this.userinfo == undefined) {
          this.common.showErrorMessage("Auth2 Failed!!!");
        }
  
        this.common.setUserIfoData(response.Data);
      })
      .catch(console.log);
  }
  

 //NIU
  // public getToken(objDepartment:any) {
  //   console.log(objDepartment)

  //   if(this.param1==undefined || this.param3==undefined){
  //     this.common.showErrorMessage("Invalid Parameters!")
  //     return;
  //   }
  //   this.apiservice.GetAuthToken(this.param1, this.param3)
  //     .toPromise()
  //     .then((response:any) => {
  //       console.log(response);
  //       console.log(response.IsSucceeded);
  //       console.log(response.Data.AccessToken);
  //       console.log(response.Data.Email);
  //       console.log(response);

  //     // need to uncomment this

  //       if(response.IsSucceeded==="True"){
  //         this.getUserToken(response.Data.AccessToken);
  //       }
  //       else{
  //         this.common.showErrorMessage("Auth1 Failed!!!");
  //         return;
  //       }
  //     })
  //     .catch(console.log); 

  //     //comment this 
  //  // this.getUserToken("response.Data.AccessToken");
     
  // }
//NIU
//   public getUserToken(accessToken:any) {
// //uncmnt this while deploying
//     this.apiservice.getUserToken(accessToken,this.param3 )
//       .toPromise()
//       .then((response:any) => {
//         console.log(response);
//         this.userinfo=response;
//         console.log(response.IsSucceeded);
//         console.log(response.Data.AccessToken);//
//         console.log(response.Data.Email);
//         console.log(response);

//         if(this.userinfo==undefined){
//           this.common.showErrorMessage("Auth2 Failed!!!");
//           return;
//         }
        
//         this.common.setUserIfoData(response.Data)

//       })
//       .catch(console.log); 

//   }
  //Redirection from MOFA end
  
  ngOnDestroy() {
    console.log("--Stop--");
    this.alive = false
  }


  // resolved(captchaResponse: string) {
  //   console.log(`Resolved captcha with response: ${captchaResponse}`);
  // }
  

  // public executeImportantAction(): void {
  //   this.recaptchaV3Service.execute('importantAction')
  //     .subscribe((token) => 
  //    console.log(token)
  //     );
  // }

  // public onError() {
  //   console.log("reCAHPTCHA errored;");
  // }

  // public addTokenLog(message: string, token: string | null) {
  //   console.log(`${message}: ${this.formatToken(token)}`);
  //   this.captcha_token=this.formatToken(token);
  // }

  // public formatToken(token: string | null) {
  //   return token !== null
  //     ? `${token.substring(0, 7)}...${token.substring(token.length - 7)}`
  //     : 'null';
  // }
  //for recaptcha end

  mainpage(){
    this.router.navigateByUrl('/registration')
  }
  licenseauthchange(event:any){
    console.log(event);
   // const filteredData = this.freezone.filter((item:any) => item.emiratesuno === emiratesUnoValue);
  }
  

  onDropdownChange(event:any) {
    console.log(event);

    const selectedValue = this.registrationForm.get('issuingAuthority')?.value;
    console.log(`Selected value: ${selectedValue}`);
    console.log(this.freezone1)

    const filteredData = this.freezone1.filter((item:any) => item.emiratesuno === parseInt(selectedValue, 10));
    console.log(filteredData);
    this.freezone=filteredData;
    
  }

  // public formatToken(token: string | null) {
  //   return token !== null
  //     ? `${token.substring(0, 7)}...${token.substring(token.length - 7)}`
  //     : 'null';
  // }

  // public addTokenLog(message: string, token: string | null) {
  //   console.log(`${message}: ${this.formatToken(token)}`);
  //   this.captcha_token=token;


  // }

}
