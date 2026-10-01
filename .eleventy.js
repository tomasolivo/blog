module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");

  // Bundles: cualquier página puede aportar CSS/JS propio con {% css %}…{% endcss %} / {% js %}…{% endjs %},
  // y el layout lo inyecta sólo en esa página con {% getBundle "css" %} / {% getBundle "js" %}.
  eleventyConfig.addBundle("css");
  eleventyConfig.addBundle("js");

  const ym = (date) => new Date(date).toISOString().slice(0, 7);
  eleventyConfig.addFilter("ym", ym);

  eleventyConfig.addFilter("byMonth", (posts = []) => {
    const groups = new Map();
    for (const post of [...posts].sort((a, b) => b.date - a.date)) {
      const key = ym(post.date);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push({ title: post.data.title, url: post.url });
    }
    return [...groups].map(([date, items]) => ({ date, items }));
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};
