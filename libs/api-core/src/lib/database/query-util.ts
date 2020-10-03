export class QueryUtil {
    
    static buildParms(list: any[]) {
        if (!list) {
          return '';
        }
        let parms = '';
        for (let i = 0; i < list.length; i++) {
          if (parms.length > 0) {
            parms += ',';
          }
          parms += '?';
        }
        return parms;
      }


    static addWhereIn(ids: string[], parms: string[], columnName: string) {
        let sql = '';
        const parmsString = this.buildParms(ids);
        if (ids && ids.length > 0) {
          sql = sql + ` AND ${columnName} in (${parmsString}) `;
          parms.push(...ids);
        }
        return sql;
      }
    
      static addWhereNumIn(ids: number[], parms: string[], columnName: string) {
        let sql = '';
        const parmsString = this.buildParms(ids);
        if (ids && ids.length > 0) {
          sql = sql + ` AND ${columnName} in (${parmsString}) `;
          parms.push(...ids.map(String));
        }
        return sql;
      }

      
  static addWhere(
    ids: string[],
    parms: string[],
    columnName: string,
    startParentheses?: boolean
  ) {
    let sql = '';
    const parmsString = QueryUtil.buildParms(ids);
    if (ids && ids.length > 0) {
      if (startParentheses) {
        sql = sql + ` AND ( ${columnName} in (${parmsString}) `;
      } else {
        sql = sql + ` AND ${columnName} in (${parmsString}) `;
      }
      parms.push(...ids);
    }
    return sql;
  }

  static addWhereNum(
    ids: number[],
    parms: string[],
    columnName: string,
    startParentheses?: boolean
  ) {
    let sql = '';
    const parmsString = QueryUtil.buildParms(ids);
    if (ids && ids.length > 0) {
      if (startParentheses) {
        sql = sql + ` AND ( ${columnName} in (${parmsString}) `;
      } else {
        sql = sql + ` AND ${columnName} in (${parmsString}) `;
      }
      parms.push(...ids.map(String));
    }
    return sql;
  }
}