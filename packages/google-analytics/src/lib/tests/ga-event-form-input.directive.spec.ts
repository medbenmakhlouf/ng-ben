import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { GaEventFormInputDirective } from '../ga-event-form-input.directive';
import { GaEventDirective } from '../ga-event.directive';
import { GoogleAnalyticsService } from '../google-analytics.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ga-host',
  template: `<input gaEvent="teste" gaAction="teste" />`,
  imports: [GaEventFormInputDirective, GaEventDirective],
})
class HostComponent {}

describe('GaEventFormInputDirective', () => {
  let gaEventFormInput: GaEventFormInputDirective, gaEvent: GaEventDirective, fixture: ComponentFixture<HostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    gaEvent = fixture.debugElement.query(By.directive(GaEventDirective)).injector.get(GaEventDirective);
    gaEventFormInput = fixture.debugElement
      .query(By.directive(GaEventFormInputDirective))
      .injector.get(GaEventFormInputDirective);
  });

  it('should create an instance', () => {
    expect(gaEventFormInput).toBeTruthy();
  });

  it('should update gaBind when input is updated', () => {
    gaEventFormInput.gaBind = 'click';
    expect(gaEvent.gaBind).toBe('click');
  });

  it('should use `focus` as a default gaBind', () => {
    expect(gaEvent.gaBind).toBe('focus');
  });

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
