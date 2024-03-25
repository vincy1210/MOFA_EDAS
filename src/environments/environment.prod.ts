
//mofa prod
export const environment = {
  production: true,
  recaptcha: {
    siteKey: '6Ldh9ocpAAAAAEo3VzJuMJ51w6s7lEVmRd93NDWb',
  },
  baseURL: 'https://edasapi.mofa.gov.ae/edasapi/api/',
  authTokenURL: 'https://edasapi.mofa.gov.ae/en/Account/',
  appdetails:{
    version:'3.8',
    year:'2024',
    payment_count:500,
    idletime_out:1500,
    session_timeout:300
  },
  redirectURL:"https://www.mofa.gov.ae/en/Account/Redirect-To-EDAS-v2",
  logoutURL:"https://www.mofa.gov.ae/en/api/features/accounts/GETEDASLogoutV2?accessToken="
};




//3.7 release notes
//added proxy path in APIs 
//added mobilenumber parameter in saveOTP

//3.8
//rejected in red color chips in physical attestation page.
//physical completed not having total records count in the table 
//



