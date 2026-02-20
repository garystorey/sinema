import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should default safely when not in a browser context', () => {
    const setAttribute = jasmine.createSpy('setAttribute');

    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: DOCUMENT, useValue: { body: { setAttribute } } },
      ],
    });

    const service = TestBed.inject(ThemeService);

    expect(service.current()).toBe('default');
    expect(setAttribute).not.toHaveBeenCalled();
    expect(() => service.set('night-owl')).not.toThrow();
    expect(setAttribute).not.toHaveBeenCalled();
  });

  it('should ignore storage failures and still apply theme to document', () => {
    TestBed.configureTestingModule({});
    const setItemSpy = spyOn(Storage.prototype, 'setItem').and.throwError('blocked');

    const service = TestBed.inject(ThemeService);

    expect(() => service.set('monokai')).not.toThrow();
    expect(service.current()).toBe('monokai');
    expect(setItemSpy).toHaveBeenCalledWith('app-theme', 'monokai');
    expect(document.body.getAttribute('data-theme')).toBe('monokai');
  });
});
