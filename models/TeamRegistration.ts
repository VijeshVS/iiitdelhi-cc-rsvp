import mongoose, { Schema, Document, Model } from 'mongoose';

// Type definitions
export interface ITeamMember {
  fullName: string;
  email: string;
  phone: string;
  college: string;
  entered?: boolean;
}

export interface ITeamRegistration extends Document {
  teamLeadFullName: string;
  email: string;
  phone: string;
  college: string;
  year: '1st' | '2nd' | '3rd' | '4th' | 'PG';
  teamName: string;
  numberOfTeamMembers: number;
  teamMembers?: ITeamMember[];
  entered?: boolean;
  passId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Team Member Schema
const TeamMemberSchema = new Schema<ITeamMember>({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  college: {
    type: String,
    required: true,
    trim: true,
  },
  entered: {
    type: Boolean,
    default: false,
  },
}, { _id: false });

// Team Registration Schema
const TeamRegistrationSchema = new Schema<ITeamRegistration>(
  {
    teamLeadFullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    college: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: String,
      required: true,
      enum: ['1st', '2nd', '3rd', '4th', 'PG'],
    },
    teamName: {
      type: String,
      required: true,
      trim: true,
    },
    numberOfTeamMembers: {
      type: Number,
      required: true,
      min: 1,
    },
    teamMembers: {
      type: [TeamMemberSchema],
      default: [],
    },
    entered: {
      type: Boolean,
      default: false,
    },
    passId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the model
const TeamRegistration: Model<ITeamRegistration> =
  mongoose.models.TeamRegistration ||
  mongoose.model<ITeamRegistration>('TeamRegistration', TeamRegistrationSchema);

export default TeamRegistration;
