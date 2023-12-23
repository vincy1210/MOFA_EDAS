import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  favink1: string = '';
  favink2: string = '';
  public userloggedinSubject = new BehaviorSubject<boolean>(false);
  userloggedin$ = this.userloggedinSubject.asObservable();

  public lcauserloggedinSubject = new BehaviorSubject<boolean>(false);
  lcauserloggedin$ = this.lcauserloggedinSubject.asObservable();

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

  private userRoleSubject = new Subject<string>();
  userRole$ = this.userRoleSubject.asObservable();
  userRole: string = ''; // You might want to initialize this with a default value if needed

  private inactivityTimer: any;
  private readonly INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
  isSidebar: boolean = false;

  constructor(private router: Router) {
    let data2 = sessionStorage.getItem('userProfile');
    if (data2 != undefined || data2 != null) {
      let abc = JSON.parse(data2);
      this.userprofilesubject.next(abc.Data?.firstnameEN);
      let usertypedata = this.getLCAUser() || '';
      console.log(usertypedata);
      if (usertypedata) {
        this.lcauserloggedinSubject.next(true);
      } else {
        this.lcauserloggedinSubject.next(false);
      }
    } else {
      this.lcauserloggedinSubject.next(false);
    }

    let data: any;
    data = sessionStorage.getItem('currentcompany');
    console.log(data);

    if (data != undefined || data != null) {
      this.userloggedinSubject.next(true);
      let abc = JSON.parse(data);
      abc = abc.role;
      console.log(data);
      this.userCompanysubject.next(data.business_name);

      if (abc == 'Admin') {
        this.isAdmin.next(true);
      } else if (abc == 'User') {
        this.isAdmin.next(false);
      } else {
        this.isAdmin.next(false);
      }
    } else {
      this.userloggedinSubject.next(false);
      this.userCompanysubject.next('');
    }
  }

  logout() {
    this.userloggedinSubject.next(false);
    this.lcauserloggedinSubject.next(false);
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigateByUrl('/logout');
  }

  getLCAUser(): string {
    // Retrieve user role from localStorage
    return sessionStorage.getItem('userrole') || '';
  }

  setLCAUser(role: string): void {
    this.userRole = role;
    // this.userRoleSubject.next(role);
    this.lcauserloggedinSubject.next(true);

    sessionStorage.setItem('userrole', role);
    this.userRoleSubject.next(role);
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
  setUserProfile(userProfile: any) {
    console.log(userProfile);
    sessionStorage.setItem('userProfile', JSON.stringify(userProfile));
    let userdata = JSON.parse(userProfile);

    //this.userprofilesubject.next(userdata);

    if (userdata != undefined || userdata != null) {
      // let abc=JSON.parse(userdata)
      this.userprofilesubject.next(userdata.Data?.firstnameEN);
    }
  }

  getSelectedCompany() {
    const myselectedcompany = sessionStorage.getItem('currentcompany');
    if (myselectedcompany) {
      return JSON.parse(myselectedcompany);
    } else {
      let dat = sessionStorage.getItem('userProfile');

      if (dat != undefined || dat != null) {
        console.log('to landing page from common service line 284');
        this.router.navigateByUrl('/landingpage');
      }
      // else{
      //   //this.logout();//vincy
      //   this.redirecttoEdas();
      // }
    }
    //return null;
  }
  redirecttoEdas() {
    window.location.href =
      'https://stg-id.uaepass.ae/idshub/logout?redirect_uri=https://mofastg.mofaic.gov.ae/en/Account/Redirect-To-EDAS-V2';
  }

  setSelectedCompany(data: any) {
    sessionStorage.setItem('currentcompany', JSON.stringify(data));
    if (data != undefined || data != null) {
      this.userloggedinSubject.next(true);
      this.userCompanysubject.next(data.business_name);
      let abc = data.role;
      if (abc == 'Admin') {
        this.isAdmin.next(true);
      } else if (abc == 'User') {
        this.isAdmin.next(false);
      } else {
        this.isAdmin.next(false);
      }
    } else {
      // this.userloggedin=false;
      this.userloggedinSubject.next(false);
      this.userCompanysubject.next('');
    }
  }

  isAuthenticated(): boolean {
    const userProfile = this.getUserProfile();
    const selectedCompany = this.getSelectedCompany();
    const isLCUser = this.getLCAUser();

    // Check if both user profile and selected company are available
    if (userProfile && selectedCompany) {
      // Assuming a user is authenticated if the user type is 'company'
      if (selectedCompany.role === 'Admin') {
        return true;
      }

      // Assuming a user is authenticated if the user type is 'LCA'
      if (selectedCompany.role === 'User') {
        return true;
      }

      if (isLCUser) {
        return true;
      }
      // Add more conditions as needed based on your specific requirements
      // If no specific conditions are met, return false
      return false;
    } else if (userProfile) {
      return true; // needd to correct this
    } else {
      // If either user profile or selected company is missing, return false
      return false;
    }
  }
}
