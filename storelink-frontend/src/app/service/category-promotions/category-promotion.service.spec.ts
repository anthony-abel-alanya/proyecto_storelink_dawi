import { TestBed } from '@angular/core/testing';

import { CategoryPromotionService } from './category-promotion.service';

describe('CategoryPromotionService', () => {
  let service: CategoryPromotionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryPromotionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
