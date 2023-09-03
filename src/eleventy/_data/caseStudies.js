const { client } = require("../prismic/client");

module.exports = async function () {
  const caseStudies = await client.getAllByType("case-study");

  const posts = caseStudies.map((caseStudy) => ({
    url: caseStudy.uid,
    title: caseStudy.data.title[0].text,
    grade: caseStudy.data.grade,
    description: caseStudy.data.description[0].text,
    ogimage: caseStudy.data.ogimage,
  }));

  return posts;
};
