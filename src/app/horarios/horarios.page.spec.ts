import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { HorariosPage } from './horarios.page';

describe('HorariosPage', () => {
  let component: HorariosPage;
  let fixture: ComponentFixture<HorariosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HorariosPage],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(HorariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
