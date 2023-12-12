import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/service/common.service';

@Component({
  selector: 'app-attestations',
  templateUrl: './attestations.component.html',
  styleUrls: ['./attestations.component.css']
})
export class AttestationsComponent implements OnInit {

  usertype:string='';

  constructor(private common:CommonService) { }

  ngOnInit(): void {

this.usertype=this.common.getuserRole() || '';


  }



}
