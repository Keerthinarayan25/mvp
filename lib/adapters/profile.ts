export interface ProfileDTO {
  id:number;
  userId: number;
  bio?:string;
  skills: string[];
  techStack?:string;
  profileImage?: string;

}

export function formatProfile(profile: any) {
  return {
    ...profile,
    skills: profile.skills ? JSON.parse(profile.skills) : [],
  };
}

export function prepareProfileUpdate(data: any) {
  return {
    ...data,
    skills: data.skills ? JSON.stringify(data.skills) : null,
  };
}