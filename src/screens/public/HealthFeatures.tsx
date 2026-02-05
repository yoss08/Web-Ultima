import svgPaths from "../../components/icons/IconService";
const imgImage1 = "/assets/images/image1.png";
const imgImage2 = "/assets/images/image2.png";

function Container() {
  return <div className="blur-[64px] rounded-[33554400px] size-[411.813px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgba(162, 244, 253, 0.208) 0%, rgba(190, 219, 255, 0.208) 100%)" }} />;
}

function Solutions1() {
  return (
    <div className="absolute content-stretch flex h-[419px] items-center justify-center left-[556px] rounded-[24px] top-[23px] w-[416px]" data-name="Solutions" style={{ backgroundImage: "linear-gradient(134.794deg, rgba(219, 234, 254, 0.5) 0%, rgba(206, 250, 254, 0.5) 100%)" }}>
      <div className="h-[419px] relative rounded-[24px] shrink-0 w-[416px]" data-name="image 1">
        <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none rounded-[24px]">
          <img alt="" className="absolute h-[112.42%] left-[-41.46%] max-w-none top-[-6.21%] w-[169.86%]" src={imgImage1} />
        </div>
      </div>
    </div>
  );
}

function Solutions2() {
  return <div className="absolute h-[419px] left-[556px] rounded-[24px] top-[23px] w-[416px]" data-name="Solutions" style={{ backgroundImage: "linear-gradient(134.794deg, rgba(219, 234, 254, 0.5) 0%, rgba(206, 250, 254, 0.5) 100%)" }} />;
}

function Heading1() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Playfair:Bold',sans-serif] font-bold leading-[48px] left-0 text-[#0f172b] text-[72px] top-[-5px]" style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}>
        SUMMA
      </p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex h-[28px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[28px] min-h-px min-w-px not-italic relative text-[#45556c] text-[24px] whitespace-pre-wrap">Smart Dispenser System</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[88px] items-start left-0 top-[96px] w-[492px]" data-name="Container">
      <Heading1 />
      <Paragraph />
    </div>
  );
}

function Container3() {
  return <div className="absolute bg-[#155dfc] left-0 rounded-[33554400px] size-[6px] top-[12px]" data-name="Container" />;
}

function Text() {
  return (
    <div className="absolute h-[28px] left-[18px] top-0 w-[353px]" data-name="Text">
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[28px] left-0 not-italic text-[#314158] text-[24px] top-[-1px]">automatic counting and tracking</p>
    </div>
  );
}

function ListItem() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="List Item">
      <Container3 />
      <Text />
    </div>
  );
}

function Container4() {
  return <div className="absolute bg-[#155dfc] left-0 rounded-[33554400px] size-[6px] top-[12px]" data-name="Container" />;
}

function Text1() {
  return (
    <div className="absolute h-[28px] left-[18px] top-0 w-[169.328px]" data-name="Text">
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[28px] left-0 not-italic text-[#314158] text-[24px] top-[-1px]">Real-time monitoring</p>
    </div>
  );
}

function ListItem1() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="List Item">
      <Container4 />
      <Text1 />
    </div>
  );
}

function Container5() {
  return <div className="absolute bg-[#155dfc] left-0 rounded-[33554400px] size-[6px] top-[12px]" data-name="Container" />;
}

function Text2() {
  return (
    <div className="absolute h-[28px] left-[18px] top-0 w-[175.031px]" data-name="Text">
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[28px] left-0 not-italic text-[#314158] text-[24px] top-[-1px]">no external controls</p>
    </div>
  );
}

function ListItem2() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="List Item">
      <Container5 />
      <Text2 />
    </div>
  );
}

function List() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[116px] items-start left-0 top-[216px] w-[492px]" data-name="List">
      <ListItem />
      <ListItem1 />
      <ListItem2 />
    </div>
  );
}

