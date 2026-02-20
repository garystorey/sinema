import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    TestBed.configureTestingModule({});
    const service = TestBed.inject(StorageService);

    expect(service).toBeTruthy();
  });

  it('should return safe defaults when running outside browser', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });
    const service = TestBed.inject(StorageService);

    expect(service.getItem('any-key')).toBeNull();
    expect(service.getFavorites()).toEqual([]);
    expect(service.isFavorite('movie-id')).toBeFalse();
    expect(() => service.setItem('any-key', 'any-value')).not.toThrow();
    expect(() => service.removeItem('any-key')).not.toThrow();
    expect(() => service.clear()).not.toThrow();
  });

  it('should handle storage errors when localStorage is disabled', () => {
    TestBed.configureTestingModule({});
    const service = TestBed.inject(StorageService);
    const getItemSpy = spyOn(Storage.prototype, 'getItem').and.throwError('blocked');
    const setItemSpy = spyOn(Storage.prototype, 'setItem').and.throwError('blocked');

    expect(service.getItem('key')).toBeNull();
    expect(service.getFavorites()).toEqual([]);
    expect(() => service.setItem('key', 'value')).not.toThrow();
    expect(setItemSpy).toHaveBeenCalled();
    expect(getItemSpy).toHaveBeenCalled();
  });
});
