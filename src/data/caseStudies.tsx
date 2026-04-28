// Case Study Data Structure
// Each case study can have multiple content blocks (text or images) in any order

// Import sample images
import comfyPreview from "@/image/preview-comfyui.jpg";
import comfyImage1 from "@/image/comfy-casestudy1.png";
import comfyImage2 from "@/image/comfy-casestudy2.png";
import comfyImage4 from "@/image/comfy-casestudy4.png";
import comfyImage5 from "@/image/comfy-casestudy5.png";
import sagePreview from "@/image/preview-sagesocial5.png";
import sageImage1 from "@/image/casestudy-sage-1.gif";
import sageImage2 from "@/image/casestudy-sage-2.gif";
import sageImage3 from "@/image/casestudy-sage-3.gif";
import devonPreview from "@/image/preview-devon4.png";
import algoPreview from "@/image/preview-algo1.jpeg";
import algoImage1 from "@/image/casestudy-algo-11.png";
import algoImage2 from "@/image/casestudy-algo-12.png";
import algoImage3 from "@/image/algo-casestudy-10.gif";
import algoImage4 from "@/image/algo-casestudy-8.png";
import algoImage5 from "@/image/algo-casestudy-9.png";
import jacoPreview from "@/image/preview-jacobeachluxe1.jpg";
import jblImage1 from "@/image/jbl-casestudy-1.png";
import jblImage2 from "@/image/jbl-casestudy-2.png";
import jblImage3 from "@/image/jbl-casestudy-3.png";
import jblImage4 from "@/image/jbl-casestudy-4.png";
import jblImage5 from "@/image/jbl-casestudy-5.png";
import jblImage6 from "@/image/jbl-casestudy-6.png";
import jblImage7 from "@/image/jbl-casestudy-7.png";
import jblImage8 from "@/image/jbl-casestudy-8.png";
import particlePreview from "@/image/particle-casestudy-1.png";
import cafeBluePreview from "@/image/cafeblue-casestudy-cover.jpg";
import cafeBlueImage1 from "@/image/cafeblue-casestudyArtboard 2@2x-80.jpg";
import cafeBlueImage2 from "@/image/cafeblue-casestudyArtboard 2_1@2x-80.jpg";
import cafeBlueImage3 from "@/image/cafeblue-casestudyArtboard 2_3@2x-80.jpg";
import cafeBlueImage4 from "@/image/cafeblue-casestudyArtboard 12@2x-80.jpg";
import cafeBlueImage5 from "@/image/cafeblue-casestudyArtboard 14@2x-80.jpg";
import cafeBlueImage6 from "@/image/cafeblue-casestudyArtboard 14_1@2x-801.jpg";
import cafeBlueImage7 from "@/image/cafeblue-casestudyArtboard 15@2x-80.jpg";

export interface CaseStudyContentBlock {
  type: 'text' | 'image' | 'video';
  content: string; // For text: the actual text content. For images/videos: the file path/import
  alt?: string; // For images/videos: alt text or description
  caption?: string; // Optional caption for images/videos
}

export interface CaseStudy {
  id: string; // URL-friendly slug (e.g., "japonica-restaurant")
  title: string; // Main title displayed on the case study page
  shortDescription: string; // Short description for homepage preview
  coverImage: any; // Cover image for homepage preview
  featured: boolean; // Toggle to show on homepage
  category?: string[]; // Optional categories
  client?: string; // Optional client name
  year?: string; // Optional year
  tools?: string; // Optional tools used
  contentBlocks: CaseStudyContentBlock[]; // Array of text and image blocks
}

