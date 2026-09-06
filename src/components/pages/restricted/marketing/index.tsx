import { render } from "react-email";
import { WeeklyUploadEmail } from "@/components/email/weekly-template";
import { MarketingDataClient } from "./client-component";

type MarketingDataComponentProps = {
  emailHtml: string;
};

export default function MarketingDataComponent({
  emailHtml,
}: MarketingDataComponentProps) {{

  return <MarketingDataClient emailHtml={emailHtml} />;
}}