function Solutions3() {
  return (
    <div className="absolute h-[392px] left-[62px] top-[14px] w-[492px]" data-name="Solutions">
      <Container2 />
      <List />
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[164.08px] size-[20px] top-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M4.16667 10H15.8333" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1ae0b780} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Hero() {
  return (
    <div className="absolute bg-[#0f172b] h-[56px] left-[62px] rounded-[33554400px] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.1),0px_8px_10px_0px_rgba(0,0,0,0.1)] top-[395px] w-[216.078px]" data-name="Hero">
      <p className="-translate-x-1/2 absolute font-['Poppins:SemiBold',sans-serif] leading-[24px] left-[94px] not-italic text-[16px] text-center text-white top-[14px]">Explore SUMMA</p>
      <Icon />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[62px] top-[14px]">
      <Solutions3 />
      <Hero />
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[492px] relative shrink-0 w-full" data-name="Container">
      <Solutions1 />
      <Solutions2 />
      <Group1 />
    </div>
  );
}

function Solutions4() {
  return (
    <div className="absolute content-stretch flex h-[419px] items-center justify-center left-[62px] rounded-[24px] top-[18px] w-[416px]" data-name="Solutions" style={{ backgroundImage: "linear-gradient(134.794deg, rgba(208, 250, 229, 0.5) 0%, rgba(203, 251, 241, 0.5) 100%)" }}>
      <div className="h-[419px] relative rounded-[25px] shrink-0 w-[415px]" data-name="image 2">
        <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none rounded-[25px]">
          <img alt="" className="absolute h-[108.86%] left-[-37.94%] max-w-none top-[-8.86%] w-[165.09%]" src={imgImage2} />
        </div>
      </div>
    </div>
  );
}

function Solutions5() {
  return <div className="absolute h-[419px] left-[62px] rounded-[24px] top-[18px] w-[416px]" data-name="Solutions" style={{ backgroundImage: "linear-gradient(134.794deg, rgba(208, 250, 229, 0.5) 0%, rgba(203, 251, 241, 0.5) 100%)" }} />;
}

function Heading2() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Playfair:Bold',sans-serif] font-bold leading-[48px] left-0 text-[#0f172b] text-[72px] top-[-5px]" style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}>
        ALMUS
      </p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="content-stretch flex h-[28px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[28px] min-h-px min-w-px not-italic relative text-[#45556c] text-[24px] whitespace-pre-wrap">Smart Dispenser System</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[88px] items-start left-0 top-[96px] w-[492px]" data-name="Container">
      <Heading2 />
      <Paragraph1 />
    </div>
  );
}

function Container8() {
  return <div className="absolute bg-[#155dfc] left-0 rounded-[33554400px] size-[6px] top-[12px]" data-name="Container" />;
}

function Text3() {
  return (
    <div className="absolute h-[28px] left-[18px] top-0 w-[265.719px]" data-name="Text">
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[28px] left-0 not-italic text-[#314158] text-[24px] top-[-1px]">It mixes water with natural flavors</p>
    </div>
  );
}

function ListItem3() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="List Item">
      <Container8 />
      <Text3 />
    </div>
  );
}

function Container9() {
  return <div className="absolute bg-[#155dfc] left-0 rounded-[33554400px] size-[6px] top-[12px]" data-name="Container" />;
}

function Text4() {
  return (
    <div className="absolute h-[28px] left-[18px] top-0 w-[169.328px]" data-name="Text">
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[28px] left-0 not-italic text-[#314158] text-[24px] top-[-1px]">Very low calorie / no sugar</p>
    </div>
  );
}

function ListItem4() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="List Item">
      <Container9 />
      <Text4 />
    </div>
  );
}

function Container10() {
  return <div className="absolute bg-[#155dfc] left-0 rounded-[33554400px] size-[6px] top-[12px]" data-name="Container" />;
}

function Text5() {
  return (
    <div className="absolute h-[28px] left-[18px] top-0 w-[175.031px]" data-name="Text">
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[28px] left-0 not-italic text-[#314158] text-[24px] top-[-1px]">Simple, clean, and modern</p>
    </div>
  );
}

function ListItem5() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="List Item">
      <Container10 />
      <Text5 />
    </div>
  );
}

function List1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[116px] items-start left-0 top-[216px] w-[492px]" data-name="List">
      <ListItem3 />
      <ListItem4 />
      <ListItem5 />
    </div>
  );
}

