import { CaseStudyPage } from "./pages/CaseStudyPage/CaseStudyPage";
import { LandingPage } from "./pages/LandingPage/LandingPage";

let landingPage: LandingPage;
let caseStudyPage: CaseStudyPage;

export const pageManager = () => {
  landingPage = new LandingPage();
  caseStudyPage = new CaseStudyPage();
};

export const resizePages = () => {
  landingPage.onResize();
  caseStudyPage.onResize();
};
