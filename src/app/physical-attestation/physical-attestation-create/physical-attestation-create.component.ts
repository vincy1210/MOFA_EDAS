import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/service/api.service';
import { CommonService } from 'src/service/common.service';
import { ConstantsService } from 'src/service/constants.service';

interface InvoiceAttestModel {
  attesttypeuno: number;
  uuid: string;
  token: string;
  invoiceno: string;
  invoicecurrency: string;
  invoiceamount: number;
  invoicedate: string | undefined;
  issuingauthorityuno: number;
  attestDocName: string;
  processname: string;
  qrCodeRequired: number;
  attestFile: string;
}

@Component({
  selector: 'app-physical-sttestation-create',
  templateUrl: './physical-attestation-create.component.html',
  styleUrls: ['./physical-attestation-create.component.css'],
})
export class PhysicalAttestationCreateComponent implements OnInit {
  registrationForm!: FormGroup;
  today: Date = new Date();
  isLoading = false;
  issuingAuthorities: { typeuno: string; typename: string }[] = [];
  listOfFiles: File[] = [];

  constructor(
    public dialogRef: MatDialogRef<PhysicalAttestationCreateComponent>,
    private FormBuilder: FormBuilder,
    public translate: TranslateService,
    public apiservice: ApiService,
    public consts: ConstantsService,
    private commonService: CommonService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.FormBuilder.group({
      invoiceId: [, Validators.required],
      invoiceDate: [, Validators.required],
      invoiceCurrency: [, Validators.required],
      invoiceAmount: [, [Validators.required, this.validateNumericInput]],
      issuingAuthority: [, Validators.required],
      uploadInvoiceFile: [, Validators.required],
    });

    this.getIssuingAuthorities();
  }

  getIssuingAuthorities() {
    let data = {
      useruno: '1',
    };
    this.apiservice
      .post(this.consts.getFreezonetypes, data)
      .subscribe((response: any) => {
        if (`${response.responseCode}` === '200') {
          const dataArray = response.data;
          this.issuingAuthorities = dataArray.dictionary.data;
        }
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
          this.registrationForm.get('uploadInvoiceFile')?.setValue(null);
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
    this.registrationForm.get('uploadInvoiceFile')?.setValue(null);
    this.registrationForm.get('uploadInvoiceFile')?.updateValueAndValidity();
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
        invoiceId,
        invoiceCurrency,
        invoiceAmount,
        issuingAuthority,
        invoiceDate,
      } = this.registrationForm.getRawValue();
      this.convertToBase64(this.listOfFiles[0])
        .then((base64String) => {
          const data: InvoiceAttestModel = {
            attesttypeuno: 1,
            uuid: '12212',
            token: 'tl122',
            invoiceno: invoiceId,
            invoicecurrency: invoiceCurrency,
            invoiceamount: invoiceAmount,
            invoicedate: this.datePipe
              .transform(invoiceDate, 'ddMMyyyy')
              ?.toString(),
            issuingauthorityuno: issuingAuthority,
            attestDocName: this.listOfFiles[0].name,
            processname: 'invoice',
            qrCodeRequired: 0,
            attestFile: base64String,
          };
          this.submitInvoiceAttestations(data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      // alert
      this.commonService.showErrorMessage('Fill mandatory fields!!!');
    }
  }

  submitInvoiceAttestations(data: InvoiceAttestModel) {
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
      .get('invoiceCurrency')
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
