import { Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ApiService } from 'src/service/api.service';
import { filter, takeWhile } from 'rxjs/operators';
import { CommonService } from 'src/service/common.service';
import {
  HttpClient,
  HttpResponse,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
// import { RecaptchaComponent } from 'ng-recaptcha';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { ConstantsService } from 'src/service/constants.service';
import { AuthService } from 'src/service/auth.service';
import { environment } from '../../environments/environment';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  @ViewChild('invisible') invisibleRecaptcha: any;

  showSection03a: boolean = false;

  expressType: string = '';
  typeExpress: string[] = [
    'Department of Economic Development (DED)',
    'Freezone',
  ];

  // radioOptions: FormGroup | undefined;
  registrationForm: FormGroup;
  issuing_auth: boolean = false;

  param1: any;
  param2: any;
  param3: any;
  alive: boolean = true;
  today: Date = new Date();
  reg_form_data: any;
  captcha: string = '';
  email: string = '';
  bearer_token: string = '';
  //testvar
  currentLanguagecode: string = '1033';

  userinfo: any;
  captcha_token: any;
  user_info_taken_using_authtoken: any;
  freezone: any;
  freezone1: any;
  isButtonDisabled = false;
  UserHavingCompany: boolean = false;
  // private ngUnsubscribe = new Subject();
  private ngUnsubscribe = new Subject<void>();
  constructor(
    private auth: AuthService,
    private consts: ConstantsService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private http: HttpClient,
    private common: CommonService,
    private FormBuilder: FormBuilder,
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private apiservice: ApiService
  ) {
    // this.getcopyrightyear();
    this.common.getData().subscribe((data) => {
      this.reg_form_data = data;
      console.log(this.reg_form_data);
    });

    this.registrationForm = this.FormBuilder.group({
      tradeLicenseNumber: [
        this.reg_form_data.tradeLicenseNumber,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern('^(?=.*\\S).+$'),
        ],
      ],
      chosenDate: [this.reg_form_data.chosenDate, Validators.required],
      issuingAuthority: [
        this.reg_form_data.issuingAuthority,
        Validators.required,
      ],
      expressType: [this.reg_form_data.expressType, Validators.required],
      dmccOption: [this.reg_form_data.dmccOption],
      name_of_Business: [
        this.reg_form_data.name_of_Business,
        [Validators.required, Validators.pattern('^(?=.*\\S).+$')],
      ],
    });

    //  if(this.reg_form_data==="Freezone"){

    if (this.reg_form_data.issuingAuthority === 'AUH') {
      //this.registrationForm.removeValidators('dmccOption')
      this.registrationForm.get('tradeLicenseNumber')?.clearValidators();
      this.registrationForm.get('tradeLicenseNumber')?.updateValueAndValidity();
    } else {
      this.registrationForm
        .get('tradeLicenseNumber')
        ?.setValidators([
          Validators.required,
          Validators.minLength(4),
          Validators.pattern('^(?=.*\\S).+$'),
        ]);
      this.registrationForm.get('tradeLicenseNumber')?.updateValueAndValidity();
    }

    if (this.reg_form_data.expressType === 'Freezone') {
      this.registrationForm
        .get('dmccOption')
        ?.setValidators(Validators.required);
      this.registrationForm.get('dmccOption')?.updateValueAndValidity();
    } else {
      //this.registrationForm.removeValidators('dmccOption')
      this.registrationForm.get('dmccOption')?.clearValidators();
      this.registrationForm.get('dmccOption')?.updateValueAndValidity();
    }

    //}
  }

  proceed() {
    this.registrationForm.markAllAsTouched();

    console.log(this.registrationForm.get('tradeLicenseNumber'));

    if (this.userinfo === '' || this.userinfo == undefined) {
      console.log('Missing Data!!!');
      this.common.showErrorMessage('Something went wrong');
      return;
    }
    console.log(this.userinfo.Data.uuid);

    if (this.registrationForm.valid) {
      console.log('success');
      const formData = this.registrationForm.value;
      console.log('Form Data:', formData);
      // formData.captcha_token=this.captcha_token;
      this.common.setData(formData);
      console.log(formData);

      this.user_info_taken_using_authtoken = this.common.getUserProfile().Data;
      let data = {
        tradelicensenumber: this.reg_form_data.tradeLicenseNumber,
        nameofbusiness: this.reg_form_data.name_of_Business,
        emirate: this.reg_form_data.issuingAuthority,
        uuid: this.userinfo.Data.uuid,
        //need to pass consignee name, issuing auth emirate
      };

      let response;
      let response1;

      this.common.showLoading();

      try {
        this.apiservice
          .post(this.consts.CheckCompanyRegStatus, data)
          .subscribe({
            next: (success: any) => {
              response = success;
              this.common.hideLoading();

              if (response.responseCode == 200) {
                if (response.data.dictionary.data.length == 0) {
                  this.common.SetAlreadyregisteredcompanydetails('');
                  this.router.navigateByUrl('/companydetails');
                } else if (response.data.dictionary.data.length > 0) {
                  this.common.SetAlreadyregisteredcompanydetails(
                    response.data.dictionary.data[0]
                  );
                  this.router.navigateByUrl('/companydetails');
                } else {
                  this.common.SetAlreadyregisteredcompanydetails([]);
                  this.router.navigateByUrl('/companydetails');
                }
              } else if (response.responseCode == 500) {
                //this.proceed();
                this.common.showErrorMessage('Something went wrong');
                return;
              } else {
                console.log();
              }
            },
          });
      } finally {
      }
      // set data in common service so that data can be pass from registration to company details component
    } else {
      console.log(this.expressType);
      if (this.expressType === '') {
        this.issuing_auth = true;
      } else {
        this.issuing_auth = true;
      }
      const form = { ...this.registrationForm.value };
      console.log(form);
      console.log('invalid form');
      const formData = this.registrationForm.value;
      console.log('Form Data:', formData);
    }
  }
  ngOnInit() {
    let selectedlanguage = sessionStorage.getItem('language') || 'en';

    if (selectedlanguage === 'ar') {
      this.currentLanguagecode = '14337';
    } else {
      this.currentLanguagecode = '1033';
    }
    console.log(this.currentLanguagecode);

    this.common.showLoading();

    // try{

    console.log('---------');
    this._activatedRoute.queryParams.subscribe((params: Params) => {
      // Access and capture the parameters here
      this.param1 =
        params['code'] || params['Code'] || params['AuthenticationCode']; // AuthenticationCode
      this.param2 = params['lang'];
      this.param3 = params['email'];

      console.log(this.param1);
      console.log(this.param2);
      console.log(this.param3);

      // You can perform any actions or logic with these parameters
    });
    //for cancel button checking whether any company already there
    this.reg_form_data = this.common.getUserProfile();

    console.log(this.reg_form_data);
    let data = {
      uuid: '1',
      languagecode: this.currentLanguagecode,
      processname: 'FREEZONEMST',
    };
    // this.common.showLoading();

    this.apiservice
      .post(this.consts.getListOfValues, data)
      .subscribe((response: any) => {
        this.common.hideLoading();

        const dataArray = response.data; // Access the 'data' property from the response
        this.freezone1 = dataArray;
        this.FreezonelistFilter = dataArray;
        this.common.setfreezone(this.freezone1);
        console.log(this.freezone1);

        if (this.freezone1 == undefined) {
          this.common.showErrorMessage('Error in loading zone type');
          return;
        }
      });

    if (
      this.param3 == undefined ||
      this.param1 == undefined ||
      this.param2 == undefined
    ) {
      const userProfilejson = JSON.parse(this.reg_form_data);
      if (userProfilejson) {
        this.checkcompanyuserforcancel(userProfilejson.Data);
      }

      if (this.reg_form_data != null || this.reg_form_data != undefined) {
        this.userinfo = JSON.parse(this.reg_form_data);
        this.common.setUserIfoData(this.reg_form_data);
      } else {
        console.log('redirect parameters undefined');

        console.log('Something went wrong! Please try again');

        // Delay the execution  by 2 seconds
        setTimeout(() => {
          // this.auth.logout();
          window.location.href = environment.redirectURL;
        }, 500); // 2000 milliseconds = 2 seconds
        return;
      }
    } else {
      if (this.reg_form_data == null || this.reg_form_data == undefined) {
        this.addItem();
      } else {
        this.userinfo = JSON.parse(this.reg_form_data);
        this.common.setUserIfoData(this.reg_form_data);
      }
    }
    //this.common.hideLoading();

    // }
    // finally{
    //   this.common.hideLoading()
    // }
  }

  checkcompanyuserforcancel(userinfo: any) {
    let response, data;
    let email = this.common.encryptWithPublicKey(userinfo.email);
    let mobile = this.common.encryptWithPublicKey(userinfo.mobile);
    let firstnameEN = this.common.encryptWithPublicKey(userinfo.firstnameEN);

    let emirateid;
    if (userinfo.idn) {
      emirateid = this.common.encryptWithPublicKey(userinfo.idn);
    } else {
      emirateid = '';
    }

    data = {
      uuid: userinfo.uuid,
      emiratesid: emirateid,
      email: email,
      mobile: mobile,
      firstname: firstnameEN,
    };
    this.common.showLoading();
    this.apiservice.post(this.consts.checkCompanyUser, data).subscribe({
      next: (success: any) => {
        this.common.hideLoading();
        response = success;
        // token ref
        // this.bearer_token=response.token;
        //   console.log(this.bearer_token)
        //   this.auth.setToken(this.bearer_token);

        if (response.data.length > 0) {
          this.UserHavingCompany = true;
        } else {
          this.UserHavingCompany = false;
        }
      },
    });
  }
  radio(event: any) {
    console.log(event.value);
    var issuing_auth = event.value;
    this.expressType = issuing_auth;
    console.log(issuing_auth);
    console.log(this.expressType);

    if (this.expressType === 'Freezone') {
      this.registrationForm
        .get('dmccOption')
        ?.setValidators(Validators.required);
      this.registrationForm.get('dmccOption')?.updateValueAndValidity();
    } else {
      //this.registrationForm.removeValidators('dmccOption')
      this.registrationForm.get('dmccOption')?.clearValidators();
      this.registrationForm.get('dmccOption')?.updateValueAndValidity();
    }
  }

  //Redirection from MOFA start

  addItem() {
    //  const email = encodeURIComponent(this.param3.trim());
    let email2 = encodeURIComponent(this.param3.trim());

    const objTxData = {
      Code: this.param1,
      Email: email2,
    };

    this.common.setauthcodedata(objTxData);

    this.apiservice.post(this.consts.CheckUAEPassLogin, objTxData).subscribe({
      next: (response: any) => {
        console.log(response);
        if (typeof response === 'string' && !response.includes('/')) {
          // response = response.slice(1, -1);
          response = JSON.parse(response);
        } else {
          response = JSON.stringify(response).replace(/\\/g, '');
          // response = response.slice(1, -1);
          response = JSON.parse(response);
        }
        if (response.IsSucceeded === 'True') {
          this.userinfo = response;

          const userProfileString = JSON.stringify(this.userinfo);

          this.common.setUserProfile(userProfileString);

          // Set the user profile data in SessionStorage
          // sessionStorage.setItem('userProfile', userProfileString);

          //verify the user whether he already has company and if he already having redirect him to company listing page
          this.useralreadyhavingcompany(this.userinfo.Data);

          console.log(response.IsSucceeded);
        } else if (response.IsSucceeded === 'False') {
          console.log(response.message);
          // this.common.showErrorMessage("Something went wrong");
          console.log('Auth1 failed');
          return;
        }

        if (this.userinfo == undefined) {
          this.common.showErrorMessage('Something went wrong');
          console.log('Auth2 Failed!!!');
          return;
        }

        this.common.setUserIfoData(response.Data);
      },
    });
  }

  // ngOnDestroy() {
  //   console.log('--Stop--');
  //   this.alive = false;
  // }

  // resolved(captchaResponse: string) {
  //   console.log(`Resolved captcha with response: ${captchaResponse}`);
  // }

  // public executeImportantAction(): void {
  //   this.recaptchaV3Service.execute('importantAction')
  //     .subscribe((token) =>
  //    console.log(token)
  //     );
  // }

  // public onError() {
  //   console.log("reCAHPTCHA errored;");
  // }

  // public addTokenLog(message: string, token: string | null) {
  //   console.log(`${message}: ${this.formatToken(token)}`);
  //   this.captcha_token=this.formatToken(token);
  // }

  // public formatToken(token: string | null) {
  //   return token !== null
  //     ? `${token.substring(0, 7)}...${token.substring(token.length - 7)}`
  //     : 'null';
  // }
  //for recaptcha end

  mainpage() {
    this.router.navigateByUrl('/registration');
  }
  licenseauthchange(event: any) {
    console.log(event);
    // const filteredData = this.freezone.filter((item:any) => item.emiratesuno === emiratesUnoValue);
  }

  onDropdownChange(event: any) {
    console.log(event);
    const selectedValue = this.registrationForm.get('issuingAuthority')?.value;
    console.log(`Selected value: ${selectedValue}`);
    console.log(this.freezone1);

    if (selectedValue === 'AUH') {
      // Remove validators from tradeLicenseNumber
      this.registrationForm.get('tradeLicenseNumber')?.clearValidators();
      this.registrationForm.get('tradeLicenseNumber')?.updateValueAndValidity();
    } else {
      // Add validators back to tradeLicenseNumber
      this.registrationForm
        .get('tradeLicenseNumber')
        ?.setValidators([Validators.required, Validators.minLength(4)]);
      this.registrationForm.get('tradeLicenseNumber')?.updateValueAndValidity();
    }
    if (this.freezone1 != undefined) {
      const filteredData = this.freezone1.filter(
        (item: any) => item.emiratesuno === parseInt(selectedValue, 10)
      );
      console.log(filteredData);
      this.freezone = filteredData;
      console.log(this.freezone);
    }
  }

  // public formatToken(token: string | null) {
  //   return token !== null
  //     ? `${token.substring(0, 7)}...${token.substring(token.length - 7)}`
  //     : 'null';
  // }

  // public addTokenLog(message: string, token: string | null) {
  //   console.log(`${message}: ${this.formatToken(token)}`);
  //   this.captcha_token=token;

  // }

  useralreadyhavingcompany(userinfo: any) {
    let response, data;
    let email = this.common.encryptWithPublicKey(userinfo.email);
    let mobile = this.common.encryptWithPublicKey(userinfo.mobile);
    let firstnameEN = this.common.encryptWithPublicKey(userinfo.firstnameEN);

    let emirateid;
    if (userinfo.idn) {
      emirateid = this.common.encryptWithPublicKey(userinfo.idn);
    } else {
      emirateid = '';
    }

    data = {
      uuid: userinfo.uuid,
      emiratesid: emirateid,
      email: email,
      mobile: mobile,
      firstname: firstnameEN,
    };
    this.common.showLoading();

    //start

    //   this.apiservice.post(this.consts.checkCompanyUser, data)
    // .pipe(takeUntil(this.ngUnsubscribe))
    // .subscribe({

    //end

    this.apiservice
      .post(this.consts.checkCompanyUser, data)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (success: any) => {
          this.common.hideLoading();
          response = success;
          this.common.hideLoading();
          if (response.responsecode == 1) {
            this.bearer_token = response.token;
            console.log(this.bearer_token);
            this.auth.setToken(this.bearer_token);
            if (response.data === 'User not available') {
              return;
            } else {
              let lcauser: boolean = false;

              // Iterate through the JSON data
              for (const data of response.data) {
                if (data.roleuno === 11 || data.roleuno === 12) {
                  lcauser = true;
                  break; // No need to continue checking once condition is met
                }
              }
              // Now lcauser will be true if any lcauno is 11 or 12
              console.log('Is lcauser true?', lcauser);

              if (lcauser) {
                const { rolename } = response.data[0];
                if (rolename && rolename.length > 0) {
                  const UserRoleList: number[] =
                    this.common.getRolefromString(rolename);
                  sessionStorage.setItem(
                    'userrolelist',
                    JSON.stringify(UserRoleList)
                  );
                }
                sessionStorage.setItem(
                  'lcauserdetails',
                  JSON.stringify(response.data[0])
                );
                this.auth.setLCAUser(response.data[0]);
                this.router.navigateByUrl('/lca-login/lcadashboard');
              } else {
                sessionStorage.setItem('usertype', 'CompanyUser');

                this.common.userType.next('CompanyUser');
                console.log('to landing page from registration page line 535');

                this.router.navigateByUrl('/landingpage');
              }
            }
          }
        },
      });
  }
  FreezonelistFilter: { itemcode: string; itemno: string }[] = [];

  onInputChange(event: any, fieldValue: 'categoryuno'): void {
    const userInput = event.target.value.toLowerCase();
    if (fieldValue === 'categoryuno') {
      this.freezone1 = this.FreezonelistFilter.filter((item: any) =>
        item.itemcode.toLowerCase().includes(userInput)
      );
    }
  }

  onInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;

    if (value.includes('.')) {
      inputElement.value = value.replace('.', ''); // Remove the dot if found
    }

    this.registrationForm.patchValue({ name_of_Business: inputElement.value });
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const clipboardData = event.clipboardData?.getData('text/plain');
    const sanitizedData = clipboardData?.replace(/\./g, ''); // Remove dots from pasted data
    document.execCommand('insertText', false, sanitizedData);
  }

  CancelForLoggedinUsers() {
    this.router.navigateByUrl('/landingpage');
    //vincy
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
