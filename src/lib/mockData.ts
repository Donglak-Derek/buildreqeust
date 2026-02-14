import { Item, BuildRequest } from './types';

export const MOCK_ITEMS: Record<string, Item> = {
    '123.456.78': {
        articleNumber: '123.456.78',
        name: 'LACK Side Table, White',
        warehouseLocation: 'Aisle 12, Bin 04',
        stockStatus: 'In Stock',
    },
    '987.654.32': {
        articleNumber: '987.654.32',
        name: 'BILLY Bookcase, Birch',
        warehouseLocation: 'Aisle 05, Bin 12',
        stockStatus: 'Low Stock',
    },
    '456.789.01': {
        articleNumber: '456.789.01',
        name: 'MALM Bed Frame, Black-Brown',
        warehouseLocation: 'Aisle 22, Bin 08',
        stockStatus: 'In Stock',
    },
    '111.222.33': {
        articleNumber: '111.222.33',
        name: 'POÄNG Armchair, Beige',
        warehouseLocation: 'Aisle 01, Bin 15',
        stockStatus: 'Out of Stock',
    },
};

export async function fetchItemDetails(articleNumber: string): Promise<Item | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return MOCK_ITEMS[articleNumber] || null;
}
