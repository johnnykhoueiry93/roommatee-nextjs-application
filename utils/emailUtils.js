

const SibApiV3Sdk = require('@getbrevo/brevo');
let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;
const htmlContent = require('../emailTemplate/template')
const verificationCodeHtml = require('../emailTemplate/verificationCode')
const resetPassword = require('../emailTemplate/resetPassword')
const newSupportTicketNotification = require('../emailTemplate/newSupportTicketNotification')
const logger = require("./logger");

//@ts-ignore
async function sendEmailVerificationCode(verificationCode, firstName, emailAddress) {
  logger.info(`[${emailAddress}] - Sennding the verification code to email address: ${emailAddress}`)
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); 

  sendSmtpEmail.subject = "Your Roomatee Verification Code";
  sendSmtpEmail.htmlContent = verificationCodeHtml.replace('{{verificationCode}}',verificationCode);
  sendSmtpEmail.sender = {"name":"Roomatee","email":"welcome@roomatee.com"};
  sendSmtpEmail.to = [{"email":emailAddress,"name":firstName}];
  sendSmtpEmail.replyTo = {"email":"replyto@domain.com"};
  sendSmtpEmail.params = {"parameter":"My param value","subject":"Your Roomate Verification Code"};
  
  //@ts-ignore
  apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
    logger.info(`[${emailAddress}] - Email verification code sent successfully`);

    //@ts-ignore
  }, function(error) {
    logger.error(`[${emailAddress}] - Email verification code failed to send. Root Cause: ` + error);;
  });
}

//@ts-ignore
function sendEmailResetPassword(emailAddress, newTempPassword, firstName, lastName) {
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); 

  sendSmtpEmail.subject = "Roomatee Password Reset";
  sendSmtpEmail.htmlContent = resetPassword.replace('{{newTempPassword}}',newTempPassword).replace('{{firstName}}', firstName);
  sendSmtpEmail.sender = {"name":"Roomatee","email":"support@roomatee.com"};
  sendSmtpEmail.to = [{"email":emailAddress,"name":firstName + " " +lastName}];
  sendSmtpEmail.replyTo = {"email":"support@roomatee.com","name":"Roomatee"};

  //@ts-ignore
  apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
    logger.info(`[${emailAddress}] - [/api/resetPassword] - Reset email was sent successfully`);

    //@ts-ignore
  }, function(error) {
    logger.error(`[${emailAddress}] - [/api/resetPassword] - Reset email failed to send. Root Cause: ` + error);;
  });
}


//emailModule.sendNewSupportTicketCreated(emailAddress, firstName, caseId);
//@ts-ignore
function sendNewSupportTicketCreated(emailAddress, firstName, caseId) {
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); 

  sendSmtpEmail.subject = "Roomatee - New Support Ticket Received";
  sendSmtpEmail.htmlContent = newSupportTicketNotification.replace('{{ticketId}}',caseId).replace('{{firstName}}', firstName);
  sendSmtpEmail.sender = {"name":"Roomatee","email":"support@roomatee.com"};
  sendSmtpEmail.to = [{"email":emailAddress,"name":firstName}];
  sendSmtpEmail.replyTo = {"email":"support@roomatee.com","name":"Roomatee"};

  //@ts-ignore
  apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
    logger.info(`[${emailAddress}] - New support ticket notification was sent successfully`);

    //@ts-ignore
  }, function(error) {
    logger.error(`[${emailAddress}] - Failed to send new support ticket. Root Cause: ` + error);;
  });
}

module.exports = {sendEmailVerificationCode , sendEmailResetPassword, sendNewSupportTicketCreated};