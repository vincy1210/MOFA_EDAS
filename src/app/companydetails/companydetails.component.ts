import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
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

@Component({
  selector: 'app-companydetails',
  templateUrl: './companydetails.component.html',
  styleUrls: ['./companydetails.component.css']
})
export class CompanydetailsComponent implements OnInit {
  companyDetailsForm: FormGroup;//
  legalTypeOptions: { typeuno: string; typename: string }[] = [];
  TemplateRef: any;

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
  freezonelist:any;

  constructor(private common:CommonService ,private _activatedRoute: ActivatedRoute,private formBuilder:FormBuilder, public dialog: MatDialog, private Common:CommonService, public apiservice:ApiService, public consts:ConstantsService, public router:Router) {



    this.Common.getData().subscribe(data => {
      this.reg_form_data = data;
      console.log(this.reg_form_data)
    });

    if(this.reg_form_data===""){
      this.router.navigateByUrl("/registration");
      this.common.showErrorMessage("Issue in Fetching form!")
    }

    let license_issuing_auth;
    
    if(this.reg_form_data.expressType==="Freezone"){

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
      license_issuing_auth=this.reg_form_data.expressType
    }

    this.companyDetailsForm=this.formBuilder.group({
      name_of_Business:['', [Validators.required,Validators.pattern('^(?=.*\\S).+$')]],
      trade_Licence:[this.reg_form_data.tradeLicenseNumber, [Validators.required,Validators.pattern('^(?=.*\\S).+$')]],
      trade_Licence_Issue_Date:[this.reg_form_data.chosenDate, Validators.required],
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
      isbroker: ['', Validators.required],

    })
    
   }

   private _dialogRef: any;
   dialogRef: any;
   rep_contact_no='';
   typeExpress:any;
 
   onNoClick(): void {
     this.dialogRef.close();
   }
   radiochosenornot:boolean=false;
   

  ngOnInit(): void {

    this.Common.getUserIfoData().subscribe(data => {
      this.user_info_taken_using_authtoken = data;
      console.log(this.user_info_taken_using_authtoken)
    });

    this.typeExpress=['yes', 'No']

let response;
let data={
  "useruno":"1"
}


this.apiservice.post(this.consts.GetLegalTypes, data).subscribe((response: any) => {
  const dataArray = response.data; // Access the 'data' property from the response
  console.log(dataArray);
  this.legalTypeOptions=dataArray.dictionary.data;
  console.log(dataArray)
});

  }

  @ViewChild('attachments') attachment: any;
  @ViewChild('ngxotp') ngxotp: any; // Reference to the ngx-otp-input component

  fileList: File[] = [];
  listOfFiles: any[] = [];
  isLoading = false;

  onFileChanged(event: any) {
    this.isLoading = true;
    this.fileList=[];
    this.listOfFiles=[];
    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      this.sel_file_test=selectedFile;
        this.fileList.push(selectedFile);
        this.listOfFiles.push(selectedFile.name);
    }
    this.isLoading = false;
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

  submit(){
    console.log(this.fileList)
    let response;
    const form={...this.companyDetailsForm}
    console.log(form.value)

    if(this.companyDetailsForm.get('isbroker')?.value===""){
      this.radiochosenornot=true;
    }
    else{
      this.radiochosenornot=false;
    }


    console.log(this.user_info_taken_using_authtoken)

    if(this.companyDetailsForm.valid){
    let data={
      "emiratesId": this.user_info_taken_using_authtoken.idn,   // UAE pass frields start
      "uuid": this.user_info_taken_using_authtoken.uuid,
      "token": this.user_info_taken_using_authtoken.Token,
      "useruno": "0",     //find out
      
      "companyname":form.value.name_of_Business,
      "tradelicensenumber": form.value.trade_Licence,
      "tradelicenseissuedate": this.Common.convertISOToCustomFormat(form.value.trade_Licence_Issue_Date) ,
      "tradelicenseexpirydate": this.Common.convertISOToCustomFormat(form.value.trade_Licence_Expiry_Date),
      "licenseissuingauthority": form.value.Licence_issuing_auth, //freetext
      "companyregisteredemailaddress": form.value.Comp_Reg_Email_Address,
      "companycontactnumber": form.value.Comp_contact_number,
      "HASATTACHMENT": "0",
      "attachment": form.value.trade_Licence,
      "representativeemailaddress": form.value.companyrep_EmailAddress,
      "mobilenumber": form.value.companyrep_MobileNumber,
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
      "legaltypeuno": form.value.legal_Type,
      "repfullnameen":form.value.companyrep_fullname,
      "repfullnamear":form.value.companyrep_fullname,
      "licenseissuingauthorityemirate":this.reg_form_data.issuingAuthority,  //dropdown
      "IssuingAuthorityType":this.reg_form_data.expressType,
      "captchkey":"yguuyyhhyhbhb",
      "isbroker":form.value.isbroker,

    }

    let data111={...data,...this.user_info_taken_using_authtoken}
    console.log(data111);
    this.apiservice.registerCompanyAttachment(this.consts.registercompany ,this.sel_file_test,data).pipe(takeWhile(() => this.alive)).subscribe({
      next: (success)=>{
              response=success;
              console.log(response);
              if(response.responseCode==200){
                this.response_code_after_submit=response.data.dictionary.requestno
                this.form1_Vis=false;
                this.note1="You have successfully submitted your request for company registration."
                this.note2="Our dedicated agents will now review your application, and upon approval, you will receive a confirmation email at your registered email address."
                this.note3="To proceed back to the main website, please click the button below."
                this.progress_val=100
              }
              else if(response.responseCode==400){
                this.response_code_after_submit=response.data.dictionary.requestno
                this.form1_Vis=false;
                this.note1="Thank you for submitting your request."
                this.note2="We would like to inform you that your request has already been successfully submitted and is currently under process."
                this.note2=this.note2+ "Rest assured, our team is diligently working on it, and we will get back to you at the earliest possible time."
                this.note3="Should you have any questions or need to communicate with us, please feel free to reach out at info@mofa.gov.ae, while kindly referring to your unique reference ID."
                this.progress_val=100
                
              }
              else if(response.responseCode=500){
                if(response.data.dictionary.message==="ORA-00001: unique constraint (MOFA_ADMIN.UK_COMPANY_REG) violated"){
                  this.Common.showErrorMessage("License Already Registered!")
                  return;
                }
                else{
                  this.Common.showErrorMessage("something went wrong!!"+ response.data.message)
                  return;
                }
              }
              else{
                this.form1_Vis=true;
                this.Common.showErrorMessage("something went wrong!!"+ response.data.message)
                return;
              }
      }
  })
  
}
else{
  this.Common.showErrorMessage("Please fill the mandatory Fields!!")
}
  }

