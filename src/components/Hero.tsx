"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Glow background */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-vv-blue/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-40 h-[300px] w-[300px] rounded-full bg-vv-orange/15 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-4 inline-block rounded-full border border-vv-cyan/40 bg-vv-cyan/10 px-4 py-1 text-xs font-semibold tracking-wider text-vv-cyan">
            SSLC • PUC SCIENCE • KCET
          </p>
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            Learn Fast.
            <br />
            <span className="bg-linear-to-r from-vv-cyan via-vv-blue to-vv-orange bg-clip-text text-transparent">
              Score Higher.
            </span>
          </h1>
          <p className="mt-5 max-w-lg text-base text-white/70 md:text-lg">
            Notes, previous year question papers, important questions and
            solutions, all in one place. Taught simply by Niveditha T S.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="#courses"
              className="inline-flex items-center gap-2 rounded-full bg-vv-orange px-6 py-3 font-semibold text-vv-navy shadow-lg shadow-vv-orange/30 transition hover:scale-105"
            >
              Browse Materials <ArrowRight size={18} />
            </Link>
            <Link
              href="/#videos"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 font-semibold transition hover:border-vv-cyan hover:text-vv-cyan"
            >
              <Download size={18} /> Watch Videos
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/logo.png"
              alt="Velocity Vidya logo"
              width={380}
              height={380}
              priority
              className="rounded-full shadow-2xl shadow-vv-blue/30"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}