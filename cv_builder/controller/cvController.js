const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const { v4: uuidv4 } = require("uuid");

const {
  projectsToHtml,
  certificatesToHtml,
  languagesToHtml,
  educationToHtml,
  experienceToHtml,
  interestsToHtml,
} = require("../helper/sectionHelpers");

const { contactToHtml, contactToHtml2 } = require("../helper/contactHelper");
const { renderTemplate } = require("../helper/renderHelper");

const generateCV = async (req, res) => {
  try {
    const {
      name,
      summary,
      education,
      experience,
      skills = [],
      projects,
      languages,
      interests,
      certificates,
      contact,
      imageUrl,
      templateName,
      color,
    } = req.body;

    const templatePath = path.join(
      __dirname,
      "../templates",
      `${templateName}.html`
    );

    console.log(templatePath);
    if (!fs.existsSync(templatePath)) {
      return res.status(400).json({ error: "Invalid template name provided." });
    }

    const template = fs.readFileSync(templatePath, "utf-8");

    const data = {
      name,
      summary,
      education: educationToHtml(education),
      experience: experienceToHtml(experience),
      skills: skills.map((skill) => `<span>${skill}</span>`).join(" "),
      projects: projectsToHtml(projects),
      languages: languagesToHtml(languages),
      interests: interestsToHtml(interests),
      certificates: certificatesToHtml(certificates),
      contact:
        templateName === "template2"
          ? contactToHtml2(contact)
          : contactToHtml(contact),
      imageUrl,
      color,
    };

    const renderedHtml = renderTemplate(template, data);

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setContent(renderedHtml, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
      quality: 75,
    });

    await browser.close();

    const uniqueId = uuidv4();
    const sanitizedName = name.replace(/\s+/g, "_").toLowerCase();
    const fileName = `${sanitizedName}_${uniqueId}_cv.pdf`;
    const filePath = path.join(__dirname, "../public", fileName);
    fs.writeFileSync(filePath, pdfBuffer);

    res.json({
      message: "CV generated successfully",
      downloadUrl: `/public/${fileName}`,
    });
  } catch (error) {
    console.error("Error generating CV:", error);
    res.status(500).json({ error: "Failed to generate CV." });
  }
};

module.exports = { generateCV };
