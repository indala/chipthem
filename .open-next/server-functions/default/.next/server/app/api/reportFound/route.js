(()=>{var e={};e.id=6244,e.ids=[6244],e.modules={10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},77598:e=>{"use strict";e.exports=require("node:crypto")},68795:(e,r,t)=>{"use strict";t.r(r),t.d(r,{patchFetch:()=>m,routeModule:()=>d,serverHooks:()=>g,workAsyncStorage:()=>c,workUnitAsyncStorage:()=>h});var o={};t.r(o),t.d(o,{POST:()=>p});var n=t(40685),s=t(97626),i=t(93465),a=t(64764),l=t(46674),u=t(57250);async function p(e){try{let r=await e.formData(),t={},o=null;r.forEach((e,r)=>{"pet_photo"===r&&e instanceof File?o=e:t[r]=String(e)});let n=null;if(o){let e=`${Date.now()}_${o.name}`,{data:r,error:t}=await l.L.storage.from("pet-images").upload(e,o);if(t)throw Error(`Failed to upload image: ${t.message}`);let{data:s}=l.L.storage.from("pet-images").getPublicUrl(r.path);n=s.publicUrl}let{error:s}=await l.L.from("found_pet_reports").insert([{...t,pet_photo:n}]);if(s)throw Error(`Failed to save report: ${s.message}`);await (0,u.Z)({to:t.email,subject:"Thank You for Reporting a Found Pet",html:`
        <h1>Thank you for your report</h1>
        <p>We have received your found pet report. We will review the information and contact you if we have a match.</p>
        <p>Your help in reuniting a pet with its owner is greatly appreciated.</p>
      `});let i=`
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">🐾 New Found Pet Report</h2>
        <p>A new report for a found pet has been submitted:</p>
        <hr>

        <h3>Pet Details</h3>
        <ul>
          <li><strong>Type:</strong> ${t.pet_type||"N/A"}</li>
          <li><strong>Size:</strong> ${t.size||"N/A"}</li>
          <li><strong>Color:</strong> ${t.color||"N/A"}</li>
          <li><strong>Description:</strong> ${t.description||"N/A"}</li>
        </ul>

        <h3>Location</h3>
        <ul>
          <li><strong>Date Found:</strong> ${t.date_found||"N/A"}</li>
          <li><strong>Time Found:</strong> ${t.time_found||"N/A"}</li>
          <li><strong>Found At:</strong> ${t.found_location||"N/A"}</li>
          <li><strong>Current Location:</strong> ${t.current_location||"N/A"}</li>
        </ul>

        <h3>Finder Info</h3>
        <ul>
          <li><strong>Name:</strong> ${t.finder_name||"N/A"}</li>
          <li><strong>Phone:</strong> ${t.phone||"N/A"}</li>
          <li><strong>Email:</strong> ${t.email||"N/A"}</li>
        </ul>

        ${n?`
          <h3>Pet Photo</h3>
          <a href="${n}" target="_blank">
            <img src="${n}" alt="Found Pet" style="max-width: 300px; border-radius: 8px;" />
          </a>
          <p><a href="${n}" target="_blank">View full image</a></p>
        `:""}

        <hr>
        <p style="font-size: 0.9em; color: #777;">This is an automated email.</p>
      </div>
    `;return await (0,u.Z)({to:"info@chipthem.com",subject:"New Found Pet Report",html:i}),a.NextResponse.json({message:"✅ Found pet report received successfully!"},{status:200})}catch(r){let e=r instanceof Error?r.message:"Unknown error";return console.error("❌ Error handling found pet report:",e),a.NextResponse.json({message:`Failed to submit found pet report: ${e}`},{status:500})}}let d=new n.AppRouteRouteModule({definition:{kind:s.RouteKind.APP_ROUTE,page:"/api/reportFound/route",pathname:"/api/reportFound",filename:"route",bundlePath:"app/api/reportFound/route"},resolvedPagePath:"/home/chinnu/projects/chipthem/src/app/api/reportFound/route.ts",nextConfigOutput:"standalone",userland:o}),{workAsyncStorage:c,workUnitAsyncStorage:h,serverHooks:g}=d;function m(){return(0,i.patchFetch)({workAsyncStorage:c,workUnitAsyncStorage:h})}},63814:()=>{},24494:()=>{},46674:(e,r,t)=>{"use strict";t.d(r,{L:()=>o});let o=(0,t(49103).UU)("https://zwqngfcujvsaahykqisj.supabase.co",process.env.SUPABASE_SERVICE_ROLE_KEY)},57250:(e,r,t)=>{"use strict";t.d(r,{Z:()=>n});let o=new(t(14950)).u(process.env.RESEND_API_KEY||"");async function n({to:e,subject:r,html:t}){try{let n=await o.emails.send({from:"ChipThem <info@chipthem.com>",to:e,subject:r,html:t});if(n.error)return console.error("❌ Resend API error:",n.error),!1;return console.log("✅ Email sent successfully:",n.data?.id||n),!0}catch(e){return e instanceof Error?console.error("❌ Email send failed:",e.message):console.error("❌ Email send failed:",e),!1}}}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),o=r.X(0,[4141,3610,9103,4950],()=>t(68795));module.exports=o})();