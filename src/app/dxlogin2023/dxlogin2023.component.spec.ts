import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dxlogin2023Component } from './dxlogin2023.component';
import { TEST_IMPORTS, testProviders } from '../../testing/test-helpers';

describe('Dxlogin2023Component', () => {
  let component: Dxlogin2023Component;
  let fixture: ComponentFixture<Dxlogin2023Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: TEST_IMPORTS,
      declarations: [Dxlogin2023Component],
      providers: testProviders(),
    });
    fixture = TestBed.createComponent(Dxlogin2023Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
