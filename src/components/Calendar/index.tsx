import React from "react";

const Calendar: React.FC = () => {
  return (
    <div className="mx-auto max-w-3xl px-6 lg:px-8 mb-12">
      <div className="bg-blue/20 border border-pink/30 rounded-lg p-8 backdrop-blur-sm">
        <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
          <svg
            className="w-6 h-6 text-pink"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Adoptium Community Calendar
        </h3>
        <p className="text-grey mb-6 leading-relaxed">
          Stay up to date with the Adoptium Community meetings, catch up with
          community members, and share your ideas and work-in-progress.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="https://calendar.google.com/calendar/embed?src=c_uannoums5ho0olhjk3ulecdkbc%40group.calendar.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 bg-pink text-white font-semibold rounded-lg hover:bg-pink/80 transform hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink focus:ring-offset-2 focus:ring-offset-purple"
          >
            View Calendar
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
          <a
            href="https://calendar.google.com/calendar/ical/c_uannoums5ho0olhjk3ulecdkbc%40group.calendar.google.com/public/basic.ics"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-pink/60 text-pink font-semibold rounded-lg hover:border-pink hover:bg-pink hover:text-white transform hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink focus:ring-offset-2 focus:ring-offset-purple"
          >
            Subscribe to iCal
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </a>
        </div>
        <p className="text-sm text-grey/80 mt-4 leading-relaxed">
          <strong className="text-white">What you'll find:</strong> What you
          will find: Community Calls: General, Security, AQAvit, Website, other
          technical team, Release dates, and other community online meetings.
        </p>
      </div>
    </div>
  );
};

export default Calendar;
