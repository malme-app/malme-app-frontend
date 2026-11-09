import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanComponent } from './plan.component';
import { TEST_IMPORTS, testProviders } from '../../../testing/test-helpers';

describe('PlanComponent', () => {
  let component: PlanComponent;
  let fixture: ComponentFixture<PlanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: TEST_IMPORTS,
      declarations: [PlanComponent],
      providers: testProviders(),
    });
    fixture = TestBed.createComponent(PlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
