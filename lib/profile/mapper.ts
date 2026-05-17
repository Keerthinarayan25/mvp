export function mapDeveloperToView(data: any) {
  return {
    name: data.user.name,
    image: data.profile.profileImage || "/public/profile.svg",
    subtitle: data.profile.category || "Developer",

    stats: [
      {
        label: "Contracts",
        value: data.contractCount || 0,
      },
    ],

    about: data.profile.bio || "",

    links: [
      {
        label: "GitHub",
        url: data.profile.github,
      },
      {
        label: "LinkedIn",
        url: data.profile.linkedin,
      },
    ].filter((l) => l.url),

    sections: [
      {
        type: "skills",
        data: data.profile.skills || [],
      },
      {
        type: "portfolio",
        data: data.portfolio || [],
      },
    ],
  };
}

export function mapFounderToView(data: any) {
  console.log("DATA IN mapFounderToView:", data);
  return {
    name: data.user.name,
    image: data.founderProfile.profileImage || "/public/profile.svg",
    subtitle: data.founderProfile.companyName || "Founder",

    stats: [
      {
        label: "Projects",
        value: data.projects?.length || 0,
      },
    ],

    about: data.founderProfile.bio || "",

    links: [
      {
        label: "Website",
        url: data.founderProfile.website,
      },
      {
        label: "LinkedIn",
        url: data.founderProfile.linkedin,
      },
    ].filter((l) => l.url),

    sections: [
      {
        type: "projects",
        data: data.projects || [],
      },
      {
        type: "developers",
        data: data.hiredDevelopers || [],
      },
    ],
  };
}