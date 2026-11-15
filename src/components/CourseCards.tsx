"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Atom, GraduationCap, ArrowRight } from "lucide-react";

const courses = [
  {
    title: "SSLC (10th)",
    subtitle: "KSEEB Syllabus",
    href: "/sslc",
    icon: BookOpen,
    color: "from-vv-cyan to-vv-blue",
    points: ["Syllabus", "Previous Year Papers", "Important Questions", "Solutions"],
  },
  {
    title: "PUC Science",
    subtitle: "1st & 2nd PUC",
    href: "/puc",
    icon: Atom,
    color: "from-vv-blue to-vv-cyan",
    points: ["Physics, Chemistry, Maths, Biology", "Chapter Notes", "Previous Year Papers", "Solutions"],
  },
  {
    title: "KCET",
    subtitle: "Entrance Exam Prep",
    href: "/kcet",
    icon: GraduationCap,
    color: "from-vv-orange to-vv-yellow",
    points: ["Syllabus", "Previous Year Papers", "Important Questions", "Solutions"],
  },
];

export default function CourseCards() {
  return (
    <section id="courses" className="mx-auto max-w-6xl px-4 py-16">
      <motion.div
        className="mb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold md:text-4xl">
          Choose Your <span className="text-vv-orange">Course</span>
        </h2>
        <p className="mt-3 text-white/60">
          Everything organised class-wise, subject-wise and chapter-wise.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {courses.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            whileHover={{ y: -8 }}
          >
            <Link
              href={c.href}
              className="group block h-full rounded-2xl border border-white/10 bg-vv-navy-soft p-6 transition hover:border-vv-cyan/50"
            >
              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br ${c.color}`}
              >
                <c.icon size={28} className="text-vv-navy" />
              </div>
              <h3 className="text-2xl font-bold">{c.title}</h3>
              <p className="mb-4 text-sm text-vv-cyan">{c.subtitle}</p>
              <ul className="space-y-2 text-sm text-white/70">
                {c.points.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-vv-orange" />
                    {p}
                  </li>
                ))}
              </ul>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-vv-orange transition group-hover:gap-3">
                Explore <ArrowRight size={18} />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}