  //OTP related functions start----------
// Generates a OTP using random numbers
   generateOTP(): string {
    const digits = '0123456789';
    let otp = '';
  
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * 10);
      otp += digits[randomIndex];
    }
  
    return otp;
  }

  SendOTP(){

    let data;

    data={
      "uuid":this.user_info_taken_using_authtoken.uuid,
      "otp":this.generateOTP(),
      "tradelicenseno":this.reg_form_data.tradeLicenseNumber
      }

      console.log(data);
      let otpresponse;

      this.apiservice.post(this.consts.SendOTPForCompanyRegn,data).subscribe({next:(success)=>{
      otpresponse=success;
      console.log(otpresponse);
      }
      })

  }

  openOTPPopup(templateRef: TemplateRef<any>) {
      this.rep_contact_no=this.companyDetailsForm.get('companyrep_MobileNumber')?.value;

      // if(this.rep_contact_no===""){
      //  this.Common.showErrorMessage('Enter Representative number to proceed');
      //  return;
      // }
      // else
      // {

      if(this.companyDetailsForm.get('isbroker')?.value===""){
        this.radiochosenornot=true;
      }
      else{
        this.radiochosenornot=false;
      }

      if(this.companyDetailsForm.valid){
        this.SendOTP();  // writing sendOTP as a diff function so that it can be used in Resend OTP too.
        if(this.user_info_taken_using_authtoken.uuid==undefined||this.reg_form_data.tradeLicenseNumber==undefined){
          this.common.showErrorMessage("UUID or tradelicence no is missing!!")
          return;
        }
              this.dialog.open(templateRef, {
                width: '280px',
                panelClass: ['my-dialog','animate__animated','animate__zoomIn'],
                backdropClass: 'normalpopupBackdropClass',
              });
              this.countdownMinutes = 2;
              this.countdownSeconds = 40;
              this.countdownTotalSeconds = this.countdownMinutes * 60 + this.countdownSeconds;

              interval(1000) // Timer every second
              .pipe(takeWhile(() => this.countdownTotalSeconds > 0))
              .subscribe(() => {
                this.countdownTotalSeconds--;
                this.countdownMinutes = Math.floor(this.countdownTotalSeconds / 60);
                this.countdownSeconds = this.countdownTotalSeconds % 60;
              });
            }
            else{// invalid form
              this.common.showErrorMessage("Provide valid details and Try Again!!")
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

  handleFillEvent(value: string): void {
    console.log(value);
    this.OTP_entered=value;
  }
  OTPSubmit(){

   let data={
      "uuid":this.user_info_taken_using_authtoken.uuid,
      "otp": this.OTP_entered,
      "tradelicenseno":this.reg_form_data.tradeLicenseNumber
  }

    let OTPRetrival;

    this.apiservice.post(this.consts.SendOTPForCompanyRegn,data).subscribe({next:(success:any)=>{
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

//Test Data
    // if (this.OTP_entered === '123456') {
    //   this.Common.showSuccessMessage('OTP is verified'); // Show the verification alert
    //   this.OTP_verified=true;
    //   this.dialog.closeAll();
    // } else {
    //   // Handle incorrect OTP case here if needed
    //   this.incorrectOTP = true; // set a label in the template that OTP is invalid
    //   this.OTP_verified=false;
    //   this.ngxotp.clear();
    // }

  }

  //OTP related functions end
  

  // radio(event:any){

  //   console.log(event.value);
  //   var issuing_auth=event.value
  //   this.i=issuing_auth;
  //   console.log(issuing_auth);
  //   console.log(this.expressType)

  // }

  mainpage(){
    this.router.navigateByUrl('/registration');
  }


 
  

}
