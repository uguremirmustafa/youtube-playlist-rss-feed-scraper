/** @format */

const puppeteer = require('puppeteer');
const fs = require('fs');
const inquirer = require('inquirer');
let questions = [
  {
    type: 'input',
    name: 'url',
    message: 'Enter the playlist url of the target channel: ',
  },
];
inquirer.prompt(questions).then((answers) => {
  console.log('your list will be created in a second!');
  scraper(answers['url']);
});
const scraper = async (url) => {
  // const url = 'https://www.youtube.com/c/DevTipsForDesigners/playlists';
  const youtubePlaylistRSSFeed = 'https://www.youtube.com/feeds/videos.xml?playlist_id=';
  const channelName = url.split('/c/')[1].split('/')[0];
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const playlistLinks = await page.evaluate(() => Array.from(document.querySelectorAll('a.ytd-grid-playlist-renderer')).map((item) => item.href));
  const playlistIds = await playlistLinks.map((link) => link.split('list=')[1]);
  const finalRSS = playlistIds.map((i) => youtubePlaylistRSSFeed + i).join('\n');
  await fs.writeFile(`playlist IDs of ${channelName}`, finalRSS, () => console.log('written'));

  await browser.close();
};

//THIS SCRIPT GETS PLAYLIST-RSS-FEED OF YOUTUBE A YOUTUBE CHANNEL.
