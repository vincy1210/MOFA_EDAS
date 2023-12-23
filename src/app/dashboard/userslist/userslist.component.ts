import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/service/common.service';
import { Router } from '@angular/router';
import { ConstantsService } from 'src/service/constants.service';
import { ApiService } from 'src/service/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Tooltip } from 'primeng/tooltip';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/service/auth.service';

// import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-userslist',
  templateUrl: './userslist.component.html',
  styleUrls: ['./userslist.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class UserslistComponent implements OnInit {

  selectedAttestations:any;
  totalrecords:number=0;
  list:any;
  cols:any;
  loading:any
  enableFilters:any;
  oneMonthAgo = new Date();
todayModel:Date=new Date();
  today:any;
  form:FormGroup;
  AddUserDialog:boolean=false;
  legalTypeOptions:any;
  currentcompany:any;
  currentcompany_name:any;
  

  uuid:string='';
  user_mailID:string='';
  contactno:string='';
  dialogTitle: string = 'Add User'; // Default title for adding a new user
  dialogActionButtonLabel: string = 'Save'; 
  // dialogMode:string='Add';
  radiochosenornot:boolean=false;
  isButtonDisabled = false;
  constructor(public common:CommonService, private fb:FormBuilder, private router:Router, private consts:ConstantsService, private apicall:ApiService,
    private messageService: MessageService, private confirmationService: ConfirmationService, private translate:TranslateService, private auth:AuthService) {
      this.oneMonthAgo.setMonth(this.oneMonthAgo.getMonth() - 1);

    this.currentcompany=this.auth.getSelectedCompany()?.companyuno;
    this.currentcompany_name=this.auth.getSelectedCompany()?.business_name;
    console.log(this.currentcompany)
    if(this.currentcompany==null){
      console.log("to landing page from userlist page line 53")

      this.router.navigateByUrl('/landingpage')
    }

    this.cols = [
      { field: 'edasattestno', header: 'Emirates ID' },
      { field: 'invoicenumber', header: 'Name' },
      { field: 'declarationumber', header: 'Role' },
      { field: 'attestreqdate', header: 'Email ID' },
      { field: 'mobilenumber', header: 'Mobile' },
      { field: 'enteredon', header: 'Created By' },
      { field: 'enteredby', header: 'Created' }

  ];

  this.form=this.fb.group({
    company:[this.currentcompany_name,Validators.required, ],
    username:['',[Validators.required, Validators.pattern('^(?=.*\\S).+$')]],
    emiratesID:['',[Validators.required,this.emiratesIDValidator()]],
    emailaddress:['',[Validators.required, Validators.email]],
    mobilenumber:['',[Validators.required, Validators.maxLength(9), Validators.minLength(9), Validators.pattern(/^5\d+$/)]],
    role:['',Validators.required],
    gender:['Female', Validators.required],
    useruno:[0]

  })
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
      this.user_mailID=data11.Data.email;
      this.contactno=data11.Data.mobile;
      //mobile

    }
    this.InitTable();
    
  }

  exportExcel(){

  }
  clickChips() {
    this.enableFilters = !this.enableFilters;
  }
  
  InitTable(){
    let resp;
    let data={
      "uuid":this.uuid,
      "companyuno": this.currentcompany,
        }
        this.common.showLoading();
            this.apicall.post(this.consts.getCompanyUserList,data).subscribe({next:(success:any)=>{
        this.common.hideLoading();

              resp=success;
              if(resp.responsecode==1){
              this.list=resp.data
              // this.common.showSuccessMessage('Data retrived'); // Show the verification alert
              }
              else{
               // this.common.showErrorMessage('Data retrived Failed')
               this.common.showErrorMessage('Something went wrong')

                this.loading=false;
              }
        
            }
          })

  }
  AdduserModal(){

  }

  hideDialog() {
    this.AddUserDialog = false;
   
  }
  openDialog() {

    this.isButtonDisabled = false;
    this.radiochosenornot=false;
    this.form.reset();
    // this.form.clearValidators();
    // this.form.updateValueAndValidity();

    this.form.patchValue({
      company:this.currentcompany_name,
    })
    this.dialogTitle = 'Add User';
    this.dialogActionButtonLabel = 'Save'; 
    this.AddUserDialog=true
  
}
createdtime:any;
createdby:string='';
last_modifiedtime:any;
last_modifiedby:string='';
editDialog(currentrow:any){

  this.isButtonDisabled = false;

  if(this.form.get('gender')?.value==="" || this.form.get('gender')?.value==null || this.form.get('gender')?.value==undefined){
    this.radiochosenornot=true;
  }
  else{
    this.radiochosenornot=false;
  }

  this.dialogTitle = 'Edit User';
  this.dialogActionButtonLabel = 'Update'; 

  console.log(currentrow);
  this.AddUserDialog=true;
  this.form.patchValue({
    company:this.currentcompany_name,
    username: currentrow.fullnameen,
    gender:currentrow.gender,
    emailaddress:currentrow.emailid,
    mobilenumber:currentrow.mobilenumber,
    role:currentrow.usertype,
    emiratesID:currentrow.eid,
    useruno:currentrow.useruno
    // ... other form fields
  });
  this.createdtime=this.common.splitdatetime(currentrow.enteredon) || '';
  this.createdby=currentrow.enteredby;
this.last_modifiedtime=this.common.splitdatetime(currentrow.modifiedon) || '';
this.last_modifiedby=currentrow.modifiedby;

}

