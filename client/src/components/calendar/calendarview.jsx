import EventCard from "./eventcard";

function buildMonthDays(activeDate) {
  const date = new Date(activeDate.getFullYear(), activeDate.getMonth(), 1);
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  const days = [];
  for (let index = 0; index < 42; index += 1) {
    const current = new Date(start);
    current.setDate(start.getDate() + index);
    days.push(current);
  }
  return days;
}

export default function CalendarView({ items, activeDate, onMove }) {
  const days = buildMonthDays(activeDate);

  return (
    <div className="glass-panel overflow-hidden p-4">
      <div className="grid grid-cols-7 gap-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-7">
        {days.map((day) => {
          const isoDate = day.toISOString().slice(0, 10);
          const dayItems = items.filter((item) => item.date?.slice(0, 10) === isoDate);
          return (
            <div
              key={isoDate}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                const postId = event.dataTransfer.getData("text/postId");
                if (postId) onMove(postId, isoDate);
              }}
              className={`min-h-40 rounded-3xl border border-white/40 bg-white/60 p-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 ${
                day.getMonth() !== activeDate.getMonth() ? "opacity-45" : ""
              }`}
            >
              <p className="mb-3 text-sm font-semibold">{day.getDate()}</p>
              <div className="space-y-2">
                {dayItems.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(event) => event.dataTransfer.setData("text/postId", item.id)}
                  >
                    <EventCard event={item} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
