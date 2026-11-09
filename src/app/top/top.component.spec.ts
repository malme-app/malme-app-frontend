import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopComponent } from './top.component';
import { TEST_IMPORTS, testProviders } from '../../testing/test-helpers';

describe('TopComponent', () => {
  let component: TopComponent;
  let fixture: ComponentFixture<TopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: TEST_IMPORTS,
      declarations: [TopComponent],
      providers: testProviders(),
    });
    fixture = TestBed.createComponent(TopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
