import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

export default function About() {
  return (
    <>
      <Typography variant="h4">What is this?</Typography>
      <Typography>
        The Gathering Server Panel (TGSP) is a web-based interface designed to
        manage servers during The Gathering.
      </Typography>
      <Typography>
        Every participant will receive 4 credits, which can be used to launch
        your own custom virtual machines or gaming servers. Whether you&apos;re
        looking to test out new software, build your own game environment, or
        simply have fun playing around with Linux.
      </Typography>
      <Typography variant="h4" sx={{ pt: 1 }}>
        Terms Of Service
      </Typography>
      <Typography>
        By using our service, you agree to abide by the{" "}
        <Link href="https://www.tg.no/event/rules">
          regulations of the event.
        </Link>
      </Typography>
      <Typography variant="h6" sx={{ pt: 1 }}>
        The following actions are strictly prohibited, but not limited to:
      </Typography>
      <ul>
        <li>Sending spam emails</li>
        <li>Distributing malware</li>
        <li>Carrying out DoS, DDoS, or any other kind of attacks</li>
        <li>Hosting phishing sites</li>
        <li>IP spoofing</li>
        <li>CPU-mining</li>
        <li>Sharing or distributing copyrighted material without permission</li>
      </ul>
      <Typography>
        If you break any of these terms, we may terminate your access to the
        service. Our technical team reserves the right to suspend or terminate
        the service without prior notice if any of these terms are violated.
      </Typography>
      <Typography>
        This service is offered on a best-effort basis for fair use, and at no
        cost to you. Please ensure that your usage does not disrupt other users
        or harm the infrastructure.
      </Typography>
      <Typography>
        We delete all data once The Gathering is over and do not keep backups or
        archives. It is recommended that you back up any data you wish to retain
        before the event concludes, as we cannot be held responsible for any
        data loss.
      </Typography>
    </>
  );
}
