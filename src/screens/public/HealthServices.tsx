import svgPaths from "../../components/icons/IconCircleDecor";
const imgImageAlmusSmartHydrationStation = "/assets/images/Hydrationstation.png";
const imgImageAlmusInstalledInProfessionalTrainingFacility = "/assets/images/trainingfacility.png";
const imgImageLemonFlavor = "/assets/images/lemon.png";
const imgImageBerryFlavor = "/assets/images/berry.png";
const imgImageCitrusFlavor = "/assets/images/citrus.png";
const imgImageTropicalFlavor = "/assets/images/tropical.png";
const imgImageGymsFitnessCenters = "/assets/images/fitnesscenters.png";
const imgImageTrainingFacilities = "/assets/images/trainingfacilities.png";
const imgImageSportsClubs = "/assets/images/sportclubs.jpg";
const imgImageWellnessSpaces = "/assets/images/wellnessSpaces.png";
function Container() {
  return <div className="absolute bg-[rgba(0,229,255,0.1)] blur-[140px] left-[274px] rounded-[33554400px] size-[500px] top-[202.5px]" data-name="Container" />;
}

function Container1() {
  return <div className="absolute bg-[rgba(0,229,255,0.05)] blur-[120px] left-[422px] rounded-[33554400px] size-[400px] top-[207.5px]" data-name="Container" />;
}

function ImageAlmusSmartHydrationStation() {
  return (
    <div className="absolute h-[461px] left-[524px] rounded-[32px] top-[106px] w-[476px]" data-name="Image (ALMUS Smart Hydration Station)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[32px] size-full" src={imgImageAlmusSmartHydrationStation} />
    </div>
  );
}

function Heading() {
  return (
    <div className="absolute h-[57.594px] left-0 shadow-[0px_2px_40px_0px_rgba(0,0,0,0.8)] top-0 w-[476px]" data-name="Heading 1">
      <p className="absolute font-['Playfair:Bold',sans-serif] font-bold leading-[57.6px] left-0 text-[64px] text-white top-0" style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}>
        ALMUS
      </p>
    </div>
  );
}

function Container5() {
  return <div className="absolute bg-[#00e5ff] h-[6px] left-0 rounded-[33554400px] shadow-[0px_0px_20px_0px_rgba(0,229,255,0.8)] top-[73.59px] w-[128px]" data-name="Container" />;
}

function Container4() {
  return (
    <div className="h-[88px] relative shrink-0 w-full" data-name="Container">
      <Heading />
      <Container5 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[30px] left-0 not-italic text-[24px] text-[rgba(255,255,255,0.9)] top-px tracking-[0.5px]">Smart Hydration Station</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[113px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[34px] left-0 not-italic text-[24px] text-[rgba(255,255,255,0.7)] top-px w-[470px] whitespace-pre-wrap">ALMUS delivers flavored, low-calorie beverages designed to support hydration, recovery, and performance in active environments.</p>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[#00e5ff] h-[56px] left-0 rounded-[33554400px] shadow-[0px_0px_20px_0px_rgba(0,229,255,0.3)] top-[36.41px] w-[222px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Poppins:SemiBold',sans-serif] leading-[24px] left-[calc(50%+0.5px)] not-italic text-[16px] text-black text-center top-[calc(50%-12px)]">Request a quote</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] border-2 border-[rgba(255,255,255,0.2)] border-solid h-[56px] left-[248px] rounded-[33554400px] top-[36.41px] w-[222px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Poppins:SemiBold',sans-serif] leading-[24px] left-1/2 not-italic text-[16px] text-center text-white top-[14px]">Contact ULTIMA</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[72px] relative shrink-0 w-full" data-name="Container">
      <Button />
      <Button1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[14px] h-[379.594px] items-start left-0 top-[147px] w-[476px]" data-name="Container">
      <Container4 />
      <Heading1 />
      <Paragraph />
      <Container6 />
    </div>
  );
}

function Container8() {
  return <div className="absolute blur-[24px] h-[392px] left-0 top-0 w-[476px]" data-name="Container" style={{ backgroundImage: "linear-gradient(140.528deg, rgba(0, 229, 255, 0.2) 0%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function Container7() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[461px] left-[524px] overflow-clip rounded-[32px] shadow-[0px_20px_60px_0px_rgba(0,0,0,0.6)] top-[106px] w-[476px]" data-name="Container">
      <Container8 />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute h-[714px] left-[48px] top-[32px] w-[1000px]" data-name="Container">
      <ImageAlmusSmartHydrationStation />
      <Container3 />
      <Container7 />
    </div>
  );
}

function Section() {
  return (
    <div className="bg-gradient-to-b from-[#0a0e1a] h-[643px] overflow-clip relative shrink-0 to-[#050810] via-1/2 via-[#0f1425] w-full" data-name="Section">
      <Container />
      <Container1 />
      <Container2 />
    </div>
  );
}

function Container9() {
  return <div className="absolute bg-[rgba(0,229,255,0.05)] blur-[120px] left-[322px] rounded-[33554400px] size-[500px] top-[347.19px]" data-name="Container" />;
}

function Paragraph1() {
  return (
    <div className="absolute h-[204px] left-0 top-[213px] w-[436px]" data-name="Paragraph">
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[34px] left-0 not-italic text-[24px] text-[rgba(255,255,255,0.7)] top-px w-[433px] whitespace-pre-wrap">ALMUS is an on-site hydration station that mixes water with light flavors to offer refreshing, low-calorie drinks. Built for high-traffic environments, it enhances user experience while remaining simple and reliable for facility operators.</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute h-[502.375px] left-[500px] top-[35px] w-[436px]" data-name="Container">
      <Paragraph1 />
    </div>
  );
}

function Container12() {
  return <div className="absolute bg-[#00e5ff] h-[4px] left-[-32px] rounded-[33554400px] shadow-[0px_0px_12px_0px_rgba(0,229,255,0.8)] top-[158px] w-[96px]" data-name="Container" />;
}

function ImageAlmusInstalledInProfessionalTrainingFacility() {
  return (
    <div className="absolute h-[368px] left-0 top-0 w-[436px]" data-name="Image (ALMUS installed in professional training facility)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageAlmusInstalledInProfessionalTrainingFacility} />
    </div>
  );
}

function Container14() {
  return <div className="absolute h-[368px] left-0 top-0 w-[436px]" data-name="Container" style={{ backgroundImage: "linear-gradient(139.834deg, rgba(0, 229, 255, 0.1) 0%, rgba(0, 0, 0, 0) 100%)" }} />;
}

function Container13() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[272px] left-0 overflow-clip rounded-[32px] shadow-[0px_20px_60px_0px_rgba(0,0,0,0.6)] top-[214px] w-[436px]" data-name="Container">
      <ImageAlmusInstalledInProfessionalTrainingFacility />
      <Container14 />
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute h-[502.375px] left-[80px] top-[96px] w-[936px]" data-name="Container">
      <Container11 />
      <Container12 />
      <Container13 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="absolute h-[246px] left-[298px] shadow-[0px_2px_20px_0px_rgba(0,0,0,0.6)] top-[-83px] w-[704px]" data-name="Heading 2">
      <p className="absolute font-['Playfair:Bold',sans-serif] font-bold leading-[61.6px] left-[-250px] text-[64px] text-white top-[183px] w-[704px] whitespace-pre-wrap" style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}>
        A hydration solution designed for your facility
      </p>
    </div>
  );
}

