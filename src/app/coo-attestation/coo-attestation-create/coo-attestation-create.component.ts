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

interface DeclarationAttestModel {
  data: { uuid: string; coorequestno: number };
  attachment: File;
}

@Component({
  selector: 'app-coo-attestation-create',
  templateUrl: './coo-attestation-create.component.html',
  styleUrls: ['./coo-attestation-create.component.css'],
})
export class CooAttestationCreateComponent implements OnInit {
  registrationForm!: FormGroup;
  today: Date = new Date();
  isLoading = false;
  issuingAuthorities: { typeuno: string; typename: string }[] = [];
  listOfFiles: File[] = [];

  constructor(
    public dialogRef: MatDialogRef<CooAttestationCreateComponent>,
    private FormBuilder: FormBuilder,
    public translate: TranslateService,
    public apiservice: ApiService,
    public consts: ConstantsService,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.FormBuilder.group({
      coorequestno: [, Validators.required],
      uploadDeclarationFile: [, Validators.required],
    });
    this.registrationForm.get('coorequestno')?.setValue(this.data.coorequestno);
  }

  onFileChanged(event: any) {
    this.isLoading = true;
    this.listOfFiles = [];
    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      if (selectedFile) {
        if (selectedFile.size <= 2 * 1024 * 1024) {
          this.listOfFiles.push(selectedFile);
        } else {
          this.registrationForm.get('uploadDeclarationFile')?.setValue(null);
          //alert
          this.commonService.showErrorMessage(
            'File size exceeds the allowed limit (2 MB).'
          );
        }
      }
    }
    this.isLoading = false;
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
      const data = { uuid: '211', coorequestno: coorequestno };
      formData.append('data', JSON.stringify(data));
      formData.append('attachment', this.listOfFiles[0]);
      this.submitDeclarationAttestations(formData);
    } else {
      // alert
      this.commonService.showErrorMessage('Fill mandatory fields!!!');
    }
  }

  submitDeclarationAttestations(data: FormData) {
    this.apiservice
      .post(this.consts.updateCOORequests, data)
      .subscribe((response: any) => {
        const dataArray = response;
        if (`${response.responsecode}` === '1') {
          //alert
          this.commonService.showSuccessMessage(`Successfully submitted`);
          this.clearDatas();
          this.onClose(true);
        } else {
          //alert
          this.commonService.showErrorMessage(`${dataArray.message}`);
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
