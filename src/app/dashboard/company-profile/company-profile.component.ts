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
import { AuthService } from 'src/service/auth.service';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {

  companyDetailsForm: FormGroup;//
  prefform:FormGroup;
  reg_form_data:any;
  today: Date = new Date(); 
   attestfilelocation:string=''
   
  legalTypeOptions: { typeuno: string; typename: string }[] = [];
  companytypeoptions:  { itemno: string; itemcode: string }[] = [];
  hide = true;
  list1:any;

list:any;
  isadmin:boolean=false;

  AddInvoiceDialog: boolean = false;
  AddInvoiceDialogprefemail:boolean=false
  currentcompany:any;
  uuid:any;
  loading:any
cols:any;
totalrecords:any;
prefemailaddresstodisplay:string='';
currentLanguagecode: string='1033';
currentrow:any;
fields:any;
  constructor(private router:Router,private formBuilder:FormBuilder, public common:CommonService, private auth:AuthService, private apicall:ApiService, private consts:ConstantsService) {


    let selectedlanguage = sessionStorage.getItem('language') || 'en';

    if(selectedlanguage==='ar'){
        this.currentLanguagecode='14337'
    }
    else{
      this.currentLanguagecode='1033'

    }
   console.log(this.currentLanguagecode);
    this.cols = [
      { field: 'eid', header: 'Emirates ID' },
      { field: 'fullnameen', header: 'User Name' },
      { field: 'usertype', header: 'Role' },
      
      { field: 'emailid', header: 'Email ID' },
      { field: 'mobilenumber', header: 'mobilenumber' },
      { field: 'enteredby', header: 'Created By' },
      { field: 'enteredon', header: 'Created' }

  ];
    // this.currentcompany_name=this.auth.getSelectedCompany()?.business_name;
    let abc=this.auth.getmycompanyprofile() || '';
    let def=JSON.parse(abc);
    console.log(abc);
    this.list1=def;
this.attestfilelocation=def.attachment;
    // if(abc){
      this.companyDetailsForm=this.formBuilder.group({
        name_of_Business:[def.nameofbusiness],
        trade_Licence:[this.common.decryptWithPrivateKey(def.tradelicenseno)],
        trade_Licence_Issue_Date:[def.licenseissuedate],
        trade_Licence_Expiry_Date:[def.licenseexpirydate],
        Licence_issuing_auth:[def.licenseissuingauthority, [ Validators.pattern('^(?=.*\\S).+$')]],
        legal_Type:[def.legaltypeuno, ],
        Comp_Reg_Email_Address:[this.common.decryptWithPrivateKey(def.companyemailaddress), [ Validators.email]],
        //'^5\\d+$'
        Comp_contact_number:[this.common.decryptWithPrivateKey(def.companycontactno), [Validators.maxLength(9), Validators.minLength(9), Validators.pattern(/^5\d+$/)]],
        Upload_trade_license:[''],
        auth_code:['']


        // name_of_Business:[def.nameofbusiness],
        // trade_Licence:[def.tradelicenseno],
        // trade_Licence_Issue_Date:[def.licenseissuedate, Validators.required],
        // trade_Licence_Expiry_Date:[def.licenseexpirydate, Validators.required],
        // Licence_issuing_auth:[def.licenseissuingauthority, [Validators.required, Validators.pattern('^(?=.*\\S).+$')]],
        // legal_Type:[def.legaltypeuno, Validators.required],
        // Comp_Reg_Email_Address:[def.companyemailaddress, [Validators.required, Validators.email]],
        // //'^5\\d+$'
        // Comp_contact_number:[def.companycontactno, [Validators.required, Validators.maxLength(9), Validators.minLength(9), Validators.pattern(/^5\d+$/)]],
        // Upload_trade_license:['', Validators.required],
        // auth_code:['', Validators.required]
      })

      if(this.list1.preferredemailaddress==='' || this.list1.preferredemailaddress==null){
        this.prefemailaddresstodisplay=this.list1.companyemailaddress
      }
      else{
        this.prefemailaddresstodisplay=this.list1.preferredemailaddress
      }

      this.prefform=this.formBuilder.group({
        prefemailaddress:[common.decryptWithPrivateKey(def.preferredemailaddress), [Validators.required,Validators.pattern('^(?=.*\\S).+$')]],
        prefcomtype:[def.companytypeuno, Validators.required]

      })

      if(def.rolename=='Admin'){
        this.isadmin=true;
      }
      else{
        this.isadmin=false;
      }



      let data={
        "useruno":"1",
        "languagecode":this.currentLanguagecode
      }
    
      this.apicall.post(this.consts.GetLegalTypes, data).subscribe((response: any) => {
        this.common.hideLoading();

        const dataArray = response.data; // Access the 'data' property from the response
        console.log(dataArray);
        this.legalTypeOptions=dataArray.dictionary.data;
        console.log(dataArray)
      });
    


    


   }

  ngOnInit(): void {


    let currcompany  =this.auth.getSelectedCompany();
    

  if(currcompany){
    this.currentcompany=currcompany.companyuno;
    if(this.currentcompany==null || this.currentcompany==undefined || this.currentcompany===''){
      this.router.navigateByUrl('/landingpage')
    }
  }
  else{
    this.common.redirecttologin();
    return;
  }
    let data11=this.common.getUserProfile();
    let uuid;
    if(data11!=null || data11!=undefined){
      data11=JSON.parse(data11)
      console.log(data11.Data)
      uuid=data11.Data.uuid;
      this.uuid=uuid;
      // this.user_mailID=data11.Data.email;
      // this.contactno=data11.Data.mobile;
      //mobile

    }

this.InitTable();

    // let findisadmin=this.auth.getSelectedCompany();
    // console.log(findisadmin)
  }


  @ViewChild('attachments') attachment: any;
  @ViewChild('ngxotp') ngxotp: any; // Reference to the ngx-otp-input component
  @ViewChild('fileInput') fileInput: any;

  fileList: File[] = [];
  listOfFiles: any[] = [];
  isLoading = false;
  sitekey:string='';
  sel_file_test:any;

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
  

  openNew() {
    let abc=this.auth.getmycompanyprofile() || '';
    let def=JSON.parse(abc);
    console.log(abc);
this.attestfilelocation=def.attachment;

let legalTypeName = '';
  const legalTypeUno = def.legaltypeuno;
  for (const legalType of this.legalTypeOptions) {
    if (legalType.typeuno === legalTypeUno) {
      legalTypeName = legalType.typename;
      break;
    }
  }
  console.log('Legal type name:', legalTypeName);
    let data={
      company:def.nameofbusiness,
      tradelicense:this.common.decryptWithPrivateKey(def.tradelicenseno),
      trade_Licence_Issue_Date: this.common.splitdatetime(def.licenseissuedate)?.date ,
      trade_Licence_Expiry_Date: this.common.splitdatetime(def.licenseexpirydate)?.date,
      Licence_issuing_auth: def.licenseissuingauthority,
      legal_Type:legalTypeName,
      Comp_Reg_Email_Address:this.common.decryptWithPrivateKey(def.companyemailaddress),
      Comp_contact_number:this.common.decryptWithPrivateKey(def.companycontactno),
    }
    this.openNew1(data);
  }

  openNew1(data:any) {
    console.log(data);
    this.currentrow=data;
  
    this.AddInvoiceDialog=true
    const fieldMappings: { [key: string]: string } = {
      company: 'Company Name',
      tradelicense: 'Trade license no',
      trade_Licence_Issue_Date: 'Trade license Issue date',
      trade_Licence_Expiry_Date: 'Trade license Expiry Date',
      Licence_issuing_auth: 'License Issuing authority',
      // legal_Type: 'Legal Type',
      Comp_Reg_Email_Address: 'Email Address',
      Comp_contact_number: 'Contact No',
    };
  
    if (data) {
      this.fields = Object.keys(fieldMappings).map(key => {
        let value = data[key];
        return {
          label: fieldMappings[key],
          value: value
        };
      });
    }
    
  
  }

  
  InitTable(){
    let resp;
    let data={
      "uuid":this.uuid,
      "companyuno": this.currentcompany,
      "isapplnadmin":0
        }
        this.common.showLoading();
        this.loading=true;
        this.apicall.post(this.consts.getCompanyUserList, data).subscribe({
          next: (success: any) => {
            this.common.hideLoading();
            this.loading = false;
            resp = success;
            if (resp.responsecode == 1) {
              this.list = resp.data;
              // this.common.showSuccessMessage('Data retrieved'); // Show the success message
            } else {
              // this.common.showErrorMessage('Data retrieval failed')
              this.common.showErrorMessage('Something went wrong');
            }
          },
          error: (error: any) => {
            if (error.status === 401) {
              console.log("in 401")
              // Handle 401 Unauthorized error here
              // For example, redirect to login page or show an error message
              this.common.showErrorMessage('Something went wrong');
              // You can also navigate to the login page or perform other actions as needed.
            } else {
              // Handle other errors here
              this.common.showErrorMessage('Something went wrong');
            }
            this.common.hideLoading();
            this.loading = false;
          }
        });
        

  }
  updateprefemailopenpopup(){
   


    let data2={
      "uuid": this.uuid,
      "languagecode": this.currentLanguagecode, // 14337, 1033
      "processname": "COMPANYTYPE"
    }
  
  
    this.AddInvoiceDialogprefemail=true;

    this.apicall.post(this.consts.getListOfValues, data2).subscribe((response: any) => {
      this.common.hideLoading();

      const dataArray = response.data; // Access the 'data' property from the response
      console.log(dataArray);
      this.companytypeoptions=dataArray;
      console.log(this.companytypeoptions)
    });
  

  }

  updateprefemail(){

    const form = { ...this.prefform.value };

    if(this.prefform.valid){

      
            let data2={
              "uuid": this.uuid,
              "companyuno":this.currentcompany,
              "preferredemail":form.prefemailaddress,
              "companytypeuno":form.prefcomtype
            }
            this.AddInvoiceDialogprefemail=false;
this.common.showLoading();
            this.apicall.post(this.consts.updateCompanyProfile, data2).subscribe((response: any) => {
              this.common.hideLoading();
              this.prefemailaddresstodisplay=form.prefemailaddress;
              if(response.status==='Success'){
                this.common.showSuccessMessage('Item updated successfully');
                return;
              }
              else{
                this.common.showErrorMessage(response.status);
                return;
              }
            });
          }
          else{
            this.prefform.markAllAsTouched();
            return;
          }

    }
   
    
}
