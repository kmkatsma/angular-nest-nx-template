import { Injectable } from '@nestjs/common';

export class StringFormatUtil {
  static capitalize(value: string): string {
    if (value) {
      return value.toUpperCase();
    } else {
      return value;
    }
  }

  static capitalizeFields(object: any, fields: string[]) {
    fields.forEach(field => {
      object[field] = this.capitalize(object[field]);
    });
  }

  static capitalizeAllFields(object: any) {
    for (const fieldKey of Object.keys(object)) {
      object[fieldKey] = this.capitalize(object[fieldKey]);
    }
  }
}
