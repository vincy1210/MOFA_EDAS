import { Injectable } from '@angular/core';

export const ActionConstants = {
  load: 'Load',
  destroy: 'Destroy',
  submit: 'Submit',
  workflowview: 'View Workflow',
  addcompany: 'Add Company',
  viewcompany: 'View Company',
  editcompany: 'Edit Company',
  deletecompany: 'Delete Company',
};

@Injectable({
  providedIn: 'root',
})
export class ConstantsService {
  constructor() {}
  Updatecompanyuser = 'Company/Updatecompanyuser';
  getPaymentReceipt = 'payment/getPaymentReceipt';
  registercompany = 'Company/RegisterCompany';
  CheckCompanyRegStatus = 'Company/checkCompanyRegnStatus';
  GetLegalTypes = 'Company/getLegalTypes';
  SendOTPForCompanyRegn = 'Company/saveOTPforCompanyRegn';
  validateOTPforCompanyRegn = 'Company/validateOTPforCompanyRegn';
  getFreezonetypes = 'Company/getFreezonetypes';
  pendingattestation = 'User/lcaMypendingAttestList';
  //UAEPassprofile="Company/lcapendingAttestList"
  getInvoiceAttestations = 'User/getMyInvoiceAttestations'; // invoice attest lists
  invoiceAttestation = 'Common/invoiceAttestation'; // invoice attest request // invoice attest request
  getCooRequests = 'User/getMyCOORequests'; // completed attest lists
  updateCOORequests = 'Company/updateCOORequests'; // completed attest update
  lcaCompletedAttestList = 'User/lcaMyCompletedAttestList';
  sendMailGeneric = 'Company/sendMailGeneric';
  getcompletedCOORequests = 'User/getMycompletedCOORequests'; // completed COO Request
  getAttestationFileContent = 'Company/getAttestationFileContent';
  getCompanyList = 'User/getMyCompanyList';
  getInReviewCOOReq = 'User/getInReviewCOOReq';
  getInReviewAttestReq = 'User/getInReviewAttestReq';
  checkCompanyUser = 'user/checkCompanyUser';

  mpaypurchaseRequest = 'lca/mpaypurchaseRequest';
  LCAmpayinquiryTransaction = 'lca/mpayinquiryTransaction';

  getPhysicalAttestpaymentdetails = 'entity/getPhysicalAttestpaymentdetails';
  getCOOAttestpaymentdetails = 'entity/getCOOAttestpaymentdetails';

  getcompletedInvoiceAttestList = 'User/getMycompletedInvoiceAttestList';

  managecompanyuser = 'Admin/managecompanyuser'; //manage user
  getCompanyUserList = 'Admin/getCompanyUserList';

  eSealSoapGatewayUrl = 'https://stg-id.uaepass.ae/trustedx-gw/SoapGateway';

  //payment

  getLCAPaymentdetails = 'LCA/getLCAPaymentdetails';

  //dashboard
  getDailyStatistics = 'dashboard/getDailyStatistics';
  getWeeklyStatistics = 'dashboard/getWeeklyStatistics';
  getMonthlyStatistics = 'dashboard/getMonthlyStatistics';
  saveSiteAnalytics = '/dashboard/saveSiteAnalytics';

  // this.consts.getDailyStatistics: filterType === "weekly"? this.consts.getWeeklyStatistics: this.consts.getMonthlyStatistics;

  getFinesReport="lca/getFinesReport"

  requestAttestationFromExcelImport = 'lca/requestAttestationFromExcelImport';
  getPendingReqforlcauser = "lca/getPendingReqforlcauser";
  getCompletedReqforlcauser = "lca/getCompletedReqforlcauser";
  getCompanyListForLcaUser = "lca/getCompanyListForLcaUser";
  getInRiskReqforlcauser = "lca/getInRiskReqforlcauser";

  getcoolistforlcaattestno="user/getlcalistforcoodeclaration";
  getlcalistforcoodeclaration="user/getlcalistforcoodeclaration"

}
