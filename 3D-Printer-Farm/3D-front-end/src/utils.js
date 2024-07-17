// utils.js
export const getImageUrl = (path) => {
  return new URL(`/assets/${path}`, import.meta.url).href;
};

// Email Service
export const sendEmail = async (emailDetails) => {
  console.log('Sending email with details:', emailDetails);

  try {
      const response = await fetch('http://localhost:5000/send-email', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailDetails),
      });

      if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.error || 'Failed to send email');
      }

      const jsonResponse = await response.json();
      console.log('Email send response:', jsonResponse);

      return jsonResponse;
  } catch (error) {
      console.error('Error sending email:', error);
      throw error;
  }
};
