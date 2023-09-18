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
  attesttypeuno: number;
  declarationno: number;
  attestDocName: string;
  uuid: string;
  token: string;
  processname: string;
  attestFile: string;
}

@Component({
  selector: 'app-completed-attestation-create',
  templateUrl: './completed-attestation-create.component.html',
  styleUrls: ['./completed-attestation-create.component.css']
})
export class CompletedAttestationCreateComponent implements OnInit {
  registrationForm!: FormGroup;
  today: Date = new Date();
  isLoading = false;
  issuingAuthorities: { typeuno: string; typename: string }[] = [];
  listOfFiles: File[] = [];

  constructor(
    public dialogRef: MatDialogRef<CompletedAttestationCreateComponent>,
    private FormBuilder: FormBuilder,
    public translate: TranslateService,
    public apiservice: ApiService,
    public consts: ConstantsService,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.FormBuilder.group({
      declarationId: [, Validators.required],
      uploadDeclarationFile: [, Validators.required],
    });
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
    this.registrationForm.get('uploadDeclarationFile')?.updateValueAndValidity();
  }

  validateNumericInput(control: FormControl) {
    const numericValue = parseFloat(control.value);
    if (isNaN(numericValue) || !Number.isFinite(numericValue)) {
      return { numericInput: true };
    }
    return null;
  }

  onClose(response: boolean) {
    this.dialogRef.close(response);
  }

  proceed() {
    if (this.registrationForm.valid) {
      const {
        declarationId,
      } = this.registrationForm.getRawValue();
      this.convertToBase64(this.listOfFiles[0])
        .then((base64String) => {
          const data: DeclarationAttestModel = {
            attesttypeuno: 1,
            uuid: '12212',
            token: 'tl122',
            declarationno: declarationId,
            attestDocName: this.listOfFiles[0].name,
            processname: 'declaration',
            attestFile: base64String,
          };
          this.submitDeclarationAttestations(data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      // alert
      this.commonService.showErrorMessage('Fill mandatory fields!!!');
    }
  }

  submitDeclarationAttestations(data: DeclarationAttestModel) {
    this.apiservice
      .post(this.consts.invoiceAttestation, data)
      .subscribe((response: any) => {
        const dataArray = response.data;
        if (`${response.responseCode}` === '200') {
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

