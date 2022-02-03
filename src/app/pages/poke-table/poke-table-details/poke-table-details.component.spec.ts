import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokeTableDetailsComponent } from './poke-table-details.component';

describe('PokeTableDetailsComponent', () => {
  let component: PokeTableDetailsComponent;
  let fixture: ComponentFixture<PokeTableDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PokeTableDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokeTableDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
