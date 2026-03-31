import config from '../../config/env.js';
import prisma from '../../config/db.js';

async function mapAIOutputToDB(parsedOutput) {
  // Try to find matching skills from the database for fuzzy mapping
  const activeSkills = await prisma.skill.findMany({
    select: { name: true, slug: true },
    where: { isActive: true },
  });

  const skillMap = activeSkills.reduce((acc, skill) => {
    acc[skill.name.toLowerCase()] = skill.name;
    acc[skill.slug.toLowerCase()] = skill.name;
    return acc;
  }, {});
  
  // Custom manual overrides for common searches
  skillMap['data analysis'] = 'Data Analysis';
  skillMap['analyzing data'] = 'Data Analysis';
  skillMap['startup funding'] = 'Fundraising';
  skillMap['ui design'] = 'UI/UX Design';

  const exactMappedSkills = (parsedOutput.required_skills || []).map(skill => {
    const lower = skill.toLowerCase();
    for (const [key, val] of Object.entries(skillMap)) {
      if (key.includes(lower) || lower.includes(key)) {
        return val;
      }
    }
    return skillMap[lower] || skill;
  });
  
  const uniqueSkills = [...new Set(exactMappedSkills)];

  const weightedSkills = uniqueSkills.map((s, index) => {
    let weight = 0.1;
    if (index === 0) weight = 0.4;
    else if (index === 1) weight = 0.3;
    else if (index === 2) weight = 0.2;
    return { skill: s, weight };
  });

  return {
    skill: uniqueSkills.length > 0 ? uniqueSkills[0] : undefined,
    required_skills: uniqueSkills,
    weighted_skills: weightedSkills,
    problem_summary: parsedOutput.problem_summary,
    suggested_domain: parsedOutput.suggested_domain,
    intent: parsedOutput.intent,
    experience_level: parsedOutput.experience_level
  };
}

export const processSearchIntent = async (query) => {
  const prompt = `
You are an AI that understands user problems and maps them to mentor requirements for a mentorship platform.

From the query, extract the following details logically:
1. problem_summary (string: short concise sentence summarizing their core issue/goal)
2. intent (string: e.g., 'learning', 'career_switch', 'hiring', 'startup_help', etc.)
3. required_skills (array of strings: ordered by priority, precise technologies or areas needed, e.g. ["Resume Building", "Data Analysis", "Python"])
4. suggested_domain (string: broad classification, e.g. 'tech', 'business', 'career', 'design', etc.)
5. experience_level (string: 'beginner', 'intermediate', 'advanced', or null if unspecified)

User Query: "${query}"

Return ONLY a valid raw JSON object. Do not include markdown formatting or backticks.
  `;

  try {
    const response = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        jsonMode: true,
        model: 'openai'
      })
    });
    
    if (!response.ok) {
      throw new Error(`Pollinations API error: ${response.status}`);
    }

    const rawData = await response.json();
    const content = rawData.choices[0].message.content;
    
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("No JSON object found in response");
    }
    const jsonStr = match[0];
    const parsed = JSON.parse(jsonStr);
    console.log("Parsed from Pollinations:", JSON.stringify(parsed, null, 2));

    return await mapAIOutputToDB(parsed);
  } catch (error) {
    console.error('Error processing AI intent:', error);
    // FallbackStrategy: Production safety
    return {
      skill: query,
      isFallback: true
    };
  }
};
