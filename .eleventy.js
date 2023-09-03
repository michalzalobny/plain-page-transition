const htmlmin = require("html-minifier").minify;
const { client } = require("./src/eleventy/prismic/client");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/eleventy/public");

  eleventyConfig.addCollection("imagesToPreload", async function () {
    const caseStudies = await client.getAllByType("case-study");

    const imagesToPreload = caseStudies.map(
      (caseStudy) => caseStudy.data.ogimage.thumb.url
    );

    return imagesToPreload;
  });

  //Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      let minified = htmlmin(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }
    return content;
  });

  return {
    dir: {
      input: "src/eleventy",
      output: "dist",
    },
  };
};
