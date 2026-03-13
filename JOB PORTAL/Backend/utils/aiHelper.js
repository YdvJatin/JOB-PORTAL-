const calculateMatchScore = (candidateSkills, jobRequiredSkills) => {
  if (jobRequiredSkills.length === 0) return 100;

  const matchedSkills = candidateSkills.filter((skill) =>
    jobRequiredSkills.some(
      (jobSkill) =>
        skill.toLowerCase().includes(jobSkill.toLowerCase()) ||
        jobSkill.toLowerCase().includes(skill.toLowerCase())
    )
  );

  return Math.round((matchedSkills.length / jobRequiredSkills.length) * 100);
};

const generateAISummary = (jobTitle, description, skills) => {
  // Simple AI summary generation (can be enhanced with actual AI API)
  const summary = `
    Position: ${jobTitle}
    Key Responsibilities: Extract main duties from job description
    Required Skills: ${skills.join(', ')}
    Career Growth: Opportunity to develop expertise in relevant technologies
  `;
  return summary.trim();
};

const extractKeywords = (text) => {
  // Extract keywords from text (can be enhanced with NLP)
  const keywords = text
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 4)
    .slice(0, 10);
  return [...new Set(keywords)];
};

module.exports = {
  calculateMatchScore,
  generateAISummary,
  extractKeywords,
};
