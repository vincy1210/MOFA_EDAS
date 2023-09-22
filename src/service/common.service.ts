import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import * as $ from 'jquery';
import * as forge from 'node-forge';



@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private dataSubject = new BehaviorSubject<string>('');
  private userinfo = new BehaviorSubject<string>('');
  private RegisteredCompanyDetails = new BehaviorSubject<string>('');
  private selectedcompany = new BehaviorSubject<string>('');
  private freeZone = new BehaviorSubject<string>('');

  publicKey!: string;





  constructor(private translate: TranslateService, private Toastr:ToastrService) { }

  //toaster message alerts
  showErrorMessage(data:any) {
    if(data != undefined){
      var status = this.translate.instant(data);
      this.Toastr.error(data);
    }
  }
  showSuccessMessage(data:any) {
    if(data != undefined){
      var status = this.translate.instant(data);
      this.Toastr.success(data);
    }
  }


   convertISOToCustomFormat(isoDate:any) {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
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
    $("#loading").show();
   
  }
  hideLoading(): void {
      $("#loading").hide();
  }

 

  setSelectedCompany(data: string) {
    this.selectedcompany.next(data);
  }

  getSelectedCompany() {
    return this.selectedcompany.asObservable();
  }
  setfreezone(data: string){
    this.freeZone.next(data);


  }
  getfreezone(){
    return this.freeZone.asObservable();
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
  
  
}
