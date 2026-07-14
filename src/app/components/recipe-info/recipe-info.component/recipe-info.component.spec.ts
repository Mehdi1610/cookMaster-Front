import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeInfoComponent } from './recipe-info.component';

describe('RecipeInfoComponent', () => {
  let component: RecipeInfoComponent;
  let fixture: ComponentFixture<RecipeInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeInfoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
