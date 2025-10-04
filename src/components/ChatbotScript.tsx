import Script from 'next/script';

export default function ChatbotScript() {
  return (
    <>
      <Script
        id="chatbot-config"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.chtlConfig = { chatbotId: "9938612681" };`,
        }}
      />
      <Script
        id="chatbot-script"
        strategy="afterInteractive"
        data-id="9938612681"
        src="https://chatling.ai/js/embed.js"
      />

      {/* <Script
        id="chatbot-config"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.chtlConfig = { chatbotId: "6835644195" };`,
        }}
      />
      <Script
        id="chatbot-script"
        strategy="afterInteractive"
        data-id="6835644195"
        src="https://chatling.ai/js/embed.js"
      /> */}
    </>
  );
} 

