import { Component, OnInit, ViewChild, TemplateRef, VERSION, ElementRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, MinLengthValidator, ValidatorFn, AbstractControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NgxOtpInputConfig } from 'ngx-otp-input';
// import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/service/common.service';
//import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { InteropObservable, interval } from 'rxjs';
import { ConstantsService } from 'src/service/constants.service';

import { takeWhile } from 'rxjs/operators';
import { ApiService } from 'src/service/api.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { formatDate } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-companydetails',
  templateUrl: './companydetails.component.html',
  styleUrls: ['./companydetails.component.css']
})
export class CompanydetailsComponent implements OnInit {

  @ViewChild('fileInput') fileInput: any;

  @ViewChild('invisible') invisibleRecaptcha: any;
  companyDetailsForm: FormGroup;//
  legalTypeOptions: { typeuno: string; typename: string }[] = [];
  TemplateRef: any;
  captcha_token:any;

  public version = VERSION.full;
  public recaptchaMode = 'v3';
  public reactiveForm: FormGroup = new FormGroup({
    recaptchaReactive: new FormControl(null, Validators.required),
  });

  // countdown setup var start
  countdownMinutes:number = 0;
  countdownSeconds:number = 0;
  countdownTotalSeconds:number = 0;
  // countdown setup var end

  today: Date = new Date(); 

  alive: boolean = true
  sel_file_test:any;

  OTP_entered:any;
  incorrectOTP: boolean = false;
  OTP_verified:boolean=false;

  reg_form_data:any;
  user_info_taken_using_authtoken:any;

  progress_val:number=66;
  form1_Vis:boolean=true;
  response_code_after_submit:number=0;
  note1:string='';
  note2:string='';
  note3:string='';
  note4:string='';
  freezonelist:any;
  showResendLink:boolean=false;
  already_reg_companyemail:string='';
  isButtonDisabled = false;
  alreadyregisteredcompanydetails:any;
  constructor(private recaptchaV3Service:ReCaptchaV3Service,private common:CommonService ,private _activatedRoute: ActivatedRoute,private formBuilder:FormBuilder, public dialog: MatDialog, private Common:CommonService, public apiservice:ApiService, public consts:ConstantsService, public router:Router) {


    //this.common.SetAlreadyregisteredcompanydetails

    this.Common.GetAlreadyregisteredcompanydetails().subscribe(data => {
      this.alreadyregisteredcompanydetails = data;
      console.log(this.alreadyregisteredcompanydetails)
      if(this.alreadyregisteredcompanydetails){
        this.form1_Vis=false;
        this.response_code_after_submit=this.alreadyregisteredcompanydetails.regnno;   ///vincy 
        this.already_reg_companyemail=this.alreadyregisteredcompanydetails.repemailaddress;
        if(this.alreadyregisteredcompanydetails.isapproved){  //already approved

          this.setnote('C')  //vincy
        }
        else{         //registered but not approved yet
this.setnote('B');   //vincy
        }
      }
    });

    // uncomment
if(this.reg_form_data==undefined){

  this.Common.getData().subscribe(data => {
    this.reg_form_data = data;
    console.log(this.reg_form_data)
  });

}



    if(this.reg_form_data==="" || this.reg_form_data==undefined){
      this.router.navigateByUrl("/registration");
      console.log("Issue in Fetching form");
      this.common.showErrorMessage("Something went wrong")
    }
   

    let license_issuing_auth;
    
    if(this.reg_form_data?.expressType==="Freezone"){

      this.common.getfreezone().subscribe(data => {
        this.freezonelist = data;
        console.log(this.freezonelist)
      });
      license_issuing_auth=this.reg_form_data.dmccOption;
      let matchingObj = this.freezonelist.find((item:any) => item.typeuno === this.reg_form_data.dmccOption);
      console.log(matchingObj.typename)
      license_issuing_auth=matchingObj.typename

    
    }
    else{
      license_issuing_auth=this.reg_form_data?.expressType
    }

    this.companyDetailsForm=this.formBuilder.group({
      name_of_Business:[this.reg_form_data?.name_of_Business, [Validators.required,Validators.pattern('^(?=.*\\S).+$')]],
      trade_Licence:[this.reg_form_data?.tradeLicenseNumber],
      trade_Licence_Issue_Date:[this.reg_form_data?.chosenDate, Validators.required],
      trade_Licence_Expiry_Date:['', Validators.required],
      Licence_issuing_auth:[license_issuing_auth, [Validators.required, Validators.pattern('^(?=.*\\S).+$')]],
      legal_Type:['', Validators.required],
      Comp_Reg_Email_Address:['', [Validators.required, Validators.email]],
      //'^5\\d+$'
      Comp_contact_number:['', [Validators.required, Validators.maxLength(9), Validators.minLength(9), Validators.pattern(/^5\d+$/)]],
      Upload_trade_license:['', Validators.required],
      companyrep_fullname:['',[Validators.required, Validators.pattern('^(?=.*\\S).+$')]],
      companyrep_EmailAddress:['',[Validators.required, Validators.email]],
      companyrep_MobileNumber:['',[Validators.required, Validators.maxLength(9), Validators.minLength(9), Validators.pattern(/^5\d+$/)]],
      isbroker: ['2', Validators.required],
    })
   }