function Solutions6() {
  return (
    <div className="absolute h-[392px] left-[556px] top-0 w-[492px]" data-name="Solutions">
      <Container7 />
      <List1 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[164.08px] size-[20px] top-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M4.16667 10H15.8333" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1ae0b780} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Hero1() {
  return (
    <div className="absolute bg-[#0f172b] h-[56px] left-[556px] rounded-[33554400px] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.1),0px_8px_10px_0px_rgba(0,0,0,0.1)] top-[381px] w-[216.078px]" data-name="Hero">
      <p className="-translate-x-1/2 absolute font-['Pontano_Sans:Bold',sans-serif] font-bold leading-[24px] left-[94.5px] text-[16px] text-center text-white top-[14px]">Explore ALMUS</p>
      <Icon1 />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-[556px] top-0">
      <Solutions6 />
      <Hero1 />
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[492px] relative shrink-0 w-full" data-name="Container">
      <Solutions4 />
      <Solutions5 />
      <Group2 />
    </div>
  );
}

function Solutions() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[96px] h-[1080px] items-start left-[32px] top-[1249px] w-[1048px]" data-name="Solutions">
      <Container1 />
      <Container6 />
    </div>
  );
}

function Contact() {
  return <div className="-translate-x-1/2 absolute h-[577px] left-1/2 top-[3704px] w-[768px]" data-name="Contact" />;
}

function Container11() {
  return <div className="h-[197px] shrink-0 w-full" data-name="Container" />;
}

function Footer() {
  return (
    <div className="absolute content-stretch flex flex-col h-[358px] items-start left-0 pt-[81px] px-[24px] top-[4967.25px] w-[1096px]" data-name="Footer">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-solid border-t inset-0 pointer-events-none" />
      <Container11 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex h-[32px] items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex-[1_0_0] font-['Arial:Bold',sans-serif] leading-[32px] min-h-px min-w-px not-italic relative text-[#0f172b] text-[24px] whitespace-pre-wrap">
        <p className="mb-0">ULTIMA</p>
        <p>LOGO</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute content-stretch flex flex-col h-[96px] items-start left-0 top-0 w-[317.328px]" data-name="Container">
      <Heading3 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#0f172b] text-[16px] top-[-2px]">ULTIMA</p>
    </div>
  );
}

function Link() {
  return (
    <div className="absolute content-stretch flex h-[21px] items-start left-0 top-px w-[58.547px]" data-name="Link">
      <p className="font-['Arial:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#45556c] text-[16px]">About us</p>
    </div>
  );
}

function ListItem6() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Link />
    </div>
  );
}

function Link1() {
  return (
    <div className="absolute content-stretch flex h-[21px] items-start left-0 top-px w-[51.719px]" data-name="Link">
      <p className="font-['Arial:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#45556c] text-[16px]">Our Localisation</p>
    </div>
  );
}

function ListItem7() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Link1 />
    </div>
  );
}

function List2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[56px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem6 />
      <ListItem7 />
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[96px] items-start left-[271px] top-[0.75px] w-[265px]" data-name="Container">
      <Heading4 />
      <List2 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="h-[24px] relative shrink-0 w-[187px]" data-name="Heading 4">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#0f172b] text-[16px] top-[-2px]">Support</p>
    </div>
  );
}

function Link2() {
  return (
    <div className="absolute content-stretch flex h-[21px] items-start left-0 top-px w-[43.578px]" data-name="Link">
      <p className="font-['Arial:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#45556c] text-[16px]">Contact</p>
    </div>
  );
}

function ListItem8() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Link2 />
    </div>
  );
}

function Link3() {
  return (
    <div className="absolute content-stretch flex h-[21px] items-start left-0 top-px w-[54.719px]" data-name="Link">
      <p className="font-['Arial:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#45556c] text-[16px]">FAQ</p>
    </div>
  );
}

function ListItem9() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Link3 />
    </div>
  );
}

function List3() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[56px] items-start relative shrink-0 w-[187px]" data-name="List">
      <ListItem8 />
      <ListItem9 />
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[96px] items-start left-[536px] top-[0.75px] w-[241px]" data-name="Container">
      <Heading5 />
      <List3 />
    </div>
  );
}

function Heading6() {
  return (
    <div className="h-[24px] relative shrink-0 w-[187px]" data-name="Heading 4">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#0f172b] text-[16px] top-[-2px]">Follow Us</p>
    </div>
  );
}

