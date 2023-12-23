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

import { Subject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import {
  RoleEnums,
  PermissionEnums,
} from 'src/app/shared/constants/status-enum';

export type RetType = {
  name: string;
  menu: string;
  menufull?: string;
  requiredRoles: number[];
  permissionRoles: { role: number; permission: number[] }[];
};

export const ConstAccessDenied: string = 'access-denied';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  favink1: string = '';
  favink2: string = '';
  // public userloggedinSubject = new BehaviorSubject<boolean>(false);
  // userloggedin$ = this.userloggedinSubject.asObservable();

  // public lcauserloggedinSubject = new BehaviorSubject<boolean>(false);
  // lcauserloggedin$ = this.lcauserloggedinSubject.asObservable();

  // private userCompanysubject = new BehaviorSubject<string>('');
  // userCompany$ = this.userCompanysubject.asObservable();

  // private isAdmin = new BehaviorSubject<boolean>(false);
  // isAdmin$ = this.isAdmin.asObservable();

  public userType = new BehaviorSubject<string>('');
  userType$ = this.userType.asObservable();

  private userprofilesubject = new BehaviorSubject<string>('');
  userprofile$ = this.userprofilesubject.asObservable();

  private dataSubject = new BehaviorSubject<string>('');
  private alrregcompany = new BehaviorSubject<string>('');
  private logoutreason = new BehaviorSubject<string>('');

  // logoutreason

  private userinfo = new BehaviorSubject<string>('');
  private RegisteredCompanyDetails = new BehaviorSubject<string>('');
  private selectedcompany = new BehaviorSubject<string>('');
  private freeZone = new BehaviorSubject<string>('');

  // private userRoleSubject = new Subject<string>();
  // userRole$ = this.userRoleSubject.asObservable();
  // userRole: string=''; // You might want to initialize this with a default value if needed

  private inactivityTimer: any;
  private readonly INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
  isSidebar: boolean = false;

  // private sidebarOpen = false;
  private isDrawerOpenSubject = new BehaviorSubject<boolean>(false);

  uuid: string = '';
  src: any;
  base64PdfString: any;
  usertypedata: string = '';
  publicKey!: string;
  constructor(
    private translate: TranslateService,
    private Toastr: ToastrService,
    private datePipe: DatePipe,
    private Router: Router,
    private apicall: ApiService,
    private consts: ConstantsService,
    private auth: AuthService
  ) {
    // end for company user
  }

  //toaster message alerts
  showErrorMessage(data: any) {
    if (data != undefined) {
      var status = this.translate.instant(data);
      this.Toastr.error(status);
    }
  }
  showSuccessMessage(data: any) {
    if (data != undefined) {
      var status = this.translate.instant(data);
      this.Toastr.success(status);
    }
  }

  showWarningMessage(data: any) {
    if (data != undefined) {
      var status = this.translate.instant(data);
      this.Toastr.warning(status);
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

  setDataCommon(objData: { key: string; value: object }) {
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

  // setSelectedCompany(data: any) {
  //    sessionStorage.setItem('currentcompany', JSON.stringify(data));
  //    if(data!=undefined || data !=null){
  //     this.userloggedinSubject.next(true);
  //     this.userCompanysubject.next(data.business_name)
  //         let  abc=data.role;
  //           if(abc=="Admin"){
  //           this.isAdmin.next(true);
  //           }
  //           else if(abc=="User"){
  //           this.isAdmin.next(false);
  //           }
  //           else{
  //           this.isAdmin.next(false);
  //           }
  //     }
  //     else{
  //    // this.userloggedin=false;
  //     this.userloggedinSubject.next(false);
  //     this.userCompanysubject.next('')
  //     }
  //  }

  //  getSelectedCompany() {
  //    const myselectedcompany = sessionStorage.getItem('currentcompany');
  //     if (myselectedcompany) {
  //      return JSON.parse(myselectedcompany);
  //    }
  //    else{
  //     let dat=sessionStorage.getItem('userProfile');

  //     if(dat!=undefined ||dat!=null )
  //     {
  //       console.log("to landing page from common service line 284")
  //       this.Router.navigateByUrl('/landingpage');
  //     }
  //    }
  //    //return null;
  //  }

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
    this.isSidebar = data;
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
      } else {
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
    let userdata = JSON.parse(userProfile);

    //this.userprofilesubject.next(userdata);

    if (userdata != undefined || userdata != null) {
      // let abc=JSON.parse(userdata)
      this.userprofilesubject.next(userdata.Data?.firstnameEN);
    }
  }

  getUserProfile() {
    const userProfileString = sessionStorage.getItem('userProfile');
    if (userProfileString) {
      let abc = JSON.parse(userProfileString);
      let abc1 = JSON.parse(abc);

      console.log(abc1);
      return JSON.parse(userProfileString);
    } else {
      return null;
    }
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
      this.auth.logout();
    }, this.INACTIVITY_TIMEOUT);
  }

  clearInactivityTimer() {
    // Clear the inactivity timer
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
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

  // calculateDifference(attestreqdate: string) {
  //   const today = new Date();
  //   const reqDate = new Date(attestreqdate); // Convert to date if not already
  //   const differenceInDays = Math.floor((today.getTime() - reqDate.getTime()) / (1000 * 3600 * 24));
  //   return 15 - differenceInDays;
  // }
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
        reject('User profile not found');
        return;
      }

      let data = {
        uuid: this.uuid,
        invoiceuno: invoiceuno.toString(),
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
            console.log('payment receipt is success');
            resolve(this.src);
          } else {
            this.showErrorMessage('Attachment load failed');
            reject('Attachment load failed');
          }
        },
        error: (error: any) => {
          this.hideLoading();
          console.error('Error fetching payment receipt:', error);
          reject(error);
        },
      });
    });
  }

  getimagebase64(attestfilelocation: any) {
    let resp;
    let data = {
      attestfilelocation: attestfilelocation,
      uuid: this.uuid,
    };
    this.showLoading();

    this.apicall.post(this.consts.getAttestationFileContent, data).subscribe({
      next: (success: any) => {
        this.hideLoading();

        resp = success;
        if (resp.responsecode == 1) {
          this.base64PdfString = resp.data;

          const base64 = this.base64PdfString.replace(
            'data:application/pdf;base64,',
            ''
          );

          // Convert base64 to a byte array
          const byteArray = new Uint8Array(
            atob(base64)
              .split('')
              .map((char) => char.charCodeAt(0))
          );

          // Create a Blob and download the file
          const file = new Blob([byteArray], { type: 'application/pdf' });
          const fileUrl = URL.createObjectURL(file);

          const link = document.createElement('a');
          link.href = fileUrl;
          link.download = 'Attestation_.pdf'; // You can customize the file name here

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          this.showErrorMessage('Attachment load failed');
          //this.loading=false;
        }
      },
    });
    return this.base64PdfString;
  }

  filterColumnsClientDataTrim(filters: any) {
    let filterList: any[] = [];
    for (const key in filters) {
      if (filters.hasOwnProperty(key)) {
        const rows = filters[key];
        if (rows && rows.length > 0) {
          const { value } = rows[0];
          const myObject: { [key: string]: any } = {};
          if (value && value.length > 0) {
            myObject[key] = rows;
            filterList.push(myObject);
          }
        }
      }
    }
    return filterList;
  }

  sortClientData(
    data: any[],
    sortKey: string,
    ascending: boolean = true
  ): any[] {
    return data.sort((a, b) => {
      let valueA = a[sortKey];
      let valueB = b[sortKey];

      if (valueA === null) valueA = '';
      if (valueB === null) valueB = '';

      valueA = valueA.toString().toLowerCase();
      valueB = valueB.toString().toLowerCase();

      if (valueA < valueB) {
        return ascending ? -1 : 1;
      } else if (valueA > valueB) {
        return ascending ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  areAllStringsEmpty(arr: string[]): boolean {
    return arr.every((str) => str === '');
  }

  filterColumnsClientData(data: any[], filterList: any) {
    return data.filter((item) => {
      for (const key in item) {
        if (filterList && Object.keys(filterList).length === 0) {
          return true;
        }
        let filters = filterList[key];
        let { value1, matchMode1, operator1 } = {
          value1: '',
          matchMode1: '',
          operator1: '',
        };
        if (filters && filters.length > 0) {
          const { value, matchMode, operator } = filters[0];
          value1 = value;
          matchMode1 = matchMode;
          operator1 = operator;
        }
        if (value1 && value1.length > 0) {
          //key === "tradelicenseno"
          let valuedata = item[key];
          const result = valuedata === null ? '' : valuedata;
          if (result.toString().toLowerCase().includes(value1.toLowerCase())) {
            return true;
          }
        }
      }
      return false;
    });
  }

  filterClientData(data: any[], searchTerm: string) {
    return data.filter((item) => {
      for (const key in item) {
        let value = item[key];
        const result = value === null ? '' : value;
        if (
          result.toString().toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return true;
        }
      }
      return false;
    });
  }

  maskEmail(email: string): string {
    const parts = email.split('@');
    const username = parts[0];
    const domain = parts[1];

    // Mask characters in the username, keeping the first three characters
    const maskedUsername =
      username.length > 3
        ? username.substring(0, 3) + '*'.repeat(username.length - 3)
        : username;

    // Combine masked username and domain to form the masked email
    const maskedEmail = `${maskedUsername}@${domain}`;

    return maskedEmail;
  }
  // Example usage

  SetAlreadyregisteredcompanydetails(data: any) {
    // sessionStorage.setItem('alreadyRegCompanyDetails',data);
    this.alrregcompany.next(data);
  }

  GetAlreadyregisteredcompanydetails() {
    // let data= sessionStorage.getItem('alreadyRegCompanyDetails');
    // return  data;

    return this.alrregcompany.asObservable();
  }

  setlogoutreason(data: any) {
    this.logoutreason.next(data);
  }

  getlogoutreason() {
    return this.logoutreason.asObservable();
  }

  redirecttologin() {
    window.location.href =
      'https://stg-id.uaepass.ae/idshub/logout?redirect_uri=https://mofastg.mofaic.gov.ae/en/Account/Redirect-To-EDAS-V2';
  }
  formatDatestringtodate(dateString: string): string {
    const date = new Date(
      parseInt(dateString.substring(0, 4)),
      parseInt(dateString.substring(4, 6)) - 1,
      parseInt(dateString.substring(6, 8))
    );
  
    return this.datePipe.transform(date, 'yyyy-MM-dd') || 'Invalid Date'; // Handle invalid date format
  }

  allPages() {
    const allPages: RetType[] = [
      {
        name: 'dashboard',
        menu: 'dashboard',
        menufull: 'dashboard',
        requiredRoles: [RoleEnums.Admin, RoleEnums.User],
        permissionRoles: [
          { role: RoleEnums.Admin, permission: [PermissionEnums.All] },
          {
            role: RoleEnums.User,
            permission: [PermissionEnums.Add, PermissionEnums.Edit],
          },
        ],
      },
      {
        name: 'companydetails',
        menu: 'companydetails',
        menufull: 'companydetails',
        requiredRoles: [RoleEnums.Admin, RoleEnums.User],
        permissionRoles: [
          { role: RoleEnums.Admin, permission: [PermissionEnums.All] },
          {
            role: RoleEnums.User,
            permission: [PermissionEnums.Add, PermissionEnums.Edit],
          },
        ],
      },
      {
        name: 'userslist',
        menu: 'userslist',
        menufull: 'userslist',
        requiredRoles: [RoleEnums.Admin, RoleEnums.User],
        permissionRoles: [
          { role: RoleEnums.Admin, permission: [PermissionEnums.All] },
          {
            role: RoleEnums.User,
            permission: [PermissionEnums.Add, PermissionEnums.Edit],
          },
        ],
      },
      {
        name: 'rptlca',
        menu: 'rptlca',
        menufull: 'rptlca',
        requiredRoles: [RoleEnums.Admin, RoleEnums.User],
        permissionRoles: [
          { role: RoleEnums.Admin, permission: [PermissionEnums.All] },
          {
            role: RoleEnums.User,
            permission: [PermissionEnums.Add, PermissionEnums.Edit],
          },
        ],
      },
      {
        name: 'rptcoo',
        menu: 'rptcoo',
        menufull: 'rptcoo',
        requiredRoles: [RoleEnums.Admin, RoleEnums.User],
        permissionRoles: [
          { role: RoleEnums.Admin, permission: [PermissionEnums.All] },
          {
            role: RoleEnums.User,
            permission: [PermissionEnums.Add, PermissionEnums.Edit],
          },
        ],
      },
      {
        name: 'rptphysical',
        menu: 'rptphysical',
        menufull: 'rptphysical',
        requiredRoles: [RoleEnums.Admin, RoleEnums.User],
        permissionRoles: [
          { role: RoleEnums.Admin, permission: [PermissionEnums.All] },
          {
            role: RoleEnums.User,
            permission: [PermissionEnums.Add, PermissionEnums.Edit],
          },
        ],
      },
      {
        name: 'rptfines',
        menu: 'rptfines',
        menufull: 'rptfines',
        requiredRoles: [RoleEnums.Admin, RoleEnums.User],
        permissionRoles: [
          { role: RoleEnums.Admin, permission: [PermissionEnums.All] },
          {
            role: RoleEnums.User,
            permission: [PermissionEnums.Add, PermissionEnums.Edit],
          },
        ],
      },
      {
        name: 'attestation',
        menu: 'attestation',
        menufull: 'attestation',
        requiredRoles: [RoleEnums.Admin, RoleEnums.User],
        permissionRoles: [
          { role: RoleEnums.Admin, permission: [PermissionEnums.All] },
          {
            role: RoleEnums.User,
            permission: [PermissionEnums.Add, PermissionEnums.Edit],
          },
        ],
      },
      {
        name: 'lcacompletedattestation',
        menu: 'lcacompletedattestation',
        menufull: 'lcacompletedattestation',
        requiredRoles: [RoleEnums.Admin, RoleEnums.User],
        permissionRoles: [
          { role: RoleEnums.Admin, permission: [PermissionEnums.All] },
          {
            role: RoleEnums.User,
            permission: [PermissionEnums.Add, PermissionEnums.Edit],
          },
        ],
      },
      {
        name: 'CompletedCooRequest',
        menu: 'CompletedCooRequest',
        menufull: 'CompletedCooRequest',
        requiredRoles: [RoleEnums.Admin, RoleEnums.User],
        permissionRoles: [
          { role: RoleEnums.Admin, permission: [PermissionEnums.All] },
          {
            role: RoleEnums.User,
            permission: [PermissionEnums.Add, PermissionEnums.Edit],
          },
        ],
      },
      {
        name: 'cooinreview',
        menu: 'cooinreview',
        menufull: 'cooinreview',
        requiredRoles: [RoleEnums.Admin, RoleEnums.User],
        permissionRoles: [
          { role: RoleEnums.Admin, permission: [PermissionEnums.All] },
          {
            role: RoleEnums.User,
            permission: [PermissionEnums.Add, PermissionEnums.Edit],
          },
        ],
      },
      {
        name: 'cooattestation',
        menu: 'cooattestation',
        menufull: 'cooattestation',
        requiredRoles: [RoleEnums.Admin, RoleEnums.User],
        permissionRoles: [
          { role: RoleEnums.Admin, permission: [PermissionEnums.All] },
          {
            role: RoleEnums.User,
            permission: [PermissionEnums.Add, PermissionEnums.Edit],
          },
        ],
      },
      {
        name: 'physicalattestation',
        menu: 'physicalattestation',
        menufull: 'physicalattestation',
        requiredRoles: [RoleEnums.Admin, RoleEnums.User],
        permissionRoles: [
          { role: RoleEnums.Admin, permission: [PermissionEnums.All] },
          {
            role: RoleEnums.User,
            permission: [PermissionEnums.Add, PermissionEnums.Edit],
          },
        ],
      },
      {
        name: 'completedattestation',
        menu: 'completedattestation',
        menufull: 'completedattestation',
        requiredRoles: [RoleEnums.Admin, RoleEnums.User],
        permissionRoles: [
          { role: RoleEnums.Admin, permission: [PermissionEnums.All] },
          {
            role: RoleEnums.User,
            permission: [PermissionEnums.Add, PermissionEnums.Edit],
          },
        ],
      },
      {
        name: 'physicalinreview',
        menu: 'physicalinreview',
        menufull: 'physicalinreview',
        requiredRoles: [RoleEnums.Admin, RoleEnums.User],
        permissionRoles: [
          { role: RoleEnums.Admin, permission: [PermissionEnums.All] },
          {
            role: RoleEnums.User,
            permission: [PermissionEnums.Add, PermissionEnums.Edit],
          },
        ],
      },
      {
        name: 'lcadashboard',
        menu: 'lcadashboard',
        menufull: 'lcadashboard',
        requiredRoles: [RoleEnums.LcaAdmin, RoleEnums.LcaUser],
        permissionRoles: [
          {
            role: RoleEnums.LcaAdmin,
            permission: [PermissionEnums.All],
          },
          {
            role: RoleEnums.LcaUser,
            permission: [],
          },
        ],
      },
      {
        name: 'importslca',
        menu: 'importslca',
        menufull: 'importslca',
        requiredRoles: [RoleEnums.LcaAdmin, RoleEnums.LcaUser],
        permissionRoles: [
          {
            role: RoleEnums.LcaAdmin,
            permission: [PermissionEnums.All],
          },
          {
            role: RoleEnums.LcaUser,
            permission: [],
          },
        ],
      },
      {
        name: 'pendinglca',
        menu: 'pendinglca',
        menufull: 'pendinglca',
        requiredRoles: [RoleEnums.LcaAdmin, RoleEnums.LcaUser],
        permissionRoles: [
          {
            role: RoleEnums.LcaAdmin,
            permission: [PermissionEnums.All],
          },
          {
            role: RoleEnums.LcaUser,
            permission: [],
          },
        ],
      },
      {
        name: 'completedlca',
        menu: 'completedlca',
        menufull: 'completedlca',
        requiredRoles: [RoleEnums.LcaAdmin, RoleEnums.LcaUser],
        permissionRoles: [
          {
            role: RoleEnums.LcaAdmin,
            permission: [PermissionEnums.All],
          },
          {
            role: RoleEnums.LcaUser,
            permission: [],
          },
        ],
      },
      {
        name: 'risklca',
        menu: 'risklca',
        menufull: 'risklca',
        requiredRoles: [RoleEnums.LcaAdmin, RoleEnums.LcaUser],
        permissionRoles: [
          {
            role: RoleEnums.LcaAdmin,
            permission: [PermissionEnums.All],
          },
          {
            role: RoleEnums.LcaUser,
            permission: [],
          },
        ],
      },
      {
        name: 'lcauserslist',
        menu: 'LCA User Management',
        requiredRoles: [
          RoleEnums.Admin,
          RoleEnums.User,
          RoleEnums.LcaAdmin,
          RoleEnums.LcaUser,
        ],
        permissionRoles: [
          { role: RoleEnums.Admin, permission: [PermissionEnums.All] },
          {
            role: RoleEnums.User,
            permission: [PermissionEnums.Add, PermissionEnums.Edit],
          },
          {
            role: RoleEnums.LcaAdmin,
            permission: [PermissionEnums.All],
          },
          {
            role: RoleEnums.LcaUser,
            permission: [],
          },
        ],
      },
    ];
    return allPages;
  }

  // allPagesDetails
  allPagesDetails(name: string) {
    let retdata: RetType = {} as RetType;
    const allPages: RetType[] = this.allPages();
    const oneData = allPages.find((m) => m.name === name);
    if (oneData?.requiredRoles && oneData?.requiredRoles.length > 0) {
      retdata.requiredRoles = oneData?.requiredRoles;
      retdata.permissionRoles = oneData?.permissionRoles;
      retdata.menu = oneData?.menu;
      retdata.menufull = oneData?.menufull;
      retdata.name = oneData?.name;
    }
    return retdata;
  }

  getRolefromString(role: string) {
    const allRoles: string[] = role.split(',');
    let roleList: number[] = [];
    allRoles.map((item) => {
      if (item === 'Admin') {
        roleList.push(RoleEnums.Admin);
      } else if (item === 'User') {
        roleList.push(RoleEnums.User);
      } else if (item === 'LCAAdminUser') {
        roleList.push(RoleEnums.LcaAdmin);
      } else if (item === 'LCAUser') {
        roleList.push(RoleEnums.LcaUser);
      }
    });
    return roleList;
  }

  // getStartingPage
  getStartingPage(roles: string | undefined) {
    let startingpage = 'access-denied';
    if (roles) {
      const allRoles: number[] = this.getRolefromString(roles);
      if (allRoles && allRoles.length > 0) {
        const allPages: RetType[] = this.allPages();
        const mappedArray = allPages.map((item) => {
          const requiredRoles = item?.requiredRoles;
          if (this.isArrayIncluded(allRoles, requiredRoles)) {
            return item.name;
          } else {
            return ConstAccessDenied;
          }
        });
        if (mappedArray && mappedArray.length > 0) {
          const firstPage = mappedArray.find((m) => m != ConstAccessDenied);
          startingpage = firstPage ? firstPage : ConstAccessDenied;
        }
      }
    }
    return startingpage;
  }

  getUserDetails() {
    let userdetail: any = {} as any;
    if (sessionStorage.getItem('userrolelist') != null) {
      // userProfile, userrole
      let val: any = sessionStorage.getItem('userrolelist');
      userdetail = JSON.parse(val);
    }
    return { Roles: userdetail };
  }

  isArrayIncluded(arr1: number[], arr2: number[]) {
    if(arr1.length){
      return arr2.some((value) => arr1.includes(value));
    }
    else{
      return null;
    }
  }

  // checkPermissionAvailable
  checkPermissionAvailable(pagename: string, permission: number): boolean {
    const { Roles } = this.getUserDetails();
    // const allRoles: number[] = this.getRolefromString(Roles);
    const permissionRoles: { role: number; permission: number[] }[] =
      this.allPagesDetails(pagename)?.permissionRoles;
    const permissionRolesByRole: number[] | undefined = permissionRoles.find(
      (item) => Roles.includes(item.role)
    )?.permission;
    if (permissionRolesByRole && permissionRolesByRole.length > 0) {
      if (this.isArrayIncluded(permissionRolesByRole, [permission])) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  // formatDatestringtodate(dateString: string): string {
  //   const date = new Date(
  //     parseInt(dateString.substring(0, 4)),
  //     parseInt(dateString.substring(4, 6)) - 1,
  //     parseInt(dateString.substring(6, 8))
  //   );
  
  //   return this.datePipe.transform(date, 'yyyy-MM-dd') || 'Invalid Date'; // Handle invalid date format
  // }

  splitdatetimeforstring(datetimeString: any) {
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
}