   dialogRef: any;
   rep_contact_no='';
   typeExpress:any;
 
   onNoClick(): void {
     this.dialogRef.close();
   }
   radiochosenornot:boolean=false;
   

  ngOnInit(): void {

    this.common.showLoading();
    this.sitekey=environment.recaptcha.siteKey
    this.user_info_taken_using_authtoken=this.common.getUserProfile();
    if(this.user_info_taken_using_authtoken==null || this.user_info_taken_using_authtoken==undefined){
      console.log("session expired");
      this.common.showErrorMessage("Session Expired")
    }
    else{
      this.user_info_taken_using_authtoken=JSON.parse(this.user_info_taken_using_authtoken);
      this.user_info_taken_using_authtoken=this.user_info_taken_using_authtoken.Data;
    }

    this.typeExpress=['yes', 'No']
    let response;
    let data={
      "useruno":"1",
      "languagecode":0
    }
    this.common.showLoading();

      this.apiservice.post(this.consts.GetLegalTypes, data).subscribe((response: any) => {
        this.common.hideLoading();

        const dataArray = response.data; // Access the 'data' property from the response
        console.log(dataArray);
        this.legalTypeOptions=dataArray.dictionary.data;
        console.log(dataArray)
      });
      this.common.hideLoading();

  }

  @ViewChild('attachments') attachment: any;
  @ViewChild('ngxotp') ngxotp: any; // Reference to the ngx-otp-input component

  fileList: File[] = [];
  listOfFiles: any[] = [];
  isLoading = false;
  sitekey:string='';

  onFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if(file.type === 'application/pdf')
      {
              if (file.size <= 2 * 1024 * 1024) {
              const form = { ...this.companyDetailsForm.value };
              this.isLoading = true;
              this.fileList=[];
              this.listOfFiles=[];
              for (var i = 0; i <= event.target.files.length - 1; i++) {
                var selectedFile = event.target.files[i];
                this.sel_file_test=selectedFile;
                  this.fileList.push(selectedFile);
                  this.listOfFiles.push(selectedFile.name);
              }
              setTimeout(() => {
                this.isLoading = false;
              }, 3000);
              const timestamp = new Date().getTime();
              const newFileName = form.trade_Licence +'_'+timestamp+ '.pdf'; 
              const renamedFile = new File([selectedFile], newFileName, { type: selectedFile.type });
              this.sel_file_test=renamedFile;
            } 
            else {
              this.listOfFiles=[];
              this.common.showErrorMessage('File size should be less than or equal to 2 MB');
              // Clear the file input
              this.companyDetailsForm.get('Upload_trade_license')?.setValue('');
              this.fileInput.nativeElement.value = '';
            }
    }
    else
    {
      this.listOfFiles=[];
            this.common.showErrorMessage('Only PDF files are allowed');
            // Clear the file input
            this.companyDetailsForm.get('Upload_trade_license')?.setValue('');
            this.fileInput.nativeElement.value = '';
            return; // Exit the function if the file type is not PDF
        
    }
    }
  }

  removeSelectedFile(index: number) {
    this.listOfFiles.splice(index, 1);
    this.fileList.splice(index, 1);
   this.companyDetailsForm.get('Upload_trade_license')?.setValue(null);
    this.companyDetailsForm.get('Upload_trade_license')?.updateValueAndValidity();
  }
  
  ngOnDestroy() {
    console.log("--Stop--");
    this.alive = false
  }


  //
  
  submit() {
    console.log(this.attachment)
    if (this.companyDetailsForm.get('isbroker')?.value === "") {
      this.radiochosenornot = true;
    } else {
      this.radiochosenornot = false;
    }
  
    if (this.companyDetailsForm.valid) {
      // Execute reCAPTCHA v3
      this.recaptchaV3Service.execute('myAction').subscribe(
        (token) => {

          console.log(token)
        this.captcha_token=token;
        this.addTokenLog('Recaptcha v3 token', token);

        console.log('File List:', this.fileList);
        const form = { ...this.companyDetailsForm.value };
        console.log('Form Values:', form);
        console.log(this.captcha_token)

        let lcano='00';
        let emirate=this.reg_form_data.issuingAuthority;
        if(emirate=='AUH'){
          lcano='01';
        }
        else if(emirate=='AJM'){
          lcano='02';
        } else if(emirate=='DXB'){
          lcano='03';

        } else if(emirate=='FUJ'){
          lcano='04';

        } else if(emirate=='SHJ'){
          lcano='05';

        } else if(emirate=='RAK'){
          lcano='06';
        }
        else{
          lcano='07';
        }
  
       
	  let data={
      "emiratesId": this.user_info_taken_using_authtoken.idn,   // UAE pass frields start
      "uuid": this.user_info_taken_using_authtoken.uuid,
      "token": this.user_info_taken_using_authtoken.Token,
      "useruno": "0",     //find out
      "companyname":form.name_of_Business,
      "tradelicensenumber": form.trade_Licence,
      "tradelicenseissuedate": this.Common.convertISOToCustomFormat(form.trade_Licence_Issue_Date) ,
      "tradelicenseexpirydate": this.Common.convertISOToCustomFormat(form.trade_Licence_Expiry_Date),
      "licenseissuingauthority": form.Licence_issuing_auth, //freetext
      "companyregisteredemailaddress": form.Comp_Reg_Email_Address,
      "companycontactnumber": form.Comp_contact_number,
      "HASATTACHMENT": "0",
      "attachment": form.trade_Licence,
      "representativeemailaddress": form.companyrep_EmailAddress,
      "mobilenumber": form.companyrep_MobileNumber,
      "userType": this.user_info_taken_using_authtoken.userType,
      "mobile": this.user_info_taken_using_authtoken.mobile,
      "email": this.user_info_taken_using_authtoken.email,
      "spuuid": this.user_info_taken_using_authtoken.spuuid,
      "idn": this.user_info_taken_using_authtoken.idn,
      "fullnameEN": this.user_info_taken_using_authtoken.fullnameEN,
      "fullnameAR": this.user_info_taken_using_authtoken.fullnameAR,
      "firstnameEN": this.user_info_taken_using_authtoken.firstnameEN,
      "firstnameAR": this.user_info_taken_using_authtoken.firstnameAR,
      "lastnameEN": this.user_info_taken_using_authtoken.lastnameEN,
      "lastnameAR": this.user_info_taken_using_authtoken.lastnameAR,
      "nationalityEN": this.user_info_taken_using_authtoken.nationalityEN,
      "nationalityAR": this.user_info_taken_using_authtoken.nationalityAR,
      "gender": this.user_info_taken_using_authtoken.gender,
      "idType": this.user_info_taken_using_authtoken.idType,
      "titleEN": this.user_info_taken_using_authtoken.titleEN,
      "titleAR": this.user_info_taken_using_authtoken.titleAR,
      "UAEPassJson": this.user_info_taken_using_authtoken.UAEPassJson,
      
      "freezoneuno": this.reg_form_data?.dmccOption,    ///
      "legaltypeuno": form.legal_Type,
      "repfullnameen":form.companyrep_fullname,
      "repfullnamear":form.companyrep_fullname,
      "licenseissuingauthorityemirate":lcano,  //dropdown
      "IssuingAuthorityType":this.reg_form_data.expressType,
      "captchakey":this.captcha_token,
      "isbroker":form.isbroker,

    }
  
        let data111 = { ...data, ...this.user_info_taken_using_authtoken };
        console.log(data111);

        let response;
  this.common.showLoading();
        this.apiservice.registerCompanyAttachment(this.consts.registercompany ,this.sel_file_test,data).pipe(takeWhile(() => this.alive)).subscribe({
          next: (success)=>{
            this.common.hideLoading();
                  response=success;
                  console.log(response);
                  if(response.responseCode==200){
                    this.response_code_after_submit=response.data.dictionary.requestno
                    this.form1_Vis=false;
                  this.setnote('A');
                    this.progress_val=100
                  }
                  else if(response.responseCode==500 && response.data.dictionary.request!=''){

                    if(response.data.dictionary.message=="Invalid Captcha key"){
                      console.log("invalid captcha key");
                      this.Common.showErrorMessage("something went wrong");
                       return;
                    }
                    else{
                      if(response.data.dictionary.requestno){
                        this.response_code_after_submit=response.data.dictionary.requestno
                        this.form1_Vis=false;
                        this.setnote('B');
                       this.progress_val=100
                      }
                      else{
                        this.Common.showErrorMessage("something went wrong");
                        return;
                      }
                     

                    }

                  
                  }
                 
                  else{
                    this.form1_Vis=true;
                    this.Common.showErrorMessage("something went wrong"+ response.data.dictionary.message)
                    return;
                  }
          }
      })
      
      }
      ,
      (error) => {
        console.log(`Recaptcha v3 error: see console`);
        console.log(`Recaptcha v3 error:`, error);
      }
      );
    } else {
      this.Common.showErrorMessage("Please fill the mandatory Fields");
    }
  }


  setnote(type:string){
    if(type=='A'){   //new request
      this.note1="You have successfully submitted your request for company registration."
      this.note2="Our dedicated agents will now review your application, and upon approval, you will receive a confirmation email at your registered email address."
      this.note3="To proceed back to the main website, please click the button below."
    }
    else if(type=='B'){   //not approved yet

      this.note1="Thank you for submitting your request."
      this.note2="We would like to inform you that your company registration request has already been successfully submitted by " + this.common.maskEmail(this.already_reg_companyemail) + "  and is currently under process.";
      this.note3= "Rest assured, our team is diligently working on it, and we will get back to you at the earliest possible time."
      this.note4="Should you have any questions or need to communicate with us, please feel free to reach out at info@mofa.gov.ae, while kindly referring to your unique reference ID."

    }
    else if(type=='C'){   //approved already
      this.note1="Thank you for submitting your request."
      this.note2="We would like to inform you that your company registration request has already been successfully approved."
      this.note3="For more information; Kindly reach your company representative " + this.common.maskEmail(this.already_reg_companyemail)
      this.note4="Should you have any questions or need to communicate with us, please feel free to reach out at info@mofa.gov.ae, while kindly referring to your unique reference ID.";

    }

  }
  
  executeRecaptchaV3(callback: () => void) {
    
    this.recaptchaV3Service.execute('myAction').subscribe(
      (token) => {
        console.log(token)
        this.captcha_token=token;
        this.addTokenLog('Recaptcha v3 token', token);
      },
      (error) => {
        console.log(`Recaptcha v3 error: see console`);
        console.log(`Recaptcha v3 error:`, error);
      }
    );
    callback();
  }
  
  
  // executeRecaptchaV3(callback: () => void) {
    
  //   this.recaptchaV3Service.execute('myAction').subscribe(
  //     (token) => {
  //       console.log(token)
  //       this.captcha_token=token;
  //       this.addTokenLog('Recaptcha v3 token', token);
  //     },
  //     (error) => {
  //       console.log(`Recaptcha v3 error: see console`);
  //       console.log(`Recaptcha v3 error:`, error);
  //     }
  //   );
  //   callback();
  // }
  
  //OTP related functions start----------
