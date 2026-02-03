import { NextRequest, NextResponse } from "next/server";
import MongoDBConnection from "@/lib/mongodb";
import TeamRegistration from "@/models/TeamRegistration";
import * as XLSX from "xlsx";

export async function GET(request: NextRequest) {
  try {
    // Get the pass from query parameters
    const searchParams = request.nextUrl.searchParams;
    const userPass = searchParams.get("pass");

    // Check if pass matches environment variable
    if (!userPass || userPass !== process.env.PASS) {
      return NextResponse.json(
        { error: "Unauthorized. Invalid pass." },
        { status: 401 }
      );
    }

    // Connect to database
    await MongoDBConnection.getInstance().connect();

    // Fetch all team registrations
    const teams = await TeamRegistration.find({}).lean();

    if (!teams || teams.length === 0) {
      return NextResponse.json(
        { error: "No registrations found." },
        { status: 404 }
      );
    }

    // Prepare Excel data
    const excelData: any[] = [];

    // Add header row
    excelData.push([
      "Team Name",
      "Pass ID",
      "Full Name",
      "Email",
      "Phone",
      "College",
      "Year",
      "Role",
    ]);

    // Add data rows
    teams.forEach((team) => {
      // Add team leader row
      excelData.push([
        team.teamName,
        team.passId,
        team.teamLeadFullName,
        team.email,
        team.phone,
        team.college,
        team.year,
        "Team Leader",
      ]);

      // Add team members rows
      if (team.teamMembers && team.teamMembers.length > 0) {
        team.teamMembers.forEach((member: any) => {
          excelData.push([
            team.teamName,
            team.passId,
            member.fullName,
            member.email,
            member.phone,
            member.college,
            "-",
            "Member",
          ]);
        });
      }
    });

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);

    // Set column widths
    worksheet["!cols"] = [
      { wch: 20 }, // Team Name
      { wch: 20 }, // Pass ID
      { wch: 25 }, // Full Name
      { wch: 30 }, // Email
      { wch: 15 }, // Phone
      { wch: 25 }, // College
      { wch: 10 }, // Year
      { wch: 15 }, // Role
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

    // Generate Excel file as buffer
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    // Format date and time for filename
    const now = new Date();
    const date = now.toLocaleDateString("en-GB").replace(/\//g, "-");
    const time = now.toLocaleTimeString("en-GB", { hour12: false }).replace(/:/g, "-");
    const filename = `Registration_Details_${date}_${time}.xlsx`;

    // Return Excel as downloadable file
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": excelBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error generating Excel:", error);
    return NextResponse.json(
      { error: "Failed to generate Excel." },
      { status: 500 }
    );
  }
}
