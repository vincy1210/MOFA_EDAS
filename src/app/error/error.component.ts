import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/service/common.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import jspdf from 'jspdf';
import * as FileSaver from 'file-saver';
import { AuthService } from 'src/service/auth.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  showSignOutMessage: boolean = false;
  timenow:Date=new Date();
  timestr:any;
  sessionnote:string='';
authcodedata:any;
  // data={
  //   name: "vincy",
  //   company:"Ducont"
  // }
  firsttime:number=1;

  constructor(public common:CommonService,private datePipe: DatePipe, private Router:Router, private auth:AuthService) { 

    let abc=this.common.getauthcodedata();
if(abc){
  this.authcodedata= abc;
    console.log(this.authcodedata);
}
   

    this.common.getlogoutreason().subscribe(data => {
   

      if(data){
if(data=="session"){
  this.sessionnote='Your session got logged out due to inactivity, we look forward to serve you again';
}
else if(data=="manuallogout"){
  this.sessionnote='You have been successfully logged out, we look forward to serve you again';
}
      }
      });
  
	
  }

  ngOnInit(): void {
    this.timestr = this.datePipe.transform(this.timenow, 'MMM d yyyy h:mm:ss a');
    if(this.sessionnote==''){
      this.sessionnote='Your session got logged out due to inactivity, we look forward to serve you again';

    }
// manual logout will clear the session and redirect
//session idle logout session will be cleared here 
    // this.auth.logout();
    window.history.replaceState({}, document.title, window.location.href);

    sessionStorage.clear();

    if (this.isUserSignedOut()){
      this.showSignOutMessage = true;
    }
    else{
     
      window.location.reload();
    }
  }

  private isUserSignedOut(): boolean {

    let data11=this.common.getUserProfile();
    let uuid;
    if(data11==null || data11==undefined){
     return true;
    }
    else{
      return false;
    }
  
  }
  redirecttologin(){

console.log(environment.redirectURL)
window.location.href = environment.redirectURL;

  }

  redirecttogloballogout(){

    //     let abc= this.common.getauthcodedata()
// console.log(abc);
// console.log(this.authcodedata);
let abc=JSON.parse(this.authcodedata)
let link=abc.Code+'&lang=en&email='+abc.Email;
console.log(environment.logoutURL+link)
//f38b7cc7-a6d1-4310-a18f-eb6c0c721589&lang=ar&email=x44IfzFRhSE77EqMnZHviNyq33%252fnZ%252bNANeQzi2RXZhk%253d
// let balanceurl=abc.


    window.location.href = environment.logoutURL+link;

  }

}
