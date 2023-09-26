import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import * as $ from 'jquery';
import * as forge from 'node-forge';
import { Router } from '@angular/router';


import { DatePipe } from '@angular/common';



@Injectable({
  providedIn: 'root',
})
export class CommonService {
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
  


  publicKey!: string;
  constructor(
    private translate: TranslateService,
    private Toastr: ToastrService,
    private datePipe: DatePipe,private Router:Router
  ) {}

  

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
  
  
  splitdatetime(datetimeString: any) {
    if (datetimeString && typeof datetimeString === 'string') {
      const dateTimeParts = datetimeString.split('T'); // Splitting the string at 'T'
      if (dateTimeParts.length === 2) {
        return {
          date: dateTimeParts[0],
          time: dateTimeParts[1],
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
  }

  getUserProfile() {
    const userProfileString = sessionStorage.getItem('userProfile');
    if (userProfileString) {
      console.log(userProfileString);
      return JSON.parse(userProfileString);
    }
    return null;
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
    sessionStorage.removeItem('userProfile');
this.Router.navigateByUrl('https://mofastg.mofaic.gov.ae/en/Account/Redirect-To-EDAS-V2')
    
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
}
