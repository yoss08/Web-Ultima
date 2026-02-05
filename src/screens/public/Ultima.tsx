import svgPaths from "../../components/icons/IconMainLogo";
const imgImageSummaPadelSportsDashboard = "/assets/images/image1.png";
const imgImageAlmusSmartDispenserStation = "/assets/images/image2.png";

function Container() {
  return <div className="absolute bg-[rgba(0,229,255,0.1)] blur-[120px] left-[274px] rounded-[33554400px] size-[384px] top-[160px]" data-name="Container" />;
}

function Container1() {
  return <div className="absolute bg-[rgba(57,255,20,0.1)] blur-[120px] left-[438px] rounded-[33554400px] size-[384px] top-[96px]" data-name="Container" />;
}

function Paragraph() {
  return (
    <div className="h-[48px] relative shrink-0 w-[1000px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Poppins:Regular',sans-serif] leading-[48px] left-[500.7px] not-italic text-[32px] text-[rgba(255,255,255,0.9)] text-center top-px tracking-[0.8px]">Choose Your Experience</p>
      </div>
    </div>
  );
}

function ImageSummaPadelSportsDashboard() {
  return (
    <div className="absolute h-[432px] left-0 top-0 w-[484px]" data-name="Image (SUMMA - Padel Sports Dashboard)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageSummaPadelSportsDashboard} />
    </div>
  );
}

function Container5() {
  return <div className="absolute bg-gradient-to-t from-black h-[432px] left-0 to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(0,0,0,0.6)] w-[484px]" data-name="Container" />;
}

function Container6() {
  return <div className="absolute bg-[rgba(0,0,0,0)] h-[432px] left-0 top-0 w-[484px]" data-name="Container" />;
}

function Heading() {
  return (
    <div className="h-[64px] relative shadow-[0px_2px_20px_0px_rgba(0,0,0,0.8)] shrink-0 w-[404px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Playfair:Bold',sans-serif] font-bold leading-[64px] left-0 text-[64px] text-white top-[-1px]" style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}>
          SUMMA
        </p>
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[30px] relative shrink-0 w-[404px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Poppins:Regular',sans-serif] leading-[30px] left-0 not-italic text-[20px] text-[rgba(255,255,255,0.9)] top-px">Padel Sports Dashboard</p>
      </div>
    </div>
  );
}

function Container8() {
  return <div className="bg-[#39ff14] h-[4px] rounded-[33554400px] shadow-[0px_0px_12px_0px_rgba(57,255,20,0.8)] shrink-0 w-[96px]" data-name="Container" />;
}

function Container7() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[432px] items-start justify-end left-0 pl-[40px] pt-[266px] top-0 w-[484px]" data-name="Container">
      <Heading />
      <Paragraph1 />
      <Container8 />
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-[rgba(255,255,255,0)] h-[432px] overflow-clip relative rounded-[32px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.6)] shrink-0 w-full" data-name="Container">
      <ImageSummaPadelSportsDashboard />
      <Container5 />
      <Container6 />
      <Container7 />
    </div>
  );
}

function Link() {
  return (
    <div className="col-[1] content-stretch flex flex-col items-start relative row-[1] self-stretch shrink-0" data-name="Link">
      <Container4 />
    </div>
  );
}

function ImageAlmusSmartDispenserStation() {
  return (
    <div className="absolute h-[432px] left-0 top-0 w-[484px]" data-name="Image (ALMUS - Smart Dispenser Station)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageAlmusSmartDispenserStation} />
    </div>
  );
}

function Container10() {
  return <div className="absolute bg-gradient-to-t from-black h-[432px] left-0 to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(0,0,0,0.6)] w-[484px]" data-name="Container" />;
}

function Container11() {
  return <div className="absolute bg-[rgba(0,0,0,0)] h-[432px] left-0 top-0 w-[484px]" data-name="Container" />;
}

function Heading1() {
  return (
    <div className="h-[64px] relative shadow-[0px_2px_20px_0px_rgba(0,0,0,0.8)] shrink-0 w-[404px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Playfair:Bold',sans-serif] font-bold leading-[64px] left-0 text-[64px] text-white top-[-1px]" style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}>
          ALMUS
        </p>
      </div>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[30px] relative shrink-0 w-[404px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Poppins:Regular',sans-serif] leading-[30px] left-0 not-italic text-[20px] text-[rgba(255,255,255,0.9)] top-px">Smart Dispenser Station</p>
      </div>
    </div>
  );
}

