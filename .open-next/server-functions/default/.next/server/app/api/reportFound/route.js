(()=>{var e={};e.id=6244,e.ids=[6244],e.modules={10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},77598:e=>{"use strict";e.exports=require("node:crypto")},68795:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>f,routeModule:()=>d,serverHooks:()=>m,workAsyncStorage:()=>c,workUnitAsyncStorage:()=>h});var o={};r.r(o),r.d(o,{POST:()=>p});var n=r(40685),s=r(97626),i=r(93465),a=r(64764),l=r(46674),u=r(57250);async function p(e){try{let t=await e.formData(),r={},o=null,n=null;t.forEach((e,t)=>{"pet_photo"===t&&"string"!=typeof e?(o=e,n=e.name??`pet_${Date.now()}`):r[t]=e});let s=null;if(o&&n){let e=`${Date.now()}_${n}`,{data:t,error:r}=await l.L.storage.from("pet_photos").upload(e,o);if(r)throw Error(`Failed to upload image: ${r.message}`);let{data:i}=l.L.storage.from("pet_photos").getPublicUrl(t.path);s=i.publicUrl}let i={pet_type:r.pet_type??null,color:r.color??null,size:r.size??null,pet_photo:s,found_location:r.found_location??null,status:"unresolved",description:r.description??null,date_found:r.date_found??null,time_found:r.time_found??null,finder_name:r.finder_name??null,phone:r.phone??null,email:r.email??null,current_location:r.current_location??null},{error:p}=await l.L.from("found_reports").insert([i]);if(p)throw Error(`Failed to save report: ${p.message}`);r.email&&await (0,u.Z)({to:r.email.toString(),subject:"Thank You for Reporting a Found Pet",html:`
          <h1>Thank you for your report</h1>
          <p>We have received your found pet report. We will review the information and contact you if we have a match.</p>
          <p>Your help in reuniting a pet with its owner is greatly appreciated.</p>
        `});let d=`
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>🐾 New Found Pet Report</h2>
        <hr>

        <h3>Pet Details</h3>
        <ul>
          <li><strong>Type:</strong> ${r.pet_type||"N/A"}</li>
          <li><strong>Size:</strong> ${r.size||"N/A"}</li>
          <li><strong>Color:</strong> ${r.color||"N/A"}</li>
          <li><strong>Description:</strong> ${r.description||"N/A"}</li>
        </ul>

        <h3>Location</h3>
        <ul>
          <li><strong>Date Found:</strong> ${r.date_found||"N/A"}</li>
          <li><strong>Time Found:</strong> ${r.time_found||"N/A"}</li>
          <li><strong>Found At:</strong> ${r.found_location||"N/A"}</li>
          <li><strong>Current Location:</strong> ${r.current_location||"N/A"}</li>
        </ul>

        <h3>Finder Info</h3>
        <ul>
          <li><strong>Name:</strong> ${r.finder_name||"N/A"}</li>
          <li><strong>Phone:</strong> ${r.phone||"N/A"}</li>
          <li><strong>Email:</strong> ${r.email||"N/A"}</li>
        </ul>

        ${s?`
          <h3>Pet Photo</h3>
          <a href="${s}" target="_blank">
            <img src="${s}" style="max-width: 300px; border-radius: 8px;" />
          </a>
        `:""}

        <hr>
        <p style="font-size: 0.9em; color: #777;">Automated message</p>
      </div>
    `;return await (0,u.Z)({to:"info@chipthem.com",subject:"New Found Pet Report",html:d}),a.NextResponse.json({message:"Found pet report received successfully"},{status:200})}catch(t){let e=t instanceof Error?t.message:"Unknown error";return console.error("Error handling found pet report:",e),a.NextResponse.json({message:`Failed to submit found pet report: ${e}`},{status:500})}}let d=new n.AppRouteRouteModule({definition:{kind:s.RouteKind.APP_ROUTE,page:"/api/reportFound/route",pathname:"/api/reportFound",filename:"route",bundlePath:"app/api/reportFound/route"},resolvedPagePath:"/home/chinnu/projects/chipthem/src/app/api/reportFound/route.ts",nextConfigOutput:"standalone",userland:o}),{workAsyncStorage:c,workUnitAsyncStorage:h,serverHooks:m}=d;function f(){return(0,i.patchFetch)({workAsyncStorage:c,workUnitAsyncStorage:h})}},63814:()=>{},24494:()=>{},46674:(e,t,r)=>{"use strict";r.d(t,{L:()=>o});let o=(0,r(49103).UU)("https://zwqngfcujvsaahykqisj.supabase.co",process.env.SUPABASE_SERVICE_ROLE_KEY)},57250:(e,t,r)=>{"use strict";r.d(t,{Z:()=>n});let o=new(r(14950)).u(process.env.RESEND_API_KEY||"");async function n({to:e,subject:t,html:r}){try{let n=await o.emails.send({from:"ChipThem <info@chipthem.com>",to:e,subject:t,html:r});if(n.error)return console.error("❌ Resend API error:",n.error),!1;return console.log("✅ Email sent successfully:",n.data?.id||n),!0}catch(e){return e instanceof Error?console.error("❌ Email send failed:",e.message):console.error("❌ Email send failed:",e),!1}}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[3465,3610,9103,4950],()=>r(68795));module.exports=o})();