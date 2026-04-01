import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

import CalendarView from "../components/calendar/calendarview";
import Card from "../components/ui/card";
import { fetchCalendarItems, updatePost } from "../services/post.services";

export default function CalendarPage() {
  const [activeDate, setActiveDate] = useState(new Date());
  const [items, setItems] = useState([]);

  async function load() {
    const data = await fetchCalendarItems();
    setItems(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleMove(postId, date) {
    await updatePost(postId, { scheduled_time: `${date}T09:00`, status: "scheduled" });
    await load();
  }

  return (
    <div className="space-y-6">
      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Content calendar</p>
          <h2 className="font-display text-3xl font-bold">
            {activeDate.toLocaleString("en-IN", { month: "long", year: "numeric" })}
          </h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setActiveDate(new Date(activeDate.getFullYear(), activeDate.getMonth() - 1, 1))}
            className="secondary-button p-3"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setActiveDate(new Date(activeDate.getFullYear(), activeDate.getMonth() + 1, 1))}
            className="secondary-button p-3"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </Card>

      <CalendarView items={items} activeDate={activeDate} onMove={handleMove} />
    </div>
  );
}
