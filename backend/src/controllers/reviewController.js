import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Submit review for completed session
const submitReview = async (req, res) => {
  try {
    const { sessionId, rating, title, comment, tags } = req.body;
    const learnerId = req.user.id;

    // Validate session exists and belongs to the learner
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        mentor: true,
        learner: true
      }
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.learnerId !== learnerId) {
      return res.status(403).json({ error: 'Not authorized to review this session' });
    }

    if (session.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Can only review completed sessions' });
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: { sessionId }
    });

    if (existingReview) {
      return res.status(400).json({ error: 'Review already submitted for this session' });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        sessionId,
        mentorId: session.mentorId,
        learnerId,
        rating,
        title,
        comment,
        tags: tags || [],
        isVerified: true // Session was completed
      },
      include: {
        mentor: {
          include: {
            user: true
          }
        },
        learner: {
          include: {
            user: true
          }
        }
      }
    });

    // Update mentor statistics
    await updateMentorStats(session.mentorId);

    res.status(201).json({
      message: 'Review submitted successfully',
      review
    });

  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({ error: 'Failed to submit review' });
  }
};

// Get all reviews for a mentor
const getMentorReviews = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const { page = 1, limit = 10, rating, sortBy = 'newest' } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build where clause
    const where = {
      mentorId,
      isActive: true,
      ...(rating && { rating: parseInt(rating) })
    };

    // Build order by clause
    const orderBy = {};
    switch (sortBy) {
      case 'highest':
        orderBy.rating = 'desc';
        break;
      case 'lowest':
        orderBy.rating = 'asc';
        break;
      case 'helpful':
        orderBy.helpfulCount = 'desc';
        break;
      default: // newest
        orderBy.createdAt = 'desc';
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy,
      skip,
      take,
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
        },
        session: {
          select: {
            topic: true,
            startTime: true
          }
        }
      }
    });

    const total = await prisma.review.count({ where });

    res.json({
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get mentor reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// Get rating distribution for a mentor
const getMentorRatingStats = async (req, res) => {
  try {
    const { mentorId } = req.params;

    const reviews = await prisma.review.findMany({
      where: {
        mentorId,
        isActive: true
      },
      select: {
        rating: true
      }
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
      : 0;

    // Calculate rating distribution
    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    };

    reviews.forEach(review => {
      distribution[review.rating]++;
    });

    // Convert to percentages
    const distributionWithPercentage = {};
    Object.entries(distribution).forEach(([rating, count]) => {
      distributionWithPercentage[rating] = {
        count,
        percentage: totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0
      };
    });

    res.json({
      averageRating: parseFloat(averageRating.toFixed(2)),
      totalReviews,
      distribution: distributionWithPercentage
    });

  } catch (error) {
    console.error('Get mentor rating stats error:', error);
    res.status(500).json({ error: 'Failed to fetch rating stats' });
  }
};

// Mentor responds to review
const respondToReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { response } = req.body;
    const mentorId = req.user.id;

    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.mentorId !== mentorId) {
      return res.status(403).json({ error: 'Not authorized to respond to this review' });
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        mentorResponse: response,
        mentorResponseAt: new Date()
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
      }
    });

    res.json({
      message: 'Response added successfully',
      review: updatedReview
    });

  } catch (error) {
    console.error('Respond to review error:', error);
    res.status(500).json({ error: 'Failed to add response' });
  }
};

// Mark review as helpful
const markReviewHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const learnerId = req.user.id;

    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // In a real implementation, you'd track which users have marked a review as helpful
    // For now, we'll just increment the count
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        helpfulCount: review.helpfulCount + 1
      }
    });

    res.json({
      message: 'Review marked as helpful',
      helpfulCount: updatedReview.helpfulCount
    });

  } catch (error) {
    console.error('Mark review helpful error:', error);
    res.status(500).json({ error: 'Failed to mark review as helpful' });
  }
};

// Update review (within 7 days)
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment, tags } = req.body;
    const learnerId = req.user.id;

    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.learnerId !== learnerId) {
      return res.status(403).json({ error: 'Not authorized to update this review' });
    }

    // Check if review is within 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    if (new Date(review.createdAt) < sevenDaysAgo) {
      return res.status(400).json({ error: 'Can only update reviews within 7 days of submission' });
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating,
        title,
        comment,
        tags: tags || []
      },
      include: {
        mentor: {
          include: {
            user: true
          }
        }
      }
    });

    // Update mentor statistics
    await updateMentorStats(review.mentorId);

    res.json({
      message: 'Review updated successfully',
      review: updatedReview
    });

  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
};

// Helper function to update mentor statistics
const updateMentorStats = async (mentorId) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        mentorId,
        isActive: true
      },
      include: {
        session: true
      }
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
      : 0;

    // Get total sessions and students
    const sessions = await prisma.session.findMany({
      where: {
        mentorId,
        status: 'COMPLETED'
      }
    });

    const totalSessions = sessions.length;
    const uniqueStudents = new Set(sessions.map(s => s.learnerId)).size;

    // Calculate completion rate
    const allSessions = await prisma.session.findMany({
      where: {
        mentorId
      }
    });
    const completionRate = allSessions.length > 0 
      ? (totalSessions / allSessions.length) * 100 
      : 0;

    // Update mentor profile
    await prisma.mentorProfile.update({
      where: { id: mentorId },
      data: {
        totalReviews,
        averageRating,
        totalSessions,
        totalStudents: uniqueStudents,
        completionRate
      }
    });

  } catch (error) {
    console.error('Update mentor stats error:', error);
  }
};

export {
  submitReview,
  getMentorReviews,
  getMentorRatingStats,
  respondToReview,
  markReviewHelpful,
  updateReview
};
