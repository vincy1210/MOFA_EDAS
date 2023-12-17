import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/service/api.service';
import { CommonService } from 'src/service/common.service';
import { ConstantsService } from 'src/service/constants.service';
import { AuthService } from 'src/service/auth.service';

interface DeclarationAttestModel {
  data: { uuid: string; coorequestno: number, invoiceuno:number };
  attachment: File;
}


@Component({
  selector: 'app-coo-attestation-create',
  templateUrl: './coo-attestation-create.component.html',
  styleUrls: ['./coo-attestation-create.component.css'],
})
export class CooAttestationCreateComponent implements OnInit {
  sel_file_test:any;
  registrationForm!: FormGroup;
  today: Date = new Date();
  isLoading = false;
  issuingAuthorities: { typeuno: string; typename: string }[] = [];
  listOfFiles: File[] = [];
  uuid:string='';
  isButtonDisabled = false;
  constructor(
    public dialogRef: MatDialogRef<CooAttestationCreateComponent>,
    private FormBuilder: FormBuilder,
    public translate: TranslateService,
    public apiservice: ApiService,
    public consts: ConstantsService,
    private common: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any, private auth:AuthService
  ) {

    let data11=this.common.getUserProfile();
    let uuid;
    if(data11!=null || data11!=undefined){
      data11=JSON.parse(data11)
      console.log(data11.Data)
      uuid=data11.Data.uuid;
      this.uuid=uuid;
      //mobile

    }
    else{
       this.common.setlogoutreason("session");
      this.auth.logout();

    }

  }

  ngOnInit(): void {
    this.registrationForm = this.FormBuilder.group({
      coorequestno: [, Validators.required],
      uploadDeclarationFile: [, Validators.required],
      invoiceuno:[, Validators.required]
    });
    this.registrationForm.get('coorequestno')?.setValue(this.data.coorequestno);
    this.registrationForm.get('invoiceuno')?.setValue(this.data.invoiceuno);

  }

  onFileChanged(event: any) {
    console.log(event);
    this.isLoading = true;
    this.listOfFiles = [];
    var companylicense=this.auth.getSelectedCompany();
    console.log(companylicense);
    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      this.sel_file_test=selectedFile;
      if (selectedFile) {
        if (selectedFile.size <= 2 * 1024 * 1024) {
          this.listOfFiles.push(selectedFile);
          const timestamp = new Date().getTime();
          const newFileName = 'COO_'+companylicense.companyuno +'_'+timestamp+ '.pdf'; 
          const renamedFile = new File([selectedFile], newFileName, { type: selectedFile.type });
          this.sel_file_test=renamedFile;

        } else {
          this.registrationForm.get('uploadDeclarationFile')?.setValue(null);
          //alert
          this.common.showErrorMessage(
            'File size should be less than or equal to 2 MB'
          );
        }
      }
    }
    setTimeout(() => {
      // After the upload is complete
      this.isLoading = false;
    }, 3000);
  }

  removeSelectedFile(index: number) {
    this.listOfFiles.splice(index, 1);
    this.registrationForm.get('uploadDeclarationFile')?.setValue(null);
    this.registrationForm
      .get('uploadDeclarationFile')
      ?.updateValueAndValidity();
  }

  onClose(response: boolean) {
    this.dialogRef.close(response);
  }

  proceed() {
    if (this.registrationForm.valid) {
      let formData: FormData = new FormData();
      const { coorequestno } = this.registrationForm.getRawValue();
      const { invoiceuno } = this.registrationForm.getRawValue();

      const data = { uuid: this.uuid, coorequestno: coorequestno, invoiceuno:invoiceuno };
      formData.append('data', JSON.stringify(data));
      formData.append('attachment', this.sel_file_test);
      this.submitDeclarationAttestations(formData);
    } else {
      // alert
      this.common.showErrorMessage('Fill mandatory fields');
    }
  }

  submitDeclarationAttestations(data: FormData) {
    this.common.showLoading();

    this.apiservice
      .post(this.consts.updateCOORequests, data)
      .subscribe((response: any) => {
        this.common.hideLoading();

        const dataArray = response;
        if (`${response.responsecode}` === '1') {
          //alert
          this.common.showSuccessMessage(`COO Request Send for Approval`);
          this.clearDatas();
          this.onClose(true);
        } else {
          //alert
          this.common.showErrorMessage(`${dataArray.message}`);
        }
      });
  }

  clearDatas() {
    this.registrationForm.reset();
  }

  capitalizeInput(event: any) {
    this.registrationForm
      .get('declarationCurrency')
      ?.setValue(event.target.value.toUpperCase());
  }

  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const base64String = (e.target as any).result.split(',')[1];
        resolve(base64String);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }
}
