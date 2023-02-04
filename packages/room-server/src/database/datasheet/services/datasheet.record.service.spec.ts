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

import { Test, TestingModule } from '@nestjs/testing';
import { DatasheetRecordService } from './datasheet.record.service';
import { DatasheetRecordRepository } from '../repositories/datasheet.record.repository';
import { RecordCommentService } from './record.comment.service';
import { DatasheetChangesetService } from './datasheet.changeset.service';

describe('DatasheetRecordServiceTest', () => {
  let module: TestingModule;
  let datasheetRecordRepository: DatasheetRecordRepository;
  let service: DatasheetRecordService;

  beforeAll(async() => {
    module = await Test.createTestingModule({
      providers: [
        DatasheetRecordRepository,
        {
          provide: RecordCommentService,
          useValue: {},
        },
        {
          provide: DatasheetChangesetService,
          useValue: {},
        },
        DatasheetRecordService,
      ]
    }).compile();
    datasheetRecordRepository = module.get<DatasheetRecordRepository>(DatasheetRecordRepository);
    service = module.get<DatasheetRecordService>(DatasheetRecordService);
  });

  it('should be return linkIds', async() => {
    jest.spyOn(datasheetRecordRepository, 'selectLinkRecordIdsByRecordIdAndFieldId')
      .mockResolvedValue(['linkRecordId']);
    const linkRecordIds = await service.getLinkRecordIdsByRecordIdAndFieldId('dstId', 'recordId', 'fieldId');
    expect(linkRecordIds.length).toEqual(1);
    expect(linkRecordIds[0]).toEqual('linkRecordId');
  });
});