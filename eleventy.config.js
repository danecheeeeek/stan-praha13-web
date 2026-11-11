function newsDateValue(label) {
  const date = String(label || "").match(/^(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})\b/);
  if (!date) return 0;
  const [, day, month, year] = date.map(Number);
  return year * 10000 + month * 100 + day;
}

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "styles.css": "styles.css" });
  eleventyConfig.addPassthroughCopy({ "script.js": "script.js" });
  eleventyConfig.addPassthroughCopy({ "assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "program.html": "program.html" });
  eleventyConfig.addPassthroughCopy({ "robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "sitemap.xml": "sitemap.xml" });

  eleventyConfig.addFilter("visible", (items = []) =>
    items.filter((item) => item.visible !== false)
  );

  eleventyConfig.addFilter("pad2", (value) =>
    String(value).padStart(2, "0")
  );

  eleventyConfig.addFilter("newestNewsFirst", (items) =>
    [...items].sort((first, second) => newsDateValue(second.dateLabel) - newsDateValue(first.dateLabel))
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
}