function Section1() {
  return (
    <div className="bg-gradient-to-b from-[#0f1425] h-[694.375px] overflow-clip relative shrink-0 to-[#0a0e1a] w-full" data-name="Section">
      <Container9 />
      <Container10 />
      <Heading2 />
    </div>
  );
}

function Container15() {
  return <div className="absolute bg-[rgba(0,229,255,0.05)] blur-[140px] left-[248px] rounded-[33554400px] size-[600px] top-[1300px]" data-name="Container" />;
}

function Heading3() {
  return <div className="absolute h-[202px] left-0 shadow-[0px_2px_20px_0px_rgba(0,0,0,0.6)] top-[38px] w-[548px]" data-name="Heading 2" />;
}

function Container17() {
  return <div className="absolute bg-[#00e5ff] h-[6px] left-[-32px] rounded-[33554400px] shadow-[0px_0px_16px_0px_rgba(0,229,255,0.8)] top-[97.16px] w-[128px]" data-name="Container" />;
}

function Container16() {
  return (
    <div className="absolute h-[111px] left-[88px] top-[210.63px] w-[436px]" data-name="Container">
      <Heading3 />
      <Container17 />
    </div>
  );
}

function Paragraph2() {
  return <div className="absolute h-[102px] left-[41px] top-[160.09px] w-[474px]" data-name="Paragraph" />;
}

function Heading4() {
  return (
    <div className="absolute h-[74px] left-[42px] top-[49px] w-[474px]" data-name="Heading 3">
      <p className="absolute font-['Poppins:Bold',sans-serif] leading-[36.4px] left-0 not-italic text-[24px] text-white top-[0.91px] w-[466px] whitespace-pre-wrap">Encourages consistent hydration during training</p>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[40px] top-[48px]">
      <Heading4 />
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[34px] left-[41px] not-italic text-[24px] text-[rgba(255,255,255,0.7)] top-[130px] w-[468px] whitespace-pre-wrap">Keep members properly hydrated throughout their workout sessions</p>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] border-solid h-[246px] left-[523px] rounded-[32px] shadow-[0px_20px_60px_0px_rgba(0,0,0,0.6)] top-[412.63px] w-[525px]" data-name="Container">
      <Paragraph2 />
      <Group1 />
    </div>
  );
}

function Paragraph3() {
  return <div className="absolute h-[102px] left-[41px] top-[160.09px] w-[474px]" data-name="Paragraph" />;
}

function Heading5() {
  return (
    <div className="absolute h-[74px] left-[42px] top-[49px] w-[474px]" data-name="Heading 3">
      <p className="absolute font-['Poppins:Bold',sans-serif] leading-[36.4px] left-0 not-italic text-[24px] text-white top-[0.91px] w-[466px] whitespace-pre-wrap">Encourages consistent hydration during training</p>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-[40px] top-[48px]">
      <Heading5 />
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[34px] left-[41px] not-italic text-[24px] text-[rgba(255,255,255,0.7)] top-[130px] w-[468px] whitespace-pre-wrap">Keep members properly hydrated throughout their workout sessions</p>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] border-solid h-[246px] left-[523px] rounded-[32px] shadow-[0px_20px_60px_0px_rgba(0,0,0,0.6)] top-[743.63px] w-[525px]" data-name="Container">
      <Paragraph3 />
      <Group2 />
    </div>
  );
}

function Paragraph4() {
  return <div className="absolute h-[102px] left-[41px] top-[160.09px] w-[474px]" data-name="Paragraph" />;
}

function Heading6() {
  return (
    <div className="absolute h-[74px] left-[42px] top-[49px] w-[474px]" data-name="Heading 3">
      <p className="absolute font-['Poppins:Bold',sans-serif] leading-[36.4px] left-0 not-italic text-[24px] text-white top-[0.91px] w-[466px] whitespace-pre-wrap">Encourages consistent hydration during training</p>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents left-[40px] top-[48px]">
      <Heading6 />
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[34px] left-[41px] not-italic text-[24px] text-[rgba(255,255,255,0.7)] top-[130px] w-[468px] whitespace-pre-wrap">Keep members properly hydrated throughout their workout sessions</p>
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] border-solid h-[235px] left-[523px] rounded-[32px] shadow-[0px_20px_60px_0px_rgba(0,0,0,0.6)] top-[92.63px] w-[525px]" data-name="Container">
      <Paragraph4 />
      <Group3 />
    </div>
  );
}

function Section2() {
  return (
    <div className="bg-gradient-to-b from-[#0a0e1a] h-[1007px] overflow-clip relative shrink-0 to-[#0a0e1a] via-1/2 via-[#0f1425] w-full" data-name="Section">
      <Container15 />
      <Container16 />
      <p className="absolute font-['Playfair_Display:Bold',sans-serif] font-bold h-[91px] leading-[70.4px] left-[56px] text-[64px] text-white top-[141.63px] w-[444px] whitespace-pre-wrap">Why choose ALMUS</p>
      <Container18 />
      <Container19 />
      <Container20 />
    </div>
  );
}

function Container21() {
  return <div className="absolute bg-[rgba(0,229,255,0.05)] blur-[120px] left-[365.33px] rounded-[33554400px] size-[500px] top-[181.02px]" data-name="Container" />;
}

function Heading7() {
  return (
    <div className="h-[61.594px] relative shadow-[0px_2px_20px_0px_rgba(0,0,0,0.6)] shrink-0 w-full" data-name="Heading 2">
      <p className="-translate-x-1/2 absolute font-['Playfair:Bold',sans-serif] font-bold leading-[61.6px] left-[383.75px] text-[62px] text-center text-white top-0" style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}>
        Flavored hydration options
      </p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[68px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Poppins:Regular',sans-serif] leading-[34px] left-[calc(50%+0.5px)] not-italic text-[24px] text-[rgba(255,255,255,0.7)] text-center top-[1.03px] w-[761px] whitespace-pre-wrap">ALMUS offers a range of light, refreshing flavors formulated for regular consumption in active environments.</p>
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] h-[210.094px] items-start left-[84px] top-0 w-[768px]" data-name="Container">
      <Heading7 />
      <Paragraph5 />
    </div>
  );
}