function Link4() {
  return (
    <div className="absolute content-stretch flex h-[21px] items-start left-0 top-px w-[43.578px]" data-name="Link">
      <p className="font-['Arial:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#45556c] text-[16px]">Contact</p>
    </div>
  );
}

function ListItem10() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Link4 />
    </div>
  );
}

function Link5() {
  return (
    <div className="absolute content-stretch flex h-[21px] items-start left-0 top-px w-[54.719px]" data-name="Link">
      <p className="font-['Arial:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#45556c] text-[16px]">FAQ</p>
    </div>
  );
}

function ListItem11() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
      <Link5 />
    </div>
  );
}

function List4() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[56px] items-start relative shrink-0 w-[187px]" data-name="List">
      <ListItem10 />
      <ListItem11 />
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[96px] items-start left-[777px] top-[0.75px] w-[259px]" data-name="Container">
      <Heading6 />
      <List4 />
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute h-[96px] left-[24px] top-[4281px] w-[1048px]" data-name="Container">
      <Container13 />
      <Container14 />
      <Container15 />
      <Container16 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Arial:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#62748e] text-[14px] text-center whitespace-pre-wrap">© 2026 ULTIMA. All rights reserved.</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute content-stretch flex flex-col h-[53px] items-start left-[24px] pt-[33px] top-[4425px] w-[1048px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-solid border-t inset-0 pointer-events-none" />
      <Paragraph2 />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents left-[24px] top-[4281px]">
      <Container12 />
      <Container17 />
    </div>
  );
}

function Container19() {
  return <div className="blur-[64px] rounded-[33554400px] size-[396.492px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgba(190, 219, 255, 0.4) 0%, rgba(221, 214, 255, 0.4) 100%)" }} />;
}

function Container20() {
  return <div className="blur-[64px] rounded-[33554400px] size-[411.813px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgba(162, 244, 253, 0.4) 0%, rgba(190, 219, 255, 0.4) 100%)" }} />;
}

function Container18() {
  return (
    <div className="absolute h-[640px] left-0 overflow-clip top-0 w-[1096px]" data-name="Container">
      <div className="absolute flex items-center justify-center left-[612.64px] size-[409.391px] top-[66.17px]" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[1.9deg]">
          <Container19 />
        </div>
      </div>
      <div className="absolute flex items-center justify-center left-[66.09px] size-[441.641px] top-[148.36px]" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[-4.32deg]">
          <Container20 />
        </div>
      </div>
    </div>
  );
}

function Container22() {
  return <div className="absolute bg-[rgba(255,255,255,0.4)] border border-[rgba(255,255,255,0.61)] border-solid left-[700.03px] rounded-[16px] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.1),0px_8px_10px_0px_rgba(0,0,0,0.1)] size-[128px] top-[150.95px]" data-name="Container" />;
}

function Container23() {
  return <div className="absolute bg-[rgba(255,255,255,0.4)] border border-[rgba(255,255,255,0.61)] border-solid left-[269.56px] rounded-[24px] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.1),0px_8px_10px_0px_rgba(0,0,0,0.1)] size-[160px] top-[326.67px]" data-name="Container" />;
}

function Container21() {
  return (
    <div className="absolute h-[640px] left-0 overflow-clip top-0 w-[1096px]" data-name="Container">
      <Container22 />
      <Container23 />
    </div>
  );
}

function Heading() {
  return (
    <div className="absolute font-['Playfair:SemiBold',sans-serif] font-semibold h-[158.375px] leading-[79.2px] left-0 text-[#0f172b] text-[80px] text-center top-[70px] tracking-[-1.8px] w-[768px]" data-name="Heading 1">
      <p className="-translate-x-1/2 absolute left-[384.98px] top-[-8px]" style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}>
        Healthcare,
      </p>
      <p className="-translate-x-1/2 absolute left-[384.64px] top-[71.19px]" style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}>
        intelligently designed.
      </p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="absolute h-[78px] left-0 top-[260.38px] w-[768px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Poppins:Regular',sans-serif] leading-[39px] left-1/2 not-italic text-[#45556c] text-[24px] text-center top-[-3.19px] w-[794px] whitespace-pre-wrap">Smart systems that elevate safety, hygiene, and operational control in modern healthcare environments.</p>
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[174.02px] size-[20px] top-[19.81px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M4.16667 10H15.8333" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1ae0b780} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Hero3() {
  return (
    <div className="bg-[#0f172b] h-[56px] relative rounded-[33554400px] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.1),0px_8px_10px_0px_rgba(0,0,0,0.1)] shrink-0 w-[216.078px]" data-name="Hero">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Poppins:SemiBold',sans-serif] leading-[24px] left-[90.44px] not-italic text-[16px] text-center text-white top-[15.81px]">Explore solutions</p>
        <Icon2 />
      </div>
    </div>
  );
}

