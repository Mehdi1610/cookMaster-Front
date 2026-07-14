import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterToolComponent } from './filter-tool.component';

describe('FilterToolComponent', () => {
  let component: FilterToolComponent;
  let fixture: ComponentFixture<FilterToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterToolComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterToolComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