function Container13() {
  return <div className="bg-[#00e5ff] h-[4px] rounded-[33554400px] shadow-[0px_0px_12px_0px_rgba(0,229,255,0.8)] shrink-0 w-[96px]" data-name="Container" />;
}

function Container12() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[432px] items-start justify-end left-0 pl-[40px] pt-[266px] top-0 w-[484px]" data-name="Container">
      <Heading1 />
      <Paragraph2 />
      <Container13 />
    </div>
  );
}

function Container9() {
  return (
    <div className="bg-[rgba(255,255,255,0)] h-[432px] overflow-clip relative rounded-[32px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.6)] shrink-0 w-full" data-name="Container">
      <ImageAlmusSmartDispenserStation />
      <Container10 />
      <Container11 />
      <Container12 />
    </div>
  );
}

function Link1() {
  return (
    <div className="col-[2] content-stretch flex flex-col items-start relative row-[1] self-stretch shrink-0" data-name="Link">
      <Container9 />
    </div>
  );
}

function Container3() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[1000px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid gap-[32px] grid grid-cols-[repeat(2,_minmax(0,_1fr))] grid-rows-[repeat(1,_minmax(0,_1fr))] relative size-full">
        <Link />
        <Link1 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] h-[512px] items-start justify-center left-[48px] top-[96px] w-[1000px]" data-name="Container">
      <Paragraph />
      <Container3 />
    </div>
  );
}

function Section() {
  return (
    <div className="bg-gradient-to-b from-[#0a0e1a] h-[640px] overflow-clip relative shrink-0 to-[#050810] via-1/2 via-[#0f1425] w-full" data-name="Section">
      <Container />
      <Container1 />
      <Container2 />
    </div>
  );
}

function Container14() {
  return <div className="absolute bg-[rgba(0,229,255,0.05)] blur-[100px] h-[400px] left-[248px] rounded-[33554400px] top-[10.69px] w-[600px]" data-name="Container" />;
}

function Paragraph3() {
  return (
    <div className="h-[122.391px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Poppins:Regular',sans-serif] leading-[40.8px] left-[468.19px] not-italic text-[24px] text-[rgba(255,255,255,0.8)] text-center top-0 w-[849px] whitespace-pre-wrap">ULTIMA delivers innovative healthcare products and intelligent systems designed to enhance safety, efficiency, and care quality in modern environments.</p>
    </div>
  );
}

function Text() {
  return (
    <div className="content-stretch flex h-[23px] items-start relative shrink-0 w-full" data-name="Text">
      <p className="font-['Poppins:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[18px] text-[rgba(255,255,255,0.9)] text-center">Smart products</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] content-stretch flex flex-col h-[59px] items-start left-[201.77px] pb-px pt-[18px] px-[33px] rounded-[33554400px] top-0 w-[200px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[33554400px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.3)]" />
      <Text />
    </div>
  );
}

function Text1() {
  return (
    <div className="content-stretch flex h-[23px] items-start relative shrink-0 w-full" data-name="Text">
      <p className="font-['Poppins:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[18px] text-[rgba(255,255,255,0.9)] text-center">Technology</p>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] content-stretch flex flex-col h-[59px] items-start left-[418px] pb-px pt-[18px] px-[33px] rounded-[33554400px] top-0 w-[168px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[33554400px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.3)]" />
      <Text1 />
    </div>
  );
}

function Text2() {
  return (
    <div className="content-stretch flex h-[23px] items-start relative shrink-0 w-full" data-name="Text">
      <p className="font-['Poppins:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[18px] text-[rgba(255,255,255,0.9)] text-center">Innovation</p>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] content-stretch flex flex-col h-[59px] items-start left-[603px] pb-px pt-[18px] px-[33px] rounded-[33554400px] top-0 w-[159px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[33554400px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.3)]" />
      <Text2 />
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[59px] relative shrink-0 w-full" data-name="Container">
      <Container17 />
      <Container18 />
      <Container19 />
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[48px] items-start left-[80px] top-[96px] w-[936px]" data-name="Container">
      <Paragraph3 />
      <Container16 />
    </div>
  );
}

