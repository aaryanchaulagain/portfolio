import { Badge } from "@/components/ui/Badge";
import { Reveal, MotionDiv, staggerContainer, fadeUp } from "@/components/ui/Motion";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { skillLevelLabels } from "@/data/skills";
import { getSkillCategories } from "@/lib/content";
import type { SkillLevel } from "@/types";

const levelVariant: Record<SkillLevel, "accent" | "default" | "muted"> = {
  core: "accent",
  experienced: "default",
  working: "muted",
};

export async function Skills() {
  const skillCategories = await getSkillCategories();

  return (
    <Section id="skills" ariaLabelledby="skills-heading">
      <Container>
        <Reveal>
          <SectionHeading
            id="skills-heading"
            eyebrow="Skills"
            title="Technical capabilities, stated honestly"
            description="Levels reflect real delivery experience — not inflated percentages. Core skills are used regularly on client work; working knowledge means practical familiarity without claiming mastery."
          />
        </Reveal>

        <MotionDiv
          className="mt-12 grid gap-6 md:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
        >
          {skillCategories.map((category) => (
            <MotionDiv
              key={category.id}
              variants={fadeUp}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="rounded-2xl border border-border bg-surface p-6 shadow-soft"
            >
              <h3 className="font-display text-xl font-semibold tracking-tight">
                {category.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {category.description}
              </p>
              <ul className="mt-5 space-y-3">
                {category.skills.map((skill) => (
                  <li
                    key={`${category.id}-${skill.name}`}
                    className="flex items-center justify-between gap-3 border-b border-border/70 pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {skill.name}
                    </span>
                    <Badge variant={levelVariant[skill.level]}>
                      {skillLevelLabels[skill.level]}
                    </Badge>
                  </li>
                ))}
              </ul>
            </MotionDiv>
          ))}
        </MotionDiv>
      </Container>
    </Section>
  );
}
