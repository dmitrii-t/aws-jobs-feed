# AWS Jobs Feed

The project creates RSS feed of resent AWS jobs published at www.amazon.jobs . For personal use only. 


### Get started

1 Update `docker-compose.yml` with your AWS account credentials

```yaml
version: "3"
services:
  synth:
    build: .
    command: cdk synth
    environment:
      - AWS_ACCESS_KEY_ID=
      - AWS_SECRET_ACCESS_KEY=
      - AWS_DEFAULT_REGION=
```

Run `docker-compose run synth` to get started

```bash
docker-compose run synth
```
