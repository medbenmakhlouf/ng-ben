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
    @let d1 = { action: action || 'test-1', label: gaLabel || label, value: value, interaction };
    <button google-analytics [data]="d1" class="test-1 test-click">Button 1</button>
    @let d2 = { action: action || 'test-2', label: gaLabel || label, value: value, interaction };
    <button google-analytics [data]="d2" class="test-2 test-focus" bindTo="focus">Button 2</button>
    @let d3 = { action: action || 'test-3', label: gaLabel || label, value: value, interaction };
    <button google-analytics [data]="d3" class="test-3 test-blur" bindTo="blur">Button 3</button>
    @let d4 = { action, label: gaLabel || label, value, interaction, category: 'test-4' };
    <button google-analytics [data]="d4" class="test-4 test-category">Button 4</button>
    @let d5 = { action: action || 'test-5', label: gaLabel || label, value: value, interaction };
    <button google-analytics [data]="d5" class="test-5 test-custom" bindTo="custom">Button 5</button>
  `,
  imports: [GoogleAnalyticsDirective],
})
class HostComponent {
  action!: GaActionEnum | string;
  gaLabel!: string;
  label!: string;
  value!: number;
  interaction!: boolean;
}

describe('GoogleAnalyticDirective', () => {
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

    expect(spyOnGa).toHaveBeenCalledWith({
      action: 'test-1',
      label: undefined,
      value: undefined,
      interaction: undefined,
    });
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

    expect(spyOnGa).toHaveBeenCalledWith({
      action: 'test-2',
      label: undefined,
      value: undefined,
      interaction: undefined,
    });
  });

  it('should call `trigger on blur event`', () => {
    const ga: GoogleAnalyticsService = TestBed.inject(GoogleAnalyticsService),
      spyOnGa = spyOn(ga, 'event'),
      input = fixture.debugElement.query((e) => (e.nativeElement as HTMLButtonElement).classList.contains('test-blur'));

    fixture.detectChanges();
    input.nativeElement.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();

    expect(spyOnGa).toHaveBeenCalledWith({
      action: 'test-3',
      label: undefined,
      value: undefined,
      interaction: undefined,
    });
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

    expect(spyOnGa).toHaveBeenCalledWith({
      action: 'test-5',
      label: undefined,
      value: undefined,
      interaction: undefined,
    });
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

    host.action = action;
    fixture.detectChanges();
    input.nativeElement.click();
    fixture.detectChanges();

    expect(spyOnGa).toHaveBeenCalledWith({
      action,
      label: undefined,
      value: undefined,
      interaction: undefined,
      category: 'test-4',
    });
  });

  it('should grab gaEvent and pass to event trigger', () => {
    const ga: GoogleAnalyticsService = TestBed.inject(GoogleAnalyticsService),
      action = 'action-t',
      spyOnGa = spyOn(ga, 'event'),
      input = fixture.debugElement.query((e) =>
        (e.nativeElement as HTMLButtonElement).classList.contains('test-category'),
      );

    host.action = action;
    fixture.detectChanges();
    input.nativeElement.click();
    fixture.detectChanges();

    expect(spyOnGa).toHaveBeenCalledWith({
      action,
      label: undefined,
      value: undefined,
      interaction: undefined,
      category: 'test-4',
    });
  });

  it('should grab gaCategory and pass to event trigger', () => {
    const ga: GoogleAnalyticsService = TestBed.inject(GoogleAnalyticsService),
      action = 'action-t',
      spyOnGa = spyOn(ga, 'event'),
      input = fixture.debugElement.query((e) =>
        (e.nativeElement as HTMLButtonElement).classList.contains('test-category'),
      );

    host.action = action;
    fixture.detectChanges();
    input.nativeElement.click();
    fixture.detectChanges();

    expect(spyOnGa).toHaveBeenCalledWith({
      action,
      label: undefined,
      value: undefined,
      interaction: undefined,
      category: 'test-4',
    });
  });

  it('should grab gaLabel and pass to event trigger', () => {
    const ga: GoogleAnalyticsService = TestBed.inject(GoogleAnalyticsService),
      action = 'action-t',
      label = 'label-t',
      spyOnGa = spyOn(ga, 'event'),
      input = fixture.debugElement.query((e) =>
        (e.nativeElement as HTMLButtonElement).classList.contains('test-category'),
      );

    host.action = action;
    host.gaLabel = label;
    fixture.detectChanges();
    input.nativeElement.click();
    fixture.detectChanges();

    expect(spyOnGa).toHaveBeenCalledWith({
      action,
      label,
      value: undefined,
      interaction: undefined,
      category: 'test-4',
    });
  });

  it('should grab label and pass to event trigger', () => {
    const ga: GoogleAnalyticsService = TestBed.inject(GoogleAnalyticsService),
      action = 'action-t',
      label = 'label-t',
      spyOnGa = spyOn(ga, 'event'),
      input = fixture.debugElement.query((e) =>
        (e.nativeElement as HTMLButtonElement).classList.contains('test-category'),
      );

    host.action = action;
    host.label = label;
    fixture.detectChanges();
    input.nativeElement.click();
    fixture.detectChanges();

    expect(spyOnGa).toHaveBeenCalledWith({
      action,
      label,
      value: undefined,
      interaction: undefined,
      category: 'test-4',
    });
  });

  it('should grab gaValue and pass to event trigger', () => {
    const ga: GoogleAnalyticsService = TestBed.inject(GoogleAnalyticsService),
      action = 'action-t',
      value = 40,
      spyOnGa = spyOn(ga, 'event'),
      input = fixture.debugElement.query((e) =>
        (e.nativeElement as HTMLButtonElement).classList.contains('test-category'),
      );

    host.action = action;
    host.value = value;
    fixture.detectChanges();
    input.nativeElement.click();
    fixture.detectChanges();

    expect(spyOnGa).toHaveBeenCalledWith({
      action,
      label: undefined,
      value,
      interaction: undefined,
      category: 'test-4',
    });
  });

  it('should grab gaInteraction and pass to event trigger', () => {
    const ga: GoogleAnalyticsService = TestBed.inject(GoogleAnalyticsService),
      action = 'action-t',
      gaInteraction = true,
      spyOnGa = spyOn(ga, 'event'),
      input = fixture.debugElement.query((e) =>
        (e.nativeElement as HTMLButtonElement).classList.contains('test-category'),
      );

    host.action = action;
    host.interaction = gaInteraction;
    fixture.detectChanges();
    input.nativeElement.click();
    fixture.detectChanges();

    expect(spyOnGa).toHaveBeenCalledWith({
      action,
      label: undefined,
      value: undefined,
      interaction: gaInteraction,
      category: 'test-4',
    });
  });
});

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ga-input-host',
  template: `<input google-analytics [data]="{ action: 'teste' }" bindTo="focus" />`,
  imports: [GoogleAnalyticsDirective],
})
class InputHostComponent {}

describe('GoogleAnalyticDirectiveWithInput', () => {
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

    expect(spyOnGa).toHaveBeenCalledWith({ action: 'teste' });
  });
});
