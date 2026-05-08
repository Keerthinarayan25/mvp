// export interface DeveloperProfileForm{
//   bio: string;
//   skills: string[];
//   github:string;
//   linkedin:string;
//   profileImage: string;  

// }

type ProfileViewModel = {
  name: string;
  profileImage: string;
  subtitle?: string;

  stats?: {
    label: string;
    value: number;
  }[];

  about?: string;

  links?: {
    label: string;
    url: string;
  }[];

  sections: {
    type: "skills" | "portfolio" | "projects";
    data: any[];
  }[];
};