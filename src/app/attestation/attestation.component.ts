import { Component, OnInit } from '@angular/core';

import {LiveAnnouncer} from '@angular/cdk/a11y';
import { CdkDragStart, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ApiService } from 'src/service/api.service';
import { CommonService } from 'src/service/common.service';
import { ConstantsService } from 'src/service/constants.service';
import { LazyLoadEvent } from 'primeng/api';
// import * as FileSaver from 'file-saver';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { HttpClient } from '@angular/common/http';


 import { saveAs } from 'file-saver';
interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-attestation',
  templateUrl: './attestation.component.html',
  styleUrls: ['./attestation.component.css'],
})
export class AttestationComponent implements OnInit {

  loading: boolean = true;
  customers:any;
  representatives:any;
  statuses:any;
  products: any;
datasource:any;
    cols: any;
    totalrecords:any;
    isLoading=false;

  activityValues: number[] = [0, 100];
  list:any;
  selectedAttestations:any;
  public shouldShow = false;
  previewvisible:boolean=true;
  Timelinevisible:boolean=true;
  status0:string='';
  status1:string='';
  status2:string='';
  status3:string='';
  status4:string='';

  createddate:any;
  createdTime:any;

  approveddate:any;
  approvedTime:any;

  paymentdate:any;
  paymentTime:any;

  attestationdate:any;
  attestationTime:any;

  completedDate:any;
  completedTime:any;
  redirectselectedcompanyData:any
  src:any;
  noOfInvoicesSelected: any[]=[]
  totalFineAmount:any;
  totalAttestationFee:any;
totalFee:any;
AttestationList:any;
isPending:boolean=true;
base64PdfString: any;

uuid:string='';

enableFilters: boolean = false;

 
  constructor(private http:HttpClient,private _liveAnnouncer: LiveAnnouncer, private api:ApiService, private common:CommonService, private consts:ConstantsService){

  }

  ngOnInit() {

    this.common.getSelectedCompany().subscribe(data => {
      this.redirectselectedcompanyData = data;
      console.log(this.redirectselectedcompanyData)
    });
    this.loading = true;
    let resp;
    let data=this.redirectselectedcompanyData;
    console.log(data);

    let data11=this.common.getUserProfile();
    data11=JSON.parse(data11)
    console.log(data11)
    let uuid;

    if(data11!=null){
      console.log(data11.Data)
      uuid=data11.Data.uuid;
      this.uuid=uuid;

    }
    else{
      this.common.showErrorMessage("Invalid Session!")
      console.log("Invalid session in landing page while getting user profile details")
      return;
    }


    // console.log(data11.Data)

    // test value comment this
    data={
      "companyuno":0,
      "uuid":this.uuid
    }

    // if(this.isPending){
            this.api.post(this.consts.pendingattestation,data).subscribe({next:(success:any)=>{
              resp=success;
              if(resp.dictionary.responsecode==1){
              this.customers=resp.dictionary.data
                this.datasource=resp.dictionary.data;
                this.totalrecords=resp.dictionary.data.length;
                this.loading = false;
                this.Reduce();
                this.common.showSuccessMessage('Data retrived'); // Show the verification alert

              }
              else{
                this.common.showErrorMessage('Data retrived Failed')
                this.loading=false;
              }
        
            }
          })
    // }
    // else{
    //   this.api.post(this.consts.lcaCompletedAttestList,data).subscribe({next:(success:any)=>{
    //     resp=success;
    //     if(resp.data.dictionary.responsecode==1){
    //     this.customers=resp.data.dictionary.data
    //       this.datasource=resp.data.dictionary.data;
    //       this.totalrecords=resp.data.dictionary.data.length;
    //       this.loading = false;
    //       this.Reduce();
    //       this.common.showSuccessMessage('Data retrived'); // Show the verification alert

    //     }
    //     else{
    //       this.common.showErrorMessage('Data retrived Failed')
    //       this.loading=false;
    //     }
    //   }
    // })

    // }

   



this.getimagebase64();


    this.cols = [
      { field: 'edasattestno', header: 'Attestation No.' },
      { field: 'invoicenumber', header: 'Invoice ID' },
      { field: 'declarationumber', header: 'Declaration No.' },
      { field: 'declarationdate', header: 'Declaration date.' },
      { field: 'attestreqdate', header: 'Creation Date' },
      { field: 'Noofdaysleft', header: 'Days Left' },

  ];

  }
   response:any


loadsidepanel(event:any){
  console.log(event);
  console.log(this.selectedAttestations);
  this.noOfInvoicesSelected=this.selectedAttestations.length;

  // const totalFineAmount = this.noOfInvoicesSelected.reduce((total, item) => total + item.fineamount, 0);
  this.totalFineAmount = this.selectedAttestations.reduce((total: any, item:any) => total + item.fineamount, 0);

  this.totalAttestationFee = this.selectedAttestations.reduce((total: any, item:any) => total + item.feesamount, 0);

  this.totalFee=this.totalFineAmount+this.totalAttestationFee;
  
  this.shouldShow=true;
  if(this.selectedAttestations.length>1){
    this.previewvisible=false;
    this.Timelinevisible=false;
  }
  else if(this.selectedAttestations.length==0){
    this.shouldShow=false;
  }
  else{
    let status;
    this.previewvisible=true;
    this.Timelinevisible=true;
    let createddate=this.splitdatetime(this.selectedAttestations[0]?.attestreqdate);
    this.createddate=createddate?.date;
    this.createdTime=createddate?.time;
    let approveddate=this.splitdatetime(this.selectedAttestations[0]?.approvedon);
    this.approveddate=approveddate?.date;
    this.approvedTime=approveddate?.time;
    let paymentdate=this.splitdatetime(this.selectedAttestations[0]?.paidon);
    this.paymentdate=paymentdate?.date;
    this.paymentTime=paymentdate?.time;
    let attestationdate=this.splitdatetime(this.selectedAttestations[0]?.attestedon);
    this.attestationdate=attestationdate?.date
    this.attestationTime=attestationdate?.time
    let completedDate=this.splitdatetime(this.selectedAttestations[0]?.completedon);
    this.completedDate=completedDate?.date;
    this.completedTime=completedDate?.time;
    if(this.selectedAttestations[0].statusuno==0){
      this.status0='current'
      this.status1=''
      this.status2=''
      this.status3=''
      this.status4=''

  
    }
    else if(this.selectedAttestations[0].statusuno==1){
      this.status0='active'
      this.status1='current'
      this.status2=''
      this.status3=''
      this.status4=''
    }
    else if(this.selectedAttestations[0].statusuno==2){
      this.status0='active'
      this.status1='active'
      this.status2='current'
      this.status3=''
      this.status4=''
      
    }else if(this.selectedAttestations[0].statusuno==3){
      this.status0='active'
      this.status1='active'
      this.status2='active'
      this.status3='current'
      this.status4=''
      
    }else if(this.selectedAttestations[0].statusuno==4){
      this.status0='active'
      this.status1='active'
      this.status2='active'
      this.status3='active'
      this.status4='current'
      
    }
    else{
      this.common.showErrorMessage("Something went wrong!")
    }
  }



}

splitdatetime(datetimeString:any) {
  if (datetimeString && typeof datetimeString === 'string') {
      const dateTimeParts = datetimeString.split('T'); // Splitting the string at 'T'
      if (dateTimeParts.length === 2) {
          return {
              date: dateTimeParts[0],
              time: dateTimeParts[1]
          };
      }
  }
  return null; // Invalid or null datetime string
}


AttestationPay(){

}

// exportPdf() {
//   import('jspdf').then((jsPDF) => {
//       import('jspdf-autotable').then((x) => {
//           const doc = new jsPDF.default('p', 'px', 'a4');
//           (doc as any).autoTable(this.exportColumns, this.products);
//           doc.save('products.pdf');
//       });
//   });
// }

exportExcel() {
  import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.AttestationList);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'Attestations');
  });
}

