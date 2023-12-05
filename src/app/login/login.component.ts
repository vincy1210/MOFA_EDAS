import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
// import { RSAHelper } from "src/app/services/RSAHelper";
// import { Userservice } from "src/app/services/userservice.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormControl,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { CommonService } from "src/service/common.service";
// import { CommonService } from "src/app/services/common.service";
// import { BaseResponse, UserInfo } from "src/app/shared/models/UserInfo";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  loginform: FormGroup = new FormGroup({
    username: new FormControl(""),
    password: new FormControl(""),
  });
  isButtonDisabled = false;
  constructor(
    private commonServ: CommonService,
    public router: Router,
    private formBuilder: FormBuilder,
    private toaster: ToastrService,
    // public RSAHelper: RSAHelper,
    // private userService: Userservice
  ) {}

  showSection03a: boolean = false;
  expressType: string | undefined;
  typeExpress: string[] = [
    "Department of Economic Development (DED)",
    "Freezone",
  ];
  radioOptions: FormGroup | undefined;
  loginForm!: FormGroup;
  invalid: boolean = false;
  //user: Users;
  usermodel: any = {};
  isError: boolean = false;
  returnUrl: string = "";
  loading = false;
  signintext: string = "SIGN IN";
  isPageLoad: boolean = false;
  isPageSwitch: boolean = false;
  userRights_data: any;
  tenantUno: number = 1;
  lockedCount: number = 0;
  tenantInfo: any = [];
  user: any = {};
  IsBenchmarkAgreement: number = 0;
  loginUserID: number = 0;
  validateUserInAD = 1;

  submitted = false;

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.required]],
      password: ["", Validators.required],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const objusers = {
      //LanguageCode: 'EN',
      Username: this.f["username"].value.trim(),
      Password: this.commonServ.encryptWithPublicKey(
        JSON.stringify(this.f["password"].value.trim())
      ),
      emailaddress: "",
      UserUno: 0,
    };

    this.isError = false;
    this.loading = true;
    this.commonServ.showLoading();
    // this.userService.getUserDetails(objusers).subscribe({
    //   next: (response: BaseResponse<UserInfo>) => {
    //     let logindata: UserInfo = response.data;
    //     // this.isError = logindata.error != "" && logindata.error != null ? true : false;
    //     if (logindata) {
    //       localStorage.setItem("logindata", "");
    //       localStorage.setItem("logindata", JSON.stringify(logindata));
    //       setTimeout(() => {
    //         this.router.navigate(["/landingpage"]); 
    //       }, 1000);
    //     } else {
    //       // this.toaster.show(
    //       //   "Please try again later or contact your system administrator."
    //       // );
    //       this.commonServ.showErrorMessage("Incorrect username or password");
    //     }
    //   },
    //   error: (e) => {
    //     this.commonServ.showErrorMessage("Error occured. Please try again later or contact your system administrator.");
    //   },
    //   complete: () => {
    //     this.loading = false;
    //     this.commonServ.hideLoading();
    //     this.isError = false;
    //   },
    // });
  }

}
