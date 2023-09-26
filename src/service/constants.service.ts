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
  pendingattestation = 'Company/lcapendingAttestList';
  //UAEPassprofile="Company/lcapendingAttestList"
  getInvoiceAttestations = 'Common/getInvoiceAttestations'; // invoice attest lists
  invoiceAttestation = 'Common/invoiceAttestation'; // invoice attest request
  getCooRequests = 'Company/getCOORequests'; // completed attest lists
  updateCOORequests = 'Company/updateCOORequests'; // completed attest update
  lcaCompletedAttestList='Company/lcaCompletedAttestList';
  sendMailGeneric="Company/sendMailGeneric"
  getcompletedCOORequests = 'Company/getcompletedCOORequests'; // completed COO Request
}
