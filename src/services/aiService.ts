import { allCareers, companies, roadmapTemplates } from '../data/sampleData';
import type { CareerRecommendation, Company, LearningPhase, SkillGapItem, SkillGapSummary, StudentProfile } from '../types';

const proficiencyScore: Record<string, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

export function analyzeCareerProfile(profile: StudentProfile) {
  const skillCount = profile.skills.length;
  const averageSkillLevel = profile.skills.length
    ? profile.skills.reduce((sum, skill) => sum + proficiencyScore[skill.proficiency] || 0, 0) / profile.skills.length
    : 0;

  const readinessScore = Math.min(
    100,
    Math.round((skillCount * 6 + averageSkillLevel * 12 + profile.interests.length * 4 + profile.experience.length * 5) / 1.5),
  );

  const completionFields = [
    profile.name,
    profile.email,
    profile.college,
    profile.degree,
    profile.branch,
    profile.location,
    profile.careerPreferences.preferredRole,
    profile.skills.length,
    profile.interests.length,
    profile.experience.length,
  ];

  const completed = completionFields.filter(Boolean).length;
  const profileCompletion = Math.min(100, Math.round((completed / completionFields.length) * 100));

  const topCareer = allCareers.reduce((best, career) => {
    const match = calculateCareerMatch(profile, career);
    if (!best || match > best.match) {
      return { name: career.title, match };
    }
    return best;
  }, { name: 'AI/ML Engineer', match: 0 });

  return {
    readinessScore,
    profileCompletion,
    topCareer: topCareer.name,
    topMatch: topCareer.match,
    skillCount,
    skillsToImprove: profile.skills.filter((skill) => skill.proficiency !== 'Advanced').map((skill) => skill.name),
    learningProgress: Math.min(100, Math.round((profile.skills.filter((skill) => skill.proficiency === 'Advanced').length / Math.max(1, profile.skills.length)) * 100)),
  };
}

export function recommendCareers(profile: StudentProfile): CareerRecommendation[] {
  return allCareers
    .map((career) => {
      const match = calculateCareerMatch(profile, career);
      const requiredSkills = career.requiredSkills;
      const existingSkills = profile.skills
        .filter((skill) => requiredSkills.includes(skill.name))
        .map((skill) => skill.name);
      const missingSkills = requiredSkills.filter((skill) => !existingSkills.includes(skill));

      return {
        careerId: career.id,
        careerName: career.title,
        match,
        whyItMatches: `Your focus on ${profile.interests[0] ?? 'technology'} and technical skill profile fits ${career.title} well.`,
        requiredSkills,
        existingSkills,
        missingSkills,
        roadmap: career.roadmap.beginner.concat(career.roadmap.intermediate),
        responsibilities: career.responsibilities,
        futureGrowth: career.growth,
        relatedRoles: career.relatedRoles,
      };
    })
    .sort((a, b) => b.match - a.match)
    .slice(0, 5);
}

export function analyzeSkillGap(profile: StudentProfile, careerId: string): SkillGapSummary {
  const career = allCareers.find((entry) => entry.id === careerId) ?? allCareers[0];
  const existingMap = new Map(profile.skills.map((skill) => [skill.name, skill.proficiency]));
  const gapItems: SkillGapItem[] = career.requiredSkills.map((skillName) => {
    const current = existingMap.get(skillName) ?? 'Missing';
    const required = current === 'Advanced' ? 'Advanced' : current === 'Intermediate' ? 'Intermediate' : 'Advanced';
    const status: SkillGapItem['status'] =
      current === 'Missing'
        ? 'Missing'
        : current === 'Advanced'
          ? 'Strong'
          : current === 'Intermediate'
            ? 'Good'
            : 'Needs Improvement';
    return { name: skillName, current: current === 'Missing' ? 'Missing' : current, required, status };
  });

  const strongSkills = gapItems.filter((item) => item.status === 'Strong').map((item) => item.name);
  const improvingSkills = gapItems.filter((item) => item.status === 'Good' || item.status === 'Needs Improvement').map((item) => item.name);
  const missingSkills = gapItems.filter((item) => item.status === 'Missing').map((item) => item.name);

  const score = Math.max(0, Math.min(100, Math.round((strongSkills.length / Math.max(1, career.requiredSkills.length)) * 100)));

  return {
    score,
    strongSkills,
    improvingSkills,
    missingSkills,
    gapItems,
  };
}

export function generateLearningRoadmap(careerId: string): LearningPhase[] {
  const phases = roadmapTemplates[careerId] ?? roadmapTemplates['ai-ml-engineer'];
  return phases.map((phase) => ({ ...phase }));
}

export function recommendCompanies(profile: StudentProfile, careerId: string): Company[] {
  const career = allCareers.find((entry) => entry.id === careerId) ?? allCareers[0];
  return companies
    .filter((company) => {
      const rolesMatch = career.relatedRoles.some((role) => company.roles.some((title) => title.toLowerCase().includes(role.toLowerCase())));
      return rolesMatch || company.requiredSkills.some((skill) => profile.skills.some((studentSkill) => studentSkill.name === skill));
    })
    .map((company) => ({
      ...company,
      match: Math.min(98, Math.max(60, company.match + (profile.skills.length > 4 ? 8 : 0))),
    }))
    .slice(0, 6);
}

function calculateCareerMatch(profile: StudentProfile, career: (typeof allCareers)[number]) {
  const skillMatches = career.requiredSkills.filter((skill) => profile.skills.some((userSkill) => userSkill.name === skill)).length;
  const skillWeight = (skillMatches / Math.max(1, career.requiredSkills.length)) * 40;

  const interestWeight = profile.interests.some((interest) => career.category.toLowerCase().includes(interest.toLowerCase()) || career.title.toLowerCase().includes(interest.toLowerCase()))
    ? 25
    : 12;

  const assessmentWeight = 20;
  const educationWeight = profile.degree.toLowerCase().includes('computer') || profile.degree.toLowerCase().includes('engineering') || profile.degree.toLowerCase().includes('science') ? 10 : 6;
  const experienceWeight = Math.min(5, profile.experience.length * 1.5);

  const finalScore = Math.min(
    100,
    Math.round(skillWeight + interestWeight + assessmentWeight + educationWeight + experienceWeight),
  );

  return finalScore;
}