function ImageLemonFlavor() {
  return (
    <div className="absolute h-[256px] left-0 top-0 w-[214px]" data-name="Image (Lemon flavor)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageLemonFlavor} />
    </div>
  );
}

function Container27() {
  return <div className="absolute bg-gradient-to-t from-[rgba(0,0,0,0.8)] h-[256px] left-0 to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(0,0,0,0.4)] w-[214px]" data-name="Container" />;
}

function Container28() {
  return <div className="absolute bg-gradient-to-t from-[rgba(255,215,0,0.25)] h-[256px] left-0 opacity-20 to-[rgba(0,0,0,0)] top-0 w-[214px]" data-name="Container" />;
}

function Container26() {
  return (
    <div className="absolute h-[256px] left-px overflow-clip top-px w-[214px]" data-name="Container">
      <ImageLemonFlavor />
      <Container27 />
      <Container28 />
    </div>
  );
}

function Heading8() {
  return (
    <div className="absolute h-[36px] left-[24px] top-[24px] w-[166px]" data-name="Heading 3">
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[36px] left-0 not-italic text-[24px] text-white top-px">Lemon</p>
    </div>
  );
}

function Container30() {
  return <div className="absolute bg-[#ffd700] h-[4px] left-[24px] rounded-[33554400px] shadow-[0px_0px_12px_0px_rgba(255,255,255,0.4)] top-[68px] w-[64px]" data-name="Container" />;
}

function Container29() {
  return (
    <div className="absolute h-[96px] left-px top-[161px] w-[214px]" data-name="Container">
      <Heading8 />
      <Container30 />
    </div>
  );
}

function Container25() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] col-[1] relative rounded-[24px] row-[1] self-stretch shrink-0" data-name="Container">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Container26 />
        <Container29 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[24px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.4)]" />
    </div>
  );
}

function ImageBerryFlavor() {
  return (
    <div className="absolute h-[256px] left-0 top-0 w-[214px]" data-name="Image (Berry flavor)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageBerryFlavor} />
    </div>
  );
}

function Container33() {
  return <div className="absolute bg-gradient-to-t from-[rgba(0,0,0,0.8)] h-[256px] left-0 to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(0,0,0,0.4)] w-[214px]" data-name="Container" />;
}

function Container34() {
  return <div className="absolute bg-gradient-to-t from-[rgba(220,20,60,0.25)] h-[256px] left-0 opacity-20 to-[rgba(0,0,0,0)] top-0 w-[214px]" data-name="Container" />;
}

function Container32() {
  return (
    <div className="absolute h-[256px] left-px overflow-clip top-px w-[214px]" data-name="Container">
      <ImageBerryFlavor />
      <Container33 />
      <Container34 />
    </div>
  );
}

function Heading9() {
  return (
    <div className="absolute h-[36px] left-[24px] top-[24px] w-[166px]" data-name="Heading 3">
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[36px] left-0 not-italic text-[24px] text-white top-px">Berry</p>
    </div>
  );
}

function Container36() {
  return <div className="absolute bg-[#dc143c] h-[4px] left-[24px] rounded-[33554400px] shadow-[0px_0px_12px_0px_rgba(255,255,255,0.4)] top-[68px] w-[64px]" data-name="Container" />;
}

function Container35() {
  return (
    <div className="absolute h-[96px] left-px top-[161px] w-[214px]" data-name="Container">
      <Heading9 />
      <Container36 />
    </div>
  );
}

function Container31() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] col-[2] relative rounded-[24px] row-[1] self-stretch shrink-0" data-name="Container">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Container32 />
        <Container35 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[24px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.4)]" />
    </div>
  );
}

function ImageCitrusFlavor() {
  return (
    <div className="absolute h-[256px] left-0 top-0 w-[214px]" data-name="Image (Citrus flavor)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageCitrusFlavor} />
    </div>
  );
}

function Container39() {
  return <div className="absolute bg-gradient-to-t from-[rgba(0,0,0,0.8)] h-[256px] left-0 to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(0,0,0,0.4)] w-[214px]" data-name="Container" />;
}

function Container40() {
  return <div className="absolute bg-gradient-to-t from-[rgba(255,140,0,0.25)] h-[256px] left-0 opacity-20 to-[rgba(0,0,0,0)] top-0 w-[214px]" data-name="Container" />;
}

function Container38() {
  return (
    <div className="absolute h-[256px] left-px overflow-clip top-px w-[214px]" data-name="Container">
      <ImageCitrusFlavor />
      <Container39 />
      <Container40 />
    </div>
  );
}

function Heading10() {
  return (
    <div className="absolute h-[36px] left-[24px] top-[24px] w-[166px]" data-name="Heading 3">
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[36px] left-0 not-italic text-[24px] text-white top-px">Orange</p>
    </div>
  );
}

function Container42() {
  return <div className="absolute bg-[#ff8c00] h-[4px] left-[24px] rounded-[33554400px] shadow-[0px_0px_12px_0px_rgba(255,255,255,0.4)] top-[68px] w-[64px]" data-name="Container" />;
}

function Container41() {
  return (
    <div className="absolute h-[96px] left-px top-[161px] w-[214px]" data-name="Container">
      <Heading10 />
      <Container42 />
    </div>
  );
}

function Container37() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] col-[3] relative rounded-[24px] row-[1] self-stretch shrink-0" data-name="Container">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Container38 />
        <Container41 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[24px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.4)]" />
    </div>
  );
}

function ImageTropicalFlavor() {
  return (
    <div className="absolute h-[256px] left-0 top-0 w-[214px]" data-name="Image (Tropical flavor)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageTropicalFlavor} />
    </div>
  );
}

function Container45() {
  return <div className="absolute bg-gradient-to-t from-[rgba(0,0,0,0.8)] h-[256px] left-0 to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(0,0,0,0.4)] w-[214px]" data-name="Container" />;
}

function Container46() {
  return <div className="absolute bg-gradient-to-t from-[rgba(255,99,71,0.25)] h-[256px] left-0 opacity-20 to-[rgba(0,0,0,0)] top-0 w-[214px]" data-name="Container" />;
}

