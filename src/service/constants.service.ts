import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConstantsService {
  constructor() {}
  registercompany = 'Company/RegisterCompany';
  CheckCompanyRegStatus = 'Company/checkCompanyRegnStatus';
  GetLegalTypes = 'Company/getLegalTypes';
  SendOTPForCompanyRegn = 'Company/saveOTPforCompanyRegn';
  validateOTPforCompanyRegn='Company/validateOTPforCompanyRegn'
  getFreezonetypes = 'Company/getFreezonetypes';
  pendingattestation = 'User/lcaMypendingAttestList';
  //UAEPassprofile="Company/lcapendingAttestList"
  getInvoiceAttestations = 'User/getMyInvoiceAttestations'; // invoice attest lists
  invoiceAttestation = 'Common/invoiceAttestation'; // invoice attest request // invoice attest request
  getCooRequests = 'User/getMyCOORequests'; // completed attest lists
  updateCOORequests = 'Company/updateCOORequests'; // completed attest update
  lcaCompletedAttestList='User/lcaMyCompletedAttestList';
  sendMailGeneric="Company/sendMailGeneric"
  getcompletedCOORequests = 'User/getMycompletedCOORequests'; // completed COO Request
  getAttestationFileContent='Company/getAttestationFileContent'
  getCompanyList='User/getMyCompanyList'
  getInReviewCOOReq='User/getInReviewCOOReq'
  getInReviewAttestReq='User/getInReviewAttestReq'
  checkCompanyUser='user/checkCompanyUser'


  


  mpaypurchaseRequest='lca/mpaypurchaseRequest'
  LCAmpayinquiryTransaction='lca/mpayinquiryTransaction'

  getPhysicalAttestpaymentdetails='entity/getPhysicalAttestpaymentdetails'
  getCOOAttestpaymentdetails='entity/getCOOAttestpaymentdetails'

  getcompletedInvoiceAttestList='User/getMycompletedInvoiceAttestList'

  managecompanyuser="Admin/managecompanyuser"  //manage user
  getCompanyUserList="Admin/getCompanyUserList"



  eSealSoapGatewayUrl = 'https://stg-id.uaepass.ae/trustedx-gw/SoapGateway';


  //payment

  getLCAPaymentdetails='LCA/getLCAPaymentdetails';
}
