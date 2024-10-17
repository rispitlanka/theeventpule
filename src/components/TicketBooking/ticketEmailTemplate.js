import { Button } from '@mui/material';
import axios from 'axios';
import { supabase } from 'pages/supabaseClient';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

const TicketEmail = ({ attendee, event }) => {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const sendEmail = async (e) => {

    e.preventDefault()
    setLoading(true);

    const emailTemplate = `<!DOCTYPE html>
      <html lang="en" dir="ltr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${eventName} Ticket Confirmation</title>
        <link rel="icon" href="https://i.ibb.co/HTV1RcV/seatsnaps-logo.png" type="image/png">
      </head>
      <body style="margin: 0; padding: 0; background-color: #1e1e1e; display: flex; justify-content: center; align-items: center;">
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #1e1e1e; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background-color: #ffffff; text-align: center; padding: 20px;">
              <img src="https://i.ibb.co/HTV1RcV/seatsnaps-logo.png" alt="Seatsnaps Logo" style="width: 150px;">
            </td>
          </tr>
          <tr>
            <td style="text-align: center;">
              <img src="${bannerUrl}" alt="${eventName} Banner" style="width: 100%; max-width: 600px;">
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; background-color: #1e1e1e; text-align: center; color: #ffffff;">
              <h2 style="font-size: 24px; margin: 0;">Dear ${name},</h2>
              <p style="font-size: 16px; margin: 10px 0;">Your ticket for ${eventName} is <strong>Confirmed!</strong> 🎉</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; background-color: #1e1e1e; border-top: 1px solid #dddddd; border-bottom: 1px solid #dddddd;">
              <p style="color:#ffffff; text-align:center;">Please show this ticket with the QR code at the entrance of the event</p>
              <table style="width: 100%; background-color: #ffffff; border-radius: 8px;">
                <tr>
                  <td style="text-align: left; padding: 10px;">
                    <p>Booking ID - ${bookingId}</p>
                    <h3 style="margin: 0;">${eventName}</h3>
                    <p>${location}, Sri Lanka</p>
                    <p>${time} | ${date}</p>
                  </td>
                  <td style="text-align: right; width: 120px; height: 120px; padding: 10px;">
                    <img src=${qrValue} alt="QR Code" style="width: 100%; height: 100%;">
                  </td>
                </tr>
              </table>
              <div style="display: flex; justify-content: space-between; background-color: #333333; color: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <div style="text-align: left;">
                  <p><strong>Name: </strong>${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; text-align: center; background-color: #333333; color: white; font-size: 14px;">
              <p>Seatsnaps : A Product of Rispit Made in Jaffna with ❤️</p>
              <p>For any further assistance or questions: <a href="mailto:info@seatsnaps.com" style="color: white; text-decoration: none;">info@rispit.com</a></p>
              <a href="https://www.facebook.com/rispitc" target="_blank">
                <img src="https://i.ibb.co/HYXFkjf/3463465-facebook-media-network-social-icon-copy.png" alt="Facebook" style="width: 24px; height: 24px;">
              </a>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    try {



      const response = await axios.post('https://dreamin24.seatsnaps.com/api/send-email', {
        emails: [
          {
            recipient: email,
            subject: `${eventName} Ticket Confirmation`,
            template: emailTemplate,
          },
        ],
      });

      if (response.status === 200) {

        const { error } = await supabase
          .from('tickets_events')
          .update({ isEmailSent: true })
          .eq('referenceId', bookingId);

        if (error) {
          throw new Error(error.message);
        }


        setIsEmailSent(true);
      } else {
        alert('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('There was an issue sending the email.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchEmailStatus = async () => {
      const { data, error } = await supabase
        .from('tickets_events')
        .select('isEmailSent')
        .eq('referenceId', bookingId)
        .single();

      if (error) {
        console.error('Error fetching email status:', error);
      } else if (data) {
        setIsEmailSent(data.isEmailSent);
      }
    };

    fetchEmailStatus();
  }, [bookingId]);

  return (
    <div>
      {isEmailSent ? (
        <Button
          key={bookingId}
          variant="contained"
          color="success"
          disabled
          sx={{ borderRadius: '10px', color: 'gray !important', width: "100%" }}
        >
          ✔ Sent
        </Button>
      ) : (
        <Button
          key={bookingId}
          variant="contained"
          color="primary"
          onClick={sendEmail}
          disabled={loading}
          sx={{ borderRadius: '10px', color: 'white !important', width: "100%" }}
        >
          {loading ? 'Sending...' : 'Send '}
        </Button>
      )}
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