onSubmitDialogModal(){
  
  if(this.form.get('gender')?.value==="" || this.form.get('gender')?.value==null || this.form.get('gender')?.value==undefined){
    this.radiochosenornot = true;
  } else {
    this.radiochosenornot = false;
  }

  if(this.form.invalid){
    let formdata={...this.form.value}
    console.log(formdata);
    this.form.markAllAsTouched();
    return;
  }

  let formdata={...this.form.value}
  console.log(formdata);
  let roleuno;
  let isadmin;
  if(formdata.role==="ADMIN"){
    roleuno=1;
    isadmin=1;
  }
  else{
    isadmin=0;
    roleuno=2;
  }
  let resp;

  let removed_hyphen=formdata.emiratesID.replace(/-/g, '');
    let data={
      "p_emiratesid":removed_hyphen,
      "p_uuid":this.uuid,
      "p_companyuno":this.currentcompany,
      "p_usertype":formdata.role,
      "p_mobile":formdata.mobilenumber,
      "p_email":formdata.emailaddress,
      "p_fullnameen":formdata.username,
      "p_fullnamear":"0",
      "p_firstnameen":"0",
      "p_firstnamear":"0",
      "p_lastnameen":"0",
      "p_lastnamear":"0",
      "p_nationalityen":"0",
      "p_nationalityar":"0",
      "p_gender": formdata.gender,
      "p_idtype":"EmiratesID",
      "p_titleen":"0",
      "p_titlear":"0",
      "p_isadmin":isadmin,
      "p_hasmultiplecompanyaccess":0,
      "p_useruno":0,
      "p_roleuno":roleuno,
      "p_action":"ADD"
      }

      if(this.dialogActionButtonLabel==="Save"){
        this.common.showLoading();
        this.isButtonDisabled = true;
            this.apicall.post(this.consts.managecompanyuser,data).subscribe({next:(success:any)=>{
        this.common.hideLoading();
        
              resp=success;
              if(resp.responsecode==1){
            // this.list=resp.data
              this.common.showSuccessMessage(this.translate.instant('Item_Created_Successfully')); // Show the verification alert
              this.hideDialog();
              this.InitTable();
              }
              else{
                this.isButtonDisabled = false;
                this.common.showErrorMessage('Something went wrong')
                this.loading=false;
              }
            },
            error: (error: any) => {
              this.isButtonDisabled = false;
              console.error('Error:', error); // Log the error for debugging
              this.common.showErrorMessage(error.error.data);
              this.loading = false;
              this.common.hideLoading();
            }

          })

      }
      else{
        data.p_action="UPDATE";
        data.p_useruno=formdata.useruno;
        this.common.showLoading();
        this.isButtonDisabled = true;
        this.apicall.post(this.consts.managecompanyuser,data).subscribe({next:(success:any)=>{
        this.common.hideLoading();

          resp=success;
          if(resp.responsecode==1){
        // this.list=resp.data
          this.common.showSuccessMessage(this.translate.instant('Item_Modified_Successfully')); // Show the verification alert
          this.hideDialog();
          this.InitTable();
          }
          else{
            this.isButtonDisabled = false;
            this.common.showErrorMessage('Something went wrong')
            this.loading=false;
          }
        },
        error: (error: any) => {
          this.isButtonDisabled = false;
          console.error('Error:', error); // Log the error for debugging
          this.common.showErrorMessage(error.error.data);
          this.loading = false;
          this.common.hideLoading();
        }
      })

      }
}

