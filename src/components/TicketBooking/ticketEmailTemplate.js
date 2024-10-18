import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from '@mui/material';
import axios from 'axios';
import { supabase } from 'pages/supabaseClient';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

const TicketEmail = ({ attendee, event }) => {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);


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

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const sendEmail = async () => {
    setLoading(true);
    setOpenDialog(false);

    const emailTemplate = `<!DOCTYPE html>
  <html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${eventName} - Web app Credentials</title>
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
          <h2 style="font-size: 24px; margin: 0;">Tomorrow is the most awaited day!</h2>
          <p style="font-size: 16px; margin: 10px 0;">Dear ${name},</p>
          <p style="font-size: 16px;">We are thrilled to inform you that tomorrow is the big day for ${eventName}! To make sure you're all set, here are your credentials for accessing the YarlDreamin web application. Below are your login details:</p>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px; background-color: #1e1e1e; border-top: 1px solid #dddddd; border-bottom: 1px solid #dddddd;">
          <table style="width: 100%; background-color: #ffffff; border-radius: 8px;">
            <tr>
              <td style="text-align: left; padding: 10px;">
                <p><strong>Web Application URL:</strong> <a href="https://dreamin24.seatsnaps.com" target="_blank" style="color: #1e90ff;">https://dreamin24.seatsnaps.com</a></p>
                <p><strong>Username:</strong> ${email}</p>
                <p><strong>Password:</strong> ${bookingId}</p>
              </td>

               <td style="text-align: right; width: 120px; height: 120px; padding: 10px;">
                    <img src=${qrValue} alt="QR Code" style="width: 100%; height: 100%;">
                  </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px; background-color: #333333; color: white; text-align: center; font-size: 14px;">
          <p>Please keep these credentials secure and bring them along for accessing the app during the event. We look forward to seeing you there!</p>
          <p>For any further assistance, feel free to contact us at <a href="mailto:info@seatsnaps.com" style="color: white; text-decoration: none;">info@rispit.com</a></p>
          <p>Seatsnaps : A Product of Rispit Made in Jaffna with ❤️</p>
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
            subject: `${eventName} Web Application Credentials`,
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
        setOpenSnackbar(true);
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

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

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
        <>
          <Button
            key={bookingId}
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
            disabled={loading}
            sx={{ borderRadius: '10px', color: 'white !important', width: "100%" }}
          >
            {loading ? 'Sending...' : 'Send '}
          </Button>

          {/* Confirmation Dialog */}
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
          >
            <DialogTitle>Confirm Email</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure to send the confirmation email to {name} ({email})?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="secondary">
                Cancel
              </Button>
              <Button onClick={sendEmail} color="primary" disabled={loading}>
                {loading ? 'Sending...' : 'Send'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Success Snackbar */}
          <Snackbar
            open={openSnackbar}
            onClose={handleSnackbarClose}
            message="Email sent successfully!"
            autoHideDuration={3000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          />
        </>
      )}
    </div>
  );
};


TicketEmail.propTypes = {
  attendee: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    // phoneNumber: PropTypes.string.isRequired,
    // tShirtSize: PropTypes.string.isRequired,
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
