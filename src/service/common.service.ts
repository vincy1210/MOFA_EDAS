import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import * as $ from 'jquery';
import * as forge from 'node-forge';
import { Router } from '@angular/router';


import { DatePipe } from '@angular/common';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ApiService } from './api.service';
import { ConstantsService } from './constants.service';



@Injectable({
  providedIn: 'root',
})



export class CommonService {

   favink1:string=''
  favink2:string=''
  private userloggedinSubject = new BehaviorSubject<boolean>(false);
  userloggedin$ = this.userloggedinSubject.asObservable();

  private userCompanysubject = new BehaviorSubject<string>('');
  userCompany$ = this.userCompanysubject.asObservable();

  private isAdmin = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdmin.asObservable();

  public userType = new BehaviorSubject<string>('');
  userType$ = this.userType.asObservable();

  private userprofilesubject = new BehaviorSubject<string>('');
  userprofile$ = this.userprofilesubject.asObservable();

  private dataSubject = new BehaviorSubject<string>('');
  private userinfo = new BehaviorSubject<string>('');
  private RegisteredCompanyDetails = new BehaviorSubject<string>('');
  private selectedcompany = new BehaviorSubject<string>('');
  private freeZone = new BehaviorSubject<string>('');

  private inactivityTimer: any;
  private readonly INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
  isSidebar:boolean=false

  // private sidebarOpen = false;
  private isDrawerOpenSubject = new BehaviorSubject<boolean>(false);

 // userloggedin:boolean=false;
 uuid:string='';
 src:any;
 base64PdfString:any;
 usertypedata:string='';
  publicKey!: string;
  constructor(
    private translate: TranslateService,
    private Toastr: ToastrService,
    private datePipe: DatePipe,private Router:Router, private apicall:ApiService, private consts:ConstantsService
  ) {


     this.usertypedata=this.getUserType() || '';
    if(this.usertypedata!=undefined || this.usertypedata !=null || this.usertypedata!=''){
      this.userloggedinSubject.next(true);
    }
    else{

      let data:any;
    data=sessionStorage.getItem('currentcompany');
    console.log(data);

    if(data!=undefined || data !=null){
      this.userloggedinSubject.next(true);
            let abc=JSON.parse(data)
            abc=abc.role;
            console.log(data)
            this.userCompanysubject.next(data.business_name)

            if(abc=="Admin"){
            this.isAdmin.next(true);
            }
            else if(abc=="User"){
            this.isAdmin.next(false);
            }
            else{
              this.isAdmin.next(false);
            }
      }
      else{
      this.userloggedinSubject.next(false);
      this.userCompanysubject.next('');
      }

      
     let data2=sessionStorage.getItem('userProfile');
     if(data2!=undefined || data2 !=null){
             let abc=JSON.parse(data2)
             this.userprofilesubject.next(abc.Data?.firstnameEN);

     }

    }


    



      
    
  }

  

  //toaster message alerts
  showErrorMessage(data: any) {
    if (data != undefined) {
      var status = this.translate.instant(data);
      this.Toastr.error(data);
    }
  }
  showSuccessMessage(data: any) {
    if (data != undefined) {
      var status = this.translate.instant(data);
      this.Toastr.success(data);
    }
  }

