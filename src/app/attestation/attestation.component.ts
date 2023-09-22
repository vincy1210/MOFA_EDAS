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
    // test value comment this
    // data={
    //   "companyuno":0,
    //   "uuid":'e6b1fcd2-aba6-4a63-8718-a2120807a156'
    // }

    if(this.isPending){
            this.api.post(this.consts.pendingattestation,data).subscribe({next:(success:any)=>{
              resp=success;
              if(resp.data.dictionary.responsecode==1){
              this.customers=resp.data.dictionary.data
                this.datasource=resp.data.dictionary.data;
                this.totalrecords=resp.data.dictionary.data.length;
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
    }
    else{
      this.api.post(this.consts.lcaCompletedAttestList,data).subscribe({next:(success:any)=>{
        resp=success;
        if(resp.data.dictionary.responsecode==1){
        this.customers=resp.data.dictionary.data
          this.datasource=resp.data.dictionary.data;
          this.totalrecords=resp.data.dictionary.data.length;
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

    }

   


//this.src='https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

this.getimagebase64();

// // pdf to base 64

// const pdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

// // Fetch the PDF using HttpClient
// this.http.get(pdfUrl, { responseType: 'blob' }).subscribe((pdfBlob: Blob) => {
//   const reader = new FileReader();

//   reader.onloadend = () => {
//     if (typeof reader.result === 'string') {
//       const base64String = reader.result.split(',')[1]; // Get the base64 part of the data URL
//       console.log('Base64 Encoded PDF:', base64String);
//       this.base64PdfString=base64String;
//       // Now you can use the base64String as needed.
//     }
//   };

//   reader.readAsDataURL(pdfBlob);
// });


// end

// this.customers=[
//   {
//       "edasattestno": "AECI20192210739000710EF0",
//       "reqappnumber": "0",
//       "attestreqdate": "05-09-2023T10:16:50",
//       "attestfilelocation": "file:///C://Users/vincy/Desktop/Test%20document.pdf",
//       "declarationdate": "2019-01-09T09:10:51",
//       "invoicenumber": "INV0011",
//       "declarationumber": "DEC12345",
//       "tradelicensenumber": "",
//       "invoicedate": "2019-01-10T09:20:51",
//       "invoiceamount": 0,
//       "currencycode": "",
//       "documenttypecode": "",
//       "approvalauthority": "",
//       "dutypercentage": 0,
//       "feesamount": 150,
//       "fineamount": 150,
//       "entityshareamount": 0,
//       "totalamount": 0,
//       "grossamount": 0,
//       "invoiceuno": 0,
//       "paidon": "2019-01-12T09:20:51",
//       "paidby": "Developer",
//       "approvedon": "2019-03-10T09:20:51",
//       "approvedby": "Tester",
//       "rejectedon": "2019-04-10T09:20:51",
//       "qrcoderef": "",
//       "attestedon": "2019-05-10T08:20:51",
//       "completedon": "2019-05-12T00:00:00",
//       "statusuno": 4
//   },
//   {
//       "edasattestno": "AECI2019221073900072CB72",
//       "reqappnumber": "0",
//       "attestreqdate": "05-09-2023T10:16:50",
//       "attestfilelocation": "file:///C://Users/vincy/Desktop/Test%20document.pdf",
//       "declarationdate": "0001-01-01T00:00:00",
//       "invoicenumber": "INV0012",
//       "declarationumber": "DEC12345",
//       "tradelicensenumber": "",
//       "invoicedate": "0001-01-01T00:00:00",
//       "invoiceamount": 0,
//       "currencycode": "",
//       "documenttypecode": "",
//       "approvalauthority": "",
//       "dutypercentage": 0,
//       "feesamount": 150,
//       "fineamount": 500,
//       "entityshareamount": 0,
//       "totalamount": 0,
//       "grossamount": 0,
//       "invoiceuno": 0,
//       "paidon": "0001-01-01T00:00:00",
//       "paidby": "",
//       "approvedon": "0001-01-01T00:00:00",
//       "approvedby": "",
//       "rejectedon": "0001-01-01T00:00:00",
//       "qrcoderef": "",
//       "attestedon": "0001-01-01T00:00:00",
//       "completedon": null,
//       "statusuno": 3
//   },
//   {
//       "edasattestno": "AECI20192210739000734321",
//       "reqappnumber": "0",
//       "attestreqdate": "05-09-2023T10:16:50",
//       "attestfilelocation": "file:///C://Users/vincy/Desktop/Test%20document.pdf",
//       "declarationdate": "0001-01-01T00:00:00",
//       "invoicenumber": "INV0013",
//       "declarationumber": "DEC12346",
//       "tradelicensenumber": "",
//       "invoicedate": "0001-01-01T00:00:00",
//       "invoiceamount": 0,
//       "currencycode": "",
//       "documenttypecode": "",
//       "approvalauthority": "",
//       "dutypercentage": 0,
//       "feesamount": 200,
//       "fineamount": 500,
//       "entityshareamount": 0,
//       "totalamount": 0,
//       "grossamount": 0,
//       "invoiceuno": 0,
//       "paidon": "0001-01-01T00:00:00",
//       "paidby": "",
//       "approvedon": "0001-01-01T00:00:00",
//       "approvedby": "",
//       "rejectedon": null,
//       "qrcoderef": "",
//       "attestedon": null,
//       "completedon": null,
//       "statusuno": 2
//   },
//   {
//       "edasattestno": "AECI2019221073900074B976",
//       "reqappnumber": "0",
//       "attestreqdate": "05-09-2023T10:16:50",
//       "attestfilelocation": "file:///C://Users/vincy/Desktop/Test%20document.pdf",
//       "declarationdate": "0001-01-01T00:00:00",
//       "invoicenumber": "INV0014",
//       "declarationumber": "DEC12346",
//       "tradelicensenumber": "",
//       "invoicedate": "0001-01-01T00:00:00",
//       "invoiceamount": 0,
//       "currencycode": "",
//       "documenttypecode": "",
//       "approvalauthority": "",
//       "dutypercentage": 0,
//       "feesamount": 300,
//       "fineamount": 0,
//       "entityshareamount": 0,
//       "totalamount": 0,
//       "grossamount": 0,
//       "invoiceuno": 0,
//       "paidon": null,
//       "paidby": null,
//       "approvedon": null,
//       "approvedby": null,
//       "rejectedon": null,
//       "qrcoderef": "",
//       "attestedon": null,
//       "completedon": null,
//       "statusuno": 0
//   },
//   {
//       "edasattestno": "AECI2019221073900074B976",
//       "reqappnumber": "0",
//       "attestreqdate": "05-09-2023T10:16:50",
//       "attestfilelocation": "file:///C://Users/vincy/Desktop/Test%20document.pdf",
//       "declarationdate": "0001-01-01T00:00:00",
//       "invoicenumber": "INV0014",
//       "declarationumber": "DEC12346",
//       "tradelicensenumber": "",
//       "invoicedate": "0001-01-01T00:00:00",
//       "invoiceamount": 0,
//       "currencycode": "",
//       "documenttypecode": "",
//       "approvalauthority": "",
//       "dutypercentage": 0,
//       "feesamount": 0,
//       "fineamount": 0,
//       "entityshareamount": 0,
//       "totalamount": 0,
//       "grossamount": 0,
//       "invoiceuno": 0,
//       "paidon": null,
//       "paidby": null,
//       "approvedon": null,
//       "approvedby": null,
//       "rejectedon": null,
//       "qrcoderef": "",
//       "attestedon": null,
//       "completedon": null,
//       "statusuno": 0
//   },
//   {
//       "edasattestno": "AECI2019221073900074B976",
//       "reqappnumber": "0",
//       "attestreqdate": "05-09-2023T10:16:50",
//       "attestfilelocation": "file:///C://Users/vincy/Desktop/Test%20document.pdf",
//       "declarationdate": "0001-01-01T00:00:00",
//       "invoicenumber": "INV0014",
//       "declarationumber": "DEC12346",
//       "tradelicensenumber": "",
//       "invoicedate": "0001-01-01T00:00:00",
//       "invoiceamount": 0,
//       "currencycode": "",
//       "documenttypecode": "",
//       "approvalauthority": "",
//       "dutypercentage": 0,
//       "feesamount": 0,
//       "fineamount": 0,
//       "entityshareamount": 0,
//       "totalamount": 0,
//       "grossamount": 0,
//       "invoiceuno": 0,
//       "paidon": null,
//       "paidby": null,
//       "approvedon": null,
//       "approvedby": null,
//       "rejectedon": null,
//       "qrcoderef": "",
//       "attestedon": null,
//       "completedon": null,
//       "statusuno": 0
//   },
//   {
//       "edasattestno": "AECI2019221073900074B976",
//       "reqappnumber": "0",
//       "attestreqdate": "05-09-2023T10:16:50",
//       "attestfilelocation": "file:///C://Users/vincy/Desktop/Test%20document.pdf",
//       "declarationdate": "0001-01-01T00:00:00",
//       "invoicenumber": "INV0014",
//       "declarationumber": "DEC12346",
//       "tradelicensenumber": "",
//       "invoicedate": "0001-01-01T00:00:00",
//       "invoiceamount": 0,
//       "currencycode": "",
//       "documenttypecode": "",
//       "approvalauthority": "",
//       "dutypercentage": 0,
//       "feesamount": 0,
//       "fineamount": 0,
//       "entityshareamount": 0,
//       "totalamount": 0,
//       "grossamount": 0,
//       "invoiceuno": 0,
//       "paidon": null,
//       "paidby": null,
//       "approvedon": null,
//       "approvedby": null,
//       "rejectedon": null,
//       "qrcoderef": "",
//       "attestedon": null,
//       "completedon": null,
//       "statusuno": 0
//   },
//   {
//       "edasattestno": "AECI2019221073900074B976",
//       "reqappnumber": "0",
//       "attestreqdate": "05-09-2023T10:16:50",
//       "attestfilelocation": "file:///C://Users/vincy/Desktop/Test%20document.pdf",
//       "declarationdate": "0001-01-01T00:00:00",
//       "invoicenumber": "INV0014",
//       "declarationumber": "DEC12346",
//       "tradelicensenumber": "",
//       "invoicedate": "0001-01-01T00:00:00",
//       "invoiceamount": 0,
//       "currencycode": "",
//       "documenttypecode": "",
//       "approvalauthority": "",
//       "dutypercentage": 0,
//       "feesamount": 0,
//       "fineamount": 0,
//       "entityshareamount": 0,
//       "totalamount": 0,
//       "grossamount": 0,
//       "invoiceuno": 0,
//       "paidon": null,
//       "paidby": null,
//       "approvedon": null,
//       "approvedby": null,
//       "rejectedon": null,
//       "qrcoderef": "",
//       "attestedon": null,
//       "completedon": null,
//       "statusuno": 0
//   },
//   {
//       "edasattestno": "AECI2019221073900074B976",
//       "reqappnumber": "0",
//       "attestreqdate": "05-09-2023T10:16:50",
//       "attestfilelocation": "file:///C://Users/vincy/Desktop/Test%20document.pdf",
//       "declarationdate": "0001-01-01T00:00:00",
//       "invoicenumber": "INV0014",
//       "declarationumber": "DEC12346",
//       "tradelicensenumber": "",
//       "invoicedate": "0001-01-01T00:00:00",
//       "invoiceamount": 0,
//       "currencycode": "",
//       "documenttypecode": "",
//       "approvalauthority": "",
//       "dutypercentage": 0,
//       "feesamount": 0,
//       "fineamount": 0,
//       "entityshareamount": 0,
//       "totalamount": 0,
//       "grossamount": 0,
//       "invoiceuno": 0,
//       "paidon": null,
//       "paidby": null,
//       "approvedon": null,
//       "approvedby": null,
//       "rejectedon": null,
//       "qrcoderef": "",
//       "attestedon": null,
//       "completedon": null,
//       "statusuno": 0
//   },
//   {
//       "edasattestno": "AECI2019221073900074B976",
//       "reqappnumber": "0",
//       "attestreqdate": "05-09-2023T10:16:50",
//       "attestfilelocation": "file:///C://Users/vincy/Desktop/Test%20document.pdf",
//       "declarationdate": "0001-01-01T00:00:00",
//       "invoicenumber": "INV0014",
//       "declarationumber": "DEC12346",
//       "tradelicensenumber": "",
//       "invoicedate": "0001-01-01T00:00:00",
//       "invoiceamount": 0,
//       "currencycode": "",
//       "documenttypecode": "",
//       "approvalauthority": "",
//       "dutypercentage": 0,
//       "feesamount": 0,
//       "fineamount": 0,
//       "entityshareamount": 0,
//       "totalamount": 0,
//       "grossamount": 0,
//       "invoiceuno": 0,
//       "paidon": null,
//       "paidby": null,
//       "approvedon": null,
//       "approvedby": null,
//       "rejectedon": null,
//       "qrcoderef": "",
//       "attestedon": null,
//       "completedon": null,
//       "statusuno": 0
//   }
// ]

// this.loading=false;
// this.totalrecords=this.customers.length;
//this.Reduce();

   

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
    "uuid":"e6b1fcd2-aba6-4a63-8718-a2120807a156"
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
      this.common.showErrorMessage('Data retrived Failed')
      this.loading=false;
    }
  }
})

}

}


