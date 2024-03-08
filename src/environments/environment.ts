export const environment = {
  production: false,
  recaptcha: {
    siteKey: '6LcVQRwoAAAAAB6scwIvG78wLgpk516pJJ-IB-qQ',
  },
  baseURL: 'https://www.alphadatainsights.com/mofa/edascustomerapi/api/',
  authTokenURL: 'https://mofastg.mofaic.gov.ae/en/Account/',
  appdetails:{
    version:'3.4',
    year:'2024',
    payment_count:500,
    idletime_out:1500,
    session_timeout:300
  },
  redirectURL:"https://mofastg.mofaic.gov.ae/en/Account/Redirect-To-EDAS-V2",
  logoutURL:"https://mofastg.mofaic.gov.ae/en/Account/GETEDASLogoutV2?accessToken="

};