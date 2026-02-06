'use server';

import MongoDBConnection from '@/lib/mongodb';
import TeamRegistration from '@/models/TeamRegistration';

export interface EntryResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface TeamEntryData {
  passId: string;
  teamName: string;
  teamLeadFullName: string;
  email: string;
  phone: string;
  college: string;
  year: string;
  entered: boolean;
  numberOfTeamMembers: number;
  teamMembers: {
    fullName: string;
    email: string;
    phone: string;
    college: string;
    entered: boolean;
    index: number;
  }[];
}

export interface SearchEntryResponse {
  success: boolean;
  message: string;
  data?: TeamEntryData;
  error?: string;
}

export async function searchTeamForEntry(query: string): Promise<SearchEntryResponse> {
  try {
    if (!query) {
      return {
        success: false,
        message: 'Please enter a Pass ID or email to search',
        error: 'MISSING_QUERY',
      };
    }

    const db = MongoDBConnection.getInstance();
    await db.connect();

    // Search by passId or email
    const registration = await TeamRegistration.findOne({
      $or: [
        { passId: query.trim() },
        { email: query.toLowerCase().trim() },
      ],
    }).lean();

    if (!registration) {
      return {
        success: false,
        message: 'No registration found for this Pass ID or email',
        error: 'NOT_FOUND',
      };
    }

    const teamMembers = registration.teamMembers?.map((member, index) => ({
      fullName: member.fullName,
      email: member.email,
      phone: member.phone,
      college: member.college,
      entered: member.entered ?? false,
      index,
    })) || [];

    return {
      success: true,
      message: 'Team found',
      data: {
        passId: registration.passId,
        teamName: registration.teamName,
        teamLeadFullName: registration.teamLeadFullName,
        email: registration.email,
        phone: registration.phone,
        college: registration.college,
        year: registration.year,
        entered: registration.entered ?? false,
        numberOfTeamMembers: registration.numberOfTeamMembers,
        teamMembers,
      },
    };
  } catch (error: unknown) {
    console.error('Error searching team for entry:', error);
    return {
      success: false,
      message: 'Failed to search team',
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    };
  }
}

export async function markEntry(
  passId: string,
  personType: 'lead' | 'member',
  memberIndex?: number
): Promise<EntryResponse> {
  try {
    if (!passId) {
      return {
        success: false,
        message: 'Pass ID is required',
        error: 'MISSING_PASS_ID',
      };
    }

    const db = MongoDBConnection.getInstance();
    await db.connect();

    if (personType === 'lead') {
      const result = await TeamRegistration.updateOne(
        { passId },
        { $set: { entered: true } }
      );

      if (result.matchedCount === 0) {
        return { success: false, message: 'Registration not found', error: 'NOT_FOUND' };
      }

      return { success: true, message: 'Team lead marked as entered' };
    }

    if (personType === 'member' && memberIndex !== undefined) {
      const result = await TeamRegistration.updateOne(
        { passId },
        { $set: { [`teamMembers.${memberIndex}.entered`]: true } }
      );

      if (result.matchedCount === 0) {
        return { success: false, message: 'Registration not found', error: 'NOT_FOUND' };
      }

      return { success: true, message: `Team member marked as entered` };
    }

    return {
      success: false,
      message: 'Invalid entry parameters',
      error: 'INVALID_PARAMS',
    };
  } catch (error: unknown) {
    console.error('Error marking entry:', error);
    return {
      success: false,
      message: 'Failed to mark entry',
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    };
  }
}

export async function undoEntry(
  passId: string,
  personType: 'lead' | 'member',
  memberIndex?: number
): Promise<EntryResponse> {
  try {
    if (!passId) {
      return {
        success: false,
        message: 'Pass ID is required',
        error: 'MISSING_PASS_ID',
      };
    }

    const db = MongoDBConnection.getInstance();
    await db.connect();

    if (personType === 'lead') {
      const result = await TeamRegistration.updateOne(
        { passId },
        { $set: { entered: false } }
      );

      if (result.matchedCount === 0) {
        return { success: false, message: 'Registration not found', error: 'NOT_FOUND' };
      }

      return { success: true, message: 'Team lead entry undone' };
    }

    if (personType === 'member' && memberIndex !== undefined) {
      const result = await TeamRegistration.updateOne(
        { passId },
        { $set: { [`teamMembers.${memberIndex}.entered`]: false } }
      );

      if (result.matchedCount === 0) {
        return { success: false, message: 'Registration not found', error: 'NOT_FOUND' };
      }

      return { success: true, message: 'Team member entry undone' };
    }

    return {
      success: false,
      message: 'Invalid parameters',
      error: 'INVALID_PARAMS',
    };
  } catch (error: unknown) {
    console.error('Error undoing entry:', error);
    return {
      success: false,
      message: 'Failed to undo entry',
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    };
  }
}

export async function bulkMarkEntry(
  passId: string,
  selections: { type: 'lead' | 'member'; memberIndex?: number }[]
): Promise<EntryResponse> {
  try {
    if (!passId || selections.length === 0) {
      return { success: false, message: 'Pass ID and selections are required', error: 'INVALID_PARAMS' };
    }

    const db = MongoDBConnection.getInstance();
    await db.connect();

    const updateFields: Record<string, boolean> = {};
    for (const sel of selections) {
      if (sel.type === 'lead') {
        updateFields['entered'] = true;
      } else if (sel.type === 'member' && sel.memberIndex !== undefined) {
        updateFields[`teamMembers.${sel.memberIndex}.entered`] = true;
      }
    }

    const result = await TeamRegistration.updateOne(
      { passId },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return { success: false, message: 'Registration not found', error: 'NOT_FOUND' };
    }

    return { success: true, message: `${selections.length} person(s) marked as entered` };
  } catch (error: unknown) {
    console.error('Error bulk marking entry:', error);
    return { success: false, message: 'Failed to mark entries', error: error instanceof Error ? error.message : 'UNKNOWN_ERROR' };
  }
}
