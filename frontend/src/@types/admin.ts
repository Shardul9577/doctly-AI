//----------------------------------------------------------------------
import type { CardProps } from '@mui/material/Card';

export type UserInvoice = {
  id: string;
  createdAt: Date | string | number;
  price: number;
};
export interface DoctorApiResponse {
  status: boolean;
  doctors: DoctorData[];
  meta: PaginationInfo;
}


export interface PaginationInfo {
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface DoctorData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  abha_id: string;
  age: number;
  personal_address: string;
  profile_picture: string;
  role?: string;
  gender?: string;
  marital_status?: string;
  spouse_full_name?: string;
  blood_group?: string;
  is_active?: boolean;
}


export interface PatientData {
  _id: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  deleted_at: string | null;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  abha_id?: string;
}

export interface ApiPatientResponse {
  status: boolean;
  message: string;
  data: PatientData[];
  pagination: {
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
}


export type CreditCard = {
  id: string;
  cardNumber: string;
  cardType: string;
};

export type Follower = {
  id: string;
  avatarUrl: string;
  name: string;
  country: string;
  isFollowed: boolean;
};

export type Gallery = {
  id: string;
  title: string;
  postAt: Date | string | number;
  imageUrl: string;
};

export type UserAddressBook = {
  id: string;
  name: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  street: string;
  zipCode: string;
};

export interface Profile {
  abha_id: string | null;
  about: string | null;
  profile_picture?: string;
  social_links: {
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
  };
  download_images: {
    aadhaar_card_url: string;
    degree_url: string;
    pan_card_url: string;
  };
  organization_info: {
    is_active: boolean;
    is_individual: boolean;
    organization_address: string | null;
    organization_email: string;
    organization_people: string[] | null;
    organization_id: string;
    organization_name: string;
    organization_phone: string;
    organization_type: string;
  };
  personal_info: {
    age: number | null;
    blood_group: string | null;
    date_of_birth: string | null;
    email: string;
    fullName: string;
    gender: string | null;
    marital_status: string | null;
    personal_address: string | null;
    phone: string;
    spouse_full_name: string | null;
  };
  qualification_info: {
    languages: string[];
    license_number: string;
    medical_school: string;
    specialization: string;
    qualification: string;
  };
}

export type OrganizationProfile = {
  name: string;
  phone: string;
  email: string;
  type: 'hospital' | 'clinic' | 'lab' | 'other';
  is_active: boolean;
  is_individual: boolean;
  owner_id: string;
  doctor_ids: string[];
  createdAt: Date;
};

export type UserManager = {
  id: string;
  avatarUrl: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  company: string;
  isVerified: boolean;
  status: string;
  role: string;
  createdAt?: Date | string | number;
};

export type UserData = {
  id: string;
  avatarUrl: string;
  cover: string;
  name: string;
  follower: number;
  following: number;
  totalPost: number;
  position: string;
};

export type NotificationSettings = {
  activityComments: boolean;
  activityAnswers: boolean;
  activityFollows: boolean;
  applicationNews: boolean;
  applicationProduct: boolean;
  applicationBlog: boolean;
};

export type Friend = {
  id: string;
  avatarUrl: string;
  name: string;
  role: string;
};

export type UserPost = {
  id: string;
  author: {
    id: string;
    avatarUrl: string;
    name: string;
  };
  isLiked: boolean;
  createdAt: Date | string | number;
  media: string;
  message: string;
  personLikes: {
    name: string;
    avatarUrl: string;
  }[];
  comments: {
    id: string;
    author: {
      id: string;
      avatarUrl: string;
      name: string;
    };
    createdAt: Date | string | number;
    message: string;
  }[];
};

export interface ApiDoctorData {
  _id: string;
  firstName: string;
  lastName: string;
  abha_id: string;
  email: string;
  phone: string;
  createdAt: string;
  personal_details: {
    license_number: string;
    specialization: string;
    qualification: string;
    degree_url: string;
    aadhaar_card_url: string;
    pan_card_url: string;
    verified_status: 'pending' | 'verified' | 'rejected';
    rejection_reason: string | null;
    createdAt: string;
  };
}

export type DoctorVerificationRowProps = {
  id: string;
  specialization: string;
  doctorName: string;
  avatar: string | null;
  date: number;
  status: 'pending' | 'verified' | 'rejected';
  degreeUrl: string;
  aadhaarCardUrl: string;
  panCardUrl: string;
  email: string;
  phone: string;
  licenseNumber: string;
  qualification: string;
  fullApiData: ApiDoctorData;
};

export interface DoctorDocumentVerificationProps extends CardProps {
  title?: string;
  subheader?: string;
}

export interface DoctorDetailsModalContentProps {
  doctorData: ApiDoctorData;
  onClose: () => void;
  refreshData: () => void;
}

export interface DocumentContentProps {
  url: string | null;
  label: string;
}

export type DoctorVerificationRowPropsWithRow = {
  row: DoctorVerificationRowProps;
  fullDoctorData: ApiDoctorData;
  refreshData: () => void;
  onViewDetails: (doctorApiData: ApiDoctorData) => void;
};