// Example case studies data
export const caseStudies: CaseStudy[] = [
  // {
  //   id: "particle-donut",
  //   title: "Particle Donut",
  //   shortDescription: "An interactive 3D particle system creating a mesmerizing donut visualization using Three.js and custom shaders.",
  //   coverImage: particlePreview,
  //   featured: true,
  //   category: ["3d", "creative coding", "webgl"],
  //   year: "2025",
  //   tools: "Three.js, WebGL, GLSL Shaders, React",
  //   contentBlocks: [
  //     {
  //       type: 'text',
  //       content: 'The Particle Donut is an experimental creative coding project exploring particle systems and 3D graphics on the web. Using Three.js and custom GLSL shaders, I created an interactive visualization where thousands of particles arrange themselves into a rotating donut shape, responding to user interaction and creating a mesmerizing visual experience.'
  //     },
  //     {
  //       type: 'image',
  //       content: particlePreview.src,
  //       alt: 'Particle Donut Visualization',
  //       caption: 'Dynamic particle system forming a donut shape with real-time rendering'
  //     },
  //     {
  //       type: 'text',
  //       content: 'The project demonstrates advanced WebGL techniques including custom particle systems, shader programming for visual effects, and performance optimization to maintain smooth 60fps rendering with thousands of particles. The donut responds to mouse movement, creating an engaging interactive experience that showcases the intersection of mathematics, art, and code.'
  //     },
  //   ]
  // },
  {
    id: "comfyui",
    title: "ComfyUI",
    shortDescription: "UX/UI design for an AI-powered image generation platform, creating an intuitive interface for complex workflows.",
    coverImage: comfyPreview,
    featured: true,
    category: ["ux/ui design", "ai", "interface design"],
    client: "ComfyUI",
    year: "2025",
    tools: "Figma, User Research, Prototyping",
    contentBlocks: [
      {
        type: 'text',
        content: 'ComfyUI is a powerful node-based interface for AI image generation. The challenge was to design an intuitive user experience that would make complex AI workflows accessible to both beginners and advanced users, while maintaining the flexibility that power users require.'
      },
      {
        type: 'text',
        content: 'I developed a design system that prioritizes discoverability and progressive disclosure. The interface guides new users through basic workflows while providing advanced features that don\'t clutter the experience for those who don\'t need them yet.'
      },
      {
        type: 'image',
        content: comfyImage1.src,
        alt: 'ComfyUI Node Editor',
        caption: 'Node-based workflow editor with clear visual hierarchy and connection feedback'
      },
      {
        type: 'text',
        content: 'Key UX improvements included redesigning the node connection system for better visual feedback, creating a more intuitive parameters panel, and developing onboarding flows that help users understand the node-based paradigm without overwhelming them with technical details.'
      },
      {
        type: 'image',
        content: comfyImage2.src,
        alt: 'ComfyUI Settings Panel',
        caption: 'Streamlined settings panel with logical grouping and tooltips for guidance'
      },
      {
        type: 'image',
        content: comfyImage4.src,
        alt: 'ComfyUI Workflow Templates',
        caption: 'Template system that helps users get started with pre-built workflows'
      },
      {
        type: 'image',
        content: comfyImage5.src,
        alt: 'ComfyUI Output Gallery',
        caption: 'Clean gallery view for reviewing and managing generated images'
      },
    ]
  },

  {
    id: "sage-social-marketing",
    title: "Elevating Squarespace with Sage Social",
    shortDescription: "Small businesses needed easily-updateable websites with custom functionality beyond standard Squarespace capabilities.",
    coverImage: sagePreview,
    featured: true,
    category: ["web design", "squarespace", "marketing"],
    client: "Sage Social",
    year: "2022-current",
    tools: "Squarespace, CSS, JavaScript",
    contentBlocks: [
      {
        type: 'text',
        content: 'Sage Social is a marketing agency that specializes in helping small businesses grow their online presence. Their clients would come to them with big dreams for their websites but limited budgets and even more limited technical knowledge. They wanted something that looked custom and professional, but they also needed to be able to update their own content, add new photos, and make changes without calling a developer every time.'
      },
      {
        type: 'text',
        content: 'The problem was that standard Squarespace templates, while user-friendly, often felt generic and didnt capture the unique personality of each business. On the other hand, fully custom websites were expensive to build and even more expensive to maintain. These small business owners would get frustrated trying to make simple updates, or theyd end up with outdated sites because they couldnt afford ongoing developer support.'
      },
      {
        type: 'text',
        content: 'My role was to bridge this gap by creating custom components and functionality within the Squarespace ecosystem. This meant I could give clients the unique features and design elements they wanted while preserving the platforms intuitive content management system they could actually use.'
      },
      {
        type: 'image',
        content: sageImage1.src,
        alt: 'Sage Social Custom Squarespace Components',
        caption: 'Custom interactive components built within Squarespace'
      },
      {
        type: 'text',
        content: 'As I worked on more projects, I started noticing patterns in what clients needed. Many wanted better ways to display image galleries, more sophisticated portfolio layouts, and interactive elements that felt modern without being overwhelming. This led me to develop downloadable plugins that I either sell on Etsy or have for free on my website.'
      },
      {
        type: 'image',
        content: sageImage2.src,
        alt: 'Sage Social Masonry Gallery Plugin',
        caption: 'Custom masonry gallery with parallax effects for image portfolios'
      },      
      {
        type: 'text',
        content: 'This partnership with Sage Social continues to evolve, and Im excited about the new challenges and opportunities that come with helping small businesses tell their stories online in ways that are both beautiful and practical.'
      },
      {
        type: 'image',
        content: sageImage3.src,
        alt: 'Sage Social Custom Layouts',
        caption: 'Sage Socials website has been through various redesigns.'
      },

    ]
  },
  {
    id: "algorhythm",
    title: "Algorhythm",
    shortDescription: "Frontend development and UI/UX design for a marketing research platform.",
    coverImage: algoPreview,
    featured: true,
    category: ["frontend development", "ux/ui design", "music", "full-stack"],
    client: "Algorhythm",
    year: "2024-2025",
    tools: "React.js, Next.js, TypeScript, Supabase, Adobe XD",
    contentBlocks: [
      {
        type: 'text',
        content: 'Algorhythm analyzes an artist’s song, scans social content from similar tracks, and surfaces proven strategies to spark content ideas and boost conversion. As the frontend developer and UX/UI Designer, I was responsible for building the entire user interface from scratch, creating design frameworks, and collaborating closely with the backend team to integrate complex data processing workflows.'
      },
      {
        type: 'text',
        content: 'The project spanned four months from October 2024 to January 2025, during which I successfully merged over 35 pull requests and completed more than 30 Jira tickets across frontend development. The work involved full-stack integration with real-time data processing systems, requiring close coordination between frontend and backend development.'
      },
      // {
      //   type: 'text',
      //   content: 'My responsibilities encompassed the full spectrum of frontend development. I built the complete React.js application architecture from scratch, implementing responsive UI components for music upload, campaign management, and results visualization. A significant challenge was developing real-time loading states and error handling for asynchronous music processing, as well as creating a dynamic dashboard for displaying campaign results and analytics.'
      // },
      // {
      //   type: 'text',
      //   content: 'Beyond development, I took on the UI/UX design and prototyping work, creating comprehensive design frameworks using Adobe XD. I designed mockups for the "Sound Overview" interface showing campaign analytics and established visual design patterns and a component library that would guide the development process.'
      // },
      // {
      //   type: 'text',
      //   content: 'The backend integration was a collaborative effort where I worked closely with the backend developer to design and implement REST API endpoints. I integrated Supabase authentication and database services, implemented file upload functionality for audio processing, and designed the data flow architecture for campaign management and results display.'
      // },
      {
        type: 'text',
        content: 'The technical stack centered around React.js, Next.js, and TypeScript for the frontend, with CSS3 and responsive design principles guiding the styling approach. For backend integration, I worked with Supabase and REST APIs, while using Adobe XD for prototyping and mockups. Development tools included Git, GitHub, and Chrome DevTools for debugging and optimization.'
      },
      {
        type: 'text',
        content: 'One of the first major features I developed was the user authentication system. I implemented secure login and register functionality with Supabase, created protected routes and session management, and added comprehensive error handling for authentication edge cases. This foundation was critical for ensuring users could safely access their campaigns and data.'
      },
      {
        type: 'text',
        content: 'The campaign management interface became the heart of the application. I built an intuitive upload modal for music file submission, implemented campaign creation and management workflows, and added campaign deletion functionality with proper confirmation flows to prevent accidental data loss. Managing real-time processing states was particularly complex—I developed dynamic loading indicators for music analysis, implemented background job monitoring and status updates, and created error states and retry mechanisms for failed processes.'
      },
      {
        type: 'image',
        content: algoImage1.src,
        alt: 'Campaign Management interface',
        caption: 'Earlier design of the campaign management interface'
      },
      {
        type: 'image',
        content: algoImage2.src,
        alt: 'Campaign Management Interface',
        caption: ' '
      },
      // {
      //   type: 'text',
      //   content: 'The analytics dashboard tied everything together by providing users with actionable insights. I built a comprehensive "Sound Overview" interface displaying campaign results, implemented data visualization for song recommendations and similarity scores, and created responsive layouts that worked seamlessly across different screen sizes.'
      // },
      {
        type: 'text',
        content: 'The project presented several significant challenges. The first was handling complex data integration—the backend API returned intricate nested data structures containing campaigns, songs, and videos that needed to be efficiently displayed in the frontend. To solve this, I created detailed data mapping diagrams using Eraser.io to visualize the data structure, collaborated with the backend developer to optimize API responses for frontend consumption, and implemented TypeScript interfaces to ensure type safety throughout the application.'
      },
      {
        type: 'image',
        content: algoImage3.src,
        alt: 'Progress',
        caption: 'Part of the progress to create a “card fan out” animation for a redesign of the platform'
      },
      {
        type: 'text',
        content: 'Asynchronous music processing proved to be another major challenge, as music analysis could take several minutes, requiring sophisticated loading states and error handling. I addressed this by implementing a background job polling system, creating dynamic UI states that showed processing progress in real-time, and building automatic refresh mechanisms to update campaign status without requiring user intervention.'
      },
      {
        type: 'text',
        content: 'Cross-browser compatibility issues also emerged during development, with visual inconsistencies appearing across different browsers and screen resolutions, particularly with CSS box shadows. I established a comprehensive testing protocol across Chrome and Safari, used deployment previews to test fixes in production-like environments, and implemented fallback styling for browser-specific issues.'
      },
      {
        type: 'image',
        content: algoImage4.src,
        alt: 'Algorhythm Design Framework',
        caption: 'Newest design framework'
      },
      {
        type: 'image',
        content: algoImage5.src,
        alt: 'Algorhythm Design Framework',
        caption: ' '
      },
    ]
  },
  {
    id: "jaco-beach-luxe",
    title: "Jaco Beach Luxe",
    shortDescription: "Complete branding package for a luxury vacation rental property in Costa Rica, capturing tropical elegance.",
    coverImage: jacoPreview,
    featured: true,
    category: ["branding", "luxury", "hospitality"],
    client: "Jaco Beach Luxe",
    year: "2024",
    tools: "Adobe Illustrator, Photoshop, Lightroom",
    contentBlocks: [
      {
        type: 'text',
        content: 'Jaco Beach Luxe is a premier luxury vacation rental property located in the stunning coastal town of Jaco, Costa Rica. The client needed a complete brand identity that would communicate the property\'s upscale positioning while capturing the relaxed, tropical essence of the location.'
      },
      {
        type: 'image',
        content: jblImage7.src,
        alt: 'Jaco Beach Luxe Marketing Materials',
        caption: 'Print and digital marketing material designs'
      },
      {
        type: 'text',
        content: 'I developed a sophisticated brand identity that balances luxury with approachability. The visual language draws inspiration from coastal elements, tropical botanicals, and the natural beauty of Jaco Beach, creating a brand that feels both elevated and inviting.'
      },

      {
        type: 'text',
        content: 'All photographs and videos were also taken by me.'
      },
      {
        type: 'image',
        content: jblImage3.src,
        alt: 'Jaco Beach Luxe Visual Applications',
        caption: ''
      },      
      {
        type: 'image',
        content: jblImage4.src,
        alt: 'Jaco Beach Luxe Icon Set',
        caption: ''
      },
      {
        type: 'text',
        content: 'The branding package included logo design, color palette, typography system, photography guidelines, and marketing collateral templates. The design system is flexible enough to work across digital platforms, print materials, and physical property signage, ensuring a cohesive brand experience at every touchpoint.'
      },

      {
        type: 'image',
        content: jblImage5.src,
        alt: 'Jaco Beach Luxe Pattern Design',
        caption: ' '
      },
      // {
      //   type: 'image',
      //   content: jblImage6.src,
      //   alt: 'Jaco Beach Luxe Stationery',
      //   caption: 'Business stationery and collateral design'
      // },

      {
        type: 'image',
        content: jblImage8.src,
        alt: 'Videos and graphics for reels and tiktok',
        caption: 'Videos and graphics for reels and tiktok'
      },
      {
        type: 'image',
        content: jblImage2.src,
        alt: 'Instagram layout',
        caption: 'Instagram layout'
      },
      {
        type: 'video',
        content: '/videos/jbl-casestudy-website.mp4',
        alt: 'Jaco Beach Luxe Website Walkthrough',
        caption: 'Website design and user experience'
      },
    ]
  },
  {
    id: "cafe-blue",
    title: "Cafe Blue",
    shortDescription: "Complete branding and web design for a modern coffee shop, blending artisanal charm with digital presence.",
    coverImage: cafeBluePreview,
    featured: true,
    category: ["branding", "web design", "hospitality"],
    client: "Cafe Blue",
    year: "2024",
    tools: "Adobe Illustrator, Photoshop, Lightroom",
    contentBlocks: [
      {
        type: 'text',
        content: 'Cafe Blue is a contemporary coffee shop that celebrates the art of coffee making while creating a warm, inviting space for the community. The client needed a complete brand identity that would capture the essence of artisanal coffee culture while appealing to a modern, design-conscious audience.'
      },
      {
        type: 'image',
        content: cafeBlueImage6.src,
        alt: 'Cafe Blue Digital Touchpoints',
        caption: 'Logo design and photography.'
      },
      {
        type: 'image',
        content: cafeBlueImage5.src,
        alt: 'Cafe Blue Website Design',
        caption: ''
      },
      {
        type: 'text',
        content: 'I developed a comprehensive visual identity centered around clean typography, a carefully curated color palette inspired by coffee tones, and versatile design elements that could adapt across various applications. The branding system includes logo variations, custom patterns, and a flexible template system for seasonal promotions.'
      },
      {
        type: 'image',
        content: cafeBlueImage1.src,
        alt: 'Cafe Blue Brand Identity',
        caption: ''
      },
      {
        type: 'image',
        content: cafeBlueImage4.src,
        alt: 'Colors',
        caption: ''
      },
      {
        type: 'text',
        content: 'Photographs and video for use on social media and website.'
      },
      {
        type: 'image',
        content: cafeBlueImage3.src,
        alt: 'Cafe Blue Packaging Design',
        caption: ''
      },

      {
        type: 'image',
        content: cafeBlueImage7.src,
        alt: 'Cafe Blue Complete Brand System',
        caption: 'Photographs and video for use on social media and website.'
      },
      {
        type: 'video',
        content: '/videos/cafeblue-casestudy-website.mp4',
        alt: 'Cafe Blue Website Walkthrough',
        caption: 'Website design and user experience'
      },
    ]
  },
];

export default caseStudies;
