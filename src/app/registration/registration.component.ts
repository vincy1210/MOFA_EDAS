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
import { AuthService } from 'src/service/auth.service';


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
  isButtonDisabled = false;
  constructor(private auth:AuthService,private consts:ConstantsService,private recaptchaV3Service: ReCaptchaV3Service,private http:HttpClient ,private common:CommonService,private FormBuilder:FormBuilder, private router:Router, private _activatedRoute:ActivatedRoute, private apiservice:ApiService){
    this.common.getData().subscribe(data => {
      this.reg_form_data = data;
      console.log(this.reg_form_data)
    });
    
    this.registrationForm = this.FormBuilder.group({
      tradeLicenseNumber: [this.reg_form_data.tradeLicenseNumber, [Validators.required, Validators.minLength(4)]],
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
  
    if(this.userinfo===""||this.userinfo==undefined)
    {
      console.log("Missing Data!!!")
      this.common.showErrorMessage("Something went wrong")
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

      

      this.user_info_taken_using_authtoken=this.common.getUserProfile().Data;
      let data=
      {
        "tradelicensenumber": this.reg_form_data.tradeLicenseNumber,
         "uuid":this.userinfo.Data.uuid,
     }
     let data2=
     {
      //  "tradelicensenumber": this.reg_form_data.tradeLicenseNumber,
        "uuid":this.userinfo.Data.uuid,
        "startnum":1,
        "endnum":10,
        "status":1
    }
     let response;
    this.common.showLoading();

     try{

      this.apiservice.post(this.consts.CheckCompanyRegStatus,data).subscribe({next:(success:any)=>{
        response=success;
        this.common.hideLoading();

        if(response.responseCode==200){
         if(response.data.dictionary.data.length>0 && response.data.dictionary.data.status!="Pending"){
          // this.common.setCompanyList(response.data.dictionary.data);
          //  this.router.navigateByUrl('/landingpage')

          this.apiservice.post(this.consts.getCompanyList,data2).subscribe({next:(success:any)=>{
            response=success;
            if(response.dictionary.responsecode===1){
             if(response.dictionary.data.length>0){
              this.common.setCompanyList(response.dictionary.data);
        console.log("to landing page from reg page line 140")

               this.router.navigateByUrl('/landingpage')
             }
             else{
               this.router.navigateByUrl('/companydetails')
             }
            }
            else{
              this.common.showErrorMessage("Something went wrong.")
              console.log("error in getCompanyList") 
              return;
            }
         }})
         
         }
         else{
           this.router.navigateByUrl('/companydetails')
         }
        }
        else if(response.responseCode==500){
          this.proceed();
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
     this.common.showLoading();

    try{
      
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

    this.reg_form_data= this.common.getUserProfile();

    console.log(this.reg_form_data);
    let data={
      "useruno":"1",
      "languagecode":0
    }
    this.common.showLoading();

    this.apiservice.post(this.consts.getFreezonetypes, data).subscribe((response: any) => {
      this.common.hideLoading();

      const dataArray = response.data; // Access the 'data' property from the response
      this.freezone1=dataArray.dictionary.data;
      this.common.setfreezone(this.freezone1)
      console.log(this.freezone1);

      if(this.freezone1==undefined){
        this.common.showErrorMessage("Error in loading zone type");
        return;
      }
    });

    if(this.param3==undefined ||this.param1==undefined || this.param2==undefined){

      if(this.reg_form_data!=null ||this.reg_form_data!=undefined){
       
        this.userinfo=JSON.parse(this.reg_form_data);
        this.common.setUserIfoData(this.reg_form_data);
      }
      else{

        console.log("redirect parameters undefined");

        this.common.showErrorMessage("Something went wrong! Please try again")

         // Delay the execution of this.common.logoutUser() by 2 seconds
  setTimeout(() => {
    this.auth.logout();
  }, 2000); // 2000 milliseconds = 2 seconds
        return;
      }

    }
    else{

      if(this.reg_form_data==null ||this.reg_form_data==undefined){
        this.addItem();
      }
      else{
        this.userinfo=JSON.parse(this.reg_form_data);
        this.common.setUserIfoData(this.reg_form_data);
      }
      

    }
    //this.common.hideLoading();
    
  }
  finally{
    this.common.hideLoading()
  }

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

          const userProfileString = JSON.stringify(this.userinfo);

         this.common.setUserProfile(userProfileString);

// Set the user profile data in SessionStorage
       // sessionStorage.setItem('userProfile', userProfileString);

       //verify the user whether he already has company and if he already having redirect him to company listing page
       this.useralreadyhavingcompany(this.userinfo.Data);

          console.log(response.IsSucceeded);
        } 
        else if (response.IsSucceeded === "False") {
          console.log(response.message)
          this.common.showErrorMessage("Something went wrong");
          console.log("Auth1 failed")
          return;
        }
  
        if (this.userinfo == undefined) {
          this.common.showErrorMessage("Something went wrong");
          console.log("Auth2 Failed!!!");
          return;
        }
  
        this.common.setUserIfoData(response.Data);
      })
      .catch(console.log);
  }
  

 //NIU
  // public getToken(objDepartment:any) {
  //   console.log(objDepartment)

  //   if(this.param1==undefined || this.param3==undefined){
  //     this.common.showErrorMessage("Invalid Parameters")
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
  //         this.common.showErrorMessage("Auth1 Failed");
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
//           this.common.showErrorMessage("Auth2 Failed");
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

    if(this.freezone1!=undefined){
      const filteredData = this.freezone1.filter((item:any) => item.emiratesuno === parseInt(selectedValue, 10));
      console.log(filteredData);
      this.freezone=filteredData;
    console.log(this.freezone);
    }

   
    
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

  useralreadyhavingcompany(userinfo:any){

    let response, data;
    data={
      "uuid": userinfo.uuid,
      "emiratesid": userinfo.idn,
      "email": userinfo.email,
      "mobile": userinfo.mobile,
      "firstname": userinfo.firstnameEN
  }
  this.common.showLoading();

    this.apiservice.post(this.consts.checkCompanyUser,data).subscribe({next:(success:any)=>{
      this.common.hideLoading();

      response=success;
      this.common.hideLoading();

      if(response.responsecode==1){
       if(response.data==="User not available"){
        return;
       }
       else{

        let lcauser: boolean = false;

        // Iterate through the JSON data
        for (const data of response.data) {
          if (data.roleuno === 11 || data.roleuno === 12) {
            lcauser = true;
            break; // No need to continue checking once condition is met
          }
        }
        // Now lcauser will be true if any lcauno is 11 or 12
        console.log("Is lcauser true?", lcauser);

        if(lcauser){
          this.common.setUserRole('LCAAdmin');
          this.router.navigateByUrl('/lcadashboard');

          
        }
        else{
          sessionStorage.setItem('usertype','CompanyUser')

          this.common.userType.next('CompanyUser');
          console.log("to landing page from registration page line 535")

          this.router.navigateByUrl('/landingpage');

        }
       }
      
      }
      
      }});

  }

}