  convertISOToCustomFormat(isoDate: any) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const date = new Date(isoDate);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    const customFormattedDate = `${day}-${month}-${year}`;
    return customFormattedDate;
  }

  setData(data: string) {
    this.dataSubject.next(data);
  }

  getData() {
    return this.dataSubject.asObservable();
  }

  setDataCommon(objData: { key: string, value: object }) {
    const data = JSON.stringify(objData);
    this.dataSubject.next(data);
  }

  getDataCommon() {
    return this.dataSubject.asObservable();
  }

  setUserIfoData(data: string) {
    this.userinfo.next(data);
  }

  getUserIfoData() {
    return this.userinfo.asObservable();
  }

  setRegisteredCompanyDetails(data: string) {
    this.RegisteredCompanyDetails.next(data);
  }

  getRegisteredCompanyDetails() {
    return this.RegisteredCompanyDetails.asObservable();
  }

  

  // showLoading(): void {
  //   $('#loading').show();
  // }
  showLoading(): void {
    $('#loading').show();
  
    setTimeout(() => {
      $('#loading').hide(); // Hide the loader after 5 seconds
    }, 30000); // 5000 milliseconds = 5 seconds
  }
  

  formatDateString(dateString: string): string {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${day}/${month}/${year}`;
  }
  

  hideLoading(): void {
    $('#loading').hide();
  }

  // setSelectedCompany(data: string) {
  //   this.selectedcompany.next(data);
  // }

  // getSelectedCompany() {
  //   return this.selectedcompany.asObservable();
  // }

  getUserType(){
    let usertype=sessionStorage.getItem('ussertype');
    return usertype;
  }


  setUserType(usertype:string){
    sessionStorage.setItem('ussertype', usertype);
    this.userType.next(usertype);
  }

  setSelectedCompany(data: any) {
    // this.RegisteredCompanyDetails.next(data);
     sessionStorage.setItem('currentcompany', JSON.stringify(data));
     if(data!=undefined || data !=null){
      this.userloggedinSubject.next(true);
      this.userCompanysubject.next(data.business_name)
     // this.userloggedin=true;
          //  let abc=JSON.parse(data)
          let  abc=data.role;
            if(abc=="Admin"){
            this.isAdmin.next(true);
            }
            else if(abc=="User"){
            this.isAdmin.next(false);
            }
            else{
            this.isAdmin.next(false);
            }
      }
      else{
     // this.userloggedin=false;
      this.userloggedinSubject.next(false);
      this.userCompanysubject.next('')
      }
   }
 
   getSelectedCompany() {
     const myselectedcompany = sessionStorage.getItem('currentcompany');
      if (myselectedcompany) {
       return JSON.parse(myselectedcompany);
     }
     else{
      let dat=sessionStorage.getItem('userProfile');
      let usertype=this.getUserType() || '';

      if(dat!=undefined ||dat!=null && usertype!='LCAAdmin')
      {
        console.log("to landing page from common service line 284")
        this.Router.navigateByUrl('/landingpage');
      }
     }
     //return null;
   }
 

  setfreezone(data: string) {
    this.freeZone.next(data);
  }

  getfreezone() {
    return this.freeZone.asObservable();
  }

  // toggleSidebar() {
  //   this.sidebarOpen = !this.sidebarOpen;
  // }

  // isSidebarOpen() {
  //   return this.sidebarOpen;
  // }
  

  isDrawerOpen$ = this.isDrawerOpenSubject.asObservable();

  toggleDrawer() {
    this.isDrawerOpenSubject.next(!this.isDrawerOpenSubject.value);
  }


  setSidebarVisibility(data: boolean) {
    this.isSidebar=data;
  }

  GetSidebarVisibility() {
    return this.isSidebar;
  }

  encryptWithPublicKey(valueToEncrypt: string): string {
 
    this.publicKey = `-----BEGIN PUBLIC KEY-----
    MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQClnd0dRXYSiKkHgmzq53FiEAiR
    dWOU2EZMFDYbICt/t0SB0FLfN7pOaI3t9/WxxBmqHPL6MrFTDdmJi0BLD2LTDQ4E
    sZl4Uj1u7PJyDewjQxpehRv5dZ6u7wXOy0U9/WsNrWMrZo3UiL9Dndb6GUciXo31
    MQyXkegCGYxB/qm19wIDAQAB
    -----END PUBLIC KEY-----`;
    
    const rsa = forge.pki.publicKeyFromPem(this.publicKey);
    return window.btoa(rsa.encrypt(valueToEncrypt.toString()));
  }
  
  
  // splitdatetime(datetimeString: any) {
  //   if (datetimeString && typeof datetimeString === 'string') {
  //     const dateTimeParts = datetimeString.split('T'); // Splitting the string at 'T'
  //     if (dateTimeParts.length === 2) {
  //       return {
  //         date: dateTimeParts[0],
  //         time: dateTimeParts[1],
  //       };
  //     }
  //   }
  //   return null; // Invalid or null datetime string
  // }
  splitdatetime(datetimeString: any) {
    if (datetimeString && typeof datetimeString === 'string') {
      const dateTimeParts = datetimeString.split('T'); // Splitting the string at 'T'
      if (dateTimeParts.length === 2) {
        return {
          date: this.datePipe.transform(dateTimeParts[0], 'dd-MMM-yyyy'),
          time: dateTimeParts[1],
        };
      }
      else{
        return {
          date: this.datePipe.transform(dateTimeParts[0], 'dd-MMM-yyyy'),
          time: '',
        };
  
      }
    }
    return null; // Invalid or null datetime string
  }

  splitdatetime1(datetimeString: any) {
    if (datetimeString && typeof datetimeString === 'string') {
      const dateTimeParts = datetimeString;
      if (dateTimeParts.length === 8) {
        const parsedDate = new Date(
          Number(dateTimeParts.substr(4, 4)),
          Number(dateTimeParts.substr(2, 2)) - 1,
          Number(dateTimeParts.substr(0, 2))
        );
        return {
          date: this.datePipe.transform(parsedDate, 'dd-MMM-yyyy'),
        };
      }
    }
    return null; // Invalid or null datetime string
  }

  setUserProfile(userProfile: any) {
    console.log(userProfile);
    sessionStorage.setItem('userProfile', JSON.stringify(userProfile));
    this.startInactivityTimer();
    let userdata=JSON.parse(userProfile)

    //this.userprofilesubject.next(userdata);

    if(userdata!=undefined || userdata !=null){
            // let abc=JSON.parse(userdata)
            this.userprofilesubject.next(userdata.Data?.firstnameEN);

    }


    
  }

  getUserProfile() {
    const userProfileString = sessionStorage.getItem('userProfile');
    if (userProfileString) {
      let abc=JSON.parse(userProfileString);
      let abc1=JSON.parse(abc);

      console.log(abc1);
      return JSON.parse(userProfileString);
    }
    else{

      //dont put logout here as getuserprofile is getting called before set
    //  this.Router.navigateByUrl('/logout')

    //  this.Router.navigateByUrl('https://mofastg.mofaic.gov.ae/en/Account/Redirect-To-EDAS-V2')
    return null

    }
   // return null;
  }

  setCompanyList(companylist: any) {
    console.log(companylist);
    sessionStorage.setItem('companylist', JSON.stringify(companylist));
    this.startInactivityTimer();
  }

  getCompanyList() {
    const companylistString = sessionStorage.getItem('companylist');
    if (companylistString) {
      console.log(companylistString);
      return JSON.parse(companylistString);
    }
    return null;
  }
  setpaymentdetails(paymentidandinvuno: any) {
    console.log(paymentidandinvuno);
    sessionStorage.setItem('PID', JSON.stringify(paymentidandinvuno));
    this.startInactivityTimer();
  }

  getpaymentdetails() {
    const paymentidandinvunoString = sessionStorage.getItem('PID');
    if (paymentidandinvunoString) {
      console.log(paymentidandinvunoString);
      return JSON.parse(paymentidandinvunoString);
    }
    return null;
  }

  startInactivityTimer() {
    // Clear existing timer (if any)
    this.clearInactivityTimer();
    // Start a new timer for inactivity
    this.inactivityTimer = setTimeout(() => {
      // Session timeout action - you can logout the user or perform any other action
      this.logoutUser();
    }, this.INACTIVITY_TIMEOUT);
  }

  clearInactivityTimer() {
    // Clear the inactivity timer
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }
  
  logoutUser() {
    // Perform logout actions here, e.g., remove user data from SessionStorage
    // sessionStorage.clear();   //keep it back
    // this.userloggedinSubject.next(false);
    // sessionStorage.removeItem('userProfile');
   // this.Router.navigateByUrl("/logout")
//this.Router.navigateByUrl('https://mofastg.mofaic.gov.ae/en/Account/Redirect-To-EDAS-V2')
  //window.location.href = "https://mofastg.mofaic.gov.ae/en/Account/Redirect-To-EDAS-V2"
    
    // Redirect to the login page or perform other logout-related tasks
  }

  convertBase64ToPdf(base64Data: string): void {
    const binaryData = atob(base64Data);
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }

    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    // You can now use the 'url' to display or download the PDF as needed.
    // For example, you can open it in a new window:
    window.open(url);
  }
  formatDateTime_API_payload(dateTimeString: string): string {
    const date = new Date(dateTimeString);
  
    // Get date components
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2); // Get the last two digits of the year
  
    return `${day}-${month}-${year}`;
  }

  calculateDifference(attestreqdate: string) {
    const today = new Date();
    const reqDate = new Date(attestreqdate); // Convert to date if not already
    const differenceInDays = Math.floor((today.getTime() - reqDate.getTime()) / (1000 * 3600 * 24));
    return 15 - differenceInDays;
  }
  // calculateDifference(attestreqdate: string) {
  //   // Assuming attestreqdate is in 'yyyyMMdd' format
  //   const year = +attestreqdate.substring(0, 4); // Extract year
  //   const month = +attestreqdate.substring(4, 6) - 1; // Extract month (0-indexed)
  //   const day = +attestreqdate.substring(6, 8); // Extract day
  //   const reqDate = new Date(year, month, day); // Create a date object
  
  //   const today = new Date();
  //   const differenceInDays = Math.floor((today.getTime() - reqDate.getTime()) / (1000 * 3600 * 24));
  //   return 15 - differenceInDays;
  // }

   formatAmount(amount: number | undefined): string {
    if (amount === undefined || isNaN(amount)) {
      return '';
    }
  
    // Use toLocaleString to format the number with commas
    return amount.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }


   static blankInputValidator(fieldName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;

      if (!value || value.trim() === '') {
        return { blankInput: `${fieldName} cannot be blank.` };
      }

      return null; // No error
    };
  }

  async getPaymentReceiptbase64(invoiceuno: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let data2 = sessionStorage.getItem('userProfile');
  
      if (data2 != undefined || data2 != null) {
        let abc = JSON.parse(data2);
        let bcd = JSON.parse(abc);
        this.uuid = bcd.Data?.uuid;
      } else {
        reject("User profile not found");
        return;
      }
  
      let data = {
        "uuid": this.uuid,
        "invoiceuno": invoiceuno.toString()
      };
  
      this.showLoading();
  
      this.apicall.post(this.consts.getPaymentReceipt, data).subscribe({
        next: (success: any) => {
          this.hideLoading();
          const resp = success;
  
          if (resp.responsecode == 1) {
            this.base64PdfString = resp.data;
            var binary_string = this.base64PdfString.replace(/\\n/g, '');
            binary_string = window.atob(this.base64PdfString);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
  
            for (var i = 0; i < len; i++) {
              bytes[i] = binary_string.charCodeAt(i);
            }
  
            this.src = bytes.buffer;
            console.log("payment receipt is success");
            resolve(this.src);
          } else {
            this.showErrorMessage('Attachment load failed');
            reject("Attachment load failed");
          }
        },
        error: (error: any) => {
          this.hideLoading();
          console.error("Error fetching payment receipt:", error);
          reject(error);
        }
      });
    });
  }
  
  getimagebase64(attestfilelocation:any){
    let resp;
    let data={
      "attestfilelocation":attestfilelocation,
      "uuid":this.uuid
    }
    this.showLoading();
  
    this.apicall.post(this.consts.getAttestationFileContent,data).subscribe({next:(success:any)=>{
      this.hideLoading();
  
      resp=success;
      if(resp.responsecode==1){
      this.base64PdfString=resp.data;
  
          const base64 = this.base64PdfString.replace('data:application/pdf;base64,', '');
  
            // Convert base64 to a byte array
            const byteArray = new Uint8Array(atob(base64).split('').map(char => char.charCodeAt(0)));
  
            // Create a Blob and download the file
            const file = new Blob([byteArray], { type: 'application/pdf' });
            const fileUrl = URL.createObjectURL(file);
  
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = 'Attestation_.pdf'; // You can customize the file name here
  
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
  
      }
      else{
        this.showErrorMessage('Attachment load failed')
        //this.loading=false;
      }
    }
  })
  return this.base64PdfString;
  
  }
  
}
