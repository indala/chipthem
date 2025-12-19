(()=>{var e={};e.id=3289,e.ids=[3289],e.modules={10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},55511:e=>{"use strict";e.exports=require("crypto")},77598:e=>{"use strict";e.exports=require("node:crypto")},46700:(e,r,s)=>{"use strict";s.r(r),s.d(r,{patchFetch:()=>y,routeModule:()=>u,serverHooks:()=>h,workAsyncStorage:()=>m,workUnitAsyncStorage:()=>g});var i={};s.r(i),s.d(i,{POST:()=>d});var t=s(40685),n=s(97626),o=s(93465),a=s(64764),c=s(32883),l=s(57250),p=s(46674);async function d(e){try{let r=await e.json();if(!r.email||!r.clinicName||!r.password)return a.NextResponse.json({success:!1,message:"Missing required fields."},{status:400});let s=await Promise.allSettled([p.L.from("owners").select("id").eq("email",r.email.trim().toLowerCase()).maybeSingle(),p.L.from("admins").select("id").eq("email",r.email.trim().toLowerCase()).maybeSingle(),p.L.from("veterinary_clinics").select("id").eq("email",r.email.trim().toLowerCase()).maybeSingle()]);for(let e=0;e<s.length;e++){let r=s[e];if("rejected"===r.status)return console.error(`Email check error in table ${e}:`,r.reason),a.NextResponse.json({success:!1,message:"Server error while checking email uniqueness."},{status:500});if(r.value.error)return console.error(`Email check error in table ${e}:`,r.value.error),a.NextResponse.json({success:!1,message:"Server error while checking email uniqueness."},{status:500});if(r.value.data){let r=["owners","admins","veterinary_clinics"];return a.NextResponse.json({success:!1,message:`Registration Error: Email already registered in ${r[e]}.`},{status:400})}}let i=await c.Ay.hash(r.password,12),t={email:r.email.trim().toLowerCase(),password_hash:i,clinic_name:r.clinicName,contact_person:r.contact_person||null,license_number:r.veterinaryLicenseNumber||null,phone:r.phone||null,alt_phone:r.alt_phone||null,website:r.website||null,years_in_practice:r.yearsInPractice??null,street_address:r.streetAddress||null,city:r.city||null,state_province:r.stateProvince||null,postal_code:r.postalCode||null,country:r.country||null,operating_hours:r.operatingHours||null,provides_24h_emergency:!!r.provides24HourEmergency,microchip_services:!!r.microchip_services,has_microchip_scanners:!!r.hasMicrochipScanners,scanner_types:Array.isArray(r.scannerTypes)?r.scannerTypes:r.scannerTypes?[r.scannerTypes]:[],additional_services:Array.isArray(r.additionalServices)?r.additionalServices:r.additionalServices?[r.additionalServices]:[],specializations:Array.isArray(r.specializations)?r.specializations:r.specializations?[r.specializations]:[],terms_accepted:!!r.termsAccepted,data_accuracy_confirmed:!!r.dataAccuracyConfirmed,professional_confirmation:!!r.professionalConfirmation,consent_for_referrals:!!r.consentForReferrals,email_updates_opt_in:!!r.emailUpdatesOptIn,google_maps_url:r.googleMapsUrl||null,is_verified:!1,status:"pending"},{data:n,error:o}=await p.L.from("veterinary_clinics").insert([t]).select().single();if(o)return console.error("Supabase error:",o),a.NextResponse.json({success:!1,message:"Database insert failed.",error:o},{status:500});return await (0,l.Z)({to:"info@chipthem.com",subject:"\uD83D\uDC36 New Veterinary Clinic Registration",html:`
        <div style="font-family: Arial, sans-serif; padding: 16px; border: 1px solid #ddd;">
          <h2>🚨 New Veterinary Clinic Registration for Verification</h2>
          <p>A new veterinary clinic has registered and requires <strong>manual verification</strong>.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">

          <h3>🏥 Clinic Details (DB ID: ${n.id})</h3>
          <p><strong>Clinic Name:</strong> ${r.clinicName}</p>
          <p><strong>Contact Person:</strong> ${r.contact_person||"N/A"}</p>
          <p><strong>Email:</strong> ${r.email}</p>
          <p><strong>Phone:</strong> ${r.phone||"N/A"}</p>
          <p><strong>License Number:</strong> ${r.veterinaryLicenseNumber||"N/A"}</p>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
          <h3>Location</h3>
          <p><strong>Address:</strong> ${r.streetAddress||"N/A"}, ${r.city||"N/A"}</p>
          <p><strong>Country:</strong> ${r.country||"N/A"}</p>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
          <h3>Services</h3>
          <p><strong>Microchip Services:</strong> ${r.microchip_services?"Yes":"No"}</p>
          <p><strong>Has Scanners:</strong> ${r.hasMicrochipScanners?"Yes":"No"}</p>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
          <p style="font-weight: bold; color: red;">ACTION REQUIRED:</p>
          <p>
            Please review and approve this clinic in your admin panel:
            <a 
              href="https://chipthem.com/admin/verifications/veterinary" 
              target="_blank" 
              style="
                display: inline-block; 
                padding: 10px 20px; 
                background-color: #007bff; 
                color: white !important; 
                text-decoration: none; 
                border-radius: 5px; 
                font-weight: bold;
              "
            >
              Go to Veterinary Verifications
            </a>
          </p>
        </div>
      `}),await (0,l.Z)({to:r.email,subject:"✅ Thank you for registering your veterinary clinic",html:`
        <div style="font-family: Arial, sans-serif; padding: 16px; color: #333;">
          <h2>Thank you, ${r.contact_person||"Doctor"}!</h2>
          <p>We've received your clinic registration for <strong>${r.clinicName}</strong>.</p>
          <p>Your submission is currently <strong>pending verification</strong> by our admin team.</p>
          <p>Once verified, you'll receive a confirmation email and your clinic will become active.</p>
          <p>This review process typically takes <strong>24–48 hours</strong>.</p>
          <br/>
          <p>— ChipThem Team 🐾</p>
        </div>
      `}),a.NextResponse.json({success:!0,message:"Clinic registered successfully and notification emails sent.",data:n})}catch(e){return console.error("Veterinary register error:",e),a.NextResponse.json({success:!1,message:"Internal server error."},{status:500})}}let u=new t.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/veterinary/register/route",pathname:"/api/veterinary/register",filename:"route",bundlePath:"app/api/veterinary/register/route"},resolvedPagePath:"/home/chinnu/projects/chipthem/src/app/api/veterinary/register/route.ts",nextConfigOutput:"standalone",userland:i}),{workAsyncStorage:m,workUnitAsyncStorage:g,serverHooks:h}=u;function y(){return(0,o.patchFetch)({workAsyncStorage:m,workUnitAsyncStorage:g})}},63814:()=>{},24494:()=>{},46674:(e,r,s)=>{"use strict";s.d(r,{L:()=>i});let i=(0,s(49103).UU)("https://zwqngfcujvsaahykqisj.supabase.co",process.env.SUPABASE_SERVICE_ROLE_KEY)},57250:(e,r,s)=>{"use strict";s.d(r,{Z:()=>t});let i=new(s(14950)).u(process.env.RESEND_API_KEY||"");async function t({to:e,subject:r,html:s}){try{let t=await i.emails.send({from:"ChipThem <info@chipthem.com>",to:e,subject:r,html:s});if(t.error)return console.error("❌ Resend API error:",t.error),!1;return console.log("✅ Email sent successfully:",t.data?.id||t),!0}catch(e){return e instanceof Error?console.error("❌ Email send failed:",e.message):console.error("❌ Email send failed:",e),!1}}}};var r=require("../../../../webpack-runtime.js");r.C(e);var s=e=>r(r.s=e),i=r.X(0,[3465,3610,9103,4950,2883],()=>s(46700));module.exports=i})();