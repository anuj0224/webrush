export type Category = "Music" | "Entertainment" | "Places" | "Purchases" | "Photos" | "Messages" | "Searches" | "Events" | "Notes";
export type Receipt = { id:string; dataset:string; category:Category; title:string; detail:string; date:string; time:string; location:string; icon:string; tone:string };

const categories: {name:Category; icon:string; tone:string; titles:string[]}[] = [
  {name:"Music",icon:"♪",tone:"music",titles:["Night Drive — Chromatics","Pink + White — Frank Ocean","Dreams — Fleetwood Mac","Intro — The xx"]},
  {name:"Entertainment",icon:"▶",tone:"entertainment",titles:["The Bear · S2 E6","Past Lives","A24 short film","Friday night screening"]},
  {name:"Places",icon:"⌖",tone:"places",titles:["Juniper Coffee","Riverside Walk","Platform 4","North Market"]},
  {name:"Purchases",icon:"◇",tone:"purchases",titles:["Oat flat white · $5.40","Used paperback · $12","Train ticket · $34","Film roll · $18"]},
  {name:"Photos",icon:"▣",tone:"photos",titles:["Rain on the café window","Golden hour, platform 4","Three frames from the coast","Neon reflected on 8th St"]},
  {name:"Messages",icon:"↗",tone:"messages",titles:["“Meet at the usual place?”","“Train gets in at 8:12”","Four photos shared","“This song again.”"]},
  {name:"Searches",icon:"⌕",tone:"searches",titles:["late cafés near me","weekend trains north","35mm film developing","live music tonight"]},
  {name:"Events",icon:"○",tone:"events",titles:["Small Room Sessions","Coastal train · 07:42","Sunday market","Dinner reservation"]},
  {name:"Notes",icon:"✦",tone:"notes",titles:["Songs for the long way home","Remember the blue hour","Books to find","A quiet September list"]},
];
const places=["Brooklyn, NY","Lower East Side","Hudson Valley","Greenpoint","Rockaway Beach","At home"];
const datasets=["Archive A","Archive B","Archive C"];
export const receipts: Receipt[] = Array.from({length:324},(_,i)=>{
  const c=categories[i%categories.length] ?? categories[0]; const month=(i%12)+1; const day=(i*7%27)+1; const hour=(i*13%24);
  if (!c) throw new Error("Receipt categories are required");
  return {id:`R-${String(i+1).padStart(3,"0")}`,dataset:datasets[i%3] ?? "Archive A",category:c.name,title:c.titles[i%c.titles.length] ?? c.name,detail:i%4===0?"Repeated near another moment":"Captured in the personal archive",date:`2025-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`,time:`${String(hour).padStart(2,"0")}:${String((i*17)%60).padStart(2,"0")}`,location:places[i%places.length] ?? "At home",icon:c.icon,tone:c.tone};
});

export const stories=[
 {slug:"late-night-era",kicker:"A change in cadence",title:"The Late Night Era",range:"May 08 — Jun 21",count:47,categories:["Music","Searches","Messages"],summary:"Activity after 11 PM appeared 2.4× more often across six weeks, led by music, searches, and short message threads.",stat:"2.4×",label:"more activity after 11 PM",accent:"music"},
 {slug:"cafe-routine",kicker:"A place that repeated",title:"The Café Routine",range:"Aug 03 — Oct 14",count:31,categories:["Places","Purchases","Photos"],summary:"Juniper Coffee appeared on nine mornings. Seven visits included the same drink, and four were followed by a riverside photo.",stat:"9",label:"mornings at Juniper",accent:"places"},
 {slug:"weekend-escape",kicker:"A recurring route",title:"The Weekend Escape",range:"Sep 06 — Nov 02",count:26,categories:["Events","Places","Photos"],summary:"Three Saturday train journeys followed a similar route north, each connecting tickets, photographs, and a saved place.",stat:"3",label:"parallel Saturdays",accent:"events"},
 {slug:"new-rhythm",kicker:"A pattern emerged",title:"A New Rhythm",range:"Jan 12 — Mar 30",count:62,categories:["Music","Places","Notes"],summary:"Sunday listening moved earlier in the day while walks and short notes began appearing in the same two-hour window.",stat:"11:08",label:"average Sunday start",accent:"notes"},
];

export const navItems=[{to:"/",label:"Overview",icon:"◫"},{to:"/stories",label:"Stories",icon:"✦"},{to:"/journey",label:"Journey",icon:"⌁"},{to:"/receipts",label:"Receipts",icon:"▤"},{to:"/connections",label:"Connections",icon:"⌘"},{to:"/insights",label:"Insights",icon:"◉"}] as const;
export const categoryTone:Record<Category,string>={Music:"music",Entertainment:"entertainment",Places:"places",Purchases:"purchases",Photos:"photos",Messages:"messages",Searches:"searches",Events:"events",Notes:"notes"};
export const featuredChain=receipts.filter((_,i)=>[0,20,49,84,115].includes(i));
export const months=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
export const activity=[36,44,31,57,82,94,62,48,76,89,54,67];
