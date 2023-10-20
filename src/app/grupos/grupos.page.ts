import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.page.html',
  styleUrls: ['./grupos.page.scss'],
})
export class GruposPage implements OnInit {

  public grupo!: string;
  private activatedRoute = inject(ActivatedRoute);
  
  
  constructor() { }
  
  ngOnInit() {
    this.grupo = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

}
