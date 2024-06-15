import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StringUtilService {
  constructor() {}

  toCamelCase(s: string): string {
    s = s.replace(/[^a-zA-Z0-9]/g, ' ');
    let words: string[] = s.split(' ');
    let key: string = words.map(word => word[0].toUpperCase() + (word.length > 1 ? word.slice(1).toLocaleLowerCase() : '')).join('');
    key = key[0].toLowerCase() + (key.length > 1 ? key.slice(1) : '');
    console.log(key);
    return key;
  }
}
