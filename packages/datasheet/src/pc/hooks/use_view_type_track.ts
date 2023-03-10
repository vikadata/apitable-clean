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

import { tracker } from 'pc/utils/tracker';
import { TrackEvents, Selectors, ViewType } from '@apitable/core';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const viewMap = {
  1: 'Table View',
  2: 'Kanban View',
  3: 'Gallery View',
  4: 'Form',
  5: 'Calendar View',
  6: 'Gantt View',
  7: 'Org Chart View',
};
export const useViewTypeTrack = () => {
  const { formId, mirrorId, datasheetId } = useSelector(state => state.pageParams);
  const currentView = useSelector(state => Selectors.getCurrentView(state));

  useEffect(() => {
    if (currentView?.id) {
      tracker.track(TrackEvents.ViewsInfo, {
        viewName: viewMap[currentView.type]
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mirrorId, datasheetId, currentView?.id]);

  useEffect(() => {
    if (formId) {
      tracker.track(TrackEvents.ViewsInfo, {
        viewName: viewMap[ViewType.Form]
      });
    }
  }, [formId]);
};
