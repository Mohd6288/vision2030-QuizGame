/* ═══════════════════════════════════════
   STORY SLIDES
   Educational content shown before each
   quiz category. 4 slides per category.
═══════════════════════════════════════ */

import type { CategoryId } from "./questions";

export interface StorySlide {
  title: string;
  titleAr: string;
  body: string;
  bodyAr: string;
  image: string;
  funFact: string;
}

export const STORIES: Record<CategoryId, StorySlide[]> = {
  neom: [
    {
      title: "Welcome to NEOM",
      titleAr: "مرحباً بك في نيوم",
      body: "NEOM is a $500 billion megacity project in northwest Saudi Arabia, announced in 2017 by Crown Prince Mohammed bin Salman. It spans 26,500 km² — roughly the size of Belgium — and aims to be a blueprint for sustainable living.",
      bodyAr: "نيوم مشروع مدينة عملاقة بقيمة ٥٠٠ مليار دولار في شمال غرب المملكة العربية السعودية",
      image: "/images/categories/neom.svg",
      funFact: "The name 'NEOM' combines the Greek word 'neo' (new) with the Arabic letter 'M' for Mostaqbal (future).",
    },
    {
      title: "THE LINE — A City Like No Other",
      titleAr: "ذا لاين — مدينة فريدة",
      body: "THE LINE is a 170 km linear city within NEOM with zero cars, zero streets, and zero carbon emissions. It will house 9 million residents in a structure just 200 meters wide but 500 meters tall, powered entirely by renewable energy.",
      bodyAr: "ذا لاين مدينة خطية بطول ١٧٠ كم بدون سيارات وبدون انبعاثات كربونية",
      image: "/images/categories/neom.svg",
      funFact: "Residents of THE LINE will be able to access all daily needs within a 5-minute walk.",
    },
    {
      title: "Oxagon, Trojena & Sindalah",
      titleAr: "أوكساجون وتروجينا وسندالة",
      body: "NEOM includes Oxagon — the world's largest floating industrial complex; Trojena — a mountain destination that will host the 2029 Asian Winter Games with year-round skiing; and Sindalah — a luxury island resort in the Red Sea.",
      bodyAr: "نيوم تضم أوكساجون أكبر مجمع صناعي عائم في العالم وتروجينا وجهة جبلية للتزلج",
      image: "/images/categories/neom.svg",
      funFact: "Trojena will have outdoor skiing in a country known for its deserts — temperatures there drop below 0°C in winter!",
    },
    {
      title: "Qiddiya & The Red Sea Project",
      titleAr: "القدية ومشروع البحر الأحمر",
      body: "Beyond NEOM, Saudi Arabia is building Qiddiya — the entertainment capital near Riyadh with the world's fastest roller coaster — and The Red Sea Project, a luxury tourism destination across 90+ islands with pristine coral reefs.",
      bodyAr: "القدية عاصمة الترفيه في السعودية ومشروع البحر الأحمر وجهة سياحية فاخرة",
      image: "/images/categories/neom.svg",
      funFact: "Qiddiya's Six Flags theme park will feature a coaster reaching speeds over 250 km/h!",
    },
  ],

  vision: [
    {
      title: "What is Vision 2030?",
      titleAr: "ما هي رؤية ٢٠٣٠؟",
      body: "Vision 2030 is Saudi Arabia's strategic framework to reduce dependence on oil and diversify the economy. Launched in April 2016 by Crown Prince Mohammed bin Salman, it rests on three pillars: a vibrant society, a thriving economy, and an ambitious nation.",
      bodyAr: "رؤية ٢٠٣٠ إطار استراتيجي لتقليل الاعتماد على النفط وتنويع الاقتصاد",
      image: "/images/categories/vision.svg",
      funFact: "Saudi Arabia's Public Investment Fund (PIF) manages over $700 billion in assets, making it one of the largest sovereign wealth funds.",
    },
    {
      title: "Economic Transformation",
      titleAr: "التحول الاقتصادي",
      body: "Vision 2030 aims to increase non-oil revenue from 163 billion to 1 trillion SAR. Key initiatives include developing tourism (targeting 100 million visits/year), growing the entertainment sector, and privatizing government services.",
      bodyAr: "تهدف الرؤية لزيادة الإيرادات غير النفطية واستقطاب ١٠٠ مليون زيارة سنوياً",
      image: "/images/categories/vision.svg",
      funFact: "Saudi Arabia issued its first tourist visas in September 2019 — before that, only business and religious visas were available.",
    },
    {
      title: "Society & Culture Goals",
      titleAr: "أهداف المجتمع والثقافة",
      body: "The plan includes empowering women in the workforce (target: 30%), promoting sports and entertainment, preserving Saudi heritage, and building world-class cultural venues. Women gained the right to drive in 2018 as part of these reforms.",
      bodyAr: "تشمل الخطة تمكين المرأة وتعزيز الرياضة والترفيه والحفاظ على التراث",
      image: "/images/categories/vision.svg",
      funFact: "Saudi Arabia opened its first public cinema in 35 years in April 2018, screening 'Black Panther'.",
    },
    {
      title: "Smart Cities & Digital Future",
      titleAr: "المدن الذكية والمستقبل الرقمي",
      body: "Vision 2030 is investing heavily in technology: smart city infrastructure, AI research, a growing tech startup ecosystem, and digital government services. Saudi Arabia ranks among the top 10 globally in 5G coverage.",
      bodyAr: "تستثمر الرؤية في التكنولوجيا والذكاء الاصطناعي والمدن الذكية",
      image: "/images/categories/vision.svg",
      funFact: "Saudi Arabia's SDAIA (Saudi Data & AI Authority) hosts the annual Global AI Summit in Riyadh.",
    },
  ],

  culture: [
    {
      title: "Saudi Hospitality — A Way of Life",
      titleAr: "الضيافة السعودية — أسلوب حياة",
      body: "Saudi culture is rooted in generous hospitality. Serving Arabic coffee (Gahwa) with dates is a cherished tradition. The Dallah coffee pot is so iconic it appears on the Saudi one-riyal coin. Guests are always honored with the best food and seating.",
      bodyAr: "الثقافة السعودية متجذرة في كرم الضيافة وتقديم القهوة العربية مع التمر",
      image: "/images/categories/culture.svg",
      funFact: "Arabic coffee (Gahwa) is flavored with cardamom and saffron, and is traditionally poured from a Dallah into small cups called Finjal.",
    },
    {
      title: "Traditional Dress & Art",
      titleAr: "اللباس التقليدي والفن",
      body: "The Thobe is the traditional white robe worn by Saudi men, while women wear the Abaya. Saudi art includes the Ardah sword dance — the national dance performed at celebrations — and Sadu weaving, a Bedouin textile art recognized by UNESCO.",
      bodyAr: "الثوب هو اللباس التقليدي للرجال والعباءة للنساء والعرضة هي الرقصة الوطنية",
      image: "/images/categories/culture.svg",
      funFact: "The Ardah sword dance dates back over 300 years and was originally performed before battles to boost morale.",
    },
    {
      title: "Cuisine & Celebrations",
      titleAr: "المأكولات والاحتفالات",
      body: "Saudi cuisine features Kabsa (spiced rice with meat) as the national dish, along with Jareesh, Mutabbaq, and Harees. Major celebrations include Eid al-Fitr, Eid al-Adha, and Saudi National Day on September 23rd.",
      bodyAr: "الكبسة هي الطبق الوطني والأعياد الرئيسية تشمل عيد الفطر وعيد الأضحى واليوم الوطني",
      image: "/images/categories/culture.svg",
      funFact: "Kabsa gets its name from the Arabic word 'kabas' meaning to press, referring to the cooking method.",
    },
    {
      title: "Modern Saudi Culture",
      titleAr: "الثقافة السعودية الحديثة",
      body: "Today Saudi Arabia hosts major events: Riyadh Season (entertainment festival), Jeddah Season, MDL Beast (music festival), Formula 1 Grand Prix, and international concerts. The country has rapidly become a global entertainment destination.",
      bodyAr: "تستضيف السعودية اليوم موسم الرياض وموسم جدة وفورمولا ١ وحفلات عالمية",
      image: "/images/categories/culture.svg",
      funFact: "Riyadh Season 2023 attracted over 12 million visitors with events spanning sports, music, food, and art.",
    },
  ],

  geography: [
    {
      title: "The Kingdom's Landscape",
      titleAr: "جغرافية المملكة",
      body: "Saudi Arabia is the largest country in the Middle East, covering 2.15 million km². It features diverse terrain: the vast Rub' al Khali (Empty Quarter) desert, the green Asir Mountains, Red Sea coral coastline, and the volcanic Harrat Rahat lava fields.",
      bodyAr: "المملكة العربية السعودية أكبر دولة في الشرق الأوسط بمساحة ٢.١٥ مليون كم²",
      image: "/images/categories/geography.svg",
      funFact: "The Rub' al Khali is the largest continuous sand desert in the world — bigger than France!",
    },
    {
      title: "Cities & Regions",
      titleAr: "المدن والمناطق",
      body: "Saudi Arabia has 13 administrative regions. Riyadh is the capital and largest city. Jeddah is the gateway to Mecca and Medina — Islam's two holiest cities. Dammam anchors the Eastern Province, the heart of the oil industry.",
      bodyAr: "لدى السعودية ١٣ منطقة إدارية والرياض هي العاصمة وجدة بوابة الحرمين",
      image: "/images/categories/geography.svg",
      funFact: "Mecca's Masjid al-Haram can accommodate up to 4 million worshippers during Hajj season.",
    },
    {
      title: "Natural Wonders",
      titleAr: "العجائب الطبيعية",
      body: "Saudi Arabia has stunning natural sites: Al Wahbah Crater (a volcanic crater with white salt floor), Edge of the World (Jebel Fihrayn cliffs near Riyadh), Farasan Islands marine sanctuary, and the ancient Hejaz Railway through dramatic canyons.",
      bodyAr: "تضم السعودية فوهة الوعبة وحافة العالم وجزر فرسان ومواقع طبيعية مذهلة",
      image: "/images/categories/geography.svg",
      funFact: "The Edge of the World cliff face drops 300 meters straight down and offers views stretching to the horizon.",
    },
    {
      title: "Climate & Resources",
      titleAr: "المناخ والموارد",
      body: "Most of Saudi Arabia has a hot desert climate, but the southwest Asir region receives monsoon rainfall and has lush green mountains. The country has the world's largest proven oil reserves and is also investing in solar and wind energy.",
      bodyAr: "معظم السعودية مناخ صحراوي حار لكن منطقة عسير تتمتع بأمطار وجبال خضراء",
      image: "/images/categories/geography.svg",
      funFact: "Saudi Arabia's Sakaka Solar Plant is one of the largest in the Middle East, producing 300 MW of clean energy.",
    },
  ],

  history: [
    {
      title: "The Founding of Saudi Arabia",
      titleAr: "تأسيس المملكة العربية السعودية",
      body: "King Abdulaziz ibn Saud unified the kingdoms of Hejaz and Najd to found the Kingdom of Saudi Arabia on September 23, 1932. Starting from Riyadh in 1902, he spent 30 years unifying the Arabian Peninsula's diverse regions into one nation.",
      bodyAr: "وحّد الملك عبدالعزيز بن سعود الحجاز ونجد لتأسيس المملكة عام ١٩٣٢",
      image: "/images/categories/history.svg",
      funFact: "King Abdulaziz recaptured Riyadh in 1902 with just 40 men — this daring raid began the unification of Saudi Arabia.",
    },
    {
      title: "The Oil Discovery",
      titleAr: "اكتشاف النفط",
      body: "Oil was discovered in commercial quantities at Dammam Well No. 7 in 1938, transforming Saudi Arabia's economy. The Arabian American Oil Company (Aramco) was established, and Saudi Aramco is now the world's most valuable company.",
      bodyAr: "اُكتشف النفط بكميات تجارية في الدمام عام ١٩٣٨ محولاً اقتصاد المملكة",
      image: "/images/categories/history.svg",
      funFact: "Dammam Well No. 7, nicknamed 'Prosperity Well', struck oil at a depth of 1,440 meters after years of dry wells.",
    },
    {
      title: "Kings of Saudi Arabia",
      titleAr: "ملوك المملكة العربية السعودية",
      body: "Saudi Arabia has been led by seven kings from the Al Saud dynasty: Abdulaziz (founder), Saud, Faisal, Khalid, Fahd, Abdullah, and the current King Salman (since 2015). Each contributed to the nation's modernization and growth.",
      bodyAr: "قاد المملكة سبعة ملوك من آل سعود من المؤسس عبدالعزيز إلى الملك سلمان",
      image: "/images/categories/history.svg",
      funFact: "King Faisal is remembered for using oil as a diplomatic tool during the 1973 oil embargo, reshaping global politics.",
    },
    {
      title: "Ancient Heritage Sites",
      titleAr: "مواقع التراث القديمة",
      body: "Saudi Arabia has 6 UNESCO World Heritage Sites including Hegra (Madain Saleh) — a 2,000-year-old Nabataean city carved into rock, At-Turaif in Diriyah — the first Saudi capital, and the Rock Art of the Hail Region dating back 10,000 years.",
      bodyAr: "لدى السعودية ٦ مواقع تراث عالمي بما فيها الحِجر والدرعية ورسوم حائل الصخرية",
      image: "/images/categories/history.svg",
      funFact: "Hegra is often called 'the sister city of Petra' — both were built by the ancient Nabataean civilization.",
    },
  ],

  arabic: [
    {
      title: "The Arabic Language",
      titleAr: "اللغة العربية",
      body: "Arabic is one of the world's oldest and most spoken languages, with over 400 million speakers. It's the language of the Quran and is written right-to-left. The Arabic alphabet has 28 letters, and Arabic calligraphy is considered a high art form.",
      bodyAr: "العربية من أقدم اللغات في العالم ولها أكثر من ٤٠٠ مليون متحدث",
      image: "/images/categories/arabic.svg",
      funFact: "Arabic has at least 11 words for 'love', each describing a different stage of the emotion!",
    },
    {
      title: "Saudi Dialect & Greetings",
      titleAr: "اللهجة السعودية والتحيات",
      body: "Saudi Arabic has distinct dialects: Najdi (central), Hejazi (western), and Gulf (eastern). Common greetings include 'As-salamu alaykum' (peace be upon you), 'Marhaba' (hello), and 'Ahlan wa sahlan' (welcome). 'Shukran' means thank you.",
      bodyAr: "اللهجة السعودية تشمل النجدية والحجازية والخليجية مع تحيات مثل السلام عليكم ومرحبا",
      image: "/images/categories/arabic.svg",
      funFact: "The reply to 'As-salamu alaykum' is 'Wa alaykum as-salam' — returning the peace greeting.",
    },
    {
      title: "Numbers & Writing",
      titleAr: "الأرقام والكتابة",
      body: "Arabic numerals (1, 2, 3) that the world uses today originated from Arabic-Hindu mathematical traditions. In Arabic text, Eastern Arabic numerals (٠١٢٣) are commonly used. Arabic calligraphy styles include Naskh, Thuluth, and Diwani.",
      bodyAr: "الأرقام العربية المستخدمة عالمياً نشأت من التقاليد الرياضية العربية الهندية",
      image: "/images/categories/arabic.svg",
      funFact: "The word 'algorithm' comes from the name of the Persian-Arab mathematician Al-Khwarizmi!",
    },
    {
      title: "Arabic in Modern Saudi Arabia",
      titleAr: "العربية في السعودية الحديثة",
      body: "Arabic is the official language of Saudi Arabia, used in government, education, and media. Vision 2030 promotes Arabic language preservation alongside English proficiency. Common Saudi expressions include 'Yallah' (let's go) and 'Inshallah' (God willing).",
      bodyAr: "العربية هي اللغة الرسمية في المملكة وتعزز رؤية ٢٠٣٠ الحفاظ عليها",
      image: "/images/categories/arabic.svg",
      funFact: "Saudi Arabia celebrates World Arabic Language Day on December 18th every year.",
    },
  ],
};
