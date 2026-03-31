import express from 'express';
import { processSearchIntent } from './ai.service.js';
import prisma from '../../config/db.js';

const router = express.Router();

// Calculate mentor score based on weighted skills
const calculateMentorScore = (mentor, weightedSkills, parsedExperienceLevel) => {
  let skillScore = 0;
  
  for (const ws of weightedSkills) {
    if (mentor.skills && mentor.skills.map(s => s?.skill?.name).includes(ws.skill)) {
      skillScore += ws.weight;
    }
  }
  
  const experienceScore = mentor.experienceLevel === parsedExperienceLevel ? 1 : 0.5;
  const ratingScore = mentor.rating ? mentor.rating / 5 : 0.5;
  const availabilityScore = mentor.isAvailable ? 1 : 0;
  
  return (skillScore * 0.6) + (experienceScore * 0.15) + (ratingScore * 0.15) + (availabilityScore * 0.1);
};

router.post('/search-intent', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    console.log('Processing search intent for:', query);
    
    // Process with Pollinations.AI
    const aiOutput = await processSearchIntent(query);
    
    // If AI failed (fallback mode), do simple keyword search
    if (aiOutput.isFallback) {
      const mentors = await prisma.mentorProfile.findMany({
        where: {
          skills: {
            some: {
              skill: {
                name: { contains: query, mode: 'insensitive' }
              }
            }
          }
        },
        include: { 
          user: { select: { name: true, email: true } },
          skills: { include: { skill: true } },
          reviews: true,
          _count: { select: { reviews: true } }
        }
      });
      
      return res.json({ 
        mentors, 
        aiOutput: { 
          problem_summary: `Searching for: "${query}"`,
          required_skills: [query],
          isFallback: true 
        } 
      });
    }
    
    // AI succeeded - get ranked mentors
    const { required_skills, weighted_skills, experience_level } = aiOutput;
    
    let mentors = await prisma.mentorProfile.findMany({
      where: {
        skills: {
          some: {
            skill: {
              name: { in: required_skills }
            }
          }
        }
      },
      include: { 
        user: { select: { name: true, email: true } },
        skills: { include: { skill: true } },
        reviews: true,
        _count: { select: { reviews: true } }
      }
    });
    
    // Rank mentors by score
    mentors = mentors.map(mentor => ({
      ...mentor,
      score: calculateMentorScore(mentor, weighted_skills || [], experience_level),
      matchedSkills: (weighted_skills || [])
        .filter(ws => mentor.skills && mentor.skills.map(s => s?.skill?.name).includes(ws.skill))
        .map(ws => ws.skill)
    }));
    
    mentors.sort((a, b) => (b.score || 0) - (a.score || 0));
    
    res.json({ mentors, aiOutput });
    
  } catch (error) {
    console.error('Error in search-intent route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
