// function mapDeveloperToView(data: any) {
//   if (!data || !data.user || !data.profile) return null;

//   return {
//     name: data.user.name,
//     image: data.profile.profileImage,
//     subtitle: data.profile.category || "Developer",

//     stats: [
//       { label: "Contracts", value: data.contractCount || 0 },
//     ],

//     about: data.profile.bio || "",

//     links: [
//       { label: "GitHub", url: data.profile.github },
//       { label: "LinkedIn", url: data.profile.linkedin },
//     ].filter(link => link.url), // remove null links

//     sections: [
//       {
//         type: "skills",
//         data: data.profile.skills || [],
//       },
//       {
//         type: "portfolio",
//         data: data.portfolio || [],
//       },
//     ],
//   };
// }


// function mapFounderToView(data: any): ProfileViewModel {
//   return {
//     name: data.user.name,
//     profileImage: data.founderProfile.profileImage,
//     subtitle: data.founderProfile.companyName,

//     stats: [
//       { label: "projects", value: data.projects.length },
//     ],

//     about: data.founderProfile.bio,

//     links: [
//       { label: "Website", url: data.founderProfile.website },
//       { label: "LinkedIn", url: data.founderProfile.linkedin },
//     ],

//     sections: [
//       { type: "projects", data: data.projects },
//     ],
//   };
// }

