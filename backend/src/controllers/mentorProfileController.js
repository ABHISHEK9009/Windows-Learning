import { PrismaClient } from '@prisma/client';
import { emitDataUpdate } from '../utils/socketEmitter.js';

const prisma = new PrismaClient();

// Get mentor profile by ID
const getMentorProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await prisma.mentorProfile.findUnique({
      where: { 
        id,
        isActive: true,
        deletedAt: null 
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            profilePicture: true
          }
        },
        skills: {
          include: {
            skill: true
          }
        },
        reviews: {
          where: {
            isActive: true
          },
          include: {
            learner: {
              include: {
                user: {
                  select: {
                    name: true,
                    profilePicture: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5 // Latest 5 reviews
        },
        _count: {
          select: {
            reviews: {
              where: {
                isActive: true
              }
            },
            sessions: {
              where: {
                status: 'COMPLETED'
              }
            }
          }
        }
      }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Mentor profile not found' });
    }

    // Calculate rating distribution
    const allReviews = await prisma.review.findMany({
      where: {
        mentorId: id,
        isActive: true
      },
      select: {
        rating: true
      }
    });

    const totalReviews = allReviews.length;
    const averageRating = totalReviews > 0 
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
      : 0;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allReviews.forEach(review => {
      distribution[review.rating]++;
    });

    const distributionWithPercentage = {};
    Object.entries(distribution).forEach(([rating, count]) => {
      distributionWithPercentage[rating] = {
        count,
        percentage: totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0
      };
    });

    res.json({
      ...profile,
      averageRating: parseFloat(averageRating.toFixed(2)),
      totalReviews,
      ratingDistribution: distributionWithPercentage
    });

  } catch (error) {
    console.error('Get mentor profile error:', error);
    res.status(500).json({ error: 'Failed to fetch mentor profile' });
  }
};

// Update mentor profile
const updateMentorProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if user owns this profile
    const profile = await prisma.mentorProfile.findUnique({
      where: { id }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Mentor profile not found' });
    }

    if (profile.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this profile' });
    }

    const {
      fullName,
      profileImage,
      headline,
      bio,
      location,
      languages,
      skillsData,
      experienceYears,
      currentCompany,
      currentRole,
      pastExperience,
      education,
      hourlyRate,
      currency,
      packageDeals,
      freeConsultation,
      weeklySchedule,
      timeZone,
      responseTime,
      timeOff,
      certifications,
      idDocument,
      workVerification
    } = req.body;

    const updatedProfile = await prisma.mentorProfile.update({
      where: { id },
      data: {
        fullName,
        profileImage,
        headline,
        bio,
        location,
        languages: Array.isArray(languages) ? languages : [],
        skillsData: skillsData || {},
        experienceYears: experienceYears ? parseInt(experienceYears) : 0,
        currentCompany,
        currentRole,
        pastExperience: Array.isArray(pastExperience) ? pastExperience : [],
        education: Array.isArray(education) ? education : [],
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : 0,
        currency: currency || 'INR',
        packageDeals: Array.isArray(packageDeals) ? packageDeals : [],
        freeConsultation: !!freeConsultation,
        weeklySchedule: weeklySchedule || {},
        timeZone: timeZone || 'Asia/Kolkata',
        responseTime,
        timeOff: Array.isArray(timeOff) ? timeOff : [],
        certifications: Array.isArray(certifications) ? certifications : [],
        idDocument,
        workVerification,
        // Update legacy fields for backward compatibility
        title: headline,
        company: currentCompany,
        experience: experienceYears ? parseInt(experienceYears) : 0
      }
    });

    // Also update the User model for consistency
    await prisma.user.update({
      where: { id: userId },
      data: {
        ...(fullName && { name: fullName }),
        ...(profileImage && { profilePicture: profileImage })
      }
    });

    // Fetch the full user object to return
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        mentorProfile: true,
        learnerProfile: true,
        wallet: true
      }
    });

    // Emit socket update for real-time
    if (req.app.get('io')) {
      emitDataUpdate(req.app.get('io'), userId, 'user');
      emitDataUpdate(req.app.get('io'), null, 'mentors');
    }

    res.json({
      message: 'Profile updated successfully',
      profile: updatedProfile,
      user: updatedUser
    });

  } catch (error) {
    console.error('Update mentor profile error:', error);
    res.status(500).json({ error: 'Failed to update mentor profile' });
  }
};

