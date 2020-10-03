import { DateUtil } from './date-util';

//nx test shared-core --testFile "date-util.spec.ts"
describe('DateUtil', () => {
  describe('shouldCreateDate10DaysInPast', () => {
    it('should should be 10 days', async () => {
      const date = DateUtil.convertDateToGMTTS(new Date(2000, 1, 1));

      const dateFutureDate = DateUtil.addDays(date, 9);
      const newDate = DateUtil.convertTStoGMTDate(dateFutureDate);

      expect(newDate.getMonth()).toEqual(1);
      expect(newDate.getDate()).toEqual(10);
    });
  });

  describe('convertExcelDate', () => {
    it('should convert', async () => {
      const excelTs = 14611;

      //act
      const ts = DateUtil.convertExcelDateToTS(excelTs);
      //assert
      expect(ts).toEqual(-946771200000);
    });
  });

  describe('shouldCreateDate91DaysInPast', () => {
    it('should should be 91 days', async () => {
      const date = DateUtil.convertDateToGMTTS(new Date(2000, 1, 1));

      const dateFutureDate = DateUtil.addDays(date, -91);
      const newDate = DateUtil.convertTStoGMTDate(dateFutureDate);

      expect(newDate.getFullYear()).toEqual(1999);
      expect(newDate.getMonth()).toEqual(10);
      expect(newDate.getDate()).toEqual(2);
    });
  });

  describe('shouldCalculateDateDiff', () => {
    it('should be valid', async () => {
      const date = DateUtil.convertDateToGMTTS(new Date(2000, 1, 1));

      const pastDate = DateUtil.addDays(date, -91);
      let diff = DateUtil.dateDiff('d', pastDate, date);
      expect(diff).toEqual(91);

      const futureDate = DateUtil.addDays(date, 1);
      diff = DateUtil.dateDiff('d', date, futureDate);
      expect(diff).toEqual(1);
    });
  });

  describe('getMonthHistoryInfo', () => {
    it('should populate correctly', async () => {
      const date = new Date(2000, 1, 1);

      const months = DateUtil.getMonthHistoryInfo(date, 12);
      console.log(months);

      //expect(diff).toEqual(91);
      //expect(diff).toEqual(1);
    });
  });
});
