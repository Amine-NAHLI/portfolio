"use client";

import React from "react";
import SkillsSection from "./SkillsSection";

export default function Stack({ skills }: { skills: any[] }) {
  return (
    <SkillsSection skills={skills} />
  );
}