function Hero4() {
  return (
    <div className="bg-[rgba(255,255,255,0.6)] h-[58px] relative rounded-[33554400px] shrink-0 w-[183.797px]" data-name="Hero">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.8)] border-solid inset-0 pointer-events-none rounded-[33554400px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Poppins:SemiBold',sans-serif] leading-[24px] left-[91.86px] not-italic text-[#314158] text-[16px] text-center top-[16.81px]">Contact ULTIMA</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute content-stretch flex gap-[16px] h-[74px] items-center justify-center left-0 top-[370.38px] w-[768px]" data-name="Container">
      <Hero3 />
      <Hero4 />
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute h-[444.375px] left-[164px] top-[97.81px] w-[768px]" data-name="Container">
      <Heading />
      <Paragraph3 />
      <Container25 />
    </div>
  );
}

function Hero2() {
  return (
    <div className="absolute h-[640px] left-[8px] overflow-clip top-[-37px] w-[1096px]" data-name="Hero">
      <Container18 />
      <Container21 />
      <Container24 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="absolute h-[128px] left-[calc(8.33%+16.67px)] top-[673px] w-[896px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Poppins:Regular',sans-serif] leading-[48.75px] left-[448.25px] not-italic text-[#45556c] text-[24px] text-center top-[-4px] w-[836px] whitespace-pre-wrap">ULTIMA delivers innovative healthcare products and intelligent systems designed to enhance safety, efficiency, and care quality in modern environments.</p>
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.6)] border border-[rgba(255,255,255,0.8)] border-solid h-[62px] left-[174px] rounded-[33554400px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] top-[0.5px] w-[189px]" data-name="Container">
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[28px] left-[23px] not-italic text-[#1d293d] text-[18px] top-[15px]">Smart products</p>
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.6)] border border-[rgba(255,255,255,0.8)] border-solid h-[62px] left-[433px] rounded-[33554400px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] top-0 w-[145.516px]" data-name="Container">
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[28px] left-[19.56px] not-italic text-[#1d293d] text-[18px] top-[16.5px]">Technology</p>
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.6)] border border-[rgba(255,255,255,0.8)] border-solid h-[62px] left-[648px] rounded-[33554400px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] top-0 w-[153.703px]" data-name="Container">
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[28px] left-[26px] not-italic text-[#1d293d] text-[18px] top-[15px]">Innovation</p>
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute h-[62px] left-[68px] top-[866px] w-[976px]" data-name="Container">
      <Container27 />
      <Container28 />
      <Container29 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[68px] top-[673px]">
      <Paragraph4 />
      <Container26 />
    </div>
  );
}

function Solutions7() {
  return (
    <div className="h-[60px] relative shrink-0 w-full" data-name="Solutions">
      <p className="-translate-x-1/2 absolute font-['Playfair:Bold',sans-serif] font-bold leading-[60px] left-[524.78px] text-[#0f172b] text-[72px] text-center top-[-6px]" style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}>
        Solutions
      </p>
    </div>
  );
}

function Solutions8() {
  return (
    <div className="content-stretch flex h-[28px] items-start relative shrink-0 w-full" data-name="Solutions">
      <p className="flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[28px] min-h-px min-w-px not-italic relative text-[#45556c] text-[24px] text-center whitespace-pre-wrap">Intelligent systems for modern healthcare</p>
    </div>
  );
}

function Container30() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col gap-[16px] items-start left-1/2 top-[1073px] w-[1048px]" data-name="Container">
      <Solutions7 />
      <Solutions8 />
    </div>
  );
}

function Heading7() {
  return (
    <div className="absolute h-[60px] left-[24px] top-[2480px] w-[1048px]" data-name="Heading 2">
      <p className="-translate-x-1/2 absolute font-['Playfair:Bold',sans-serif] font-bold leading-[60px] left-[calc(50%+0.5px)] text-[#0f172b] text-[72px] text-center top-[-6px]" style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}>
        ULTIMA at a glance
      </p>
    </div>
  );
}

