export const CATEGORY = 'category';
export const AUTHOR = 'author';
export const PUBLISHER = 'publisher';
export const ALL = [CATEGORY, AUTHOR, PUBLISHER];

export function getPluralForm(value: string): string {
  switch (value) {
    case CATEGORY:
      return 'categories';
    case AUTHOR:
      return 'authors';
    case PUBLISHER:
      return 'publishers';
    default:
      return '';
  }
}
