import { Category, Item, Trip, kebab } from './model';

function item(category: Category, name: string, packed = false, quantity = 1): Item {
  return { id: kebab(name), name, quantity, category, packed };
}

/** Three trips shown on first launch, when nothing is stored yet. */
export function seedTrips(): Trip[] {
  return [
    {
      id: 'lisbon',
      name: 'Lisbon, long weekend',
      startDate: '2026-09-25',
      nights: 3,
      items: [
        item('Documents', 'Passport', true),
        item('Documents', 'Boarding passes', true),
        item('Clothes', 'T-shirts', true, 4),
        item('Clothes', 'Swim shorts'),
        item('Clothes', 'Light jacket'),
        item('Tech', 'Charger', true),
        item('Tech', 'EU plug adapter'),
        item('Tech', 'Headphones'),
        item('Toiletries', 'Toothbrush', true),
        item('Toiletries', 'Sunscreen'),
        item('Other', 'Book', true),
      ],
    },
    {
      id: 'tatras',
      name: 'Hiking, Tatras',
      startDate: '2026-10-10',
      nights: 5,
      items: [
        item('Documents', 'ID card', true),
        item('Documents', 'Mountain insurance', true),
        item('Clothes', 'Hiking boots', true),
        item('Clothes', 'Merino socks', true, 5),
        item('Clothes', 'Rain shell', true),
        item('Clothes', 'Fleece', true),
        item('Clothes', 'Hiking trousers', true, 2),
        item('Toiletries', 'Blister plasters', true),
        item('Toiletries', 'Sunscreen', true),
        item('Tech', 'Head torch', true),
        item('Tech', 'Power bank', true),
        item('Other', 'Trail map', true),
        item('Other', 'Water bottle', true, 2),
        item('Other', 'Trekking poles', true),
      ],
    },
    {
      id: 'berlin',
      name: 'Berlin, conference',
      startDate: '2026-11-02',
      nights: 2,
      items: [
        item('Documents', 'Passport'),
        item('Documents', 'Conference badge'),
        item('Clothes', 'Shirts', false, 3),
        item('Clothes', 'Blazer'),
        item('Tech', 'Laptop'),
        item('Tech', 'Laptop charger'),
        item('Toiletries', 'Toothbrush'),
        item('Other', 'Business cards'),
      ],
    },
  ];
}
