(()=>{var e={};e.id=3289,e.ids=[3289],e.modules={10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},55511:e=>{"use strict";e.exports=require("crypto")},77598:e=>{"use strict";e.exports=require("node:crypto")},46700:(e,r,s)=>{"use strict";s.r(r),s.d(r,{patchFetch:()=>h,routeModule:()=>d,serverHooks:()=>y,workAsyncStorage:()=>g,workUnitAsyncStorage:()=>m});var t={};s.r(t),s.d(t,{POST:()=>u});var n=s(40685),i=s(97626),o=s(93465),a=s(64764),c=s(32883),p=s(57250),l=s(46674);async function u(e){try{let r=await e.json();if(!r.email||!r.clinicName||!r.password)return a.NextResponse.json({success:!1,message:"Missing required fields."},{status:400});let{data:s,error:t}=await l.L.from("veterinary_clinics").select("id").eq("email",r.email.trim().toLowerCase()).maybeSingle();if(t)return console.error("Email check error:",t),a.NextResponse.json({success:!1,message:"Server error while checking email uniqueness."},{status:500});if(s)return a.NextResponse.json({success:!1,message:"Registration Error: This email is already registered."},{status:400});let n=await c.Ay.hash(r.password,12),i={email:r.email.trim().toLowerCase(),password:n,clinic_name:r.clinicName,contact_person:r.contact_person||null,license_number:r.veterinaryLicenseNumber||null,phone:r.phone||null,alt_phone:r.alt_phone||null,website:r.website||null,years_in_practice:r.yearsInPractice?Number(r.yearsInPractice):null,street_address:r.streetAddress||null,city:r.city||null,state_province:r.stateProvince||null,postal_code:r.postalCode||null,country:r.country||null,operating_hours:r.operatingHours||null,provides_24h_emergency:!!r.provides24HourEmergency,microchip_services:!!r.microchip_services,has_microchip_scanners:!!r.hasMicrochipScanners,scanner_types:Array.isArray(r.scannerTypes)?r.scannerTypes:r.scannerTypes?[r.scannerTypes]:[],additional_services:Array.isArray(r.additionalServices)?r.additionalServices:r.additionalServices?[r.additionalServices]:[],specializations:Array.isArray(r.specializations)?r.specializations:r.specializations?[r.specializations]:[],terms_accepted:!!r.termsAccepted,data_accuracy_confirmed:!!r.dataAccuracyConfirmed,professional_confirmation:!!r.professionalConfirmation,consent_for_referrals:!!r.consentForReferrals,email_updates_opt_in:!!r.emailUpdatesOptIn,is_verified:!1,status:"pending"},{data:o,error:u}=await l.L.from("veterinary_clinics").insert([i]).select().single();if(u)return console.error("Supabase error:",u),a.NextResponse.json({success:!1,message:"Database insert failed.",error:u},{status:500});return await (0,p.Z)({to:"info@chipthem.com",subject:"\uD83D\uDC36 New Veterinary Clinic Registration",html:`
  <h2>New Veterinary Clinic Registration</h2>
 
  <hr/>
  <h3>Primary Details</h3>
  <p><strong>Clinic Name:</strong> ${r.clinicName}</p>
  <p><strong>Contact Person:</strong> ${r.contact_person||"N/A"}</p>
  <p><strong>Email:</strong> ${r.email}</p>
  <p><strong>Phone:</strong> ${r.phone||"N/A"}</p>
  <p><strong>Alt. Phone:</strong> ${r.alt_phone||"N/A"}</p>
  <p><strong>Website:</strong> ${r.website||"N/A"}</p>
  <p><strong>License Number:</strong> ${r.veterinaryLicenseNumber||"N/A"}</p>
  <p><strong>Years in Practice:</strong> ${r.yearsInPractice||"N/A"}</p>

  <hr/>
  <h3>Location</h3>
  <p><strong>Street Address:</strong> ${r.streetAddress||"N/A"}</p>
  <p><strong>City:</strong> ${r.city||"N/A"}</p>
  <p><strong>State/Province:</strong> ${r.stateProvince||"N/A"}</p>
  <p><strong>Postal Code:</strong> ${r.postalCode||"N/A"}</p>
  <p><strong>Country:</strong> ${r.country||"N/A"}</p>

  <hr/>
  <h3>Services & Operations</h3>
  <p><strong>Operating Hours:</strong> ${r.operatingHours||"N/A"}</p>
  <p><strong>24H Emergency:</strong> ${r.provides24HourEmergency?"Yes":"No"}</p>
  <p><strong>Microchip Services:</strong> ${r.microchip_services?"Yes":"No"}</p>
  <p><strong>Has Microchip Scanners:</strong> ${r.hasMicrochipScanners?"Yes":"No"}</p>
  <p><strong>Scanner Types:</strong> ${Array.isArray(r.scannerTypes)?r.scannerTypes.join(", "):r.scannerTypes||"N/A"}</p>
  <p><strong>Specializations:</strong> ${Array.isArray(r.specializations)?r.specializations.join(", "):r.specializations||"N/A"}</p>
  <p><strong>Additional Services:</strong> ${Array.isArray(r.additionalServices)?r.additionalServices.join(", "):r.additionalServices||"N/A"}</p>

  <hr/>
  <h3>Legal Confirmations</h3>
  <p><strong>Terms Accepted:</strong> ${r.termsAccepted?"Yes":"No"}</p>
  <p><strong>Data Accuracy Confirmed:</strong> ${r.dataAccuracyConfirmed?"Yes":"No"}</p>
  <p><strong>Professional Confirmation:</strong> ${r.professionalConfirmation?"Yes":"No"}</p>
  <p><strong>Consent for Referrals:</strong> ${r.consentForReferrals?"Yes":"No"}</p>
  <p><strong>Email Updates Opt-in:</strong> ${r.emailUpdatesOptIn?"Yes":"No"}</p>

  <hr/>
  <p style="font-weight: bold; color: red;">ACTION REQUIRED:</p>
  <p>
   Please review and approve this clinic in your admin panel:
   <a 
    href="https://chipthem.com/admin/verifications/veterinary" 
    target="_blank" 
    style="
     display: inline-block; 
     padding: 8px 16px; 
     background-color: #007bff; 
     color: white !important; 
     text-decoration: none; 
     border-radius: 4px;
    "
   >
    Go to Veterinary Verifications
   </a>
  </p>
 `}),await (0,p.Z)({to:r.email,subject:"✅ Thank you for registering your veterinary clinic",html:`
        <h2>Thank you, ${r.contact_person||"Doctor"}!</h2>
        <p>We’ve received your clinic registration for <strong>${r.clinicName}</strong>.</p>
        <p>Our team will review your details and get back to you shortly.</p>
        <p>— ChipThem Team 🐾</p>
      `}),a.NextResponse.json({success:!0,message:"Clinic registered successfully and notification emails sent.",data:o})}catch(e){return console.error("Veterinary register error:",e),a.NextResponse.json({success:!1,message:"Internal server error."},{status:500})}}let d=new n.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/veterinary/register/route",pathname:"/api/veterinary/register",filename:"route",bundlePath:"app/api/veterinary/register/route"},resolvedPagePath:"/home/chinnu/projects/chipthem/src/app/api/veterinary/register/route.ts",nextConfigOutput:"standalone",userland:t}),{workAsyncStorage:g,workUnitAsyncStorage:m,serverHooks:y}=d;function h(){return(0,o.patchFetch)({workAsyncStorage:g,workUnitAsyncStorage:m})}},63814:()=>{},24494:()=>{},46674:(e,r,s)=>{"use strict";s.d(r,{L:()=>t});let t=(0,s(49103).UU)("https://zwqngfcujvsaahykqisj.supabase.co",process.env.SUPABASE_SERVICE_ROLE_KEY)},57250:(e,r,s)=>{"use strict";s.d(r,{Z:()=>n});let t=new(s(14950)).u(process.env.RESEND_API_KEY||"");async function n({to:e,subject:r,html:s}){try{let n=await t.emails.send({from:"ChipThem <info@chipthem.com>",to:e,subject:r,html:s});if(n.error)return console.error("❌ Resend API error:",n.error),!1;return console.log("✅ Email sent successfully:",n.data?.id||n),!0}catch(e){return e instanceof Error?console.error("❌ Email send failed:",e.message):console.error("❌ Email send failed:",e),!1}}}};var r=require("../../../../webpack-runtime.js");r.C(e);var s=e=>r(r.s=e),t=r.X(0,[4141,3610,9103,2883,4950],()=>s(46700));module.exports=t})();