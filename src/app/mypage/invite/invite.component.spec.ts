import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteComponent } from './invite.component';
import { TEST_IMPORTS, testProviders } from '../../../testing/test-helpers';

describe('InviteComponent', () => {
  let component: InviteComponent;
  let fixture: ComponentFixture<InviteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: TEST_IMPORTS,
      declarations: [InviteComponent],
      providers: testProviders(),
    });
    fixture = TestBed.createComponent(InviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
