<?xml version="1.0" encoding="utf-8"?>
<!-- Renders the RSS feed as a readable page when opened in a browser. -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="utf-8" indent="yes" doctype-system="about:legacy-compat"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>RSS · <xsl:value-of select="/rss/channel/title"/></title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
        <style>
          @font-face { font-family: "Source Serif 4"; font-weight: 400 700; font-display: swap; src: url("/fonts/source-serif-4-normal.woff2") format("woff2"); }
          @font-face { font-family: "Fraunces Soft"; font-weight: 400; font-display: swap; src: url("/fonts/fraunces-soft-display.woff2") format("woff2"); }
          @font-face { font-family: "IBM Plex Mono"; font-weight: 400; font-display: swap; src: url("/fonts/ibm-plex-mono-400-normal.woff2") format("woff2"); }
          :root { color-scheme: light; }
          html { font-size: 17px; }
          @media (min-width: 640px) { html { font-size: 18px; } }
          @media (min-width: 1024px) { html { font-size: 19px; } }
          body { margin: 0; padding: 0 1.25rem; background: #F6F0E4; color: #2B2620;
                 font-family: "Source Serif 4", Georgia, serif; line-height: 1.6; }
          .wrap { max-width: 42rem; margin: 0 auto; padding: 2.2rem 0 3rem; }
          header { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: .5rem 1.5rem; }
          header a { text-decoration: none; }
          .brand { font-weight: 600; }
          nav { display: flex; gap: 1.4rem; }
          nav a { color: #6E655A; }
          a { color: inherit; text-decoration-color: #A4402A; text-underline-offset: .2em; }
          a:hover { color: #A4402A; }
          h1 { font-family: "Fraunces Soft", Georgia, serif; font-weight: 400; color: #A4402A;
               font-size: clamp(1.65rem, 1.15rem + 1.9vw, 2.15rem); line-height: 1.18; margin: 4.5rem 0 .6rem; }
          .lede { color: #6E655A; max-width: 34rem; margin: 0; }
          .feed { margin: 1.4rem 0 0; padding: .7rem 1rem; background: #EDE4D2; border-radius: 4px;
                  font-family: "IBM Plex Mono", monospace; font-size: .85rem; overflow-x: auto; white-space: nowrap; }
          .label { margin: 3.5rem 0 1.1rem; font-size: .78rem; letter-spacing: .09em; text-transform: uppercase; color: #6E655A; font-weight: 400; }
          ul { list-style: none; padding: 0; margin: 0; display: grid; gap: .55rem; }
          li { display: grid; grid-template-columns: 6.6rem minmax(0, 1fr); gap: 1rem; align-items: baseline; }
          li span { color: #6E655A; font-size: .85rem; white-space: nowrap; }
          li a { text-decoration: none; }
          li a:hover { text-decoration: underline; color: #2B2620; }
          @media (max-width: 639px) { li { grid-template-columns: minmax(0, 1fr); gap: 0; } ul { gap: 1rem; } .wrap { padding-top: 1.6rem; } h1 { margin-top: 3rem; } }
        </style>
      </head>
      <body>
        <div class="wrap">
          <header>
            <a class="brand" href="/">Pablo Sabater</a>
            <nav><a href="/posts/">Writing</a><a href="/about/">About</a></nav>
          </header>
          <h1>RSS feed</h1>
          <p class="lede">This page is a feed. Copy its address into your feed reader to get new posts as they come out.</p>
          <div class="feed"><xsl:value-of select="/rss/channel/atom:link/@href" xmlns:atom="http://www.w3.org/2005/Atom"/></div>
          <h2 class="label">In this feed</h2>
          <ul>
            <xsl:for-each select="/rss/channel/item">
              <li>
                <span><xsl:value-of select="substring(pubDate, 6, 11)"/></span>
                <a href="{link}"><xsl:value-of select="title"/></a>
              </li>
            </xsl:for-each>
          </ul>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
