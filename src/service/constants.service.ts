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
  registercompany = 'proxy/registercompany';
  CheckCompanyRegStatus = 'Company/checkCompanyRegnStatus';
  GetLegalTypes = 'Company/getLegalTypes';
  SendOTPForCompanyRegn = 'Company/saveOTPforCompanyRegn';
  validateOTPforCompanyRegn = 'Company/validateOTPforCompanyRegn';
  // getFreezonetypes = 'Company/getFreezonetypes';
  pendingattestation = 'User/lcaMypendingAttestList';
  //UAEPassprofile="Company/lcapendingAttestList"
  getInvoiceAttestations = 'User/getMyInvoiceAttestations'; // invoice attest lists
  invoiceAttestation = 'proxy/invoiceAttestation'; // invoice attest request // invoice attest request
  getCooRequests = 'User/getMyCOORequests'; // completed attest lists
  updateCOORequests = 'proxy/updateCOORequests'; // completed attest update
  lcaCompletedAttestList = 'User/lcaMyCompletedAttestList';
  sendMailGeneric = 'Company/sendMailGeneric';
  getcompletedCOORequests = 'User/getMycompletedCOORequests'; // completed COO Request
  getAttestationFileContent = 'proxy/getAttestationFileContent';
  getCompanyList = 'User/getMyCompanyList';
  getInReviewCOOReq = 'User/getInReviewCOOReq';
  getInReviewAttestReq = 'User/getInReviewAttestReq';
  checkCompanyUser = 'User/checkCompanyUser';


  getPhysicalAttestpaymentdetails = 'User/getPhysicalAttestpaymentdetails';
  getCOOAttestpaymentdetails = 'User/getCOOAttestpaymentdetails';

  getcompletedInvoiceAttestList = 'User/getMycompletedInvoiceAttestList';



  eSealSoapGatewayUrl = 'https://stg-id.uaepass.ae/trustedx-gw/SoapGateway';

  //payment


  //dashboard
  getDailyStatistics = 'dashboard/getDailyStatistics';
  getWeeklyStatistics = 'dashboard/getWeeklyStatistics';
  getMonthlyStatistics = 'dashboard/getMonthlyStatistics';
  saveSiteAnalytics = 'dashboard/saveSiteAnalytics';
  getLCAStatistics = 'dashboard/getLCAStatistics';

  // this.consts.getDailyStatistics: filterType === "weekly"? this.consts.getWeeklyStatistics: this.consts.getMonthlyStatistics;

  getFinesReport = 'lca/getFinesReport';
  getFinesReportForAllStatus='lca/getFinesReportForAllStatus';
  getLCAPaymentdetails = 'LCA/getLCAPaymentdetails';
  mpaypurchaseRequest = 'lca/mpaypurchaseRequest';
  LCAmpayinquiryTransaction = 'lca/mpayinquiryTransaction';
  mpayinquiryTransactionForPayAll='lca/mpayinquiryTransactionForPayAll'
  requestAttestationFromExcelImport = 'lca/requestAttestationFromExcelImport';
  getPendingReqforlcauser = 'lca/getPendingReqforlcauser';
  getCompletedReqforlcauser = 'lca/getCompletedReqforlcauser';
  getCompanyListForLcaUser = 'lca/getCompanyListForLcaUser';
  getInRiskReqforlcauser = 'lca/getInRiskReqforlcauser';

  getcoolistforlcaattestno = 'User/getcoolistforlcaattestno';
  getlcalistforcoodeclaration = 'User/getlcalistforcoodeclaration';
  getListOfValues = 'User/getListOfValues';
  getSettlementList = 'payment/getSettlementList';
  getServerTime='Common/getServerTime';

  getLCAOverdueCount='User/getLCAOverdueCount';
  updateCompanyProfile='User/updateCompanyProfile'
  managecompanyuser = 'User/managecompanyuser'; //manage user
  getCompanyUserList = 'User/getCompanyUserList';

  getCOOgroupPaymentDetails='payment/getCOOgroupPaymentDetails';
  lcaMyAttestListForAllStatus='User/lcaMyAttestListForAllStatus';




  getMyInvoiceAttestationsForAllS='User/getMyInvoiceAttestationsForAllStatus';
  getMyCOORequestsForAllStatus='User/getMyCOORequestsForAllStatus';



  //pay all
  
  getCOOgroupPayallPaymentDetails='payment/getCOOgroupPayallPaymentDetails';
  getpendingcntlcaforcompany='payment/getpendingcntlcaforcompany'

//   {
//     "companyuno": "626",
//     "uuid": "bbbb11121nnn1"
// }
// getImportReportForLCA='getImportReportForLCA' /// dummy
getImportReportForLCA = "dashboard/getImportReportForLCA";


//getPreprocessLCARequests
getPreprocessLCARequests = 'User/getPreprocessLCARequests'; 
//



// getListOfValues='User/getListOfValues';

getAttestStatisticsForCustomer='dashboard/getAttestStatisticsForCustomer'

CheckUAEPassLogin="Common/CheckUAEPassLogin";

  getEmbassywiseAttestationCount = "dashboard/getEmbassywiseAttestationCount";
}
