import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface DispatchEmailProps {
  firstName: string;
  orderId: string;
  trackingNumber: string;
}

export const DispatchEmail = ({
  firstName = "Client",
  orderId = "000000",
  trackingNumber = "PENDING",
}: DispatchEmailProps) => {
  const previewText = `Your Zapatos Cave order #${orderId.substring(0, 8)} has been dispatched.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={brandText}>ZAPATOS HQ</Text>
          <Hr style={hr} />
          
          <Heading style={heading}>ORDER DISPATCHED</Heading>
          
          <Section style={section}>
            <Text style={paragraph}>
              {firstName.toUpperCase()},
            </Text>
            <Text style={paragraph}>
              Your manifest has been executed. The goods for order <strong>#{orderId.substring(0, 8).toUpperCase()}</strong> have left our facility and are currently in transit.
            </Text>
          </Section>

          <Section style={trackingBox}>
            <Text style={trackingLabel}>WAYBILL / TRACKING CODE</Text>
            <Text style={trackingCode}>{trackingNumber || "CONTACT SUPPORT FOR ROUTING DETAILS"}</Text>
          </Section>

          <Text style={footer}>
            This is an automated logistics notification. Do not reply to this email.
            <br />© {new Date().getFullYear()} Zapatos Cave. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default DispatchEmail;

// --- STYLES ---
const main = {
  backgroundColor: "#08080A",
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  padding: "40px 0",
};

const container = {
  margin: "0 auto",
  padding: "40px",
  maxWidth: "500px",
  backgroundColor: "#000000",
  border: "1px solid #1A1A1A",
};

const brandText = {
  color: "#FFFFFF",
  fontSize: "12px",
  fontWeight: "bold",
  letterSpacing: "4px",
  textAlign: "center" as const,
  margin: "0 0 20px 0",
};

const hr = {
  borderColor: "#1A1A1A",
  margin: "20px 0",
};

const heading = {
  color: "#FFFFFF",
  fontSize: "24px",
  fontWeight: "900",
  letterSpacing: "-0.5px",
  textAlign: "center" as const,
  margin: "30px 0",
};

const section = {
  padding: "0 20px",
};

const paragraph = {
  color: "#A1A1AA",
  fontSize: "14px",
  lineHeight: "24px",
  fontWeight: "300",
};

const trackingBox = {
  backgroundColor: "#0C0C10",
  border: "1px solid #1A1A1A",
  padding: "24px",
  margin: "40px 20px",
  textAlign: "center" as const,
};

const trackingLabel = {
  color: "#71717A",
  fontSize: "10px",
  fontFamily: "monospace",
  letterSpacing: "2px",
  margin: "0 0 8px 0",
};

const trackingCode = {
  color: "#FFFFFF",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0",
  letterSpacing: "1px",
};

const footer = {
  color: "#52525B",
  fontSize: "10px",
  textAlign: "center" as const,
  marginTop: "60px",
  fontFamily: "monospace",
};