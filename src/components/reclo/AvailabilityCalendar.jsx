import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

export default function AvailabilityCalendar({ kebayaId }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [bookedRanges, setBookedRanges] = useState([]);

  useEffect(() => {
    base44.entities.Order.filter({ kebaya_id: kebayaId })
      .then((orders) => {
        const ranges = orders
          .filter((o) => o.status !== "cancelled" && o.rental_date && o.return_date)
          .map((o) => ({ from: new Date(o.rental_date), to: new Date(o.return_date) }));
        setBookedRanges(ranges);
      });
  }, [kebayaId]);

  const isBooked = (date) => {
    return bookedRanges.some(({ from, to }) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      const f = new Date(from); f.setHours(0, 0, 0, 0);
      const t = new Date(to); t.setHours(0, 0, 0, 0);
      return d >= f && d <= t;
    });
  };

  const isPast = (date) => {
    const d = new Date(date); d.setHours(0, 0, 0, 0);
    const t = new Date(today); t.setHours(0, 0, 0, 0);
    return d < t;
  };

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prev = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const next = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  return (
    <div className="border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={prev} className="p-1 hover:text-primary transition-colors">
          <ChevronLeft size={18} />
        </button>
        <h4 className="font-display text-lg font-medium tracking-wider text-foreground">
          {MONTHS[month]} {year}
        </h4>
        <button onClick={next} className="p-1 hover:text-primary transition-colors">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center font-body text-xs text-muted-foreground tracking-wider py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, idx) => {
          if (!date) return <div key={idx} />;
          const booked = isBooked(date);
          const past = isPast(date);
          return (
            <div
              key={idx}
              className={`aspect-square flex items-center justify-center text-xs font-body rounded transition-colors ${
                past
                  ? "text-muted-foreground/30"
                  : booked
                  ? "bg-destructive/20 text-destructive font-semibold"
                  : "bg-primary/10 text-primary font-semibold"
              }`}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-primary/10" />
          <span className="font-body text-xs text-muted-foreground">Tersedia</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-destructive/20" />
          <span className="font-body text-xs text-muted-foreground">Sudah Dibooking</span>
        </div>
      </div>
    </div>
  );
}