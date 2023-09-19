import { Component, HostBinding } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Direction } from '@angular/cdk/bidi';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @HostBinding('class') classRoot = 'theme-default';

  title = 'uaemofa';
  overlayContainer: any;

  fontSize = 'sm';

  toggle(size: string) {
    this.fontSize = size;
  }

  preventCloseOnClickOut() {
    this.overlayContainer
      .getContainerElement()
      .classList.add('disable-backdrop-click');
  }

  allowCloseOnClickOut() {
    this.overlayContainer
      .getContainerElement()
      .classList.remove('disable-backdrop-click');
  }

  topmenu01: boolean = false;
  topmenu02: boolean = false;
  clickEvent() {
    this.topmenu01 = !this.topmenu01;
    this.topmenu02 = !this.topmenu02;
  }

  toggleChange(event: { source: any; value: any[] }) {
    let toggle = event.source;
    if (toggle) {
      let group = toggle.buttonToggleGroup;
      if (event.value.some((item) => item == toggle.value)) {
        group.value = [toggle.value];
      }
    }
  }

  showToggle = false;
  currentLanguageDirection!: Direction | 'auto';
  bigScreen = false;

  role:any;

  ngOnInit(): void {
    this.bigScreen = window.innerWidth > 786;
    window.addEventListener('resize', (event) => {
      this.bigScreen = window.innerWidth > 786;
    });
this.role=
  [
      {
          "id": 4,
          "menuId": 4,
          "groupId": 0,
          
          "isActive": 0,
          "menuLabel": "Manage User",
          "isSubMenu": 1,
          "menuUrl": "/home/operator-management/",
          "menuIcon": null,
          "refMenuId": 6,
          "isMainChecker": 0,
          "isCheckerAvailable": 1,
          "actionRequired": 1,
          "isEditDisable": null,
          "isDeleteDisable": null,
          "isCheckerDisable": null
      },
      {
          "id": 6,
          "menuId": 6,
          "groupId": 0,
          "isActive": 0,
          "menuLabel": "User Management",
          "isSubMenu": 0,
          "menuUrl": "/home/operator-management/",
          "menuIcon": "icon-user-management-latest-icon",
          "refMenuId": 0,
          "isMainChecker": 0,
          "isCheckerAvailable": 1,
          "actionRequired": 1,
          "isEditDisable": null,
          "isDeleteDisable": null,
          "isCheckerDisable": null
      },
      {
          "id": 7,
          "menuId": 7,
          "groupId": 0,
          "isActive": 0,
          "menuLabel": "Role & Privileges",
          "isSubMenu": 1,
          "menuUrl": "/home/group-management/",
          "menuIcon": null,
          "refMenuId": 6,
          "isMainChecker": 0,
          "isCheckerAvailable": 0,
          "actionRequired": 1,
          "isEditDisable": null,
          "isDeleteDisable": null,
          "isCheckerDisable": null
      },
      {
          "id": 10,
          "menuId": 10,
          "groupId": 0,
          
          "isActive": 0,
          "menuLabel": "Manage Company",
          "isSubMenu": 1,
          "menuUrl": "/home/company-master/",
          "menuIcon": null,
          "refMenuId": 6,
          "isMainChecker": 0,
          "isCheckerAvailable": 0,
          "actionRequired": 1,
          "isEditDisable": null,
          "isDeleteDisable": null,
          "isCheckerDisable": null
      },
      {
          "id": 12,
          "menuId": 12,
          "groupId": 0,
          "isActive": 0,
          "menuLabel": "Service Management",
          "isSubMenu": 0,
          "menuUrl": "null",
          "menuIcon": "icon-service-management-latest-icon",
          "refMenuId": 0,
          "isMainChecker": 0,
          "isCheckerAvailable": 1,
          "actionRequired": 1,
          "isEditDisable": null,
          "isDeleteDisable": null,
          "isCheckerDisable": null
      },
      {
          "id": 13,
          "menuId": 13,
          "groupId": 0,
          
          "isActive": 0,
          "menuLabel": "Manage Services",
          "isSubMenu": 1,
          "menuUrl": "/home/service-management/default-services/",
          "menuIcon": null,
          "refMenuId": 12,
          "isMainChecker": 0,
          "isCheckerAvailable": 1,
          "actionRequired": 1,
          "isEditDisable": null,
          "isDeleteDisable": null,
          "isCheckerDisable": null
      },
      {
          "id": 15,
          "menuId": 15,
          "groupId": 0,
          
          "isActive": 0,
          "menuLabel": "Template Parameters",
          "isSubMenu": 1,
          "menuUrl": "/home/service-management/",
          "menuIcon": null,
          "refMenuId": 12,
          "isMainChecker": 0,
          "isCheckerAvailable": 1,
          "actionRequired": 1,
          "isEditDisable": null,
          "isDeleteDisable": null,
          "isCheckerDisable": null
      },
      {
          "id": 17,
          "menuId": 17,
          "groupId": 0,
          
          "isActive": 0,
          "menuLabel": "Message Templates",
          "isSubMenu": 1,
          "menuUrl": "/home/service-management/message-templates/",
          "menuIcon": null,
          "refMenuId": 12,
          "isMainChecker": 0,
          "isCheckerAvailable": 1,
          "actionRequired": 1,
          "isEditDisable": null,
          "isDeleteDisable": null,
          "isCheckerDisable": null
      },
      {
          "id": 19,
          "menuId": 19,
          "groupId": 0,
          "isActive": 0,
          "menuLabel": "Configurations",
          "isSubMenu": 0,
          "menuUrl": "-",
          "menuIcon": "icon-configurations-latest-icon",
          "refMenuId": 0,
          "isMainChecker": 0,
          "isCheckerAvailable": 0,
          "actionRequired": 1,
          "isEditDisable": null,
          "isDeleteDisable": null,
          "isCheckerDisable": null
      },
      {
          "id": 25,
          "menuId": 25,
          "groupId": 0,
          "isView": 0,
          "isAdd": 0,
          "isEdit": 0,
          "isDelete": 0,
          "isChecker": 0,
          "isActive": 0,
          "menuLabel": "Manage Customers",
          "isSubMenu": 1,
          "menuUrl": "/home/customer-management/customerDetails/",
          "menuIcon": null,
          "refMenuId": 23,
          "isMainChecker": 0,
          "isCheckerAvailable": 1,
          "actionRequired": 1,
          "isEditDisable": null,
          "isDeleteDisable": null,
          "isCheckerDisable": null
      },
      {
          "id": 30,
          "menuId": 30,
          "groupId": 0,
          "isView": 0,
          "isAdd": 0,
          "isEdit": 0,
          "isDelete": 0,
          "isChecker": 0,
          "isActive": 0,
          "menuLabel": "Approve Customer Registration",
          "isSubMenu": 1,
          "menuUrl": "/home/customer-management/approve-customer/",
          "menuIcon": null,
          "refMenuId": 23,
          "isMainChecker": 0,
          "isCheckerAvailable": 0,
          "actionRequired": 1,
          "isEditDisable": null,
          "isDeleteDisable": null,
          "isCheckerDisable": null
      },
      {
          "id": 36,
          "menuId": 36,
          "groupId": 0,
          "isActive": 0,
          "menuLabel": "Campaign Management",
          "isSubMenu": 0,
          "menuUrl": "/home/campaign-management/",
          "menuIcon": "icon-campaign-management-latest-icon",
          "refMenuId": 0,
          "isMainChecker": 0,
          "isCheckerAvailable": 1,
          "actionRequired": 1,
          "isEditDisable": null,
          "isDeleteDisable": null,
          "isCheckerDisable": null
      },
      {
          "id": 37,
          "menuId": 37,
          "groupId": 0,
          "isActive": 0,
          "menuLabel": "Send Notification",
          "isSubMenu": 1,
          "menuUrl": "/home/campaign-management/",
          "menuIcon": null,
          "refMenuId": 36,
          "isMainChecker": 0,
          "isCheckerAvailable": 0,
          "actionRequired": 0,
          "isEditDisable": null,
          "isDeleteDisable": null,
          "isCheckerDisable": null
      },
      {
          "id": 38,
          "menuId": 38,
          "groupId": 0,
          
          "isActive": 0,
          "menuLabel": "Manage Campaign",
          "isSubMenu": 1,
          "menuUrl": "/home/campaign-management/PushSmsList",
          "menuIcon": null,
          "refMenuId": 36,
          "isMainChecker": 0,
          "isCheckerAvailable": 1,
          "actionRequired": 1,
          "isEditDisable": null,
          "isDeleteDisable": null,
          "isCheckerDisable": null
      },
      {
          "id": 41,
          "menuId": 41,
          "groupId": 0,
          
          "isActive": 0,
          "menuLabel": "Block List",
          "isSubMenu": 1,
          "menuUrl": "/home/safelist/",
          "menuIcon": null,
          "refMenuId": 19,
          "isMainChecker": 0,
          "isCheckerAvailable": 1,
          "actionRequired": 1,
          "isEditDisable": null,
          "isDeleteDisable": null,
          "isCheckerDisable": null
      },
      {
          "id": 62,
          "menuId": 62,
          "groupId": 0,
          "isActive": 0,
          "menuLabel": "Distribution List",
          "isSubMenu": 1,
          "menuUrl": "/home/distribution-list/",
          "menuIcon": "1",
          "refMenuId": 36,
          "isMainChecker": 0,
          "isCheckerAvailable": 0,
          "actionRequired": 1,
          "isEditDisable": null,
          "isDeleteDisable": null,
          "isCheckerDisable": null
      },
      {
          "id": 64,
          "menuId": 64,
          "groupId": 0,
          
          "isActive": 0,
          "menuLabel": "Promotional Marketing",
          "isSubMenu": 1,
          "menuUrl": "/home/promotional-marketing/",
          "menuIcon": "-",
          "refMenuId": 12,
          "isMainChecker": 0,
          "isCheckerAvailable": 1,
          "actionRequired": 1,
          "isEditDisable": null,
          "isDeleteDisable": null,
          "isCheckerDisable": null
      },
      {
          "id": 69,
          "menuId": 69,
          "groupId": 0,
          "isActive": 0,
          "menuLabel": "Reports",
          "isSubMenu": 0,
          "menuUrl": "/home/reports/campaignUpload",
          "menuIcon": "icon-report-latest-icon",
          "refMenuId": 0,
          "isMainChecker": 0,
          "isCheckerAvailable": 0,
          "actionRequired": 1,
          "isEditDisable": null,
          "isDeleteDisable": null,
          "isCheckerDisable": null
      },
      {
          "id": 72,
          "menuId": 72,
          "groupId": 0,
          "isActive": 0,
          "menuLabel": "Campaign Messages Summary",
          "isSubMenu": 1,
          "menuUrl": "/home/reports/campaignMessageStatusSummary",
          "menuIcon": "3",
          "refMenuId": 69,
          "isMainChecker": 0,
          "isCheckerAvailable": 0,
          "actionRequired": 0,
          "isEditDisable": null,
          "isDeleteDisable": null,
          "isCheckerDisable": null
      },
      {
          "id": 73,
          "menuId": 73,
          "groupId": 0,
          "isActive": 0,
          "menuLabel": "API Messages Report",
          "isSubMenu": 1,
          "menuUrl": "/home/reports/api-message-report",
          "menuIcon": null,
          "refMenuId": 69,
          "isMainChecker": 0,
          "isCheckerAvailable": 0,
          "actionRequired": 1,
          "isEditDisable": null,
          "isDeleteDisable": null,
          "isCheckerDisable": null
      },
      {
          "id": 75,
          "menuId": 75,
          "groupId": 0,
          "isActive": 0,
          "menuLabel": "Send Notification Report",
          "isSubMenu": 1,
          "menuUrl": "/home/reports/Send-Notification-Report",
          "menuIcon": null,
          "refMenuId": 69,
          "isMainChecker": 0,
          "isCheckerAvailable": 0,
          "actionRequired": 0,
          "isEditDisable": null,
          "isDeleteDisable": null,
          "isCheckerDisable": null
      },
      {
          "id": 83,
          "menuId": 83,
          "groupId": 0,
          
          "isActive": 0,
          "menuLabel": "Campaign Message Template",
          "isSubMenu": 1,
          "menuUrl": "/home/message-template-management/",
          "menuIcon": "-",
          "refMenuId": 36,
          "isMainChecker": 0,
          "isCheckerAvailable": 1,
          "actionRequired": 1,
          "isEditDisable": null,
          "isDeleteDisable": null,
          "isCheckerDisable": null
      },
      {
          "id": 84,
          "menuId": 84,
          "groupId": 0,
          
          "isActive": 0,
          "menuLabel": "Language Master",
          "isSubMenu": 1,
          "menuUrl": "/home/group-management/languageMaster",
          "menuIcon": "2",
          "refMenuId": 19,
          "isMainChecker": 0,
          "isCheckerAvailable": 0,
          "actionRequired": 1,
          "isEditDisable": null,
          "isDeleteDisable": null,
          "isCheckerDisable": null
      },
      {
          "id": 85,
          "menuId": 85,
          "groupId": 0,
          
          "isActive": 0,
          "menuLabel": "Category Master",
          "isSubMenu": 1,
          "menuUrl": "/home/campaign-management/categoryMaster",
          "menuIcon": "-",
          "refMenuId": 19,
          "isMainChecker": 0,
          "isCheckerAvailable": 0,
          "actionRequired": 1,
          "isEditDisable": null,
          "isDeleteDisable": null,
          "isCheckerDisable": null
      },
      {
          "id": 86,
          "menuId": 86,
          "groupId": 0,
          "isActive": 0,
          "menuLabel": "Analytics Dashboard",
          "isSubMenu": 1,
          "menuUrl": "http://172.16.8.146:84/#/callback?code=",
          "menuIcon": "http://enterprisealert.ducont.com:84/oauth2/#/callback?code=",
          "refMenuId": 87,
          "isMainChecker": 0,
          "isCheckerAvailable": 0,
          "actionRequired": 0,
          "isEditDisable": null,
          "isDeleteDisable": null,
          "isCheckerDisable": null
      },
      {
          "id": 87,
          "menuId": 87,
          "groupId": 0,
          "isActive": 0,
          "menuLabel": "Dashboard",
          "isSubMenu": 0,
          "menuUrl": "/home/company-master/",
          "menuIcon": "icon-dashboard",
          "refMenuId": 0,
          "isMainChecker": 0,
          "isCheckerAvailable": 0,
          "actionRequired": 0,
          "isEditDisable": null,
          "isDeleteDisable": null,
          "isCheckerDisable": null
      },
      {
          "id": 89,
          "menuId": 89,
          "groupId": 0,
          "isActive": 0,
          "menuLabel": "User Profile Report",
          "isSubMenu": 1,
          "menuUrl": "/home/reports/app-generic-reports",
          "menuIcon": "2",
          "refMenuId": 69,
          "isMainChecker": 0,
          "isCheckerAvailable": 0,
          "actionRequired": 0,
          "isEditDisable": null,
          "isDeleteDisable": null,
          "isCheckerDisable": null
      },
      {
          "id": 90,
          "menuId": 90,
          "groupId": 0,
          "isActive": 0,
          "menuLabel": "Server Dashboard",
          "isSubMenu": 1,
          "menuUrl": "/home/app-severdashboard",
          "menuIcon": "2",
          "refMenuId": 87,
          "isMainChecker": 0,
          "isCheckerAvailable": 0,
          "actionRequired": 0,
          "isEditDisable": null,
          "isDeleteDisable": null,
          "isCheckerDisable": null
      },
      {
          "id": 91,
          "menuId": 91,
          "groupId": 0,
          
          "isActive": 0,
          "menuLabel": "Manage Limit",
          "isSubMenu": 1,
          "menuUrl": "/home/credit/LimitRequestList",
          "menuIcon": "icon-dashboard",
          "refMenuId": 67,
          "isMainChecker": 0,
          "isCheckerAvailable": 0,
          "actionRequired": 1,
          "isEditDisable": null,
          "isDeleteDisable": null,
          "isCheckerDisable": null
      }]

  }

  onToggle() {
    this.showToggle = !this.showToggle;
  }

  showHead: boolean = false;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'profile-dropdownarrow-icon',
      sanitizer.bypassSecurityTrustResourceUrl(
        './assets/svg/profil-dropdown-arrow.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'main-menu-arrow-down-icon',
      sanitizer.bypassSecurityTrustResourceUrl(
        './assets/svg/main-menu-arrow-down.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'menu-icon',
      sanitizer.bypassSecurityTrustResourceUrl('./assets/svg/menu-icon.svg')
    );
    iconRegistry.addSvgIcon(
      'text-size-icon',
      sanitizer.bypassSecurityTrustResourceUrl('./assets/svg/text-size.svg')
    );
    // on route change to '/login', set the variable showHead to false
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if ((event['url'] == '/login', '/approvestatus')) {
          this.showHead = false;
        } else {
          // console.log("NU")
          this.showHead = true;
        }
      }
    });
    translate.addLangs(['en', 'ar']);
    translate.setDefaultLang('en');
    //document.documentElement.setAttribute('dir', 'ltr');

    this.translate.onLangChange.subscribe((event) => {
      if (event.lang === 'ar' || event.lang === 'he') {
        this.currentLanguageDirection = 'rtl';
      } else {
        this.currentLanguageDirection = 'ltr';
      }
    });
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }
}
function useLanguage(language: any, string: any) {
  throw new Error('Function not implemented.');
}
