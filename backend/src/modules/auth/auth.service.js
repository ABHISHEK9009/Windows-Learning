import prisma from '../../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config/env.js';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client();


export const registerUser = async (userData) => {
  const { email, password, name, role } = userData;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: role || 'LEARNER',
      ...(role === 'MENTOR'
        ? { mentorProfile: { create: { hourlyRate: 0 } } }
        : { learnerProfile: { create: {} } }),
      notificationSetting: { create: {} },
      wallet: { create: {} },
    },
    include: {
      learnerProfile: true,
      mentorProfile: true,
      wallet: true,
    },
  });

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    config.jwtSecret,
    { expiresIn: '1h' }
  );

  return { user, token };
};

export const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    config.jwtSecret,
    { expiresIn: '1h' }
  );

  return { user, token };
};

export const googleLoginUser = async (accessToken, role = 'LEARNER') => {
  const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  
  if (!response.ok) throw new Error("Invalid Google token");
  const payload = await response.json();
  
  if (!payload || !payload.email) throw new Error("Invalid Google token");
  
  const { email, name, picture } = payload;
  
  let user = await prisma.user.findUnique({ 
    where: { email },
    include: {
      mentorProfile: true,
      learnerProfile: true,
    }
  });
  
  if (!user) {
    const randomPassword = Math.random().toString(36).slice(-10) + "A1!";
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    
    user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        profilePicture: picture,
        role,
        ...(role === 'MENTOR'
          ? { mentorProfile: { create: { hourlyRate: 0 } } }
          : { learnerProfile: { create: {} } }),
        notificationSetting: { create: {} },
        wallet: { create: {} },
      },
      include: {
        learnerProfile: true,
        mentorProfile: true,
        wallet: true,
      },
    });
  } else {
    let shouldUpdate = false;
    let updateData = {};
    
    // Update missing picture
    if (!user.profilePicture && picture) {
      updateData.profilePicture = picture;
      shouldUpdate = true;
    }
    
    // Upgrade role if user wants to sign up as MENTOR but is currently a LEARNER
    if (role === 'MENTOR' && user.role === 'LEARNER') {
      updateData.role = 'MENTOR';
      shouldUpdate = true;
      if (!user.mentorProfile) {
        updateData.mentorProfile = { create: { hourlyRate: 0 } };
      }
    }
    
    if (shouldUpdate) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: updateData,
        include: {
          learnerProfile: true,
          mentorProfile: true,
          wallet: true,
        },
      });
    }
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    config.jwtSecret,
    { expiresIn: '1h' }
  );

  return { user, token };
};
