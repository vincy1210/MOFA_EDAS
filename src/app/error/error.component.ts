import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/service/common.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import jspdf from 'jspdf';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  showSignOutMessage: boolean = false;
  timenow:Date=new Date();
  timestr:any;

  data={
    name: "vincy",
    company:"Ducont"
  }

  constructor(public common:CommonService,private datePipe: DatePipe, private Router:Router) { }

  ngOnInit(): void {

    this.timestr = this.datePipe.transform(this.timenow, 'MMM d yyyy h:mm:ss a');

    this.common.logoutUser();
    window.history.replaceState({}, document.title, window.location.href);

    if (this.isUserSignedOut()){
      this.showSignOutMessage = true;
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
    // this.common.logoutUser();

     window.location.href = "https://mofastg.mofaic.gov.ae/en/Account/Redirect-To-EDAS-V2"

    // this.Router.navigateByUrl('https://mofastg.mofaic.gov.ae/en/Account/Redirect-To-EDAS-V2')

    // const doc=new jspdf();

    // const content=`<p> name is ${this.data.name} <p>`

    // doc.text(content, 10,10);
    // const pdf=doc.output('blob');
    // FileSaver.saveAs(pdf, 'output.pdf')


  }

}