function Container44() {
  return (
    <div className="absolute h-[256px] left-px overflow-clip top-px w-[214px]" data-name="Container">
      <ImageTropicalFlavor />
      <Container45 />
      <Container46 />
    </div>
  );
}

function Heading11() {
  return (
    <div className="absolute h-[36px] left-[24px] top-[24px] w-[166px]" data-name="Heading 3">
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[36px] left-0 not-italic text-[24px] text-white top-px">Tropical</p>
    </div>
  );
}

function Container48() {
  return <div className="absolute bg-[#ff6347] h-[4px] left-[24px] rounded-[33554400px] shadow-[0px_0px_12px_0px_rgba(255,255,255,0.4)] top-[68px] w-[64px]" data-name="Container" />;
}

function Container47() {
  return (
    <div className="absolute h-[96px] left-px top-[161px] w-[214px]" data-name="Container">
      <Heading11 />
      <Container48 />
    </div>
  );
}

function Container43() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] col-[4] relative rounded-[24px] row-[1] self-stretch shrink-0" data-name="Container">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Container44 />
        <Container47 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[24px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.4)]" />
    </div>
  );
}

function Container24() {
  return (
    <div className="-translate-x-1/2 absolute gap-[24px] grid grid-cols-[repeat(4,_minmax(0,_1fr))] grid-rows-[repeat(1,_minmax(0,_1fr))] h-[258px] left-1/2 top-[306.63px] w-[936px]" data-name="Container">
      <Container25 />
      <Container31 />
      <Container37 />
      <Container43 />
    </div>
  );
}

function Text() {
  return (
    <div className="content-stretch flex h-[23px] items-start relative shrink-0 w-[146px]" data-name="Text">
      <p className="font-['Poppins:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[18px] text-[rgba(255,255,255,0.9)] text-center">No excess sugar</p>
    </div>
  );
}

function Container50() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] content-stretch flex flex-col h-[59px] items-start left-[201.77px] pb-px pl-[28px] pr-[33px] pt-[18px] rounded-[33554400px] top-0 w-[200px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[33554400px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.3)]" />
      <Text />
    </div>
  );
}

function Text1() {
  return (
    <div className="content-stretch flex h-[23px] items-start relative shrink-0 w-[97px]" data-name="Text">
      <p className="font-['Poppins:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[18px] text-[rgba(255,255,255,0.9)] text-center">Light taste</p>
    </div>
  );
}

function Container51() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] content-stretch flex flex-col h-[59px] items-start left-[418px] pb-px pl-[37px] pr-[33px] pt-[18px] rounded-[33554400px] top-0 w-[168px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[33554400px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.3)]" />
      <Text1 />
    </div>
  );
}

function Text2() {
  return (
    <div className="content-stretch flex h-[23px] items-start relative shrink-0 w-[110px]" data-name="Text">
      <p className="font-['Poppins:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[18px] text-[rgba(255,255,255,0.9)] text-center w-[110px] whitespace-pre-wrap">Low calories</p>
    </div>
  );
}

function Container52() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] content-stretch flex flex-col h-[59px] items-start left-[603px] pb-px pl-[26px] pr-[33px] pt-[18px] rounded-[33554400px] top-0 w-[159px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[33554400px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.3)]" />
      <Text2 />
    </div>
  );
}

function Container49() {
  return (
    <div className="-translate-x-1/2 absolute h-[59px] left-1/2 top-[193.63px] w-[936px]" data-name="Container">
      <Container50 />
      <Container51 />
      <Container52 />
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute h-[532.094px] left-[80px] top-[96px] w-[936px]" data-name="Container">
      <Container23 />
      <Container24 />
      <Container49 />
    </div>
  );
}

function Section3() {
  return (
    <div className="bg-gradient-to-b from-[#0a0e1a] h-[724.094px] overflow-clip relative shrink-0 to-[#0f1425] w-full" data-name="Section">
      <Container21 />
      <Container22 />
    </div>
  );
}

function Container53() {
  return <div className="absolute bg-[rgba(0,229,255,0.05)] blur-[120px] left-[330.67px] rounded-[33554400px] size-[400px] top-[39.34px]" data-name="Container" />;
}

function Heading12() {
  return (
    <div className="absolute h-[61.594px] left-0 shadow-[0px_2px_20px_0px_rgba(0,0,0,0.6)] top-0 w-[936px]" data-name="Heading 2">
      <p className="-translate-x-1/2 absolute font-['Playfair_Display:Bold',sans-serif] font-bold leading-[61.6px] left-[468.08px] text-[56px] text-center text-white top-0">How it works</p>
    </div>
  );
}

function Container56() {
  return <div className="absolute bg-[#00e5ff] h-[4px] left-[404px] rounded-[33554400px] shadow-[0px_0px_12px_0px_rgba(0,229,255,0.8)] top-[77.59px] w-[128px]" data-name="Container" />;
}

function Container55() {
  return (
    <div className="h-[81.594px] relative shrink-0 w-full" data-name="Container">
      <Heading12 />
      <Container56 />
    </div>
  );
}

function Container54() {
  return (
    <div className="absolute content-stretch flex flex-col h-[393.781px] items-start left-[80px] top-[74.53px] w-[936px]" data-name="Container">
      <Container55 />
    </div>
  );
}

function Paragraph6() {
  return <div className="absolute h-[102px] left-[41px] top-[160.09px] w-[474px]" data-name="Paragraph" />;
}

function Container59() {
  return <div className="absolute bg-[rgba(0,229,255,0.1)] blur-[24px] left-0 rounded-[33554400px] size-[128px] top-0" data-name="Container" />;
}

function Container60() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 p-px rounded-[33554400px] size-[128px] top-0" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)" }}>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[33554400px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.4)]" />
      <p className="font-['Poppins:Bold',sans-serif] h-[34px] leading-[21px] not-italic relative shrink-0 text-[#00e5ff] text-[64px] text-center w-[66px] whitespace-pre-wrap">01</p>
    </div>
  );
}

function Container58() {
  return (
    <div className="absolute left-[23px] size-[128px] top-[58px]" data-name="Container">
      <Container59 />
      <Container60 />
    </div>
  );
}

function Heading13() {
  return (
    <div className="absolute h-[33px] left-[177px] top-[74px] w-[290.656px]" data-name="Heading 3">
      <p className="-translate-x-1/2 absolute font-['Poppins:SemiBold',sans-serif] leading-[33px] left-[145.55px] not-italic text-[22px] text-center text-white top-px">Select a flavor</p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="absolute h-[51.188px] left-[177px] top-[119px] w-[290.656px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Poppins:Regular',sans-serif] leading-[25.6px] left-[145.77px] not-italic text-[16px] text-[rgba(255,255,255,0.6)] text-center top-px w-[216px] whitespace-pre-wrap">Choose from multiple light, refreshing options</p>
    </div>
  );
}

