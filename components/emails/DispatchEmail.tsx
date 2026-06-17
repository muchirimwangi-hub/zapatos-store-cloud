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
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface DispatchEmailProps {
  firstName: string;
  orderId: string;
  trackingNumber: string;
  items?: any[];
  totalAmount?: number;
  shippingCost?: number;
}

export const DispatchEmail = ({
  firstName = "Client",
  orderId = "000000",
  trackingNumber = "PENDING",
  items = [],
  totalAmount = 0,
  shippingCost = 0,
}: DispatchEmailProps) => {
  const previewText = `Your Zapatos Cave order #${orderId.substring(0, 8)} has been dispatched.`;
  const formatCurrency = (amount: number) => `Ksh ${amount.toLocaleString()}`;

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
            <Text style={label}>WAYBILL / TRACKING CODE</Text>
            <Text style={trackingCode}>{trackingNumber || "CONTACT SUPPORT FOR ROUTING DETAILS"}</Text>
          </Section>

          {/* NEW: Itemized Cargo Manifest */}
          {items && items.length > 0 && (
            <Section style={receiptBox}>
              <Text style={label}>CARGO MANIFEST</Text>
              <Hr style={hrDotted} />
              
              {items.map((item, index) => (
                <Row key={index} style={itemRow}>
                  <Column style={colLeft}>
                    <Text style={itemName}>{item.name.toUpperCase()}</Text>
                    <Text style={itemVariant}>{item.variant.toUpperCase()} (QTY: {item.quantity})</Text>
                  </Column>
                  <Column style={colRight}>
                    <Text style={itemPrice}>{formatCurrency(item.price * item.quantity)}</Text>
                  </Column>
                </Row>
              ))}
              
              <Hr style={hrDotted} />
              
              <Row style={totalRow}>
                <Column style={colLeft}><Text style={itemVariant}>SHIPPING SURCHARGE</Text></Column>
                <Column style={colRight}><Text style={itemVariant}>{formatCurrency(shippingCost)}</Text></Column>
              </Row>
              <Row style={totalRow}>
                <Column style={colLeft}><Text style={itemName}>FINAL RECEIPT</Text></Column>
                <Column style={colRight}><Text style={itemPrice}>{formatCurrency(totalAmount)}</Text></Column>
              </Row>
            </Section>
          )}

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

const hr = { borderColor: "#1A1A1A", margin: "20px 0" };
const hrDotted = { borderColor: "#1A1A1A", borderStyle: "dashed", margin: "16px 0" };

const heading = {
  color: "#FFFFFF",
  fontSize: "24px",
  fontWeight: "900",
  letterSpacing: "-0.5px",
  textAlign: "center" as const,
  margin: "30px 0",
};

const section = { padding: "0 20px" };

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
  margin: "40px 20px 20px 20px",
  textAlign: "center" as const,
};

const receiptBox = {
  backgroundColor: "#08080A",
  border: "1px solid #1A1A1A",
  padding: "24px",
  margin: "0 20px 40px 20px",
};

const label = {
  color: "#71717A",
  fontSize: "10px",
  fontFamily: "monospace",
  letterSpacing: "2px",
  margin: "0 0 12px 0",
  textAlign: "center" as const,
};

const trackingCode = {
  color: "#FFFFFF",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0",
  letterSpacing: "1px",
};

// Receipt Table Styles
const itemRow = { marginBottom: "16px" };
const totalRow = { marginBottom: "8px" };
const colLeft = { width: "70%", textAlign: "left" as const };
const colRight = { width: "30%", textAlign: "right" as const };

const itemName = { color: "#FFFFFF", fontSize: "12px", fontWeight: "bold", margin: "0 0 4px 0", letterSpacing: "0.5px" };
const itemVariant = { color: "#71717A", fontSize: "10px", margin: "0", letterSpacing: "1px" };
const itemPrice = { color: "#FFFFFF", fontSize: "12px", fontWeight: "bold", margin: "0" };

const footer = {
  color: "#52525B",
  fontSize: "10px",
  textAlign: "center" as const,
  marginTop: "40px",
  fontFamily: "monospace",
};