function Section1() {
  return (
    <div className="bg-gradient-to-b from-[#0a0e1a] h-[421.391px] overflow-clip relative shrink-0 to-[#0f1425] w-full" data-name="Section">
      <Container14 />
      <Container15 />
    </div>
  );
}

function Container20() {
  return <div className="absolute bg-[rgba(57,255,20,0.05)] blur-[120px] left-[438px] rounded-[33554400px] size-[384px] top-[274px]" data-name="Container" />;
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <div className="absolute inset-[-62.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 54 54">
          <g filter="url(#filter0_d_105_190)" id="Icon">
            <path d={svgPaths.p4d60100} id="Vector" stroke="var(--stroke-0, #39FF14)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M24 27L26 29L30 25" id="Vector_2" stroke="var(--stroke-0, #39FF14)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="56" id="filter0_d_105_190" width="56" x="-1" y="-1">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset />
              <feGaussianBlur stdDeviation="8" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.223529 0 0 0 0 1 0 0 0 0 0.0784314 0 0 0 0.8 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_105_190" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_105_190" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[27px] relative shrink-0 w-[191.469px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Poppins:Regular',sans-serif] leading-[27px] left-0 not-italic text-[18px] text-[rgba(255,255,255,0.9)] top-px">Built for professionals</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] h-[77px] relative rounded-[20px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.4)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center pl-[25px] pr-px py-px relative size-full">
          <Icon />
          <Text3 />
        </div>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <div className="absolute inset-[-62.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 54 54">
          <g filter="url(#filter0_d_105_190)" id="Icon">
            <path d={svgPaths.p4d60100} id="Vector" stroke="var(--stroke-0, #39FF14)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M24 27L26 29L30 25" id="Vector_2" stroke="var(--stroke-0, #39FF14)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="56" id="filter0_d_105_190" width="56" x="-1" y="-1">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset />
              <feGaussianBlur stdDeviation="8" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.223529 0 0 0 0 1 0 0 0 0 0.0784314 0 0 0 0.8 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_105_190" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_105_190" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[27px] relative shrink-0 w-[246.266px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Poppins:Regular',sans-serif] leading-[27px] left-0 not-italic text-[18px] text-[rgba(255,255,255,0.9)] top-px">{`Privacy & reliability focused`}</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] h-[77px] relative rounded-[20px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.4)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center pl-[25px] pr-px py-px relative size-full">
          <Icon1 />
          <Text4 />
        </div>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <div className="absolute inset-[-62.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 54 54">
          <g filter="url(#filter0_d_105_190)" id="Icon">
            <path d={svgPaths.p4d60100} id="Vector" stroke="var(--stroke-0, #39FF14)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M24 27L26 29L30 25" id="Vector_2" stroke="var(--stroke-0, #39FF14)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="56" id="filter0_d_105_190" width="56" x="-1" y="-1">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset />
              <feGaussianBlur stdDeviation="8" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.223529 0 0 0 0 1 0 0 0 0 0.0784314 0 0 0 0.8 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_105_190" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_105_190" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[27px] relative shrink-0 w-[157.406px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Poppins:Regular',sans-serif] leading-[27px] left-0 not-italic text-[18px] text-[rgba(255,255,255,0.9)] top-px">Scalable systems</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] h-[77px] relative rounded-[20px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.4)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center pl-[25px] pr-px py-px relative size-full">
          <Icon2 />
          <Text5 />
        </div>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <div className="absolute inset-[-62.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 54 54">
          <g filter="url(#filter0_d_105_190)" id="Icon">
            <path d={svgPaths.p4d60100} id="Vector" stroke="var(--stroke-0, #39FF14)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M24 27L26 29L30 25" id="Vector_2" stroke="var(--stroke-0, #39FF14)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="56" id="filter0_d_105_190" width="56" x="-1" y="-1">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset />
              <feGaussianBlur stdDeviation="8" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.223529 0 0 0 0 1 0 0 0 0 0.0784314 0 0 0 0.8 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_105_190" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_105_190" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[27px] relative shrink-0 w-[245.422px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Poppins:Regular',sans-serif] leading-[27px] left-0 not-italic text-[18px] text-[rgba(255,255,255,0.9)] top-px">Future-ready infrastructure</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] h-[77px] relative rounded-[20px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.4)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center pl-[25px] pr-px py-px relative size-full">
          <Icon3 />
          <Text6 />
        </div>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[356px] items-start left-[500px] top-0 w-[436px]" data-name="Container">
      <Container23 />
      <Container24 />
      <Container25 />
      <Container26 />
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute h-[356px] left-[80px] top-[96px] w-[936px]" data-name="Container">
      <Container22 />
    </div>
  );
}

function Section2() {
  return (
    <div className="bg-gradient-to-b from-[#0f1425] h-[548px] overflow-clip relative shrink-0 to-[#0f1425] via-1/2 via-[#0a0e1a] w-full" data-name="Section">
      <Container20 />
      <Container21 />
    </div>
  );
}

function Container27() {
  return <div className="absolute bg-[rgba(0,229,255,0.05)] blur-[120px] left-[298px] rounded-[33554400px] size-[500px] top-[145.39px]" data-name="Container" />;
}

function Heading2() {
  return <div className="absolute h-[76.797px] left-0 shadow-[0px_2px_20px_0px_rgba(0,0,0,0.6)] top-0 w-[1024px]" data-name="Heading 2" />;
}

function Container28() {
  return (
    <div className="absolute h-[598.797px] left-[36px] top-[96px] w-[1024px]" data-name="Container">
      <Heading2 />
    </div>
  );
}

function Section3() {
  return (
    <div className="bg-gradient-to-b from-[#0f1425] h-[894px] overflow-clip relative shrink-0 to-[#0a0e1a] w-full" data-name="Section">
      <Container27 />
      <Container28 />
      <div className="-translate-x-1/2 absolute font-['Playfair:Bold',sans-serif] font-bold leading-[75px] left-[548.5px] text-[64px] text-center text-white top-[39.61px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}>
        <p className="mb-0">{`Let's build safer, smarter`}</p>
        <p>healthcare environments.</p>
      </div>
    </div>
  );
}

function PY() {
  return (
    <div className="absolute bg-gradient-to-b content-stretch flex flex-col from-[#0a0e1a] h-[2793px] items-start left-0 to-black top-0 w-[1096px]" data-name="pY">
      <Section />
      <Section1 />
      <Section2 />
      <Section3 />
    </div>
  );
}

function Button() {
  return (
    <div className="h-[32px] relative shrink-0 w-[96.766px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arial:Bold',sans-serif] leading-[32px] not-italic relative shrink-0 text-[24px] text-center text-white tracking-[1.2px]">ULTIMA</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px relative" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Poppins:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.8)] text-center">Solutions</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[60.094px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Poppins:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.8)] text-center">SUMMA</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="h-[24px] relative shrink-0 w-[53.078px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Poppins:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.8)] text-center">ALMUS</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="h-[24px] relative shrink-0 w-[48.547px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Poppins:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.8)] text-center">About</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="h-[24px] relative shrink-0 w-[65.313px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Poppins:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.8)] text-center">Contact</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="h-[24px] relative shrink-0 w-[428.828px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[32px] items-center relative size-full">
        <Button1 />
        <Button2 />
        <Button3 />
        <Button4 />
        <Button5 />
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[#00e5ff] h-[48px] relative rounded-[33554400px] shadow-[0px_0px_20px_0px_rgba(0,229,255,0.3)] shrink-0 w-[146.719px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Poppins:SemiBold',sans-serif] leading-[22.5px] left-[73.22px] not-italic text-[15px] text-black text-center top-[12px]">Login</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="h-[48px] relative shrink-0 w-[146.719px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Button6 />
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex h-[48px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Button />
      <Container30 />
      <Container31 />
    </div>
  );
}

function Navigation() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0.6)] content-stretch flex flex-col h-[81px] items-start left-px pb-px pt-[16px] px-[24px] top-0 w-[1096px]" data-name="Navigation">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.1)] border-b border-solid inset-0 pointer-events-none shadow-[0px_4px_24px_0px_rgba(0,0,0,0.4)]" />
      <Container29 />
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