function Container57() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] border-solid h-[246px] left-[210px] rounded-[32px] shadow-[0px_20px_60px_0px_rgba(0,0,0,0.6)] top-[228.06px] w-[525px]" data-name="Container">
      <Paragraph6 />
      <Container58 />
      <Heading13 />
      <Paragraph7 />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Icon">
      <div className="absolute inset-[-16.67%_-29.17%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50.6667 42.6667">
          <g filter="url(#filter0_d_57_1751)" id="Icon">
            <path d={svgPaths.p243ed00} id="Vector" stroke="var(--stroke-0, #00E5FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="64" id="filter0_d_57_1751" width="64" x="-6.66667" y="-10.6667">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset />
              <feGaussianBlur stdDeviation="8" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.898039 0 0 0 0 1 0 0 0 0.8 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_57_1751" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_57_1751" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[rgba(0,229,255,0.2)] content-stretch flex items-center justify-center p-px relative rounded-[33554400px] size-[64px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,229,255,0.4)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
      <Icon />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents left-[210px] top-[228.06px]">
      <Container57 />
      <div className="absolute flex items-center justify-center left-[822px] size-[64px] top-[319.06px]" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "21" } as React.CSSProperties}>
        <div className="-rotate-90 flex-none">
          <Button2 />
        </div>
      </div>
    </div>
  );
}

function Button3() {
  return <div className="absolute bg-[#00e5ff] h-[12px] left-[508px] rounded-[33554400px] shadow-[0px_0px_12px_0px_rgba(0,229,255,0.8)] top-[533.06px] w-[32px]" data-name="Button" />;
}

function Button4() {
  return <div className="absolute bg-[rgba(255,255,255,0.2)] left-[552px] rounded-[33554400px] size-[12px] top-[533.06px]" data-name="Button" />;
}

function Button5() {
  return <div className="absolute bg-[rgba(255,255,255,0.2)] left-[576px] rounded-[33554400px] size-[12px] top-[533.06px]" data-name="Button" />;
}

function Group6() {
  return (
    <div className="absolute contents left-[508px] top-[533.06px]">
      <Button3 />
      <Button4 />
      <Button5 />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents left-[210px] top-[228.06px]">
      <Group5 />
      <Group6 />
    </div>
  );
}

function Section4() {
  return (
    <div className="bg-gradient-to-b from-[#0f1425] h-[585.781px] overflow-clip relative shrink-0 to-[#0f1425] via-1/2 via-[#0a0e1a] w-full" data-name="Section">
      <Container53 />
      <Container54 />
      <Group4 />
    </div>
  );
}

function Container61() {
  return <div className="absolute bg-[rgba(0,229,255,0.05)] blur-[120px] left-[274px] rounded-[33554400px] size-[500px] top-[353.8px]" data-name="Container" />;
}

function Heading14() {
  return (
    <div className="absolute h-[61.594px] left-0 shadow-[0px_2px_20px_0px_rgba(0,0,0,0.6)] top-0 w-[936px]" data-name="Heading 2">
      <p className="-translate-x-1/2 absolute font-['Playfair:Bold',sans-serif] font-bold leading-[61.6px] left-1/2 text-[64px] text-center text-white top-0" style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}>
        Built for active environments
      </p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="absolute h-[54px] left-[132px] top-[77.59px] w-[672px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Poppins:Regular',sans-serif] leading-[27px] left-1/2 not-italic text-[24px] text-[rgba(255,255,255,0.7)] text-center top-[1.16px] w-[660px] whitespace-pre-wrap">ALMUS integrates seamlessly into professional facilities where performance and member experience matter.</p>
    </div>
  );
}

function Container63() {
  return (
    <div className="h-[131.594px] relative shrink-0 w-full" data-name="Container">
      <Heading14 />
      <Paragraph8 />
    </div>
  );
}

function ImageGymsFitnessCenters() {
  return (
    <div className="absolute h-[320px] left-0 top-0 w-[216px]" data-name="Image (Gyms & fitness centers)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageGymsFitnessCenters} />
    </div>
  );
}

function Container66() {
  return <div className="absolute bg-gradient-to-t from-black h-[320px] left-0 to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(0,0,0,0.6)] w-[216px]" data-name="Container" />;
}

function Container67() {
  return <div className="absolute bg-[rgba(0,0,0,0)] h-[320px] left-0 top-0 w-[216px]" data-name="Container" />;
}

function Heading15() {
  return (
    <div className="absolute h-[66px] left-[24px] top-[24px] w-[168px]" data-name="Heading 3">
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[33px] left-0 not-italic text-[22px] text-white top-px w-[168px] whitespace-pre-wrap">{`Gyms & fitness centers`}</p>
    </div>
  );
}

function Container69() {
  return <div className="absolute bg-[#00e5ff] h-[4px] left-[24px] rounded-[33554400px] shadow-[0px_0px_12px_0px_rgba(0,229,255,0.8)] top-[98px] w-[64px]" data-name="Container" />;
}

function Container68() {
  return (
    <div className="absolute h-[126px] left-0 top-[194px] w-[216px]" data-name="Container">
      <Heading15 />
      <Container69 />
    </div>
  );
}

function Container65() {
  return (
    <div className="bg-[rgba(255,255,255,0)] col-[1] overflow-clip relative rounded-[24px] row-[1] self-stretch shadow-[0px_8px_32px_0px_rgba(0,0,0,0.6)] shrink-0" data-name="Container">
      <ImageGymsFitnessCenters />
      <Container66 />
      <Container67 />
      <Container68 />
    </div>
  );
}

function ImageTrainingFacilities() {
  return (
    <div className="absolute h-[320px] left-0 top-0 w-[216px]" data-name="Image (Training facilities)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageTrainingFacilities} />
    </div>
  );
}

function Container71() {
  return <div className="absolute bg-gradient-to-t from-black h-[320px] left-0 to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(0,0,0,0.6)] w-[216px]" data-name="Container" />;
}

function Container72() {
  return <div className="absolute bg-[rgba(0,0,0,0)] h-[320px] left-0 top-0 w-[216px]" data-name="Container" />;
}

function Heading16() {
  return (
    <div className="absolute h-[66px] left-[24px] top-[24px] w-[168px]" data-name="Heading 3">
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[33px] left-0 not-italic text-[22px] text-white top-px w-[95px] whitespace-pre-wrap">Training facilities</p>
    </div>
  );
}

