export const environment = {
  production: true,
  recaptcha: {
    siteKey: '6LcVQRwoAAAAAB6scwIvG78wLgpk516pJJ-IB-qQ',
  },
  // baseURL: 'https://www.alphadatainsights.com/mofa/edasapi/api/',   https://www.alphadatainsights.com/mofa/edascustomerapi/api/User/
  baseURL: 'https://www.alphadatainsights.com/mofa/edasapi/api/',
  authTokenURL: 'https://mofastg.mofaic.gov.ae/en/Account/',
  appdetails:{
    version:'2.8',
    year:'2024',
    payment_count:500,
    idletime_out:1500,
    session_timeout:300
  }
};
