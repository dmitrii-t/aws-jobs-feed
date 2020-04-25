import cdk = require('@aws-cdk/core');
import {Rule, Schedule} from '@aws-cdk/aws-events';
import * as targets from '@aws-cdk/aws-events-targets';
import * as lambda from '@aws-cdk/aws-lambda';


class AwsJobFeedStack extends cdk.Stack {

    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const scraper = new lambda.Function(this, 'ScraperFunction', {
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'index.main',
            code: new lambda.AssetCode('src/lambda/scraper'),
        });

        const scraperTarget = new targets.LambdaFunction(scraper);

        const scraperSchedule = new Rule(this, 'ScheduleRule', {
            schedule: Schedule.cron({
                // Schedule
                minute: '0', hour: '4'
            }),
            targets: [scraperTarget],
        });
    }
}

const app = new cdk.App();
new AwsJobFeedStack(app, 'AwsJobFeedStack');
app.synth();
