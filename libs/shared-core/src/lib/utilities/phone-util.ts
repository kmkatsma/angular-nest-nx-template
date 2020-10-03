export class PhoneUtil {
  static trimPhoneNumberString(phone: any) {
    for (let i = phone.length - 1; i >= 0; i--) {
      if (phone[i] === '_' || phone[i] === '-') {
        phone = phone.slice(0, -1);
      }
      if (!isNaN(phone[i])) {
        return phone;
      }
    }
  }
}
