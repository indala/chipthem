(()=>{var e={};e.id=6353,e.ids=[6353],e.modules={10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},77598:e=>{"use strict";e.exports=require("node:crypto")},80632:(e,r,s)=>{"use strict";s.r(r),s.d(r,{patchFetch:()=>g,routeModule:()=>u,serverHooks:()=>h,workAsyncStorage:()=>p,workUnitAsyncStorage:()=>d});var t={};s.r(t),s.d(t,{POST:()=>c});var o=s(40685),n=s(97626),a=s(93465),i=s(64764),l=s(57250);async function c(e){try{let{firstName:r,lastName:s,email:t,phoneNumber:o,subject:n,message:a,microchip_number:c,priorityLevel:u}=await e.json();if(!r||!s||!t||!n||!a)return i.NextResponse.json({success:!1,message:"Please fill in all required fields."},{status:400});let p=`New Contact Form Inquiry: ${n}`,d=`
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #0056b3;">New Contact Message</h2>
        <p>You have received a new message through the website contact form.</p>
        <hr style="border: 1px solid #ddd;">
        <h3 style="color: #333;">Contact Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${r} ${s}</li>
          <li><strong>Email:</strong> <a href="mailto:${t}">${t}</a></li>
          ${o?`<li><strong>Phone:</strong> ${o}</li>`:""}
        </ul>
        <h3 style="color: #333;">Message Details:</h3>
        <ul>
          <li><strong>Priority:</strong> ${u||"Not set"}</li>
          <li><strong>Subject:</strong> ${n}</li>
          ${c?`<li><strong>Microchip #:</strong> ${c}</li>`:""}
        </ul>
        <h3 style="color: #333;">Message:</h3>
        <div style="background-color: #f9f9f9; border: 1px solid #eee; padding: 15px; border-radius: 5px;">
          <p style="white-space: pre-wrap;">${a}</p>
        </div>
        <hr style="border: 1px solid #ddd;">
        <p style="font-size: 0.9em; color: #888;">This email was sent on ${new Date().toLocaleString()}.</p>
      </div>
    `;if(await (0,l.Z)({to:"info@chipthem.com",subject:p,html:d}))return i.NextResponse.json({success:!0,message:"Your message has been sent successfully!"});return i.NextResponse.json({success:!1,message:"Failed to send your message. Please try again later."},{status:500})}catch(e){return console.error("❌ Error handling contact form:",e),i.NextResponse.json({success:!1,message:"Internal server error. Please try again."},{status:500})}}let u=new o.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/contacts/route",pathname:"/api/contacts",filename:"route",bundlePath:"app/api/contacts/route"},resolvedPagePath:"/home/chinnu/projects/chipthem/src/app/api/contacts/route.ts",nextConfigOutput:"standalone",userland:t}),{workAsyncStorage:p,workUnitAsyncStorage:d,serverHooks:h}=u;function g(){return(0,a.patchFetch)({workAsyncStorage:p,workUnitAsyncStorage:d})}},63814:()=>{},24494:()=>{},57250:(e,r,s)=>{"use strict";s.d(r,{Z:()=>o});let t=new(s(14950)).u(process.env.RESEND_API_KEY||"");async function o({to:e,subject:r,html:s}){try{let o=await t.emails.send({from:"ChipThem <info@chipthem.com>",to:e,subject:r,html:s});if(o.error)return console.error("❌ Resend API error:",o.error),!1;return console.log("✅ Email sent successfully:",o.data?.id||o),!0}catch(e){return e instanceof Error?console.error("❌ Email send failed:",e.message):console.error("❌ Email send failed:",e),!1}}}};var r=require("../../../webpack-runtime.js");r.C(e);var s=e=>r(r.s=e),t=r.X(0,[4141,3610,4950],()=>s(80632));module.exports=t})();