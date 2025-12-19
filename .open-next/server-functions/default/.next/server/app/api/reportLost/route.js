(()=>{var e={};e.id=4158,e.ids=[4158],e.modules={10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},77598:e=>{"use strict";e.exports=require("node:crypto")},74478:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>g,routeModule:()=>c,serverHooks:()=>h,workAsyncStorage:()=>m,workUnitAsyncStorage:()=>d});var o={};r.r(o),r.d(o,{POST:()=>u});var s=r(40685),n=r(97626),l=r(93465),a=r(64764),i=r(46674),p=r(57250);async function u(e){try{let t=await e.formData(),r={},o=null,s=null;t.forEach((e,t)=>{"pet_photo"===t&&"string"!=typeof e?(o=e,s=e.name??`pet_${Date.now()}`):r[t]=e});let n=null;if(o&&s){let e=`${Date.now()}_${s}`,{data:t,error:r}=await i.L.storage.from("pet_photos").upload(e,o);if(r)throw Error(`Failed to upload image: ${r.message}`);let{data:l}=i.L.storage.from("pet_photos").getPublicUrl(t.path);n=l.publicUrl}let l={pet_name:r.pet_name??null,pet_type:r.pet_type??null,color:r.color??null,size:r.size??null,pet_photo:n,last_seen_location:r.last_seen_location??null,status:"unresolved",breed:r.breed??null,microchip:r.microchip??null,date_lost:r.date_lost??null,time_lost:r.time_lost??null,loss_circumstances:r.loss_circumstances??null,owner_name:r.owner_name??null,phone:r.phone??null,email:r.email??null,alt_phone:r.alt_phone??null},{error:u}=await i.L.from("lost_reports").insert([l]);if(u)throw Error(`Failed to save report: ${u.message}`);r.email&&await (0,p.Z)({to:r.email.toString(),subject:"Your Lost Pet Report Has Been Received",html:`
          <h1>Thank you for your report</h1>
          <p>We have received your lost pet report for <strong>${r.pet_name??"your pet"}</strong>.</p>
          <p>We will notify you as soon as we have any updates.</p>
        `});let c=`
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>🐾 New Lost Pet Report</h2>
        <hr>

        <h3>Pet Details</h3>
        <ul>
          <li><strong>Pet Name:</strong> ${r.pet_name||"N/A"}</li>
          <li><strong>Pet Type:</strong> ${r.pet_type||"N/A"}</li>
          <li><strong>Breed:</strong> ${r.breed||"N/A"}</li>
          <li><strong>Size:</strong> ${r.size||"N/A"}</li>
          <li><strong>Primary Color:</strong> ${r.color||"N/A"}</li>
          <li><strong>Sex:</strong> ${r.sex||"N/A"}</li>
        </ul>

        <h3>Loss Information</h3>
        <ul>
          <li><strong>Date Lost:</strong> ${r.date_lost||"N/A"}</li>
          <li><strong>Time Lost:</strong> ${r.time_lost||"N/A"}</li>
          <li><strong>Last Seen At:</strong> ${r.last_seen_location||"N/A"}</li>
        </ul>

        <h3>Owner Contact</h3>
        <ul>
          <li><strong>Name:</strong> ${r.owner_name||"N/A"}</li>
          <li><strong>Phone:</strong> ${r.phone||"N/A"}</li>
          <li><strong>Email:</strong> ${r.email||"N/A"}</li>
        </ul>

        ${n?`
          <h3>Pet Photo</h3>
          <a href="${n}" target="_blank">
            <img src="${n}" alt="Lost Pet" style="max-width: 300px; border-radius: 8px;" />
          </a>
        `:""}

        <hr>
        <p style="font-size: 0.9em; color: #777;">Automated notification</p>
      </div>
    `;return await (0,p.Z)({to:"info@chipthem.com",subject:`New Lost Pet Report: ${r.pet_name??"Unnamed Pet"}`,html:c}),a.NextResponse.json({message:"Lost pet report received successfully!"},{status:200})}catch(t){let e=t instanceof Error?t.message:"Unknown error";return console.error("Error handling lost pet report:",e),a.NextResponse.json({message:`Failed to submit lost pet report: ${e}`},{status:500})}}let c=new s.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/reportLost/route",pathname:"/api/reportLost",filename:"route",bundlePath:"app/api/reportLost/route"},resolvedPagePath:"/home/chinnu/projects/chipthem/src/app/api/reportLost/route.ts",nextConfigOutput:"standalone",userland:o}),{workAsyncStorage:m,workUnitAsyncStorage:d,serverHooks:h}=c;function g(){return(0,l.patchFetch)({workAsyncStorage:m,workUnitAsyncStorage:d})}},63814:()=>{},24494:()=>{},46674:(e,t,r)=>{"use strict";r.d(t,{L:()=>o});let o=(0,r(49103).UU)("https://zwqngfcujvsaahykqisj.supabase.co",process.env.SUPABASE_SERVICE_ROLE_KEY)},57250:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});let o=new(r(14950)).u(process.env.RESEND_API_KEY||"");async function s({to:e,subject:t,html:r}){try{let s=await o.emails.send({from:"ChipThem <info@chipthem.com>",to:e,subject:t,html:r});if(s.error)return console.error("❌ Resend API error:",s.error),!1;return console.log("✅ Email sent successfully:",s.data?.id||s),!0}catch(e){return e instanceof Error?console.error("❌ Email send failed:",e.message):console.error("❌ Email send failed:",e),!1}}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[3465,3610,9103,4950],()=>r(74478));module.exports=o})();