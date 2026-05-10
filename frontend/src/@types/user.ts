// ----------------------------------------------------------------------

export type UserInvoice = {
  id: string;
  createdAt: Date | string | number;
  price: number;
};

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
  profile_picture: string;
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
    verified_status?: 'pending' | 'verified' | 'rejected';
    rejection_reason?: string;
  };
}

export type OrganizationProfile = {
  name: string;
  phone: string;
  email: string;
  type: 'hospital' | 'clinic' | 'lab' | 'other'; // add more types if needed
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
  phoneNumber?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
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

export type VisitCardProps = {
  _id: string;
  doctor_patient_relations_id: {
    _id: string;
    patient_id: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
    doctor_id: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      profile_picture: string;
    };
    organization_id: string;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  is_active: boolean;
  visit_date: string; // Format: "DD/MM/YYYY"
  visit_time: string; // Format: "HH:mm"
  duration: number; // Duration in minutes
  visit_type: string; // e.g., "check-up"
  status: string; // e.g., "pending"
  case_file_type: string; // e.g., "new"
  symptoms: string[]; // List of symptoms
  diagnosis: string[]; // List of diagnosis
  notes: string;
  ai_summary: string;
  attachments: any[]; // Update this to `AttachmentType[]` if you define one
  prescription: any[]; // Update this to `PrescriptionType[]` if structured
  createdAt: string;
  updatedAt: string;
};
