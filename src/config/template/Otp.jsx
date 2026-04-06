import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Section,
} from "@react-email/components";

export default function OtpEmail({ otp }) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f6f9fc", padding: "20px" }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            padding: "30px",
            borderRadius: "8px",
            textAlign: "center",
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          <Heading style={{ color: "#333" }}>
            Verify Your Email
          </Heading>

          <Text style={{ fontSize: "16px", color: "#555" }}>
            Your One Time Password (OTP) is:
          </Text>

          <Section
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              letterSpacing: "6px",
              margin: "20px 0",
              color: "#2563eb",
            }}
          >
            {otp}
          </Section>

          <Text style={{ fontSize: "14px", color: "#777" }}>
            This OTP will expire in 10 minutes.  
            If you didn’t request this, please ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}