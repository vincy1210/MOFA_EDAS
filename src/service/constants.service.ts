import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  constructor() { 

  }
  registercompany="Company/RegisterCompany"
  CheckCompanyRegStatus="Company/checkCompanyRegnStatus"
  GetLegalTypes="Company/getLegalTypes"
  SendOTPForCompanyRegn="Company/saveOTPforCompanyRegn"
  getFreezonetypes="Company/getFreezonetypes"
  pendingattestation="Company/lcapendingAttestList"
  //UAEPassprofile="Company/lcapendingAttestList"




}
