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
  getFreezonetypes = 'Company/getFreezonetypes';
  pendingattestation = 'Company/lcapendingAttestList';
  //UAEPassprofile="Company/lcapendingAttestList"
  getInvoiceAttestations = 'User/getMyInvoiceAttestations'; // invoice attest lists
  getCompletedInvoiceAttestations = 'User/getMycompletedInvoiceAttestList';
  invoiceAttestation = 'Common/invoiceAttestation'; // invoice attest request
  getCooRequests = 'User/getMyCOORequests'; // completed attest lists
  updateCOORequests = 'Company/updateCOORequests'; // completed attest update
  getcompletedCOORequests = 'User/getMycompletedCOORequests'; // completed COO Request
  eSealSoapGatewayUrl = 'https://stg-id.uaepass.ae/trustedx-gw/SoapGateway';
  checkESeal = 'Test/CheckESeal';
}
