import { Component, HostBinding } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Direction } from '@angular/cdk/bidi';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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
    this.overlayContainer.getContainerElement().classList.add('disable-backdrop-click');
  }

  allowCloseOnClickOut() {
    this.overlayContainer.getContainerElement().classList.remove('disable-backdrop-click');
  }



  topmenu01: boolean = false;
  topmenu02: boolean = false;
clickEvent(){
    this.topmenu01 = !this.topmenu01;   
    this.topmenu02 = !this.topmenu02;     
}

toggleChange(event: { source: any; value: any[]; }) {
  let toggle = event.source;
  if (toggle) {
    let group = toggle.buttonToggleGroup;
    if (event.value.some(item => item == toggle.value)) {
      group.value = [toggle.value];
    }
  }
}


showToggle = false;
currentLanguageDirection!: Direction | 'auto';
  bigScreen = false;

  ngOnInit(): void {

    this.bigScreen = window.innerWidth > 786;
    window.addEventListener("resize", event => {
      this.bigScreen = window.innerWidth > 786;
    });
    
  }



  onToggle() {
    this.showToggle = !this.showToggle;
  }

  showHead: boolean = false;



  constructor(private router: Router,
    private translate: TranslateService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
      iconRegistry.addSvgIcon
    ('profile-dropdownarrow-icon', sanitizer.bypassSecurityTrustResourceUrl('./assets/svg/profil-dropdown-arrow.svg')); 
    iconRegistry.addSvgIcon
    ('main-menu-arrow-down-icon', sanitizer.bypassSecurityTrustResourceUrl('./assets/svg/main-menu-arrow-down.svg')); 
    iconRegistry.addSvgIcon
    ('menu-icon', sanitizer.bypassSecurityTrustResourceUrl('./assets/svg/menu-icon.svg')); 
    iconRegistry.addSvgIcon
    ('text-size-icon', sanitizer.bypassSecurityTrustResourceUrl('./assets/svg/text-size.svg')); 
  // on route change to '/login', set the variable showHead to false
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event['url'] == '/login','/approvestatus') {
          this.showHead = false;
        } else {
          // console.log("NU")
          this.showHead = true;
        }
      }
    });
    translate.addLangs(['en','ar']);
    translate.setDefaultLang('en');
    //document.documentElement.setAttribute('dir', 'ltr');
 
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

}
function useLanguage(language: any, string: any) {
  throw new Error('Function not implemented.');
}

