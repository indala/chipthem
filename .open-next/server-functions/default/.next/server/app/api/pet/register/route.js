(()=>{var e={};e.id=2263,e.ids=[2263],e.modules={10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},55511:e=>{"use strict";e.exports=require("crypto")},77598:e=>{"use strict";e.exports=require("node:crypto")},26031:(e,r,t)=>{"use strict";t.r(r),t.d(r,{patchFetch:()=>f,routeModule:()=>m,serverHooks:()=>h,workAsyncStorage:()=>u,workUnitAsyncStorage:()=>g});var s={};t.r(s),t.d(s,{POST:()=>l});var o=t(40685),i=t(97626),n=t(93465),a=t(64764),c=t(46674),p=t(32883),d=t(57250);async function l(e){try{let r=await e.json();for(let e of["fullName","email","password","confirmPassword","phoneNumber","streetAddress","city","country","microchipNumber","petName","petType","breed","sex","primaryColor","termsAccepted","dataAccuracyConfirmed","ownershipConfirmed"])if(!r[e])return a.NextResponse.json({success:!1,message:`Validation Error: The field '${e}' is required.`},{status:400});if(r.password!==r.confirmPassword)return a.NextResponse.json({success:!1,message:"Validation Error: Passwords do not match."},{status:400});if(!/^\d{15}$/.test(r.microchipNumber))return a.NextResponse.json({success:!1,message:"Validation Error: Microchip number must be exactly 15 digits."},{status:400});let{data:t,error:s}=await c.L.from("owners").select("id").eq("email",r.email.trim().toLowerCase()).maybeSingle();if(s)return console.error("Email check error:",s),a.NextResponse.json({success:!1,message:"Server error while checking email uniqueness."},{status:500});if(t)return a.NextResponse.json({success:!1,message:"Registration Error: Email already registered."},{status:400});let{data:o,error:i}=await c.L.from("pets").select("id").eq("microchip_number",r.microchipNumber.trim()).maybeSingle();if(i)return console.error("Microchip check error:",i),a.NextResponse.json({success:!1,message:"Server error while checking microchip uniqueness."},{status:500});if(o)return a.NextResponse.json({success:!1,message:"Registration Error: Microchip number already registered."},{status:400});let n=await p.Ay.hash(r.password,12),{data:l,error:m}=await c.L.from("owners").insert([{full_name:r.fullName.trim(),email:r.email.trim().toLowerCase(),password_hash:n,phone_number:r.phoneNumber?.trim(),street_address:r.streetAddress?.trim(),city:r.city?.trim(),country:r.country?.trim(),terms_accepted:r.termsAccepted,data_accuracy_confirmed:r.dataAccuracyConfirmed,ownership_confirmed:r.ownershipConfirmed,is_verified:!1,status:"pending"}]).select("id").single();if(m||!l)return console.error("❌ Owner insert error:",m),a.NextResponse.json({success:!1,message:"Database Error: Failed to register owner."},{status:500});let{error:u}=await c.L.from("pets").insert([{owner_id:l.id,microchip_number:r.microchipNumber.trim(),pet_name:r.petName.trim(),pet_type:r.petType?.trim(),breed:r.breed?.trim(),sex:r.sex?.trim(),primary_color:r.primaryColor?.trim(),is_verified:!1,status:"pending"}]);if(u){console.error("❌ Pet insert error:",u);let{error:e}=await c.L.from("owners").delete().eq("id",l.id);return e?console.error("⚠️ CRITICAL ROLLBACK FAILED: Orphaned owner record:",e):console.log(`✅ Orphaned Owner (ID: ${l.id}) successfully rolled back.`),a.NextResponse.json({success:!1,message:"Database Error: Failed to register pet (Owner rolled back)."},{status:500})}let g=`
  <div style="font-family: Arial, sans-serif; padding: 16px; border: 1px solid #ddd;">
    <h2>🚨 New Pet/Owner Registration for Verification</h2>
    <p>A new pet owner and pet have registered and require **manual verification**.</p>
    <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">

    <h3>👤 Owner Details (DB ID: ${l.id})</h3>
    <p><strong>Full Name:</strong> ${r.fullName}</p>
    <p><strong>Email:</strong> ${r.email}</p>
    <p><strong>Phone Number:</strong> ${r.phoneNumber}</p>
    <p><strong>Address:</strong> ${r.streetAddress}, ${r.city}, ${r.country}</p>
    
    <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">

    <h3>🐶 Pet Details</h3>
    <p><strong>Pet Name:</strong> ${r.petName}</p>
    <p><strong>Microchip Number:</strong> <strong style="color: blue;">${r.microchipNumber}</strong></p>
    <p><strong>Pet Type:</strong> ${r.petType}</p>
    <p><strong>Breed:</strong> ${r.breed}</p>
    <p><strong>Sex:</strong> ${r.sex}</p>
    <p><strong>Primary Color:</strong> ${r.primaryColor}</p>

    <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">

    <h3>✅ Legal Confirmations</h3>
    <p><strong>Terms Accepted:</strong> ${r.termsAccepted?"Yes":"No"}</p>
    <p><strong>Data Accuracy Confirmed:</strong> ${r.dataAccuracyConfirmed?"Yes":"No"}</p>
    <p><strong>Ownership Confirmed:</strong> ${r.ownershipConfirmed?"Yes":"No"}</p>

    <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
    <p style="font-weight: bold; color: red;">ACTION REQUIRED:</p>
    <p>
      Please review and approve this registration in your admin panel:
      <a 
        href="https://chipthem.com/admin/verifications/petOwner" 
        target="_blank" 
        style="
          display: inline-block; 
          padding: 10px 20px; 
          background-color: #28a745; 
          color: white !important; 
          text-decoration: none; 
          border-radius: 5px; 
          font-weight: bold;
        "
      >
        Go to Pet Owner Verifications
      </a>
    </p>
  </div>
`;await (0,d.Z)({to:"info@chipthem.com",subject:`🚨 New Pet Microchip Registration: ${r.petName} (${r.microchipNumber})`,html:g});let h=`
<div style="font-family: Arial, sans-serif; padding: 16px; color: #333;">
 <h2>🐾 Thank you for registering with ChipThem, ${r.fullName}!</h2>
 <p>We’ve received your registration for <strong>${r.petName}</strong>.</p>
 <p><strong>Microchip Number:</strong> ${r.microchipNumber}</p>
 <p>Your submission is currently <strong>pending verification</strong> by our admin team.
 Once verified, you’ll receive a confirmation email and your pet’s registration will become active.</p>
 <p>This review process typically takes <strong>24–48 hours</strong>.</p>
 <br/>
 <p>If any additional information is needed, we’ll contact you at <strong>${r.email}</strong>.</p>
 <p>Thank you for helping us ensure the safety and lifelong protection of all pets!</p>
 <br/>
 <p>Warm regards,<br/><strong>The ChipThem Verification Team</strong></p>
</div>
`;return await (0,d.Z)({to:r.email,subject:"Welcome to ChipThem - Pet Registration Successful",html:h}),console.log("✅ Pet registration successful:",r.email),a.NextResponse.json({success:!0,message:"Pet registration successful! A confirmation email has been sent."})}catch(e){return e instanceof Error?console.error("❌ Registration error:",e.message):console.error("❌ Registration error:",e),a.NextResponse.json({success:!1,message:"Internal server error: A critical error occurred during registration."},{status:500})}}let m=new o.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/pet/register/route",pathname:"/api/pet/register",filename:"route",bundlePath:"app/api/pet/register/route"},resolvedPagePath:"/home/chinnu/projects/chipthem/src/app/api/pet/register/route.ts",nextConfigOutput:"standalone",userland:s}),{workAsyncStorage:u,workUnitAsyncStorage:g,serverHooks:h}=m;function f(){return(0,n.patchFetch)({workAsyncStorage:u,workUnitAsyncStorage:g})}},63814:()=>{},24494:()=>{},46674:(e,r,t)=>{"use strict";t.d(r,{L:()=>s});let s=(0,t(49103).UU)("https://zwqngfcujvsaahykqisj.supabase.co",process.env.SUPABASE_SERVICE_ROLE_KEY)},57250:(e,r,t)=>{"use strict";t.d(r,{Z:()=>o});let s=new(t(14950)).u(process.env.RESEND_API_KEY||"");async function o({to:e,subject:r,html:t}){try{let o=await s.emails.send({from:"ChipThem <info@chipthem.com>",to:e,subject:r,html:t});if(o.error)return console.error("❌ Resend API error:",o.error),!1;return console.log("✅ Email sent successfully:",o.data?.id||o),!0}catch(e){return e instanceof Error?console.error("❌ Email send failed:",e.message):console.error("❌ Email send failed:",e),!1}}}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[4141,3610,9103,2883,4950],()=>t(26031));module.exports=s})();