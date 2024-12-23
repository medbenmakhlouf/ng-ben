import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GaEventFormInputDirective } from '../ga-event-form-input.directive';
import { GaEventDirective } from '../ga-event.directive';
import { GaEventCategoryDirective } from '../ga-event-category.directive';
import { NGX_GOOGLE_ANALYTICS_SETTINGS_TOKEN } from '../tokens';
import { GoogleAnalyticsService } from '../google-analytics.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ga-host',
  template: `<input gaEvent="teste" />`,
  imports: [GaEventFormInputDirective, GaEventDirective],
})
class HostComponent {}

describe('GaEventFormInputDirective', () => {
  let gaEventFormInput: GaEventFormInputDirective,
    gaEvent: GaEventDirective,
    gaCategory: GaEventCategoryDirective,
    fixture: ComponentFixture<HostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  beforeEach(() => {
    gaCategory = new GaEventCategoryDirective();
    gaEvent = new GaEventDirective(
      gaCategory,
      TestBed.inject(GoogleAnalyticsService),
      TestBed.inject(NGX_GOOGLE_ANALYTICS_SETTINGS_TOKEN),
      fixture.elementRef,
    );
    gaEventFormInput = new GaEventFormInputDirective(gaEvent);
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
    const ga: GoogleAnalyticsService = TestBed.inject(GoogleAnalyticsService),
      spyOnGa = spyOn(ga, 'event'),
      input = fixture.debugElement.query((e) => e.name === 'input');

    fixture.detectChanges();
    input.nativeElement.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();

    expect(spyOnGa).toHaveBeenCalledWith('teste', undefined, undefined, undefined, undefined);
  });
});
