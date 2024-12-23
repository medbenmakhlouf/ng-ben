import { type ComponentRef, type Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, NavigationStart, type Router } from '@angular/router';
import { Subject } from 'rxjs';
import { routerInitializerFactory } from '../factories';
import { GoogleAnalyticsService } from '../google-analytics.service';

describe('googleAnalyticsRouterInitializer(settings, gaService)', () => {
  /**
   * Transforms an object to a specified type.
   * @param {Partial<Dest>} obj - The object to transform.
   * @returns {Dest} The transformed object.
   */
  function fakeTransform<Dest>(obj: Partial<Dest>): Dest {
    return obj as any;
  }

  let gaService: GoogleAnalyticsService,
    spyOnGaService: jasmine.Spy,
    router$: Subject<any>,
    router: Router,
    component: ComponentRef<any>;

  beforeEach(() => {
    gaService = TestBed.inject(GoogleAnalyticsService);
    spyOnGaService = spyOn(gaService, 'pageView');
    router$ = new Subject<any>();
    router = fakeTransform<Router>({
      events: router$,
    });
    component = fakeTransform<ComponentRef<any>>({
      injector: fakeTransform<Injector>({
        get: () => router,
      }),
      onDestroy: () => {
        /* empty */
      },
    });
  });

  it('should not trigger the first route event', async () => {
    await routerInitializerFactory(null, gaService)(component);

    // act
    router$.next(new NavigationStart(1, '/test'));
    router$.next(new NavigationEnd(1, '/test', '/test'));
    router$.next(new NavigationEnd(1, '/test', '/test'));

    // asserts
    expect(spyOnGaService).toHaveBeenCalledTimes(1);
  });

  it('should trigger the second route event', async () => {
    await routerInitializerFactory(null, gaService)(component);

    // act
    router$.next(new NavigationStart(1, '/test'));
    router$.next(new NavigationEnd(1, '/test', '/test'));
    router$.next(new NavigationEnd(1, '/test', '/test'));

    // asserts
    expect(spyOnGaService).toHaveBeenCalledTimes(1);
    expect(spyOnGaService).toHaveBeenCalledWith('/test', undefined);
  });

  it('should trigger only included route', async () => {
    await routerInitializerFactory({ include: ['/test'] }, gaService)(component);

    // act
    router$.next(new NavigationStart(1, '/test'));
    router$.next(new NavigationEnd(1, '/test', '/test'));
    router$.next(new NavigationEnd(1, '/test', '/test'));
    router$.next(new NavigationStart(1, '/test1'));
    router$.next(new NavigationEnd(1, '/test1', '/test1'));
    router$.next(new NavigationStart(1, '/test2'));
    router$.next(new NavigationEnd(1, '/test2', '/test2'));

    // asserts
    expect(spyOnGaService).toHaveBeenCalledTimes(1);
    expect(spyOnGaService).toHaveBeenCalledWith('/test', undefined);
  });

  it('should not trigger excluded route', async () => {
    await routerInitializerFactory({ exclude: ['/test'] }, gaService)(component);

    // act
    router$.next(new NavigationStart(1, '/test1'));
    router$.next(new NavigationEnd(1, '/test1', '/test1'));
    router$.next(new NavigationStart(1, '/test2'));
    router$.next(new NavigationEnd(1, '/test2', '/test2'));
    router$.next(new NavigationStart(1, '/test'));
    router$.next(new NavigationEnd(1, '/test', '/test'));
    router$.next(new NavigationEnd(1, '/test', '/test'));

    // asserts
    expect(spyOnGaService).toHaveBeenCalledTimes(1);
    expect(spyOnGaService).toHaveBeenCalledWith('/test2', undefined);
  });

  it('should work w/ include and exclude router', async () => {
    await routerInitializerFactory({ include: ['/test*'], exclude: ['/test-2'] }, gaService)(component);

    // act
    router$.next(new NavigationStart(1, '/test-1'));
    router$.next(new NavigationEnd(1, '/test-1', '/test-1'));
    router$.next(new NavigationEnd(1, '/test-1', '/test-1'));
    router$.next(new NavigationStart(1, '/test-2'));
    router$.next(new NavigationEnd(1, '/test-2', '/test-2'));

    // asserts
    expect(spyOnGaService).toHaveBeenCalledTimes(1);
    expect(spyOnGaService).toHaveBeenCalledWith('/test-1', undefined);
  });

  it('should match simple uri', async () => {
    await routerInitializerFactory({ include: ['/test-1'] }, gaService)(component);

    // act
    router$.next(new NavigationStart(1, '/test-1'));
    router$.next(new NavigationEnd(1, '/test-1', '/test-1'));
    router$.next(new NavigationEnd(1, '/test-1', '/test-1'));

    // asserts
    expect(spyOnGaService).toHaveBeenCalledTimes(1);
    expect(spyOnGaService).toHaveBeenCalledWith('/test-1', undefined);
  });

  it('should match wildcard uri', async () => {
    await routerInitializerFactory({ include: ['/test*'] }, gaService)(component);

    // act
    router$.next(new NavigationStart(1, '/test-1'));
    router$.next(new NavigationEnd(1, '/test-1', '/test-1'));
    router$.next(new NavigationEnd(1, '/test-1', '/test-1'));

    // asserts
    expect(spyOnGaService).toHaveBeenCalledTimes(1);
    expect(spyOnGaService).toHaveBeenCalledWith('/test-1', undefined);
  });

  it('should match RegExp uri', async () => {
    await routerInitializerFactory({ include: [new RegExp('/test.*', 'i')] }, gaService)(component);

    // act
    router$.next(new NavigationStart(1, '/test-1'));
    router$.next(new NavigationEnd(1, '/test-1', '/test-1'));
    router$.next(new NavigationEnd(1, '/test-1', '/test-1'));

    // asserts
    expect(spyOnGaService).toHaveBeenCalledTimes(1);
    expect(spyOnGaService).toHaveBeenCalledWith('/test-1', undefined);
  });
});
