import { Component, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Router } from '@angular/router';

interface MenuModel {
  id: number;
  menu: string;
  icon: string;
  link?: string;
  subMenus?: { id: number; menu: string; icon: string; link?: string, param?:string }[];
}

@Component({
  selector: 'app-left-menu-drawer',
  templateUrl: './left-menu-drawer.component.html',
  styleUrls: ['./left-menu-drawer.component.css'],
})
export class LeftMenuDrawerComponent implements OnInit {
  menuList: MenuModel[] = [];
  @ViewChild('myPanel') myPanel!: MatExpansionPanel;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.getMenuItemLists();
  }

  getMenuItemLists() {
    this.menuList.push(
      {
        id: 1,
        menu: 'Dashboard',
        icon: 'dashboard',
        link: '/dashboard',
      },
       {
        id: 1,
        menu: 'Profile',
        icon: 'manage_accounts',
        link:'/landingpage'
        // subMenus: [
        //   { id: 1, menu: 'Option 01', icon: 'play_arrow' },
        //   { id: 2, menu: 'Option 02', icon: 'play_arrow' },
        //   { id: 3, menu: 'Option 03', icon: 'play_arrow' },
        // ],
      },
      // {
      //   id: 1,
      //   menu: 'Services',
      //   icon: 'manage_accounts',
      //   subMenus: [
      //     { id: 1, menu: 'Option 01', icon: 'play_arrow' },
      //     { id: 2, menu: 'Option 02', icon: 'play_arrow' },
      //     { id: 3, menu: 'Option 03', icon: 'play_arrow' },
      //   ],
      // },
      {
        id: 1,
        menu: 'Attestation',
        icon: 'settings',
        subMenus: [
          {
            id: 1,
            menu: 'Pending Attestations',
            icon: 'play_arrow',
            link: '/attestation',
          },
          {
            id: 2,
            menu: 'Completed Attestations',
            icon: 'play_arrow',
            link: '/lcacompletedattestation',
            param:'true'
          },
          {
            id: 3,
            menu: 'Physical Attestations',
            icon: 'play_arrow',
            link: '/physicalattestation',
          },
          {
            id: 4,
            menu: 'Completed Physical Attestations',
            icon: 'play_arrow',
            link: '/completedattestation',
          },
          {
            id: 5,
            menu: 'COO Attestations',
            icon: 'play_arrow',
            link: '/cooattestation',
          },
          {
            id: 6,
            menu: 'Completed COO Attestations',
            icon: 'play_arrow',
            link: '/completedcoorequests',
          }
        ],
      },
      // {
      //   id: 1,
      //   menu: 'Manual Attestation Services',
      //   icon: 'account_box',
      //   subMenus: [{ id: 1, menu: 'Option 01', icon: 'play_arrow' }],
      // },
      // {
      //   id: 1,
      //   menu: 'Reports',
      //   icon: 'assessment',
      //   subMenus: [{ id: 1, menu: 'Option 01', icon: 'play_arrow' }],
      // },
      // {
      //   id: 1,
      //   menu: 'Audit Trail',
      //   icon: 'find_in_page',
      //   subMenus: [{ id: 1, menu: 'Option 01', icon: 'play_arrow' }],
      // },
      // {
      //   id: 1,
      //   menu: 'Configurations',
      //   icon: 'build',
      //   subMenus: [{ id: 1, menu: 'Option 01', icon: 'play_arrow' }],
      // },
      // {
      //   id: 1,
      //   menu: 'Settings',
      //   icon: 'settings',
      //   subMenus: [{ id: 1, menu: 'Option 01', icon: 'play_arrow' }],
      // }
    );
  }
  
  onPanelClick(items: any) {
    if (items.link) {
      this.router.navigate([items.link]);
      this.myPanel.close();
    }
  }
}
