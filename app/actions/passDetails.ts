'use server';

import MongoDBConnection from '@/lib/mongodb';
import TeamRegistration, { ITeamRegistration } from '@/models/TeamRegistration';

export interface PassDetailsResponse {
  success: boolean;
  message: string;
  data?: {
    passId: string;
    teamName: string;
    teamLeadFullName: string;
    email: string;
    phone: string;
    college: string;
    year: string;
    numberOfTeamMembers: number;
    teamMembers?: {
      fullName: string;
      email: string;
      phone: string;
      college: string;
    }[];
    createdAt: string; // ISO date string for serialization
  };
  error?: string;
}

export async function getPassDetails(email: string): Promise<PassDetailsResponse> {
  try {
    // Validate input
    if (!email) {
      return {
        success: false,
        message: 'Email is required',
        error: 'MISSING_EMAIL',
      };
    }

    // Connect to MongoDB
    const db = MongoDBConnection.getInstance();
    await db.connect();

    // Find registration by email - use .lean() to get plain JavaScript object
    const registration = await TeamRegistration.findOne({
      email: email.toLowerCase().trim(),
    }).lean();

    if (!registration) {
      return {
        success: false,
        message: 'No registration found for this email',
        error: 'NOT_FOUND',
      };
    }

    // Format team members without _id fields
    const teamMembers = registration.teamMembers?.map((member: any) => ({
      fullName: member.fullName,
      email: member.email,
      phone: member.phone,
      college: member.college,
    })) || [];

    // Return pass details with serializable data
    return {
      success: true,
      message: 'Pass details retrieved successfully',
      data: {
        passId: registration.passId,
        teamName: registration.teamName,
        teamLeadFullName: registration.teamLeadFullName,
        email: registration.email,
        phone: registration.phone,
        college: registration.college,
        year: registration.year,
        numberOfTeamMembers: registration.numberOfTeamMembers,
        teamMembers,
        createdAt: new Date(registration.createdAt).toISOString(),
      },
    };
  } catch (error: any) {
    console.error('Error retrieving pass details:', error);
    return {
      success: false,
      message: 'Failed to retrieve pass details',
      error: error.message || 'UNKNOWN_ERROR',
    };
  }
}