function Container74() {
  return <div className="absolute bg-[#00e5ff] h-[4px] left-[24px] rounded-[33554400px] shadow-[0px_0px_12px_0px_rgba(0,229,255,0.8)] top-[98px] w-[64px]" data-name="Container" />;
}

function Container73() {
  return (
    <div className="absolute h-[126px] left-0 top-[194px] w-[216px]" data-name="Container">
      <Heading16 />
      <Container74 />
    </div>
  );
}

function Container70() {
  return (
    <div className="bg-[rgba(255,255,255,0)] col-[2] overflow-clip relative rounded-[24px] row-[1] self-stretch shadow-[0px_8px_32px_0px_rgba(0,0,0,0.6)] shrink-0" data-name="Container">
      <ImageTrainingFacilities />
      <Container71 />
      <Container72 />
      <Container73 />
    </div>
  );
}

function ImageSportsClubs() {
  return (
    <div className="absolute h-[320px] left-0 top-0 w-[216px]" data-name="Image (Sports clubs)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageSportsClubs} />
    </div>
  );
}

function Container76() {
  return <div className="absolute bg-gradient-to-t from-black h-[320px] left-0 to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(0,0,0,0.6)] w-[216px]" data-name="Container" />;
}

function Container77() {
  return <div className="absolute bg-[rgba(0,0,0,0)] h-[320px] left-0 top-0 w-[216px]" data-name="Container" />;
}

function Heading17() {
  return (
    <div className="absolute h-[33px] left-[24px] top-[24px] w-[168px]" data-name="Heading 3">
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[33px] left-0 not-italic text-[22px] text-white top-px">Sports clubs</p>
    </div>
  );
}

function Container79() {
  return <div className="absolute bg-[#00e5ff] h-[4px] left-[24px] rounded-[33554400px] shadow-[0px_0px_12px_0px_rgba(0,229,255,0.8)] top-[65px] w-[64px]" data-name="Container" />;
}

function Container78() {
  return (
    <div className="absolute h-[93px] left-0 top-[227px] w-[216px]" data-name="Container">
      <Heading17 />
      <Container79 />
    </div>
  );
}

function Container75() {
  return (
    <div className="bg-[rgba(255,255,255,0)] col-[3] overflow-clip relative rounded-[24px] row-[1] self-stretch shadow-[0px_8px_32px_0px_rgba(0,0,0,0.6)] shrink-0" data-name="Container">
      <ImageSportsClubs />
      <Container76 />
      <Container77 />
      <Container78 />
    </div>
  );
}

function ImageWellnessSpaces() {
  return (
    <div className="absolute h-[320px] left-0 top-0 w-[216px]" data-name="Image (Wellness spaces)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWellnessSpaces} />
    </div>
  );
}

function Container81() {
  return <div className="absolute bg-gradient-to-t from-black h-[320px] left-0 to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(0,0,0,0.6)] w-[216px]" data-name="Container" />;
}

function Container82() {
  return <div className="absolute bg-[rgba(0,0,0,0)] h-[320px] left-0 top-0 w-[216px]" data-name="Container" />;
}

function Heading18() {
  return (
    <div className="absolute h-[66px] left-[24px] top-[24px] w-[168px]" data-name="Heading 3">
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[33px] left-0 not-italic text-[22px] text-white top-px w-[101px] whitespace-pre-wrap">Wellness spaces</p>
    </div>
  );
}

function Container84() {
  return <div className="absolute bg-[#00e5ff] h-[4px] left-[24px] rounded-[33554400px] shadow-[0px_0px_12px_0px_rgba(0,229,255,0.8)] top-[98px] w-[64px]" data-name="Container" />;
}

function Container83() {
  return (
    <div className="absolute h-[126px] left-0 top-[194px] w-[216px]" data-name="Container">
      <Heading18 />
      <Container84 />
    </div>
  );
}

function Container80() {
  return (
    <div className="bg-[rgba(255,255,255,0)] col-[4] overflow-clip relative rounded-[24px] row-[1] self-stretch shadow-[0px_8px_32px_0px_rgba(0,0,0,0.6)] shrink-0" data-name="Container">
      <ImageWellnessSpaces />
      <Container81 />
      <Container82 />
      <Container83 />
    </div>
  );
}

function Container64() {
  return (
    <div className="gap-[24px] grid grid-cols-[repeat(4,_minmax(0,_1fr))] grid-rows-[repeat(1,_minmax(0,_1fr))] h-[320px] relative shrink-0 w-full" data-name="Container">
      <Container65 />
      <Container70 />
      <Container75 />
      <Container80 />
    </div>
  );
}

function Container62() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[64px] h-[515.594px] items-start left-[80px] top-[96px] w-[936px]" data-name="Container">
      <Container63 />
      <Container64 />
    </div>
  );
}

function Section5() {
  return (
    <div className="bg-gradient-to-b from-[#0f1425] h-[634px] overflow-clip relative shrink-0 to-[#0a0e1a] w-full" data-name="Section">
      <Container61 />
      <Container62 />
    </div>
  );
}

function Container85() {
  return <div className="absolute bg-[rgba(0,229,255,0.1)] blur-[140px] left-[248px] rounded-[33554400px] size-[600px] top-[189.19px]" data-name="Container" />;
}

function Heading19() {
  return (
    <div className="absolute h-[70.391px] left-0 shadow-[0px_2px_20px_0px_rgba(0,0,0,0.6)] top-0 w-[896px]" data-name="Heading 2">
      <p className="-translate-x-1/2 absolute font-['Playfair:Bold',sans-serif] font-bold leading-[70.4px] left-[447.67px] text-[64px] text-center text-white top-[-1px]" style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}>
        Bring ALMUS to your facility
      </p>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="absolute h-[60px] left-[112px] top-[94.39px] w-[672px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Poppins:Regular',sans-serif] leading-[30px] left-1/2 not-italic text-[24px] text-[rgba(255,255,255,0.7)] text-center top-[1.36px] w-[652px] whitespace-pre-wrap">Contact our sales team to discuss pricing, installation, and how ALMUS can enhance your facility.</p>
    </div>
  );
}

function Container87() {
  return (
    <div className="h-[154.391px] relative shrink-0 w-full" data-name="Container">
      <Heading19 />
      <Paragraph9 />
    </div>
  );
}

function Label() {
  return (
    <div className="h-[24px] relative shrink-0 w-[387px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[24px] min-h-px min-w-px not-italic relative text-[16px] text-[rgba(255,255,255,0.9)] whitespace-pre-wrap">Name *</p>
      </div>
    </div>
  );
}