function Container33() {
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

function Container34() {
  return (
    <div className="col-[2] content-stretch flex flex-col gap-[8px] items-start relative row-[1] self-stretch shrink-0" data-name="Container">
      <Label1 />
      <TextInput1 />
    </div>
  );
}

function Container32() {
  return (
    <div className="gap-[24px] grid grid-cols-[repeat(2,_minmax(0,_1fr))] grid-rows-[repeat(1,_minmax(0,_1fr))] h-[84px] relative shrink-0 w-full" data-name="Container">
      <Container33 />
      <Container34 />
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

function Container36() {
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

function Container37() {
  return (
    <div className="col-[2] content-stretch flex flex-col gap-[8px] items-start relative row-[1] self-stretch shrink-0" data-name="Container">
      <Label3 />
      <PhoneInput />
    </div>
  );
}

function Container35() {
  return (
    <div className="gap-[24px] grid grid-cols-[repeat(2,_minmax(0,_1fr))] grid-rows-[repeat(1,_minmax(0,_1fr))] h-[84px] relative shrink-0 w-full" data-name="Container">
      <Container36 />
      <Container37 />
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

function Container38() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[154px] items-start relative shrink-0 w-full" data-name="Container">
      <Label4 />
      <TextArea />
    </div>
  );
}

function Icon4() {
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

function Button7() {
  return (
    <div className="bg-[#00e5ff] h-[55px] relative rounded-[33554400px] shadow-[0px_0px_20px_0px_rgba(0,229,255,0.3)] shrink-0 w-[222px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Poppins:SemiBold',sans-serif] leading-[24px] left-[97.5px] not-italic text-[16px] text-black text-center top-[16px]">Get in touch</p>
        <Icon4 />
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="h-[76px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center pr-[0.016px] pt-[16px] relative size-full">
          <Button7 />
        </div>
      </div>
    </div>
  );
}

function Form() {
  return (
    <div className="-translate-x-1/2 absolute bg-[rgba(255,255,255,0.05)] content-stretch flex flex-col gap-[24px] h-[568px] items-start left-1/2 pb-px pt-[49px] px-[49px] rounded-[32px] top-[1856px] w-[896px]" data-name="Form">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[32px] shadow-[0px_20px_60px_0px_rgba(0,0,0,0.6)]" />
      <Container32 />
      <Container35 />
      <Container38 />
      <Container39 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="absolute h-[307.188px] left-[80px] shadow-[0px_2px_20px_0px_rgba(0,0,0,0.6)] top-[1181.8px] w-[436px]" data-name="Heading 2">
      <p className="absolute font-['Playfair:Bold',sans-serif] font-['Playfair_Display:Bold',sans-serif] font-bold leading-[0] left-0 text-[64px] text-white top-[37.2px] w-[415px] whitespace-pre-wrap">
        <span className="leading-[76.8px]" style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}>{`Designed for real `}</span>
        <span className="leading-[76.8px]" style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}>
          healthcare
        </span>
        <span className="leading-[76.8px]" style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}>{` challenges`}</span>
      </p>
    </div>
  );
}

function Container40() {
  return <div className="absolute bg-[#00e5ff] h-[6px] left-[80px] rounded-[33554400px] shadow-[0px_0px_20px_0px_rgba(0,229,255,0.8)] top-[1482px] w-[128px]" data-name="Container" />;
}

function Group1() {
  return (
    <div className="absolute contents left-[80px] top-[1181.8px]">
      <Heading3 />
      <Container40 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex h-[32px] items-start relative shrink-0 w-[178px]" data-name="Heading 3">
      <div className="font-['Arial:Bold',sans-serif] leading-[32px] not-italic relative shrink-0 text-[24px] text-white w-[126px] whitespace-pre-wrap">
        <p className="mb-0">ULTIMA</p>
        <p>LOGO</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="absolute content-stretch flex flex-col h-[96px] items-start left-[45px] top-[13px] w-[126px]" data-name="Container">
      <Heading4 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-white top-[-2px]">ULTIMA</p>
    </div>
  );
}

function Link2() {
  return (
    <div className="absolute content-stretch flex h-[21px] items-start left-0 top-px w-[58.547px]" data-name="Link">
      <p className="font-['Arial:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-white">About us</p>
    </div>
  );
}

function ListItem() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Link2 />
    </div>
  );
}