// Generates a OTP using random numbers
  //  generateOTP(): string {
  //   const digits = '0123456789';
  //   let otp = '';
  
  //   for (let i = 0; i < 6; i++) {
  //     const randomIndex = Math.floor(Math.random() * 10);
  //     otp += digits[randomIndex];
  //   }
  
  //   return otp;
  // }

  SendOTP(){

    let data, data1;
    //const OTP=this.generateOTP();


    let email;
      let email2=this.companyDetailsForm.get('companyrep_EmailAddress')?.value;
      console.log(email2);
      if(email2==undefined ||email2===""){
        email=""
      }
      else{
        email=email2;
      }

      if(this.reg_form_data.tradeLicenseNumber==null){
        this.reg_form_data.tradeLicenseNumber=""; 
      }
      

    data={
      "uuid":this.user_info_taken_using_authtoken.uuid,
      "OTP":"",
      "tradelicenseno":this.reg_form_data.tradeLicenseNumber,
      "companyname":this.reg_form_data.name_of_Business,
      "emirate":this.reg_form_data.issuingAuthority,
      "emailID":email,

      }
      console.log(data);
      let otpresponse;
      this.common.showLoading();
      this.set_countdown();

      this.apiservice.post(this.consts.SendOTPForCompanyRegn,data).subscribe({next:(success)=>{
        this.common.hideLoading();

      otpresponse=success;
      console.log(otpresponse);
      }
      })

  }

  openOTPPopup(templateRef: TemplateRef<any>) {
      this.rep_contact_no=this.companyDetailsForm.get('companyrep_MobileNumber')?.value;
      if(this.companyDetailsForm.get('isbroker')?.value===""){
        this.radiochosenornot=true;
      }
      else{
        this.radiochosenornot=false;
      }

      if(this.companyDetailsForm.valid){
        this.SendOTP();  // writing sendOTP as a diff function so that it can be used in Resend OTP too.
        if(this.user_info_taken_using_authtoken.uuid==undefined){
          console.log("UUID is missing")

          this.common.showErrorMessage("Something went wrong")
          return;
        }
              this.dialog.open(templateRef, {
                width: '280px',
                panelClass: ['my-dialog', 'animate__animated', 'animate__zoomIn'],
                backdropClass: 'normalpopupBackdropClass',
                hasBackdrop: false, // Prevents closing on clicking outside the dialog
              });

              
            
            }
            else{// invalid form
              this.common.showErrorMessage("Please provide valid details and try again")
              return;
            }
  }

  otpInputConfig: NgxOtpInputConfig = {
    otpLength: 6,
    autofocus: true,
    classList: {
      inputBox: 'my-super-box-class',
      input: 'my-super-class',
      inputFilled: 'my-super-filled-class',
      inputDisabled: 'my-super-disable-class',
      inputSuccess: 'my-super-success-class',
      inputError: 'my-super-error-class',
    },
  };

  // handleOtpChange(value: string[]): void {
  //   console.log(value);
  // }

  set_countdown(){
      
    this.countdownMinutes = 5;
    this.countdownSeconds = 0;
    this.countdownTotalSeconds = this.countdownMinutes * 60 + this.countdownSeconds;

    interval(1000) // Timer every second
    .pipe(takeWhile(() => this.countdownTotalSeconds > 0))
    .subscribe(() => {
      this.countdownTotalSeconds--;
      this.countdownMinutes = Math.floor(this.countdownTotalSeconds / 60);
      this.countdownSeconds = this.countdownTotalSeconds % 60;

      if (this.countdownTotalSeconds === 0) {
        // Countdown has expired, show the resend link
        this.showResendLink = true;
      }
      else{
        this.showResendLink = false;
      }
    });
  }

  handleFillEvent(value: string): void {
    console.log(value);
    this.OTP_entered=value;
  }
  OTPSubmit(){

    if(this.reg_form_data.tradeLicenseNumber==null){
      this.reg_form_data.tradeLicenseNumber=""; 
    }

   let data={
      "uuid":this.user_info_taken_using_authtoken.uuid,
      "otp": this.OTP_entered,
      "tradelicenseno":this.reg_form_data.tradeLicenseNumber,
      "companyname":this.reg_form_data.name_of_Business,
    "emirate":this.reg_form_data.issuingAuthority
  }

    let OTPRetrival;
    this.common.showLoading();

    this.apiservice.post(this.consts.validateOTPforCompanyRegn,data).subscribe({next:(success:any)=>{
      this.common.hideLoading();
      OTPRetrival=success;
      if(OTPRetrival.data.dictionary.responsecode==1){
        this.Common.showSuccessMessage('OTP is verified'); // Show the verification alert
      this.OTP_verified=true;
      this.dialog.closeAll();
      }
      else{
      this.incorrectOTP = true; // set a label in the template that OTP is invalid
      this.OTP_verified=false;
      this.ngxotp.clear();

      }
    console.log(OTPRetrival);
    }
    })

  }

  

  mainpage(){
    this.router.navigateByUrl('/registration');
  }

  
 

  public addTokenLog(message: string, token: string | null) {
    console.log(`${message}: ${this.formatToken(token)}`);
  }

  public onError() {
    console.log(`reCAHPTCHA errored;`);
  }

  public formatToken(token: string | null) {
    return token !== null
      ? `${token.substring(0, 7)}...${token.substring(token.length - 7)}`
      : 'null';
  }
}
