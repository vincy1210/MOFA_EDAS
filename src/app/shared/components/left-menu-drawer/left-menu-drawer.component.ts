import { Component, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { CommonService } from 'src/service/common.service';
import { EventEmitter, Output } from '@angular/core';

interface MenuModel {
  id: number;
  menu: string;
  icon: string;
  link?: string;
  hasubMenu:boolean;
  subMenus?: { id: number; menu: string; icon: string; link?: string, param?:string }[];
}

@Component({
  selector: 'app-left-menu-drawer',
  templateUrl: './left-menu-drawer.component.html',
  styleUrls: ['./left-menu-drawer.component.css'],
})
export class LeftMenuDrawerComponent implements OnInit {

  currentlyExpandedIndex: number = -1;

  @Output() submenuClicked: EventEmitter<void> = new EventEmitter<void>();
  selectedMenuIndex: number = -1; // Initialize with an invalid index

  username:any;
  companyname:any;
usertype:string='';
  isAdmin:boolean=false;
  menuList: MenuModel[] = [];
  @ViewChild('myPanel') myPanel!: MatExpansionPanel;

  constructor(private router: Router, public common:CommonService) {}

  ngOnInit(): void {

    let data=this.common.getUserProfile();
    if(data!=undefined  || data!=null){
    let abc=JSON.parse(data);
    console.log(JSON.parse(data))
    this.username=abc.Data.firstnameEN;
    }


    let usertype=this.common.getUserType() || '';
if(usertype=='' || usertype==null){
  
  this.common.userType$.subscribe((usertype_) => {
    this.usertype = usertype_;
    console.log(this.usertype);
  });

}
else{
  this.usertype=usertype;
  this.getMenuItemLists();
}
if(usertype!='LCAAdmin'){
  

   
   
    this.common.userCompany$.subscribe((loggedIn) => {
      this.companyname = loggedIn;
    });
    let companyname1=this.common.getSelectedCompany()
    console.log(companyname1)
    this.companyname=companyname1?.business_name || '';

    this.common.isAdmin$.subscribe((isAdmin_) => {
      this.isAdmin = isAdmin_;
      if(this.usertype!='LCAAdmin'){
        this.getMenuItemLists();

      }
      console.log(this.isAdmin);
    });
    
  
}
    
  }

  getMenuItemLists() {
    this.menuList=[];

  console.log(this.usertype)

  if(this.usertype!='LCAAdmin'){
    
    this.menuList.push(
      {
        id: 1,
        menu: 'Dashboard',
        icon: 'dashboard',
        link: '/dashboard',
        hasubMenu:false
      },
      {
        id: 1,
        menu: 'Attestation',
        icon: 'event_note',
        hasubMenu:true,
        subMenus: [
          {  id: 1, menu: 'Pending ', icon: 'play_arrow', link: '/attestation'},
          {  id: 2,  menu: 'Completed',   icon: 'play_arrow', link: '/lcacompletedattestation',  param:'true' },
        
        ],
      },
      {
        id: 1,
        menu: 'COO Attestation',
        hasubMenu:true,
        icon: 'travel_explore',
        subMenus: [
          { id: 1, menu: 'Pending', icon: 'play_arrow', link: '/cooattestation' },
          { id: 2, menu: 'In Review', icon: 'play_arrow',link: '/cooinreview' },
          { id: 3, menu: 'Completed', icon: 'play_arrow',link: '/CompletedCooRequest' },
        ],
      },
      {
        id: 1,
        menu: 'Physical Attestation',
        hasubMenu:true,
        icon: 'save_as',
        subMenus: [
          { id: 1, menu: 'Pending', icon: 'play_arrow', link: '/physicalattestation' },
          { id: 2, menu: 'In Review', icon: 'play_arrow',link: '/physicalinreview' },
          { id: 3, menu: 'Completed', icon: 'play_arrow',link: '/completedattestation' },
        ],
      },
      {
        id: 1,
        menu: 'Reports',
        hasubMenu:true,
        icon: 'feed',
        subMenus: [
          { id: 1, menu: 'LCA', icon: 'play_arrow', link: '/lca' },
          { id: 2, menu: 'COO', icon: 'play_arrow',link: '/coo' },
          { id: 3, menu: 'Physical', icon: 'play_arrow',link: '/physical' },
          { id: 4, menu: 'Fines', icon: 'play_arrow',link: '/fines' },
        ],
      },
    );

    if(this.isAdmin){
      this.menuList.push( {
        id: 3,
        menu: 'Authorized Users',
        icon: 'supervisor_account',
        link:'/userslist',
        hasubMenu:false
      });
    }
    else{
      const switchCompanyIndex = this.menuList.findIndex(item => item.id === 3);

      if (switchCompanyIndex !== -1) {
        this.menuList.splice(switchCompanyIndex, 1);
      }

    }
  }
  else{
    //
    console.log('menu for LCA Admin is loading')

    this.menuList.push( {
      id: 1,
      menu: 'Attestations',
      hasubMenu:true,
        icon: 'feed',
        subMenus: [
          { id: 1, menu: 'Import', icon: 'play_arrow', link: '/importslca' },
          { id: 2, menu: 'Pending', icon: 'play_arrow',link: '/pendinglca' },
          { id: 3, menu: 'Completed', icon: 'play_arrow',link: '/completedlca' },
        ]
    });

   
  }
  }
  
  onPanelClick(items: any) {
    // items.hasSubMenus = items.subMenus && items.subMenus.length > 0;
    if (items.link) {
      this.router.navigate([items.link]);
      this.myPanel.close();
    }
  }
  onSubMenuClick(items: any, i?:any) {
    this.selectedMenuIndex = i;
    console.log("in parent component after drawer change")

    this.submenuClicked.emit();
    if (items.link) {
      this.router.navigate([items.link]);
      this.myPanel.close();
    }
  }

  
  setSelectedMenuIndex(index: number): void {
    this.selectedMenuIndex = index;
  }
  
  calculateLinePosition(): string {
    // Calculate the position based on the selected menu index
    const lineHeight = 48; // Adjust this value based on your menu item height
    const topPosition = this.selectedMenuIndex !== -1 ? `${this.selectedMenuIndex * lineHeight}px` : '0';
    return topPosition;
  }

  onMainPanelClick(index: number): void {
    this.currentlyExpandedIndex = this.currentlyExpandedIndex === index ? -1 : index;
  }
  
  
}
