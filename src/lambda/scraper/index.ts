const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const moment = require('moment');
const aws = require('aws-sdk');

import {Job} from '../../model';

async function wait(millis: number) {
    return new Promise((resolve, reject) => {
        let t = setTimeout(() => {
            clearTimeout(t);
            resolve();
        }, millis)
    });
}

function parseDate(str: string) {
    // Posted April 21, 2020
    const from = str.indexOf('Posted') > -1 ? str.indexOf('Posted') + 7 : 0;
    const base = str.substring(from, str.length);
    return moment.utc(base, 'MMM DD, YYYY').toDate();
}

async function parseJob($: any, job: any): Promise<Job> {
    return {
        id: $(job).attr('data-job-id'),
        title: $(job).find('.job-title').text(),
        postingDate: parseDate($(job).find('.posting-date').text()),
        description: $(job).find('.description > span:first-of-type').text()
    };
}

async function parsePage($: any) {
    const jobList: Array<Promise<Job>> = [];
    $('.job-tile-lists .job').each((index: number, it: any) => jobList.push(parseJob($, it)));
    return Promise.all(jobList)
}

interface Props {
    resultLimit: string
    businessCategory: string
}

const defaultProps: Props = {
    resultLimit: process.env.RESULT_LIMIT || "20",
    businessCategory: process.env.BUSINESS_CATEGORY || "amazon-web-services"
};

export async function main(props:Props = defaultProps) {
    const url = `https://www.amazon.jobs/en/search?offset=0&result_limit=${props.resultLimit}&sort=recent&business_category[]=${props.businessCategory}&distanceType=Mi&radius=24km&latitude=&longitude=&loc_group_id=Sydney&loc_query=Sydney%2C%20Australia&base_query=&city=&country=&region=&county=&query_options=&`;

    let browser;
    try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);

        await page.waitForSelector(".job-tile-lists");
        const html = await page.content();
        await parsePage(cheerio.load(html));
        // await page.screenshot({path: 'example.png'});
    } catch (err) {
        console.error(err)

    } finally {
        await browser.close();

    }
}
