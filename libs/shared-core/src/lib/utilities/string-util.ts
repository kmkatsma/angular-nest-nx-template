export class StringUtil {
  static trimPlaceHolderString(phone: any) {
    for (let i = phone.length - 1; i >= 0; i--) {
      if (phone[i] === '_' || phone[i] === '-') {
        phone = phone.slice(0, -1);
      }
      if (!isNaN(phone[i])) {
        return phone;
      }
    }
  }

  static undefinedToEmpty(value: string) {
    if (!value) {
      return '';
    }
    return value;
  }

  static formatYNField(value: string) {
    if (!value) {
      return '';
    } else {
      if (value.toUpperCase() === 'Y') {
        return 'Yes';
      }
      if (value.toUpperCase() === 'N') {
        return 'No';
      }
      return '';
    }
  }

  static formatYNFieldFromBoolean(value: boolean) {
    if (value === undefined || value === null) {
      return 'Unknown';
    } else {
      if (value) {
        return 'Yes';
      } else {
        return 'No';
      }
    }
  }

  static formatCurrencyField(value: number) {
    if (!value) {
      return '';
    } else {
      return value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
    }
  }

  static formatPhone(number: string) {
    if (!number) {
      return '';
    }
    if (number.length === 10) {
      return (
        number.substr(0, 3) +
        '-' +
        number.substr(3, 3) +
        '-' +
        number.substr(6, 4)
      );
    }
    return number;
  }

  static replaceDashes(str: string) {
    return str.replace(/-/g, '');
  }

  static formatSSN(number: string) {
    if (!number) {
      return;
    }
    if (number.length === 9) {
      return (
        number.substr(0, 3) +
        '-' +
        number.substr(3, 2) +
        '-' +
        number.substr(5, 4)
      );
    }
    return number;
  }
}
