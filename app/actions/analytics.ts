'use server';

import MongoDBConnection from '@/lib/mongodb';
import TeamRegistration from '@/models/TeamRegistration';

export interface TeamAnalytics {
  passId: string;
  teamName: string;
  college: string;
  year: string;
  totalMembers: number;
  enteredCount: number;
  leadName: string;
  leadEntered: boolean;
  members: {
    name: string;
    entered: boolean;
  }[];
  createdAt: string;
}

export interface CollegeBreakdown {
  college: string;
  totalTeams: number;
  totalCandidates: number;
  enteredCandidates: number;
}

export interface AnalyticsData {
  totalTeams: number;
  totalCandidates: number;
  totalEntered: number;
  totalPending: number;
  entryPercentage: number;
  teamsFullyEntered: number;
  teamsPartiallyEntered: number;
  teamsNotEntered: number;
  collegeBreakdown: CollegeBreakdown[];
  teams: TeamAnalytics[];
}

export interface AnalyticsResponse {
  success: boolean;
  message: string;
  data?: AnalyticsData;
  error?: string;
}

export async function getAnalytics(): Promise<AnalyticsResponse> {
  try {
    const db = MongoDBConnection.getInstance();
    await db.connect();

    const registrations = await TeamRegistration.find({}).lean();

    if (!registrations || registrations.length === 0) {
      return {
        success: true,
        message: 'No registrations found',
        data: {
          totalTeams: 0,
          totalCandidates: 0,
          totalEntered: 0,
          totalPending: 0,
          entryPercentage: 0,
          teamsFullyEntered: 0,
          teamsPartiallyEntered: 0,
          teamsNotEntered: 0,
          collegeBreakdown: [],
          teams: [],
        },
      };
    }

    let totalCandidates = 0;
    let totalEntered = 0;
    let teamsFullyEntered = 0;
    let teamsPartiallyEntered = 0;
    let teamsNotEntered = 0;

    const collegeMap = new Map<string, CollegeBreakdown>();
    const teams: TeamAnalytics[] = [];

    for (const reg of registrations) {
      const leadEntered = reg.entered ?? false;
      const members = (reg.teamMembers || []).map((m) => ({
        name: m.fullName,
        entered: m.entered ?? false,
      }));

      const teamTotal = 1 + members.length;
      const teamEntered = (leadEntered ? 1 : 0) + members.filter((m) => m.entered).length;

      totalCandidates += teamTotal;
      totalEntered += teamEntered;

      if (teamEntered === 0) {
        teamsNotEntered++;
      } else if (teamEntered === teamTotal) {
        teamsFullyEntered++;
      } else {
        teamsPartiallyEntered++;
      }

      // College breakdown
      const college = reg.college || 'Unknown';
      const existing = collegeMap.get(college);
      if (existing) {
        existing.totalTeams++;
        existing.totalCandidates += teamTotal;
        existing.enteredCandidates += teamEntered;
      } else {
        collegeMap.set(college, {
          college,
          totalTeams: 1,
          totalCandidates: teamTotal,
          enteredCandidates: teamEntered,
        });
      }

      teams.push({
        passId: reg.passId,
        teamName: reg.teamName,
        college: reg.college,
        year: reg.year,
        totalMembers: teamTotal,
        enteredCount: teamEntered,
        leadName: reg.teamLeadFullName,
        leadEntered,
        members,
        createdAt: new Date(reg.createdAt).toISOString(),
      });
    }

    const totalPending = totalCandidates - totalEntered;
    const entryPercentage = totalCandidates > 0
      ? Math.round((totalEntered / totalCandidates) * 100)
      : 0;

    // Sort colleges by total candidates desc
    const collegeBreakdown = Array.from(collegeMap.values()).sort(
      (a, b) => b.totalCandidates - a.totalCandidates
    );

    // Sort teams: partially entered first, then not entered, then fully entered
    teams.sort((a, b) => {
      const aStatus = a.enteredCount === 0 ? 2 : a.enteredCount === a.totalMembers ? 3 : 1;
      const bStatus = b.enteredCount === 0 ? 2 : b.enteredCount === b.totalMembers ? 3 : 1;
      return aStatus - bStatus;
    });

    return {
      success: true,
      message: 'Analytics loaded',
      data: {
        totalTeams: registrations.length,
        totalCandidates,
        totalEntered,
        totalPending,
        entryPercentage,
        teamsFullyEntered,
        teamsPartiallyEntered,
        teamsNotEntered,
        collegeBreakdown,
        teams,
      },
    };
  } catch (error: unknown) {
    console.error('Error loading analytics:', error);
    return {
      success: false,
      message: 'Failed to load analytics',
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    };
  }
}
