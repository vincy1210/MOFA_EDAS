
//mofa prod
export const environment = {
  production: true,
  recaptcha: {
    siteKey: '6Ldh9ocpAAAAAEo3VzJuMJ51w6s7lEVmRd93NDWb',
  },
  baseURL: 'https://edasapi.mofa.gov.ae/edasapi/api/',
  authTokenURL: 'https://edasapi.mofa.gov.ae/en/Account/',
  appdetails:{
    version:'3.6',
    year:'2024',
    payment_count:500,
    idletime_out:1500,
    session_timeout:300
  },
  redirectURL:"https://www.mofa.gov.ae/en/Account/Redirect-To-EDAS-v2",
  logoutURL:"https://www.mofa.gov.ae/en/api/features/accounts/GETEDASLogoutV2?accessToken="
};