function Container32() {
  return (
    <div className="bg-[rgba(255,255,255,0.6)] h-[119px] relative rounded-[24px] shrink-0 w-[268px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.8)] border-solid inset-0 pointer-events-none rounded-[24px] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.1),0px_8px_10px_0px_rgba(0,0,0,0.1)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Poppins:Medium',sans-serif] leading-[28px] left-[133.5px] not-italic text-[#45556c] text-[18px] text-center top-[32px] w-[241px] whitespace-pre-wrap">Healthcare-focused technology company</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex h-[119px] items-center left-[calc(20.83%-0.33px)] top-1/2 w-[268px]" data-name="Container">
      <Container32 />
    </div>
  );
}

function Container34() {
  return (
    <div className="bg-[rgba(255,255,255,0.6)] h-[119px] relative rounded-[24px] shrink-0 w-[268px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.8)] border-solid inset-0 pointer-events-none rounded-[24px] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.1),0px_8px_10px_0px_rgba(0,0,0,0.1)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Poppins:Medium',sans-serif] leading-[28px] left-[133.5px] not-italic text-[#45556c] text-[18px] text-center top-[32px] w-[241px] whitespace-pre-wrap">Smart products for modern environments</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex h-[119px] items-center left-[calc(50%+1px)] top-1/2 w-[268px]" data-name="Container">
      <Container34 />
    </div>
  );
}

function Heading8() {
  return (
    <div className="absolute h-[225px] left-0 top-[79.5px] w-[492px]" data-name="Heading 2">
      <p className="absolute font-['Playfair:Bold',sans-serif] font-bold h-[247px] leading-[75px] left-[70px] text-[#0f172b] text-[72px] top-[-0.5px] w-[486px] whitespace-pre-wrap" style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}>
        Designed for real healthcare challenges
      </p>
    </div>
  );
}

function Icon3() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
            <path d={svgPaths.pb60700} id="Vector" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[41.67%_37.5%]" data-name="Vector">
        <div className="absolute inset-[-25%_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 6">
            <path d="M1 3L3 5L7 1" id="Vector" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function WhyUltima1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="WhyUltima">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon3 />
      </div>
    </div>
  );
}

function WhyUltima2() {
  return (
    <div className="h-[28px] relative shrink-0 w-[177.703px]" data-name="WhyUltima">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Poppins:Medium',sans-serif] leading-[28px] left-0 not-italic text-[#1d293d] text-[18px] top-[-1px]">Built for professionals</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="bg-[rgba(255,255,255,0.6)] h-[78px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.8)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)]" />
      <div className="content-stretch flex gap-[16px] items-start pb-px pl-[25px] pr-px pt-[25px] relative size-full">
        <WhyUltima1 />
        <WhyUltima2 />
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
            <path d={svgPaths.pb60700} id="Vector" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[41.67%_37.5%]" data-name="Vector">
        <div className="absolute inset-[-25%_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 6">
            <path d="M1 3L3 5L7 1" id="Vector" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function WhyUltima3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="WhyUltima">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon4 />
      </div>
    </div>
  );
}

function WhyUltima4() {
  return (
    <div className="h-[28px] relative shrink-0 w-[225.016px]" data-name="WhyUltima">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Poppins:Medium',sans-serif] leading-[28px] left-0 not-italic text-[#1d293d] text-[18px] top-[-1px]">{`Privacy & reliability focused`}</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="bg-[rgba(255,255,255,0.6)] h-[78px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.8)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)]" />
      <div className="content-stretch flex gap-[16px] items-start pb-px pl-[25px] pr-px pt-[25px] relative size-full">
        <WhyUltima3 />
        <WhyUltima4 />
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
            <path d={svgPaths.pb60700} id="Vector" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[41.67%_37.5%]" data-name="Vector">
        <div className="absolute inset-[-25%_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 6">
            <path d="M1 3L3 5L7 1" id="Vector" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function WhyUltima5() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="WhyUltima">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon5 />
      </div>
    </div>
  );
}

