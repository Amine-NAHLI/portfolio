"use client";

import HackathonsWarRoom from "@/components/ui/HackathonsWarRoom";
import type { Locale } from "@/i18n/config";
import { DEFAULT_HACKATHONS, type JourneyTimelineItem } from "@/types/journey";

export type RoadmapEntry = {
  id: string | number;
  type: string;
  title: string;
  eventDate: string;
  description: string;
};

type RoadmapProps = {
  entries?: RoadmapEntry[];
  items?: JourneyTimelineItem[];
  labels?: { experience: string; education: string };
  locale?: Locale;
  variant?: "default" | "minimal";
};

export default function Roadmap({ items, locale = "fr" }: RoadmapProps) {
  const warRoomItems = items && items.length > 0 ? items : DEFAULT_HACKATHONS;

  return (
    <div className="relative mx-auto w-full max-w-7xl">
      <HackathonsWarRoom locale={locale} items={warRoomItems} />
    </div>
  );
}
