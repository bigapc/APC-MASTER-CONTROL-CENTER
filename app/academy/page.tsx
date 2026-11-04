import { BookOpen, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import ExecutiveLayout from "@/components/layouts/ExecutiveLayout";
import AcademyLearningConsole from "@/components/AcademyLearningConsole";
import { APC_COMMAND } from "@/lib/apcCommandCenter";
import { DARNELL_PRINCIPLE } from "@/lib/darnellPrinciple";
import { getAcademyUser } from "@/lib/academy/api";
import { getAcademySnapshotForUser } from "@/lib/academy/service";
import { EMPTY_ACADEMY_SNAPSHOT } from "@/lib/academy/types";
import { ACADEMY_CURRICULUM_TRACKS } from "@/lib/academy/curriculum";

const learningCategories = [
  "Employee onboarding",
  "Leadership development",
  "Operational training",
  "Safety and security awareness",
  "Community engagement",
  "Corporate wellness",
  "Mental health awareness",
  "Professional development",
  "Organizational compliance",
  "AI and technology training",
  "APC-specific operational training",
];

const observances = [
  {
    date: "December 2",
    title: "Annual DARNELL Principle Reflection and Organizational Wellness Review",
    description: "A permanent APC observance for wellness check-ins, culture reflection, leadership learning, and community impact discussion.",
  },
  {
    date: "April 30",
    title: "Annual DARNELL Legacy Review and Corporate Wellness & Accountability Audit",
    description: "A permanent APC observance for organizational wellness review, employee support, leadership accountability, workplace culture, and community responsibility.",
  },
];

export default async function AcademyPage() {
  const result = await getAcademySnapshotForUser(await getAcademyUser());
  const snapshot = result.ok ? result.data : EMPTY_ACADEMY_SNAPSHOT;
  return (
    <AuthGuard>
      <ExecutiveLayout>
        <div className="space-y-8">
          <section className="apc-card-dark p-8">
            <div className="apc-badge">Training Development</div>
            <h1 className="mt-4 flex items-center gap-3 text-4xl font-black text-white">
              <BookOpen className="text-[#c1121f]" /> APC Academy
            </h1>
            <p className="mt-4 max-w-3xl text-zinc-300">
              The future training, education, organizational development, wellness, leadership, and operational learning center for {APC_COMMAND.companyName}.
            </p>
            <p className="mt-3 text-sm text-zinc-400">{APC_COMMAND.mission}</p>
          </section>

          <section className="apc-card p-6">
            <div className="flex items-center gap-3">
              <Sparkles className="text-[#c1121f]" />
              <h2 className="text-2xl font-black">Learning Architecture</h2>
            </div>
            <p className="mt-3 text-sm text-zinc-600">Course content is in development. No completed courses are represented. Source: {snapshot.sourceStatus}; local courses: {snapshot.courses.length}.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {learningCategories.map((category) => (
                <div key={category} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="font-bold">{category}</p>
                  <p className="mt-2 text-xs font-black uppercase tracking-wide text-[#c1121f]">Coming Soon</p>
                </div>
              ))}
            </div>
          </section>

          <AcademyLearningConsole courses={snapshot.courses} categories={learningCategories} tracks={ACADEMY_CURRICULUM_TRACKS} />

          <section className="apc-card-dark p-8">
            <div className="apc-badge">Permanent APC Policy Framework</div>
            <h2 className="mt-4 flex items-center gap-3 text-3xl font-black text-white">
              <HeartHandshake className="text-[#c1121f]" /> {DARNELL_PRINCIPLE.title}
            </h2>
            <p className="mt-2 text-sm font-bold text-zinc-300">{DARNELL_PRINCIPLE.subtitle}</p>
            <p className="mt-5 max-w-3xl text-zinc-300">
              In honor of {DARNELL_PRINCIPLE.person}, {DARNELL_PRINCIPLE.dates}. Darnell Armstrong believed in providing a sense of security for humanity and represented love, family, community protection, compassion, and showing up for others.
            </p>
            <p className="mt-4 max-w-3xl text-zinc-300">
              The DARNELL Principle reflects the belief that communities should protect one another and that love should have no boundaries through organizational wellness, human connection, community responsibility, and accountability.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {DARNELL_PRINCIPLE.values.map((value) => (
              <article key={`${value.initial}-${value.name}`} className="apc-card p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c1121f] text-lg font-black text-white">{value.initial}</span>
                  <h3 className="text-xl font-black">{value.name}</h3>
                </div>
                <p className="mt-4 text-sm text-zinc-600">{value.description}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            {observances.map((observance) => (
              <article key={observance.date} className="apc-card p-6">
                <p className="text-sm font-black uppercase tracking-wide text-[#c1121f]">{observance.date}</p>
                <h2 className="mt-3 text-xl font-black">{observance.title}</h2>
                <p className="mt-3 text-sm text-zinc-600">{observance.description}</p>
                <p className="mt-5 text-xs font-black uppercase tracking-wide text-zinc-500">Future operational implementation</p>
              </article>
            ))}
          </section>

          <section className="apc-card p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-[#c1121f]" />
              <h2 className="text-2xl font-black">Wellness Review Architecture</h2>
            </div>
            <p className="mt-3 text-sm text-zinc-600">Assessment Architecture | Future Survey Integration | No Live Wellness Data</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {DARNELL_PRINCIPLE.assessmentAreas.map((area) => (
                <div key={area} className="rounded-xl border border-zinc-200 p-4 text-sm font-bold">{area}</div>
              ))}
            </div>
            <p className="mt-5 text-sm text-zinc-500">Sensitive employee health information requires approved privacy and compliance design before collection.</p>
          </section>

          <section className="apc-card border-zinc-300 bg-zinc-50 p-8">
            <h2 className="text-2xl font-black">In Honor of Darnell Armstrong</h2>
            <p className="mt-2 font-bold text-zinc-700">December 2, 1984 - April 30, 2026</p>
            <p className="mt-4 max-w-3xl text-zinc-600">Armstrong Pack Company intends to honor the legacy of loved ones through meaningful community impact and responsible organizational practices.</p>
          </section>
        </div>
      </ExecutiveLayout>
    </AuthGuard>
  );
}