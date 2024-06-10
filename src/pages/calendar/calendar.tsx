import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import './index.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { formatTasks } from '../../utils/common/function';
import { Popover, Text } from '@mantine/core';
import { TableMenu } from '../../layout';

const localizer = momentLocalizer(moment);

const MyCalendar = ({ taskList, handleClickTask }: any) => {
  const events = formatTasks(taskList);

  const CustomEvent = (event: any) => {
    return (
      // <Popover width={200} position="bottom" withArrow shadow="md">
      //   <Popover.Target>
      <div
        className="flex flex-row"
        onClick={() => {
          const { title, eventStart, eventEnd, ...restTask } =
            event && event.event
              ? event.event
              : { title: null, eventStart: null, eventEnd: null };
          restTask && handleClickTask(restTask);
        }}
      >
        <div className="flex flex-col items-center ml-5">
          <strong>{event.title}</strong>
          <p>{event?.event?.assigned?.name}</p>
        </div>
      </div>
      //   </Popover.Target>
      //   <Popover.Dropdown>
      //     <Text size="xs">{event?.event?.taskDescription}</Text>
      //   </Popover.Dropdown>
      // </Popover>
    );
  };

  return (
    <div className="App">
      <Calendar
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={events}
        style={{ height: '100vh' }}
        components={{
          event: CustomEvent,
        }}
      />
    </div>
  );
};

export default MyCalendar;
