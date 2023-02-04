/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { ICellValue } from '@apitable/core';
import { EntityRepository, In, Repository } from 'typeorm';
import { DatasheetRecordEntity } from '../entities/datasheet.record.entity';

@EntityRepository(DatasheetRecordEntity)
export class DatasheetRecordRepository extends Repository<DatasheetRecordEntity> {
  selectIdsByDstIdAndRecordIds(dstId: string, recordIds: string[]): Promise<string[] | null> {
    return this.find({
      select: ['recordId'],
      where: [{ dstId, recordId: In(recordIds), isDeleted: false }],
    }).then(entities => {
      return entities.map(entity => entity.recordId);
    });
  }

  selectRecordsDataByDstId(dstId: string): Promise<DatasheetRecordEntity[] | undefined> {
    return this.find({
      select: ['recordId', 'data'],
      where: [{ dstId, isDeleted: false }],
    });
  }

  selectRecordsDataByDstIdIgnoreDeleted(dstId: string): Promise<DatasheetRecordEntity[] | undefined> {
    return this.find({
      select: ['recordId', 'data'],
      where: [{ dstId }],
    });
  }

  selectRevisionHistoryByDstIdAndRecordId(dstId: string, recordId: string): Promise<{ revisionHistory: string } | undefined> {
    return this.createQueryBuilder('vdr')
      .select('vdr.revision_history', 'revisionHistory')
      .where('vdr.dst_id = :dstId', { dstId })
      .andWhere('vdr.record_id = :recordId', { recordId })
      .andWhere('vdr.is_deleted = 0')
      .getRawOne<{ revisionHistory: string }>();
  }

  /**
   * Notice: the function aim to find magic link type field's value.
   *
   * If the field is not link type, it should not call this function to get cell value.
   *
   * @param dstId     the selected datasheet
   * @param recordId  the selected record
   * @param fieldId   the selected field
   */
  public async selectLinkRecordIdsByRecordIdAndFieldId(dstId: string, recordId: string, fieldId: string): Promise<ICellValue | undefined> {
    const record = await this.findOne({
      select: ['data'],
      where: {
        dstId,
        recordId,
        isDeleted: false,
      }
    });
    // the record's filed value map
    const data = record?.data;
    return data ? data![fieldId]: null;
  }
}
