import { CategoryPromotion } from './category-promotion';

describe('CategoryPromotion', () => {
  it('should create an instance object', () => {
    const promotion: CategoryPromotion = {
      id: 1,
      category: { id: 1, name: 'Fruits' },
      discountPercentage: 15,
      startDate: '2025-10-01',
      endDate: '2025-10-15',
      active: true,
    };
    expect(promotion).toBeTruthy();
    expect(promotion.category.name).toBe('Fruits');
  });
});
