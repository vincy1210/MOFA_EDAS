import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormControl,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
// import { SpinnerVisibilityService } from "ng-http-loader";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import {
  FilterTypeCompany,
  ViewDataType,
} from 'src/app/shared/models/filetype-model';
import { CompanyStatusEnums } from 'src/app/shared/constants/status-enum';
import * as XLSX from 'xlsx';
import { ApiService } from 'src/service/api.service';
import { CommonService } from 'src/service/common.service';
import { ConstantsService } from 'src/service/constants.service';

type ExcelTypes = {
  LCACode?: string;
  RequestNo: string;
  RequestDate: string;
  DeclarationNo: string;
  DeclarationDate: string;
  TradelicenceNo: string;
  ConsigneeName: string;
  EmailAddress: string;
  ContactNo: string;
  DocType: string;
  ExpPortCode: string;
  ExpPortName: string;
  Mode: string;
  AttestationNo: string;
  InvoiceDate: string;
  InvoiceAmount: string;
  InvoiceNo: string;
  InvoiceCurrency: string;
  InvoiceId: string;
  CompanyName: string;
  Remarks: string;
};

@Component({
  selector: 'app-import-attestations-create',
  templateUrl: './import-attestations-create.component.html',
  styleUrls: ['./import-attestations-create.component.css'],
})
export class ImportAttestationsCreateComponent implements OnInit {
  name: string = '';
  createddetail: any = {};
  selectedFilterOption: FilterTypeCompany = {
    id: CompanyStatusEnums.Approved,
    value: 'Approved',
  };
  useruno = 0;
  isLoading = false;
  isError: boolean = false;
  visibleview: 'view' | 'edit' | 'viewmore' = 'edit';
  fileList: File[] = [];
  listOfFiles: any[] = [];
  importedData: any[] = [];
  excelColumns: string[] = [
    // 'LCACode',
    'RequestNo',
    'RequestDate',
    'DeclarationNo',
    'DeclarationDate',
    'TradelicenceNo',
    'ConsigneeName',
    'EmailAddress',
    'ContactNo',
    'DocType',
    'ExpPortCode',
    'ExpPortName',
    'Mode',
    'AttestationNo',
    'InvoiceDate',
    'InvoiceAmount',
    'InvoiceNo',
    'InvoiceCurrency',
    'InvoiceId',
    'CompanyName',
    'Remarks',
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<any>,
    private common: CommonService,
    public router: Router,
    private formBuilder: FormBuilder,
    private toaster: ToastrService,
    public apiservice: ApiService,
    public consts: ConstantsService,
    private http: HttpClient,
    public translate: TranslateService
  ) {}

  AddRiskForm: FormGroup = new FormGroup({
    fielduno: new FormControl(0, []),
    LCACode: new FormControl('', []),
    RequestDate: new FormControl('', []),
    RequestNo: new FormControl('', []),
  });

  get f(): { [key: string]: AbstractControl } {
    return this.AddRiskForm.controls;
  }

  ngOnInit(): void {
    this.selectedFilterOption.uuid = '12223';
    // const { useruno } = this.common.getUserDetails();
    // this.useruno = useruno;
    // this.assignData();
  }

  assignData() {
    if (this.data) {
      const { fielduno, RequestDate, LCACode, RequestNo } = this.data;
      if (fielduno) {
        this.f['fielduno'].setValue(fielduno);
        this.f['RequestDate'].setValue(RequestDate);
        this.f['LCACode'].setValue(LCACode);
        this.f['RequestNo'].setValue(Number(RequestNo));
        this.name = 'any';
        this.createddetail = this.data;
      }
    }
  }

  exportToExcel() {
    const jsonData: ExcelTypes[] = [
      {
        // LCACode: '',
        RequestNo: '',
        RequestDate: '',
        DeclarationNo: '',
        DeclarationDate: '',
        TradelicenceNo: '',
        ConsigneeName: '',
        EmailAddress: '',
        ContactNo: '',
        DocType: '',
        ExpPortCode: '',
        ExpPortName: '',
        Mode: '',
        AttestationNo: '',
        InvoiceDate: '',
        InvoiceAmount: '',
        InvoiceNo: '',
        InvoiceCurrency: '',
        InvoiceId: '',
        CompanyName: '',
        Remarks: '',
      },
    ];
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook: XLSX.WorkBook = {
      Sheets: { LCA: worksheet },
      SheetNames: ['LCA'],
    };
    XLSX.writeFile(
      workbook,
      this.common.givefilename('lca-template') + '.xlsx'
    );
  }

  onFileChanged(event: any) {
    this.isLoading = true;
    this.removeSelectedFile(0);
    this.importedData = [];
    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      if (this.listOfFiles.indexOf(selectedFile.name) === -1) {
        this.fileList.push(selectedFile);
        this.listOfFiles.push(selectedFile.name);
        // this.fileList
        if (this.fileList && this.fileList.length > 0) {
          const oneFile = this.fileList[0];
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const workbook: XLSX.WorkBook = XLSX.read(e.target.result, {
              type: 'binary',
            });
            const sheetName = workbook.SheetNames[0];
            const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
            this.importedData = XLSX.utils.sheet_to_json(worksheet, {
              header: 1,
            });
          };
          reader.readAsBinaryString(oneFile);
        }
      }
    }
    this.isLoading = false;
  }

  removeSelectedFile(index: number) {
    if (this.listOfFiles.length > 0) {
      this.listOfFiles.splice(index, 1);
      this.fileList.splice(index, 1);
    }
  }

  close(result?: 'success') {
    const data = { result, dataList: this.importedData };
    this.dialogRef.close(data);
  }

  // splitdatetime1(date: any) {
  //   return this.common.splitdatetime1(date);
  // }

  splitdatetime(date: any) {
    const dateVal = `${date}`;
    return this.common.splitdatetime(dateVal);
  }

  onSubmit() {
    if (this.AddRiskForm.invalid) {
      this.common.showErrorMessage(this.translate.instant('enterValidData'));
      return;
    }
    let action: string = this.data?.fielduno ? 'UPDATE' : 'ADD';
    this.isError = false;
    this.isLoading = true;
    this.common.showLoading();

    // get datas from excel
    this.isLoading = false;
    this.common.hideLoading();
    this.isError = false;
    // this.AddRiskForm.invalid == true;
    if (this.importedData && this.importedData.length > 1) {
      if (
        JSON.stringify(this.excelColumns) !==
        JSON.stringify(this.importedData[0])
      ) {
        this.common.showErrorMessage(this.translate.instant('wrongtemplate'));
        return;
      } else {
        const secondRow =
          this.importedData.length > 0 ? this.importedData[1] : [];
        let isStringEmpty: boolean = this.common.areAllStringsEmpty(secondRow);
        if (isStringEmpty) {
          this.common.showErrorMessage(this.translate.instant('nodataexists'));
          return;
        }
      }
      this.close('success');
    } else {
      this.common.showErrorMessage(this.translate.instant('nodataexists'));
    }
  }
}
