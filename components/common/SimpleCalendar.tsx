
import React, { useState } from 'react';
import { JobStatus, CalendarEvent } from '../../types';
import moment from 'moment';
import { ChevronLeft, ChevronRight } from 'lucide-react';


interface SimpleCalendarProps {
    events: CalendarEvent[];
    onSelectEvent: (event: CalendarEvent) => void;
}

const getEventColor = (status: JobStatus) => {
    switch(status) {
        case JobStatus.IN_PROGRESS: return 'bg-indigo-500 hover:bg-indigo-600';
        case JobStatus.COMPLETED: return 'bg-green-500 hover:bg-green-600';
        case JobStatus.SCHEDULED:
        default:
            return 'bg-blue-500 hover:bg-blue-600';
    }
}

const MonthView: React.FC<{ month: number, year: number, events: CalendarEvent[], onSelectEvent: (event: CalendarEvent) => void }> = ({ month, year, events, onSelectEvent }) => {
    const monthDate = moment({ year, month });
    const startOfMonth = monthDate.clone().startOf('month');
    const endOfMonth = monthDate.clone().endOf('month');
    const startOfCalendar = startOfMonth.clone().startOf('week');
    const endOfCalendar = endOfMonth.clone().endOf('week');

    const days = [];
    let day = startOfCalendar.clone();
    while (day <= endOfCalendar) {
        days.push(day.clone());
        day.add(1, 'day');
    }

    const weekdays = moment.weekdaysShort();

    return (
        <div className="border rounded-lg p-2 bg-gray-50">
            <h3 className="text-center font-bold text-gray-700 font-display mb-2">{monthDate.format('MMMM')}</h3>
            <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-500 text-xs">
                {weekdays.map(weekday => (
                    <div key={weekday} className="py-1">{weekday}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-px bg-gray-200 border-l border-r">
                {days.map((d, index) => {
                    const isCurrentMonth = d.isSame(monthDate, 'month');
                    const isToday = d.isSame(moment(), 'day');
                    const dayEvents = events.filter(e => moment(e.start).isSame(d, 'day'));

                    return (
                        <div key={index} className={`relative min-h-[6rem] p-1 pt-6 ${isCurrentMonth ? 'bg-white' : 'bg-gray-100'}`}>
                            <span className={`absolute top-1 right-1 text-xs font-semibold flex items-center justify-center w-5 h-5 ${isCurrentMonth ? 'text-gray-700' : 'text-gray-400'} ${isToday ? 'bg-brand-primary text-white rounded-full' : ''}`}>
                                {d.format('D')}
                            </span>
                            <div className="space-y-1">
                                {dayEvents.slice(0, 2).map((event, eventIndex) => (
                                    <div 
                                        key={eventIndex}
                                        onClick={() => onSelectEvent(event)}
                                        className={`w-full text-[10px] rounded-sm cursor-pointer truncate p-0.5 text-white ${getEventColor(event.resource.status)}`}
                                        title={event.title}
                                    >
                                        {event.resource.customer.name.split(' ')[0]}
                                    </div>
                                ))}
                                {dayEvents.length > 2 && <div className="text-xs text-gray-500 text-center">+ {dayEvents.length - 2} more</div>}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="h-px bg-gray-200"></div>
        </div>
    );
};


const SimpleCalendar: React.FC<SimpleCalendarProps> = ({ events, onSelectEvent }) => {
    const [currentYear, setCurrentYear] = useState(moment().year());
    
    const nextYear = () => setCurrentYear(currentYear + 1);
    const prevYear = () => setCurrentYear(currentYear - 1);

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-6">
                <button onClick={prevYear} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <ChevronLeft />
                </button>
                <h2 className="text-2xl font-bold text-gray-800 font-display">
                    {currentYear}
                </h2>
                <button onClick={nextYear} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <ChevronRight />
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 12 }).map((_, monthIndex) => (
                    <MonthView 
                        key={monthIndex}
                        month={monthIndex}
                        year={currentYear}
                        events={events}
                        onSelectEvent={onSelectEvent}
                    />
                ))}
            </div>
        </div>
    );
};

export default SimpleCalendar;