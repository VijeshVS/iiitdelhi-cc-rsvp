'use server';

import MongoDBConnection from '@/lib/mongodb';
import TeamRegistration, { ITeamMember } from '@/models/TeamRegistration';
import { nanoid } from 'nanoid';

export interface TeamRegistrationInput {
  teamLeadFullName: string;
  email: string;
  phone: string;
  college: string;
  year: '1st' | '2nd' | '3rd' | '4th' | 'PG';
  teamName: string;
  numberOfTeamMembers: number;
  teamMembers?: ITeamMember[];
}

export interface TeamRegistrationResponse {
  success: boolean;
  message: string;
  data?: {
    passId: string;
    teamName: string;
    email: string;
  };
  error?: string;
}

export async function createTeamRegistration(
  input: TeamRegistrationInput
): Promise<TeamRegistrationResponse> {
  try {
    // Connect to MongoDB
    const db = MongoDBConnection.getInstance();
    await db.connect();

    // Validate input
    if (!input.teamLeadFullName || !input.email || !input.phone || !input.college || !input.year || !input.teamName) {
      return {
        success: false,
        message: 'All team lead fields are required',
        error: 'MISSING_REQUIRED_FIELDS',
      };
    }

    if (input.numberOfTeamMembers < 1) {
      return {
        success: false,
        message: 'Number of team members must be at least 1',
        error: 'INVALID_TEAM_SIZE',
      };
    }

    // If team has more than 1 member, validate team members data
    if (input.numberOfTeamMembers >= 2) {
      const expectedMemberCount = input.numberOfTeamMembers - 1; // Excluding team lead
      
      if (!input.teamMembers || input.teamMembers.length !== expectedMemberCount) {
        return {
          success: false,
          message: `Please provide details for ${expectedMemberCount} team member(s)`,
          error: 'INVALID_MEMBER_COUNT',
        };
      }

      // Validate each team member has all required fields
      for (let i = 0; i < input.teamMembers.length; i++) {
        const member = input.teamMembers[i];
        if (!member.fullName || !member.email || !member.phone || !member.college) {
          return {
            success: false,
            message: `All fields are required for team member ${i + 1}`,
            error: 'MISSING_MEMBER_FIELDS',
          };
        }
      }
    }

    // Check if email already exists
    const existingEmail = await TeamRegistration.findOne({ email: input.email.toLowerCase().trim() });
    if (existingEmail) {
      return {
        success: false,
        message: 'This email is already registered. Please use a different email or retrieve your pass using this email.',
        error: 'EMAIL_EXISTS',
      };
    }

    // Check if team name already exists
    const existingTeamName = await TeamRegistration.findOne({ 
      teamName: { $regex: new RegExp(`^${input.teamName.trim()}$`, 'i') } 
    });
    if (existingTeamName) {
      return {
        success: false,
        message: 'This team name is already taken. Please choose a different team name.',
        error: 'TEAM_NAME_EXISTS',
      };
    }

    // Generate unique pass ID
    const passId = `PASS-${nanoid(10)}`;

    // Create new team registration
    const teamRegistration = new TeamRegistration({
      teamLeadFullName: input.teamLeadFullName,
      email: input.email,
      phone: input.phone,
      college: input.college,
      year: input.year,
      teamName: input.teamName,
      numberOfTeamMembers: input.numberOfTeamMembers,
      teamMembers: input.numberOfTeamMembers >= 2 ? input.teamMembers : [],
      passId,
    });

    await teamRegistration.save();

    return {
      success: true,
      message: 'Team registered successfully',
      data: {
        passId,
        teamName: input.teamName,
        email: input.email,
      },
    };
  } catch (error: any) {
    console.error('Error creating team registration:', error);
    return {
      success: false,
      message: 'Failed to register team',
      error: error.message || 'UNKNOWN_ERROR',
    };
  }
}
