export interface SampleResume {
  id: string;
  name: string;
  role: string;
  targetRole: string;
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead_executive';
  description: string;
  targetJobDescription: string;
  resumeText: string;
}

export const SAMPLE_RESUMES: SampleResume[] = [
  {
    id: 'swe-to-staff',
    name: 'David Chen',
    role: 'Senior Full Stack Software Engineer',
    targetRole: 'Staff Software Engineer / Tech Lead',
    experienceLevel: 'senior',
    description: 'Strong full-stack builder seeking promotion to Staff Engineer. Strong implementation skills, but lacks cross-team architecture metrics and executive leadership scope.',
    targetJobDescription: `We are seeking a Staff Software Engineer to lead distributed systems architecture across multi-region cloud infrastructures.
Requirements:
- 8+ years designing high-throughput, low-latency microservices handling 100k+ QPS.
- Deep expertise in Go/Rust or Java, Kubernetes, Kafka, gRPC, and Redis.
- Proven track record leading technical vision, cross-functional roadmaps, and mentoring senior engineers.
- Strong focus on cloud cost optimization (FinOps), site reliability, and 99.99% SLA enforcement.`,
    resumeText: `DAVID CHEN
San Francisco, CA | (555) 349-8812 | david.chen@email.com | linkedin.com/in/davidchen-dev

PROFESSIONAL SUMMARY
Senior Full Stack Engineer with 7 years of software development experience specializing in React, Node.js, and PostgreSQL. Experienced in building responsive web applications, integrating RESTful APIs, and collaborating with cross-functional teams in fast-paced startup environments.

TECHNICAL SKILLS
- Languages: JavaScript, TypeScript, Python, HTML5, CSS3, SQL
- Frameworks & Libraries: React, Node.js, Express, Next.js, Redux, Tailwind CSS
- Databases & Storage: PostgreSQL, MongoDB, MySQL
- Tools & Cloud: AWS (S3, EC2), Git, Docker, Jest, Postman, Webpack

PROFESSIONAL EXPERIENCE

Senior Software Engineer | CloudVibe Technologies | Jan 2022 – Present
- Developed customer-facing dashboard features using React, TypeScript, and Tailwind CSS.
- Built backend REST APIs in Node.js and Express to support real-time data sync with PostgreSQL database.
- Worked closely with product managers and designers to implement user story requirements.
- Helped migrate legacy frontend codebase to Next.js, improving page load speed.
- Maintained unit tests using Jest and React Testing Library to ensure high code quality.
- Participated in bi-weekly sprint planning and code review sessions with team members.

Software Engineer | Apex Solutions Inc. | Jun 2019 – Dec 2021
- Created full-stack web features using React and Express.
- Optimized database queries in PostgreSQL, reducing query execution delays.
- Integrated third-party payment gateways including Stripe and PayPal into checkout flow.
- Collaborated with QA team to identify, reproduce, and resolve software bugs before release.
- Authored technical documentation for newly deployed internal admin endpoints.

Junior Web Developer | Orbit Interactive | Jul 2017 – May 2019
- Assisted senior developers in designing and maintaining responsive client landing pages.
- Fixed front-end layout bugs across Chrome, Firefox, and Safari browsers.
- Wrote basic SQL scripts to generate weekly user engagement reports.

EDUCATION
Bachelor of Science in Computer Science | University of California, Davis | 2017`
  },
  {
    id: 'data-to-mle',
    name: 'Sarah Jenkins',
    role: 'Senior Data Analyst',
    targetRole: 'Machine Learning Engineer',
    experienceLevel: 'senior',
    description: 'Strong SQL and Tableau background transitioning to ML Engineering. Has Python and scikit-learn experience, but lacks production MLOps, CI/CD, and model serving.',
    targetJobDescription: `Role: Machine Learning Engineer (MLOps & Applied AI)
Requirements:
- 4+ years building and deploying end-to-end Machine Learning systems in production environments.
- Strong proficiency in Python, PyTorch/TensorFlow, scikit-learn, and SQL.
- Hands-on experience with MLOps tooling: MLflow, Kubeflow, Docker, Airflow, and Triton/TorchServe.
- Experience with real-time inference, feature stores, and distributed model training at scale.`,
    resumeText: `SARAH JENKINS
Chicago, IL | (555) 782-9901 | sarah.jenkins@email.com | github.com/sjenkins-data

PROFESSIONAL SUMMARY
Senior Data Analyst with 5+ years of experience analyzing large-scale datasets, building business intelligence dashboards, and building predictive statistical models. Skilled in SQL, Python, Tableau, and data visualization.

TECHNICAL SKILLS
- Programming & Analysis: Python (Pandas, NumPy, Scikit-learn), SQL, R, Bash
- BI & Visualization: Tableau, PowerBI, Looker, Matplotlib, Seaborn
- Data Warehousing: Snowflake, BigQuery, AWS Redshift
- Machine Learning (Coursework/Side Projects): Linear Regression, Random Forests, XGBoost, K-Means

PROFESSIONAL EXPERIENCE

Senior Data Analyst | FinEdge Analytics | Mar 2022 – Present
- Analyzed transaction trends across 4 million active accounts using Snowflake and complex SQL queries.
- Created executive Tableau dashboards to track Monthly Recurring Revenue (MRR) and customer churn.
- Developed a proof-of-concept customer churn prediction model in Python using scikit-learn and XGBoost.
- Automated daily ETL reporting scripts using Python and cron jobs, saving hours of manual data collation.
- Presented data-driven insights to leadership and marketing stakeholders on user retention trends.

Data Analyst | HealthMetrics Corp | Aug 2019 – Feb 2022
- Queried relational databases to prepare clinical operations performance reports.
- Designed 15+ automated dashboards in PowerBI used by department directors.
- Conducted statistical hypothesis testing (A/B tests) on patient onboarding workflows.
- Cleaned and prepared large unstructured medical records datasets for analytics team.

EDUCATION & CERTIFICATIONS
- B.S. in Statistics & Data Analytics | University of Illinois Urbana-Champaign | 2019
- Google Data Analytics Professional Certificate | 2020`
  },
  {
    id: 'pm-to-director',
    name: 'Marcus Vance',
    role: 'Product Manager',
    targetRole: 'Director of Product Management',
    experienceLevel: 'lead_executive',
    description: 'Product manager targeting executive leadership. Good feature delivery track record, but needs clearer P&L ownership, multi-product portfolio strategy, and executive board governance.',
    targetJobDescription: `Role: Director of Product Management
Responsibilities:
- Own multi-product vision, strategy, and $50M+ P&L roadmap for enterprise B2B SaaS platform.
- Manage and mentor a high-performing product team of 6+ Product Managers and Product Owners.
- Drive GTM alignment across Sales, Marketing, Customer Success, and Engineering.
- Lead pricing strategy, enterprise packaging, and churn mitigation initiatives.`,
    resumeText: `MARCUS VANCE
New York, NY | (555) 412-6789 | marcus.vance@email.com | linkedin.com/in/marcusvance-pm

PROFESSIONAL SUMMARY
Results-driven Product Manager with 6 years of experience driving SaaS product development from inception to launch. Strong background in user research, sprint management, agile methodologies, and cross-functional leadership.

CORE COMPETENCIES
Product Strategy, Agile / Scrum, User Stories, Roadmapping, Jira, Confluence, Figma, User Research, Wireframing, Stakeholder Management, Product Analytics (Mixpanel, Amplitude).

PROFESSIONAL EXPERIENCE

Product Manager | NexaCloud Systems | Jan 2021 – Present
- Managed product lifecycle for the core customer collaboration portal used by 50,000+ businesses.
- Led daily standups, sprint grooming, and sprint retrospective meetings with a team of 8 engineers.
- Conducted 40+ customer interviews and usability sessions to gather feedback on new feature prototypes.
- Wrote detailed Product Requirements Documents (PRDs) and defined feature acceptance criteria.
- Partnered with marketing to coordinate feature release announcements and help documentation.

Associate Product Manager | VentureBridge | Jul 2018 – Dec 2020
- Supported Senior Product Managers with feature backlog prioritization and competitor analysis.
- Monitored product metrics in Mixpanel to identify user drop-off points during onboarding.
- Coordinated QA testing and beta user feedback collection before major quarterly product updates.

EDUCATION
- Bachelor of Arts in Economics | New York University | 2018
- Certified Scrum Product Owner (CSPO) | Scrum Alliance | 2020`
  }
];