deleteuser(currentrow:any){
  console.log(currentrow);
  let roleuno;
  let isadmin;
  if(currentrow.usertype==="ADMIN"){
    roleuno=1;
    isadmin=1;
  }
  else{
    isadmin=0;
    roleuno=2;
  }

  let resp;
    let data={
      "p_emiratesid":currentrow.eid,
      "p_uuid":this.uuid,
      "p_companyuno":this.currentcompany,
      "p_usertype":currentrow.usertype,
      "p_mobile":currentrow.mobilenumber,
      "p_email":currentrow.emailid,
      "p_fullnameen":currentrow.fullnameen,
      "p_fullnamear":"0",
      "p_firstnameen":"0",
      "p_firstnamear":"0",
      "p_lastnameen":"0",
      "p_lastnamear":"0",
      "p_nationalityen":"0",
      "p_nationalityar":"0",
      "p_gender": currentrow.gender,
      "p_idtype":"EmiratesID",
      "p_titleen":"0",
      "p_titlear":"0",
      "p_isadmin":isadmin,
      "p_hasmultiplecompanyaccess":0,
      "p_useruno":currentrow.useruno,
      "p_roleuno":roleuno,
      "p_action":"DELETE"
      }
      this.common.showLoading();

      this.apicall.post(this.consts.managecompanyuser,data).subscribe({next:(success:any)=>{
        this.common.hideLoading();

        resp=success;
        if(resp.responsecode==1){
      // this.list=resp.data
        this.common.showSuccessMessage(this.translate.instant('Item_Deleted_Successfully')); // Show the verification alert
        this.hideDialog();
        this.InitTable();
        }
        else{
          this.common.showErrorMessage('Delete failed.')
          this.loading=false;
        }
      }
    })
   
}

deleteuserpopup(list:any){
  this.confirmationService.confirm({
    message: this.translate.instant('Are you sure you want to delete the selected user?'),
    header: 'Confirm',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
        // this.invoicesData = this.invoicesData.filter((val:any) => !this.selectedAttestations?.includes(val)); 
        // this.selectedAttestations = null;
        this.deleteuser(list)

       //start

       //end
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: this.translate.instant('Deleted Successfully'), life: 3000 });
    }
});
//this.totalrecords=this.invoicesData.length;
}

emiratesIDValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const emiratesIDPattern = /^\d{3}-\d{4}-\d{7}-\d{1}$/;

    if (control.value && !emiratesIDPattern.test(control.value)) {
      console.log("'"+control.value+"'")
      console.log("invalid")
      return { invalidEmiratesID: true };
    }

    return null;
  };
}

onInput(event: Event): void {
  const inputElement = event.target as HTMLInputElement;
  // Filter out non-digit characters
  this.form.get('mobilenumber')?.setValue(inputElement.value.replace(/[^0-9]/g, ''));
}
}
