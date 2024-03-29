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
import { AuthService } from 'src/service/auth.service';
import {Observable} from 'rxjs';

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
  companyuno:number
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
  currencylist: { itemcode: string; itemno: string }[] = [];
  currencylistFilter: { itemcode: string; itemno: string }[] = [];


  listOfFiles: File[] = [];
  uuid:any;
  currentcompany:any;
  isButtonDisabled = false;

  currentLanguagecode: string='1033';

  constructor(
    public dialogRef: MatDialogRef<PhysicalAttestationCreateComponent>,
    private FormBuilder: FormBuilder,
    public translate: TranslateService,
    public apiservice: ApiService,
    public consts: ConstantsService,
    private common: CommonService,
    private datePipe: DatePipe, private auth:AuthService
  ) {
    let selectedlanguage = sessionStorage.getItem('language') || 'en';

    if(selectedlanguage==='ar'){
        this.currentLanguagecode='14337'
    }
    else{
      this.currentLanguagecode='1033'

    }
   console.log(this.currentLanguagecode);
  }

  ngOnInit(): void {


    
    let curr=this.auth.getSelectedCompany();
    if(curr){
    this.currentcompany=curr.companyuno || '';
    }

    let data11=this.common.getUserProfile();
    let uuid;
    if(data11!=null || data11!=undefined){
      data11=JSON.parse(data11)
      console.log(data11.Data)
      uuid=data11.Data.uuid;
      this.uuid=uuid;

    }
    else{
       this.common.setlogoutreason("session");
       console.log("from physi attest create")

      this.auth.logout();

    }


    this.registrationForm = this.FormBuilder.group({
      invoiceId: ['', [Validators.required ,Validators.pattern('^(?=.*\\S).+$')]],
      invoiceDate: [, Validators.required],
      invoiceCurrency: ['AED', [Validators.required,Validators.pattern('^(?=.*\\S).+$')]],
      invoiceAmount: [, [Validators.required, this.validateNumericInput,Validators.pattern(/^[1-9]\d*(\.\d{1,2})?$/)]],
      // issuingAuthority: [, Validators.required],
      uploadInvoiceFile: [, Validators.required],
    });

    this.getIssuingAuthorities();
    this.getAvailableCurrencies();
  }

  getIssuingAuthorities() {
    let data = {
      "uuid": "1",
      "languagecode": this.currentLanguagecode,
      "processname": "FREEZONEMST"
    };
    this.common.showLoading();

    this.apiservice
      .post(this.consts.getListOfValues, data)
      .subscribe((response: any) => {
        this.common.hideLoading();

        if (`${response.responseCode}` === '200') {
          const dataArray = response.data;
          this.issuingAuthorities = dataArray.data;
          console.log(response)
        }
      });
  }

  getAvailableCurrencies() {
    let data = {
      uuid: this.uuid,
      languagecode: this.currentLanguagecode, 
      processname: "CURRENCYMST"
    };
    this.common.showLoading();

    this.apiservice
      .post(this.consts.getListOfValues, data)
      .subscribe((response: any) => {
        this.common.hideLoading();

        if (`${response.responsecode}` === '1') {
          const dataArray = response.data;
          this.currencylist = dataArray;
          this.currencylistFilter=dataArray;

          console.log(response)
        }
      });
  }



  onFileChanged(event: any) {
    this.listOfFiles = [];
    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      if (selectedFile) {
        if(selectedFile.type === 'application/pdf')
        {

              if (selectedFile.size <= 2 * 1024 * 1024) {
                this.listOfFiles.push(selectedFile);
                this.isLoading = true;

                setTimeout(() => {
                  // After the upload is complete
                  this.isLoading = false;
                }, 3000);

              } else {
                this.registrationForm.get('uploadInvoiceFile')?.setValue(null);
                //alert
                this.common.showErrorMessage(
                  'File size should be less than or equal to 2 MB'
                );
              }
            }
            else{
              this.listOfFiles=[];
              this.registrationForm.get('uploadInvoiceFile')?.setValue(null);
              this.common.showErrorMessage('Only PDF files are allowed');
            }

      }
    }
  
  
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

    const timestamp = new Date().getTime();
    
    if (this.registrationForm.valid) {
      const {
        invoiceId,
        invoiceCurrency,
        invoiceAmount,
        // issuingAuthority,
        invoiceDate,
      } = this.registrationForm.getRawValue();

      // this.datePipe
      //         .transform(invoiceDate, 'ddMMyyyy')
      //         ?.toString(),

      let attest_file_name=invoiceId +'_'+timestamp+ '.pdf'; 
      this.convertToBase64(this.listOfFiles[0])
        .then((base64String) => {
          const data: InvoiceAttestModel = {
            attesttypeuno: 1,
            uuid: this.uuid,
            token: 'tl122',
            invoiceno: invoiceId,
            invoicecurrency: invoiceCurrency,
            invoiceamount: invoiceAmount,
            invoicedate: invoiceDate,
            issuingauthorityuno: 0,
            attestDocName: attest_file_name,
            processname: 'invoice',
            qrCodeRequired: 0,
            attestFile: base64String,
            companyuno:this.currentcompany
          };
          this.submitInvoiceAttestations(data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      // alert
      let message=this.translate.instant('Please fill the mandatory Fields');
      this.common.showErrorMessage(message);
    }
  }

  submitInvoiceAttestations(data: InvoiceAttestModel) {
    this.common.showLoading();

    this.apiservice
      .post(this.consts.invoiceAttestation, data)
      .subscribe((response: any) => {
      

        const dataArray = response.data;
        if (response.responseCode === 200) {
          //alert
          this.dialogRef.close(response);
          this.clearDatas();

          this.common.showSuccessMessage(this.translate.instant('Item_Created_Successfully'));
         // this.onClose(true);
         
          this.common.hideLoading();
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

  // onAmountInput(event: any): void {
  //   const input = event.target.value;
  //   // Replace non-numeric characters, including 'e', with an empty string
  //   const numericInput = input.replace(/[^0-9]/g, '');
  //   // Update the input value with the cleaned numeric input
  //   this.registrationForm.get('invoiceAmount')?.setValue(numericInput);
  // }
  onAmountInput(event: any): void {
    const inputElement = event.target;
    const currentCursorPosition = inputElement.selectionStart || 0;
  
    let input = inputElement.value;
  
    // Remove any non-numeric characters except the decimal point
    input = input.replace(/[^\d.]/g, '');
  
    // Split the input into integer and decimal parts
    const parts = input.split('.');
  
    // Limit the number of digits before the decimal point
    parts[0] = parts[0].slice(0, 15); // Up to 13 digits before the decimal point
  
    // If dot is present, limit the number of digits after the decimal point
    if (parts.length > 1) {
      parts[1] = parts[1].slice(0, 2); // Up to 2 digits after the decimal point
    }
  
    // Reconstruct the input
    input = parts[0] + (parts[1] !== undefined ? '.' + parts[1] : '');
  
    // Update the input value with the cleaned numeric input
    this.registrationForm.get('invoiceAmount')?.setValue(input);
  
    // Set the caret position after modifying the input
    const newCursorPosition = currentCursorPosition + (input.length - inputElement.value.length);
    inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
  }
  
  
  
  // public isUploading = false;

  // public onFileSelected(event: any): void {
  //   // Your file upload logic here
  //   this.isUploading = true;

  //   // Simulating an upload delay for demonstration purposes
  //   setTimeout(() => {
  //     // After the upload is complete
  //     this.isUploading = false;
  //   }, 3000);
  // }
  
  onInputChange(event: any, fieldValue: "categoryuno"): void {
    const userInput = event.target.value.toLowerCase();
    if (fieldValue === "categoryuno") {
      this.currencylist = this.currencylistFilter.filter((item: any) =>
        item.itemcode.toLowerCase().includes(userInput)
      );
    }
  }
  
  
}
