import {ChangeDetectorRef, Component, HostBinding } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Direction } from '@angular/cdk/bidi';
import { CommonService } from 'src/service/common.service';
import { MatDrawer } from '@angular/material/sidenav';
import { environment } from 'src/environments/environment';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';//vincy
import { Keepalive } from '@ng-idle/keepalive';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/service/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  idleState = "NOT_STARTED";  //vincy
  countdown?: number;
  lastPing?: Date;
  userwasIdle:boolean=false;

  userprofile:any;
  @HostBinding('class') classRoot = 'theme-default';
  userloggedin: boolean = false;
  lcauserloggedin:boolean=false
  username:string='';
  companyname:string='';
  copyrightyear=environment.appdetails.year;
  version=environment.appdetails.version;
  selectedlanguage:string='';
  selectedpalette:string='';

  title = 'uaemofa';
  overlayContainer: any;

  fontSize = 'sm';

  toggle(size: string) {
    this.fontSize = size;
  }

  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
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

  role: any;

  ngOnInit(): void {

    console.log(this.userloggedin);
    console.log(this.lcauserloggedin);

    
    this.reset();
    this.bigScreen = window.innerWidth > 786;
    window.addEventListener('resize', (event) => {
      this.bigScreen = window.innerWidth > 786;
    });
  }

  onToggle() {
    this.showToggle = !this.showToggle;
  }

  // toggleDrawer(): void {
  //   this.drawer.toggle();
  // }
userrole:string='';
role2:string='';
  showHead: boolean = false;
  private userRoleSubscription!: Subscription;
  constructor(
    public auth:AuthService,
    private router: Router,
    private translate: TranslateService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer, public common:CommonService,
    private idle: Idle, keepalive: Keepalive, cd: ChangeDetectorRef //vincy

  ) {


    let role2=this.common.getuserRole();
    this.role2=role2;
    console.log(role2)

    let role=this.common.userRole;
    if(!role){
      this.userRoleSubscription = this.common.userRole$.subscribe(() => {
        // this.getMenuItemLists();
        const userRole = this.common.userRole;
        this.userrole=userRole;
        this.role2=this.userrole;
        console.log(userRole);
      });
  
    }
    else{
      this.userrole=role;
    }

   

    idle.setIdle(1500); // how long can they be inactive before considered idle, in seconds
    idle.setTimeout(300); // how long can they be idle before considered timed out, in seconds
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES); 

    idle.onIdleStart.subscribe(() => {
      this.idleState = "IDLE";

      console.log("popup has to appear now")
this.userwasIdle=true;
      //this.common.showSuccessMessage("popup has to appear now");
    });
    // do something when the user is no longer idle
    idle.onIdleEnd.subscribe(() => {
      // this.userwasIdle = false;
      this.idleState = "NOT_IDLE";
      console.log(`${this.idleState} ${new Date()}`)
      this.countdown = 0;
      cd.detectChanges(); // how do i avoid this kludge?
    });
    // do something when the user has timed out
    idle.onTimeout.subscribe(() =>{
      this.userwasIdle = false;
      this.idleState = "TIMED_OUT"
      console.log("session timeout");
      this.common.showSuccessMessage("session timeout");
      // this.logout();   // to do
    this.auth.logout();

    } );
    // do something as the timeout countdown does its thing
    idle.onTimeoutWarning.subscribe(seconds => this.countdown = seconds);

    // set keepalive parameters, omit if not using keepalive
    keepalive.interval(15); // will ping at this interval while not idle, in seconds
    keepalive.onPing.subscribe(() => this.lastPing = new Date()); // do something when it pings





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
    //added by 25102023
    iconRegistry.addSvgIcon(
      'vex_icon',
      sanitizer.bypassSecurityTrustResourceUrl('./assets/svg/unfold.svg')
    );
    //added by 25102023
    iconRegistry.addSvgIcon(
      'company_switch',
      sanitizer.bypassSecurityTrustResourceUrl('./assets/svg/v_cozy.svg')
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
   
    this.selectedlanguage=sessionStorage.getItem('language') || '';
    this.selectedpalette=sessionStorage.getItem('Palette') || '';
if(this.selectedpalette===""){
this.classRoot='theme-default';
}
else{
  this.classRoot = this.selectedpalette;
}


    if(this.selectedlanguage===""){
      translate.addLangs(['en', 'ar']);
      translate.setDefaultLang('en');
    }
    else{
      if (this.selectedlanguage === 'ar' ) {
        translate.setDefaultLang('ar');
        this.currentLanguageDirection = 'rtl';
      } else {
        translate.setDefaultLang('en');
        this.currentLanguageDirection = 'ltr';
      }
    }
     this.translate.onLangChange.subscribe((event) => {
        if (event.lang === 'ar' || event.lang === 'he') {
          this.currentLanguageDirection = 'rtl';
        } else {
          this.currentLanguageDirection = 'ltr';
        }
      });

   
//added Nov 08
    this.common.userloggedin$.subscribe((loggedIn) => {
      this.userloggedin = loggedIn;
    });

    this.common.lcauserloggedin$.subscribe((lcaloggedIn) => {
      this.lcauserloggedin = lcaloggedIn;
    });

if(this.userrole){
  console.log('usertype empty')
    this.common.userCompany$.subscribe((loggedIn) => {
      this.companyname = loggedIn;
    });

    this.common.userprofile$.subscribe((username) => {
      //  this.userprofile = username;
      this.username=username;
    });
    let data=this.common.getUserProfile();
    if(data!=undefined  || data!=null){
      
    let abc=JSON.parse(data);
    console.log(JSON.parse(data))
    this.username=abc.Data.firstnameEN;
    console.log("calling getselected company")
    let companyname1=this.common.getSelectedCompany()
    console.log(companyname1)
    this.companyname=companyname1?.business_name || '';
    
  }
  else{
    // this.common.logoutUser();
    this.auth.logout();
  }
}
else{

}

  }

  useLanguage(language: string) {
    sessionStorage.setItem('language',language)
    this.selectedlanguage=language;
    this.translate.use(language);
  }

  usePalette(palette: string) {
    sessionStorage.setItem('Palette',palette)
    this.selectedpalette=palette;
    this.classRoot = palette
    // this.translate.use(language);
  }

  goToHome() {
    this.router.navigate(['/dashboard']); // Replace '/home' with the desired URL
  }
  closeDrawer(drawer: MatDrawer) {
    console.log("in app component after drawer change")
    drawer.close();
  }

 

  reset() {
    // we'll call this method when we want to start/reset the idle process
    // reset any component state and be sure to call idle.watch()
    this.userwasIdle = false;
    this.idle.watch();
    this.idleState = "NOT_IDLE";
    this.countdown = 0;
    this.lastPing;
  }
  
  
}
// function useLanguage(language: any, string: any) {
//   throw new Error('Function not implemented.');
// }
