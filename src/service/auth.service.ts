import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

 usertypedata:string='';

 private userRoleSubject = new Subject<string>();
 userRole$ = this.userRoleSubject.asObservable();
 userRole: string=''; // You might want to initialize this with a default value if needed




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

  private isAuthenticated= false;

  constructor() { }

  loginAsCompanyUser(): void {
    // this.userTypeSubject.next('company'); // Set the user type
    // this.userLoggedInSubject.next(true);
    //Start for company user
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
// end for company user
  }

  loginAsLcaUser(): void {
    // this.userTypeSubject.next('lca'); // Set the user type
    // this.userLoggedInSubject.next(true);

    
//start for lca user

let data2=sessionStorage.getItem('userProfile');
if(data2!=undefined || data2 !=null){
        let abc=JSON.parse(data2)
        this.userprofilesubject.next(abc.Data?.firstnameEN);
        this.usertypedata=this.getuserRole() || '';
        if(this.usertypedata!=undefined || this.usertypedata !=null){
   this.lcauserloggedinSubject.next(true)
        }
        else{
         this.lcauserloggedinSubject.next(false)
   
        }

}
else{
  this.lcauserloggedinSubject.next(false)

}



//end for lca user
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

   getuserRole(): string {
    // Retrieve user role from localStorage
    return localStorage.getItem('userrole') || '';
    
  }

  setUserRole(role: string): void {
    this.userRole = role;
    // this.userRoleSubject.next(role);
this.lcauserloggedinSubject.next(true)

    localStorage.setItem('userrole', role);
    this.userRoleSubject.next(role);
  }

  isAuthenticatedlca(): boolean {
    return this.isAuthenticated;
  }

  isAuthenticatedcompany(): boolean {
    return this.isAuthenticated;
  }

  logout(){

    sessionStorage.clear();
   //this.commonService.logoutUser();
    //this.router.navigateByUrl('/logout')
    window.location.href = "https://stg-id.uaepass.ae/idshub/logout?redirect_uri=https://stg-selfcare.uaepass.ae"

  }

}