function WhyUltima6() {
  return (
    <div className="h-[28px] relative shrink-0 w-[136.156px]" data-name="WhyUltima">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Poppins:Medium',sans-serif] leading-[28px] left-0 not-italic text-[#1d293d] text-[18px] top-[-1px]">Scalable systems</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="bg-[rgba(255,255,255,0.6)] h-[78px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.8)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)]" />
      <div className="content-stretch flex gap-[16px] items-start pb-px pl-[25px] pr-px pt-[25px] relative size-full">
        <WhyUltima5 />
        <WhyUltima6 />
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
            <path d={svgPaths.pb60700} id="Vector" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[41.67%_37.5%]" data-name="Vector">
        <div className="absolute inset-[-25%_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 6">
            <path d="M1 3L3 5L7 1" id="Vector" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function WhyUltima7() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="WhyUltima">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon6 />
      </div>
    </div>
  );
}

function WhyUltima8() {
  return (
    <div className="h-[28px] relative shrink-0 w-[220.703px]" data-name="WhyUltima">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Poppins:Medium',sans-serif] leading-[28px] left-0 not-italic text-[#1d293d] text-[18px] top-[-1px]">Future-ready infrastructure</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="bg-[rgba(255,255,255,0.6)] h-[78px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.8)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)]" />
      <div className="content-stretch flex gap-[16px] items-start pb-px pl-[25px] pr-px pt-[25px] relative size-full">
        <WhyUltima7 />
        <WhyUltima8 />
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] h-[384px] items-start left-[581px] top-0 w-[399px]" data-name="Container">
      <Container37 />
      <Container38 />
      <Container39 />
      <Container40 />
    </div>
  );
}

function Container35() {
  return (
    <div className="absolute h-[384px] left-[24px] top-[128px] w-[1048px]" data-name="Container">
      <Heading8 />
      <Container36 />
    </div>
  );
}

function WhyUltima() {
  return (
    <div className="absolute h-[640px] left-0 overflow-clip top-[2734px] w-[1096px]" data-name="WhyUltima">
      <Container35 />
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Label">
      <p className="flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#314158] text-[18px] whitespace-pre-wrap">Name</p>
    </div>
  );
}

function TextInput() {
  return (
    <div className="bg-white h-[50px] relative rounded-[14px] shrink-0 w-full" data-name="Text Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[16px] py-[12px] relative size-full">
          <p className="font-['Arial:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(10,10,10,0.5)]">Your name</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Container41() {
  return (
    <div className="col-[1] content-stretch flex flex-col gap-[8px] items-start relative row-[1] self-stretch shrink-0" data-name="Container">
      <Label />
      <TextInput />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Label">
      <p className="flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#314158] text-[18px] whitespace-pre-wrap">Organization</p>
    </div>
  );
}

function TextInput1() {
  return (
    <div className="bg-white h-[50px] relative rounded-[14px] shrink-0 w-full" data-name="Text Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[16px] py-[12px] relative size-full">
          <p className="font-['Arial:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(10,10,10,0.5)]">Your organization</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Container42() {
  return (
    <div className="col-[2] content-stretch flex flex-col gap-[8px] items-start relative row-[1] self-stretch shrink-0" data-name="Container">
      <Label1 />
      <TextInput1 />
    </div>
  );
}

function Contact1() {
  return (
    <div className="gap-[24px] grid grid-cols-[repeat(2,_minmax(0,_1fr))] grid-rows-[repeat(1,_minmax(0,_1fr))] h-[78px] relative shrink-0 w-full" data-name="Contact">
      <Container41 />
      <Container42 />
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Label">
      <p className="flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#314158] text-[18px] whitespace-pre-wrap">Email</p>
    </div>
  );
}

function EmailInput() {
  return (
    <div className="bg-white h-[50px] relative rounded-[14px] shrink-0 w-full" data-name="Email Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[16px] py-[12px] relative size-full">
          <p className="font-['Arial:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(10,10,10,0.5)]">your.email@example.com</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Contact2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[78px] items-start relative shrink-0 w-full" data-name="Contact">
      <Label2 />
      <EmailInput />
    </div>
  );
}

function Label3() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Label">
      <p className="flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#314158] text-[18px] whitespace-pre-wrap">Message</p>
    </div>
  );
}

function TextArea() {
  return (
    <div className="bg-white h-[146px] relative rounded-[14px] shrink-0 w-full" data-name="Text Area">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start px-[16px] py-[12px] relative size-full">
          <p className="font-['Arial:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-[rgba(10,10,10,0.5)]">Tell us about your needs...</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Contact3() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[180px] items-start relative shrink-0 w-full" data-name="Contact">
      <Label3 />
      <TextArea />
    </div>
  );
}

function Form() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.6)] content-stretch flex flex-col gap-[24px] h-[546px] items-start left-[calc(8.33%+72.67px)] pb-px pt-[41px] px-[41px] rounded-[24px] top-[3593px] w-[768px]" data-name="Form">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.8)] border-solid inset-0 pointer-events-none rounded-[24px] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.1),0px_8px_10px_0px_rgba(0,0,0,0.1)]" />
      <Contact1 />
      <Contact2 />
      <Contact3 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="absolute left-[160px] size-[20px] top-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_16_1447)" id="Icon">
          <path d={svgPaths.p36f10880} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p31491280} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_16_1447">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents left-[37px] top-[14px]">
      <p className="-translate-x-1/2 absolute font-['Poppins:SemiBold',sans-serif] leading-[24px] left-[92.5px] not-italic text-[18px] text-center text-white top-[14px]">Get in touch</p>
      <Icon7 />
    </div>
  );
}

