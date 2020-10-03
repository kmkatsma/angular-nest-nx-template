import 'reflect-metadata';
import { OutputUtil } from './output-util';
import { ReportOutput, OutputValue } from './report-output';
import { LogService } from '../logging/log.service';

describe('OutputUtilSpec', () => {
  beforeEach(async () => {});

  describe('convertOutputToAoA', () => {
    it('should load AoA correctly', async () => {
      // arrange
      const reportOutput = new ReportOutput();
      reportOutput.currentRow = 5;
      reportOutput.output.push(new OutputValue(1, 1, '11'));
      reportOutput.output.push(new OutputValue(1, 3, '13'));
      reportOutput.output.push(new OutputValue(2, 1, '21'));
      reportOutput.output.push(new OutputValue(4, 2, '42'));

      // act
      const aoa = OutputUtil.convertOutputToAoA(reportOutput);
      console.log('aoa', aoa);
      LogService.prettyPrint(aoa);

      // assert
      expect(aoa.length).toEqual(5);
      expect(aoa[0][0]).toEqual('11');
      expect(aoa[0][2]).toEqual('13');
      expect(aoa[1][0]).toEqual('21');
      expect(aoa[3][1]).toEqual('42');
    });
  });
});
