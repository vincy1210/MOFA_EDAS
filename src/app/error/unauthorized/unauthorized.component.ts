import { Component, OnInit } from "@angular/core";
import { CommonService } from "src/service/common.service";
import { Router } from "@angular/router";
import { ApiService } from "src/service/api.service";

export type StatusCodeType = "404" | "400" | "500";

export enum StatusCodeEnums {
  statusCode404 = "404",
  statusCode400 = "400",
  statusCode500 = "500",
}

// app-page-error-handle
@Component({
  selector: 'app-page-error-handle',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css']
})
export class UnauthorizedComponent implements OnInit {
  backtohome: string = "/";
  statusCode: StatusCodeType = StatusCodeEnums.statusCode404;

  constructor(
    private common: CommonService,
    private router: Router,
    private apiservice: ApiService
  ) {}

  ngOnInit(): void {
    // const { role } = this.apiservice.getUserDetails();
    // this.backtohome = this.common.getStartingPage(role);
  }

  redirectToHome() {
    this.router.navigate(['landingpage']);

  }
}

// app-error-400
@Component({
  selector: "app-error-400",
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css']
})
export class Error400Component {
  backtohome: string = "/";
  statusCode: StatusCodeType = StatusCodeEnums.statusCode400;

  constructor(
    private common: CommonService,
    private router: Router,
    private apiservice: ApiService
  ) {}

  ngOnInit(): void {
    // const { role } = this.apiservice.getUserDetails();
    // this.backtohome = this.common.getStartingPage(role);
  }

  redirectToHome() {
    this.router.navigate(['landingpage']);

  }
}

// app-error-500
@Component({
  selector: "app-error-500",
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css']
})
export class Error500Component {
  backtohome: string = "/";
  statusCode: StatusCodeType = StatusCodeEnums.statusCode500;

  constructor(
    private common: CommonService,
    private router: Router,
    private apiservice: ApiService
  ) {}

  ngOnInit(): void {
    // const { role } = this.apiservice.getUserDetails();
    // this.backtohome = this.common.getStartingPage(role);
  }

  redirectToHome() {
    this.router.navigate(['landingpage']);
  }
}