saveAsExcelFile(buffer: any, fileName: string): void {
  let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  let EXCEL_EXTENSION = '.xlsx';
  const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
  });
  FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
}

saveFile() {
  const fileContent = 'This is the content of the file.';
  const blob = new Blob([fileContent], { type: 'text/plain' });
  saveAs(blob, 'example.txt');
}


Reduce(){
  const selectedProperties: string[] = [
    'edasattestno',
    'invoicenumber',
    'declarationumber',
    'declarationdate',
    'attestreqdate',
    'Noofdaysleft', // Make sure this property name matches your actual data
  ];

  const selectedData = this.customers.map((customer:any) => {
    const selectedCustomer: Record<string, any> = {}; // Initialize as an empty object
  
    // Iterate through the selected property names and copy them to the new object
    selectedProperties.forEach((propertyName) => {
      selectedCustomer[propertyName] = customer[propertyName];
    });
  
    return selectedCustomer;
  });
  this.AttestationList=selectedData;
  
  // Now, 'selectedData' contains an array of objects with only the selected properties
  console.log(selectedData);
}

getimagebase64(){
  let resp;

  let attestfilelocation=this.common.encryptWithPublicKey("D:\\mofafile\\LCARequest\\PDF\\\\20161220423\\INV00000_New.PDF")
  let data={
    "attestfilelocation":attestfilelocation,
    "uuid":this.uuid 
  }
  this.api.post(this.consts.lcaCompletedAttestList,data).subscribe({next:(success:any)=>{
    resp=success;
    if(resp.responsecode==1){
    // this.customers=resp.data.dictionary.data
    //   this.datasource=resp.data.dictionary.data;
    //   this.totalrecords=resp.data.dictionary.data.length;
    //   this.loading = false;
    //   this.Reduce();
    //   this.common.showSuccessMessage('Data retrived'); // Show the verification alert

    this.base64PdfString=resp.data;

    const source = `data:application/pdf;base64,${this.base64PdfString}`;
    const link = document.createElement("a");
    link.href = source;
    link.download = `attachment.pdf`
    link.click();
    this.src=link;



    }
    else{
      this.common.showErrorMessage('Attachment load failed!')
      this.loading=false;
    }
  }
})

}

clickChips() {
  this.enableFilters = !this.enableFilters;
}

convertBase64ToPdf(base64Data: string): void {
  this.common.convertBase64ToPdf(base64Data);
}

}


