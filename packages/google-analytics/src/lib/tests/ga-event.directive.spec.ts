import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { GoogleAnalyticsDirective } from '../google-analytics.directive';
import { GoogleAnalyticsService } from '../google-analytics.service';
import { type GaActionEnum } from '../enums';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ga-host',
  template: `
    <button
      google-analytics
      gaEvent="test-1"
      class="test-1 test-click"
      [gaAction]="gaAction"
      [gaLabel]="gaLabel"
      [label]="label"
      [gaValue]="gaValue"
      [gaInteraction]="gaInteraction"
      >Button 1</button
    >
    <button
      google-analytics
      gaEvent="test-2"
      class="test-2 test-focus"
      [gaAction]="gaAction"
      [gaLabel]="gaLabel"
      [label]="label"
      [gaValue]="gaValue"
      [gaInteraction]="gaInteraction"
      gaBind="focus"
      >Button 2</button
    >
    <button
      google-analytics
      gaEvent="test-3"
      class="test-3 test-blur"
      [gaAction]="gaAction"
      [gaLabel]="gaLabel"
      [label]="label"
      [gaValue]="gaValue"
      [gaInteraction]="gaInteraction"
      gaBind="blur"
      >Button 3</button
    >
    <button
      google-analytics
      gaCategory="test-4"
      [gaEvent]="gaEvent"
      class="test-4 test-category"
      [gaAction]="gaAction"
      [gaLabel]="gaLabel"
      [label]="label"
      [gaValue]="gaValue"
      [gaInteraction]="gaInteraction"
      >Button 4</button
    >
    <button
      google-analytics
      gaEvent="test-5"
      class="test-5 test-custom"
      [gaAction]="gaAction"
      [gaLabel]="gaLabel"
      [label]="label"
      [gaValue]="gaValue"
      [gaInteraction]="gaInteraction"
      gaBind="custom"
      >Button 5</button
    >
  `,
  imports: [GoogleAnalyticsDirective],
})
class HostComponent {
  gaAction!: GaActionEnum | string;
  gaLabel!: string;
  label!: string;
  gaValue!: number;
  gaInteraction!: boolean;
  // gaBind = 'click';
  gaEvent!: GaActionEnum | string;
}

