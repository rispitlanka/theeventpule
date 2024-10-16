import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const TicketEmail = ({ attendee, event }) => {
  const {
    name,
    email,
    // phoneNumber,
    // tShirtSize,
    // ticketType,
    bookingId,
  } = attendee;

  const {
    eventName,
    location,
    date,
    time,
    bannerUrl,
    qrValue,
  } = event;

  const copyTemplateToClipboard = () => {


    const template = `
      <!DOCTYPE html>
      <html lang="en" dir="ltr">
      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${eventName} Ticket Confirmation</title>

         <!-- Adding image as a favicon -->
  <link rel="icon" href="https://i.ibb.co/HTV1RcV/seatsnaps-logo.png" type="image/png">
  
  <!-- Adding image as an OpenGraph meta image for sharing -->
  <meta property="og:image" content="https://i.ibb.co/HTV1RcV/seatsnaps-logo.png">
      </head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #1e1e1e; display: flex; justify-content: center; align-items: center; height: 100vh; box-sizing: border-box; border-radius: 10px;">
        <div style="max-width: 600px; width: 100%; margin: 0 auto; background-color: #1e1e1e; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); padding: 20px;">
          
          <div style="background-color: #ffffff; padding-top: 20px; text-align: center;">
            <img src="https://i.ibb.co/HTV1RcV/seatsnaps-logo.png" alt="Seatsnaps Logo" style="width: 150px;">
          </div>

          <div style="text-align: center;">
            <img src="${bannerUrl}" alt="${eventName} Banner" style="width: 100%; max-width: 600px;">
          </div>

          <div style="padding: 20px; background-color: #1e1e1e; text-align: center; color: #ffffff;">
            <h2 style="font-size: 24px; margin: 0;">Dear ${name},</h2>
            <p style="font-size: 16px; margin: 10px 0;">Your ticket for ${eventName} is <strong>Confirmed!</strong> 🎉</p>
          </div>

          <div style="padding: 20px; background-color: #1e1e1e; border-top: 1px solid #dddddd; border-bottom: 1px solid #dddddd;">
            <p style="color:#ffffff; text-align:center;">Please show this ticket with the QR code at the entrance of the event</p>
            <div style="display: flex; justify-content: space-between; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
              <div style="text-align: left;">
                <p>Booking ID - ${bookingId}</p>
                <h3 style="margin: 0;">${eventName}</h3>
                <p>${location}, Sri Lanka</p>
                <p>${time} | ${date}</p>
               
              </div>
              <div style="text-align: right;">
                <img src=${qrValue} alt="QR Code" style="width: 100%; height: 100%;">
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; background-color: #333333; color: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
              <div style="text-align: left;">
                <p><strong>Name: </strong>${name}</p>
                <p><strong>Email:</strong>${email}</p>
               
              </div>
            
            </div>
          </div>

          <div style="padding: 20px; text-align: center; background-color: #333333; color: white; font-size: 14px;">
            <p>Seatsnaps : A Product of Rispit Made in Jaffna with ❤️</p>
            <p>For any further assistance or questions: <a href="mailto:info@seatsnaps.com" style="color: white; text-decoration: none;">info@rispit.com</a></p>
             <a href="https://www.facebook.com/rispitc" target="_blank">
                <img src="https://i.ibb.co/HYXFkjf/3463465-facebook-media-network-social-icon-copy.png" alt="Facebook" style="width: 24px; height: 24px;">
            </a>
          </div>
        </div>
      </body>
      </html>
    `;

    navigator.clipboard.writeText(template);
    alert('Template copied to clipboard!');
  };

  return (
    <div>
      <Button
        key={bookingId}
        variant="contained"
        color="primary"
        onClick={copyTemplateToClipboard}
        sx={{ borderRadius: '10px', color: 'white !important', width: "100%" }}
      >
        Copy
      </Button>
    </div>
  );
};


TicketEmail.propTypes = {
  attendee: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    tShirtSize: PropTypes.string.isRequired,
    ticketType: PropTypes.string.isRequired,
    bookingId: PropTypes.string.isRequired,
  }).isRequired,
  event: PropTypes.shape({
    eventName: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    bannerUrl: PropTypes.string.isRequired,
    qrValue: PropTypes.string.isRequired,
  }).isRequired,
};

export default TicketEmail;