function TextInput() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] flex-[1_0_0] min-h-px min-w-px relative rounded-[14px] w-[387px]" data-name="Text Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip px-[16px] relative rounded-[inherit] size-full">
        <p className="font-['Arial:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.4)]">Your name</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Container89() {
  return (
    <div className="col-[1] content-stretch flex flex-col gap-[8px] items-start relative row-[1] self-stretch shrink-0" data-name="Container">
      <Label />
      <TextInput />
    </div>
  );
}

function Label1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[387px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[24px] min-h-px min-w-px not-italic relative text-[16px] text-[rgba(255,255,255,0.9)] whitespace-pre-wrap">Company *</p>
      </div>
    </div>
  );
}

function TextInput1() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] flex-[1_0_0] min-h-px min-w-px relative rounded-[14px] w-[387px]" data-name="Text Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip px-[16px] relative rounded-[inherit] size-full">
        <p className="font-['Arial:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.4)]">Facility or company name</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Container90() {
  return (
    <div className="col-[2] content-stretch flex flex-col gap-[8px] items-start relative row-[1] self-stretch shrink-0" data-name="Container">
      <Label1 />
      <TextInput1 />
    </div>
  );
}

function Container88() {
  return (
    <div className="gap-[24px] grid grid-cols-[repeat(2,_minmax(0,_1fr))] grid-rows-[repeat(1,_minmax(0,_1fr))] h-[84px] relative shrink-0 w-full" data-name="Container">
      <Container89 />
      <Container90 />
    </div>
  );
}

function Label2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[387px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[24px] min-h-px min-w-px not-italic relative text-[16px] text-[rgba(255,255,255,0.9)] whitespace-pre-wrap">Email *</p>
      </div>
    </div>
  );
}

function EmailInput() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] flex-[1_0_0] min-h-px min-w-px relative rounded-[14px] w-[387px]" data-name="Email Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip px-[16px] relative rounded-[inherit] size-full">
        <p className="font-['Arial:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.4)]">your.email@example.com</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Container92() {
  return (
    <div className="col-[1] content-stretch flex flex-col gap-[8px] items-start relative row-[1] self-stretch shrink-0" data-name="Container">
      <Label2 />
      <EmailInput />
    </div>
  );
}

function Label3() {
  return (
    <div className="h-[24px] relative shrink-0 w-[387px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[24px] min-h-px min-w-px not-italic relative text-[16px] text-[rgba(255,255,255,0.9)] whitespace-pre-wrap">Phone</p>
      </div>
    </div>
  );
}

function PhoneInput() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] flex-[1_0_0] min-h-px min-w-px relative rounded-[14px] w-[387px]" data-name="Phone Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip px-[16px] relative rounded-[inherit] size-full">
        <p className="font-['Arial:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.4)]">+1 (555) 000-0000</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Container93() {
  return (
    <div className="col-[2] content-stretch flex flex-col gap-[8px] items-start relative row-[1] self-stretch shrink-0" data-name="Container">
      <Label3 />
      <PhoneInput />
    </div>
  );
}

function Container91() {
  return (
    <div className="gap-[24px] grid grid-cols-[repeat(2,_minmax(0,_1fr))] grid-rows-[repeat(1,_minmax(0,_1fr))] h-[84px] relative shrink-0 w-full" data-name="Container">
      <Container92 />
      <Container93 />
    </div>
  );
}

function Label4() {
  return (
    <div className="h-[24px] relative shrink-0 w-[798px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[24px] min-h-px min-w-px not-italic relative text-[16px] text-[rgba(255,255,255,0.9)] whitespace-pre-wrap">Message</p>
      </div>
    </div>
  );
}

function TextArea() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] flex-[1_0_0] min-h-px min-w-px relative rounded-[14px] w-[798px]" data-name="Text Area">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start overflow-clip px-[16px] py-[12px] relative rounded-[inherit] size-full">
        <p className="font-['Arial:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.4)]">{`Tell us about your facility and what you're looking for...`}</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Container94() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[154px] items-start relative shrink-0 w-full" data-name="Container">
      <Label4 />
      <TextArea />
    </div>
  );
}

function Container95() {
  return (
    <div className="h-[76px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row justify-center size-full">
        <div className="size-full" />
      </div>
    </div>
  );
}

function Form() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] h-[568px] relative rounded-[32px] shrink-0 w-full" data-name="Form">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[32px] shadow-[0px_20px_60px_0px_rgba(0,0,0,0.6)]" />
      <div className="content-stretch flex flex-col gap-[24px] items-start pb-px pt-[49px] px-[49px] relative size-full">
        <Container88 />
        <Container91 />
        <Container94 />
        <Container95 />
      </div>
    </div>
  );
}

function Container86() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[64px] h-[786.391px] items-start left-[100px] top-[96px] w-[896px]" data-name="Container">
      <Container87 />
      <Form />
    </div>
  );
}

function Section6() {
  return (
    <div className="bg-gradient-to-b from-[#0a0e1a] h-[978.391px] overflow-clip relative shrink-0 to-black w-full" data-name="Section">
      <Container85 />
      <Container86 />
    </div>
  );
}

function Heading20() {
  return (
    <div className="content-stretch flex h-[32px] items-start relative shrink-0 w-[178px]" data-name="Heading 3">
      <div className="font-['Arial:Bold',sans-serif] leading-[32px] not-italic relative shrink-0 text-[24px] text-white w-[126px] whitespace-pre-wrap">
        <p className="mb-0">ULTIMA</p>
        <p>LOGO</p>
      </div>
    </div>
  );
}

function Container97() {
  return (
    <div className="absolute content-stretch flex flex-col h-[96px] items-start left-[45px] top-[13px] w-[126px]" data-name="Container">
      <Heading20 />
    </div>
  );
}

function Heading21() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-white top-[-2px]">ULTIMA</p>
    </div>
  );
}

function Link() {
  return (
    <div className="absolute content-stretch flex h-[21px] items-start left-0 top-px w-[58.547px]" data-name="Link">
      <p className="font-['Arial:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-white">About us</p>
    </div>
  );
}

function ListItem() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Link />
    </div>
  );
}

function Link1() {
  return (
    <div className="absolute content-stretch flex h-[21px] items-start left-0 top-px w-[51.719px]" data-name="Link">
      <p className="font-['Arial:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-white">Our Localisation</p>
    </div>
  );
}

function ListItem1() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Link1 />
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[56px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem />
      <ListItem1 />
    </div>
  );
}

