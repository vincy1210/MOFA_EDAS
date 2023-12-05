import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import * as $ from 'jquery';
<<<<<<< HEAD
import * as forge from 'node-forge';
import { Router } from '@angular/router';


import { DatePipe } from '@angular/common';
import { AbstractControl, ValidatorFn } from '@angular/forms';


=======
import { DatePipe } from '@angular/common';
>>>>>>> c680799d3ff292b0cd1b35279b01705f3cfd99eb

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

  private userprofilesubject = new BehaviorSubject<string>('');
  userprofile$ = this.userprofilesubject.asObservable();

  private dataSubject = new BehaviorSubject<string>('');
  private userinfo = new BehaviorSubject<string>('');
  private RegisteredCompanyDetails = new BehaviorSubject<string>('');
  private selectedcompany = new BehaviorSubject<string>('');
  private freeZone = new BehaviorSubject<string>('');

<<<<<<< HEAD
  private inactivityTimer: any;
  private readonly INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
  isSidebar:boolean=false

  // private sidebarOpen = false;
  private isDrawerOpenSubject = new BehaviorSubject<boolean>(false);

 // userloggedin:boolean=false;
  


  publicKey!: string;
  constructor(
    private translate: TranslateService,
    private Toastr: ToastrService,
    private datePipe: DatePipe,private Router:Router
  ) {

    let data:any;
    data=sessionStorage.getItem('currentcompany');
    console.log(data);

    if(data!=undefined || data !=null){
      this.userloggedinSubject.next(true);
     // this.userloggedin=true;
            let abc=JSON.parse(data)
            abc=abc.role;
            console.log(data)
            this.userCompanysubject.next(data.business_name)

            if(abc=="Admin"){
            this.isAdmin.next(true);
            }
            else{
            this.isAdmin.next(false);
              
            }
      }
      else{
     // this.userloggedin=false;
      this.userloggedinSubject.next(false);
      this.userCompanysubject.next('');
      }

      //for user

     // data=sessionStorage.getItem('userProfile');
      let data2=sessionStorage.getItem('userProfile');
      if(data2!=undefined || data2 !=null){
        // this.userprofilesubject.next(true);
       // this.userloggedin=true;
              let abc=JSON.parse(data2)
              // console.log(data)
              this.userprofilesubject.next(abc.Data?.firstnameEN);

      }



      
    
  }

  
=======
  constructor(
    private translate: TranslateService,
    private Toastr: ToastrService,
    private datePipe: DatePipe
  ) {}
>>>>>>> c680799d3ff292b0cd1b35279b01705f3cfd99eb

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

<<<<<<< HEAD
  

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
      if(dat!=undefined ||dat!=null)
      {
        this.Router.navigateByUrl('/landingpage');
      }
     }
     //return null;
   }
 

=======
  showLoading(): void {
    $('#loading').show();
  }

  hideLoading(): void {
    $('#loading').hide();
  }

  setSelectedCompany(data: string) {
    this.selectedcompany.next(data);
  }

  getSelectedCompany() {
    return this.selectedcompany.asObservable();
  }

>>>>>>> c680799d3ff292b0cd1b35279b01705f3cfd99eb
  setfreezone(data: string) {
    this.freeZone.next(data);
  }

  getfreezone() {
    return this.freeZone.asObservable();
  }

<<<<<<< HEAD
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
=======
>>>>>>> c680799d3ff292b0cd1b35279b01705f3cfd99eb
  splitdatetime(datetimeString: any) {
    if (datetimeString && typeof datetimeString === 'string') {
      const dateTimeParts = datetimeString.split('T'); // Splitting the string at 'T'
      if (dateTimeParts.length === 2) {
        return {
<<<<<<< HEAD
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
=======
          date: dateTimeParts[0],
          time: dateTimeParts[1],
        };
      }
>>>>>>> c680799d3ff292b0cd1b35279b01705f3cfd99eb
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
<<<<<<< HEAD

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
      console.log(userProfileString);
      return JSON.parse(userProfileString);
    }
    else{

      //dont put logout here as getuserprofile is getting called before set
    //  this.Router.navigateByUrl('/logout')

    //  this.Router.navigateByUrl('https://mofastg.mofaic.gov.ae/en/Account/Redirect-To-EDAS-V2')

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
    sessionStorage.clear();
    this.userloggedinSubject.next(false);
    sessionStorage.removeItem('userProfile');
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

  


  // formatAmount(amount: number): string {
  //   // Use toLocaleString to format the number with commas
  //   return amount.toLocaleString(undefined, { maximumFractionDigits: 2 });
  // }


  // formatAmount(amount: number): string {
  //   // Use toLocaleString to format the number with commas
  //   if(amount!=undefined || amount!=null || amount!='')
  //   {
  //     return amount.toLocaleString(undefined, { maximumFractionDigits: 2 });

  //   }
  //   else{
  //     return ''
  //   }
  // }

   static blankInputValidator(fieldName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;

      if (!value || value.trim() === '') {
        return { blankInput: `${fieldName} cannot be blank.` };
      }

      return null; // No error
    };
  }
  
  
=======
>>>>>>> c680799d3ff292b0cd1b35279b01705f3cfd99eb
}
