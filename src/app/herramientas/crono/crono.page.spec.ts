import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CronoPage } from './crono.page';

describe('CronoPage', () => {
  let component: CronoPage;
  let fixture: ComponentFixture<CronoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CronoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