describe('GaEventDirective', () => {
  let fixture: ComponentFixture<HostComponent>, host: HostComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
  });

  it('should create an instance', () => {
    const gaEvent = fixture.debugElement
      .query((i) => (i.nativeElement as HTMLButtonElement).classList.contains('test-1'))
      .injector.get(GoogleAnalyticsDirective);
    expect(gaEvent).toBeTruthy();
  });

  it('should call `trigger` on click event', () => {
    const ga: GoogleAnalyticsService = TestBed.inject(GoogleAnalyticsService),
      spyOnGa = spyOn(ga, 'event'),
      input = fixture.debugElement.query((e) =>
        (e.nativeElement as HTMLButtonElement).classList.contains('test-click'),
      );

    fixture.detectChanges();
    input.nativeElement.click();
    fixture.detectChanges();

    expect(spyOnGa).toHaveBeenCalledWith('test-1', undefined, undefined, undefined, undefined);
  });

  it('should call `trigger` on focus event', () => {
    const ga: GoogleAnalyticsService = TestBed.inject(GoogleAnalyticsService),
      spyOnGa = spyOn(ga, 'event'),
      input = fixture.debugElement.query((e) =>
        (e.nativeElement as HTMLButtonElement).classList.contains('test-focus'),
      );

    fixture.detectChanges();
    input.nativeElement.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();

    expect(spyOnGa).toHaveBeenCalledWith('test-2', undefined, undefined, undefined, undefined);
  });

  it('should call `trigger on blur event`', () => {
    const ga: GoogleAnalyticsService = TestBed.inject(GoogleAnalyticsService),
      spyOnGa = spyOn(ga, 'event'),
      input = fixture.debugElement.query((e) => (e.nativeElement as HTMLButtonElement).classList.contains('test-blur'));

    fixture.detectChanges();
    input.nativeElement.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();

    expect(spyOnGa).toHaveBeenCalledWith('test-3', undefined, undefined, undefined, undefined);
  });

  it('should call `trigger on custom event`', () => {
    const ga: GoogleAnalyticsService = TestBed.inject(GoogleAnalyticsService),
      spyOnGa = spyOn(ga, 'event'),
      input = fixture.debugElement.query((e) =>
        (e.nativeElement as HTMLButtonElement).classList.contains('test-custom'),
      );

    fixture.detectChanges();
    input.nativeElement.dispatchEvent(new CustomEvent('custom'));
    fixture.detectChanges();

    expect(spyOnGa).toHaveBeenCalledWith('test-5', undefined, undefined, undefined, undefined);
  });

  it('should warn a message when try to call a event w/o gaEvent/gaAction value', () => {
    const spyOnConsole = spyOn(console, 'warn');
    const input = fixture.debugElement.query((e) =>
      (e.nativeElement as HTMLButtonElement).classList.contains('test-category'),
    );
    fixture.detectChanges();
    input.nativeElement.click();
    fixture.detectChanges();

    expect(spyOnConsole).toHaveBeenCalled();
  });

  it('should grab gaAction and pass to event trigger', () => {
    const ga: GoogleAnalyticsService = TestBed.inject(GoogleAnalyticsService),
      action = 'action-t',
      spyOnGa = spyOn(ga, 'event'),
      input = fixture.debugElement.query((e) =>
        (e.nativeElement as HTMLButtonElement).classList.contains('test-category'),
      );

    host.gaAction = action;
    fixture.detectChanges();
    input.nativeElement.click();
    fixture.detectChanges();

    expect(spyOnGa).toHaveBeenCalledWith(action, 'test-4', undefined, undefined, undefined);
  });

  it('should grab gaEvent and pass to event trigger', () => {
    const ga: GoogleAnalyticsService = TestBed.inject(GoogleAnalyticsService),
      action = 'action-t',
      spyOnGa = spyOn(ga, 'event'),
      input = fixture.debugElement.query((e) =>
        (e.nativeElement as HTMLButtonElement).classList.contains('test-category'),
      );

    host.gaEvent = action;
    fixture.detectChanges();
    input.nativeElement.click();
    fixture.detectChanges();

    expect(spyOnGa).toHaveBeenCalledWith(action, 'test-4', undefined, undefined, undefined);
  });

  it('should grab gaCategory and pass to event trigger', () => {
    const ga: GoogleAnalyticsService = TestBed.inject(GoogleAnalyticsService),
      action = 'action-t',
      spyOnGa = spyOn(ga, 'event'),
      input = fixture.debugElement.query((e) =>
        (e.nativeElement as HTMLButtonElement).classList.contains('test-category'),
      );

    host.gaAction = action;
    fixture.detectChanges();
    input.nativeElement.click();
    fixture.detectChanges();

    expect(spyOnGa).toHaveBeenCalledWith(action, 'test-4', undefined, undefined, undefined);
  });

  it('should grab gaLabel and pass to event trigger', () => {
    const ga: GoogleAnalyticsService = TestBed.inject(GoogleAnalyticsService),
      action = 'action-t',
      label = 'label-t',
      spyOnGa = spyOn(ga, 'event'),
      input = fixture.debugElement.query((e) =>
        (e.nativeElement as HTMLButtonElement).classList.contains('test-category'),
      );

    host.gaAction = action;
    host.gaLabel = label;
    fixture.detectChanges();
    input.nativeElement.click();
    fixture.detectChanges();

    expect(spyOnGa).toHaveBeenCalledWith(action, 'test-4', label, undefined, undefined);
  });

  it('should grab label and pass to event trigger', () => {
    const ga: GoogleAnalyticsService = TestBed.inject(GoogleAnalyticsService),
      action = 'action-t',
      label = 'label-t',
      spyOnGa = spyOn(ga, 'event'),
      input = fixture.debugElement.query((e) =>
        (e.nativeElement as HTMLButtonElement).classList.contains('test-category'),
      );

    host.gaAction = action;
    host.label = label;
    fixture.detectChanges();
    input.nativeElement.click();
    fixture.detectChanges();

    expect(spyOnGa).toHaveBeenCalledWith(action, 'test-4', label, undefined, undefined);
  });

  it('should grab gaValue and pass to event trigger', () => {
    const ga: GoogleAnalyticsService = TestBed.inject(GoogleAnalyticsService),
      action = 'action-t',
      value = 40,
      spyOnGa = spyOn(ga, 'event'),
      input = fixture.debugElement.query((e) =>
        (e.nativeElement as HTMLButtonElement).classList.contains('test-category'),
      );

    host.gaAction = action;
    host.gaValue = value;
    fixture.detectChanges();
    input.nativeElement.click();
    fixture.detectChanges();

    expect(spyOnGa).toHaveBeenCalledWith(action, 'test-4', undefined, value, undefined);
  });

  it('should grab gaInteraction and pass to event trigger', () => {
    const ga: GoogleAnalyticsService = TestBed.inject(GoogleAnalyticsService),
      action = 'action-t',
      gaInteraction = true,
      spyOnGa = spyOn(ga, 'event'),
      input = fixture.debugElement.query((e) =>
        (e.nativeElement as HTMLButtonElement).classList.contains('test-category'),
      );

    host.gaAction = action;
    host.gaInteraction = gaInteraction;
    fixture.detectChanges();
    input.nativeElement.click();
    fixture.detectChanges();

    expect(spyOnGa).toHaveBeenCalledWith(action, 'test-4', undefined, undefined, gaInteraction);
  });
});

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ga-input-host',
  template: `<input google-analytics gaEvent="teste" gaAction="teste" gaBind="focus" />`,
  imports: [GoogleAnalyticsDirective],
})
class InputHostComponent {}

describe('GaEventDirectiveWithInput', () => {
  let gaEvent: GoogleAnalyticsDirective, fixture: ComponentFixture<InputHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InputHostComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputHostComponent);
    fixture.detectChanges();
    gaEvent = fixture.debugElement.query(By.directive(GoogleAnalyticsDirective)).injector.get(GoogleAnalyticsDirective);
  });

  // it('should update gaBind when input is updated', () => {
  //   // gaEventFormInput.gaBind = 'click';
  //   expect(gaEvent.gaBind()).toBe('click');
  // });

  // it('should use `focus` as a default gaBind', () => {
  //   expect(gaEvent.gaBind()).toBe('focus');
  // });

  it('should call `GoogleAnalyticsService.event()` on trigger focus at input', () => {
    const ga: GoogleAnalyticsService = TestBed.inject(GoogleAnalyticsService);
    const spyOnGa = spyOn(ga, 'event');
    const input = fixture.debugElement.query((e) => e.name === 'input');

    fixture.detectChanges();
    input.nativeElement.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();

    expect(spyOnGa).toHaveBeenCalledWith('teste', undefined, undefined, undefined, undefined);
  });
});