// Get current user's mentor profile
const getMyMentorProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await prisma.mentorProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            profileImage: true
          }
        },
        skills: {
          include: {
            skill: true
          }
        },
        reviews: {
          where: {
            isActive: true
          },
          include: {
            learner: {
              include: {
                user: {
                  select: {
                    name: true,
                    profileImage: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        }
      }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Mentor profile not found' });
    }

    res.json(profile);

  } catch (error) {
    console.error('Get my mentor profile error:', error);
    res.status(500).json({ error: 'Failed to fetch mentor profile' });
  }
};

// Create mentor profile
const createMentorProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if profile already exists
    const existingProfile = await prisma.mentorProfile.findUnique({
      where: { userId }
    });

    if (existingProfile) {
      return res.status(400).json({ error: 'Mentor profile already exists' });
    }

    const {
      fullName,
      profileImage,
      headline,
      bio,
      location,
      languages,
      skillsData,
      experienceYears,
      currentCompany,
      currentRole,
      pastExperience,
      education,
      hourlyRate,
      currency,
      packageDeals,
      freeConsultation,
      weeklySchedule,
      timeZone,
      responseTime,
      timeOff,
      certifications,
      idDocument,
      workVerification
    } = req.body;

    // Create profile with only the fields that exist in the database
    const profile = await prisma.mentorProfile.create({
      data: {
        userId,
        fullName: fullName || req.user.name,
        profileImage,
        headline,
        bio,
        location,
        languages: Array.isArray(languages) ? languages : [],
        skillsData: skillsData || {},
        experienceYears: experienceYears ? parseInt(experienceYears) : 0,
        currentCompany,
        currentRole,
        pastExperience: Array.isArray(pastExperience) ? pastExperience : [],
        education: Array.isArray(education) ? education : [],
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : 0,
        currency: currency || 'INR',
        packageDeals: Array.isArray(packageDeals) ? packageDeals : [],
        freeConsultation: !!freeConsultation,
        weeklySchedule: weeklySchedule || {},
        timeZone: timeZone || 'Asia/Kolkata',
        responseTime,
        timeOff: Array.isArray(timeOff) ? timeOff : [],
        certifications: Array.isArray(certifications) ? certifications : [],
        idDocument,
        workVerification,
        // Legacy fields for backward compatibility
        title: headline,
        company: currentCompany,
        experience: experienceYears ? parseInt(experienceYears) : 0
      }
    });

    // Fetch the full user object to return
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        mentorProfile: true,
        learnerProfile: true,
        wallet: true
      }
    });

    // Update user role and other common fields for consistency
    await prisma.user.update({
      where: { id: userId },
      data: {
        role: 'MENTOR',
        ...(fullName && { name: fullName }),
        ...(profileImage && { profilePicture: profileImage })
      }
    });
    updatedUser.role = 'MENTOR';
    if (fullName) updatedUser.name = fullName;
    if (profileImage) updatedUser.profilePicture = profileImage;

    // Emit socket update for real-time
    if (req.app.get('io')) {
      emitDataUpdate(req.app.get('io'), userId, 'user');
      emitDataUpdate(req.app.get('io'), null, 'mentors');
    }

    res.status(201).json({
      message: 'Mentor profile created successfully',
      profile,
      user: updatedUser
    });

  } catch (error) {
    console.error('Create mentor profile error:', error);
    res.status(500).json({ error: 'Failed to create mentor profile' });
  }
};

// Search mentors with filters
const searchMentors = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      skills,
      minRate,
      maxRate,
      experience,
      rating,
      sortBy = 'newest'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build where clause
    const where = {
      isActive: true,
      deletedAt: null,
      verificationStatus: 'approved'
    };

    // Add search conditions
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { headline: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Add filter conditions separately
    if (minRate) {
      where.hourlyRate = { gte: parseFloat(minRate) };
    }
    if (maxRate) {
      if (where.hourlyRate) {
        where.hourlyRate.lte = parseFloat(maxRate);
      } else {
        where.hourlyRate = { lte: parseFloat(maxRate) };
      }
    }
    if (experience) {
      where.experienceYears = { gte: parseInt(experience) };
    }
    if (rating) {
      where.averageRating = { gte: parseFloat(rating) };
    }

    // Build order by clause
    const orderBy = {};
    switch (sortBy) {
      case 'rating':
        orderBy.averageRating = 'desc';
        break;
      case 'experience':
        orderBy.experienceYears = 'desc';
        break;
      case 'rate_low':
        orderBy.hourlyRate = 'asc';
        break;
      case 'rate_high':
        orderBy.hourlyRate = 'desc';
        break;
      default: // newest
        orderBy.createdAt = 'desc';
    }

    const mentors = await prisma.mentorProfile.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        user: {
          select: {
            name: true,
            profileImage: true
          }
        },
        _count: {
          select: {
            reviews: {
              where: {
                isActive: true
              }
            },
            sessions: {
              where: {
                status: 'COMPLETED'
              }
            }
          }
        }
      }
    });

    const total = await prisma.mentorProfile.count({ where });

    res.json({
      mentors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Search mentors error:', error);
    res.status(500).json({ error: 'Failed to search mentors' });
  }
};

// Upload file (for profile image, documents, etc.)
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Return the local URL for the uploaded file
    const fileUrl = `/uploads/${req.file.filename}`;

    res.json({
      message: 'File uploaded successfully',
      fileUrl
    });

  } catch (error) {
    console.error('Upload file error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};

export {
  getMentorProfile,
  updateMentorProfile,
  getMyMentorProfile,
  createMentorProfile,
  searchMentors,
  uploadFile
};