function Contact4() {
  return (
    <div className="-translate-x-1/2 absolute bg-[#0f172b] h-[56px] left-1/2 rounded-[33554400px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] top-[4049px] w-[216px]" data-name="Contact">
      <Group3 />
    </div>
  );
}

function Group4() {
  return (
    <div className="-translate-x-1/2 absolute contents left-1/2 top-[3593px]">
      <Form />
      <Contact4 />
    </div>
  );
}

function Container44() {
  return (
    <div className="bg-[rgba(255,255,255,0.6)] h-[119px] relative rounded-[24px] shrink-0 w-[268px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.8)] border-solid inset-0 pointer-events-none rounded-[24px] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.1),0px_8px_10px_0px_rgba(0,0,0,0.1)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Poppins:Medium',sans-serif] leading-[28px] left-[133.5px] not-italic text-[#45556c] text-[18px] text-center top-[32px] w-[241px] whitespace-pre-wrap">Innovation driven by real needs</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex h-[119px] items-center left-[calc(79.17%+2.33px)] top-1/2 w-[268px]" data-name="Container">
      <Container44 />
    </div>
  );
}

function Container45() {
  return <div className="blur-[64px] rounded-[33554400px] size-[396.492px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgba(190, 219, 255, 0.2) 0%, rgba(221, 214, 255, 0.2) 100%)" }} />;
}

export default function HealthcareSolutionsLandingPage() {
  return (
    <div className="relative size-full" data-name="Healthcare Solutions Landing Page" style={{ backgroundImage: "linear-gradient(101.63deg, rgb(248, 250, 252) 0%, rgba(239, 246, 255, 0.3) 50%, rgba(245, 243, 255, 0.2) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }}>
      <div className="absolute flex items-center justify-center left-[calc(75%+9px)] size-[441.641px] top-[2474px]" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[-4.32deg]">
          <Container />
        </div>
      </div>
      <Solutions />
      <Contact />
      <p className="-translate-x-1/2 absolute font-['Playfair:Bold',sans-serif] font-bold leading-[75px] left-[calc(16.67%+365.71px)] text-[#0f172b] text-[72px] text-center top-[3388px]" style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}>{`Let's build safer, smarter`}</p>
      <p className="-translate-x-1/2 absolute font-['Playfair:Bold',sans-serif] font-bold leading-[75px] left-[calc(8.33%+456.67px)] text-[#0f172b] text-[72px] text-center top-[3463px]" style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}>
        healthcare environments.
      </p>
      <Footer />
      <Group5 />
      <Hero2 />
      <Group />
      <Container30 />
      <Heading7 />
      <Container31 />
      <Container33 />
      <WhyUltima />
      <Group4 />
      <Container43 />
      <div className="absolute flex items-center justify-center left-[-122px] size-[409.391px] top-[950px]" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[1.9deg]">
          <Container45 />
        </div>
      </div>
    </div>
  );
}