function Link3() {
  return (
    <div className="absolute content-stretch flex h-[21px] items-start left-0 top-px w-[51.719px]" data-name="Link">
      <p className="font-['Arial:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-white">Our Localisation</p>
    </div>
  );
}

function ListItem1() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Link3 />
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

function Container43() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[96px] items-start left-[271px] top-[0.75px] w-[265px]" data-name="Container">
      <Heading5 />
      <List />
    </div>
  );
}

function Heading6() {
  return (
    <div className="h-[24px] relative shrink-0 w-[187px]" data-name="Heading 4">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-white top-[-2px]">Support</p>
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

function ListItem2() {
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

function ListItem3() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Link5 />
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

function Container44() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[96px] items-start left-[536px] top-[0.75px] w-[241px]" data-name="Container">
      <Heading6 />
      <List1 />
    </div>
  );
}

function Heading7() {
  return (
    <div className="h-[24px] relative shrink-0 w-[187px]" data-name="Heading 4">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-white top-[-2px]">Follow Us</p>
    </div>
  );
}

function Link6() {
  return (
    <div className="absolute content-stretch flex h-[21px] items-start left-0 top-px w-[43.578px]" data-name="Link">
      <p className="font-['Arial:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-white">Contact</p>
    </div>
  );
}

function ListItem4() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Link6 />
    </div>
  );
}

