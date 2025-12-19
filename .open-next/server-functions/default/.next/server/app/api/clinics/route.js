(()=>{var e={};e.id=8729,e.ids=[8729],e.modules={10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},26146:(e,r,t)=>{"use strict";t.r(r),t.d(r,{patchFetch:()=>h,routeModule:()=>p,serverHooks:()=>_,workAsyncStorage:()=>l,workUnitAsyncStorage:()=>d});var i={};t.r(i),t.d(i,{GET:()=>u});var s=t(40685),n=t(97626),o=t(93465),a=t(64764),c=t(46674);async function u(){try{let{data:e,error:r}=await c.L.from("veterinary_clinics").select(`
        id,
        clinic_name,
        phone,
        website,
        google_maps_url,
        operating_hours,
        street_address,
        city,
        state_province,
        country,
        latitude,
        longitude,
        specializations,
        additional_services,
        microchip_services,
        provides_24h_emergency
      `).eq("is_verified",!0).not("latitude","is",null).not("longitude","is",null).limit(100);if(r)return console.error("❌ Public clinic fetch error:",r),a.NextResponse.json({error:"Failed to retrieve clinic data"},{status:500});let t=e.map(e=>{let r=[e.street_address,e.city,e.state_province,e.country].filter(e=>!!(e&&e.trim())).join(", "),t=[...e.specializations??[],...e.additional_services??[],e.microchip_services?"Microchipping":null].filter(e=>!!e);return{id:e.id,name:e.clinic_name,website:e.website,google_maps_url:e.google_maps_url,address:r,city:e.city,state_province:e.state_province,phone:e.phone,hours:e.operating_hours,lat:Number(e.latitude),lng:Number(e.longitude),services:t,is_24h:e.provides_24h_emergency}});return a.NextResponse.json(t)}catch(e){return console.error("❌ Clinics API route crash:",e),a.NextResponse.json({error:"Internal Server Error"},{status:500})}}let p=new s.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/clinics/route",pathname:"/api/clinics",filename:"route",bundlePath:"app/api/clinics/route"},resolvedPagePath:"/home/chinnu/projects/chipthem/src/app/api/clinics/route.ts",nextConfigOutput:"standalone",userland:i}),{workAsyncStorage:l,workUnitAsyncStorage:d,serverHooks:_}=p;function h(){return(0,o.patchFetch)({workAsyncStorage:l,workUnitAsyncStorage:d})}},63814:()=>{},24494:()=>{},46674:(e,r,t)=>{"use strict";t.d(r,{L:()=>i});let i=(0,t(49103).UU)("https://zwqngfcujvsaahykqisj.supabase.co",process.env.SUPABASE_SERVICE_ROLE_KEY)}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),i=r.X(0,[3465,3610,9103],()=>t(26146));module.exports=i})();