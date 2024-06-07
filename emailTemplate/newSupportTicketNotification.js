const newSupportTicketNotification = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">

  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
  </head>

  <body style="background-color:#ffffff;font-family:HelveticaNeue,Helvetica,Arial,sans-serif">
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:460px;background-color:#ffffff;border:1px solid #eee;border-radius:5px;box-shadow:0 5px 10px rgba(20,50,70,.2);margin-top:20px;margin:0 auto;padding:100px 0 100px">
      <tbody>
        <tr style="width:100%">
          <td><img alt="Plaid" height="88" src="https://react-email-demo-7s5r0trkn-resend.vercel.app/static/plaid-logo.png" style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto" width="212" />
            <h1 style="text-align:center">Roomatee Support</h1>
			<h2 style="text-align:center">Hey {{firstName}}!</h2>
            <h2 style="color:#000;display:inline-block;font-family:HelveticaNeue-Medium,Helvetica,Arial,sans-serif;font-size:20px;font-weight:500;line-height:24px;margin-bottom:0;margin-top:0;text-align:center;padding-left:10px;padding-right:10px">We have received your support ticket and someone will reach out to you shortly!</h2>
			<p style="text-align:center">This is your ticket number for reference</p>
			<h3 style="text-align:center">Ticket# {{ticketId}}</h3>
             </td>
        </tr>
      </tbody>
    </table>
    <p style="font-size:12px;line-height:23px;margin:0;color:#000;font-weight:800;letter-spacing:0;margin-top:20px;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;text-align:center;text-transform:uppercase">Roomatee ❤️</p>
  </body>

</html>`;

module.exports = newSupportTicketNotification;
