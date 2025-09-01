import { useState } from "react";

const WhatsAppQR = () => {
  const [phone, setPhone] = useState("15551234567");
  const [message, setMessage] = useState("Hi! I'd like to chat about your business needs.");
  const [qrUrl, setQrUrl] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [showResult, setShowResult] = useState(false);

  const generateQR = () => {
    const trimmedPhone = phone.trim();
    const trimmedMessage = message.trim();
    
    if (!trimmedPhone) {
      alert('Please enter a phone number');
      return;
    }
    
    if (!/^\d+$/.test(trimmedPhone)) {
      alert('Phone number must contain only digits');
      return;
    }
    
    // WhatsApp link
    const whatsappLink = `https://wa.me/${trimmedPhone}`;
    const whatsappLinkWithText = trimmedMessage 
      ? `${whatsappLink}?text=${encodeURIComponent(trimmedMessage)}` 
      : whatsappLink;

    // QR Code API (QuickChart)
    const qrImageUrl = `https://quickchart.io/qr?text=${encodeURIComponent(whatsappLinkWithText)}&size=256`;

    setQrUrl(qrImageUrl);
    setWhatsappUrl(whatsappLinkWithText);
    setShowResult(true);
  };
  
  const clearQR = () => {
    setShowResult(false);
    setPhone('');
    setMessage('');
    setQrUrl('');
    setWhatsappUrl('');
  };
  
  const testUSNumber = () => {
    setPhone('15551234567');
    setMessage('Hi! I\'m interested in your services.');
    setTimeout(generateQR, 100);
  };
  
  const testUKNumber = () => {
    setPhone('447911123456');
    setMessage('Hello! Can we discuss business opportunities?');
    setTimeout(generateQR, 100);
  };
  
  const testSingaporeNumber = () => {
    setPhone('6591234567');
    setMessage('Hi there! I\'d like to learn more about your company.');
    setTimeout(generateQR, 100);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>📱 WhatsApp QR Code Generator</h1>
        <p>Generate QR codes for instant WhatsApp communication with your customers</p>
      </div>
      
      <div className="whatsapp-instructions">
        <h3>How to use:</h3>
        <ol>
          <li>Enter a phone number in international format (e.g., 15551234567)</li>
          <li>Optionally add a pre-filled message</li>
          <li>Click "Generate QR Code" to create a scannable QR code</li>
          <li>Scan the QR code with WhatsApp to start a chat</li>
        </ol>
      </div>

      <div className="table-container">
        <h2>Generate WhatsApp QR Code</h2>
        
        <div className="form-group">
          <label htmlFor="phone">Phone Number (International Format):</label>
          <input 
            type="text" 
            id="phone" 
            className="whatsapp-input"
            placeholder="15551234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Pre-filled Message (Optional):</label>
          <textarea 
            id="message" 
            className="whatsapp-textarea"
            placeholder="Hi! I'd like to chat about your business needs."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
        </div>
        
        <div className="whatsapp-button-group">
          <button onClick={generateQR} className="whatsapp-btn primary">
            Generate QR Code
          </button>
          <button onClick={clearQR} className="whatsapp-btn secondary">
            Clear
          </button>
        </div>
      </div>

      {showResult && (
        <div className="table-container">
          <h2>Generated QR Code</h2>
          <div className="whatsapp-qr-result">
            <div className="qr-code-display">
              <img src={qrUrl} alt="WhatsApp QR Code" className="qr-image" />
            </div>
            <div className="whatsapp-link-display">
              <strong>WhatsApp Link:</strong><br />
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="whatsapp-link">
                {whatsappUrl}
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="table-container">
        <h2>Test Different Scenarios</h2>
        <div className="whatsapp-button-group">
          <button onClick={testUSNumber} className="whatsapp-btn test">
            Test US Number
          </button>
          <button onClick={testUKNumber} className="whatsapp-btn test">
            Test UK Number
          </button>
          <button onClick={testSingaporeNumber} className="whatsapp-btn test">
            Test Singapore Number
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppQR;
