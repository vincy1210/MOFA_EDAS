import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/service/common.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ApiService } from 'src/service/api.service';
import { ConstantsService } from 'src/service/constants.service';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/service/auth.service';

// imports {ConstantsService}


@Component({
  selector: 'app-paymentinfo',
  templateUrl: './paymentinfo.component.html',
  styleUrls: ['./paymentinfo.component.css']
})
export class PaymentinfoComponent implements OnInit {

  param1:any;
  param2: any;
  param3: any;

  amt:any;
  tranid:any;
  ref:any;
  status:any
  paymentsuccess:boolean=false;
  paymentfailure:boolean=false;

  paymentid:any;
  servicecharge:any=0.0;
  vatoncharge:any=0.0;
totalamount:any=0.0;
uuid:any;
fail_msg="Transaction Failed"
check_circle_outline="check_circle_outline"
paymenttype:any;
isButtonDisabled = false;
currentcompany:any;
transactionis:string='';
paymentstatus:string=''
  constructor(private router:Router,private common:CommonService, private _activatedRoute:ActivatedRoute, private apicall:ApiService, 
    private consts:ConstantsService, private auth:AuthService) {
      console.log("calling getselected company")
    let currcompany=this.auth.getSelectedCompany();
    if(currcompany){
      this.currentcompany=currcompany.companyuno || '';
      if(this.currentcompany==null || this.currentcompany==undefined || this.currentcompany===''){
        console.log("to landing page from attestation page line 195")
        this.router.navigateByUrl('/landingpage')
      }
    }
    else{
      this.common.redirecttologin();
      return;
    }
     }

  ngOnInit() {
    let data11=this.common.getUserProfile();
    let uuid;
    if(data11!=null || data11!=undefined){
      data11=JSON.parse(data11)
      console.log(data11.Data)
      uuid=data11.Data.uuid;
      this.uuid=uuid;

    }
    else{
       this.common.setlogoutreason("session");
      this.auth.logout();

    }
    this.common.showLoading();

   try{
     
   console.log('---------');
     let resp;
     let paymentidinfo=this.common.getpaymentdetails();
     this.paymenttype=paymentidinfo.processname;
     


     let  invoiceuno=paymentidinfo.invoiceID.toString();
     let data={
      "action": "8",
      "id": "",
      "inqType": "LAST_APPROVED",
      "password": "",
      "transid": paymentidinfo.paymentID,
      "udf5": "PaymentID",
      "version": "1.0.1",
      "invoiceuno":invoiceuno,
      "uuid":this.uuid,
      "processname":paymentidinfo.processname
  }
  // const headers = new HttpHeaders({
  //   'uuid': this.uuid,
  //   'processname': 'LCA'
  // });
     this.apicall.post(this.consts.LCAmpayinquiryTransaction,data).subscribe({next:(success:any)=>{
      this.common.hideLoading();
        
      resp=success;
      if(resp.status==="CAPTURED"){

        let message
        if(this.paymenttype=='COO'){
          message='<p>Your payment for the Certificate of Origin (COO) has been successfully processed, and according to UAE law, it is mandatory to attest the invoice along with the COO for the import of items. Kindly proceed with the invoice attestation and ensure clearance on time to avoid fines.<p> <br> <p>For Completing the Certificate of Origin (COO) Attestation; Kindly upload the Certificate of Origin (COO); so that it will reviewed and approved by MOFA Customer Care Executive followed by EDAS attestation.</p>'
          this.common.showSweetAlert('Info', 'Policy sample message', message,'top-end');
        }
        else if(this.paymenttype=='LCA'){
        message='<p>We received your payment towards the Invoice Attestation Request. Our Team is processing your Attestation request and you will notified shortly.<p>'
        this.common.showSweetAlert('Info', 'Policy sample message', message,'top-end');
        }
        else if(this.paymenttype=='PHYSICAL'){
          message='<p>We received your payment towards the Physical Invoice Attestation Request. Our Customer Care Executives are reviewing  your Attestation request and you will notified shortly once its approved.</p>'
          this.common.showSweetAlert('Info', 'Policy sample message', message,'top-end');
        }
        this.transactionis='Transaction is';
        this.paymentsuccess=true;
        this.paymentfailure=false;
        this.status=resp.status;
        this.paymentstatus='Success'
        this.amt=resp.amt;
        this.tranid=resp.tranid;
        this.ref=resp.ref;
        this.paymentid=resp.paymentid;

        this.servicecharge=resp.servicedata[0].surchargeFixedFee;
        this.vatoncharge=resp.servicedata[0].vatonSurchargeFixedFee;
        if(this.servicecharge==undefined){
          this.servicecharge=0;
        }
        if(this.vatoncharge==undefined){
          this.vatoncharge=0;
        }
        if(this.amt==undefined){
          this.amt=0;
        }
        this.totalamount=parseFloat(this.amt)+parseFloat(this.servicecharge)+parseFloat(this.vatoncharge);
        this.totalamount=parseFloat(this.totalamount)

        this.common.showSuccessMessage(resp.customMessage)
        return;
      }
      else{
        this.transactionis='Transaction is';
        this.paymentstatus='Failure';
        this.paymentsuccess=false;
        this.paymentfailure=true;

        this.common.showErrorMessage(resp.customMessage)
        return;
      }
    }
    })
  //  });
  }
  catch{
    this.common.showErrorMessage('Something went wrong. Please try again later')
    return;
  }
}
redirect(){

  
  let paymentidinfo=this.common.getpaymentdetails();
  this.paymenttype=paymentidinfo.processname;

  if(paymentidinfo.processname==='LCA' || paymentidinfo.processname==='COOLCA'){
  this.router.navigateByUrl('/lca/lcacompletedattestation')
  }
  else if(paymentidinfo.processname==='COO'){
    this.router.navigateByUrl('/coo/cooinreview')
    }
   else if(paymentidinfo.processname==='PHYSICAL'){
      this.router.navigateByUrl('/physical/physicalinreview')
      }
      // else if('COOLCA'){

      // }
}



}
