import { Injectable } from '@nestjs/common';
import { LogService, AccessContext } from '@ocw/api-core';

export class SystemSetting {
  setting_key: string;
  setting_value: string;
}

@Injectable()
export class SystemSettingAccess {
  constructor(private readonly logService: LogService) {}

  async getSetting(
    settingKey: string,
    accessContext: AccessContext
  ): Promise<string> {
    const result = await accessContext.knex.raw(
      ` SELECT setting_value 
   FROM system_setting 
   WHERE setting_key = ?  
  ; `,
      [settingKey]
    );
    this.logService.log(result, 'SystemSettingAccess.getSetting');
    if (result.rows) {
      return result.rows[0].setting_value;
    } else {
      return result[0].setting_value;
    }
  }
}
