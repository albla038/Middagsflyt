import robotsParser from "robots-parser";
import * as cheerio from "cheerio";

// TODO Change userAgent in production
async function checkUrlPermission(
  targetUrlStr: string,
  userAgent: string = "Middagsflyt/1.0 (+http://localhost:3000)",
) {
  const url = new URL(targetUrlStr);
  const robotsUrlStr = `${url.origin}/robots.txt`;

  try {
    const response = await fetch(robotsUrlStr);

    // If robots.txt is not found, assume permission is granted
    if (response.status === 404) {
      console.log(`robots.txt not found at ${robotsUrlStr}`);
      return true;
    }

    if (!response.ok) {
      console.error(`Failed to fetch robots.txt from ${robotsUrlStr}`);
      return null;
    }

    const robotsTxt = await response.text();

    // Parse the robots.txt content
    const robots = robotsParser(robotsUrlStr, robotsTxt);

    // Check if the URL is allowed
    const isAllowed = robots.isAllowed(targetUrlStr, userAgent);

    // No specific rule found, assume allowed as per common convention
    if (isAllowed === undefined) {
      console.log(
        `No specific robots.txt rule for ${targetUrlStr}, assuming allowed.`,
      );
      return true;
    }

    // Return the result of the robots.txt check
    if (isAllowed) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Unknown error while fetching robots.txt:", error);
    return null;
  }
}
