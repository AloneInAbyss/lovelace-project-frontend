import { TestBed } from '@angular/core/testing';
import { NgZone } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { provideZonelessChangeDetection } from '@angular/core';
import { routes } from '../../app.routes';

describe('NavbarComponent', () => {
  let fixture: any;
  let comp: NavbarComponent;
  let authSubject: BehaviorSubject<boolean>;
  let authMock: any;
  let messageMock: any;
  let router: Router;

  beforeEach(async () => {
    authSubject = new BehaviorSubject<boolean>(false);
    authMock = {
      isLoggedIn$: authSubject.asObservable(),
      logout: jasmine.createSpy('logout').and.callFake(() => {}),
    };

    messageMock = { add: jasmine.createSpy('add') };

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideRouter(routes),
        provideZonelessChangeDetection(),
        { provide: AuthService, useValue: authMock },
        { provide: MessageService, useValue: messageMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    await fixture.whenStable();
    comp = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('creates and initializes currentUrl', () => {
    expect(comp).toBeTruthy();
    // default from router in testbed is '/'
    expect(comp['currentUrl']).toBeDefined();
  });

  it('getButtonSeverity returns primary for matching paths', async () => {
    comp['currentUrl'] = '/';
    await fixture.whenStable();
    expect(comp.getButtonSeverity('/')).toBe('primary');

    comp['currentUrl'] = '/wishlist';
    await fixture.whenStable();
    expect(comp.getButtonSeverity('/wishlist')).toBe('primary');
    expect(comp.getButtonSeverity('/test')).toBe('secondary');

    comp['currentUrl'] = '/wishlist/item/123';
    await fixture.whenStable();
    expect(comp.getButtonSeverity('/wishlist')).toBe('primary');
  });

  it('stripUrl removes query and hash', () => {
    const raw = '/page?x=1#frag';
    const stripped = (comp as any).stripUrl(raw);
    expect(stripped).toBe('/page');
  });

  it('updates currentUrl on navigation', async () => {
    await router.navigateByUrl('/wishlist');
    await fixture.whenStable();
    // NavigationEnd subscription should update currentUrl
    expect(comp['currentUrl']).toBe('/wishlist');
    expect(comp.getButtonSeverity('/wishlist')).toBe('primary');
  });

  it('reacts to auth state changes', async () => {
    // initially false
    expect(comp.isLoggedIn).toBeFalse();
    // push logged-in true
    authSubject.next(true);
    await fixture.whenStable();
    expect(comp.isLoggedIn).toBeTrue();
  });

  it('signOut navigates to /login on success', async () => {
    // ensure logout doesn't throw
    (authMock.logout as jasmine.Spy).and.callFake(() => {});
    // call signOut via public menu command if available
    const signOutItem = comp.items?.find((i) => i.label === 'Sair');
    if (signOutItem && signOutItem.command) {
      // PrimeNG MenuItem.command usually receives an event object; pass a minimal stub
  signOutItem.command({ originalEvent: {} as Event } as any);
    } else {
      (comp as any).signOut();
    }

    await fixture.whenStable();
    const r = TestBed.inject(Router);
    // should have navigated to /login
    // RouterTestingModule records navigations; verify currentUrl
    expect(r.url).toContain('/login');
  });

  it('signOut shows error message on exception', async () => {
    // make logout throw
    (authMock.logout as jasmine.Spy).and.callFake(() => {
      throw new Error('fail');
    });

    // trigger sign out
    try {
      (comp as any).signOut();
    } catch (e) {
      // swallow
    }

    await fixture.whenStable();
    expect(messageMock.add).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'error' }));
  });

  it('ngOnDestroy unsubscribes from router events', async () => {
    // record currentUrl
    const before = comp['currentUrl'];
    // destroy
    comp.ngOnDestroy();
    // navigate after destroy
    await router.navigateByUrl('/other');
    await fixture.whenStable();
    // currentUrl should not have been updated by the subscription
    expect(comp['currentUrl']).toBe(before);
  });
});