function Container98() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[96px] items-start left-[271px] top-[0.75px] w-[265px]" data-name="Container">
      <Heading21 />
      <List />
    </div>
  );
}

function Heading22() {
  return (
    <div className="h-[24px] relative shrink-0 w-[187px]" data-name="Heading 4">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-white top-[-2px]">Support</p>
    </div>
  );
}

function Link2() {
  return (
    <div className="absolute content-stretch flex h-[21px] items-start left-0 top-px w-[43.578px]" data-name="Link">
      <p className="font-['Arial:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-white">Contact</p>
    </div>
  );
}

function ListItem2() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Link2 />
    </div>
  );
}

function Link3() {
  return (
    <div className="absolute content-stretch flex h-[21px] items-start left-0 top-px w-[54.719px]" data-name="Link">
      <p className="font-['Arial:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-white">FAQ</p>
    </div>
  );
}

function ListItem3() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Link3 />
    </div>
  );
}

function List1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[56px] items-start relative shrink-0 w-[187px]" data-name="List">
      <ListItem2 />
      <ListItem3 />
    </div>
  );
}

function Container99() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[96px] items-start left-[536px] top-[0.75px] w-[241px]" data-name="Container">
      <Heading22 />
      <List1 />
    </div>
  );
}

function Heading23() {
  return (
    <div className="h-[24px] relative shrink-0 w-[187px]" data-name="Heading 4">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-white top-[-2px]">Follow Us</p>
    </div>
  );
}

function Link4() {
  return (
    <div className="absolute content-stretch flex h-[21px] items-start left-0 top-px w-[43.578px]" data-name="Link">
      <p className="font-['Arial:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-white">Contact</p>
    </div>
  );
}

function ListItem4() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Link4 />
    </div>
  );
}

function Link5() {
  return (
    <div className="absolute content-stretch flex h-[21px] items-start left-0 top-px w-[54.719px]" data-name="Link">
      <p className="font-['Arial:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-white">FAQ</p>
    </div>
  );
}

function ListItem5() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Link5 />
    </div>
  );
}

function List2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[56px] items-start relative shrink-0 w-[187px]" data-name="List">
      <ListItem4 />
      <ListItem5 />
    </div>
  );
}

function Container100() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[96px] items-start left-[777px] top-[0.75px] w-[259px]" data-name="Container">
      <Heading23 />
      <List2 />
    </div>
  );
}

function Container96() {
  return (
    <div className="col-1 h-[96px] ml-0 mt-0 relative row-1 w-[1048px]" data-name="Container">
      <Container97 />
      <Container98 />
      <Container99 />
      <Container100 />
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Arial:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[14px] text-center text-white whitespace-pre-wrap">© 2026 ULTIMA. All rights reserved.</p>
    </div>
  );
}

function Container101() {
  return (
    <div className="col-1 content-stretch flex flex-col h-[53px] items-start ml-0 mt-[144px] pt-[33px] relative row-1 w-[1048px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-solid border-t border-white inset-0 pointer-events-none" />
      <Paragraph10 />
    </div>
  );
}

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
      <Container96 />
      <Container101 />
    </div>
  );
}

function PY() {
  return (
    <div className="absolute bg-gradient-to-b content-stretch flex flex-col from-[#0a0e1a] h-[5515px] items-start left-0 to-black top-0 w-[1096px]" data-name="pY">
      <Section />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section6 />
      <Group />
    </div>
  );
}

function Button6() {
  return (
    <div className="h-[32px] relative shrink-0 w-[96.766px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arial:Bold',sans-serif] leading-[32px] not-italic relative shrink-0 text-[24px] text-center text-white tracking-[1.2px]">ULTIMA</p>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px relative" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Poppins:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.8)] text-center">Solutions</p>
      </div>
    </div>
  );
}

function Button8() {
  return (
    <div className="h-[24px] relative shrink-0 w-[60.094px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Poppins:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.8)] text-center">SUMMA</p>
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div className="h-[24px] relative shrink-0 w-[53.078px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Poppins:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.8)] text-center">ALMUS</p>
      </div>
    </div>
  );
}

function Button10() {
  return (
    <div className="h-[24px] relative shrink-0 w-[48.547px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Poppins:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.8)] text-center">About</p>
      </div>
    </div>
  );
}

function Button11() {
  return (
    <div className="h-[24px] relative shrink-0 w-[65.313px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Poppins:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.8)] text-center">Contact</p>
      </div>
    </div>
  );
}

function Container103() {
  return (
    <div className="h-[24px] relative shrink-0 w-[428.828px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[32px] items-center relative size-full">
        <Button7 />
        <Button8 />
        <Button9 />
        <Button10 />
        <Button11 />
      </div>
    </div>
  );
}

function Button12() {
  return (
    <div className="bg-[#00e5ff] flex-[1_0_0] h-[48px] min-h-px min-w-px relative rounded-[33554400px] shadow-[0px_0px_20px_0px_rgba(0,229,255,0.3)]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Poppins:SemiBold',sans-serif] leading-[22.5px] left-[73.22px] not-italic text-[15px] text-black text-center top-[12px]">Login</p>
      </div>
    </div>
  );
}

function Container104() {
  return (
    <div className="h-[48px] relative shrink-0 w-[146.719px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Button12 />
      </div>
    </div>
  );
}

function Container102() {
  return (
    <div className="content-stretch flex h-[48px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Button6 />
      <Container103 />
      <Container104 />
    </div>
  );
}

function Navigation() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0.6)] content-stretch flex flex-col h-[81px] items-start left-px pb-px pt-[16px] px-[24px] top-0 w-[1096px]" data-name="Navigation">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.1)] border-b border-solid inset-0 pointer-events-none shadow-[0px_4px_24px_0px_rgba(0,0,0,0.4)]" />
      <Container102 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[154.22px] size-[20px] top-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_57_1747)" id="Icon">
          <path d={svgPaths.p2cb36d80} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p17c6a700} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_57_1747">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button13() {
  return (
    <div className="-translate-x-1/2 absolute bg-[#00e5ff] h-[55px] left-[calc(50%-25px)] rounded-[33554400px] shadow-[0px_0px_20px_0px_rgba(0,229,255,0.3)] top-[5067px] w-[222px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Poppins:SemiBold',sans-serif] leading-[24px] left-[97.5px] not-italic text-[16px] text-black text-center top-[16px]">Get in touch</p>
      <Icon1 />
    </div>
  );
}

export default function HealthcareSolutionsLandingPage() {
  return (
    <div className="bg-white relative size-full" data-name="Healthcare Solutions Landing Page">
      <PY />
      <Navigation />
      <Button13 />
    </div>
  );
}