function Link7() {
  return (
    <div className="absolute content-stretch flex h-[21px] items-start left-0 top-px w-[54.719px]" data-name="Link">
      <p className="font-['Arial:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-white">FAQ</p>
    </div>
  );
}

function ListItem5() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Link7 />
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

function Container45() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[96px] items-start left-[777px] top-[0.75px] w-[259px]" data-name="Container">
      <Heading7 />
      <List2 />
    </div>
  );
}

function Container41() {
  return (
    <div className="absolute h-[96px] left-[24px] top-[2543px] w-[1048px]" data-name="Container">
      <Container42 />
      <Container43 />
      <Container44 />
      <Container45 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Arial:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[14px] text-center text-white whitespace-pre-wrap">© 2026 ULTIMA. All rights reserved.</p>
    </div>
  );
}

function Container46() {
  return (
    <div className="absolute content-stretch flex flex-col h-[53px] items-start left-[24px] pt-[33px] top-[2687px] w-[1048px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-solid border-t border-white inset-0 pointer-events-none" />
      <Paragraph4 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[24px] top-[2543px]">
      <Container41 />
      <Container46 />
    </div>
  );
}

function Text7() {
  return (
    <div className="content-stretch flex h-[23px] items-start relative shrink-0 w-[141px]" data-name="Text">
      <p className="font-['Poppins:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[18px] text-[rgba(10,14,26,0.9)] text-center">Smart products</p>
    </div>
  );
}

function Container47() {
  return (
    <div className="absolute bg-[rgba(10,14,26,0.05)] content-stretch flex flex-col h-[59px] items-start left-[202px] pb-px pl-[8px] pr-[33px] pt-[18px] rounded-[33554400px] top-0 w-[159px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(10,14,26,0.2)] border-solid inset-0 pointer-events-none rounded-[33554400px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.1)]" />
      <Text7 />
    </div>
  );
}

function Text8() {
  return (
    <div className="content-stretch flex h-[23px] items-start relative shrink-0 w-[105px]" data-name="Text">
      <p className="font-['Poppins:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[18px] text-[rgba(10,14,26,0.9)] text-center">Technology</p>
    </div>
  );
}

function Container48() {
  return (
    <div className="absolute bg-[rgba(10,14,26,0.05)] content-stretch flex flex-col h-[59px] items-start left-[393px] pb-px pl-[26px] pr-[33px] pt-[18px] rounded-[33554400px] top-0 w-[159px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(10,14,26,0.2)] border-solid inset-0 pointer-events-none rounded-[33554400px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.1)]" />
      <Text8 />
    </div>
  );
}

function Text9() {
  return (
    <div className="content-stretch flex h-[23px] items-start relative shrink-0 w-full" data-name="Text">
      <p className="font-['Poppins:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[18px] text-[rgba(10,14,26,0.9)] text-center">Innovation</p>
    </div>
  );
}

function Container49() {
  return (
    <div className="absolute bg-[rgba(10,14,26,0.05)] content-stretch flex flex-col h-[59px] items-start left-[584px] pb-px pt-[18px] px-[33px] rounded-[33554400px] top-0 w-[159px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(10,14,26,0.2)] border-solid inset-0 pointer-events-none rounded-[33554400px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.1)]" />
      <Text9 />
    </div>
  );
}

export default function Ultima() {
  return (
    <div className="bg-white relative size-full" data-name="ultima">
      <PY />
      <Navigation />
      <Form />
      <Group1 />
      <Group />
      <Container47 />
      <Container48 />
      <Container49 />
    </div>
  );
}