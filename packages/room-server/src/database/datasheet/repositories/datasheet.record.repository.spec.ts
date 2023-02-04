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
import { DatasheetRecordRepository } from './datasheet.record.repository';
import { DatasheetRecordEntity } from '../entities/datasheet.record.entity';
import { DeepPartial } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ILinkIds } from '@apitable/core';
import { DatabaseConfigService } from 'shared/services/config/database.config.service';
import { ConfigModule } from '@nestjs/config';

describe('DatasheetRepositoryTest', () => {
  let module: TestingModule;
  let repository: DatasheetRecordRepository;
  let entity: DatasheetRecordEntity;

  beforeAll(async() => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
          useClass: DatabaseConfigService,
        }),
        TypeOrmModule.forFeature([DatasheetRecordRepository]),
      ],
    }).compile();
    repository = module.get<DatasheetRecordRepository>(DatasheetRecordRepository);
  });

  beforeEach(async() => {
    const datasheetRecord: DeepPartial<DatasheetRecordEntity> = {
      dstId: 'datasheetId',
      recordId: 'recordId',
      data: {
        fieldId: ['linkRecordId'],
      },
    };
    const record = repository.create(datasheetRecord);
    entity = await repository.save(record);
  });

  afterEach(async() => {
    await repository.delete(entity.id);
    await repository.manager.connection.close();
  });

  it('should get revisions by datasheet ids', async() => {
    const linkIds = await repository.selectLinkRecordIdsByRecordIdAndFieldId(entity.dstId, entity.recordId, 'fieldId');
    expect((linkIds as ILinkIds)?.length).toEqual(1);
    expect(linkIds![0]).toEqual('linkRecordId');
  });
});